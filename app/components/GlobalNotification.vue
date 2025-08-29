<template>
  <Teleport to="body">
    <Transition name="notification">
      <div v-if="notification.show" class="fixed top-4 right-4 z-[9998] max-w-sm w-full">
        <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <!-- 通知头部 -->
          <div class="p-4" :class="getHeaderClass(notification.type)">
            <div class="flex items-start space-x-3">
              <!-- 图标 -->
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="getIconBgClass(notification.type)">
                  <component :is="getIcon(notification.type)" class="w-5 h-5" :class="getIconClass(notification.type)" />
                </div>
              </div>
              
              <!-- 内容 -->
              <div class="flex-1 min-w-0">
                <h4 v-if="notification.title" class="text-sm font-semibold" :class="getTitleClass(notification.type)">
                  {{ notification.title }}
                </h4>
                <p class="text-sm" :class="getMessageClass(notification.type)">{{ notification.message }}</p>
              </div>
              
              <!-- 关闭按钮 -->
              <button 
                @click="hideNotification"
                class="flex-shrink-0 p-1 rounded-full transition-colors"
                :class="getCloseButtonClass(notification.type)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div v-if="notification.actions && notification.actions.length > 0" class="px-4 pb-4">
            <div class="flex space-x-2">
              <button
                v-for="(action, index) in notification.actions"
                :key="index"
                @click="action.action"
                class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                :class="getActionButtonClass(notification.type, index === 0)"
              >
                {{ action.label }}
              </button>
            </div>
          </div>
          
          <!-- 进度条 -->
          <div v-if="notification.duration > 0" class="h-1 bg-gray-200">
            <div 
              class="h-full transition-all ease-linear"
              :class="getProgressClass(notification.type)"
              :style="{ width: `${progressWidth}%`, transitionDuration: `${notification.duration}ms` }"
            ></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useGlobalNotification } from '~/composables/useGlobalState'

const { notification, hideNotification } = useGlobalNotification()
const progressWidth = ref(100)

// 监听通知显示状态，重置进度条
watch(() => notification.show, (show) => {
  if (show) {
    progressWidth.value = 100
    if (notification.duration > 0) {
      // 启动进度条动画
      setTimeout(() => {
        progressWidth.value = 0
      }, 50)
    }
  }
})

// 获取图标组件
const getIcon = (type: string) => {
  const icons = {
    success: 'CheckIcon',
    warning: 'ExclamationIcon',
    error: 'XIcon',
    info: 'InformationCircleIcon'
  }
  return icons[type] || icons.info
}

// 获取头部样式
const getHeaderClass = (type: string) => {
  const classes = {
    success: 'bg-gradient-to-r from-green-50 to-emerald-50',
    warning: 'bg-gradient-to-r from-yellow-50 to-orange-50',
    error: 'bg-gradient-to-r from-red-50 to-pink-50',
    info: 'bg-gradient-to-r from-blue-50 to-indigo-50'
  }
  return classes[type] || classes.info
}

// 获取图标背景样式
const getIconBgClass = (type: string) => {
  const classes = {
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
    info: 'bg-blue-100'
  }
  return classes[type] || classes.info
}

// 获取图标样式
const getIconClass = (type: string) => {
  const classes = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600'
  }
  return classes[type] || classes.info
}

// 获取标题样式
const getTitleClass = (type: string) => {
  const classes = {
    success: 'text-green-900',
    warning: 'text-yellow-900',
    error: 'text-red-900',
    info: 'text-blue-900'
  }
  return classes[type] || classes.info
}

// 获取消息样式
const getMessageClass = (type: string) => {
  const classes = {
    success: 'text-green-700',
    warning: 'text-yellow-700',
    error: 'text-red-700',
    info: 'text-blue-700'
  }
  return classes[type] || classes.info
}

// 获取关闭按钮样式
const getCloseButtonClass = (type: string) => {
  const classes = {
    success: 'text-green-400 hover:text-green-600 hover:bg-green-100',
    warning: 'text-yellow-400 hover:text-yellow-600 hover:bg-yellow-100',
    error: 'text-red-400 hover:text-red-600 hover:bg-red-100',
    info: 'text-blue-400 hover:text-blue-600 hover:bg-blue-100'
  }
  return classes[type] || classes.info
}

// 获取操作按钮样式
const getActionButtonClass = (type: string, isPrimary: boolean) => {
  if (isPrimary) {
    const classes = {
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      error: 'bg-red-600 hover:bg-red-700 text-white',
      info: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
    return classes[type] || classes.info
  } else {
    const classes = {
      success: 'bg-green-100 hover:bg-green-200 text-green-700',
      warning: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
      error: 'bg-red-100 hover:bg-red-200 text-red-700',
      info: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
    }
    return classes[type] || classes.info
  }
}

// 获取进度条样式
const getProgressClass = (type: string) => {
  const classes = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    error: 'bg-gradient-to-r from-red-500 to-pink-500',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-500'
  }
  return classes[type] || classes.info
}

// 图标组件
const CheckIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  `
}

const ExclamationIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  `
}

const XIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `
}

const InformationCircleIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}
</script>

<style scoped>
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-enter-to,
.notification-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}
</style>