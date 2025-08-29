<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- 全局组件 -->
    <GlobalLoading 
      :is-loading="loading.isLoading"
      :loading-text="loading.loadingText"
      :loading-subtext="loading.loadingSubtext"
      :show-progress="loading.showProgress"
      :progress="loading.progress"
      :show-cancel="loading.showCancel"
      @cancel="handleLoadingCancel"
    />
    
    <GlobalError
      :show-error="error.showError"
      :error-type="error.errorType"
      :error-title="error.errorTitle"
      :error-message="error.errorMessage"
      :error-details="error.errorDetails"
      :show-retry="error.showRetry"
      :show-reload="error.showReload"
      :show-support="error.showSupport"
      :show-details="error.showDetails"
      :suggestions="error.suggestions"
      @retry="handleErrorRetry"
      @close="hideError"
    />
    
    <GlobalNotification />
  </div>
</template>

<script setup>
import { useGlobalState } from '~/composables/useGlobalState'

// 全局状态管理
const { loading, error, hideError } = useGlobalState()

// 处理加载取消
const handleLoadingCancel = () => {
  // 可以在这里添加取消加载的逻辑
  console.log('用户取消了加载')
}

// 处理错误重试
const handleErrorRetry = () => {
  // 可以在这里添加重试逻辑
  console.log('用户点击了重试')
  hideError()
}
</script>