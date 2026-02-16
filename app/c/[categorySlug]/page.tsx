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

const CATEGORY_NAME: Record<string, string> = {
  work: "工作",
  education: "教育",
  medical: "医疗",
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
  const title = CATEGORY_NAME[categorySlug] ?? posts[0]?.category ?? categorySlug;

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="page-divider">
        <div className="site-shell py-8">
          <Link href="/" className="inline-flex text-sm hover:text-[#ff0000]">
            返回首页
          </Link>
          <h1 className="title-kaiti mt-5 text-5xl">{title}</h1>
        </div>
      </header>

      <section className="site-shell py-8">
        {posts.length === 0 ? (
          <div className="border-2 border-black p-5 text-sm">该栏目暂时没有文章。</div>
        ) : (
          <ul className="space-y-4">
            {posts.map(({ slug, title: postTitle, categorySlug: cSlug, updated }) => (
              <li key={slug}>
                <Link
                  href={`/c/${cSlug}/${slug}`}
                  className="block border-2 border-black bg-white p-5 transition-colors hover:bg-black hover:text-white"
                >
                  <h2 className="title-kaiti text-3xl">{postTitle}</h2>
                  <div className="mt-3 text-sm">{updated ? `更新：${updated}` : "更新：未标注"}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
