import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { assertIsoDate, assertSafeSegment, normalizeText, resolveWithinBase, sanitizeHtml } from "./security";

const contentDir = path.join(process.cwd(), "content");

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

  const categorySlug = assertSafeSegment(parts[0] ?? "", "categorySlug");
  const filename = parts[parts.length - 1] ?? "";
  const slug = assertSafeSegment(filename.replace(/\.md$/i, ""), "slug");
  const title = normalizeText(data.title ?? slug);
  const summary = normalizeText(data.summary ?? "");
  const updated = normalizeText(data.updated ?? "");
  const category = normalizeText(data.category ?? categorySlug);

  if (!title) {
    throw new Error(`Missing title in ${filePath}`);
  }

  if (updated) {
    assertIsoDate(updated, "updated");
  }

  return {
    title,
    summary,
    updated,
    category,
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
  const c = assertSafeSegment(categorySlug, "categorySlug");
  return getAllPostsMeta().filter((p) => p.categorySlug === c);
}

export async function getPostHtml(categorySlug, slug) {
  const c = assertSafeSegment(categorySlug, "categorySlug");
  const s = assertSafeSegment(slug, "slug");
  const filePath = resolveWithinBase(contentDir, c, `${s}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Markdown file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const title = normalizeText(data.title ?? s);
  const summary = normalizeText(data.summary ?? "");
  const updated = normalizeText(data.updated ?? "");
  const category = normalizeText(data.category ?? c);

  if (!title) {
    throw new Error(`Missing title in ${filePath}`);
  }

  if (updated) {
    assertIsoDate(updated, "updated");
  }

  const processed = await remark().use(html).process(content);

  return {
    meta: {
      title,
      summary,
      updated,
      category,
      categorySlug: c,
      slug: s,
    },
    contentHtml: sanitizeHtml(processed.toString(), {
      allowInlineStyles: true,
    }),
  };
}
