<template>
  <div class="min-h-screen bg-blue-50 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-blue-600 mb-4">SpeakEasy 测试页面</h1>
      <p class="text-gray-600 mb-8">如果你能看到这个页面，说明Nuxt应用正在正常运行！</p>
      <div class="space-x-4">
        <NuxtLink to="/" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          返回首页
        </NuxtLink>
        <button @click="showAlert" class="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50">
          测试交互
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const showAlert = () => {
  alert('页面交互正常工作！')
}
</script>