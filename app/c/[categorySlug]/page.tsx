import Link from "next/link";
import { getCategories, getPostsByCategory } from "../../../lib/content";

type CategoryLite = { categorySlug: string };
type PostMetaLite = {
  slug: string;
  title: string;
  summary?: string;
  updated?: string;
  category?: string;
  categorySlug: string;
};

export function generateStaticParams() {
  return (getCategories() as CategoryLite[]).map(({ categorySlug }) => ({
    categorySlug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const posts = getPostsByCategory(categorySlug) as PostMetaLite[];
  const title = posts[0]?.category ?? categorySlug;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/" className="text-sm text-slate-600 hover:underline">
        ← 返回首页
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">选择条目查看详情（内容会持续更新与补充）。</p>

      {posts.length === 0 ? (
        <div className="mt-6 rounded-xl border bg-white p-5 text-sm text-slate-600">
          该栏目暂无条目。请检查：
          <code className="mx-1 rounded bg-slate-50 px-1">content/{categorySlug}</code>
          下是否存在 <code className="mx-1 rounded bg-slate-50 px-1">.md</code> 文件。
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {posts.map(({ slug, title, categorySlug: cSlug, updated, summary }) => (
            <li key={slug} className="rounded-xl border bg-white p-5 hover:bg-slate-50">
              <Link href={`/c/${cSlug}/${slug}`} className="text-base font-semibold text-slate-900 hover:underline">
                {title}
              </Link>

              <div className="mt-1 text-xs text-slate-500">
                {updated ? `更新：${updated}` : "更新：未标注"}
              </div>

              {summary ? <p className="mt-2 text-sm text-slate-600">{summary}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
