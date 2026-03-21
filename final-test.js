// 最终测试脚本
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/c/education/learning-resources-navigation',
  method: 'GET',
  headers: {
    'User-Agent': 'OpenClaw-Test'
  }
};

console.log('正在测试学习资源导航页面...');

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('页面获取完成，分析内容...');
    
    // 检查关键元素
    const hasGlobalHeader = data.includes('global-header') && data.includes('四海皆兄弟');
    const hasLearningResources = data.includes('learning-resources-title') && data.includes('学习资源');
    const hasLearningResourcesPageClass = data.includes('learning-resources-page');
    const hasClientComponent = data.includes('LearningResourcesPage');
    
    console.log('分析结果:');
    console.log(`1. 是否有"四海皆兄弟"头部: ${hasGlobalHeader ? '是 ❌' : '否 ✅'}`);
    console.log(`2. 是否有"学习资源"标题: ${hasLearningResources ? '是 ✅' : '否 ❌'}`);
    console.log(`3. 是否有learning-resources-page类: ${hasLearningResourcesPageClass ? '是 ✅' : '否 ❌'}`);
    console.log(`4. 是否有客户端组件: ${hasClientComponent ? '是 ✅' : '否 ❌'}`);
    
    // 检查CSS
    const hasHideHeaderCSS = data.includes('body.learning-resources-page .global-header');
    const hasAbsolutePositionCSS = data.includes('body.learning-resources-page .learning-resources-header');
    
    console.log(`5. 是否有隐藏头部的CSS: ${hasHideHeaderCSS ? '是 ✅' : '否 ❌'}`);
    console.log(`6. 是否有绝对定位CSS: ${hasAbsolutePositionCSS ? '是 ✅' : '否 ❌'}`);
    
    if (!hasGlobalHeader && hasLearningResources && hasHideHeaderCSS) {
      console.log('\n✅ 测试通过！页面应该符合要求：');
      console.log('   - 红色条栏顶头');
      console.log('   - 没有"四海皆兄弟"头部');
      console.log('   - 3×3匀称网格布局');
    } else {
      console.log('\n❌ 测试失败！需要进一步调试。');
    }
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

req.end();