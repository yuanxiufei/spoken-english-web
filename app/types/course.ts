// 课程相关的TypeScript类型定义

// 课程难度级别
export type CourseLevel = 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'proficient'

// 课程类型
export type CourseType = 'speaking' | 'listening' | 'reading' | 'writing' | 'grammar' | 'vocabulary' | 'pronunciation' | 'business' | 'exam'

// 课程状态
export type CourseStatus = 'draft' | 'published' | 'archived'

// 学习进度状态
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

// 课程基本信息
export interface Course {
  id: string
  title: string
  description: string
  shortDescription: string
  thumbnail: string
  level: CourseLevel
  type: CourseType
  status: CourseStatus
  duration: number // 预计学习时长（分钟）
  lessonsCount: number
  studentsCount: number
  rating: number
  reviewsCount: number
  price: number
  originalPrice?: number
  isFree: boolean
  isPopular: boolean
  isFeatured: boolean
  tags: string[]
  instructor: Instructor
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

// 讲师信息
export interface Instructor {
  id: string
  name: string
  avatar: string
  bio: string
  title: string
  experience: number // 教学经验年数
  rating: number
  studentsCount: number
  coursesCount: number
  specialties: string[]
  socialLinks?: {
    website?: string
    linkedin?: string
    twitter?: string
  }
}

// 课程章节
export interface Chapter {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  duration: number // 章节总时长（分钟）
  lessonsCount: number
  isLocked: boolean
  lessons: Lesson[]
}

// 课程课时
export interface Lesson {
  id: string
  chapterId: string
  courseId: string
  title: string
  description: string
  type: LessonType
  order: number
  duration: number // 课时时长（分钟）
  isLocked: boolean
  isFree: boolean
  content: LessonContent
  resources?: LessonResource[]
  quiz?: Quiz
  homework?: Homework
}

// 课时类型
export type LessonType = 'video' | 'audio' | 'text' | 'interactive' | 'quiz' | 'homework'

// 课时内容
export interface LessonContent {
  type: LessonType
  videoUrl?: string
  audioUrl?: string
  textContent?: string
  interactiveContent?: InteractiveContent
  slides?: string[] // 幻灯片图片URLs
  transcript?: string // 视频/音频转录文本
}

// 互动内容
export interface InteractiveContent {
  type: 'pronunciation' | 'conversation' | 'listening' | 'reading'
  exercises: Exercise[]
}

// 练习题
export interface Exercise {
  id: string
  type: ExerciseType
  question: string
  options?: string[] // 选择题选项
  correctAnswer: string | string[]
  explanation?: string
  audioUrl?: string // 听力题音频
  imageUrl?: string // 图片题
  points: number
}

export type ExerciseType = 'multiple_choice' | 'fill_blank' | 'true_false' | 'matching' | 'pronunciation' | 'speaking' | 'listening'

// 课时资源
export interface LessonResource {
  id: string
  title: string
  type: 'pdf' | 'doc' | 'audio' | 'video' | 'link'
  url: string
  size?: number // 文件大小（字节）
  downloadable: boolean
}

// 测验
export interface Quiz {
  id: string
  lessonId: string
  title: string
  description: string
  timeLimit?: number // 时间限制（分钟）
  passingScore: number // 及格分数
  maxAttempts: number // 最大尝试次数
  questions: QuizQuestion[]
}

// 测验题目
export interface QuizQuestion {
  id: string
  type: ExerciseType
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  points: number
  audioUrl?: string
  imageUrl?: string
}

// 作业
export interface Homework {
  id: string
  lessonId: string
  title: string
  description: string
  instructions: string
  dueDate?: string
  maxScore: number
  submissionType: 'text' | 'audio' | 'video' | 'file'
  requirements: string[]
}

// 学习进度
export interface LearningProgress {
  userId: string
  courseId: string
  status: ProgressStatus
  completedLessons: string[] // 已完成的课时ID列表
  currentLessonId?: string
  progressPercentage: number
  totalTimeSpent: number // 总学习时间（分钟）
  lastAccessedAt: string
  startedAt: string
  completedAt?: string
  certificateEarned: boolean
}

// 课程评价
export interface CourseReview {
  id: string
  courseId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  title: string
  content: string
  pros?: string[]
  cons?: string[]
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string
}

// 学习统计
export interface LearningStats {
  userId: string
  totalCoursesEnrolled: number
  totalCoursesCompleted: number
  totalLessonsCompleted: number
  totalTimeSpent: number // 总学习时间（分钟）
  currentStreak: number // 当前连续学习天数
  longestStreak: number // 最长连续学习天数
  totalPoints: number
  level: CourseLevel
  achievements: Achievement[]
  weeklyGoal: number // 每周学习目标（分钟）
  weeklyProgress: number // 本周已学习时间（分钟）
}

// 成就
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  type: 'course_completion' | 'streak' | 'time_spent' | 'quiz_score' | 'special'
  requirement: number
  points: number
  earnedAt?: string
  isEarned: boolean
}

// 课程搜索过滤器
export interface CourseFilter {
  level?: CourseLevel[]
  type?: CourseType[]
  price?: 'free' | 'paid' | 'all'
  duration?: {
    min?: number
    max?: number
  }
  rating?: number
  instructor?: string
  tags?: string[]
}

// 课程排序选项
export type CourseSortBy = 'popularity' | 'rating' | 'newest' | 'price_low' | 'price_high' | 'duration'

// 课程搜索结果
export interface CourseSearchResult {
  courses: Course[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  filters: CourseFilter
  sortBy: CourseSortBy
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

// 课程注册信息
export interface CourseEnrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  price: number
  paymentMethod?: string
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  accessExpiresAt?: string
  progress: LearningProgress
}

// 学习会话
export interface LearningSession {
  id: string
  userId: string
  courseId: string
  lessonId: string
  startedAt: string
  endedAt?: string
  duration: number // 会话时长（分钟）
  progress: {
    completed: boolean
    timeSpent: number
    interactions: number
  }
}

// 课程证书
export interface Certificate {
  id: string
  userId: string
  courseId: string
  courseName: string
  userName: string
  instructorName: string
  completedAt: string
  issuedAt: string
  certificateUrl: string
  verificationCode: string
  grade?: number
}