import { ref, reactive, readonly } from 'vue'

// 全局加载状态
interface LoadingState {
  isLoading: boolean
  loadingText: string
  loadingSubtext: string
  showProgress: boolean
  progress: number
  showCancel: boolean
}

// 全局错误状态
interface ErrorState {
  showError: boolean
  errorType: 'network' | 'server' | 'client' | 'validation' | 'permission' | 'unknown'
  errorTitle: string
  errorMessage: string
  errorDetails: string
  showRetry: boolean
  showReload: boolean
  showSupport: boolean
  showDetails: boolean
  suggestions: string[]
}

// 通知状态
interface NotificationState {
  show: boolean
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  duration: number
  actions?: Array<{
    label: string
    action: () => void
  }>
}

// 全局状态
const globalLoading = reactive<LoadingState>({
  isLoading: false,
  loadingText: '加载中...',
  loadingSubtext: '请稍候',
  showProgress: false,
  progress: 0,
  showCancel: false
})

const globalError = reactive<ErrorState>({
  showError: false,
  errorType: 'unknown',
  errorTitle: '出现错误',
  errorMessage: '抱歉，发生了意外错误，请稍后重试。',
  errorDetails: '',
  showRetry: true,
  showReload: false,
  showSupport: true,
  showDetails: true,
  suggestions: []
})

const globalNotification = reactive<NotificationState>({
  show: false,
  type: 'info',
  title: '',
  message: '',
  duration: 3000,
  actions: []
})

// 加载状态管理
export const useGlobalLoading = () => {
  const showLoading = (
    text: string = '加载中...',
    subtext: string = '请稍候',
    options: Partial<LoadingState> = {}
  ) => {
    globalLoading.isLoading = true
    globalLoading.loadingText = text
    globalLoading.loadingSubtext = subtext
    Object.assign(globalLoading, options)
  }

  const hideLoading = () => {
    globalLoading.isLoading = false
    globalLoading.progress = 0
  }

  const updateProgress = (progress: number) => {
    globalLoading.progress = Math.max(0, Math.min(100, progress))
    globalLoading.showProgress = true
  }

  const setLoadingText = (text: string, subtext?: string) => {
    globalLoading.loadingText = text
    if (subtext) {
      globalLoading.loadingSubtext = subtext
    }
  }

  return {
    loading: readonly(globalLoading),
    showLoading,
    hideLoading,
    updateProgress,
    setLoadingText
  }
}

// 错误状态管理
export const useGlobalError = () => {
  const showError = (
    message: string,
    options: Partial<ErrorState> = {}
  ) => {
    globalError.showError = true
    globalError.errorMessage = message
    Object.assign(globalError, options)
  }

  const hideError = () => {
    globalError.showError = false
    // 重置错误状态
    setTimeout(() => {
      Object.assign(globalError, {
        errorType: 'unknown',
        errorTitle: '出现错误',
        errorMessage: '抱歉，发生了意外错误，请稍后重试。',
        errorDetails: '',
        showRetry: true,
        showReload: false,
        showSupport: true,
        showDetails: true,
        suggestions: []
      })
    }, 300)
  }

  const showNetworkError = (details?: string) => {
    showError('网络连接失败，请检查您的网络连接', {
      errorType: 'network',
      errorTitle: '网络错误',
      errorDetails: details || '',
      suggestions: [
        '检查网络连接是否正常',
        '尝试刷新页面',
        '稍后重试'
      ]
    })
  }

  const showServerError = (details?: string) => {
    showError('服务器暂时无法响应，请稍后重试', {
      errorType: 'server',
      errorTitle: '服务器错误',
      errorDetails: details || '',
      showReload: true,
      suggestions: [
        '稍后重试',
        '刷新页面',
        '联系技术支持'
      ]
    })
  }

  const showValidationError = (message: string, details?: string) => {
    showError(message, {
      errorType: 'validation',
      errorTitle: '数据验证失败',
      errorDetails: details || '',
      showRetry: false,
      showSupport: false,
      suggestions: [
        '检查输入的数据格式',
        '确保所有必填字段已填写',
        '重新提交表单'
      ]
    })
  }

  const showPermissionError = (details?: string) => {
    showError('您没有权限执行此操作', {
      errorType: 'permission',
      errorTitle: '权限不足',
      errorDetails: details || '',
      showRetry: false,
      suggestions: [
        '请联系管理员获取权限',
        '确认您已登录',
        '检查账户状态'
      ]
    })
  }

  return {
    error: readonly(globalError),
    showError,
    hideError,
    showNetworkError,
    showServerError,
    showValidationError,
    showPermissionError
  }
}

