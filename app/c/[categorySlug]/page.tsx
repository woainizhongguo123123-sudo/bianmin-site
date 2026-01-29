import Link from "next/link";
import { getCategories, getPostsByCategory } from "../../../lib/content";

export function generateStaticParams() {
  return getCategories().map((c) => ({ categorySlug: c.categorySlug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }> | { categorySlug: string };
}) {
  const p = await Promise.resolve(params);
  const categorySlug = p.categorySlug;

  const posts = getPostsByCategory(categorySlug);
  const title = posts[0]?.category ?? categorySlug;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/" className="text-sm text-slate-600 hover:underline">
        ← 返回首页
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>

      {posts.length === 0 ? (
        <div className="mt-6 rounded-xl border bg-white p-5 text-sm text-slate-600">
          该栏目暂无条目。请检查：
          <code className="mx-1 rounded bg-slate-50 px-1">content/{categorySlug}</code>
          下是否存在 <code className="mx-1 rounded bg-slate-50 px-1">.md</code> 文件。
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {posts.map((p) => (
            <li key={p.slug} className="rounded-xl border bg-white p-5 hover:bg-slate-50">
              <Link
                href={`/c/${p.categorySlug}/${p.slug}`}
                className="text-base font-semibold text-slate-900 hover:underline"
              >
                {p.title}
              </Link>
              <div className="mt-1 text-xs text-slate-500">
                {p.updated ? `更新：${p.updated}` : "更新：未标注"}
              </div>
              {p.summary ? <p className="mt-2 text-sm text-slate-600">{p.summary}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
