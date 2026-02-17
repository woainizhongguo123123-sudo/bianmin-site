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

function CategoryIcon({ type }: { type: string }) {
  if (type === "work") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="entry-icon-shape">
        <path
          fill="currentColor"
          d="M19.43 12.98a7.98 7.98 0 0 0 .05-.98 7.98 7.98 0 0 0-.05-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.6 7.6 0 0 0-1.7-.98l-.38-2.65a.5.5 0 0 0-.5-.42h-4a.5.5 0 0 0-.5.42l-.38 2.65c-.61.23-1.18.55-1.7.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.03.32-.05.65-.05.98 0 .33.02.66.05.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1c.52.43 1.09.75 1.7.98l.38 2.65a.5.5 0 0 0 .5.42h4a.5.5 0 0 0 .5-.42l.38-2.65c.61-.23 1.18-.55 1.7-.98l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"
        />
      </svg>
    );
  }

  if (type === "medical") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="entry-icon-shape">
        <path fill="currentColor" d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6V4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="entry-icon-shape">
      <path
        fill="currentColor"
        d="M3 6.5C3 5.67 3.67 5 4.5 5H11v14H4.5A1.5 1.5 0 0 1 3 17.5v-11Zm9-1.5h7.5c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5H12V5Zm-7.5 2a.5.5 0 0 0-.5.5v9c0 .28.22.5.5.5H10V7H4.5Zm9.5 10h5.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H14v10Z"
      />
    </svg>
  );
}

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

        <section aria-label="栏目导航外框" className="home-nav-shell">
          <h2 className="home-section-title">栏目导航</h2>

          <div aria-label="栏目入口" className="category-grid">
            {categories.map(({ categorySlug, name }) => (
              <Link key={categorySlug} href={`/c/${categorySlug}`} className="category-entry">
                <div className="category-entry-body">
                  <div className="category-text-layer">
                    <h3 className="category-name">{name}</h3>
                    <p className="category-desc">{CATEGORY_SUBTITLE[categorySlug] ?? "便民信息"}</p>
                  </div>

                  <div className="category-icon-layer" aria-hidden="true">
                    <span className="entry-icon-circle">
                      <CategoryIcon type={categorySlug} />
                    </span>
                  </div>
                </div>

                <div className="category-entry-foot">
                  <span>进入栏目</span>
                  <span className="entry-mark" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
