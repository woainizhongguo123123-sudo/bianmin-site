"use client";

import { useEffect } from "react";

export default function LearningResourcesClient() {
  useEffect(() => {
    // 为body添加特殊类名
    document.body.classList.add('learning-resources-page');
    console.log('✅ 已添加 learning-resources-page 类到 body');
    
    // 直接设置标题栏样式（备用）
    const titleBar = document.querySelector('.learning-resources-header');
    if (titleBar) {
      titleBar.style.position = 'fixed';
      titleBar.style.top = '0';
      titleBar.style.left = '0';
      titleBar.style.width = '100%';
      titleBar.style.zIndex = '9999';
      console.log('✅ 直接设置了标题栏样式');
    }
    
    // 直接隐藏头部（备用）
    const header = document.querySelector('.global-header');
    const topline = document.querySelector('.site-topline');
    const contact = document.querySelector('.global-contact');
    
    if (header) {
      header.style.display = 'none';
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
    };
  }, []);

  return null; // 这个组件不渲染任何内容
}