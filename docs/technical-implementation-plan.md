# SpeakEasy 技术实现方案

## 🏗️ 技术架构概览

### 当前技术栈
- **前端框架**: Nuxt 4 + Vue 3 + TypeScript
- **样式框架**: Tailwind CSS + Naive UI
- **构建工具**: Vite
- **部署**: SSR (服务端渲染)

### 推荐技术栈扩展
```typescript
// 状态管理
import { defineStore } from 'pinia'

// 动画库
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 音频处理
import WaveSurfer from 'wavesurfer.js'

// AI服务
import OpenAI from 'openai'

// 语音识别
import { SpeechRecognition } from 'web-speech-api'

// 数据库
import { createClient } from '@supabase/supabase-js'

// 认证
import { Auth } from '@supabase/auth-ui-vue'
```

## 📦 依赖包安装清单

### 核心依赖
```json
{
  "dependencies": {
    "@nuxt/image": "^1.0.0",
    "@pinia/nuxt": "^0.5.1",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-ui-vue": "^0.2.2",
    "@vueuse/nuxt": "^10.5.0",
    "gsap": "^3.12.2",
    "wavesurfer.js": "^7.3.0",
    "openai": "^4.20.0",
    "chart.js": "^4.4.0",
    "vue-chartjs": "^5.2.0",
    "@headlessui/vue": "^1.7.16",
    "@heroicons/vue": "^2.0.18",
    "date-fns": "^2.30.0",
    "lodash-es": "^4.17.21",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/uuid": "^9.0.7",
    "@types/lodash-es": "^4.17.12",
    "@typescript-eslint/eslint-plugin": "^6.12.0",
    "@typescript-eslint/parser": "^6.12.0",
    "prettier": "^3.1.0",
    "prettier-plugin-tailwindcss": "^0.5.7"
  }
}
```

### 安装命令
```bash
# 核心功能包
npm install @pinia/nuxt @vueuse/nuxt @supabase/supabase-js @supabase/auth-ui-vue

# 动画和交互
npm install gsap wavesurfer.js @headlessui/vue @heroicons/vue

# AI和语音服务
npm install openai

# 图表和数据可视化
npm install chart.js vue-chartjs

# 工具库
npm install date-fns lodash-es uuid

# 类型定义
npm install -D @types/uuid @types/lodash-es

# 代码质量工具
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier prettier-plugin-tailwindcss
```

## 🔧 核心功能实现

### 1. 状态管理 (Pinia Store)

#### 用户状态管理
```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  level: string
  totalStudyTime: number
  streakDays: number
  completedCourses: number
}

interface UserState {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null
  }),

  getters: {
    userLevel: (state) => state.user?.level || 'beginner',
    studyProgress: (state) => {
      if (!state.user) return 0
      return Math.min((state.user.totalStudyTime / 3600) * 100, 100)
    }
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      
      try {
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_ANON_KEY!
        )
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        this.user = data.user as User
        this.isLoggedIn = true
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      )
      
      await supabase.auth.signOut()
      this.user = null
      this.isLoggedIn = false
    },

    async updateStudyTime(minutes: number) {
      if (!this.user) return
      
      this.user.totalStudyTime += minutes * 60
      
      // 同步到数据库
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      )
      
      await supabase
        .from('users')
        .update({ total_study_time: this.user.totalStudyTime })
        .eq('id', this.user.id)
    }
  }
})
```

