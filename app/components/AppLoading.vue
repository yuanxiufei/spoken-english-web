<template>
  <div class="loading-container" :class="{ 'fullscreen': fullscreen }">
    <div class="loading-content">
      <!-- 主加载动画 -->
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      
      <!-- 加载文本 -->
      <div class="loading-text" v-if="text">
        {{ text }}
      </div>
      
      <!-- 进度条（可选） -->
      <div class="loading-progress" v-if="showProgress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-text" v-if="showProgressText">
          {{ progress }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
interface Props {
  text?: string
  fullscreen?: boolean
  showProgress?: boolean
  progress?: number
  showProgressText?: boolean
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
  fullscreen: false,
  showProgress: false,
  progress: 0,
  showProgressText: true
})
</script>

<style scoped>
.loading-container {
  @apply flex items-center justify-center;
  min-height: 200px;
}

.loading-container.fullscreen {
  @apply fixed inset-0 bg-white bg-opacity-90 z-50;
  backdrop-filter: blur(2px);
}

.loading-content {
  @apply flex flex-col items-center space-y-4;
}

.loading-spinner {
  @apply relative w-16 h-16;
}

.spinner-ring {
  @apply absolute inset-0 border-4 border-transparent rounded-full;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(1) {
  @apply border-t-blue-500;
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  @apply border-r-green-500;
  animation-delay: 0.5s;
}

.spinner-ring:nth-child(3) {
  @apply border-b-purple-500;
  animation-delay: 1s;
}

.loading-text {
  @apply text-gray-600 text-sm font-medium;
}

.loading-progress {
  @apply w-64 space-y-2;
}

.progress-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out;
}

.progress-text {
  @apply text-center text-xs text-gray-500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .loading-container.fullscreen {
    @apply bg-gray-900 bg-opacity-90;
  }
  
  .loading-text {
    @apply text-gray-300;
  }
  
  .progress-bar {
    @apply bg-gray-700;
  }
  
  .progress-text {
    @apply text-gray-400;
  }
}
</style>