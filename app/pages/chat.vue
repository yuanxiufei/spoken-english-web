<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 页面标题 -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">AI英语对话助手</h1>
              <p class="text-sm text-gray-600">与AI进行真实的英语对话练习，提升口语表达能力</p>
            </div>
          </div>
          
          <!-- 场景选择 -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">对话场景:</span>
              <select v-model="currentScenario" @change="switchScenario" class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="general">🗣️ 日常对话</option>
                <option value="business">🏢 商务会议</option>
                <option value="airport">✈️ 机场场景</option>
                <option value="hotel">🏨 酒店服务</option>
                <option value="restaurant">🍽️ 餐厅用餐</option>
                <option value="shopping">🛍️ 购物消费</option>
                <option value="interview">💼 求职面试</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 对话区域 -->
        <div class="lg:col-span-3">
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 h-[700px] flex flex-col overflow-hidden">
            <!-- 对话头部 -->
            <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-white">Emma - AI英语助手</h3>
                    <p class="text-sm text-white/80">{{ getScenarioDescription(currentScenario) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="flex items-center space-x-2 text-white/80">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span class="text-sm font-medium">在线</span>
                  </div>
                  <button @click="clearChat" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors">
                    🗑️ 清空
                  </button>
                </div>
              </div>
            </div>

            <!-- 消息列表 -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50">
              <!-- 欢迎消息 -->
              <div v-if="messages.length === 0" class="text-center py-16">
                <div class="relative">
                  <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-ping"></div>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-3">👋 Hello! I'm Emma</h3>
                <p class="text-lg text-gray-600 mb-4">你的AI英语对话伙伴</p>
                <div class="max-w-md mx-auto">
                  <p class="text-sm text-gray-500 mb-6">我可以帮你练习各种场景的英语对话，提升你的口语表达能力。选择一个场景开始我们的对话吧！</p>
                  <div class="grid grid-cols-2 gap-3">
                    <button @click="useQuickPrompt('Hello! How are you today?')" class="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm text-blue-700 transition-colors">
                      👋 打招呼
                    </button>
                    <button @click="useQuickPrompt('Can you help me practice job interview?')" class="p-3 bg-purple-50 hover:bg-purple-100 rounded-xl text-sm text-purple-700 transition-colors">
                      💼 面试练习
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 消息气泡 -->
              <div v-for="message in messages" :key="message.id" class="flex items-end space-x-3" :class="message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'">
                <!-- 头像 -->
                <div class="flex-shrink-0">
                  <div v-if="message.role === 'user'" class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div v-else class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                
                <!-- 消息内容 -->
                <div class="flex-1 max-w-xs lg:max-w-lg">
                  <div class="relative group">
                    <div class="px-4 py-3 rounded-2xl shadow-sm" :class="message.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-900'">
                      <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
                      <div class="flex items-center justify-between mt-2">
                        <p class="text-xs" :class="message.role === 'user' ? 'text-blue-100' : 'text-gray-400'">{{ formatTime(message.timestamp) }}</p>
                        <div v-if="message.role === 'assistant'" class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button @click="speakMessage(message.content)" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 9v6l4-3-4-3z" />
                            </svg>
                          </button>
                          <button @click="copyMessage(message.content)" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <!-- 消息尾巴 -->
                    <div class="absolute top-4" :class="message.role === 'user' ? '-right-1' : '-left-1'">
                      <div class="w-3 h-3 transform rotate-45" :class="message.role === 'user' ? 'bg-blue-500' : 'bg-white border-l border-b border-gray-200'"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 加载指示器 -->
              <div v-if="isLoading" class="flex items-end space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1 max-w-xs lg:max-w-lg">
                  <div class="relative">
                    <div class="px-4 py-3 rounded-2xl shadow-sm bg-white border border-gray-200">
                      <div class="flex items-center space-x-2">
                        <div class="flex space-x-1">
                          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                          <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        </div>
                        <span class="text-sm text-gray-500">Emma正在思考...</span>
                      </div>
                    </div>
                    <div class="absolute top-4 -left-1">
                      <div class="w-3 h-3 transform rotate-45 bg-white border-l border-b border-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 输入区域 -->
            <div class="p-6 border-t border-gray-200 bg-white">
              <!-- 快捷回复建议 -->
              <div v-if="suggestedReplies.length > 0" class="mb-4">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="reply in suggestedReplies"
                    :key="reply"
                    @click="useQuickPrompt(reply)"
                    class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    {{ reply }}
                  </button>
                </div>
              </div>
              
              <form @submit.prevent="sendMessage" class="flex items-end space-x-3">
                <!-- 语音输入按钮 -->
                <button
                  type="button"
                  @mousedown="startVoiceInput"
                  @mouseup="stopVoiceInput"
                  @mouseleave="stopVoiceInput"
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg"
                  :class="{ 'animate-pulse bg-red-500': isRecording }"
                >
                  <svg v-if="!isRecording" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <svg v-else class="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </button>
                
                <!-- 文本输入框 -->
                <div class="flex-1 relative">
                  <textarea
                    v-model="newMessage"
                    placeholder="输入你的消息... (支持多行输入)"
                    class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                    :disabled="isLoading"
                    rows="1"
                    @keydown.enter.exact.prevent="sendMessage"
                    @keydown.enter.shift.exact="newMessage += '\n'"
                    @input="adjustTextareaHeight"
                    ref="messageInput"
                  ></textarea>
                  
                  <!-- 表情按钮 -->
                  <button
                    type="button"
                    @click="toggleEmojiPicker"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                
                <!-- 发送按钮 -->
                <button
                  type="submit"
                  :disabled="!newMessage.trim() || isLoading"
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg disabled:shadow-none"
                >
                  <svg v-if="!isLoading" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <svg v-else class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </form>
              
              <!-- 输入提示 -->
              <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>按 Enter 发送，Shift + Enter 换行</span>
                <span v-if="isRecording" class="text-red-500 animate-pulse">🎤 正在录音...</span>
                <span v-else-if="newMessage.length > 0">{{ newMessage.length }}/1000</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 对话统计 -->
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">📊 对话统计</h3>
              <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">今日对话</span>
                <span class="text-lg font-bold text-blue-600">{{ todayChats }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">总消息数</span>
                <span class="text-lg font-bold text-purple-600">{{ totalMessages }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">学习时长</span>
                <span class="text-lg font-bold text-green-600">{{ studyTime }}分钟</span>
              </div>
            </div>
          </div>

          <!-- 场景快捷提示 -->
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">💡 场景提示</h3>
            <div class="space-y-3">
              <div v-for="prompt in getScenarioPrompts(currentScenario)" :key="prompt.id" class="group">
                <button
                  @click="useQuickPrompt(prompt.text)"
                  class="w-full text-left p-3 text-sm bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <div class="flex items-start space-x-3">
                    <span class="text-lg">{{ prompt.emoji }}</span>
                    <div class="flex-1">
                      <p class="font-medium text-gray-900 group-hover:text-blue-700">{{ prompt.title }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ prompt.text }}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- 学习建议 -->
          <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-blue-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">🎯 学习建议</h3>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">保持对话自然</p>
                  <p class="text-xs text-gray-600 mt-1">尽量使用完整句子，避免单词回复</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">尝试语音输入</p>
                  <p class="text-xs text-gray-600 mt-1">按住麦克风按钮练习发音</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">多样化表达</p>
                  <p class="text-xs text-gray-600 mt-1">尝试用不同方式表达同一意思</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

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
const currentScenario = ref('general')
const isLoading = ref(false)
const isRecording = ref(false)
const chatHistory = ref([])
const suggestedReplies = ref([])
const messagesContainer = ref(null)
const messageInput = ref(null)

// 统计数据
const todayChats = ref(3)
const totalMessages = ref(45)
const studyTime = ref(28)

// 场景描述
const getScenarioDescription = (scenario) => {
  const descriptions = {
    general: '日常英语对话练习',
    business: '商务会议场景模拟',
    airport: '机场服务场景练习',
    hotel: '酒店入住场景对话',
    restaurant: '餐厅用餐场景练习',
    shopping: '购物消费场景对话',
    interview: '求职面试场景模拟'
  }
  return descriptions[scenario] || descriptions.general
}

// 获取场景提示
const getScenarioPrompts = (scenario) => {
  const prompts = {
    general: [
      { id: 1, emoji: '👋', title: '打招呼', text: 'Hello! How are you today?' },
      { id: 2, emoji: '🌤️', title: '谈论天气', text: 'What\'s the weather like today?' },
      { id: 3, emoji: '🎯', title: '兴趣爱好', text: 'What do you like to do in your free time?' }
    ],
    business: [
      { id: 1, emoji: '🤝', title: '会议开场', text: 'Good morning everyone, let\'s start the meeting.' },
      { id: 2, emoji: '📊', title: '汇报工作', text: 'I\'d like to present our quarterly results.' },
      { id: 3, emoji: '💡', title: '提出建议', text: 'I have a suggestion for improving our process.' }
    ],
    airport: [
      { id: 1, emoji: '✈️', title: '办理登机', text: 'I\'d like to check in for my flight to New York.' },
      { id: 2, emoji: '🎫', title: '询问登机口', text: 'Excuse me, where is gate B12?' },
      { id: 3, emoji: '🧳', title: '行李问题', text: 'My luggage seems to be missing.' }
    ],
    hotel: [
      { id: 1, emoji: '🏨', title: '办理入住', text: 'I have a reservation under the name Smith.' },
      { id: 2, emoji: '🛎️', title: '客房服务', text: 'Could you please send someone to clean my room?' },
      { id: 3, emoji: '🍳', title: '询问早餐', text: 'What time is breakfast served?' }
    ],
    restaurant: [
      { id: 1, emoji: '🍽️', title: '预订餐桌', text: 'I\'d like to make a reservation for two people.' },
      { id: 2, emoji: '📋', title: '点餐', text: 'Could I see the menu, please?' },
      { id: 3, emoji: '💳', title: '结账', text: 'Could I have the bill, please?' }
    ],
    shopping: [
      { id: 1, emoji: '👕', title: '询问价格', text: 'How much does this shirt cost?' },
      { id: 2, emoji: '👗', title: '试穿衣服', text: 'Can I try this dress on?' },
      { id: 3, emoji: '💰', title: '讨价还价', text: 'Is there any discount available?' }
    ],
    interview: [
      { id: 1, emoji: '👤', title: '自我介绍', text: 'Could you tell me about yourself?' },
      { id: 2, emoji: '💼', title: '工作经验', text: 'What experience do you have in this field?' },
      { id: 3, emoji: '🎯', title: '职业目标', text: 'Where do you see yourself in five years?' }
    ]
  }
  return prompts[scenario] || prompts.general
}

// 生命周期
onMounted(() => {
  scrollToBottom()
})

// 方法
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function useQuickPrompt(text) {
  newMessage.value = text
  sendMessage()
}

function clearChat() {
  messages.value = []
  newMessage.value = ''
}

function switchScenario() {
  // 清空当前对话
  messages.value = []
  // 生成场景欢迎消息
  const welcomeMessage = {
    id: Date.now(),
    role: 'assistant',
    content: `欢迎来到${getScenarioDescription(currentScenario.value)}！我是Emma，你的AI英语助手。让我们开始练习吧！`,
    timestamp: new Date()
  }
  messages.value.push(welcomeMessage)
  scrollToBottom()
}

async function sendMessage() {
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
  
  scrollToBottom()
  
  // 模拟AI回复
  isLoading.value = true
  
  try {
    // 这里应该调用实际的AI API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `Thank you for your message: "${messageText}". This is a simulated AI response. In a real implementation, this would be connected to an AI service like OpenAI's GPT.`,
      timestamp: new Date()
    }
    
    messages.value.push(aiMessage)
    scrollToBottom()
    
  } catch (error) {
    console.error('发送消息失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 语音输入相关
const startVoiceInput = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    isRecording.value = true
    console.log('开始语音输入')
  } else {
    alert('您的浏览器不支持语音输入功能')
  }
}

const stopVoiceInput = () => {
  isRecording.value = false
  // 模拟语音识别结果
  setTimeout(() => {
    newMessage.value = 'Hello, this is a voice input test.'
  }, 500)
  console.log('停止语音输入')
}

// 文本转语音
const speakMessage = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  } else {
    alert('您的浏览器不支持语音播放功能')
  }
}

// 复制消息
const copyMessage = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('消息已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 调整文本框高度
const adjustTextareaHeight = () => {
  const textarea = messageInput.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
}

// 表情选择器
const showEmojiPicker = ref(false)
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}
</script>

<style scoped>
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}
</style>