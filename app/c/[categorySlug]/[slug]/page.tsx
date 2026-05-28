import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import LaborContractTemplateClient from "./labor-contract-template-client";
import LearningResourcesGrid from "./learning-resources-grid";
import { getAllPostsMeta, getPostHtml } from "../../../../lib/content";
import { sanitizeHtml } from "../../../../lib/security";

type StaticParam = { categorySlug: string; slug: string };

function extractRenderedLawHtml(source: string) {
  const style = source.match(/<style[\s\S]*?<\/style>/i)?.[0] ?? "";
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? source;
  return sanitizeHtml(`${style}<div class="law-word-wrap">${body}</div>`, {
    allowStyleTags: true,
    allowInlineStyles: true,
  });
}

export function generateStaticParams(): StaticParam[] {
  const list = getAllPostsMeta() as StaticParam[]; // 已由 content 层保证字段结构
  return list.map(({ categorySlug, slug }) => ({ categorySlug, slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ categorySlug: string; slug: string }>;
}) {
  const { categorySlug, slug } = await params;

  let meta: { category: string; updated: string; title: string } | null = null;
  let contentHtml = "";
  try {
    ({ meta, contentHtml } = await getPostHtml(categorySlug, slug));
  } catch {
    notFound();
  }

  if (!meta) {
    notFound();
  }

  const isLaborTemplatePage = categorySlug === "work" && slug === "labor-contract-template";
  const isLaborLawPage = categorySlug === "work" && slug === "labor-law-fulltext";
  const isLearningResourcesPage = categorySlug === "education" && slug === "learning-resources-navigation";
  const isLaborRightsProcessPage = categorySlug === "work" && slug === "labor-rights-process";

  let laborLawHtml = "";
  if (isLaborLawPage) {
    const lawPath = path.join(process.cwd(), "content", "work", "labor-law-fulltext.rendered.html");
    const raw = await readFile(lawPath, "utf-8");
    laborLawHtml = extractRenderedLawHtml(raw);
  }

  if (isLearningResourcesPage) {
    const learningResourcesStyles = `
      .global-header,
      .site-topline,
      .global-contact {
        display: none !important;
      }

      .site-main.learning-resources-main {
        padding-top: 0 !important;
      }

      .learning-resources-header {
        margin-top: 0 !important;
      }
    `;

    return (
      <main className="site-main learning-resources-main">
        <style dangerouslySetInnerHTML={{ __html: learningResourcesStyles }} />
        <LearningResourcesGrid />
      </main>
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

        {isLaborRightsProcessPage ? (
          <div className="post-download">
            <a href="/downloads/labor-arbitration-application.doc" download="《劳动仲裁申请书》范文.doc">
              《劳动仲裁申请书》范文.doc
            </a>
          </div>
        ) : null}

        {isLaborTemplatePage ? <LaborContractTemplateClient /> : null}
      </div>
    </main>
  );
}
