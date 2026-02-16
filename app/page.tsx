import Link from "next/link";
import { getCategories } from "../lib/content";

type CategoryLite = {
  categorySlug: string;
  name: string;
};

const CATEGORY_SUBTITLE: Record<string, string> = {
  work: "务工与合同",
  education: "学习与进修",
  medical: "就医与健康",
};

export default function HomePage() {
  const categories = getCategories() as CategoryLite[];

  return (
    <main className="site-main">
      <div className="container">
        <header className="home-header">
          <h1 className="home-title">公天下</h1>
          <p className="home-subtitle">便民信息与服务</p>
        </header>

        <section aria-label="栏目入口">
          <div className="category-grid">
            {categories.map(({ categorySlug, name }) => (
              <Link key={categorySlug} href={`/c/${categorySlug}`} className="category-entry">
                <h2 className="category-name">{name}</h2>
                <p className="category-desc">{CATEGORY_SUBTITLE[categorySlug] ?? "便民信息"}</p>
                <div className="entry-accent" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
