import type { ReactNode } from "react";

const resources: Array<{
  title: string;
  description: string;
  href?: string;
  available: boolean;
}> = [
  {
    title: "图书馆",
    description: "海量书籍，免费下载",
    href: "https://z-library.sk",
    available: true,
  },
  {
    title: "思想补给站",
    description: "照亮人生，指引方向",
    href: "https://www.marxists.org",
    available: true,
  },
  {
    title: "游戏厅",
    description: "模拟生活，领悟现实",
    available: false,
  },
  {
    title: "新起点博物馆",
    description: "记录脚步，共享视界",
    available: false,
  },
  {
    title: "敬请期待",
    description: "敬请期待",
    available: false,
  },
  {
    title: "敬请期待",
    description: "敬请期待",
    available: false,
  },
  {
    title: "敬请期待",
    description: "敬请期待",
    available: false,
  },
  {
    title: "敬请期待",
    description: "敬请期待",
    available: false,
  },
  {
    title: "敬请期待",
    description: "敬请期待",
    available: false,
  },
];

function LearningResourcesHeader() {
  return (
    <div className="learning-resources-header">
      <h1 className="learning-resources-title">学习资源</h1>
    </div>
  );
}

type ResourceCardProps = {
  title: string;
  description: string;
  href?: string;
  available: boolean;
};

function ResourceCard({ title, description, href, available }: ResourceCardProps) {
  const content: ReactNode = (
    <div className="resource-card">
      <h3 className="resource-title">{title}</h3>
      <p className="resource-description">{description}</p>
      {!available && title !== "敬请期待" ? <p className="coming-soon">敬请期待</p> : null}
    </div>
  );

  if (!available || !href) return content;

  return (
    <a className="resource-link" href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
}

export default function LearningResourcesGrid() {
  return (
    <div className="learning-resources-fullpage">
      <LearningResourcesHeader />
      <div className="resources-grid-enhanced">
        {resources.map((resource, index) => (
          <ResourceCard key={`${resource.title}-${index}`} {...resource} />
        ))}
      </div>
    </div>
  );
}
