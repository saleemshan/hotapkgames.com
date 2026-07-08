import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');
const registryPath = path.join(contentDir, 'keyword-registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

Object.entries(registry).forEach(([slug, kwData]) => {
  const filePath = path.join(process.cwd(), kwData.filePath);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = matter(content);
  const data = parsed.data || {};
  
  // Calculate reading time
  const textContent = parsed.content.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(' ').filter(w => w.length > 0).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)) + " min";
  
  // Clean slug: remove category prefix if present, e.g., 'games/pk1-game' -> 'pk1-game'
  const cleanSlug = slug.split('/').pop() || slug;
  
  // Determine category based on path
  let category = data.category;
  let canonicalPath = `blog/${cleanSlug}`;
  if (slug.startsWith('games/')) { category = category || 'Game Reviews'; canonicalPath = `games/${cleanSlug}`; }
  else if (slug.startsWith('apps/')) { category = category || 'APK Downloads'; canonicalPath = `apps/${cleanSlug}`; }
  else if (slug.startsWith('guides/')) { category = category || 'Guides'; canonicalPath = `guides/${cleanSlug}`; }
  
  const today = new Date().toISOString();
  
  // Create description if not present
  let desc = data.description || data.shortDescription || '';
  if (!desc) {
    desc = `Discover everything about ${kwData.primaryKeyword}. Guide, download links, and review for ${kwData.secondaryKeywords[0] || 'users in Pakistan'}.`;
  }
  if (desc.length > 160) desc = desc.substring(0, 157) + '...';

  // Construct new frontmatter
  const newFrontmatter = {
    title: data.title || `${kwData.primaryKeyword.toUpperCase()} Game APK Pakistan - Download & Review`,
    slug: cleanSlug,
    description: desc,
    date: data.date || data.publishedAt || today,
    updated: today,
    author: data.author || 'Gameistan',
    category: category,
    tags: [kwData.primaryKeyword, ...(kwData.secondaryKeywords.slice(0, 5))],
    primaryKeyword: kwData.primaryKeyword,
    secondaryKeywords: kwData.secondaryKeywords,
    semanticKeywords: kwData.semanticKeywords,
    faqSchema: true,
    howToSchema: false,
    canonical: `https://www.gameistanpro.com.pk/${canonicalPath}`,
    ogImage: data.coverImage || `/og/${cleanSlug}.png`,
    readingTime: readingTime,
    shortDescription: desc,
    publishedAt: data.date || data.publishedAt || today,
    // Preserve other original critical keys if needed, but standardize schema
    ...Object.fromEntries(
        Object.entries(data).filter(([k]) => !['title', 'slug', 'description', 'date', 'updated', 'author', 'category', 'tags', 'primaryKeyword', 'secondaryKeywords', 'semanticKeywords', 'faqSchema', 'howToSchema', 'canonical', 'ogImage', 'readingTime', 'publishedAt', 'shortDescription'].includes(k))
    )
  };

  // Build the new MDX file
  const newFileContent = matter.stringify(parsed.content, newFrontmatter);
  fs.writeFileSync(filePath, newFileContent, 'utf-8');
});

console.log(`✅ Standardized frontmatter for ${Object.keys(registry).length} files.`);
