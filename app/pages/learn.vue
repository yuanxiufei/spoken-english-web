<template>
  <div class="min-h-screen bg-gray-50">

    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8 mt-10">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- 左侧学习内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 课程信息 -->
          <NCard>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ currentLesson?.title || '加载中...' }}</h1>
                <p class="text-gray-600">{{ currentLesson?.description || '正在加载课程内容' }}</p>
              </div>
              <NBadge :value="currentLesson?.type || '课程'" type="info" />
            </div>
            <NProgress :percentage="lessonProgress" class="mb-4" />
            <div class="text-sm text-gray-500">
              第 {{ currentLessonIndex + 1 }} 课 / 共 {{ lessons.length }} 课
            </div>
          </NCard>

          <!-- 学习内容区域 -->
          <NCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">学习内容</h2>
                <div class="flex items-center space-x-2">
                  <NButton size="small" @click="previousLesson" :disabled="currentLessonIndex === 0">
                    上一课
                  </NButton>
                  <NButton size="small" @click="nextLesson" :disabled="currentLessonIndex === lessons.length - 1">
                    下一课
                  </NButton>
                </div>
              </div>
            </template>
            
            <div class="space-y-6">
              <!-- 文本内容 -->
              <div class="bg-blue-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-3">{{ currentLesson?.content?.title || '学习内容' }}</h3>
                <p class="text-gray-700 text-lg leading-relaxed mb-4">
                  {{ currentLesson?.content?.text || '正在加载学习内容...' }}
                </p>
                <div class="flex items-center space-x-4">
                  <NButton 
                    type="primary" 
                    @click="speakText" 
                    :loading="isSpeaking"
                    :disabled="!speechSupported"
                  >
                    <template #icon>
                      <NIcon>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                      </NIcon>
                    </template>
                    {{ isSpeaking ? '播放中...' : '播放语音' }}
                  </NButton>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-600">语速:</span>
                    <NSlider 
                      v-model:value="speechRate" 
                      :min="0.5" 
                      :max="2" 
                      :step="0.1" 
                      class="w-24"
                    />
                    <span class="text-sm text-gray-600">{{ speechRate }}x</span>
                  </div>
                </div>
              </div>

              <!-- 发音练习 -->
              <div class="bg-green-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-3">发音练习</h3>
                <p class="text-gray-600 mb-4">请跟读上面的内容，我们会分析你的发音</p>
                
                <div class="space-y-4">
                  <div class="flex items-center justify-center space-x-4">
                    <NButton 
                      :type="isRecording ? 'error' : 'success'"
                      size="large"
                      @click="toggleRecording"
                      :disabled="!speechSupported"
                    >
                      <template #icon>
                        <NIcon size="20">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path v-if="!isRecording" d="M12 14q-1.25 0-2.125-.875T9 11V5q0-1.25.875-2.125T12 2q1.25 0 2.125.875T15 5v6q0 1.25-.875 2.125T12 14Zm-1 7v-3.075q-2.6-.35-4.3-2.325Q5 13.625 5 11h2q0 2.075 1.463 3.537Q9.925 16 12 16t3.538-1.463Q17 13.075 17 11h2q0 2.625-1.7 4.6q-1.7 1.975-4.3 2.325V21Z"/>
                            <path v-else d="M6 6h12v12H6z"/>
                          </svg>
                        </NIcon>
                      </template>
                      {{ isRecording ? '停止录音' : '开始录音' }}
                    </NButton>
                  </div>
                  
                  <!-- 录音状态指示器 -->
                  <div v-if="isRecording" class="text-center">
                    <div class="inline-flex items-center space-x-2 text-red-600">
                      <div class="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      <span class="font-medium">正在录音...</span>
                    </div>
                  </div>
                  
                  <!-- 识别结果 -->
                  <div v-if="recognitionResult" class="bg-white p-4 rounded-lg border">
                    <h4 class="font-semibold mb-2">识别结果:</h4>
                    <p class="text-gray-700 mb-3">{{ recognitionResult }}</p>
                    
                    <!-- 发音评分 -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-600">发音评分:</span>
                        <NProgress 
                          type="circle" 
                          :percentage="pronunciationScore" 
                          :size="40"
                          :stroke-width="8"
                        />
                        <span class="font-semibold" :class="getScoreColor(pronunciationScore)">
                          {{ pronunciationScore }}分
                        </span>
                      </div>
                      <NButton size="small" @click="clearResult">
                        重新录音
                      </NButton>
                    </div>
                    
                    <!-- 改进建议 -->
                    <div v-if="pronunciationFeedback" class="mt-3 p-3 bg-yellow-50 rounded">
                      <h5 class="text-sm font-semibold text-yellow-800 mb-1">改进建议:</h5>
                      <p class="text-sm text-yellow-700">{{ pronunciationFeedback }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 语法要点 -->
              <div v-if="currentLesson.grammar" class="bg-purple-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold mb-3">语法要点</h3>
                <div class="space-y-3">
                  <div v-for="point in currentLesson?.grammar || []" :key="point.title">
                    <h4 class="font-medium text-purple-800">{{ point.title }}</h4>
                    <p class="text-gray-700">{{ point.explanation }}</p>
                    <div v-if="point.examples" class="mt-2">
                      <span class="text-sm text-gray-600">例句: </span>
                      <span class="italic">{{ point.examples.join(', ') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NCard>
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <!-- 学习统计 -->
          <NCard>
            <template #header>
              <h3 class="font-semibold">学习统计</h3>
            </template>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">今日学习时间</span>
                <span class="font-semibold">{{ studyStats.todayTime }}分钟</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">连续学习天数</span>
                <span class="font-semibold">{{ studyStats.streakDays }}天</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">完成课程数</span>
                <span class="font-semibold">{{ studyStats.completedLessons }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">平均发音分数</span>
                <span class="font-semibold">{{ studyStats.avgScore }}分</span>
              </div>
            </div>
          </NCard>

          <!-- 课程列表 -->
          <NCard>
            <template #header>
              <h3 class="font-semibold">课程列表</h3>
            </template>
            <div class="space-y-2">
              <div 
                v-for="(lesson, index) in lessons" 
                :key="index"
                class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors"
                :class="index === currentLessonIndex ? 'bg-blue-100 border border-blue-200' : 'hover:bg-gray-50'"
                @click="selectLesson(index)"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                       :class="index === currentLessonIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h4 class="text-sm font-medium">{{ lesson.title }}</h4>
                    <p class="text-xs text-gray-500">{{ lesson.duration }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-1">
                  <NIcon v-if="lesson.completed" size="16" color="#10b981">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </NIcon>
                </div>
              </div>
            </div>
          </NCard>

          <!-- 快捷操作 -->
          <NCard>
            <template #header>
              <h3 class="font-semibold">快捷操作</h3>
            </template>
            <div class="space-y-3">
              <NButton block @click="markAsCompleted" :disabled="currentLesson?.completed">
                标记为已完成
              </NButton>
              <NButton block ghost @click="addToFavorites">
                添加到收藏
              </NButton>
              <NButton block ghost @click="reportIssue">
                报告问题
              </NButton>
            </div>
          </NCard>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { 
  NButton, NCard, NIcon, NBadge, NProgress, NSlider
} from 'naive-ui'

// SEO配置
useHead({
  title: '学习中心 - SpeakEasy',
  meta: [
    { name: 'description', content: '在SpeakEasy学习中心进行英语口语练习，使用AI语音识别技术提升发音水平。' },
    { name: 'keywords', content: '英语学习,语音识别,发音练习,TTS,口语训练' }
  ]
})

// 响应式数据
const currentLessonIndex = ref(0)
const speechRate = ref(1.0)
const isRecording = ref(false)
const isSpeaking = ref(false)
const recognitionResult = ref('')
const pronunciationScore = ref(0)
const pronunciationFeedback = ref('')
const speechSupported = ref(false)

// 语音识别和合成对象
let speechSynthesis = null
let speechRecognition = null

// 课程数据
const lessons = ref([
  {
    id: 1,
    title: '基础问候语',
    description: '学习日常生活中最常用的问候表达',
    type: '对话练习',
    duration: '15分钟',
    completed: false,
    content: {
      title: 'Daily Greetings',
      text: 'Hello! How are you today? I am fine, thank you. Nice to meet you. Have a great day!'
    },
    grammar: [
      {
        title: '问候语的使用',
        explanation: 'Hello是最常用的问候语，适用于任何时间和场合。',
        examples: ['Hello, John!', 'Hello, how are you?']
      },
      {
        title: '回应问候',
        explanation: '当别人问"How are you?"时，常见回答有"I am fine"、"I am good"等。',
        examples: ['I am fine, thank you.', 'I am doing well.']
      }
    ]
  },
  {
    id: 2,
    title: '自我介绍',
    description: '学习如何用英语进行自我介绍',
    type: '口语练习',
    duration: '20分钟',
    completed: false,
    content: {
      title: 'Self Introduction',
      text: 'My name is Sarah. I am from China. I am a student. I like reading books and listening to music. Nice to meet you!'
    },
    grammar: [
      {
        title: '自我介绍的结构',
        explanation: '通常包括姓名、来源地、职业和兴趣爱好。',
        examples: ['My name is...', 'I am from...', 'I work as...']
      }
    ]
  },
  {
    id: 3,
    title: '购物对话',
    description: '学习在商店购物时的英语表达',
    type: '情景对话',
    duration: '25分钟',
    completed: false,
    content: {
      title: 'Shopping Conversation',
      text: 'Excuse me, how much is this shirt? It costs twenty dollars. Can I try it on? Sure, the fitting room is over there.'
    },
    grammar: [
      {
        title: '询问价格',
        explanation: '使用"How much is...?"来询问价格。',
        examples: ['How much is this?', 'How much does it cost?']
      }
    ]
  }
])

// 学习统计数据
const studyStats = ref({
  todayTime: 45,
  streakDays: 7,
  completedLessons: 12,
  avgScore: 85
})

// 计算属性
const currentLesson = computed(() => lessons.value[currentLessonIndex.value])
const lessonProgress = computed(() => {
  const completed = lessons.value.filter(lesson => lesson.completed).length
  return Math.round((completed / lessons.value.length) * 100)
})

// 生命周期
onMounted(() => {
  initSpeechAPIs()
})

// 方法
const initSpeechAPIs = () => {
  // 检查浏览器支持
  if ('speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis
    speechSupported.value = true
  }
  
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    speechRecognition = new SpeechRecognition()
    
    speechRecognition.continuous = false
    speechRecognition.interimResults = false
    speechRecognition.lang = 'en-US'
    
    speechRecognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      recognitionResult.value = result
      analyzePronunciation(result)
      isRecording.value = false
    }
    
    speechRecognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      isRecording.value = false
    }
    
    speechRecognition.onend = () => {
      isRecording.value = false
    }
  }
}

const speakText = () => {
  if (!speechSynthesis || isSpeaking.value || !currentLesson.value?.content?.text) return
  
  const utterance = new SpeechSynthesisUtterance(currentLesson.value.content.text)
  utterance.rate = speechRate.value
  utterance.lang = 'en-US'
  
  utterance.onstart = () => {
    isSpeaking.value = true
  }
  
  utterance.onend = () => {
    isSpeaking.value = false
  }
  
  speechSynthesis.speak(utterance)
}

const toggleRecording = () => {
  if (!speechRecognition) {
    alert('您的浏览器不支持语音识别功能')
    return
  }
  
  if (isRecording.value) {
    speechRecognition.stop()
  } else {
    recognitionResult.value = ''
    pronunciationScore.value = 0
    pronunciationFeedback.value = ''
    speechRecognition.start()
    isRecording.value = true
  }
}

const analyzePronunciation = (spokenText) => {
  if (!currentLesson.value?.content?.text) return
  
  const originalText = currentLesson.value.content.text.toLowerCase()
  const spoken = spokenText.toLowerCase()
  
  // 简单的相似度计算（实际项目中应使用更复杂的算法）
  const similarity = calculateSimilarity(originalText, spoken)
  pronunciationScore.value = Math.round(similarity * 100)
  
  // 生成反馈
  if (pronunciationScore.value >= 90) {
    pronunciationFeedback.value = '发音非常棒！继续保持！'
  } else if (pronunciationScore.value >= 70) {
    pronunciationFeedback.value = '发音不错，可以尝试说得更清晰一些。'
  } else if (pronunciationScore.value >= 50) {
    pronunciationFeedback.value = '发音需要改进，建议多听多练。'
  } else {
    pronunciationFeedback.value = '建议先听标准发音，然后慢慢跟读。'
  }
}

const calculateSimilarity = (str1, str2) => {
  // 简化的相似度计算
  const words1 = str1.split(' ')
  const words2 = str2.split(' ')
  const commonWords = words1.filter(word => words2.includes(word))
  return commonWords.length / Math.max(words1.length, words2.length)
}

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const clearResult = () => {
  recognitionResult.value = ''
  pronunciationScore.value = 0
  pronunciationFeedback.value = ''
}

const selectLesson = (index) => {
  currentLessonIndex.value = index
  clearResult()
}

const previousLesson = () => {
  if (currentLessonIndex.value > 0) {
    currentLessonIndex.value--
    clearResult()
  }
}

const nextLesson = () => {
  if (currentLessonIndex.value < lessons.value.length - 1) {
    currentLessonIndex.value++
    clearResult()
  }
}

const markAsCompleted = () => {
  lessons.value[currentLessonIndex.value].completed = true
  studyStats.value.completedLessons++
}

const addToFavorites = () => {
  // 实现添加到收藏功能
  alert('已添加到收藏')
}

const reportIssue = () => {
  // 实现报告问题功能
  alert('感谢您的反馈')
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