#### 学习状态管理
```typescript
// stores/learning.ts
import { defineStore } from 'pinia'

interface LearningSession {
  courseId: string
  lessonId: string
  startTime: Date
  duration: number
  progress: number
  score?: number
}

interface LearningState {
  currentSession: LearningSession | null
  recentSessions: LearningSession[]
  dailyGoal: number
  todayStudyTime: number
}

export const useLearningStore = defineStore('learning', {
  state: (): LearningState => ({
    currentSession: null,
    recentSessions: [],
    dailyGoal: 30, // 30分钟
    todayStudyTime: 0
  }),

  getters: {
    dailyProgress: (state) => {
      return Math.min((state.todayStudyTime / state.dailyGoal) * 100, 100)
    },
    
    weeklyStats: (state) => {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      return state.recentSessions
        .filter(session => new Date(session.startTime) >= weekAgo)
        .reduce((acc, session) => acc + session.duration, 0)
    }
  },

  actions: {
    startSession(courseId: string, lessonId: string) {
      this.currentSession = {
        courseId,
        lessonId,
        startTime: new Date(),
        duration: 0,
        progress: 0
      }
    },

    updateProgress(progress: number) {
      if (this.currentSession) {
        this.currentSession.progress = progress
      }
    },

    endSession(score?: number) {
      if (!this.currentSession) return
      
      const duration = Math.floor(
        (Date.now() - this.currentSession.startTime.getTime()) / 1000 / 60
      )
      
      this.currentSession.duration = duration
      this.currentSession.score = score
      
      this.recentSessions.unshift({ ...this.currentSession })
      this.todayStudyTime += duration
      
      // 保存到本地存储
      localStorage.setItem('learning-sessions', JSON.stringify(this.recentSessions))
      
      this.currentSession = null
    }
  }
})
```

### 2. AI对话功能实现

#### AI服务封装
```typescript
// composables/useAI.ts
import OpenAI from 'openai'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  audioUrl?: string
}

interface ChatSession {
  id: string
  title: string
  scenario: string
  messages: ChatMessage[]
  createdAt: Date
}

export const useAI = () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // 仅用于演示，生产环境应通过后端调用
  })

  const chatSessions = ref<ChatSession[]>([])
  const currentSession = ref<ChatSession | null>(null)
  const isLoading = ref(false)

  // 创建新的对话会话
  const createSession = (scenario: string) => {
    const session: ChatSession = {
      id: crypto.randomUUID(),
      title: `${scenario} - ${new Date().toLocaleDateString()}`,
      scenario,
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'system',
          content: getSystemPrompt(scenario),
          timestamp: new Date()
        }
      ],
      createdAt: new Date()
    }
    
    chatSessions.value.unshift(session)
    currentSession.value = session
    
    return session
  }

  // 发送消息
  const sendMessage = async (content: string) => {
    if (!currentSession.value) return
    
    // 添加用户消息
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    
    currentSession.value.messages.push(userMessage)
    isLoading.value = true
    
    try {
      // 调用OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: currentSession.value.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 150,
        temperature: 0.7
      })
      
      // 添加AI回复
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.choices[0].message.content || '',
        timestamp: new Date()
      }
      
      currentSession.value.messages.push(aiMessage)
      
      // 生成语音
      await generateSpeech(aiMessage.content, aiMessage.id)
      
    } catch (error) {
      console.error('AI对话错误:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 生成语音
  const generateSpeech = async (text: string, messageId: string) => {
    try {
      const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: text
      })
      
      const audioBlob = new Blob([await response.arrayBuffer()], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(audioBlob)
      
      // 更新消息的音频URL
      const message = currentSession.value?.messages.find(m => m.id === messageId)
      if (message) {
        message.audioUrl = audioUrl
      }
      
    } catch (error) {
      console.error('语音生成错误:', error)
    }
  }

  // 获取系统提示词
  const getSystemPrompt = (scenario: string) => {
    const prompts = {
      'business': '你是一位专业的商务英语老师，帮助学生练习商务场景对话。请用简洁、地道的英语回复，并在适当时候给出发音或用法建议。',
      'airport': '你是机场工作人员，帮助学生练习机场相关的英语对话。请模拟真实的机场场景。',
      'hotel': '你是酒店前台工作人员，帮助学生练习酒店入住、咨询等场景的英语对话。',
      'restaurant': '你是餐厅服务员，帮助学生练习点餐、咨询菜品等餐厅场景的英语对话。',
      'shopping': '你是商店销售员，帮助学生练习购物、询价、试穿等购物场景的英语对话。'
    }
    
    return prompts[scenario] || prompts['business']
  }

  return {
    chatSessions: readonly(chatSessions),
    currentSession: readonly(currentSession),
    isLoading: readonly(isLoading),
    createSession,
    sendMessage,
    generateSpeech
  }
}
```

