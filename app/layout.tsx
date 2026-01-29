import "./globals.css";

export const metadata = {
  title: "公天下｜便民信息与服务",
  description: "面向现实生活的便民信息整理平台：工作、教育、医疗等实用指引。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
