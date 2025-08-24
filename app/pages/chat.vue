<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-blue-600">
              SpeakEasy
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">首页</NuxtLink>
            <NuxtLink to="/courses" class="text-gray-600 hover:text-gray-900">课程</NuxtLink>
            <NuxtLink to="/learn" class="text-gray-600 hover:text-gray-900">学习</NuxtLink>
            <NuxtLink to="/chat" class="text-blue-600 font-medium">AI对话</NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 对话区域 -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
            <!-- 对话头部 -->
            <div class="p-4 border-b bg-gray-50 rounded-t-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">AI英语助手</h3>
                    <p class="text-sm text-gray-500">{{ currentModel }} - {{ isConnected ? '已连接' : '未连接' }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <select v-model="currentModel" @change="switchModel" class="text-sm border rounded px-2 py-1">
                    <option value="gpt-3.5-turbo">ChatGPT 3.5</option>
                    <option value="gpt-4">ChatGPT 4</option>
                    <option value="deepseek-chat">DeepSeek Chat</option>
                  </select>
                  <button @click="clearChat" class="text-sm text-red-600 hover:text-red-800">
                    清空对话
                  </button>
                </div>
              </div>
            </div>

            <!-- 消息列表 -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
              <div v-if="messages.length === 0" class="text-center text-gray-500 mt-20">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p class="text-lg font-medium mb-2">开始与AI助手对话</p>
                <p class="text-sm">你可以问我任何关于英语学习的问题</p>
              </div>
              
              <div v-for="message in messages" :key="message.id" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
                <div class="max-w-xs lg:max-w-md" :class="message.role === 'user' ? 'order-2' : 'order-1'">
                  <div class="px-4 py-2 rounded-lg" :class="message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'">
                    <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
                    <p class="text-xs mt-1 opacity-70">{{ formatTime(message.timestamp) }}</p>
                  </div>
                </div>
                <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="message.role === 'user' ? 'order-1 mr-2 bg-blue-500' : 'order-2 ml-2 bg-gray-300'">
                  <svg v-if="message.role === 'user'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              
              <!-- 加载指示器 -->
              <div v-if="isLoading" class="flex justify-start">
                <div class="max-w-xs lg:max-w-md">
                  <div class="px-4 py-2 rounded-lg bg-gray-100">
                    <div class="flex space-x-1">
                      <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                      <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 输入区域 -->
            <div class="p-4 border-t bg-gray-50">
              <form @submit.prevent="sendMessage" class="flex space-x-2">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="输入你的问题..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="isLoading"
                />
                <button
                  type="submit"
                  :disabled="!newMessage.trim() || isLoading"
                  class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="lg:col-span-1">
          <!-- 快捷提示 -->
          <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <h3 class="font-medium text-gray-900 mb-3">快捷提示</h3>
            <div class="space-y-2">
              <button
                v-for="prompt in quickPrompts"
                :key="prompt.id"
                @click="useQuickPrompt(prompt.text)"
                class="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
              >
                {{ prompt.text }}
              </button>
            </div>
          </div>

          <!-- 对话历史 -->
          <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <h3 class="font-medium text-gray-900 mb-3">对话历史</h3>
            <div class="space-y-2">
              <div v-if="chatHistory.length === 0" class="text-sm text-gray-500">
                暂无历史记录
              </div>
              <div
                v-for="chat in chatHistory.slice(0, 5)"
                :key="chat.id"
                @click="loadChatHistory(chat)"
                class="p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border cursor-pointer transition-colors"
              >
                <p class="font-medium truncate">{{ chat.title }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(chat.timestamp) }}</p>
              </div>
            </div>
          </div>

          <!-- 设置 -->
          <div class="bg-white rounded-lg shadow-sm border p-4">
            <h3 class="font-medium text-gray-900 mb-3">设置</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">API密钥</label>
                <input
                  v-model="apiKey"
                  type="password"
                  placeholder="输入API密钥"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">温度设置</label>
                <input
                  v-model="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  class="w-full"
                />
                <div class="flex justify-between text-xs text-gray-500">
                  <span>保守</span>
                  <span>{{ temperature }}</span>
                  <span>创新</span>
                </div>
              </div>
              <button
                @click="saveSettings"
                class="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

// SEO配置
useHead({
  title: 'AI对话 - SpeakEasy英语学习平台',
  meta: [
    { name: 'description', content: '与AI助手进行英语对话练习，提升口语和写作能力' },
    { name: 'keywords', content: 'AI对话,英语练习,ChatGPT,DeepSeek,英语学习' }
  ]
})

// 响应式数据
const messages = ref([])
const newMessage = ref('')
const isLoading = ref(false)
const isConnected = ref(false)
const currentModel = ref('gpt-3.5-turbo')
const apiKey = ref('')
const temperature = ref(0.7)
const messagesContainer = ref(null)

// 对话历史
const chatHistory = ref([])

// 快捷提示
const quickPrompts = ref([
  { id: 1, text: '帮我纠正这句话的语法错误' },
  { id: 2, text: '解释这个单词的用法' },
  { id: 3, text: '给我一些日常对话的例句' },
  { id: 4, text: '如何提高英语口语?' },
  { id: 5, text: '推荐一些英语学习资源' }
])

// 生命周期
onMounted(() => {
  loadSettings()
  loadChatHistoryFromStorage()
  checkConnection()
})