### 3. 语音识别功能实现

#### 语音识别服务
```typescript
// composables/useSpeechRecognition.ts
export interface SpeechAnalysis {
  accuracy: number
  fluency: number
  pronunciation: number
  suggestions: string[]
  detectedText: string
}

export const useSpeechRecognition = () => {
  const isRecording = ref(false)
  const isSupported = ref(false)
  const result = ref('')
  const analysis = ref<SpeechAnalysis | null>(null)
  
  let recognition: SpeechRecognition | null = null
  let mediaRecorder: MediaRecorder | null = null
  let audioChunks: Blob[] = []

  // 初始化语音识别
  const initRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        result.value = transcript
        analyzePronounciation(transcript)
      }
      
      recognition.onerror = (event) => {
        console.error('语音识别错误:', event.error)
        isRecording.value = false
      }
      
      recognition.onend = () => {
        isRecording.value = false
      }
      
      isSupported.value = true
    }
  }

  // 开始录音
  const startRecording = async () => {
    if (!recognition) return
    
    try {
      // 获取麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // 开始录音
      mediaRecorder = new MediaRecorder(stream)
      audioChunks = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        // 可以将音频发送到服务器进行更详细的分析
        analyzeAudioBlob(audioBlob)
      }
      
      mediaRecorder.start()
      recognition.start()
      isRecording.value = true
      
    } catch (error) {
      console.error('录音启动失败:', error)
    }
  }

  // 停止录音
  const stopRecording = () => {
    if (recognition) {
      recognition.stop()
    }
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
    }
    isRecording.value = false
  }

  // 分析发音
  const analyzePronounciation = (spokenText: string) => {
    // 这里是简化的分析逻辑，实际项目中应该使用专业的语音分析API
    const targetText = 'Hello, my name is Sarah.' // 目标文本
    
    const accuracy = calculateAccuracy(targetText, spokenText)
    const fluency = calculateFluency(spokenText)
    const pronunciation = calculatePronunciation(spokenText)
    
    analysis.value = {
      accuracy,
      fluency,
      pronunciation,
      suggestions: generateSuggestions(targetText, spokenText),
      detectedText: spokenText
    }
  }

  // 计算准确度
  const calculateAccuracy = (target: string, spoken: string): number => {
    const targetWords = target.toLowerCase().split(' ')
    const spokenWords = spoken.toLowerCase().split(' ')
    
    let matches = 0
    const maxLength = Math.max(targetWords.length, spokenWords.length)
    
    for (let i = 0; i < Math.min(targetWords.length, spokenWords.length); i++) {
      if (targetWords[i] === spokenWords[i]) {
        matches++
      }
    }
    
    return Math.round((matches / maxLength) * 100)
  }

  // 计算流利度
  const calculateFluency = (text: string): number => {
    // 简化的流利度计算：基于语速和停顿
    const words = text.split(' ').length
    const duration = 5 // 假设录音时长5秒
    const wordsPerMinute = (words / duration) * 60
    
    // 正常语速约150-200词/分钟
    const normalSpeed = 175
    const speedRatio = Math.min(wordsPerMinute / normalSpeed, 1)
    
    return Math.round(speedRatio * 100)
  }

  // 计算发音质量
  const calculatePronunciation = (text: string): number => {
    // 简化的发音质量评估
    // 实际应用中需要使用专业的语音分析API
    return Math.floor(Math.random() * 20) + 80 // 80-100分
  }

  // 生成改进建议
  const generateSuggestions = (target: string, spoken: string): string[] => {
    const suggestions: string[] = []
    
    if (spoken.length < target.length * 0.8) {
      suggestions.push('尝试说得更完整一些')
    }
    
    if (!spoken.toLowerCase().includes('hello')) {
      suggestions.push('注意 "Hello" 的发音')
    }
    
    if (suggestions.length === 0) {
      suggestions.push('发音很棒！继续保持')
    }
    
    return suggestions
  }

  // 分析音频文件
  const analyzeAudioBlob = async (audioBlob: Blob) => {
    // 这里可以将音频发送到专业的语音分析服务
    // 如Azure Speech Services、Google Speech API等
    console.log('音频分析:', audioBlob)
  }

  onMounted(() => {
    initRecognition()
  })

  return {
    isRecording: readonly(isRecording),
    isSupported: readonly(isSupported),
    result: readonly(result),
    analysis: readonly(analysis),
    startRecording,
    stopRecording
  }
}
```

