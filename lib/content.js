import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// ✅ 以项目根目录为基准锁定 content
const contentDir = path.join(process.cwd(), "content");

function safeSegment(input) {
  return String(input ?? "").trim().replace(/[\\/]/g, "");
}

function getAllMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...getAllMarkdownFiles(fullPath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) files.push(fullPath);
  }
  return files;
}

function filePathToMeta(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  const rel = path.relative(contentDir, filePath);
  const parts = rel.split(path.sep).filter(Boolean);

  const categorySlug = safeSegment(parts[0] ?? "");
  const filename = parts[parts.length - 1] ?? "";
  const slug = safeSegment(filename.replace(/\.md$/i, ""));

  return {
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    updated: String(data.updated ?? ""),
    category: String(data.category ?? categorySlug),
    categorySlug,
    slug,
  };
}

export function getAllPostsMeta() {
  const files = getAllMarkdownFiles(contentDir);

  const posts = files
    .map((fp) => filePathToMeta(fp))
    .filter((p) => p.categorySlug && p.slug);

  posts.sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
  return posts;
}

export function getCategories() {
  const posts = getAllPostsMeta();
  const map = new Map();

  for (const p of posts) {
    if (!map.has(p.categorySlug)) {
      map.set(p.categorySlug, { categorySlug: p.categorySlug, name: p.category });
    }
  }
  return Array.from(map.values());
}

export function getPostsByCategory(categorySlug) {
  const c = safeSegment(categorySlug);
  return getAllPostsMeta().filter((p) => p.categorySlug === c);
}

export async function getPostHtml(categorySlug, slug) {
  const c = safeSegment(categorySlug);
  const s = safeSegment(slug);

  if (!c || !s) {
    throw new Error(`getPostHtml: missing params. categorySlug=${categorySlug}, slug=${slug}`);
  }

  const filePath = path.join(contentDir, c, `${s}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Markdown file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const processed = await remark().use(html).process(content);

  return {
    meta: {
      title: String(data.title ?? s),
      summary: String(data.summary ?? ""),
      updated: String(data.updated ?? ""),
      category: String(data.category ?? c),
      categorySlug: c,
      slug: s,
    },
    contentHtml: processed.toString(),
  };
}

