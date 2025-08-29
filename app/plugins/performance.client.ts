import { PerformanceMonitor, LazyImageLoader, ResourcePreloader } from '~/utils/performance'

export default defineNuxtPlugin(() => {
  // 初始化性能监控
  const performanceMonitor = PerformanceMonitor.getInstance()
  performanceMonitor.init()

  // 初始化懒加载
  const lazyLoader = new LazyImageLoader()

  // 页面加载完成后发送性能数据
  if (process.client) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        // 发送性能数据到分析服务
        performanceMonitor.sendToAnalytics('/api/analytics/performance')
        
        // 预加载关键资源
        ResourcePreloader.preloadImages([
          '/images/hero-bg.jpg',
          '/images/course-placeholder.jpg'
        ])
      }, 2000) // 等待2秒确保所有指标都被收集
    })

    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
      performanceMonitor.cleanup()
      lazyLoader.disconnect()
    })

    // 监听路由变化
    const router = useRouter()
    router.afterEach((to) => {
      // 记录路由切换时间
      performanceMonitor.recordMetric('routeChange', performance.now())
      
      // 暂时禁用页面预取，避免在Nuxt中出现路由错误
      // TODO: 实现更适合Nuxt的预取策略
      // if (to.path === '/') {
      //   ResourcePreloader.prefetch('/courses')
      //   ResourcePreloader.prefetch('/learn')
      // } else if (to.path === '/courses') {
      //   ResourcePreloader.prefetch('/learn')
      //   ResourcePreloader.prefetch('/chat')
      // }
    })
  }

  // 提供全局访问
  return {
    provide: {
      performanceMonitor,
      lazyLoader
    }
  }
})