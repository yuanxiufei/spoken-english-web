<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-24 overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div class="absolute top-40 right-20 w-24 h-24 bg-yellow-300 rounded-full animate-bounce"></div>
        <div class="absolute bottom-20 left-1/4 w-16 h-16 bg-green-300 rounded-full animate-ping"></div>
      </div>
      
      <div class="container mx-auto px-4 text-center relative z-10">
        <div class="animate-fade-in-up">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            欢迎来到 <span class="text-yellow-300 animate-pulse">SpeakEasy</span>
          </h1>
          <p class="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            🎯 专业的AI驱动英语口语学习平台<br>
            🚀 让你轻松掌握流利英语，开启国际化职业生涯
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink 
              to="/courses" 
              class="group bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <svg class="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              开始学习
            </NuxtLink>
            <NuxtLink 
              to="/auth/register" 
              class="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              免费注册
            </NuxtLink>
          </div>
          
          <!-- 统计数据 -->
          <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-yellow-300">10,000+</div>
              <div class="text-sm text-gray-200">活跃学员</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-yellow-300">500+</div>
              <div class="text-sm text-gray-200">精品课程</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-yellow-300">98%</div>
              <div class="text-sm text-gray-200">满意度</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-yellow-300">24/7</div>
              <div class="text-sm text-gray-200">在线支持</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4 text-gray-800">
            为什么选择 <span class="text-blue-600">SpeakEasy</span>？
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            我们致力于为每位学员提供最优质的英语学习体验
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div class="group text-center p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800">🎓 专业课程</h3>
            <p class="text-gray-600 leading-relaxed">由资深外教和语言专家精心设计的课程体系，涵盖从基础到高级的全方位内容</p>
            <div class="mt-4 text-blue-600 font-semibold">100+ 专业课程</div>
          </div>
          
          <div class="group text-center p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100">
            <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800">🤖 AI智能学习</h3>
            <p class="text-gray-600 leading-relaxed">基于AI技术的个性化学习系统，根据你的水平和目标定制专属学习计划</p>
            <div class="mt-4 text-green-600 font-semibold">智能推荐算法</div>
          </div>
          
          <div class="group text-center p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100">
            <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800">⚡ 快速提升</h3>
            <p class="text-gray-600 leading-relaxed">科学的学习方法和实时反馈系统，让你在最短时间内看到明显进步</p>
            <div class="mt-4 text-purple-600 font-semibold">平均30天见效</div>
          </div>
        </div>
        
        <!-- 额外特性 -->
        <div class="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center p-6 bg-gray-50 rounded-xl">
            <div class="text-3xl mb-2">🎯</div>
            <div class="font-semibold text-gray-800">精准发音</div>
            <div class="text-sm text-gray-600">AI语音识别</div>
          </div>
          <div class="text-center p-6 bg-gray-50 rounded-xl">
            <div class="text-3xl mb-2">💬</div>
            <div class="font-semibold text-gray-800">实时对话</div>
            <div class="text-sm text-gray-600">智能聊天机器人</div>
          </div>
          <div class="text-center p-6 bg-gray-50 rounded-xl">
            <div class="text-3xl mb-2">📊</div>
            <div class="font-semibold text-gray-800">学习分析</div>
            <div class="text-sm text-gray-600">详细进度报告</div>
          </div>
          <div class="text-center p-6 bg-gray-50 rounded-xl">
            <div class="text-3xl mb-2">🏆</div>
            <div class="font-semibold text-gray-800">成就系统</div>
            <div class="text-sm text-gray-600">激励学习动力</div>
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

// CourseCard组件内部已处理点击导航

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

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 1s ease-out;
}

/* 自定义动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 渐变文字效果 */
.gradient-text {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* 卡片悬停效果 */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 按钮脉冲效果 */
.btn-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .8;
  }
}
</style>