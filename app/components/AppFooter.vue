<template>
  <footer class="bg-gray-900 text-white">
    <div class="container">
      <!-- 主要内容区域 -->
      <div class="py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- 品牌信息 -->
          <div class="lg:col-span-1">
            <div class="flex items-center space-x-2 mb-4">
              <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
              </svg>
              <span class="text-xl font-bold">SpeakEasy</span>
            </div>
            <p class="text-gray-400 text-sm mb-4">
              专业的在线英语学习平台，通过AI技术帮助您提升英语口语能力，让英语学习变得简单有趣。
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <span class="sr-only">微信</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18 0 .659-.52 1.188-1.162 1.188-.642 0-1.162-.529-1.162-1.188 0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18 0 .659-.52 1.188-1.162 1.188-.642 0-1.162-.529-1.162-1.188 0-.651.52-1.18 1.162-1.18z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <span class="sr-only">微博</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.586 8.414a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 2 2 0 010-2.828l3-3z"/>
                  <path d="M15.414 9.586a2 2 0 00-2.828-2.828l-3 3a2 2 0 002.828 2.828l3-3z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <span class="sr-only">QQ</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- 产品链接 -->
          <div>
            <h3 class="text-lg font-semibold mb-4">产品</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/courses" class="text-gray-400 hover:text-white transition-colors text-sm">
                  在线课程
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/learn" class="text-gray-400 hover:text-white transition-colors text-sm">
                  智能学习
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/chat" class="text-gray-400 hover:text-white transition-colors text-sm">
                  AI对话
                </NuxtLink>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  移动应用
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  企业版
                </a>
              </li>
            </ul>
          </div>

          <!-- 支持链接 -->
          <div>
            <h3 class="text-lg font-semibold mb-4">支持</h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  帮助中心
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  使用指南
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  常见问题
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  联系我们
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  意见反馈
                </a>
              </li>
            </ul>
          </div>

          <!-- 公司信息 -->
          <div>
            <h3 class="text-lg font-semibold mb-4">公司</h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  关于我们
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  加入我们
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  新闻动态
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  合作伙伴
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                  投资者关系
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="border-t border-gray-800"></div>

      <!-- 底部信息 -->
      <div class="py-6">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p class="text-gray-400 text-sm">
              © {{ currentYear }} SpeakEasy. 保留所有权利。
            </p>
            <div class="flex space-x-6">
              <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                隐私政策
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                服务条款
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                Cookie政策
              </a>
            </div>
          </div>
          
          <!-- 语言选择器 -->
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <select class="bg-transparent text-gray-400 text-sm border-none focus:outline-none cursor-pointer">
              <option value="zh-CN">中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 备案信息 -->
    <div class="bg-gray-950 py-3">
      <div class="container">
        <div class="text-center">
          <p class="text-gray-500 text-xs">
            ICP备案号：京ICP备12345678号-1 | 网络文化经营许可证：京网文[2024]1234-567号
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 获取当前年份
const currentYear = new Date().getFullYear()
</script>

<style scoped>
/* 自定义选择器样式 */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

select:focus {
  outline: none;
}
</style>