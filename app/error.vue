<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <NCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold text-center">
          {{ error.statusCode === 404 ? '页面未找到' : '发生错误' }}
        </h1>
      </template>
      
      <p class="text-center mb-6">
        {{ error.message || '抱歉，发生了意外错误' }}
      </p>
      
      <div class="flex justify-center">
        <NButton type="primary" @click="handleError">
          返回首页
        </NButton>
      </div>
    </NCard>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>