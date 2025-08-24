<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <NIcon size="32" color="#3b82f6">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14q-1.25 0-2.125-.875T9 11V5q0-1.25.875-2.125T12 2q1.25 0 2.125.875T15 5v6q0 1.25-.875 2.125T12 14Zm-1 7v-3.075q-2.6-.35-4.3-2.325Q5 13.625 5 11h2q0 2.075 1.463 3.537Q9.925 16 12 16t3.538-1.463Q17 13.075 17 11h2q0 2.625-1.7 4.6q-1.7 1.975-4.3 2.325V21Z"/>
              </svg>
            </NIcon>
            <h1 class="text-xl font-bold text-gray-800">SpeakEasy</h1>
          </NuxtLink>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-gray-600 hover:text-blue-600 transition-colors">
              首页
            </NuxtLink>
            <span class="text-blue-600 font-medium">课程</span>
            <NuxtLink to="/learn" class="text-gray-600 hover:text-blue-600 transition-colors">
              学习
            </NuxtLink>
            <NuxtLink to="/chat" class="text-gray-600 hover:text-blue-600 transition-colors">
              AI对话
            </NuxtLink>
            <NButton type="primary" size="small">
              登录
            </NButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- 页面标题 -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">英语课程</h1>
        <p class="text-gray-600">选择适合你水平的课程，开始你的英语学习之旅</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 筛选器 -->
      <div class="mb-8">
        <NCard>
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">难度级别:</span>
              <NSelect
                v-model:value="selectedLevel"
                :options="levelOptions"
                placeholder="选择难度"
                class="w-32"
                clearable
              />
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">课程类型:</span>
              <NSelect
                v-model:value="selectedCategory"
                :options="categoryOptions"
                placeholder="选择类型"
                class="w-32"
                clearable
              />
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">排序:</span>
              <NSelect
                v-model:value="sortBy"
                :options="sortOptions"
                placeholder="排序方式"
                class="w-32"
              />
            </div>
          </div>
        </NCard>
      </div>

      <!-- 课程网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 加载骨架屏 -->
        <template v-if="loading">
          <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            <div class="aspect-video bg-gray-300"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-300 rounded w-3/4"></div>
              <div class="h-3 bg-gray-300 rounded w-1/2"></div>
              <div class="h-3 bg-gray-300 rounded w-full"></div>
              <div class="h-3 bg-gray-300 rounded w-2/3"></div>
              <div class="flex justify-between items-center">
                <div class="h-6 bg-gray-300 rounded w-16"></div>
                <div class="h-8 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        </template>
        
        <!-- 课程卡片 -->
        <template v-else>
          <CourseCard 
            v-for="course in filteredCourses" 
            :key="course.id"
            :course="course"
            @click="handleCourseClick"
          />
        </template>
      </div>

      <!-- 分页 -->
      <div class="flex justify-center mt-12">
        <NPagination
          v-model:page="currentPage"
          :page-count="totalPages"
          :page-size="pageSize"
          show-size-picker
          :page-sizes="[6, 12, 18, 24]"
          @update:page-size="handlePageSizeChange"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { NButton, NCard, NIcon, NBadge, NSelect, NProgress, NPagination } from 'naive-ui'

// SEO配置
useHead({
  title: '英语课程 - SpeakEasy',
  meta: [
    { name: 'description', content: '浏览SpeakEasy的英语课程，从基础到高级，涵盖日常对话、商务英语、发音训练等多个领域。' },
    { name: 'keywords', content: '英语课程,在线学习,口语练习,商务英语,发音训练' }
  ]
})

// 响应式数据
const selectedLevel = ref(null)
const selectedCategory = ref(null)
const sortBy = ref('popular')
const currentPage = ref(1)
const pageSize = ref(6)

// 筛选选项
const levelOptions = [
  { label: '初级', value: 'beginner' },
  { label: '中级', value: 'intermediate' },
  { label: '高级', value: 'advanced' },
  { label: '全级别', value: 'all' }
]

const categoryOptions = [
  { label: '口语会话', value: 'speaking' },
  { label: '商务英语', value: 'business' },
  { label: '发音训练', value: 'pronunciation' },
  { label: '语法基础', value: 'grammar' },
  { label: '听力训练', value: 'listening' },
  { label: '词汇扩展', value: 'vocabulary' },
  { label: '考试训练', value: 'exam' }
]

const sortOptions = [
  { label: '最受欢迎', value: 'popular' },
  { label: '最新发布', value: 'newest' },
  { label: '评分最高', value: 'rating' },
  { label: '价格最低', value: 'price' }
]

// 使用课程管理composable
const { getAllCourses, searchCourses } = useCourses()
const courses = ref([])
const loading = ref(false)

// 计算属性
const filteredCourses = computed(() => {
  return courses.value
})

// 加载课程数据
const loadCourses = async () => {
  loading.value = true
  try {
    const allCourses = await getAllCourses()
    let result = allCourses
    
    // 按级别筛选
    if (selectedLevel.value && selectedLevel.value !== 'all') {
      result = result.filter(course => course.level === selectedLevel.value)
    }
    
    // 按类型筛选
    if (selectedCategory.value) {
      result = result.filter(course => course.type === selectedCategory.value)
    }
    
    // 排序
    switch (sortBy.value) {
      case 'newest':
        result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'rating':
        result = result.sort((a, b) => b.rating - a.rating)
        break
      case 'price':
        result = result.sort((a, b) => a.price - b.price)
        break
      default: // popular
        result = result.sort((a, b) => b.rating - a.rating)
    }
    
    courses.value = result
  } catch (error) {
    console.error('加载课程失败:', error)
  } finally {
    loading.value = false
  }
}

const totalPages = computed(() => {
  return Math.ceil(filteredCourses.value.length / pageSize.value)
})

// 方法
const goToCourse = (courseId) => {
  navigateTo(`/courses/${courseId}`)
}

const handleCourseClick = (course) => {
  navigateTo(`/courses/${course.id}`)
}

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize
  currentPage.value = 1
}

// 获取级别文本
const getLevelText = (level) => {
  const levelMap = {
    'beginner': '初级',
    'elementary': '基础',
    'intermediate': '中级',
    'upper-intermediate': '中高级',
    'advanced': '高级',
    'proficient': '精通'
  }
  return levelMap[level] || level
}

// 页面加载时获取课程数据
onMounted(() => {
  loadCourses()
})

// 监听筛选条件变化
watch([selectedLevel, selectedCategory, sortBy], () => {
  loadCourses()
})

// 图标组件（简化版）
const ChatIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' })
])

const BusinessIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z' })
])

const MicIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M12 14q-1.25 0-2.125-.875T9 11V5q0-1.25.875-2.125T12 2q1.25 0 2.125.875T15 5v6q0 1.25-.875 2.125T12 14Zm-1 7v-3.075q-2.6-.35-4.3-2.325Q5 13.625 5 11h2q0 2.075 1.463 3.537Q9.925 16 12 16t3.538-1.463Q17 13.075 17 11h2q0 2.625-1.7 4.6q-1.7 1.975-4.3 2.325V21Z' })
])

const BookIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z' })
])

const HeadphonesIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z' })
])

const SpeakerIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' })
])
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>