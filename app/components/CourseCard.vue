<template>
  <div class="course-card group" @click="handleClick">
    <!-- 课程缩略图 -->
    <div class="course-thumbnail">
      <div class="thumbnail-container">
        <img 
          :src="course.thumbnail || '/images/course-placeholder.svg'"
          :alt="course.title"
          class="thumbnail-image"
          loading="lazy"
        />
        <div class="thumbnail-overlay"></div>
      </div>
      
      <!-- 课程时长覆盖层 -->
      <div class="duration-overlay">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
        <span class="ml-1">{{ formatDuration(course.duration) }}</span>
      </div>
      
      <!-- 标签区域 -->
      <div class="badges-container">
        <!-- 免费标签 -->
        <div v-if="course.isFree" class="free-badge">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          免费
        </div>
        
        <!-- 热门标签 -->
        <div v-if="course.isPopular" class="popular-badge">
          🔥 热门
        </div>
        
        <!-- 推荐标签 -->
        <div v-if="course.isFeatured" class="featured-badge">
          ⭐ 推荐
        </div>
      </div>
    </div>
    
    <!-- 课程信息 -->
    <div class="course-info">
      <!-- 课程标题 -->
      <h3 class="course-title">
        {{ course.title }}
      </h3>
      
      <!-- 课程描述 -->
      <p class="course-description">
        {{ course.description }}
      </p>
      
      <!-- 课程元信息 -->
      <div class="course-meta">
        <!-- 评分 -->
        <div class="rating" v-if="course.rating">
          <div class="stars">
            <svg 
              v-for="i in 5" 
              :key="i"
              class="star"
              :class="{ 'filled': i <= Math.floor(course.rating) }"
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <span class="rating-text">{{ course.rating.toFixed(1) }}</span>
        </div>
        
        <!-- 课程级别 -->
        <NBadge 
          :value="getLevelText(course.level)" 
          type="info" 
          class="level-badge"
        />
      </div>
      
      <!-- 课程统计 -->
      <div class="course-stats">
        <div class="stat-item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>{{ course.chapters?.length || 0 }}章节</span>
        </div>
        
        <div class="stat-item">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
-          <span>{{ course.enrolledCount || 0 }}人学习</span>
+          <span>{{ course.studentsCount || 0 }}人学习</span>
        </div>
      </div>
      
      <!-- 价格信息 -->
      <div class="course-price">
        <template v-if="course.isFree">
          <span class="price-free">免费</span>
        </template>
        <template v-else>
          <span class="price-current">¥{{ course.price }}</span>
          <span v-if="course.originalPrice && course.originalPrice > course.price" class="price-original">
            ¥{{ course.originalPrice }}
          </span>
        </template>
      </div>
    </div>
    
    <!-- 悬停效果 -->
    <div class="hover-overlay">
      <div class="hover-content">
        <button class="hover-button">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          查看详情
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NBadge } from 'naive-ui'

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  duration: number
  rating?: number
  level: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficient'
  chapters?: any[]
  studentsCount: number
  isFree: boolean
  price: number
  originalPrice?: number
  isPopular?: boolean
  isFeatured?: boolean
}

interface Props {
  course: Course
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: true
})

const emit = defineEmits<{
  click: [course: Course]
}>()

// 方法
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}小时`
  }
  return `${hours}小时${remainingMinutes}分钟`
}

function getLevelText(level: string): string {
  const levelMap = {
    beginner: '初级',
    elementary: '基础',
    intermediate: '中级',
    'upper-intermediate': '中高级',
    advanced: '高级',
    proficient: '精通'
  } as const
  return (levelMap as any)[level] || level
}

function generatePlaceholder(title: string): string {
  // 生成基于课程标题的渐变背景占位图
  const colors = [
    ['#3b82f6', '#8b5cf6'], // 蓝紫
    ['#10b981', '#3b82f6'], // 绿蓝
    ['#f59e0b', '#ef4444'], // 橙红
    ['#8b5cf6', '#ec4899'], // 紫粉
    ['#06b6d4', '#10b981'], // 青绿
  ]
  
  const colorIndex = title.charCodeAt(0) % colors.length
  const [color1, color2] = colors[colorIndex]
  
  // 获取标题的前两个字符，如果是中文则只取一个字符
  const displayText = title.length > 0 ? 
    (title.charCodeAt(0) > 127 ? title.slice(0, 1) : title.slice(0, 2)) : 'C'
  
  const svg = `
    <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">${displayText}</text>
    </svg>
  `
  
  // 使用更安全的方式处理UTF-8编码
  try {
    const encoded = btoa(unescape(encodeURIComponent(svg)))
    return `data:image/svg+xml;base64,${encoded}`
  } catch (error) {
    // 如果编码失败，返回URL编码的SVG
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }
}

function handleClick() {
  if (props.clickable) {
    emit('click', props.course)
    navigateTo(`/courses/${props.course.id}`)
  }
}
</script>

<style scoped>
.course-card {
  @apply relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] cursor-pointer;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.course-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

.course-thumbnail {
  @apply relative aspect-video overflow-hidden;
}

.thumbnail-container {
  @apply relative w-full h-full;
}

.thumbnail-image {
  @apply w-full h-full object-cover transition-all duration-500 group-hover:scale-110;
}

.thumbnail-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300;
}

.duration-overlay {
  @apply absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-medium;
}

.badges-container {
  @apply absolute top-3 left-3 flex flex-col gap-2;
}

.free-badge {
  @apply bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1 shadow-lg;
}

.popular-badge {
  @apply bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg;
}

.featured-badge {
  @apply bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg;
}

.course-info {
  @apply p-4 space-y-3;
}

.course-title {
  @apply text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors;
}

.course-description {
  @apply text-sm text-gray-600 line-clamp-2;
}

.course-meta {
  @apply flex items-center justify-between;
}

.rating {
  @apply flex items-center space-x-1;
}

.stars {
  @apply flex space-x-0.5;
}

.star {
  @apply w-4 h-4 text-gray-300;
}

.star.filled {
  @apply text-yellow-400;
}

.rating-text {
  @apply text-sm text-gray-600 ml-1;
}

.level-badge {
  @apply text-xs;
}

.course-stats {
  @apply flex items-center space-x-4 text-sm text-gray-500;
}

.stat-item {
  @apply flex items-center space-x-1;
}

.course-price {
  @apply flex items-center space-x-2;
}

.price-free {
  @apply text-lg font-bold text-green-600;
}

.price-current {
  @apply text-lg font-bold text-blue-600;
}

.price-original {
  @apply text-sm text-gray-400 line-through;
}

.hover-overlay {
  @apply absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:bg-opacity-20 group-hover:opacity-100;
}

.hover-content {
  @apply transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300;
}

.hover-button {
  @apply bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors;
}

/* 文本截断工具类 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .course-card {
    @apply bg-gray-800 border-gray-700;
  }
  
  .course-title {
    @apply text-white;
  }
  
  .course-description {
    @apply text-gray-300;
  }
  
  .rating-text {
    @apply text-gray-400;
  }
  
  .course-stats {
    @apply text-gray-400;
  }
  
  .hover-button {
    @apply bg-gray-800 text-white hover:bg-gray-700;
  }
}
</style>
