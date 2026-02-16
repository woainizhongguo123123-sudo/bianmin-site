import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "公天下 | 便民信息与服务",
  description: "围绕工作、教育、医疗的实用便民信息整理。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="site-body">{children}</body>
    </html>
  );
}
