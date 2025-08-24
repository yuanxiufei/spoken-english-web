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
            <NuxtLink to="/courses" class="text-gray-600 hover:text-blue-600 transition-colors">
              课程
            </NuxtLink>
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

    <!-- 面包屑导航 -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-3">
        <NBreadcrumb>
          <NBreadcrumbItem>
            <NuxtLink to="/" class="text-blue-600 hover:text-blue-800">
              首页
            </NuxtLink>
          </NBreadcrumbItem>
          <NBreadcrumbItem>
            <NuxtLink to="/courses" class="text-blue-600 hover:text-blue-800">
              课程
            </NuxtLink>
          </NBreadcrumbItem>
          <NBreadcrumbItem>
            <span class="text-gray-500">{{ course?.title }}</span>
          </NBreadcrumbItem>
        </NBreadcrumb>
      </div>
    </div>

    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
      <div v-if="course" class="grid lg:grid-cols-3 gap-8">
        <!-- 左侧内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 课程头部 -->
          <NCard>
            <div class="space-y-4">
              <div class="flex items-start justify-between">
                <div>
                  <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ course.title }}</h1>
                  <p class="text-lg text-gray-600">{{ course.description }}</p>
                </div>
                <NBadge :value="getLevelText(course.level)" type="info" size="large" />
              </div>
              
              <div class="flex items-center space-x-6 text-sm text-gray-500">
                <div class="flex items-center space-x-1">
                  <NIcon size="16">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </NIcon>
                  <span class="font-medium">{{ course.rating }}</span>
                  <span>({{ course.reviewsCount }}条评价)</span>
                </div>
                <div class="flex items-center space-x-1">
                  <NIcon size="16">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 16H9V7h9v14z"/>
                    </svg>
                  </NIcon>
                  <span>{{ course.chapters?.length || 0 }}章节</span>
                </div>
                <div class="flex items-center space-x-1">
                  <NIcon size="16">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                      <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                  </NIcon>
                  <span>{{ Math.floor(course.duration / 60) }}小时</span>
                </div>
                <div class="flex items-center space-x-1">
                  <NIcon size="16">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                  </NIcon>
                  <span>{{ course.studentsCount }}人学习</span>
                </div>
              </div>
            </div>
          </NCard>

          <!-- 课程介绍 -->
          <NCard>
            <template #header>
              <h2 class="text-xl font-semibold">课程介绍</h2>
            </template>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed mb-4">
                {{ course.fullDescription }}
              </p>
              <h3 class="text-lg font-semibold mb-3">你将学到：</h3>
              <ul class="space-y-2">
                <li v-for="skill in course.skills" :key="skill" class="flex items-start space-x-2">
                  <NIcon size="16" color="#10b981" class="mt-1">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </NIcon>
                  <span class="text-gray-700">{{ skill }}</span>
                </li>
              </ul>
            </div>
          </NCard>

          <!-- 课程大纲 -->
          <NCard v-if="course.chapters && course.chapters.length > 0">
            <template #header>
              <h2 class="text-xl font-semibold">课程大纲</h2>
            </template>
            <NCollapse>
              <NCollapseItem 
                v-for="(chapter, index) in course.chapters" 
                :key="index"
                :title="`第${index + 1}章: ${chapter.title}`"
                :name="index.toString()"
              >
                <div class="space-y-3">
                  <p class="text-gray-600 mb-4">{{ chapter.description }}</p>
                  <div class="space-y-2">
                    <div 
                      v-for="(lesson, lessonIndex) in chapter.lessons" 
                      :key="lessonIndex"
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span class="text-sm font-medium text-blue-600">{{ lessonIndex + 1 }}</span>
                        </div>
                        <div>
                          <h4 class="font-medium text-gray-900">{{ lesson.title }}</h4>
                          <p class="text-sm text-gray-500">{{ lesson.duration }}</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <NBadge 
                          v-if="lesson.completed" 
                          value="已完成" 
                          type="success" 
                          size="small"
                        />
                        <NButton size="small" :type="lesson.completed ? 'default' : 'primary'">
                          {{ lesson.completed ? '重新学习' : '开始学习' }}
                        </NButton>
                      </div>
                    </div>
                  </div>
                </div>
              </NCollapseItem>
            </NCollapse>
          </NCard>
          <NCard v-else>
            <template #header>
              <h2 class="text-xl font-semibold">课程大纲</h2>
            </template>
            <div class="text-gray-600">本课程暂无详细大纲，后续将逐步完善。</div>
          </NCard>

          <!-- 学员评价 -->
          <NCard>
            <template #header>
              <h2 class="text-xl font-semibold">学员评价</h2>
            </template>
            <div class="space-y-4" v-if="Array.isArray(course.reviewList) && course.reviewList.length">
              <div v-for="review in course.reviewList" :key="review.id" class="border-b border-gray-100 pb-4 last:border-b-0">
                <div class="flex items-start space-x-3">
                  <NAvatar :size="40" :src="review.avatar" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <div>
                        <h4 class="font-medium text-gray-900">{{ review.name }}</h4>
                        <div class="flex items-center space-x-1 text-yellow-500">
                          <NIcon v-for="i in 5" :key="i" size="14">
                            <svg viewBox="0 0 24 24" :fill="i <= review.rating ? 'currentColor' : 'none'" stroke="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </NIcon>
                        </div>
                      </div>
                      <span class="text-sm text-gray-500">{{ review.date }}</span>
                    </div>
                    <p class="text-gray-700">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-600">暂无学员评价</div>
          </NCard>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 课程购买卡片 -->
          <NCard>
            <div class="text-center space-y-4">
              <div class="text-3xl font-bold text-blue-600">
                <span v-if="course.isFree" class="text-green-600">免费课程</span>
                <span v-else>¥{{ course.price }}</span>
              </div>
              
              <div class="space-y-3">
                <NButton type="primary" size="large" block @click="startCourse">
                  {{ (course.progress || 0) > 0 ? '继续学习' : '开始学习' }}
                </NButton>
                <NButton size="large" block ghost>
                  加入收藏
                </NButton>
              </div>
              
              <div v-if="(course.progress || 0) > 0" class="pt-4">
                <div class="text-sm text-gray-600 mb-2">学习进度</div>
                <NProgress :percentage="course.progress || 0" />
                <div class="text-xs text-gray-500 mt-1">{{ course.progress || 0 }}% 完成</div>
              </div>
            </div>
          </NCard>

          <!-- 课程信息 -->
          <NCard>
            <template #header>
              <h3 class="font-semibold">课程信息</h3>
            </template>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">难度级别:</span>
                <NBadge :value="getLevelText(course.level)" type="info" size="small" />
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">课程时长:</span>
                <span class="font-medium">{{ course.duration }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">章节数量:</span>
                <span class="font-medium">{{ course.chapters?.length || 0 }}章节</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">学习人数:</span>
                <span class="font-medium">{{ course.studentsCount }}人</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">更新时间:</span>
                <span class="font-medium">{{ formatDate(course.updatedAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">语言:</span>
                <span class="font-medium">中文/英文</span>
              </div>
            </div>
          </NCard>

          <!-- 相关课程 -->
          <NCard>
            <template #header>
              <h3 class="font-semibold">相关课程</h3>
            </template>
            <div class="space-y-3">
              <div v-for="related in relatedCourses" :key="related.id" class="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" @click="goToCourse(related.id)">
                <div class="w-16 h-12 bg-cover bg-center rounded" :style="{ backgroundImage: `url(${related.thumbnail})` }"></div>
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900 mb-1">{{ related.title }}</h4>
                  <div class="flex items-center justify-between">
                    <NBadge :value="getLevelText(related.level)" type="info" size="small" />
                    <span class="text-xs text-blue-600 font-medium">
                      {{ related.isFree ? '免费' : `¥${related.price}` }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </NCard>
        </div>
      </div>

      <!-- 课程不存在 -->
      <div v-else class="text-center py-16">
        <NIcon size="64" color="#d1d5db" class="mb-4">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </NIcon>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">课程不存在</h2>
        <p class="text-gray-600 mb-6">抱歉，您访问的课程不存在或已被删除。</p>
        <NButton type="primary" @click="$router.push('/courses')">
          返回课程列表
        </NButton>
      </div>
    </main>
  </div>
</template>

<script setup>
import { 
  NButton, NCard, NIcon, NBadge, NBreadcrumb, NBreadcrumbItem, 
  NCollapse, NCollapseItem, NProgress, NAvatar 
} from 'naive-ui'

// 获取路由参数
const route = useRoute()
const courseId = String(route.params.id)

// 使用课程管理composable
const { getCourseById, getRecommendedCourses } = useCourses()
const courseData = ref(null)
const loading = ref(false)

// 相关课程推荐
const relatedCourses = ref([])

// 获取课程数据
const course = computed(() => courseData.value || null)

// 加载课程数据
onMounted(async () => {
  loading.value = true
  try {
    courseData.value = await getCourseById(courseId)
    if (courseData.value) {
      // 使用默认推荐数量
      relatedCourses.value = await getRecommendedCourses(4)
    }
  } catch (error) {
    console.error('加载课程数据失败:', error)
  } finally {
    loading.value = false
  }
})

// SEO配置
useHead(() => ({
  title: course.value ? `${course.value.title} - SpeakEasy` : '课程不存在 - SpeakEasy',
  meta: [
    { 
      name: 'description', 
      content: course.value ? course.value.description : '课程不存在或已被删除' 
    }
  ]
}))

// 方法
const startCourse = () => {
  navigateTo(`/learn?course=${courseId}`)
}

const goToCourse = (id) => {
  navigateTo(`/courses/${id}`)
}

const enrollCourse = () => {
  // 课程注册逻辑
  console.log('注册课程:', courseId)
}

const startLearning = () => {
  // 开始学习逻辑
  navigateTo(`/learn?course=${courseId}`)
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
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
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.prose {
  line-height: 1.7;
}
</style>