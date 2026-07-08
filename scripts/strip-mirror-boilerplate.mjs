/**
 * One-time / maintenance: removes Gameistan mirror boilerplate from MDX.
 * Run: node scripts/strip-mirror-boilerplate.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const DIRS = ["content/games", "content/apps", "content/guides"];

function shouldDropLine(t) {
  const s = t.trim();
  if (!s) return false;
  const bare = s.replace(/^\*\s+/, "").replace(/^\*\*|\*\*$/g, "").trim();
  if (/^this (guide|page) mirrors\b/i.test(bare)) return true;
  if (/^this guide matches\b/i.test(bare)) return true;
  if (/primary (link|download) \(unchanged from Gameistan\)/i.test(s)) return true;
  if (/^\*\*source \(same canonical url as\b/i.test(s)) return true;
  if (/official download \(same\b/i.test(s)) return true;
  if (/^(\*\*)?official apk \(same\b/i.test(bare)) return true;
  if (/^(\*\*)?official [^\n]+ \(same\b/i.test(bare)) return true;
  return false;
}

function cleanLine(line) {
  let s = line;
  s = s.replace(/\s+This guide mirrors[\s\S]*$/i, "");
  s = s.replace(/\s+This page mirrors[\s\S]*$/i, "");
  s = s.replace(/\.\s+This page mirrors[\s\S]*$/i, "");
  s = s.replace(/\s+This guide matches[\s\S]*$/i, "");
  s = s.replace(
    /;\s*this mirrors the \[[^\]]+\]\([^)]+\)[^\n]*$/i,
    "",
  );
  s = s.replace(/\s+It mirrors the \[[^\]]+\]\([^)]+\)[^\n]*$/i, "");
  s = s.replace(/\s+\*\*It\*\* mirrors the \[[^\]]+\]\([^)]+\)[^\n]*$/i, "");
  return s;
}

function stripFrontmatterNoise(s) {
  return (
    s
      .replace(/\s*\(same as Gameistan[^)]*\)/gi, "")
      .replace(/\s*—\s*same substance as Gameistan[^.]*\.?/gi, "")
      .replace(/\bSame substance as Gameistan[^.]*\.?/gi, "")
      .replace(/\bSame link as \[Gameistan[^\]]+\]\([^)]+\):\s*/gi, "")
      .replace(/\bSame facts as Gameistan[^.]*\.?/gi, "")
  );
}

function scrubInlineMirror(s) {
  return s
    .replace(/\s*\(same as Gameistan\)\s*\.?/gi, "")
    .replace(/\s*—\s*or use the same portal as Gameistan:\s*/gi, " — ");
}

function processBody(body) {
  let pass = scrubInlineMirror(body);
  const lines = pass.split(/\r?\n/);
  const out = [];
  for (const line of lines) {
    if (shouldDropLine(line)) continue;
    out.push(cleanLine(line));
  }
  return scrubInlineMirror(out.join("\n")).replace(/\n{3,}/g, "\n\n");
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) {
    const stripped = stripFrontmatterNoise(processBody(raw));
    if (stripped !== raw) fs.writeFileSync(filePath, stripped, "utf8");
    return stripped !== raw;
  }
  const [, fm, body] = m;
  const newFm = stripFrontmatterNoise(fm);
  const newBody = processBody(body);
  const next = `---\n${newFm}\n---\n${newBody}`;
  const prev = `---\n${fm}\n---\n${body}`;
  if (next !== prev) {
    fs.writeFileSync(filePath, next, "utf8");
    return true;
  }
  return false;
}

function walk(dir, acc) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith(".mdx")) acc.push(p);
  }
}

const files = [];
for (const d of DIRS) walk(path.join(ROOT, d), files);

let n = 0;
for (const f of files.sort()) {
  if (processFile(f)) {
    console.log("updated", path.relative(ROOT, f));
    n++;
  }
}
console.log(`Done. ${n} file(s) changed.`);
