"use client";

import { useEffect } from "react";

export default function LearningResourcesClient() {
  useEffect(() => {
    // 方法1：添加内联样式标签（最可靠）
    const style = document.createElement('style');
    style.textContent = `
      /* 学习资源导航页面专用样式 */
      .site-root:has(.learning-resources-fullpage) .global-header,
      .site-root:has(.learning-resources-fullpage) .site-topline,
      .site-root:has(.learning-resources-fullpage) .global-contact {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
      }
      
      .site-root:has(.learning-resources-fullpage) .learning-resources-header {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
        margin: 0 !important;
        padding: 30px 20px !important;
        background: #c00000 !important;
        border-radius: 0 !important;
      }
      
      .site-root:has(.learning-resources-fullpage) .learning-resources-fullpage .resources-grid-enhanced {
        padding-top: 120px !important;
        margin-top: 0 !important;
      }
      
      /* 备用方案：如果:has()不支持 */
      body.learning-resources-page .global-header,
      body.learning-resources-page .site-topline,
      body.learning-resources-page .global-contact {
        display: none !important;
      }
      
      body.learning-resources-page .learning-resources-header {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);
    console.log('✅ 已添加内联样式');
    
    // 方法2：为body添加特殊类名
    document.body.classList.add('learning-resources-page');
    console.log('✅ 已添加 learning-resources-page 类到 body');
    
    // 方法3：直接设置标题栏样式（三重保障）
    const titleBar = document.querySelector('.learning-resources-header');
    if (titleBar) {
      titleBar.style.position = 'fixed';
      titleBar.style.top = '0';
      titleBar.style.left = '0';
      titleBar.style.width = '100%';
      titleBar.style.zIndex = '9999';
      titleBar.style.margin = '0';
      titleBar.style.padding = '30px 20px';
      titleBar.style.background = '#c00000';
      titleBar.style.borderRadius = '0';
      console.log('✅ 直接设置了标题栏样式');
    }
    
    // 方法4：直接隐藏头部（三重保障）
    const header = document.querySelector('.global-header');
    const topline = document.querySelector('.site-topline');
    const contact = document.querySelector('.global-contact');
    
    if (header) {
      header.style.display = 'none';
      header.style.visibility = 'hidden';
      header.style.opacity = '0';
      header.style.height = '0';
      header.style.overflow = 'hidden';
      console.log('✅ 隐藏了 global-header');
    }
    if (topline) {
      topline.style.display = 'none';
      console.log('✅ 隐藏了 site-topline');
    }
    if (contact) {
      contact.style.display = 'none';
      console.log('✅ 隐藏了 global-contact');
    }
    
    return () => {
      document.body.classList.remove('learning-resources-page');
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return null; // 这个组件不渲染任何内容
}