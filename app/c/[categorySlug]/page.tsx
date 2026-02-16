import Link from "next/link";
import { getCategories, getPostsByCategory } from "../../../lib/content";

type CategoryLite = { categorySlug: string };
type PostMetaLite = {
  slug: string;
  title: string;
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
    <main className="site-main">
      <div className="container">
        <nav className="top-nav" aria-label="站点导航">
          <Link href="/" className="brand">
            公天下
          </Link>
        </nav>

        <Link href="/" className="page-link">
          返回首页
        </Link>

        <header>
          <h1 className="section-title">{title}</h1>
          <div className="title-accent-line" aria-hidden="true" />
        </header>

        {posts.length === 0 ? (
          <p>该栏目暂时没有文章。</p>
        ) : (
          <ul className="gov-list">
            {posts.map(({ slug, title: postTitle, categorySlug: cSlug, updated }) => (
              <li key={slug} className="gov-item">
                <Link href={`/c/${cSlug}/${slug}`}>
                  <h2 className="gov-item-title">{postTitle}</h2>
                </Link>
                <div className="meta">{updated ? `更新：${updated}` : "更新：未标注"}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
