"use client";

import { useEffect } from "react";
import LearningResourcesGrid from "./learning-resources-grid";

export default function LearningResourcesPage() {
  useEffect(() => {
    console.log('LearningResourcesPage mounted');
    
    // 添加内联样式来隐藏头部
    const style = document.createElement('style');
    style.textContent = `
      .site-root:has(.learning-resources-fullpage) .global-header,
      .site-root:has(.learning-resources-fullpage) .site-topline,
      .site-root:has(.learning-resources-fullpage) .global-contact {
        display: none !important;
      }
      
      .learning-resources-header {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 1000 !important;
      }
      
      body {
        margin: 0 !important;
        padding: 0 !important;
      }
    `;
    document.head.appendChild(style);
    
    // 备用方法：直接设置样式
    setTimeout(() => {
      const header = document.querySelector('.global-header');
      const topline = document.querySelector('.site-topline');
      const contact = document.querySelector('.global-contact');
      const titleBar = document.querySelector('.learning-resources-header');
      
      if (header) {
        header.style.display = 'none';
        console.log('隐藏了 global-header');
      }
      if (topline) {
        topline.style.display = 'none';
        console.log('隐藏了 site-topline');
      }
      if (contact) {
        contact.style.display = 'none';
        console.log('隐藏了 global-contact');
      }
      if (titleBar) {
        titleBar.style.position = 'absolute';
        titleBar.style.top = '0';
        titleBar.style.left = '0';
        titleBar.style.width = '100%';
        titleBar.style.zIndex = '1000';
        console.log('设置了标题栏绝对定位');
      }
      
      document.body.style.margin = '0';
      document.body.style.padding = '0';
    }, 100);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="learning-resources-fullpage">
      <LearningResourcesGrid />
    </div>
  );
}