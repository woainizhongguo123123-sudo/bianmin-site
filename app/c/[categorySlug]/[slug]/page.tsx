import Link from "next/link";
import { getAllPostsMeta, getPostHtml } from "../../../../lib/content";

type StaticParam = { categorySlug: string; slug: string };

const CATEGORY_NAME: Record<string, string> = {
  work: "工作",
  education: "教育",
  medical: "医疗",
};

export function generateStaticParams(): StaticParam[] {
  const list = getAllPostsMeta() as StaticParam[];
  return list.map(({ categorySlug, slug }) => ({ categorySlug, slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ categorySlug: string; slug: string }>;
}) {
  const { categorySlug, slug } = await params;
  const { meta, contentHtml } = await getPostHtml(categorySlug, slug);
  const categoryTitle = CATEGORY_NAME[categorySlug] ?? meta.category ?? categorySlug;

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="page-divider">
        <div className="site-shell py-8">
          <Link href={`/c/${categorySlug}`} className="inline-flex text-sm hover:text-[#ff0000]">
            返回栏目
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="badge">{categoryTitle}</span>
            <span className="text-sm">{meta.updated ? `更新：${meta.updated}` : "更新：未标注"}</span>
          </div>
          <h1 className="title-kaiti mt-4 text-4xl leading-tight sm:text-5xl">{meta.title}</h1>
        </div>
      </header>

      <article className="site-shell py-10">
        <div className="border-2 border-black p-6 sm:p-8">
          <div className="article-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </article>
    </main>
  );
}
