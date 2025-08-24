<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
// 页面元数据
useHead({
  htmlAttrs: {
    lang: 'zh-CN'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' }
  ]
})
</script>

<style>
/* 全局样式已在 main.css 中定义 */
</style>