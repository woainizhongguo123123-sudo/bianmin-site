import Link from "next/link";
import { getAllPostsMeta, getCategories } from "../lib/content";

type PostMetaLite = {
  slug: string;
  title: string;
  summary?: string;
  updated?: string;
  category?: string;
  categorySlug: string;
};

type CategoryLite = {
  categorySlug: string;
  name: string;
};

const CATEGORY_DESC: Record<string, string> = {
  work: "劳动合同与灵活就业的现实建议：少踩坑、少吃亏、可执行。",
  education: "教育层级与分流路径概览；学习方法与自学资源的实用用法。",
  medical: "挂号问诊与就医避坑；面向现实困境的保健建议（仅供参考）。",
};

export default function HomePage() {
  const categories = getCategories() as CategoryLite[];
  const latest = (getAllPostsMeta() as PostMetaLite[]).slice(0, 9);

  return (
    <main className="min-h-screen bg-white">
      <div className="border-b bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-4xl font-bold tracking-wide text-slate-900">公天下</h1>
          <p className="mt-2 text-base text-slate-600">便民信息与服务</p>

          <div className="mt-5 max-w-3xl rounded-xl border bg-white p-4 text-sm leading-relaxed text-slate-700">
            <p>
              汇总日常生活中常见问题的要点与经验提示，强调“少折腾、可落地”。内容会尽量保持简明，
              <span className="font-medium">请以官方最新规定与专业意见为准</span>。
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="#categories"
              className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              查看栏目
            </a>
            <a
              href="#latest"
              className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              最近更新
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <section id="categories" className="scroll-mt-20">
          <h2 className="text-xl font-semibold text-slate-900">栏目</h2>
          <p className="mt-1 text-sm text-slate-600">以问题为导向组织内容：每条尽量做到“看完能用”。</p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ categorySlug, name }) => (
              <Link
                key={categorySlug}
                href={`/c/${categorySlug}`}
                className="group rounded-xl border bg-white p-5 hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-slate-900">{name}</div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {CATEGORY_DESC[categorySlug] ?? "进入栏目查看相关便民内容与条目。"}
                    </p>
                  </div>
                  <div className="mt-0.5 text-slate-400 group-hover:text-slate-600">→</div>
                </div>
                <div className="mt-4 text-xs text-slate-500">进入栏目查看条目</div>
              </Link>
            ))}
          </div>
        </section>

        <section id="latest" className="mt-12 scroll-mt-20">
          <h2 className="text-xl font-semibold text-slate-900">最近更新</h2>
          <p className="mt-1 text-sm text-slate-600">按更新时间倒序展示。</p>

          <ul className="mt-4 space-y-3">
            {latest.map(({ categorySlug, slug, title, updated, summary, category }) => (
              <li key={`${categorySlug}-${slug}`} className="rounded-xl border bg-white p-5 hover:bg-slate-50">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <Link
                      href={`/c/${categorySlug}/${slug}`}
                      className="block truncate text-base font-semibold text-slate-900 hover:underline"
                      title={title}
                    >
                      {title}
                    </Link>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="rounded-full border bg-slate-50 px-2 py-0.5">{category ?? categorySlug}</span>
                      <span>{updated ? `更新：${updated}` : "更新：未标注"}</span>
                    </div>

                    {summary ? <p className="mt-2 text-sm leading-relaxed text-slate-600">{summary}</p> : null}
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/c/${categorySlug}/${slug}`}
                      className="inline-flex items-center rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      查看
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-14 border-t pt-6 text-xs leading-relaxed text-slate-500">
          <p>提示：本站内容用于信息整理与经验提示，不构成法律、医疗等专业意见；请以官方渠道与专业人士建议为准。</p>
        </footer>
      </div>
    </main>
  );
}
