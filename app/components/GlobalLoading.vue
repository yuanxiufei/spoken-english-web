<template>
  <Teleport to="body">
    <Transition name="loading">
      <div v-if="isLoading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
          <div class="text-center">
            <!-- 加载动画 -->
            <div class="relative mb-6">
              <div class="w-16 h-16 mx-auto">
                <div class="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <!-- 加载文本 -->
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ loadingText }}</h3>
            <p class="text-sm text-gray-600">{{ loadingSubtext }}</p>
            
            <!-- 进度条 -->
            <div v-if="showProgress" class="mt-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${progress}%` }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-2">{{ progress }}%</p>
            </div>
            
            <!-- 取消按钮 -->
            <button 
              v-if="showCancel" 
              @click="cancelLoading"
              class="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isLoading?: boolean
  loadingText?: string
  loadingSubtext?: string
  showProgress?: boolean
  progress?: number
  showCancel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  loadingText: '加载中...',
  loadingSubtext: '请稍候',
  showProgress: false,
  progress: 0,
  showCancel: false
})

const emit = defineEmits<{
  cancel: []
}>()

const cancelLoading = () => {
  emit('cancel')
}
</script>

<style scoped>
.loading-enter-active,
.loading-leave-active {
  transition: all 0.3s ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.loading-enter-to,
.loading-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>