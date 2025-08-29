<template>
  <nav class="navbar bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <NuxtLink to="/" class="group flex items-center space-x-3 text-xl font-bold transition-all duration-300 hover:scale-105">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
                </svg>
              </div>
            </div>
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold">SpeakEasy</span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <NuxtLink 
            to="/" 
            class="nav-link group relative px-4 py-2 rounded-lg transition-all duration-300"
            :class="{ 'nav-link-active bg-blue-50 text-blue-600': $route.path === '/' }"
          >
            <span class="relative z-10 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              首页
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </NuxtLink>
          <NuxtLink 
            to="/courses" 
            class="nav-link group relative px-4 py-2 rounded-lg transition-all duration-300"
            :class="{ 'nav-link-active bg-blue-50 text-blue-600': $route.path.startsWith('/courses') }"
          >
            <span class="relative z-10 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              课程
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </NuxtLink>
          <NuxtLink 
            to="/learn" 
            class="nav-link group relative px-4 py-2 rounded-lg transition-all duration-300"
            :class="{ 'nav-link-active bg-blue-50 text-blue-600': $route.path === '/learn' }"
          >
            <span class="relative z-10 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
              </svg>
              学习
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </NuxtLink>
          <NuxtLink 
            to="/chat" 
            class="nav-link group relative px-4 py-2 rounded-lg transition-all duration-300"
            :class="{ 'nav-link-active bg-blue-50 text-blue-600': $route.path === '/chat' }"
          >
            <span class="relative z-10 flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              AI对话
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </NuxtLink>
        </div>

        <!-- User Actions -->
        <div class="hidden md:flex items-center space-x-3">
          <template v-if="isLoggedIn">
            <!-- User Menu -->
            <NDropdown trigger="click" :options="userMenuOptions" @select="handleUserMenuSelect">
              <div class="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
                <NAvatar 
                  :size="32" 
                  :src="user.avatar || generateLocalAvatar(user.name)" 
                />
                <span class="text-sm font-medium text-gray-700">{{ user.name }}</span>
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </NDropdown>
          </template>
          <template v-else>
            <NuxtLink 
              to="/auth/login" 
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 border border-gray-300 hover:border-blue-300"
            >
              登录
            </NuxtLink>
            <NuxtLink 
              to="/auth/register" 
              class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              注册
            </NuxtLink>
          </template>
        </div>

        <!-- 移动端菜单按钮 -->
        <button 
          class="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 relative group"
          @click="toggleMobileMenu"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <svg class="w-6 h-6 relative z-10 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 py-4 fade-in">
        <div class="space-y-2">
          <NuxtLink 
            to="/" 
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/' }"
            @click="mobileMenuOpen = false"
          >
            首页
          </NuxtLink>
          <NuxtLink 
            to="/courses" 
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path.startsWith('/courses') }"
            @click="mobileMenuOpen = false"
          >
            课程
          </NuxtLink>
          <NuxtLink 
            to="/learn" 
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/learn' }"
            @click="mobileMenuOpen = false"
          >
            学习
          </NuxtLink>
          <NuxtLink 
            to="/chat" 
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/chat' }"
            @click="mobileMenuOpen = false"
          >
            AI对话
          </NuxtLink>
        </div>
        
        <!-- Mobile User Actions -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <template v-if="isLoggedIn">
            <div class="flex items-center space-x-3 mb-3">
              <NAvatar 
                :size="40" 
                :src="user.avatar || generateLocalAvatar(user.name)" 
              />
              <div>
                <div class="font-medium text-gray-900">{{ user.name }}</div>
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </div>
            </div>
            <div class="space-y-2">
              <button class="mobile-nav-link w-full text-left" @click="goToProfile">
                个人资料
              </button>
              <button class="mobile-nav-link w-full text-left" @click="goToSettings">
                设置
              </button>
              <button class="mobile-nav-link w-full text-left text-red-600" @click="logout">
                退出登录
              </button>
            </div>
          </template>
          <template v-else>
            <div class="space-y-2">
              <NuxtLink to="/auth/login" class="btn btn-secondary w-full" @click="mobileMenuOpen = false">
                登录
              </NuxtLink>
              <NuxtLink to="/auth/register" class="btn btn-primary w-full" @click="mobileMenuOpen = false">
                注册
              </NuxtLink>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- 移动端菜单 -->
  <MobileMenu 
    :is-open="isMobileMenuOpen"
    @close="closeMobileMenu"
    @login="handleLogin"
    @register="handleRegister"
    @logout="handleLogout"
  />
</template>

<script setup>
import { NButton, NAvatar, NDropdown } from 'naive-ui'

// 响应式数据
const mobileMenuOpen = ref(false)
const isLoggedIn = ref(false) // 这里应该从用户状态管理中获取
const user = ref({
  name: '用户',
  email: 'user@example.com',
  avatar: ''
})
const isMobileMenuOpen = ref(false)

// 用户菜单选项
const userMenuOptions = [
  {
    label: '个人资料',
    key: 'profile',
    icon: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
    ])
  },
  {
    label: '学习记录',
    key: 'progress',
    icon: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
    ])
  },
  {
    label: '设置',
    key: 'settings',
    icon: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' })
    ])
  },
  {
    type: 'divider'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' })
    ])
  }
]

// 方法
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function handleLogin() {
  // 处理登录逻辑
  console.log('Login clicked')
  closeMobileMenu()
}

function handleRegister() {
  // 处理注册逻辑
  console.log('Register clicked')
  closeMobileMenu()
}

function handleLogout() {
  // 处理退出登录逻辑
  isLoggedIn.value = false
  user.value = { name: '', email: '', avatar: '' }
  console.log('Logout clicked')
  closeMobileMenu()
}

const handleUserMenuSelect = (key) => {
  switch (key) {
    case 'profile':
      goToProfile()
      break
    case 'progress':
      goToProgress()
      break
    case 'settings':
      goToSettings()
      break
    case 'logout':
      logout()
      break
  }
}

const goToProfile = () => {
  navigateTo('/profile')
}

const goToProgress = () => {
  navigateTo('/progress')
}

const goToSettings = () => {
  navigateTo('/settings')
}

const logout = () => {
  // 退出登录逻辑
  isLoggedIn.value = false
  user.value = { name: '', email: '', avatar: '' }
  navigateTo('/')
}

// 生成本地头像
const generateLocalAvatar = (name) => {
  if (!name) return '/default-avatar.svg'
  
  // 使用用户名生成简单的头像
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const colorIndex = name.charCodeAt(0) % colors.length
  const bgColor = colors[colorIndex]
  
  // 创建SVG头像
  const svg = `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="${bgColor}"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${initials}</text>
    </svg>
  `)}`
  
  return svg
}

// 监听路由变化，关闭移动端菜单
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
.navbar {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.nav-link {
  @apply text-gray-600 hover:text-gray-900 font-medium transition-all duration-300;
  position: relative;
}

.nav-link:hover {
  transform: translateY(-1px);
}

.nav-link-active {
  @apply text-blue-600;
  font-weight: 600;
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 1px;
}

.mobile-nav-link {
  @apply block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-300 mx-2;
}

.mobile-nav-link:hover {
  transform: translateX(4px);
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
}

.mobile-nav-link-active {
  @apply text-blue-600 bg-blue-50 font-semibold;
  border-left: 3px solid #3b82f6;
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 用户头像悬停效果 */
.user-menu:hover .user-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>