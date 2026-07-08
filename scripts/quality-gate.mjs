import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');
const registryPath = path.join(contentDir, 'keyword-registry.json');

// Helper to get all MDX files
function getMdxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getMdxFiles(filePath));
    } else if (filePath.endsWith('.mdx') && !file.startsWith('_')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getMdxFiles(contentDir);
let registry = {};
if (fs.existsSync(registryPath)) {
  registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
}

const report = {
  totalBlogs: files.length,
  uniquePrimaryKw: { pass: true, duplicates: [] },
  wordCount: { pass: false, failures: [] },
  faqs: { pass: false, failures: [] },
  internalLinks: { pass: false, failures: [] },
  frontmatter: { pass: true, failures: [] },
  similarity: { pass: true, warnings: [] }
};

// 1. Unique Primary Keyword
const pkMap = new Map();
Object.values(registry).forEach(entry => {
  if (pkMap.has(entry.primaryKeyword)) {
    report.uniquePrimaryKw.pass = false;
    report.uniquePrimaryKw.duplicates.push(entry.primaryKeyword);
  } else {
    pkMap.set(entry.primaryKeyword, true);
  }
});

// Helper for similarity (Jaccard on trigrams)
function getTrigrams(text) {
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
  const trigrams = new Set();
  for (let i = 0; i < words.length - 2; i++) {
    trigrams.add(`${words[i]} ${words[i+1]} ${words[i+2]}`);
  }
  return trigrams;
}

const allContents = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const parsed = matter(content);
  const data = parsed.data || {};
  const textBody = parsed.content.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // 2. Word count >= 1400
  const words = textBody.split(/\s+/).filter(Boolean);
  if (words.length < 1400) {
    report.wordCount.pass = false;
    report.wordCount.failures.push(`${path.basename(file)} (${words.length} words)`);
  }

  // 3. FAQs >= 6
  const faqCount = Array.isArray(data.faqs) ? data.faqs.length : 0;
  if (faqCount < 6) {
    report.faqs.pass = false;
    report.faqs.failures.push(`${path.basename(file)} (${faqCount} FAQs)`);
  }

  // 4. Internal Links 4-8
  const links = parsed.content.match(/\]\(\/(blog|games|apps|guides)\/[^)]+\)/g) || [];
  if (links.length < 4 || links.length > 8) {
    report.internalLinks.pass = false;
    report.internalLinks.failures.push(`${path.basename(file)} (${links.length} links)`);
  }

  // 5. Frontmatter Fields
  const required = ['title', 'slug', 'description', 'primaryKeyword', 'canonical'];
  const missing = required.filter(k => !data[k]);
  if (missing.length > 0) {
    report.frontmatter.pass = false;
    report.frontmatter.failures.push(`${path.basename(file)} missing: ${missing.join(', ')}`);
  }

  // Prepare for similarity check
  allContents.push({ file: path.basename(file), trigrams: getTrigrams(textBody) });
});

// Calculate similarity across all pairs (limit to avoid O(N^2) explosion if too many)
for (let i = 0; i < allContents.length; i++) {
  for (let j = i + 1; j < allContents.length; j++) {
    const a = allContents[i].trigrams;
    const b = allContents[j].trigrams;
    if (a.size === 0 || b.size === 0) continue;
    
    let intersection = 0;
    for (const tri of a) {
      if (b.has(tri)) intersection++;
    }
    const union = a.size + b.size - intersection;
    const similarity = intersection / union;
    
    if (similarity > 0.3) {
      report.similarity.pass = false;
      report.similarity.warnings.push(`${allContents[i].file} & ${allContents[j].file} (${(similarity*100).toFixed(1)}% similar)`);
    }
  }
}

// Generate Markdown Output
let md = `# SEO Quality Gate Report\n\n`;
md += `**Total Blogs Analyzed:** ${report.totalBlogs}\n\n`;

md += `## 1. Unique Primary Keyword: ${report.uniquePrimaryKw.pass ? '✅ PASS' : '❌ FAIL'}\n`;
if (!report.uniquePrimaryKw.pass) md += `- Duplicates: ${report.uniquePrimaryKw.duplicates.join(', ')}\n`;

md += `\n## 2. All Frontmatter Populated: ${report.frontmatter.pass ? '✅ PASS' : '❌ FAIL'}\n`;
if (!report.frontmatter.pass) {
  md += `- Missing fields in ${report.frontmatter.failures.length} files. (Run script to auto-fix)\n`;
}

md += `\n## 3. Word Count >= 1400: ${report.wordCount.pass ? '✅ PASS' : '❌ FAIL'}\n`;
if (!report.wordCount.pass) {
  md += `- ${report.wordCount.failures.length} blogs are under 1400 words. **Action Required**: Run \`scripts/rewrite-blogs.mjs\` to expand these using LLM.\n`;
}

md += `\n## 4. FAQs >= 6: ${report.faqs.pass ? '✅ PASS' : '❌ FAIL'}\n`;
if (!report.faqs.pass) {
  md += `- ${report.faqs.failures.length} blogs have fewer than 6 FAQs. The LLM rewrite script will generate these automatically.\n`;
}

md += `\n## 5. Internal Links (4-8 per post): ${report.internalLinks.pass ? '✅ PASS' : '❌ FAIL'}\n`;
if (!report.internalLinks.pass) {
  md += `- ${report.internalLinks.failures.length} blogs do not meet the 4-8 link requirement. (Note: Running \`npm run build\` executes auto-linker, but requires sufficient content length first).\n`;
}

md += `\n## 6. Content Similarity < 30%: ${report.similarity.pass ? '✅ PASS' : '❌ FAIL'}\n`;
if (!report.similarity.pass) {
  md += `- Found ${report.similarity.warnings.length} pairs exceeding 30% trigram similarity. These need unique rewriting angles.\n`;
}

md += `\n## 7. Schema Validation & 8. Lighthouse\n`;
md += `> **Manual Verification Required:** Please run the Next.js dev server and use Google's Rich Results Test tool to validate the schemas, and Chrome DevTools to run Lighthouse for the 95+ SEO score.\n`;

fs.writeFileSync('quality_gate_report.md', md, 'utf-8');
console.log('✅ Quality gate report generated: quality_gate_report.md');
