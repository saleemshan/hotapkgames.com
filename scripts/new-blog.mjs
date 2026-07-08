import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const contentDir = path.join(process.cwd(), 'content');
const registryPath = path.join(contentDir, 'keyword-registry.json');
const templatePath = path.join(contentDir, '_template.mdx');

let registry = {};
if (fs.existsSync(registryPath)) {
  registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
}

const templateContent = fs.readFileSync(templatePath, 'utf-8');

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log("=== Gameistan Blog Generator ===\n");

  let primaryKeyword = await askQuestion("Enter the Primary Keyword (Brand/Topic): ");
  primaryKeyword = primaryKeyword.trim().toLowerCase();

  // Check uniqueness
  const isDuplicate = Object.values(registry).some(r => r.primaryKeyword === primaryKeyword);
  if (isDuplicate) {
    console.error(`❌ Error: Primary keyword "${primaryKeyword}" already exists in the registry. Must be unique.`);
    rl.close();
    process.exit(1);
  }

  const title = await askQuestion("Enter the SEO Title (e.g. 'XYZ Game APK Pakistan - Download'): ");
  let slug = await askQuestion("Enter the URL slug (e.g. 'xyz-game'): ");
  slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const categoryPath = await askQuestion("Enter category type (games/apps/guides): ");
  
  // Create output path
  const outputPath = path.join(contentDir, categoryPath, `${slug}.mdx`);
  if (fs.existsSync(outputPath)) {
    console.error(`❌ Error: File ${outputPath} already exists.`);
    rl.close();
    process.exit(1);
  }

  const date = new Date().toISOString();
  
  // Replace tokens
  let output = templateContent
    .replace(/\{\{TITLE\}\}/g, title)
    .replace(/\{\{SLUG\}\}/g, slug)
    .replace(/\{\{DATE\}\}/g, date)
    .replace(/\{\{PRIMARY_KEYWORD\}\}/g, primaryKeyword)
    .replace(/\{\{URL_PATH\}\}/g, `${categoryPath}/${slug}`)
    .replace(/\{\{CATEGORY\}\}/g, categoryPath === 'games' ? 'Game Reviews' : categoryPath === 'apps' ? 'APK Downloads' : 'Guides')
    .replace(/\{\{DESCRIPTION\}\}/g, `Discover everything about ${primaryKeyword}. The complete guide for players in Pakistan.`);

  // Write file
  fs.writeFileSync(outputPath, output);
  
  // Update registry
  registry[`${categoryPath}/${slug}`] = {
    primaryKeyword,
    secondaryKeywords: [`${primaryKeyword} apk`, `${primaryKeyword} download`, `${primaryKeyword} login`],
    semanticKeywords: ["casino apps", "real money games", "online betting pakistan", "jazzcash withdrawal"],
    filePath: `content/${categoryPath}/${slug}.mdx`
  };
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));

  console.log(`\n✅ Blog created successfully at ${outputPath}`);
  console.log(`✅ Keyword registry updated.`);
  rl.close();
}

main();
