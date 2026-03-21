// 最终验证脚本
const http = require('http');

console.log('🚀 正在验证学习资源导航页面...');
console.log('等待服务器稳定...');

setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/c/education/learning-resources-navigation',
    method: 'GET',
    headers: {
      'User-Agent': 'OpenClaw-Final-Verification'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📊 状态码: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ 页面获取完成');
      console.log('📋 分析页面内容...');
      
      // 检查关键元素
      const hasGlobalHeader = data.includes('global-header');
      const hasLearningResourcesHeader = data.includes('learning-resources-header');
      const hasLearningResourcesFullpage = data.includes('learning-resources-fullpage');
      const hasClientComponent = data.includes('LearningResourcesClient');
      const hasCSSHasSelector = data.includes(':has(.learning-resources-fullpage)');
      const hasLearningResourcesPageClass = data.includes('learning-resources-page');
      
      console.log('\n🔍 检查结果:');
      console.log(`1. 是否有global-header元素: ${hasGlobalHeader ? '是' : '否'}`);
      console.log(`2. 是否有learning-resources-header元素: ${hasLearningResourcesHeader ? '是 ✅' : '否 ❌'}`);
      console.log(`3. 是否有learning-resources-fullpage元素: ${hasLearningResourcesFullpage ? '是 ✅' : '否 ❌'}`);
      console.log(`4. 是否有客户端组件: ${hasClientComponent ? '是 ✅' : '否 ❌'}`);
      console.log(`5. 是否有:has() CSS选择器: ${hasCSSHasSelector ? '是 ✅' : '否'}`);
      console.log(`6. 是否有learning-resources-page类: ${hasLearningResourcesPageClass ? '是 ✅' : '否'}`);
      
      // 检查CSS规则
      const hasHideHeaderCSS = data.includes('display: none') && data.includes('global-header');
      const hasAbsolutePositionCSS = data.includes('position:') && data.includes('learning-resources-header');
      
      console.log(`7. 是否有隐藏头部的CSS: ${hasHideHeaderCSS ? '是 ✅' : '否'}`);
      console.log(`8. 是否有绝对定位CSS: ${hasAbsolutePositionCSS ? '是 ✅' : '否'}`);
      
      console.log('\n🎯 预期效果:');
      console.log('   - 红色条栏直接顶头');
      console.log('   - 没有"四海皆兄弟"头部');
      console.log('   - 3×3匀称网格布局');
      console.log('   - 后面五个矩形框只有一行"敬请期待"');
      
      if (hasLearningResourcesHeader && hasLearningResourcesFullpage && hasClientComponent) {
        console.log('\n✨ 所有技术组件都已就位！');
        console.log('💡 请访问: http://localhost:3000/c/education/learning-resources-navigation');
        console.log('💡 清除缓存: Ctrl+Shift+Delete');
        console.log('💡 强制刷新: Ctrl+F5');
      } else {
        console.log('\n⚠️  某些技术组件缺失，需要进一步调试。');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ 请求错误:', error.message);
    console.log('💡 请确保开发服务器正在运行: npm run dev');
  });

  req.end();
}, 3000);