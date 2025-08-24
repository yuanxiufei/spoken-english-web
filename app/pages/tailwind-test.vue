<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-white mb-8 text-center">
        Tailwind CSS 功能测试
      </h1>
      
      <!-- 颜色测试 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">颜色测试</h2>
        <div class="grid grid-cols-6 gap-4">
          <div class="h-16 bg-red-500 rounded flex items-center justify-center text-white font-semibold">Red</div>
          <div class="h-16 bg-blue-500 rounded flex items-center justify-center text-white font-semibold">Blue</div>
          <div class="h-16 bg-green-500 rounded flex items-center justify-center text-white font-semibold">Green</div>
          <div class="h-16 bg-yellow-500 rounded flex items-center justify-center text-white font-semibold">Yellow</div>
          <div class="h-16 bg-purple-500 rounded flex items-center justify-center text-white font-semibold">Purple</div>
          <div class="h-16 bg-pink-500 rounded flex items-center justify-center text-white font-semibold">Pink</div>
        </div>
      </div>
      
      <!-- 响应式测试 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">响应式布局测试</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-blue-100 p-4 rounded text-center">
            <p class="text-blue-800 font-semibold">移动端: 1列</p>
            <p class="text-blue-600">平板: 2列</p>
            <p class="text-blue-600">桌面: 3列</p>
          </div>
          <div class="bg-green-100 p-4 rounded text-center">
            <p class="text-green-800 font-semibold">响应式</p>
            <p class="text-green-600">网格布局</p>
          </div>
          <div class="bg-purple-100 p-4 rounded text-center">
            <p class="text-purple-800 font-semibold">自适应</p>
            <p class="text-purple-600">屏幕尺寸</p>
          </div>
        </div>
      </div>
      
      <!-- 动画和交互测试 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">动画和交互测试</h2>
        <div class="space-y-4">
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-300 transform hover:scale-105">
            悬停效果按钮
          </button>
          <div class="flex space-x-4">
            <div class="w-16 h-16 bg-red-500 rounded-full animate-bounce"></div>
            <div class="w-16 h-16 bg-blue-500 rounded-full animate-pulse"></div>
            <div class="w-16 h-16 bg-green-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
      
      <!-- Flexbox 和 Grid 测试 -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">布局测试</h2>
        <div class="flex justify-between items-center bg-gray-100 p-4 rounded mb-4">
          <span class="text-gray-700">Flexbox 左对齐</span>
          <span class="text-gray-700">Flexbox 右对齐</span>
        </div>
        <div class="grid grid-cols-4 gap-2">
          <div class="bg-indigo-200 p-2 text-center rounded">1</div>
          <div class="bg-indigo-300 p-2 text-center rounded">2</div>
          <div class="bg-indigo-400 p-2 text-center rounded">3</div>
          <div class="bg-indigo-500 p-2 text-center rounded text-white">4</div>
        </div>
      </div>
      
      <!-- 阴影和边框测试 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">阴影和边框测试</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 border-2 border-blue-300 rounded-lg">
            <p class="text-center text-blue-700">边框样式</p>
          </div>
          <div class="p-4 shadow-md rounded-lg bg-gray-50">
            <p class="text-center text-gray-700">中等阴影</p>
          </div>
          <div class="p-4 shadow-xl rounded-lg bg-gray-50">
            <p class="text-center text-gray-700">大阴影</p>
          </div>
        </div>
      </div>
      
      <div class="mt-8 text-center">
        <NuxtLink to="/" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          返回首页
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Tailwind CSS 测试页面
</script>