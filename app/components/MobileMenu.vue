<template>
  <!-- 移动端菜单覆盖层 -->
  <Teleport to="body">
    <Transition name="mobile-menu">
      <div 
        v-if="isOpen" 
        class="mobile-menu-overlay"
        @click="close"
      >
        <!-- 菜单内容 -->
        <div 
          class="mobile-menu-content"
          @click.stop
        >
          <!-- 菜单头部 -->
          <div class="mobile-menu-header">
            <div class="flex items-center space-x-2">
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
              </svg>
              <span class="text-xl font-bold text-gray-900">SpeakEasy</span>
            </div>
            
            <button 
              @click="close"
              class="close-button"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- 导航菜单 -->
          <nav class="mobile-menu-nav">
            <NuxtLink 
              v-for="item in navigationItems" 
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ 'active': $route.path === item.path }"
              @click="close"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.name }}</span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </nav>
          
          <!-- 用户区域 -->
          <div class="mobile-menu-user">
            <template v-if="user">
              <!-- 用户信息 -->
              <div class="user-info">
                <div class="user-avatar">
                  <img 
                    v-if="user.avatar" 
                    :src="user.avatar" 
                    :alt="user.name"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div v-else class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {{ user.name?.charAt(0)?.toUpperCase() || 'U' }}
                  </div>
                </div>
                <div class="user-details">
                  <div class="user-name">{{ user.name || '用户' }}</div>
                  <div class="user-email">{{ user.email || '' }}</div>
                </div>
              </div>
              
              <!-- 用户菜单 -->
              <div class="user-menu">
                <button class="user-menu-item">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>个人资料</span>
                </button>
                
                <button class="user-menu-item">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>学习记录</span>
                </button>
                
                <button class="user-menu-item">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>设置</span>
                </button>
                
                <button class="user-menu-item text-red-600" @click="handleLogout">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>退出登录</span>
                </button>
              </div>
            </template>
            
            <!-- 未登录状态 -->
            <template v-else>
              <div class="auth-buttons">
                <button class="auth-button login" @click="handleLogin">
                  登录
                </button>
                <button class="auth-button register" @click="handleRegister">
                  注册
                </button>
              </div>
            </template>
          </div>
          
          <!-- 底部信息 -->
          <div class="mobile-menu-footer">
            <div class="footer-links">
              <a href="#" class="footer-link">帮助中心</a>
              <a href="#" class="footer-link">意见反馈</a>
              <a href="#" class="footer-link">关于我们</a>
            </div>
            <div class="footer-version">
              SpeakEasy v1.0.0
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  login: []
  register: []
  logout: []
}>()

// 模拟用户数据（实际应该从认证状态获取）
const user = ref<User | null>(null)

// 导航菜单项
const navigationItems = [
  {
    name: '首页',
    path: '/',
    icon: 'IconHome'
  },
  {
    name: '课程',
    path: '/courses',
    icon: 'IconBook'
  },
  {
    name: '学习',
    path: '/learn',
    icon: 'IconBrain'
  },
  {
    name: 'AI对话',
    path: '/chat',
    icon: 'IconMessage'
  }
]

// 方法
function close() {
  emit('close')
}

function handleLogin() {
  emit('login')
  close()
}

function handleRegister() {
  emit('register')
  close()
}

function handleLogout() {
  emit('logout')
  close()
}

// 阻止背景滚动
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// 组件卸载时恢复滚动
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<script lang="ts">
// 图标组件
const IconHome = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  `
}

const IconBook = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  `
}

const IconBrain = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  `
}

const IconMessage = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  `
}

export { IconHome, IconBook, IconBrain, IconMessage }
</script>

<style scoped>
.mobile-menu-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-50 flex;
}

.mobile-menu-content {
  @apply bg-white w-80 h-full ml-auto flex flex-col shadow-2xl;
}

.mobile-menu-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200;
}

.close-button {
  @apply p-2 rounded-lg hover:bg-gray-100 transition-colors;
}

.mobile-menu-nav {
  @apply flex-1 py-4;
}

.nav-item {
  @apply flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors;
}

.nav-item.active {
  @apply bg-blue-50 text-blue-600 border-r-2 border-blue-600;
}

.mobile-menu-user {
  @apply border-t border-gray-200 p-4;
}

.user-info {
  @apply flex items-center space-x-3 mb-4;
}

.user-details {
  @apply flex-1;
}

.user-name {
  @apply font-semibold text-gray-900;
}

.user-email {
  @apply text-sm text-gray-500;
}

.user-menu {
  @apply space-y-1;
}

.user-menu-item {
  @apply w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors;
}

.auth-buttons {
  @apply space-y-3;
}

.auth-button {
  @apply w-full py-3 px-4 rounded-lg font-medium transition-colors;
}

.auth-button.login {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.auth-button.register {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300;
}

.mobile-menu-footer {
  @apply border-t border-gray-200 p-4 space-y-3;
}

.footer-links {
  @apply flex justify-center space-x-4;
}

.footer-link {
  @apply text-sm text-gray-500 hover:text-gray-700 transition-colors;
}

.footer-version {
  @apply text-center text-xs text-gray-400;
}

/* 动画效果 */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-active .mobile-menu-content,
.mobile-menu-leave-active .mobile-menu-content {
  transition: transform 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-menu-content,
.mobile-menu-leave-to .mobile-menu-content {
  transform: translateX(100%);
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .mobile-menu-content {
    @apply bg-gray-900;
  }
  
  .mobile-menu-header {
    @apply border-gray-700;
  }
  
  .close-button {
    @apply hover:bg-gray-800;
  }
  
  .nav-item {
    @apply text-gray-300 hover:bg-gray-800;
  }
  
  .nav-item.active {
    @apply bg-blue-900 text-blue-400;
  }
  
  .mobile-menu-user {
    @apply border-gray-700;
  }
  
  .user-name {
    @apply text-white;
  }
  
  .user-email {
    @apply text-gray-400;
  }
  
  .user-menu-item {
    @apply text-gray-300 hover:bg-gray-800;
  }
  
  .auth-button.register {
    @apply bg-gray-700 text-gray-200 hover:bg-gray-600;
  }
  
  .mobile-menu-footer {
    @apply border-gray-700;
  }
  
  .footer-link {
    @apply text-gray-400 hover:text-gray-300;
  }
}
</style>
