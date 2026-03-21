import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import LaborContractTemplateClient from "./labor-contract-template-client";
import LearningResourcesGrid from "./learning-resources-grid";
import { getAllPostsMeta, getPostHtml } from "../../../../lib/content";

type StaticParam = { categorySlug: string; slug: string };

function extractRenderedLawHtml(source: string) {
  const style = source.match(/<style[\s\S]*?<\/style>/i)?.[0] ?? "";
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? source;
  return `${style}<div class="law-word-wrap">${body}</div>`;
}

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

  const isLaborTemplatePage = categorySlug === "work" && slug === "labor-contract-template";
  const isLaborLawPage = categorySlug === "work" && slug === "labor-law-fulltext";
  const isLearningResourcesPage = categorySlug === "education" && slug === "learning-resources-navigation";

  let laborLawHtml = "";
  if (isLaborLawPage) {
    const lawPath = path.join(process.cwd(), "content", "work", "labor-law-fulltext.rendered.html");
    const raw = await readFile(lawPath, "utf-8");
    laborLawHtml = extractRenderedLawHtml(raw);
  }

  if (isLearningResourcesPage) {
    // 为学习资源导航页面返回完全独立的HTML
    return (
      <html lang="zh-CN">
        <head>
          <title>学习资源导航 | 公天下</title>
          <meta name="description" content="学习资源导航页面" />
          <link rel="icon" href="/icon.svg?v=4" type="image/svg+xml" />
          <link rel="stylesheet" href="/_next/static/css/app/layout.css?v=1774081585228" />
          <style dangerouslySetInnerHTML={{
            __html: `
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { margin: 0; padding: 0; font-family: sans-serif; }
              .learning-resources-header {
                background: #c00000;
                padding: 30px 20px;
                text-align: center;
                width: 100%;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1000;
              }
              .learning-resources-title {
                font-family: "方正字迹-邢体草书简体", cursive;
                font-size: 2.8rem;
                color: #ffd700;
                margin: 0;
                line-height: 1;
                font-weight: normal;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
              }
              .resources-grid-enhanced {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 36px;
                max-width: 1400px;
                margin: 0 auto;
                padding: 120px 40px 60px;
              }
              @media (max-width: 1200px) {
                .resources-grid-enhanced { grid-template-columns: repeat(2, 1fr); }
              }
              @media (max-width: 768px) {
                .resources-grid-enhanced { grid-template-columns: 1fr; }
              }
            `
          }} />
        </head>
        <body>
          <div className="learning-resources-fullpage">
            <LearningResourcesGrid />
          </div>
        </body>
      </html>
    );
  }

  return (
    <main className="site-main">
      <div className="container">
        <Link href={`/c/${categorySlug}`} className="page-link">
          返回栏目
        </Link>

        <div className="post-meta-row">
          {meta.category} {meta.updated ? `更新：${meta.updated}` : "更新：未标注"}
        </div>

        <h1 className="post-title">{meta.title}</h1>
        <div className="title-accent-line" aria-hidden="true" />

        {isLaborLawPage ? (
          <section className="post-shell law-shell">
            <article className="law-rendered" aria-label="劳动法全文" dangerouslySetInnerHTML={{ __html: laborLawHtml }} />
          </section>
        ) : (
          <section className="post-shell">
            <article className="post-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </section>
        )}

        {isLaborTemplatePage ? <LaborContractTemplateClient /> : null}
      </div>
    </main>
  );
}