// 方法
const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return
  
  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: newMessage.value,
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  const messageText = newMessage.value
  newMessage.value = ''
  
  await scrollToBottom()
  
  try {
    isLoading.value = true
    const response = await callAI(messageText)
    
    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }
    
    messages.value.push(aiMessage)
    await scrollToBottom()
    
    // 保存对话到历史记录
    saveChatToHistory()
    
  } catch (error) {
    console.error('AI调用失败:', error)
    const errorMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '抱歉，AI服务暂时不可用，请稍后再试。',
      timestamp: new Date()
    }
    messages.value.push(errorMessage)
    await scrollToBottom()
  } finally {
    isLoading.value = false
  }
}

const callAI = async (message) => {
  // 使用模拟AI回复，不调用真实API
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000)) // 模拟网络延迟
  
  return generateMockAIResponse(message, currentModel.value)
}

// 生成模拟AI回复
const generateMockAIResponse = (message, model) => {
  const responses = {
    'gpt-3.5-turbo': [
      '这是一个很好的英语学习问题！让我来帮助你。',
      '根据你的问题，我建议你可以从以下几个方面来提升英语水平：',
      '这个语法点确实比较复杂，让我用简单的例子来解释。',
      '你的英语学习思路很正确，继续保持这种学习态度！',
      '关于这个单词的用法，有几个要点需要注意：'
    ],
    'gpt-4': [
      '这是一个深度的英语学习问题，让我详细分析一下。',
      '从语言学角度来看，你提到的这个问题涉及到几个重要概念。',
      '我建议你采用系统性的学习方法来解决这个问题。',
      '这个问题的核心在于理解英语的语言逻辑和表达习惯。',
      '让我为你提供一个全面的学习策略和具体的练习建议。'
    ],
    'deepseek-chat': [
      '作为你的英语学习助手，我很高兴为你解答这个问题。',
      '这个问题涉及到英语学习的核心技能，让我来详细说明。',
      '基于我的分析，你可以通过以下方法来改善：',
      '你的学习方向是正确的，我建议你继续深入练习。',
      '这是一个常见的英语学习难点，很多学习者都会遇到。'
    ]
  }
  
  const modelResponses = responses[model] || responses['gpt-3.5-turbo']
  const randomResponse = modelResponses[Math.floor(Math.random() * modelResponses.length)]
  
  // 根据用户消息内容生成更相关的回复
  if (message.toLowerCase().includes('语法')) {
    return `${randomResponse}\n\n关于语法学习，我建议：\n1. 先掌握基础语法规则\n2. 通过大量例句来理解用法\n3. 在实际对话中练习应用\n\n你还有什么具体的语法问题吗？`
  } else if (message.toLowerCase().includes('单词') || message.toLowerCase().includes('词汇')) {
    return `${randomResponse}\n\n词汇学习的有效方法：\n1. 联想记忆法\n2. 词根词缀分析\n3. 在语境中学习\n4. 定期复习巩固\n\n建议每天学习10-15个新单词，并及时复习。`
  } else if (message.toLowerCase().includes('口语') || message.toLowerCase().includes('发音')) {
    return `${randomResponse}\n\n提升口语的关键步骤：\n1. 模仿标准发音\n2. 大声朗读练习\n3. 录音对比纠正\n4. 多与他人对话\n\n记住，口语需要持续练习才能提高！`
  } else {
    return `${randomResponse}\n\n如果你有更具体的英语学习问题，欢迎随时问我。我可以帮助你解决语法、词汇、口语、听力等各方面的问题。`
  }
}

// 模拟API调用已被generateMockAIResponse函数替代

const useQuickPrompt = (prompt) => {
  newMessage.value = prompt
}

const clearChat = () => {
  messages.value = []
}

const switchModel = () => {
  checkConnection()
}

const checkConnection = async () => {
  // 检查API连接状态
  isConnected.value = !!apiKey.value
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

const saveChatToHistory = () => {
  if (messages.value.length > 0) {
    const chat = {
      id: Date.now(),
      title: messages.value[0].content.substring(0, 20) + '...',
      messages: [...messages.value],
      timestamp: new Date()
    }
    
    chatHistory.value.unshift(chat)
    if (chatHistory.value.length > 10) {
      chatHistory.value = chatHistory.value.slice(0, 10)
    }
    
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory.value))
  }
}

const loadChatHistory = (chat) => {
  messages.value = [...chat.messages]
  scrollToBottom()
}

const loadChatHistoryFromStorage = () => {
  const stored = localStorage.getItem('chatHistory')
  if (stored) {
    chatHistory.value = JSON.parse(stored)
  }
}

const saveSettings = () => {
  const settings = {
    apiKey: apiKey.value,
    temperature: temperature.value,
    currentModel: currentModel.value
  }
  localStorage.setItem('aiChatSettings', JSON.stringify(settings))
  checkConnection()
  alert('设置已保存')
}

const loadSettings = () => {
  const stored = localStorage.getItem('aiChatSettings')
  if (stored) {
    const settings = JSON.parse(stored)
    apiKey.value = settings.apiKey || ''
    temperature.value = settings.temperature || 0.7
    currentModel.value = settings.currentModel || 'gpt-3.5-turbo'
  }
}
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 动画效果 */
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}
</style>