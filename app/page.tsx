import Link from "next/link";
import { getCategories } from "../lib/content";

type CategoryLite = {
  categorySlug: string;
  name: string;
};

const CATEGORY_NAME: Record<string, string> = {
  work: "工作",
  education: "教育",
  medical: "医疗",
};

const CATEGORY_SUBTITLE: Record<string, string> = {
  work: "务工与合同",
  education: "学习与进修",
  medical: "就医与健康",
};

export default function HomePage() {
  const categories = getCategories() as CategoryLite[];

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="page-divider">
        <div className="site-shell py-20">
          <h1 className="title-kaiti text-center text-7xl leading-none sm:text-8xl">公天下</h1>
          <p className="mt-4 text-center text-base tracking-[0.25em] text-[#ff0000]">便民信息与服务</p>
        </div>
      </header>

      <section className="site-shell py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {categories.map(({ categorySlug, name }) => {
            const displayName = CATEGORY_NAME[categorySlug] ?? name;
            const subtitle = CATEGORY_SUBTITLE[categorySlug] ?? "便民信息";

            return (
              <Link key={categorySlug} href={`/c/${categorySlug}`} className="block-card group">
                <div className="title-kaiti text-4xl">{displayName}</div>
                <div className="mt-2 text-sm tracking-[0.16em] card-accent">{subtitle}</div>
                <div className="mt-6 text-sm">进入栏目</div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

