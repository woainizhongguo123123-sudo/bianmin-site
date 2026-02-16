import type { Metadata } from "next";
import Link from "next/link";
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
      <body>
        <div className="site-root">
          <div className="site-topline" aria-hidden="true" />
          <header className="global-header">
            <div className="container global-header-inner">
              <Link href="/" className="global-brand">
                公天下
              </Link>
              <p className="global-subtitle">便民信息与服务</p>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