### 4. 数据库设计

#### Supabase数据库表结构
```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  level VARCHAR(20) DEFAULT 'beginner',
  total_study_time INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  completed_courses INTEGER DEFAULT 0,
  daily_goal INTEGER DEFAULT 1800, -- 30分钟 = 1800秒
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 课程表
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  level VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  duration INTEGER NOT NULL, -- 分钟
  price DECIMAL(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  instructor_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 课程章节表
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration INTEGER NOT NULL, -- 分钟
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 课程课时表
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content JSONB NOT NULL, -- 存储课程内容
  order_index INTEGER NOT NULL,
  duration INTEGER NOT NULL, -- 分钟
  type VARCHAR(20) DEFAULT 'text', -- text, audio, video, exercise
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户学习进度表
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed
  progress_percentage INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- 秒
  score INTEGER, -- 0-100
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 学习会话表
CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  lesson_id UUID REFERENCES lessons(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- 秒
  score INTEGER, -- 0-100
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI对话会话表
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  scenario VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI对话消息表
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户成就表
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  achievement_name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 课程评价表
CREATE TABLE course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 创建索引
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_rating ON courses(rating DESC);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
```

### 5. 环境配置

#### Nuxt配置更新
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 现有配置...
  
  // 添加新的模块
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  
  // 运行时配置
  runtimeConfig: {
    // 私有配置（仅服务端可用）
    openaiApiKey: process.env.OPENAI_API_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    // 公共配置（客户端可用）
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
  },
  
  // CSS配置
  css: [
    '~/assets/css/main.css'
  ],
  
  // 构建配置
  build: {
    transpile: ['gsap']
  },
  
  // 实验性功能
  experimental: {
    payloadExtraction: false
  },
  
  // 图片优化
  image: {
    domains: ['supabase.co', 'openai.com'],
    formats: ['webp', 'avif']
  },
  
  // PWA配置
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/'
    },
    manifest: {
      name: 'SpeakEasy - AI英语学习',
      short_name: 'SpeakEasy',
      description: 'AI驱动的英语口语学习平台',
      theme_color: '#3b82f6',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/'
    }
  }
})
```

#### 环境变量配置
```bash
# .env
# Supabase配置
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# OpenAI配置
OPENAI_API_KEY=your_openai_api_key

# 应用配置
APP_URL=http://localhost:3000
APP_ENV=development

