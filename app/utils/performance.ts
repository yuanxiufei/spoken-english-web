// 性能监控工具
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()
  private observers: PerformanceObserver[] = []

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // 初始化性能监控
  init() {
    if (typeof window === 'undefined') return

    this.observeNavigationTiming()
    this.observeLCP()
    this.observeFID()
    this.observeCLS()
    this.observeFCP()
    this.observeTTFB()
  }

  // 监控导航时间
  private observeNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0]
        this.metrics.set('domContentLoaded', entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart)
        this.metrics.set('loadComplete', entry.loadEventEnd - entry.loadEventStart)
        this.metrics.set('domInteractive', entry.domInteractive - entry.navigationStart)
      }
    }
  }

  // 监控最大内容绘制 (LCP)
  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.set('LCP', lastEntry.startTime)
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(observer)
    }
  }

  // 监控首次输入延迟 (FID)
  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.set('FID', entry.processingStart - entry.startTime)
        })
      })
      observer.observe({ entryTypes: ['first-input'] })
      this.observers.push(observer)
    }
  }

  // 监控累积布局偏移 (CLS)
  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.metrics.set('CLS', clsValue)
          }
        })
      })
      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(observer)
    }
  }

  // 监控首次内容绘制 (FCP)
  private observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.set('FCP', entry.startTime)
          }
        })
      })
      observer.observe({ entryTypes: ['paint'] })
      this.observers.push(observer)
    }
  }

  // 监控首字节时间 (TTFB)
  private observeTTFB() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0]
        this.metrics.set('TTFB', entry.responseStart - entry.requestStart)
      }
    }
  }

  // 获取所有性能指标
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }

  // 获取特定指标
  getMetric(name: string): number | undefined {
    return this.metrics.get(name)
  }

  // 记录自定义指标
  recordMetric(name: string, value: number) {
    this.metrics.set(name, value)
  }

  // 测量函数执行时间
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    this.metrics.set(name, end - start)
    return result
  }

  // 测量异步函数执行时间
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    this.metrics.set(name, end - start)
    return result
  }

  // 获取内存使用情况
  getMemoryUsage(): any {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      }
    }
    return null
  }

  // 获取网络信息
  getNetworkInfo(): any {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      }
    }
    return null
  }

  // 生成性能报告
  generateReport(): PerformanceReport {
    const metrics = this.getMetrics()
    const memory = this.getMemoryUsage()
    const network = this.getNetworkInfo()
    
    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics,
      memory,
      network,
      score: this.calculatePerformanceScore(metrics)
    }
  }

  // 计算性能评分
  private calculatePerformanceScore(metrics: Record<string, number>): number {
    let score = 100
    
    // LCP评分 (理想 < 2.5s)
    if (metrics.LCP) {
      if (metrics.LCP > 4000) score -= 30
      else if (metrics.LCP > 2500) score -= 15
    }
    
    // FID评分 (理想 < 100ms)
    if (metrics.FID) {
      if (metrics.FID > 300) score -= 25
      else if (metrics.FID > 100) score -= 10
    }
    
    // CLS评分 (理想 < 0.1)
    if (metrics.CLS) {
      if (metrics.CLS > 0.25) score -= 25
      else if (metrics.CLS > 0.1) score -= 10
    }
    
    // FCP评分 (理想 < 1.8s)
    if (metrics.FCP) {
      if (metrics.FCP > 3000) score -= 20
      else if (metrics.FCP > 1800) score -= 10
    }
    
    return Math.max(0, score)
  }

  // 发送性能数据到分析服务
  async sendToAnalytics(endpoint?: string) {
    const report = this.generateReport()
    
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(report)
        })
      } catch (error) {
        console.error('Failed to send performance data:', error)
      }
    }
    
    // 发送到Google Analytics (如果可用)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metrics', {
        custom_map: {
          metric1: 'lcp',
          metric2: 'fid',
          metric3: 'cls',
          metric4: 'fcp'
        },
        lcp: report.metrics.LCP,
        fid: report.metrics.FID,
        cls: report.metrics.CLS,
        fcp: report.metrics.FCP
      })
    }
  }

  // 清理观察者
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics.clear()
  }
}

// 性能报告接口
interface PerformanceReport {
  timestamp: number
  url: string
  userAgent: string
  metrics: Record<string, number>
  memory: any
  network: any
  score: number
}

// 图片懒加载工具
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null
  private images: Set<HTMLImageElement> = new Set()

  constructor() {
    this.init()
  }

  private init() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            this.loadImage(img)
            this.observer?.unobserve(img)
            this.images.delete(img)
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    )
  }

  observe(img: HTMLImageElement) {
    if (!this.observer) {
      this.loadImage(img)
      return
    }

    this.images.add(img)
    this.observer.observe(img)
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src
    if (src) {
      img.src = src
      img.removeAttribute('data-src')
      img.classList.add('loaded')
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
      this.images.clear()
    }
  }
}

// 资源预加载工具
export class ResourcePreloader {
  private static preloadedResources: Set<string> = new Set()

  // 预加载图片
  static preloadImage(src: string): Promise<void> {
    if (this.preloadedResources.has(src)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.preloadedResources.add(src)
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }

  // 预加载多个图片
  static async preloadImages(srcs: string[]): Promise<void> {
    const promises = srcs.map(src => this.preloadImage(src))
    await Promise.all(promises)
  }

  // 预加载CSS
  static preloadCSS(href: string): void {
    if (this.preloadedResources.has(href)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    link.onload = () => {
      this.preloadedResources.add(href)
    }
    document.head.appendChild(link)
  }

  // 预加载JavaScript
  static preloadJS(src: string): void {
    if (this.preloadedResources.has(src)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'script'
    link.href = src
    link.onload = () => {
      this.preloadedResources.add(src)
    }
    document.head.appendChild(link)
  }

  // 预取资源
  static prefetch(href: string): void {
    if (this.preloadedResources.has(href)) return

    try {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      link.onload = () => {
        this.preloadedResources.add(href)
      }
      link.onerror = (error) => {
        console.warn(`Failed to prefetch ${href}:`, error)
      }
      document.head.appendChild(link)
    } catch (error) {
      console.warn(`Error creating prefetch link for ${href}:`, error)
    }
  }
}

// 缓存管理工具
export class CacheManager {
  private static readonly CACHE_PREFIX = 'speakeasy_'
  private static readonly DEFAULT_TTL = 5 * 60 * 1000 // 5分钟

  // 设置缓存
  static set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    }
    
    try {
      localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to set cache:', error)
    }
  }

  // 获取缓存
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.CACHE_PREFIX + key)
      if (!item) return null

      const parsed = JSON.parse(item)
      const now = Date.now()
      
      if (now - parsed.timestamp > parsed.ttl) {
        this.remove(key)
        return null
      }
      
      return parsed.data
    } catch (error) {
      console.warn('Failed to get cache:', error)
      return null
    }
  }

  // 删除缓存
  static remove(key: string): void {
    try {
      localStorage.removeItem(this.CACHE_PREFIX + key)
    } catch (error) {
      console.warn('Failed to remove cache:', error)
    }
  }

  // 清空所有缓存
  static clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }

  // 获取缓存大小
  static getSize(): number {
    let size = 0
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          size += localStorage.getItem(key)?.length || 0
        }
      })
    } catch (error) {
      console.warn('Failed to get cache size:', error)
    }
    return size
  }
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}