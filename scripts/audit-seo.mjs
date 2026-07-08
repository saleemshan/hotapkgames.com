import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
let inventory = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const parsed = matter(content);
  const data = parsed.data;
  
  // Clean content to count words
  const textContent = parsed.content.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(' ').filter(w => w.length > 0).length;
  
  // Try to determine primary brand/topic from slug or title
  const slug = file.replace(contentDir, '').replace('.mdx', '').replace(/^\/+/, '');
  let brand = data.primaryKeyword || data.brand || '';
  if (!brand) {
    const slugParts = slug.split('/');
    brand = slugParts[slugParts.length - 1].replace('-game', '').replace('-app', '').replace(/-/g, ' ');
  }
  
  // Keyword density (simple approximation based on brand name)
  let density = '0%';
  if (brand && wordCount > 0) {
    const brandRegex = new RegExp(brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = textContent.match(brandRegex);
    const count = matches ? matches.length : 0;
    density = ((count / wordCount) * 100).toFixed(2) + '%';
  }

  inventory.push({
    file: slug,
    title: data.title || 'Missing Title',
    brand: brand,
    wordCount: wordCount,
    density: density,
    keys: Object.keys(data).join(', ')
  });
});

let markdown = `# MDX Blog Inventory & SEO Audit\n\n`;
markdown += `| Slug | Title | Assumed Brand/Topic | Word Count | Keyword Density | Frontmatter Keys |\n`;
markdown += `|---|---|---|---|---|---|\n`;

inventory.forEach(item => {
  markdown += `| ${item.file} | ${item.title} | ${item.brand} | ${item.wordCount} | ${item.density} | ${item.keys} |\n`;
});

fs.writeFileSync('audit_output.md', markdown);
console.log('Audit complete. Wrote to audit_output.md');
