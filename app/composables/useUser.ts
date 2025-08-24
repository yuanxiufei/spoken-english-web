import { ref, computed } from 'vue'

// 用户类型定义
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  level: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced'
  points: number
  joinDate: string
  lastLoginDate: string
  preferences: {
    language: string
    notifications: boolean
    theme: 'light' | 'dark'
  }
  profile: {
    bio: string
    goals: string[]
    interests: string[]
    timezone: string
  }
  stats: {
    coursesCompleted: number
    totalStudyTime: number // 分钟
    streakDays: number
    achievements: string[]
  }
}

// 生成本地用户头像
function generateUserAvatar(name: string): string {
  if (!name) return '/default-avatar.svg'
  
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const colorIndex = name.charCodeAt(0) % colors.length
  const bgColor = colors[colorIndex]
  
  const svg = `data:image/svg+xml;base64,${btoa(`
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="${bgColor}"/>
      <text x="50" y="60" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="36" font-weight="bold">${initials}</text>
    </svg>
  `)}`
  
  return svg
}

// 生成模拟用户数据
function generateMockUsers(): User[] {
  return [
    {
      id: '1',
      name: '演示用户',
      email: 'demo@speakeasy.com',
      avatar: generateUserAvatar('演示用户'),
      level: 'intermediate',
      points: 1250,
      joinDate: '2024-01-15T08:00:00Z',
      lastLoginDate: new Date().toISOString(),
      preferences: {
        language: 'zh-CN',
        notifications: true,
        theme: 'light'
      },
      profile: {
        bio: '我是一名英语学习爱好者，希望通过SpeakEasy提升我的英语水平。',
        goals: ['提升口语能力', '通过雅思考试', '商务英语沟通'],
        interests: ['旅游', '商务', '日常对话', '学术英语'],
        timezone: 'Asia/Shanghai'
      },
      stats: {
        coursesCompleted: 3,
        totalStudyTime: 1200, // 20小时
        streakDays: 15,
        achievements: ['初学者', '坚持学习7天', '完成第一门课程', '口语练习达人']
      }
    },
    {
      id: '2',
      name: '张小明',
      email: 'zhangxiaoming@example.com',
      avatar: generateUserAvatar('张小明'),
      level: 'beginner',
      points: 580,
      joinDate: '2024-01-20T10:30:00Z',
      lastLoginDate: '2024-01-25T14:20:00Z',
      preferences: {
        language: 'zh-CN',
        notifications: true,
        theme: 'light'
      },
      profile: {
        bio: '刚开始学习英语，希望能够掌握基本的日常对话。',
        goals: ['掌握基础语法', '日常对话流利'],
        interests: ['日常对话', '旅游英语'],
        timezone: 'Asia/Shanghai'
      },
      stats: {
        coursesCompleted: 1,
        totalStudyTime: 360, // 6小时
        streakDays: 5,
        achievements: ['新手上路', '完成第一课']
      }
    },
    {
      id: '3',
      name: '李雅思',
      email: 'liyasi@example.com',
      avatar: generateUserAvatar('李雅思'),
      level: 'upper-intermediate',
      points: 2100,
      joinDate: '2024-01-10T09:15:00Z',
      lastLoginDate: '2024-01-25T16:45:00Z',
      preferences: {
        language: 'zh-CN',
        notifications: true,
        theme: 'dark'
      },
      profile: {
        bio: '正在准备雅思考试，目标是获得7分以上的成绩。',
        goals: ['雅思7分', '学术英语写作', '听力突破'],
        interests: ['雅思考试', '学术英语', '听力训练'],
        timezone: 'Asia/Shanghai'
      },
      stats: {
        coursesCompleted: 5,
        totalStudyTime: 1800, // 30小时
        streakDays: 25,
        achievements: ['学习达人', '坚持学习30天', '雅思专家', '听力高手', '完成5门课程']
      }
    }
  ]
}

