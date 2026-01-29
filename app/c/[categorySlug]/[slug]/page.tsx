import Link from "next/link";
import { getAllPostsMeta, getPostHtml } from "../../../../lib/content";

export function generateStaticParams() {
  return getAllPostsMeta().map((p) => ({ categorySlug: p.categorySlug, slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ categorySlug: string; slug: string }> | { categorySlug: string; slug: string };
}) {
  const p = await Promise.resolve(params);
  const { categorySlug, slug } = p;

  const { meta, contentHtml } = await getPostHtml(categorySlug, slug);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href={`/c/${categorySlug}`} className="text-sm text-slate-600 hover:underline">
        ← 返回栏目
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-slate-900">{meta.title}</h1>
      <div className="mt-2 text-sm text-slate-500">{meta.updated ? `更新：${meta.updated}` : "更新：未标注"}</div>

      <article className="prose prose-slate mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}
