import type { 
  Course, 
  CourseFilter, 
  CourseSortBy, 
  CourseSearchResult, 
  LearningProgress,
  CourseEnrollment,
  CourseReview,
  ApiResponse
} from '~/types/course'

// 课程管理的composable函数
export const useCourses = () => {
  // 响应式状态
  const courses = ref<Course[]>([])
  const currentCourse = ref<Course | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchResults = ref<CourseSearchResult | null>(null)

  // 获取所有课程
  const fetchCourses = async (params?: {
    page?: number
    pageSize?: number
    filter?: CourseFilter
    sortBy?: CourseSortBy
  }) => {
    loading.value = true
    error.value = null

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockCourses = generateMockCourses()
      
      // 应用过滤器和排序
      let filteredCourses = mockCourses
      
      if (params?.filter) {
        filteredCourses = applyFilters(filteredCourses, params.filter)
      }
      
      if (params?.sortBy) {
        filteredCourses = applySorting(filteredCourses, params.sortBy)
      }
      
      // 分页
      const page = params?.page || 1
      const pageSize = params?.pageSize || 12
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedCourses = filteredCourses.slice(startIndex, endIndex)
      
      courses.value = paginatedCourses
      searchResults.value = {
        courses: paginatedCourses,
        total: filteredCourses.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredCourses.length / pageSize),
        filters: params?.filter || {},
        sortBy: params?.sortBy || 'popularity'
      }
      
      return { success: true, data: searchResults.value }
    } catch (err) {
      error.value = '获取课程列表失败'
      console.error('获取课程失败:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 获取单个课程详情
  const fetchCourse = async (courseId: string) => {
    loading.value = true
    error.value = null

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockCourses = generateMockCourses()
      const course = mockCourses.find(c => c.id === courseId)
      
      if (!course) {
        throw new Error('课程不存在')
      }
      
      currentCourse.value = course
      return { success: true, data: course }
    } catch (err) {
      error.value = '获取课程详情失败'
      console.error('获取课程详情失败:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 搜索课程
  const searchCourses = async (query: string, filters?: CourseFilter) => {
    loading.value = true
    error.value = null

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const mockCourses = generateMockCourses()
      
      // 搜索逻辑
      let results = mockCourses.filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      
      // 应用过滤器
      if (filters) {
        results = applyFilters(results, filters)
      }
      
      courses.value = results
      searchResults.value = {
        courses: results,
        total: results.length,
        page: 1,
        pageSize: results.length,
        totalPages: 1,
        filters: filters || {},
        sortBy: 'popularity'
      }
      
      return { success: true, data: searchResults.value }
    } catch (err) {
      error.value = '搜索课程失败'
      console.error('搜索课程失败:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 通过ID获取单个课程（供详情页使用）
  const getCourseById = async (courseId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const mockCourses = generateMockCourses()
    return mockCourses.find(c => c.id === courseId) || null
  }

  // 获取全部课程列表（供课程列表页筛选/分页使用）
  const getAllCourses = async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return generateMockCourses()
  }

  // 注册课程
  const enrollCourse = async (courseId: string) => {
    loading.value = true
    error.value = null

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // 检查用户是否已登录
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        throw new Error('请先登录')
      }
      
      // 模拟注册逻辑
      const enrollment: CourseEnrollment = {
        id: `enrollment_${Date.now()}`,
        userId: userStore.user?.id || '',
        courseId,
        enrolledAt: new Date().toISOString(),
        price: 0, // 假设是免费课程
        paymentStatus: 'completed',
        progress: {
          userId: userStore.user?.id || '',
          courseId,
          status: 'not_started',
          completedLessons: [],
          progressPercentage: 0,
          totalTimeSpent: 0,
          lastAccessedAt: new Date().toISOString(),
          startedAt: new Date().toISOString(),
          certificateEarned: false
        }
      }
      
      // 保存到本地存储（模拟）
      const enrollments = JSON.parse(localStorage.getItem('courseEnrollments') || '[]')
      enrollments.push(enrollment)
      localStorage.setItem('courseEnrollments', JSON.stringify(enrollments))
      
      return { success: true, data: enrollment }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '注册课程失败'
      console.error('注册课程失败:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 获取用户已注册的课程
  const getEnrolledCourses = async () => {
    loading.value = true
    error.value = null

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        return { success: true, data: [] }
      }
      
      // 从本地存储获取注册信息
      const enrollments = JSON.parse(localStorage.getItem('courseEnrollments') || '[]')
      const userEnrollments = enrollments.filter((e: CourseEnrollment) => e.userId === userStore.user?.id)
      
      // 获取对应的课程信息
      const mockCourses = generateMockCourses()
      const enrolledCourses = userEnrollments.map((enrollment: CourseEnrollment) => {
        const course = mockCourses.find(c => c.id === enrollment.courseId)
        return {
          ...course,
          enrollment,
          progress: enrollment.progress
        }
      }).filter(Boolean)
      
      return { success: true, data: enrolledCourses }
    } catch (err) {
      error.value = '获取已注册课程失败'
      console.error('获取已注册课程失败:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 获取热门课程
  const getPopularCourses = async (limit = 6) => {
    const mockCourses = generateMockCourses()
    return mockCourses
      .filter(course => course.isPopular)
      .sort((a, b) => b.studentsCount - a.studentsCount)
      .slice(0, limit)
  }

  // 获取推荐课程
  const getRecommendedCourses = async (limit = 4) => {
    const mockCourses = generateMockCourses()
    return mockCourses
      .filter(course => course.isFeatured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  }

  return {
    // 状态
    courses: readonly(courses),
    currentCourse: readonly(currentCourse),
    loading: readonly(loading),
    error: readonly(error),
    searchResults: readonly(searchResults),
    
    // 方法
    fetchCourses,
    fetchCourse,
    searchCourses,
    getCourseById,
    getAllCourses,
    enrollCourse,
    getEnrolledCourses,
    getPopularCourses,
    getRecommendedCourses
  }
}

// 辅助函数：应用过滤器
function applyFilters(courses: Course[], filter: CourseFilter): Course[] {
  let filtered = [...courses]
  
  if (filter.level && filter.level.length > 0) {
    filtered = filtered.filter(course => filter.level!.includes(course.level))
  }
  
  if (filter.type && filter.type.length > 0) {
    filtered = filtered.filter(course => filter.type!.includes(course.type))
  }
  
  if (filter.price) {
    if (filter.price === 'free') {
      filtered = filtered.filter(course => course.isFree)
    } else if (filter.price === 'paid') {
      filtered = filtered.filter(course => !course.isFree)
    }
  }
  
  if (filter.duration) {
    if (filter.duration.min) {
      filtered = filtered.filter(course => course.duration >= filter.duration!.min!)
    }
    if (filter.duration.max) {
      filtered = filtered.filter(course => course.duration <= filter.duration!.max!)
    }
  }
  
  if (filter.rating) {
    filtered = filtered.filter(course => course.rating >= filter.rating!)
  }
  
  if (filter.tags && filter.tags.length > 0) {
    filtered = filtered.filter(course => 
      filter.tags!.some(tag => course.tags.includes(tag))
    )
  }
  
  return filtered
}

// 辅助函数：应用排序
function applySorting(courses: Course[], sortBy: CourseSortBy): Course[] {
  const sorted = [...courses]
  
  switch (sortBy) {
    case 'popularity':
      return sorted.sort((a, b) => b.studentsCount - a.studentsCount)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'price_low':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price_high':
      return sorted.sort((a, b) => b.price - a.price)
    case 'duration':
      return sorted.sort((a, b) => a.duration - b.duration)
    default:
      return sorted
  }
}

// 生成本地课程缩略图
function generateCourseThumbnail(title: string, color: string): string {
  const encodedTitle = encodeURIComponent(title.substring(0, 20))
  const svg = `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="225" viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="225" fill="${color}"/>
      <text x="200" y="120" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${title}</text>
    </svg>
  `)}`
  return svg
}

// 生成本地讲师头像
function generateInstructorAvatar(name: string): string {
  const colors = ['#10B981', '#EF4444', '#F59E0B', '#06B6D4', '#84CC16', '#8B5CF6']
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

// 生成模拟课程数据
function generateMockCourses(): Course[] {
  return [
    {
      id: '1',
      title: '英语口语基础入门',
      description: '从零开始学习英语口语，掌握基本的日常对话技能。本课程专为初学者设计，通过系统的发音练习、词汇积累和对话训练，帮助学员建立英语口语的基础。',
      shortDescription: '零基础英语口语入门课程',
      thumbnail: generateCourseThumbnail('英语口语基础入门', '#4F46E5'),
      level: 'beginner',
      type: 'speaking',
      status: 'published',
      duration: 480, // 8小时
      lessonsCount: 24,
      studentsCount: 1250,
      rating: 4.8,
      reviewsCount: 156,
      price: 0,
      isFree: true,
      isPopular: true,
      isFeatured: true,
      tags: ['口语', '发音', '日常对话', '初学者'],
      instructor: {
        id: 'instructor_1',
        name: '李老师',
        avatar: generateInstructorAvatar('李老师'),
        bio: '资深英语教师，拥有10年教学经验',
        title: '高级英语讲师',
        experience: 10,
        rating: 4.9,
        studentsCount: 5000,
        coursesCount: 12,
        specialties: ['口语教学', '发音纠正', '商务英语']
      },
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-20T10:30:00Z',
      publishedAt: '2024-01-16T09:00:00Z'
    },
    {
      id: '2',
      title: '商务英语沟通技巧',
      description: '提升职场英语沟通能力，掌握商务场景下的专业表达。课程涵盖商务会议、邮件写作、演讲技巧等实用内容。',
      shortDescription: '职场必备的商务英语技能',
      thumbnail: generateCourseThumbnail('商务英语沟通技巧', '#7C3AED'),
      level: 'intermediate',
      type: 'business',
      status: 'published',
      duration: 720, // 12小时
      lessonsCount: 36,
      studentsCount: 890,
      rating: 4.7,
      reviewsCount: 98,
      price: 299,
      isFree: false,
      isPopular: true,
      isFeatured: false,
      tags: ['商务英语', '职场沟通', '邮件写作', '演讲'],
      instructor: {
        id: 'instructor_2',
        name: '王老师',
        avatar: generateInstructorAvatar('王老师'),
        bio: '商务英语专家，曾在跨国公司工作8年',
        title: '商务英语专家',
        experience: 8,
        rating: 4.8,
        studentsCount: 3200,
        coursesCount: 8,
        specialties: ['商务英语', '跨文化交流', '职场沟通']
      },
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-18T14:20:00Z',
      publishedAt: '2024-01-12T10:00:00Z'
    },
    {
      id: '3',
      title: '雅思听力突破训练',
      description: '专门针对雅思听力考试的强化训练课程，提供真题练习和解题技巧指导。',
      shortDescription: '雅思听力高分突破',
      thumbnail: generateCourseThumbnail('雅思听力突破训练', '#059669'),
      level: 'upper-intermediate',
      type: 'exam',
      status: 'published',
      duration: 600, // 10小时
      lessonsCount: 30,
      studentsCount: 567,
      rating: 4.6,
      reviewsCount: 78,
      price: 399,
      isFree: false,
      isPopular: false,
      isFeatured: true,
      tags: ['雅思', '听力', '考试技巧', '真题练习'],
      instructor: {
        id: 'instructor_3',
        name: '张老师',
        avatar: generateInstructorAvatar('张老师'),
        bio: '雅思考试专家，帮助数百名学生取得高分',
        title: '雅思培训专家',
        experience: 12,
        rating: 4.7,
        studentsCount: 2800,
        coursesCount: 6,
        specialties: ['雅思培训', '听力教学', '考试策略']
      },
      createdAt: '2024-01-08T08:00:00Z',
      updatedAt: '2024-01-16T16:45:00Z',
      publishedAt: '2024-01-10T11:00:00Z'
    },
    {
      id: '4',
      title: '英语语法精讲',
      description: '系统学习英语语法知识，从基础到高级，配合大量练习题和实例分析。',
      shortDescription: '全面掌握英语语法体系',
      thumbnail: generateCourseThumbnail('英语语法精讲', '#DC2626'),
      level: 'elementary',
      type: 'grammar',
      status: 'published',
      duration: 540, // 9小时
      lessonsCount: 27,
      studentsCount: 1100,
      rating: 4.5,
      reviewsCount: 142,
      price: 199,
      isFree: false,
      isPopular: true,
      isFeatured: false,
      tags: ['语法', '基础知识', '练习题', '系统学习'],
      instructor: {
        id: 'instructor_1',
        name: '李老师',
        avatar: generateInstructorAvatar('李老师'),
        bio: '资深英语教师，拥有10年教学经验',
        title: '高级英语讲师',
        experience: 10,
        rating: 4.9,
        studentsCount: 5000,
        coursesCount: 12,
        specialties: ['口语教学', '发音纠正', '商务英语']
      },
      createdAt: '2024-01-05T08:00:00Z',
      updatedAt: '2024-01-14T12:30:00Z',
      publishedAt: '2024-01-07T09:30:00Z'
    },
    {
      id: '5',
      title: '英语发音纠正训练',
      description: '专业的英语发音训练课程，通过音标学习、发音练习和语音识别技术，帮助学员纠正发音问题。',
      shortDescription: '纠正发音，说出标准英语',
      thumbnail: generateCourseThumbnail('英语发音纠正训练', '#8B5CF6'),
      level: 'beginner',
      type: 'pronunciation',
      status: 'published',
      duration: 360, // 6小时
      lessonsCount: 18,
      studentsCount: 780,
      rating: 4.9,
      reviewsCount: 89,
      price: 0,
      isFree: true,
      isPopular: false,
      isFeatured: true,
      tags: ['发音', '音标', '语音识别', '纠正训练'],
      instructor: {
        id: 'instructor_4',
        name: '陈老师',
        avatar: generateInstructorAvatar('陈老师'),
        bio: '语音学专家，专注于英语发音教学',
        title: '语音学专家',
        experience: 15,
        rating: 4.9,
        studentsCount: 4200,
        coursesCount: 5,
        specialties: ['发音教学', '语音学', '口音纠正']
      },
      createdAt: '2024-01-12T08:00:00Z',
      updatedAt: '2024-01-19T11:15:00Z',
      publishedAt: '2024-01-14T10:00:00Z'
    },
    {
      id: '6',
      title: '英语词汇扩展训练',
      description: '通过科学的记忆方法和大量练习，快速扩展英语词汇量，提升语言表达能力。',
      shortDescription: '快速扩展英语词汇量',
      thumbnail: generateCourseThumbnail('英语词汇扩展训练', '#F97316'),
      level: 'intermediate',
      type: 'vocabulary',
      status: 'published',
      duration: 420, // 7小时
      lessonsCount: 21,
      studentsCount: 650,
      rating: 4.4,
      reviewsCount: 67,
      price: 149,
      isFree: false,
      isPopular: false,
      isFeatured: false,
      tags: ['词汇', '记忆方法', '词汇扩展', '练习'],
      instructor: {
        id: 'instructor_5',
        name: '刘老师',
        avatar: generateInstructorAvatar('刘老师'),
        bio: '词汇教学专家，开发多种记忆方法',
        title: '词汇教学专家',
        experience: 9,
        rating: 4.6,
        studentsCount: 2100,
        coursesCount: 7,
        specialties: ['词汇教学', '记忆方法', '语言学习策略']
      },
      createdAt: '2024-01-03T08:00:00Z',
      updatedAt: '2024-01-11T15:20:00Z',
      publishedAt: '2024-01-05T14:00:00Z'
    }
  ]
}

// 简化的用户状态管理
const useUserStore = () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const isLoggedIn = computed(() => !!user.value)
  
  return {
    user: readonly(user),
    isLoggedIn: readonly(isLoggedIn)
  }
}