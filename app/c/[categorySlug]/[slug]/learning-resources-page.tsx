"use client";

import { useEffect } from "react";
import LearningResourcesGrid from "./learning-resources-grid";

export default function LearningResourcesPage() {
  useEffect(() => {
    // 为body添加特殊类名
    document.body.classList.add('learning-resources-page');
    console.log('已添加 learning-resources-page 类到 body');
    
    // 确保标题栏样式
    const titleBar = document.querySelector('.learning-resources-header');
    if (titleBar) {
      titleBar.style.position = 'absolute';
      titleBar.style.top = '0';
      titleBar.style.left = '0';
      titleBar.style.width = '100%';
      titleBar.style.zIndex = '1000';
      console.log('设置了标题栏绝对定位');
    }
    
    return () => {
      document.body.classList.remove('learning-resources-page');
    };
  }, []);

  return (
    <div className="learning-resources-fullpage">
      <LearningResourcesGrid />
    </div>
  );
}