const http = require('http');

console.log('🚀 最终验证学习资源导航页面修复...');
console.log('等待服务器稳定...');

setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/c/education/learning-resources-navigation',
    method: 'GET',
    headers: {
      'User-Agent': 'OpenClaw-Final-Test/1.0'
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
      const hasLearningResourcesClient = data.includes('learning-resources-client');
      
      console.log('\n🔍 检查结果:');
      console.log(`1. 是否有global-header元素: ${hasGlobalHeader ? '是（应该被隐藏）' : '否 ✅'}`);
      console.log(`2. 是否有learning-resources-header元素: ${hasLearningResourcesHeader ? '是 ✅' : '否 ❌'}`);
      console.log(`3. 是否有learning-resources-fullpage元素: ${hasLearningResourcesFullpage ? '是 ✅' : '否 ❌'}`);
      console.log(`4. 是否有learning-resources-client引用: ${hasLearningResourcesClient ? '是 ✅' : '否 ❌'}`);
      
      // 检查JavaScript是否包含
      const hasUseEffect = data.includes('useEffect');
      const hasConsoleLog = data.includes('console.log');
      
      console.log('\n🔄 JavaScript检查:');
      console.log(`1. 是否有useEffect: ${hasUseEffect ? '是 ✅' : '否'}`);
      console.log(`2. 是否有console.log: ${hasConsoleLog ? '是 ✅' : '否'}`);
      
      // 检查CSS样式
      const hasInlineStyle = data.includes('textContent') || data.includes('createElement(\'style\')');
      const hasImportant = data.includes('!important');
      
      console.log('\n🎨 CSS检查:');
      console.log(`1. 是否有内联样式: ${hasInlineStyle ? '是 ✅' : '否'}`);
      console.log(`2. 是否有!important: ${hasImportant ? '是 ✅' : '否'}`);
      
      console.log('\n📝 总结:');
      if (hasLearningResourcesClient && hasLearningResourcesHeader && hasLearningResourcesFullpage) {
        console.log('✅ 页面结构正确，客户端组件已加载');
        console.log('📱 请访问: http://localhost:3000/c/education/learning-resources-navigation');
        console.log('\n🔄 验证步骤:');
        console.log('1. 打开页面');
        console.log('2. 按 F12 打开开发者工具');
        console.log('3. 检查 Console 标签页是否有 ✅ 日志');
        console.log('4. 检查 Elements 标签页查看DOM结构');
        console.log('5. 检查 Styles 标签页查看应用的CSS');
        console.log('\n💡 如果仍有问题:');
        console.log('   1. 清除浏览器缓存 (Ctrl+Shift+Delete)');
        console.log('   2. 强制刷新 (Ctrl+F5)');
        console.log('   3. 检查控制台错误');
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
}, 3000);