export const useUser = () => {
  // 当前用户状态
  const currentUser = ref<User | null>(null)
  const isLoggedIn = computed(() => currentUser.value !== null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 从本地存储加载用户信息
  const loadUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        currentUser.value = JSON.parse(storedUser)
      }
    } catch (err) {
      console.error('Failed to load user from storage:', err)
    }
  }

  // 保存用户信息到本地存储
  const saveUserToStorage = (user: User) => {
    try {
      localStorage.setItem('user', JSON.stringify(user))
      currentUser.value = user
    } catch (err) {
      console.error('Failed to save user to storage:', err)
    }
  }

  // 模拟登录
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟登录验证
      if (email === 'demo@speakeasy.com' && password === '123456') {
        const mockUsers = generateMockUsers()
        const user = mockUsers.find(u => u.email === email)
        if (user) {
          // 更新最后登录时间
          user.lastLoginDate = new Date().toISOString()
          saveUserToStorage(user)
          localStorage.setItem('token', 'demo-jwt-token-' + Date.now())
          return { success: true, user, token: 'demo-jwt-token-' + Date.now() }
        }
      }

      // 其他测试账户
      const testAccounts = [
        { email: 'zhangxiaoming@example.com', password: '123456' },
        { email: 'liyasi@example.com', password: '123456' }
      ]

      const testAccount = testAccounts.find(acc => acc.email === email && acc.password === password)
      if (testAccount) {
        const mockUsers = generateMockUsers()
        const user = mockUsers.find(u => u.email === email)
        if (user) {
          user.lastLoginDate = new Date().toISOString()
          saveUserToStorage(user)
          localStorage.setItem('token', 'test-jwt-token-' + Date.now())
          return { success: true, user, token: 'test-jwt-token-' + Date.now() }
        }
      }

      throw new Error('邮箱或密码错误')
    } catch (err) {
      error.value = err instanceof Error ? err.message : '登录失败'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 模拟注册
  const register = async (userData: { name: string; email: string; password: string }) => {
    isLoading.value = true
    error.value = null

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 检查邮箱是否已存在
      const mockUsers = generateMockUsers()
      const existingUser = mockUsers.find(u => u.email === userData.email)
      if (existingUser) {
        throw new Error('该邮箱已被注册')
      }

      // 创建新用户
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        avatar: generateUserAvatar(userData.name),
        level: 'beginner',
        points: 0,
        joinDate: new Date().toISOString(),
        lastLoginDate: new Date().toISOString(),
        preferences: {
          language: 'zh-CN',
          notifications: true,
          theme: 'light'
        },
        profile: {
          bio: '',
          goals: [],
          interests: [],
          timezone: 'Asia/Shanghai'
        },
        stats: {
          coursesCompleted: 0,
          totalStudyTime: 0,
          streakDays: 0,
          achievements: ['新手上路']
        }
      }

      saveUserToStorage(newUser)
      localStorage.setItem('token', 'new-user-token-' + Date.now())
      return { success: true, user: newUser, token: 'new-user-token-' + Date.now() }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '注册失败'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 退出登录
  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // 更新用户信息
  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser.value) return { success: false, error: '用户未登录' }

    isLoading.value = true
    error.value = null

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800))

      const updatedUser = { ...currentUser.value, ...updates }
      saveUserToStorage(updatedUser)
      return { success: true, user: updatedUser }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新失败'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 获取用户统计信息
  const getUserStats = () => {
    if (!currentUser.value) return null
    return currentUser.value.stats
  }

  // 添加积分
  const addPoints = (points: number) => {
    if (!currentUser.value) return
    currentUser.value.points += points
    saveUserToStorage(currentUser.value)
  }

  // 更新学习时间
  const updateStudyTime = (minutes: number) => {
    if (!currentUser.value) return
    currentUser.value.stats.totalStudyTime += minutes
    saveUserToStorage(currentUser.value)
  }

  // 添加成就
  const addAchievement = (achievement: string) => {
    if (!currentUser.value) return
    if (!currentUser.value.stats.achievements.includes(achievement)) {
      currentUser.value.stats.achievements.push(achievement)
      saveUserToStorage(currentUser.value)
    }
  }

  // 初始化时加载用户信息
  if (process.client) {
    loadUserFromStorage()
  }

  return {
    // 状态
    currentUser: readonly(currentUser),
    isLoggedIn,
    isLoading: readonly(isLoading),
    error: readonly(error),

    // 方法
    login,
    register,
    logout,
    updateProfile,
    getUserStats,
    addPoints,
    updateStudyTime,
    addAchievement,
    loadUserFromStorage,

    // 工具函数
    generateUserAvatar
  }
}

// 导出类型
export type { User }