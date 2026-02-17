import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import LaborContractTemplateClient from "./labor-contract-template-client";
import { getAllPostsMeta, getPostHtml } from "../../../../lib/content";

type StaticParam = { categorySlug: string; slug: string };

function formatLawBlocks(raw: string) {
  const lines = raw.replace(/\r/g, "").split("\n").map((line) => line.trim()).filter(Boolean);

  return lines.map((line, index) => {
    if (index === 0) {
      return { type: "mainTitle" as const, text: line, key: `mt-${index}` };
    }

    if (/^第[一二三四五六七八九十百千万零〇0-9]+章/.test(line)) {
      return { type: "chapter" as const, text: line, key: `ch-${index}` };
    }

    if (/^第[一二三四五六七八九十百千万零〇0-9]+条$/.test(line)) {
      return { type: "article" as const, text: line, key: `ar-${index}` };
    }

    return { type: "paragraph" as const, text: line, key: `p-${index}` };
  });
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

  let lawBlocks: ReturnType<typeof formatLawBlocks> = [];
  if (isLaborLawPage) {
    const lawPath = path.join(process.cwd(), "content", "work", "labor-law-fulltext.txt");
    const rawLaw = await readFile(lawPath, "utf-8");
    lawBlocks = formatLawBlocks(rawLaw);
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
            <article className="law-content" aria-label="劳动法全文">
              {lawBlocks.map((block) => {
                if (block.type === "mainTitle") {
                  return (
                    <h2 key={block.key} className="law-main-title">
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === "chapter") {
                  return (
                    <h3 key={block.key} className="law-chapter-title">
                      {block.text}
                    </h3>
                  );
                }

                if (block.type === "article") {
                  return (
                    <h4 key={block.key} className="law-article-title">
                      {block.text}
                    </h4>
                  );
                }

                return (
                  <p key={block.key} className="law-paragraph">
                    {block.text}
                  </p>
                );
              })}
            </article>
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
