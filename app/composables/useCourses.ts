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
  // 使用静态占位图避免SSR水合问题
  return '/images/course-placeholder.svg'
}

// 生成本地讲师头像
function generateInstructorAvatar(name: string): string {
  // 使用静态头像避免SSR水合问题
  return '/images/instructor-placeholder.svg'
}

// 生成模拟课程数据
function generateMockCourses(): Course[] {
  return [
    {
      id: '1',
      title: '英语口语基础入门',
      description: '从零开始学习英语口语，掌握基本的日常对话技能。本课程专为初学者设计，通过系统的发音练习、词汇积累和对话训练，帮助学员建立英语口语的基础。',
      shortDescription: '零基础英语口语入门课程',
      thumbnail: '/images/course-placeholder.svg',
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
      thumbnail: '/images/course-placeholder.svg',
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
      thumbnail: '/images/course-placeholder.svg',
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
      thumbnail: '/images/course-placeholder.svg',
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
      thumbnail: '/images/course-placeholder.svg',
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
      thumbnail: '/images/course-placeholder.svg',
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
    },
    {
      id: '7',
      title: '托福口语高分策略',
      description: '针对托福口语考试的专项训练，包含独立口语和综合口语的答题技巧，配合真题练习和模拟考试。',
      shortDescription: '托福口语考试专项突破',
      thumbnail: generateCourseThumbnail('托福口语高分策略', '#0891B2'),
      level: 'advanced',
      type: 'exam',
      status: 'published',
      duration: 720, // 12小时
      lessonsCount: 36,
      studentsCount: 423,
      rating: 4.8,
      reviewsCount: 52,
      price: 599,
      isFree: false,
      isPopular: true,
      isFeatured: true,
      tags: ['托福', '口语考试', '高分策略', '真题练习'],
      instructor: {
        id: 'instructor_6',
        name: '赵老师',
        avatar: generateInstructorAvatar('赵老师'),
        bio: '托福满分获得者，专业托福培训师',
        title: '托福培训专家',
        experience: 8,
        rating: 4.9,
        studentsCount: 1800,
        coursesCount: 4,
        specialties: ['托福培训', '口语考试', '考试策略']
      },
      createdAt: '2024-01-20T08:00:00Z',
      updatedAt: '2024-01-25T09:30:00Z',
      publishedAt: '2024-01-22T10:00:00Z'
    },
    {
      id: '8',
      title: '日常英语对话实战',
      description: '模拟真实生活场景的英语对话训练，涵盖购物、餐厅、旅行、医院等各种日常情境。',
      shortDescription: '生活场景英语对话训练',
      thumbnail: generateCourseThumbnail('日常英语对话实战', '#16A34A'),
      level: 'elementary',
      type: 'conversation',
      status: 'published',
      duration: 480, // 8小时
      lessonsCount: 24,
      studentsCount: 920,
      rating: 4.6,
      reviewsCount: 115,
      price: 0,
      isFree: true,
      isPopular: true,
      isFeatured: false,
      tags: ['日常对话', '生活英语', '情境训练', '实用口语'],
      instructor: {
        id: 'instructor_7',
        name: '孙老师',
        avatar: generateInstructorAvatar('孙老师'),
        bio: '生活英语专家，擅长情境教学',
        title: '实用英语讲师',
        experience: 7,
        rating: 4.7,
        studentsCount: 3500,
        coursesCount: 9,
        specialties: ['生活英语', '情境对话', '实用口语']
      },
      createdAt: '2024-01-18T08:00:00Z',
      updatedAt: '2024-01-23T14:15:00Z',
      publishedAt: '2024-01-20T11:00:00Z'
    },
    {
      id: '9',
      title: '英语写作技巧提升',
      description: '从基础写作到高级写作技巧，包括段落结构、论证方法、修辞手法等，适合各个水平的学习者。',
      shortDescription: '全面提升英语写作能力',
      thumbnail: generateCourseThumbnail('英语写作技巧提升', '#7C2D12'),
      level: 'intermediate',
      type: 'writing',
      status: 'published',
      duration: 600, // 10小时
      lessonsCount: 30,
      studentsCount: 567,
      rating: 4.5,
      reviewsCount: 73,
      price: 249,
      isFree: false,
      isPopular: false,
      isFeatured: true,
      tags: ['写作技巧', '段落结构', '论证方法', '修辞手法'],
      instructor: {
        id: 'instructor_8',
        name: '周老师',
        avatar: generateInstructorAvatar('周老师'),
        bio: '英语写作专家，出版多本写作教材',
        title: '写作教学专家',
        experience: 12,
        rating: 4.8,
        studentsCount: 2600,
        coursesCount: 6,
        specialties: ['英语写作', '学术写作', '创意写作']
      },
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-21T16:45:00Z',
      publishedAt: '2024-01-17T09:30:00Z'
    },
    {
      id: '10',
      title: '英语听力理解训练',
      description: '通过多样化的听力材料和练习，提升英语听力理解能力，包括新闻、对话、讲座等不同类型。',
      shortDescription: '全方位英语听力训练',
      thumbnail: generateCourseThumbnail('英语听力理解训练', '#9333EA'),
      level: 'intermediate',
      type: 'listening',
      status: 'published',
      duration: 540, // 9小时
      lessonsCount: 27,
      studentsCount: 734,
      rating: 4.7,
      reviewsCount: 91,
      price: 199,
      isFree: false,
      isPopular: true,
      isFeatured: false,
      tags: ['听力训练', '理解能力', '新闻英语', '对话练习'],
      instructor: {
        id: 'instructor_9',
        name: '吴老师',
        avatar: generateInstructorAvatar('吴老师'),
        bio: '听力教学专家，开发多套听力训练方法',
        title: '听力训练专家',
        experience: 10,
        rating: 4.8,
        studentsCount: 2900,
        coursesCount: 8,
        specialties: ['听力教学', '语音识别', '听力策略']
      },
      createdAt: '2024-01-12T08:00:00Z',
      updatedAt: '2024-01-19T13:20:00Z',
      publishedAt: '2024-01-14T15:00:00Z'
    },
    {
      id: '11',
      title: '商务英语邮件写作',
      description: '专门针对商务邮件写作的课程，涵盖各种商务场景下的邮件格式、用词和表达方式。',
      shortDescription: '掌握专业商务邮件写作',
      thumbnail: generateCourseThumbnail('商务英语邮件写作', '#DC2626'),
      level: 'upper-intermediate',
      type: 'business',
      status: 'published',
      duration: 360, // 6小时
      lessonsCount: 18,
      studentsCount: 445,
      rating: 4.6,
      reviewsCount: 58,
      price: 179,
      isFree: false,
      isPopular: false,
      isFeatured: false,
      tags: ['商务邮件', '邮件写作', '商务沟通', '职场英语'],
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
      createdAt: '2024-01-08T08:00:00Z',
      updatedAt: '2024-01-16T11:30:00Z',
      publishedAt: '2024-01-10T14:00:00Z'
    },
    {
      id: '12',
      title: '英语阅读理解技巧',
      description: '提升英语阅读速度和理解能力，学习各种阅读策略和技巧，适用于学术和日常阅读。',
      shortDescription: '快速提升英语阅读能力',
      thumbnail: generateCourseThumbnail('英语阅读理解技巧', '#059669'),
      level: 'elementary',
      type: 'reading',
      status: 'published',
      duration: 420, // 7小时
      lessonsCount: 21,
      studentsCount: 812,
      rating: 4.4,
      reviewsCount: 96,
      price: 0,
      isFree: true,
      isPopular: false,
      isFeatured: true,
      tags: ['阅读理解', '阅读技巧', '阅读速度', '理解策略'],
      instructor: {
        id: 'instructor_10',
        name: '郑老师',
        avatar: generateInstructorAvatar('郑老师'),
        bio: '阅读教学专家，专注于阅读策略研究',
        title: '阅读教学专家',
        experience: 11,
        rating: 4.6,
        studentsCount: 2400,
        coursesCount: 7,
        specialties: ['阅读教学', '阅读策略', '文本分析']
      },
      createdAt: '2024-01-06T08:00:00Z',
      updatedAt: '2024-01-13T10:45:00Z',
      publishedAt: '2024-01-08T12:00:00Z'
    },
    {
      id: '13',
      title: '英语面试技巧训练',
      description: '专门为求职面试设计的英语训练课程，包括自我介绍、常见问题回答、面试礼仪等。',
      shortDescription: '英语面试必备技能训练',
      thumbnail: generateCourseThumbnail('英语面试技巧训练', '#B91C1C'),
      level: 'intermediate',
      type: 'interview',
      status: 'published',
      duration: 300, // 5小时
      lessonsCount: 15,
      studentsCount: 356,
      rating: 4.8,
      reviewsCount: 42,
      price: 299,
      isFree: false,
      isPopular: true,
      isFeatured: true,
      tags: ['面试技巧', '求职英语', '自我介绍', '面试礼仪'],
      instructor: {
        id: 'instructor_11',
        name: '马老师',
        avatar: generateInstructorAvatar('马老师'),
        bio: 'HR专家转型英语教师，深谙面试技巧',
        title: '面试培训专家',
        experience: 6,
        rating: 4.9,
        studentsCount: 1500,
        coursesCount: 3,
        specialties: ['面试培训', '求职指导', '职场英语']
      },
      createdAt: '2024-01-22T08:00:00Z',
      updatedAt: '2024-01-26T15:30:00Z',
      publishedAt: '2024-01-24T10:30:00Z'
    },
    {
      id: '14',
      title: '英语演讲与表达',
      description: '提升英语公众演讲能力，学习演讲技巧、肢体语言、声音控制等，建立自信的表达能力。',
      shortDescription: '自信英语演讲技能培养',
      thumbnail: generateCourseThumbnail('英语演讲与表达', '#7C3AED'),
      level: 'advanced',
      type: 'speaking',
      status: 'published',
      duration: 480, // 8小时
      lessonsCount: 24,
      studentsCount: 289,
      rating: 4.9,
      reviewsCount: 35,
      price: 399,
      isFree: false,
      isPopular: false,
      isFeatured: true,
      tags: ['演讲技巧', '公众表达', '肢体语言', '自信建立'],
      instructor: {
        id: 'instructor_12',
        name: '林老师',
        avatar: generateInstructorAvatar('林老师'),
        bio: 'TED演讲者，专业演讲培训师',
        title: '演讲培训大师',
        experience: 14,
        rating: 4.9,
        studentsCount: 1200,
        coursesCount: 5,
        specialties: ['演讲培训', '表达技巧', '自信建立']
      },
      createdAt: '2024-01-25T08:00:00Z',
      updatedAt: '2024-01-28T12:15:00Z',
      publishedAt: '2024-01-27T09:00:00Z'
    },
    {
      id: '15',
      title: '旅游英语实用指南',
      description: '为旅行者量身定制的英语课程，涵盖机场、酒店、餐厅、购物、问路等旅游场景。',
      shortDescription: '旅行必备英语技能',
      thumbnail: generateCourseThumbnail('旅游英语实用指南', '#EA580C'),
      level: 'beginner',
      type: 'travel',
      status: 'published',
      duration: 360, // 6小时
      lessonsCount: 18,
      studentsCount: 678,
      rating: 4.5,
      reviewsCount: 84,
      price: 0,
      isFree: true,
      isPopular: true,
      isFeatured: false,
      tags: ['旅游英语', '旅行对话', '实用场景', '出国必备'],
      instructor: {
        id: 'instructor_13',
        name: '黄老师',
        avatar: generateInstructorAvatar('黄老师'),
        bio: '资深导游转型英语教师，旅游英语专家',
        title: '旅游英语专家',
        experience: 9,
        rating: 4.7,
        studentsCount: 2800,
        coursesCount: 6,
        specialties: ['旅游英语', '文化交流', '实用对话']
      },
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-17T14:20:00Z',
      publishedAt: '2024-01-12T11:30:00Z'
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