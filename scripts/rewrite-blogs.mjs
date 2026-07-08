import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GoogleGenerativeAI } from '@google/generative-ai';

// USAGE:
// 1. npm install @google/generative-ai
// 2. export GEMINI_API_KEY="your-api-key"
// 3. node scripts/rewrite-blogs.mjs

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Error: GEMINI_API_KEY environment variable not found.");
  console.log("Please export your API key and run again.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const contentDir = path.join(process.cwd(), 'content');

function getMdxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getMdxFiles(filePath));
    } else if (filePath.endsWith('.mdx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getMdxFiles(contentDir);

async function rewriteBlog(file) {
  console.log(`\nProcessing ${file}...`);
  const content = fs.readFileSync(file, 'utf-8');
  const parsed = matter(content);
  const data = parsed.data;

  const textContent = parsed.content.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(' ').filter(w => w.length > 0).length;

  if (wordCount > 1500) {
    console.log(`Skipping. Already has ${wordCount} words.`);
    return;
  }

  const primaryKw = data.primaryKeyword || "App";
  const secondaryKws = (data.secondaryKeywords || []).join(', ');

  const prompt = `
You are a senior SEO copywriter. Rewrite and expand the following blog post about "${primaryKw}".
The goal is to reach 1400-1900 words naturally. Do NOT keyword stuff.

Primary Keyword: ${primaryKw}
Secondary Keywords to weave in naturally: ${secondaryKws}

Structure Requirements:
1. Intro (Hook + primary kw in first 100 words)
2. What Is ${primaryKw}?
3. How to Download ${primaryKw} APK / Latest Version
4. How to Login / Register
5. Game Features & Real Money Play
6. For Pakistani Players (mention JazzCash, EasyPaisa, PKR)
7. Common Issues & Mirror Sites (naturally mention typos or versions as helpful info)
8. Comparison (briefly compare to similar apps)
9. Conclusion + CTA

Original Content Context:
${parsed.content.substring(0, 2000)}

Please return ONLY the markdown body content without the frontmatter block. Include markdown headings.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Save rewritten content
    const newFileContent = matter.stringify(responseText, data);
    fs.writeFileSync(file, newFileContent, 'utf-8');
    console.log(`✅ Successfully rewritten ${file}`);
  } catch (err) {
    console.error(`❌ Failed to rewrite ${file}:`, err.message);
  }
}

async function main() {
  console.log(`Found ${files.length} MDX files. Beginning rewrite process...`);
  // Process sequentially to avoid rate limits
  for (const file of files) {
    await rewriteBlog(file);
    // 5 second delay to avoid rate limits
    await new Promise(r => setTimeout(r, 5000));
  }
  console.log("\n✅ All eligible blogs rewritten.");
}

main();
