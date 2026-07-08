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
const blogs = files.map(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const parsed = matter(content);
  return {
    file,
    content: parsed.content,
    data: parsed.data || {},
    canonical: parsed.data.canonical || '',
    tags: parsed.data.tags || [],
    primaryKeyword: parsed.data.primaryKeyword || '',
    secondaryKeywords: parsed.data.secondaryKeywords || []
  };
});

console.log('Injecting auto-internal links...');

blogs.forEach(blog => {
  if (!blog.primaryKeyword) return;
  
  let newContent = blog.content;
  let linksAdded = 0;
  
  // Find related blogs by tags (excluding self)
  const relatedBlogs = blogs.filter(b => 
    b.file !== blog.file && 
    b.tags.some(t => blog.tags.includes(t)) &&
    b.primaryKeyword
  );

  // Take top 6 related blogs to link to
  const targets = relatedBlogs.slice(0, 6);

  targets.forEach(target => {
    if (linksAdded >= 6) return;
    
    // We want to link to target.canonical using target.primaryKeyword or one of its secondaryKeywords
    const anchorTexts = [target.primaryKeyword, ...(target.secondaryKeywords || [])].filter(Boolean);
    if (!anchorTexts.length) return;

    let linked = false;
    // Try to find the anchor text in the current blog content (case insensitive, whole word)
    for (const anchor of anchorTexts) {
      if (linked) break;
      if (anchor.length < 4) continue; // Skip very short words

      // Only match if not already inside a link or heading
      const regex = new RegExp(`(?<!\\[)([\\s])(${anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})([\\s.,;!])(?!\\]|\\))`, 'i');
      
      if (regex.test(newContent)) {
        // Extract relative URL from canonical
        const targetUrl = target.canonical.replace('https://hotapkgames.com', '') || `/${target.data.slug}`;
        newContent = newContent.replace(regex, `$1[$2](${targetUrl})$3`);
        linked = true;
        linksAdded++;
      }
    }
  });

  if (linksAdded > 0) {
    const newFileContent = matter.stringify(newContent, blog.data);
    fs.writeFileSync(blog.file, newFileContent, 'utf-8');
  }
});

console.log('✅ Internal linking complete.');
