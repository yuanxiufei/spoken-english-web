<template>
  <Teleport to="body">
    <Transition name="error">
      <div v-if="showError" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          <!-- 错误头部 -->
          <div class="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold">{{ errorTitle }}</h3>
                <p class="text-sm text-white/80">{{ getErrorTypeText(errorType) }}</p>
              </div>
            </div>
          </div>
          
          <!-- 错误内容 -->
          <div class="p-6">
            <div class="mb-4">
              <p class="text-gray-700 leading-relaxed">{{ errorMessage }}</p>
            </div>
            
            <!-- 错误详情 -->
            <div v-if="errorDetails && showDetails" class="mb-4">
              <button 
                @click="toggleDetails" 
                class="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center space-x-1"
              >
                <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showDetailsExpanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span>{{ showDetailsExpanded ? '隐藏' : '显示' }}详细信息</span>
              </button>
              <div v-if="showDetailsExpanded" class="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-mono max-h-32 overflow-y-auto">
                {{ errorDetails }}
              </div>
            </div>
            
            <!-- 建议操作 -->
            <div v-if="suggestions.length > 0" class="mb-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">建议操作:</h4>
              <ul class="space-y-1">
                <li v-for="suggestion in suggestions" :key="suggestion" class="text-sm text-gray-600 flex items-start space-x-2">
                  <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ suggestion }}</span>
                </li>
              </ul>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex flex-col sm:flex-row gap-3">
              <button 
                v-if="showRetry"
                @click="retryAction"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                🔄 重试
              </button>
              <button 
                v-if="showReload"
                @click="reloadPage"
                class="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                🔃 刷新页面
              </button>
              <button 
                @click="closeError"
                class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                关闭
              </button>
            </div>
            
            <!-- 联系支持 -->
            <div v-if="showSupport" class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-xs text-gray-500 mb-2">如果问题持续存在，请联系技术支持:</p>
              <div class="flex items-center space-x-4 text-xs">
                <a href="mailto:support@speakeasy.com" class="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>发送邮件</span>
                </a>
                <button @click="copyErrorInfo" class="text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>复制错误信息</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  showError?: boolean
  errorType?: 'network' | 'server' | 'client' | 'validation' | 'permission' | 'unknown'
  errorTitle?: string
  errorMessage?: string
  errorDetails?: string
  showRetry?: boolean
  showReload?: boolean
  showSupport?: boolean
  showDetails?: boolean
  suggestions?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  showError: false,
  errorType: 'unknown',
  errorTitle: '出现错误',
  errorMessage: '抱歉，发生了意外错误，请稍后重试。',
  errorDetails: '',
  showRetry: true,
  showReload: false,
  showSupport: true,
  showDetails: true,
  suggestions: () => []
})

const emit = defineEmits<{
  retry: []
  close: []
}>()

const showDetailsExpanded = ref(false)

// 获取错误类型文本
const getErrorTypeText = (type: string) => {
  const typeMap = {
    network: '网络连接错误',
    server: '服务器错误',
    client: '客户端错误',
    validation: '数据验证错误',
    permission: '权限错误',
    unknown: '未知错误'
  }
  return typeMap[type] || typeMap.unknown
}

// 切换详情显示
const toggleDetails = () => {
  showDetailsExpanded.value = !showDetailsExpanded.value
}

// 重试操作
const retryAction = () => {
  emit('retry')
}

// 关闭错误
const closeError = () => {
  emit('close')
}

// 刷新页面
const reloadPage = () => {
  window.location.reload()
}

// 复制错误信息
const copyErrorInfo = async () => {
  const errorInfo = {
    type: props.errorType,
    title: props.errorTitle,
    message: props.errorMessage,
    details: props.errorDetails,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  }
  
  try {
    await navigator.clipboard.writeText(JSON.stringify(errorInfo, null, 2))
    alert('错误信息已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.error-enter-active,
.error-leave-active {
  transition: all 0.3s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.error-enter-to,
.error-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>