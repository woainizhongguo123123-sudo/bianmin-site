const http = require('http');

console.log('🚀 正在验证学习资源导航页面修复...');
console.log('等待服务器稳定...');

setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/c/education/learning-resources-navigation',
    method: 'GET',
    headers: {
      'User-Agent': 'OpenClaw-Test/1.0'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📊 状态码: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📋 分析页面内容...');
      
      // 检查关键元素
      const hasGlobalHeader = data.includes('class="global-header"');
      const hasLearningResourcesHeader = data.includes('class="learning-resources-header"');
      const hasLearningResourcesFullpage = data.includes('class="learning-resources-fullpage"');
      const hasSiteTopline = data.includes('class="site-topline"');
      
      console.log('\n🔍 检查结果:');
      console.log(`1. 是否有global-header元素: ${hasGlobalHeader ? '是' : '否'}`);
      console.log(`2. 是否有learning-resources-header元素: ${hasLearningResourcesHeader ? '是 ✅' : '否 ❌'}`);
      console.log(`3. 是否有learning-resources-fullpage元素: ${hasLearningResourcesFullpage ? '是 ✅' : '否 ❌'}`);
      console.log(`4. 是否有site-topline元素: ${hasSiteTopline ? '是' : '否'}`);
      
      // 检查DOM结构
      const globalHeaderIndex = data.indexOf('class="global-header"');
      const learningResourcesFullpageIndex = data.indexOf('class="learning-resources-fullpage"');
      
      console.log('\n📐 DOM结构分析:');
      if (globalHeaderIndex !== -1 && learningResourcesFullpageIndex !== -1) {
        if (globalHeaderIndex < learningResourcesFullpageIndex) {
          console.log('✅ global-header 在 learning-resources-fullpage 之前（正确结构）');
        } else {
          console.log('❌ global-header 在 learning-resources-fullpage 之后（错误结构）');
        }
      }
      
      // 检查CSS类名
      const hasSiteRootHasSelector = data.includes('.site-root:has(.learning-resources-fullpage)');
      const hasLearningResourcesPageClass = data.includes('body.learning-resources-page');
      
      console.log('\n🎨 CSS检查:');
      console.log(`1. 是否有:has()选择器: ${hasSiteRootHasSelector ? '是 ✅' : '否'}`);
      console.log(`2. 是否有备用JavaScript类: ${hasLearningResourcesPageClass ? '是 ✅' : '否'}`);
      
      // 检查标题栏样式
      const titleBarStyle = data.match(/\.learning-resources-header\s*{[^}]*}/);
      if (titleBarStyle) {
        const style = titleBarStyle[0];
        const hasFixedPosition = style.includes('position: fixed') || style.includes('position:fixed');
        const hasTopZero = style.includes('top: 0') || style.includes('top:0');
        
        console.log('\n📍 标题栏样式检查:');
        console.log(`1. 是否有fixed定位: ${hasFixedPosition ? '是 ✅' : '否 ❌'}`);
        console.log(`2. 是否有top: 0: ${hasTopZero ? '是 ✅' : '否 ❌'}`);
      }
      
      console.log('\n📝 总结:');
      if (hasLearningResourcesHeader && hasLearningResourcesFullpage) {
        console.log('✅ 页面结构基本正确');
        console.log('📱 请访问: http://localhost:3000/c/education/learning-resources-navigation');
        console.log('🔄 如果仍有问题，请尝试:');
        console.log('   1. 清除浏览器缓存 (Ctrl+Shift+Delete)');
        console.log('   2. 强制刷新 (Ctrl+F5)');
        console.log('   3. 检查浏览器控制台是否有错误');
      } else {
        console.log('❌ 页面结构有问题，需要进一步调试');
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ 请求失败:', error.message);
    console.log('💡 请确保服务器正在运行: npm run dev');
  });
  
  req.end();
}, 2000);