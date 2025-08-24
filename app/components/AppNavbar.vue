<template>
  <nav class="navbar">
    <div class="container">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <NuxtLink to="/" class="flex items-center space-x-2 text-xl font-bold text-gradient">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
            </svg>
            <span>SpeakEasy</span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            to="/" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/' }"
          >
            首页
          </NuxtLink>
          <NuxtLink 
            to="/courses" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/courses') }"
          >
            课程
          </NuxtLink>
          <NuxtLink 
            to="/learn" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/learn' }"
          >
            学习
          </NuxtLink>
          <NuxtLink 
            to="/chat" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/chat' }"
          >
            AI对话
          </NuxtLink>
        </div>

        <!-- User Actions -->
        <div class="hidden md:flex items-center space-x-4">
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
            <NuxtLink to="/auth/login" class="btn btn-secondary btn-sm">
              登录
            </NuxtLink>
            <NuxtLink to="/auth/register" class="btn btn-primary btn-sm">
              注册
            </NuxtLink>
          </template>
        </div>

        <!-- 移动端菜单按钮 -->
        <button 
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          @click="toggleMobileMenu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
.nav-link {
  @apply text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200;
}

.nav-link-active {
  @apply text-blue-600 bg-blue-50;
}

.mobile-nav-link {
  @apply block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200;
}

.mobile-nav-link-active {
  @apply text-blue-600 bg-blue-50;
}
</style>