# 其他第三方服务
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=your_azure_region
```

## 🚀 部署方案

### 1. Vercel部署
```json
// vercel.json
{
  "builds": [
    {
      "src": "nuxt.config.ts",
      "use": "@nuxtjs/vercel-builder"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_ANON_KEY": "@supabase-anon-key",
    "OPENAI_API_KEY": "@openai-api-key"
  }
}
```

### 2. Docker部署
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

### 3. CI/CD配置
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📊 性能优化

### 1. 代码分割
```typescript
// 路由级别的代码分割
const LazyLearnPage = defineAsyncComponent(() => import('~/pages/learn.vue'))
const LazyChatPage = defineAsyncComponent(() => import('~/pages/chat.vue'))

// 组件级别的代码分割
const LazyAudioPlayer = defineAsyncComponent(() => import('~/components/AudioPlayer.vue'))
const LazySpeechRecognition = defineAsyncComponent(() => import('~/components/SpeechRecognition.vue'))
```

### 2. 图片优化
```vue
<!-- 使用Nuxt Image进行优化 -->
<template>
  <NuxtImg
    :src="course.thumbnail"
    :alt="course.title"
    width="400"
    height="225"
    format="webp"
    loading="lazy"
    placeholder
    class="course-thumbnail"
  />
</template>
```

### 3. 缓存策略
```typescript
// composables/useCache.ts
export const useCache = () => {
  const cache = new Map()
  
  const get = (key: string) => {
    const item = cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expiry) {
      cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  const set = (key: string, data: any, ttl = 300000) => { // 5分钟默认TTL
    cache.set(key, {
      data,
      expiry: Date.now() + ttl
    })
  }
  
  return { get, set }
}
```

## 🧪 测试策略

### 1. 单元测试
```typescript
// tests/composables/useAI.test.ts
import { describe, it, expect, vi } from 'vitest'
import { useAI } from '~/composables/useAI'

describe('useAI', () => {
  it('should create a new chat session', () => {
    const { createSession } = useAI()
    const session = createSession('business')
    
    expect(session.scenario).toBe('business')
    expect(session.messages).toHaveLength(1)
    expect(session.messages[0].role).toBe('system')
  })
  
  it('should send message and get AI response', async () => {
    const { createSession, sendMessage } = useAI()
    
    // Mock OpenAI API
    vi.mock('openai', () => ({
      default: class {
        chat = {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: 'Hello! How can I help you?' } }]
            })
          }
        }
      }
    }))
    
    createSession('business')
    await sendMessage('Hello')
    
    // 验证消息已添加
    // ...
  })
})
```

### 2. E2E测试
```typescript
// tests/e2e/learning.spec.ts
import { test, expect } from '@playwright/test'

test('learning flow', async ({ page }) => {
  await page.goto('/learn')
  
  // 检查页面加载
  await expect(page.locator('h1')).toContainText('学习中心')
  
  // 开始学习
  await page.click('[data-testid="start-lesson"]')
  
  // 检查音频播放器
  await expect(page.locator('[data-testid="audio-player"]')).toBeVisible()
  
  // 测试语音录制
  await page.click('[data-testid="record-button"]')
  await page.waitForTimeout(2000)
  await page.click('[data-testid="stop-button"]')
  
  // 检查分析结果
  await expect(page.locator('[data-testid="analysis-result"]')).toBeVisible()
})
```

## 📈 监控和分析

### 1. 错误监控
```typescript
// plugins/sentry.client.ts
import * as Sentry from '@sentry/vue'

export default defineNuxtPlugin((nuxtApp) => {
  Sentry.init({
    app: nuxtApp.vueApp,
    dsn: 'your-sentry-dsn',
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
  })
})
```

### 2. 性能监控
```typescript
// composables/useAnalytics.ts
export const useAnalytics = () => {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties)
    }
    
    // 自定义分析
    console.log('Analytics:', eventName, properties)
  }
  
  const trackPageView = (path: string) => {
    trackEvent('page_view', { page_path: path })
  }
  
  const trackLearningSession = (duration: number, score?: number) => {
    trackEvent('learning_session_complete', {
      duration,
      score,
      timestamp: Date.now()
    })
  }
  
  return {
    trackEvent,
    trackPageView,
    trackLearningSession
  }
}
```

---

**文档版本**: v1.0  
**创建日期**: 2024年1月  
**技术负责人**: 开发团队  
**审核状态**: 待审核
