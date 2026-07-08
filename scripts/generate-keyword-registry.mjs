import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

// Helper to get all MDX files recursively
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
const registry = {};

// Helper for typo generation (Pattern 2)
function generateTypos(brand) {
  const typos = [];
  const chars = brand.split('');
  if (chars.length > 3) {
    // Replace last char with adjacent keyboard letters
    const last = chars[chars.length - 1];
    const replacements = last === 'n' ? ['m', 'b'] : last === 't' ? ['r', 'y'] : ['w', 'e'];
    replacements.forEach(r => typos.push(brand.slice(0, -1) + r));
  }
  typos.push(`${brand}.com`);
  typos.push(`${brand}.con`);
  typos.push(`${brand} .com`);
  return typos;
}

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const parsed = matter(content);
  const data = parsed.data;
  
  const slug = file.replace(contentDir, '').replace('.mdx', '').replace(/^\/+/, '');
  
  // Determine core brand name
  let brand = data.primaryKeyword || data.brand || '';
  if (!brand) {
    const slugParts = slug.split('/');
    brand = slugParts[slugParts.length - 1].replace('-game', '').replace('-app', '').replace(/-/g, '');
  }
  
  brand = brand.toLowerCase().trim();

  // Primary Keyword is guaranteed to be unique by using the brand
  // If there's a collision (unlikely with slugs), we append something
  let primaryKeyword = brand;
  let counter = 1;
  while (Object.values(registry).find(entry => entry.primaryKeyword === primaryKeyword)) {
    primaryKeyword = `${brand} ${counter}`;
    counter++;
  }

  // Generate Secondary Keywords (15-30) based on Patterns
  const secondaryKeywords = [
    // Pattern 1: Modifiers
    `${brand} win`, `${brand} game`, `${brand} app`, `${brand} login`, `${brand} download apk`,
    `${brand} register`, `${brand} real money`,
    // Pattern 2: Typos
    ...generateTypos(brand),
    // Pattern 3: Versioned
    `${brand}10`, `${brand}11`, `${brand}.com.pk`,
    // Pattern 4: Action + Platform
    `${brand} download for android`, `${brand} apk latest version`,
    // Pattern 5: Geographic
    `${brand} pakistan`, `${brand} online earning`,
    // Pattern 7: Nav
    `${brand} sign up`, `${brand} official channel`,
    // Pattern 8: Numerical/Spaced
    brand.replace(/(\d+)/, ' $1 ').trim() // e.g. 988 win
  ];

  // Uniqueify and clean secondary
  const uniqueSecondary = [...new Set(secondaryKeywords.filter(k => k && k !== primaryKeyword))].slice(0, 25);

  registry[slug] = {
    primaryKeyword,
    secondaryKeywords: uniqueSecondary,
    semanticKeywords: [
      "casino apps", "real money games", "online betting pakistan", "jazzcash withdrawal",
      "color prediction", "lottery app"
    ],
    filePath: file.replace(process.cwd(), '').replace(/^\/+/, '')
  };
});

fs.writeFileSync(path.join(contentDir, 'keyword-registry.json'), JSON.stringify(registry, null, 2));
console.log(`✅ Generated keyword registry for ${Object.keys(registry).length} files.`);
