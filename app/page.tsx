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
    <main className="site-main home-main">
      <div className="container">
        <header className="home-head">
          <h1 className="home-title">公天下</h1>
          <p className="home-subtitle">便民信息与服务</p>
          <div className="home-rule" aria-hidden="true" />
        </header>

        <h2 className="home-section-title">栏目导航</h2>

        <section aria-label="栏目入口" className="category-grid">
          {categories.map(({ categorySlug, name }) => (
            <Link key={categorySlug} href={`/c/${categorySlug}`} className="category-entry">
              <h3 className="category-name">{name}</h3>
              <p className="category-desc">{CATEGORY_SUBTITLE[categorySlug] ?? "便民信息"}</p>
              <div className="category-entry-foot">
                <span>进入栏目</span>
                <span className="entry-mark" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