// 通知管理
export const useGlobalNotification = () => {
  let notificationTimer: NodeJS.Timeout | null = null

  const showNotification = (
    message: string,
    type: NotificationState['type'] = 'info',
    options: Partial<NotificationState> = {}
  ) => {
    // 清除之前的定时器
    if (notificationTimer) {
      clearTimeout(notificationTimer)
    }

    globalNotification.show = true
    globalNotification.message = message
    globalNotification.type = type
    Object.assign(globalNotification, options)

    // 自动隐藏
    if (globalNotification.duration > 0) {
      notificationTimer = setTimeout(() => {
        hideNotification()
      }, globalNotification.duration)
    }
  }

  const hideNotification = () => {
    globalNotification.show = false
    if (notificationTimer) {
      clearTimeout(notificationTimer)
      notificationTimer = null
    }
  }

  const showSuccess = (message: string, title?: string) => {
    showNotification(message, 'success', {
      title: title || '操作成功',
      duration: 3000
    })
  }

  const showWarning = (message: string, title?: string) => {
    showNotification(message, 'warning', {
      title: title || '注意',
      duration: 4000
    })
  }

  const showErrorNotification = (message: string, title?: string) => {
    showNotification(message, 'error', {
      title: title || '错误',
      duration: 5000
    })
  }

  const showInfo = (message: string, title?: string) => {
    showNotification(message, 'info', {
      title: title || '提示',
      duration: 3000
    })
  }

  return {
    notification: readonly(globalNotification),
    showNotification,
    hideNotification,
    showSuccess,
    showWarning,
    showErrorNotification,
    showInfo
  }
}

// HTTP 请求拦截器
export const useApiInterceptor = () => {
  const { showLoading, hideLoading } = useGlobalLoading()
  const { showNetworkError, showServerError } = useGlobalError()
  const { showErrorNotification } = useGlobalNotification()

  const handleRequest = (config: any) => {
    // 显示加载状态
    if (!config.silent) {
      showLoading('请求中...', '正在处理您的请求')
    }
    return config
  }

  const handleResponse = (response: any) => {
    hideLoading()
    return response
  }

  const handleError = (error: any) => {
    hideLoading()
    
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      showNetworkError(error.message)
    } else if (error.response?.status >= 500) {
      showServerError(`服务器错误 (${error.response.status}): ${error.response.statusText}`)
    } else if (error.response?.status === 401) {
      showErrorNotification('登录已过期，请重新登录')
      // 可以在这里处理登录跳转
    } else if (error.response?.status === 403) {
      showErrorNotification('权限不足，无法访问此资源')
    } else {
      showErrorNotification(error.response?.data?.message || '请求失败，请稍后重试')
    }
    
    return Promise.reject(error)
  }

  return {
    handleRequest,
    handleResponse,
    handleError
  }
}

// 全局状态组合
export const useGlobalState = () => {
  const loading = useGlobalLoading()
  const error = useGlobalError()
  const notification = useGlobalNotification()
  const apiInterceptor = useApiInterceptor()

  return {
    ...loading,
    ...error,
    ...notification,
    ...apiInterceptor
  }
}