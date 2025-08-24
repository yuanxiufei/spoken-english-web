<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-6">
          欢迎来到 <span class="text-yellow-300">SpeakEasy</span>
        </h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          专业的英语口语学习平台，让你轻松掌握流利英语
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            to="/courses" 
            class="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
          >
            开始学习
          </NuxtLink>
          <NuxtLink 
            to="/auth/register" 
            class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
          >
            免费注册
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
          为什么选择 SpeakEasy？
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">专业课程</h3>
            <p class="text-gray-600">由资深外教和语言专家精心设计的课程体系</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">个性化学习</h3>
            <p class="text-gray-600">根据你的水平和目标定制专属学习计划</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">快速提升</h3>
            <p class="text-gray-600">科学的学习方法，让你快速提升口语水平</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Courses Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">热门课程</h2>
          <NuxtLink 
            to="/courses" 
            class="text-blue-600 hover:text-blue-800 font-semibold"
          >
            查看全部 →
          </NuxtLink>
        </div>
        
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">加载中...</p>
        </div>
        
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard 
            v-for="course in popularCourses" 
            :key="course.id" 
            :course="course"
            @click="navigateToCourse(course.id)"
          />
        </div>
      </div>
    </section>

    <!-- Recommended Courses Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800">推荐课程</h2>
          <NuxtLink 
            to="/courses" 
            class="text-blue-600 hover:text-blue-800 font-semibold"
          >
            查看全部 →
          </NuxtLink>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CourseCard 
            v-for="course in recommendedCourses" 
            :key="course.id" 
            :course="course"
            @click="navigateToCourse(course.id)"
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-green-500 to-blue-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">准备开始你的英语学习之旅？</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          加入我们的学习社区，与全球学习者一起提升英语水平
        </p>
        <NuxtLink 
          to="/auth/register" 
          class="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
        >
          立即免费注册
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
const { getPopularCourses, getRecommendedCourses, loading } = useCourses()

// 响应式数据
const popularCourses = ref([])
const recommendedCourses = ref([])

// 页面元信息
useHead({
  title: 'SpeakEasy - 专业英语口语学习平台',
  meta: [
    {
      name: 'description',
      content: 'SpeakEasy是专业的英语口语学习平台，提供系统的口语课程、发音训练和商务英语等多种学习内容，帮助你快速提升英语水平。'
    },
    {
      name: 'keywords',
      content: '英语学习,口语训练,英语课程,在线教育,SpeakEasy'
    }
  ]
})

// 导航到课程详情页
const navigateToCourse = (courseId) => {
  navigateTo(`/courses/${courseId}`)
}

// 页面加载时获取数据
onMounted(async () => {
  try {
    popularCourses.value = await getPopularCourses(6)
    recommendedCourses.value = await getRecommendedCourses(4)
  } catch (error) {
    console.error('获取课程数据失败:', error)
  }
})
</script>