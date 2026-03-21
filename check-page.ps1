$url = "http://localhost:3000/c/education/learning-resources-navigation"
Write-Host "正在检查页面: $url" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing
    $content = $response.Content
    
    Write-Host "状态码: $($response.StatusCode)" -ForegroundColor Green
    
    # 检查关键元素
    $hasGlobalHeader = $content -match 'class="[^"]*global-header[^"]*"'
    $hasLearningResourcesHeader = $content -match 'class="[^"]*learning-resources-header[^"]*"'
    $hasLearningResourcesFullpage = $content -match 'class="[^"]*learning-resources-fullpage[^"]*"'
    $hasSiteTopline = $content -match 'class="[^"]*site-topline[^"]*"'
    
    Write-Host "`n检查结果:" -ForegroundColor Yellow
    Write-Host "1. global-header: $($hasGlobalHeader ? '存在' : '不存在')"
    Write-Host "2. learning-resources-header: $($hasLearningResourcesHeader ? '存在 ✅' : '不存在 ❌')"
    Write-Host "3. learning-resources-fullpage: $($hasLearningResourcesFullpage ? '存在 ✅' : '不存在 ❌')"
    Write-Host "4. site-topline: $($hasSiteTopline ? '存在' : '不存在')"
    
    # 检查DOM结构
    if ($hasGlobalHeader -and $hasLearningResourcesFullpage) {
        $globalHeaderIndex = $content.IndexOf('class="global-header"')
        $learningResourcesFullpageIndex = $content.IndexOf('class="learning-resources-fullpage"')
        
        Write-Host "`nDOM结构分析:" -ForegroundColor Yellow
        if ($globalHeaderIndex -lt $learningResourcesFullpageIndex) {
            Write-Host "✅ global-header 在 learning-resources-fullpage 之前" -ForegroundColor Green
        } else {
            Write-Host "❌ global-header 在 learning-resources-fullpage 之后" -ForegroundColor Red
        }
    }
    
    # 检查CSS是否加载
    $hasCssLink = $content -match '<link[^>]*href="[^"]*\.css[^"]*"[^>]*>'
    Write-Host "`nCSS检查:" -ForegroundColor Yellow
    Write-Host "CSS链接: $($hasCssLink ? '存在 ✅' : '不存在 ❌')"
    
    # 检查JavaScript
    $hasScript = $content -match '<script[^>]*>'
    Write-Host "JavaScript: $($hasScript ? '存在 ✅' : '不存在')"
    
    Write-Host "`n建议:" -ForegroundColor Cyan
    Write-Host "1. 访问: $url"
    Write-Host "2. 按 F12 打开开发者工具"
    Write-Host "3. 检查 Console 标签页是否有错误"
    Write-Host "4. 检查 Elements 标签页查看DOM结构"
    Write-Host "5. 检查 Styles 标签页查看应用的CSS"
    
} catch {
    Write-Host "❌ 请求失败: $_" -ForegroundColor Red
    Write-Host "请确保服务器正在运行: npm run dev" -ForegroundColor Yellow
}