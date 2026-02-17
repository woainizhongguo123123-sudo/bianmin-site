import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import LaborContractTemplateClient from "./labor-contract-template-client";
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

  let laborLawHtml = "";
  if (isLaborLawPage) {
    const lawPath = path.join(process.cwd(), "content", "work", "labor-law-fulltext.rendered.html");
    const raw = await readFile(lawPath, "utf-8");
    laborLawHtml = extractRenderedLawHtml(raw);
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
