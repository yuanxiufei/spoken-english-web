<template>
  <div class="error-container" :class="containerClass">
    <div class="error-content">
      <!-- 错误图标 -->
      <div class="error-icon">
        <component :is="iconComponent" class="w-16 h-16" :class="iconClass" />
      </div>
      
      <!-- 错误标题 -->
      <h3 class="error-title">
        {{ title || getDefaultTitle() }}
      </h3>
      
      <!-- 错误描述 -->
      <p class="error-description" v-if="description">
        {{ description }}
      </p>
      
      <!-- 错误详情（开发模式） -->
      <details class="error-details" v-if="showDetails && errorDetails">
        <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
          查看详细信息
        </summary>
        <pre class="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">{{ errorDetails }}</pre>
      </details>
      
      <!-- 操作按钮 -->
      <div class="error-actions" v-if="showActions">
        <button 
          v-if="showRetry"
          @click="handleRetry"
          class="btn-primary"
          :disabled="retrying"
        >
          <svg v-if="retrying" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ retrying ? '重试中...' : '重试' }}
        </button>
        
        <button 
          v-if="showGoBack"
          @click="handleGoBack"
          class="btn-secondary"
        >
          返回
        </button>
        
        <button 
          v-if="showGoHome"
          @click="handleGoHome"
          class="btn-secondary"
        >
          回到首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

interface Props {
  type?: 'network' | 'notFound' | 'server' | 'permission' | 'validation' | 'unknown'
  title?: string
  description?: string
  errorDetails?: string
  showDetails?: boolean
  showActions?: boolean
  showRetry?: boolean
  showGoBack?: boolean
  showGoHome?: boolean
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'unknown',
  showDetails: false,
  showActions: true,
  showRetry: true,
  showGoBack: false,
  showGoHome: false,
  fullscreen: false
})

const emit = defineEmits<{
  retry: []
  goBack: []
  goHome: []
}>()

const retrying = ref(false)

// 计算属性
const containerClass = computed(() => ({
  'error-fullscreen': props.fullscreen,
  'error-inline': !props.fullscreen
}))

const iconComponent = computed(() => {
  const icons = {
    network: 'IconWifiOff',
    notFound: 'IconFileX',
    server: 'IconServerOff',
    permission: 'IconLock',
    validation: 'IconAlertTriangle',
    unknown: 'IconAlertCircle'
  }
  return icons[props.type] || icons.unknown
})

const iconClass = computed(() => {
  const classes = {
    network: 'text-orange-500',
    notFound: 'text-blue-500',
    server: 'text-red-500',
    permission: 'text-yellow-500',
    validation: 'text-purple-500',
    unknown: 'text-gray-500'
  }
  return classes[props.type] || classes.unknown
})

// 方法
function getDefaultTitle() {
  const titles = {
    network: '网络连接失败',
    notFound: '页面未找到',
    server: '服务器错误',
    permission: '权限不足',
    validation: '数据验证失败',
    unknown: '出现了一些问题'
  }
  return titles[props.type] || titles.unknown
}

async function handleRetry() {
  retrying.value = true
  try {
    emit('retry')
    // 模拟重试延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    retrying.value = false
  }
}

function handleGoBack() {
  emit('goBack')
  // 默认行为：浏览器后退
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}

function handleGoHome() {
  emit('goHome')
  navigateTo('/')
}
</script>

<script>
// 图标组件定义
const IconWifiOff = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-12.728 12.728m0 0L12 12m-6.364 6.364L12 12m6.364-6.364L12 12" />
    </svg>
  `
}

const IconFileX = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const IconServerOff = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  `
}

const IconLock = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  `
}

const IconAlertTriangle = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  `
}

const IconAlertCircle = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

export {
  IconWifiOff,
  IconFileX,
  IconServerOff,
  IconLock,
  IconAlertTriangle,
  IconAlertCircle
}
</script>

<style scoped>
.error-container {
  @apply flex items-center justify-center p-8;
}

.error-fullscreen {
  @apply min-h-screen bg-gray-50;
}

.error-inline {
  @apply min-h-[400px];
}

.error-content {
  @apply text-center max-w-md mx-auto;
}

.error-icon {
  @apply flex justify-center mb-6;
}

.error-title {
  @apply text-xl font-semibold text-gray-900 mb-3;
}

.error-description {
  @apply text-gray-600 mb-6 leading-relaxed;
}

.error-details {
  @apply text-left mb-6 border border-gray-200 rounded-lg p-4;
}

.error-actions {
  @apply flex flex-col sm:flex-row gap-3 justify-center;
}

.btn-primary {
  @apply px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center;
}

.btn-secondary {
  @apply px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors;
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .error-fullscreen {
    @apply bg-gray-900;
  }
  
  .error-title {
    @apply text-white;
  }
  
  .error-description {
    @apply text-gray-300;
  }
  
  .error-details {
    @apply border-gray-700 bg-gray-800;
  }
  
  .btn-secondary {
    @apply bg-gray-700 text-gray-200 hover:bg-gray-600;
  }
}
</style>