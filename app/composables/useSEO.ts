import { computed } from 'vue'

// SEO配置接口
interface SEOConfig {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  siteName?: string
  locale?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

// 默认SEO配置
const defaultSEO: Required<Omit<SEOConfig, 'publishedTime' | 'modifiedTime' | 'section' | 'tags'>> = {
  title: 'SpeakEasy - AI驱动的英语口语学习平台',
  description: '专业的AI英语学习平台，提供智能对话练习、发音纠正、个性化学习路径。与AI助手Emma一起，轻松提升英语口语水平。',
  keywords: '英语学习,AI对话,口语练习,发音纠正,英语教育,在线学习,ChatGPT,语言学习',
  image: '/images/og-image.jpg',
  url: 'https://speakeasy.com',
  type: 'website',
  siteName: 'SpeakEasy',
  locale: 'zh_CN',
  author: 'SpeakEasy Team'
}

// 生成完整的SEO配置
export const useSEO = (config: SEOConfig = {}) => {
  const seoConfig = computed(() => {
    const mergedConfig = { ...defaultSEO, ...config }
    
    return {
      title: mergedConfig.title,
      titleTemplate: mergedConfig.title === defaultSEO.title ? '%s' : `%s - ${defaultSEO.siteName}`,
      meta: [
        // 基础元数据
        { name: 'description', content: mergedConfig.description },
        { name: 'keywords', content: mergedConfig.keywords },
        { name: 'author', content: mergedConfig.author },
        { name: 'robots', content: 'index, follow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        
        // Open Graph
        { property: 'og:title', content: mergedConfig.title },
        { property: 'og:description', content: mergedConfig.description },
        { property: 'og:image', content: mergedConfig.image },
        { property: 'og:url', content: mergedConfig.url },
        { property: 'og:type', content: mergedConfig.type },
        { property: 'og:site_name', content: mergedConfig.siteName },
        { property: 'og:locale', content: mergedConfig.locale },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: mergedConfig.title },
        { name: 'twitter:description', content: mergedConfig.description },
        { name: 'twitter:image', content: mergedConfig.image },
        { name: 'twitter:site', content: '@SpeakEasyApp' },
        { name: 'twitter:creator', content: '@SpeakEasyApp' },
        
        // 移动端优化
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: mergedConfig.siteName },
        
        // 主题色
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        
        // 文章特定元数据
        ...(mergedConfig.publishedTime ? [{ property: 'article:published_time', content: mergedConfig.publishedTime }] : []),
        ...(mergedConfig.modifiedTime ? [{ property: 'article:modified_time', content: mergedConfig.modifiedTime }] : []),
        ...(mergedConfig.section ? [{ property: 'article:section', content: mergedConfig.section }] : []),
        ...(mergedConfig.tags ? mergedConfig.tags.map(tag => ({ property: 'article:tag', content: tag })) : [])
      ],
      link: [
        // Canonical URL
        { rel: 'canonical', href: mergedConfig.url },
        
        // 图标
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        
        // 预连接
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://api.openai.com' },
        
        // DNS预取
        { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' }
      ],
      script: [
        // 结构化数据
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: mergedConfig.siteName,
            description: mergedConfig.description,
            url: mergedConfig.url,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${mergedConfig.url}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            },
            publisher: {
              '@type': 'Organization',
              name: mergedConfig.siteName,
              logo: {
                '@type': 'ImageObject',
                url: `${mergedConfig.url}/logo.png`
              }
            }
          })
        }
      ]
    }
  })
  
  return seoConfig
}

// 页面特定的SEO配置
export const usePageSEO = () => {
  // 首页SEO
  const getHomeSEO = () => useSEO({
    title: 'SpeakEasy - AI驱动的英语口语学习平台',
    description: '专业的AI英语学习平台，提供智能对话练习、发音纠正、个性化学习路径。与AI助手Emma一起，轻松提升英语口语水平。',
    keywords: '英语学习,AI对话,口语练习,发音纠正,英语教育,在线学习,ChatGPT,语言学习',
    url: 'https://speakeasy.com',
    type: 'website'
  })
  
  // 课程页面SEO
  const getCourseSEO = (course?: any) => useSEO({
    title: course ? `${course.title} - 英语课程` : '英语课程 - SpeakEasy',
    description: course ? course.description : '丰富的英语课程，从基础到高级，涵盖商务英语、日常对话、发音训练等多个领域。',
    keywords: '英语课程,在线学习,商务英语,日常对话,发音训练',
    url: course ? `https://speakeasy.com/courses/${course.id}` : 'https://speakeasy.com/courses',
    type: course ? 'article' : 'website',
    section: '英语课程',
    tags: course?.tags || ['英语学习', '在线课程']
  })
  
  // 学习页面SEO
  const getLearnSEO = (lesson?: any) => useSEO({
    title: lesson ? `${lesson.title} - 学习中心` : '学习中心 - SpeakEasy',
    description: lesson ? `正在学习: ${lesson.title}。通过AI助手进行互动学习，提升英语口语和听力能力。` : '智能学习中心，个性化英语学习体验，AI助手实时指导。',
    keywords: '英语学习,AI助手,互动学习,口语练习,听力训练',
    url: lesson ? `https://speakeasy.com/learn/${lesson.id}` : 'https://speakeasy.com/learn',
    type: 'article',
    section: '学习中心'
  })
  
  // AI对话页面SEO
  const getChatSEO = () => useSEO({
    title: 'AI对话练习 - SpeakEasy',
    description: '与AI助手Emma进行真实的英语对话练习，支持多种场景模拟，提升口语表达能力和语言交流技巧。',
    keywords: 'AI对话,英语对话,口语练习,场景模拟,语言交流,ChatGPT',
    url: 'https://speakeasy.com/chat',
    type: 'website'
  })
  
  // 用户中心SEO
  const getProfileSEO = () => useSEO({
    title: '个人中心 - SpeakEasy',
    description: '查看学习进度、管理课程、设置学习目标，个性化的英语学习体验。',
    keywords: '个人中心,学习进度,课程管理,学习统计',
    url: 'https://speakeasy.com/profile',
    type: 'website'
  })
  
  return {
    getHomeSEO,
    getCourseSEO,
    getLearnSEO,
    getChatSEO,
    getProfileSEO
  }
}

// 生成结构化数据
export const useStructuredData = () => {
  // 课程结构化数据
  const getCourseStructuredData = (course: any) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.description,
      provider: {
        '@type': 'Organization',
        name: 'SpeakEasy',
        url: 'https://speakeasy.com'
      },
      educationalLevel: course.level,
      courseCode: course.id,
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        instructor: {
          '@type': 'Person',
          name: 'AI助手Emma'
        }
      },
      offers: {
        '@type': 'Offer',
        price: course.price || 0,
        priceCurrency: 'CNY',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: course.rating ? {
        '@type': 'AggregateRating',
        ratingValue: course.rating,
        reviewCount: course.reviewsCount || 0,
        bestRating: 5,
        worstRating: 1
      } : undefined
    }
  }
  
  // 组织结构化数据
  const getOrganizationStructuredData = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SpeakEasy',
      url: 'https://speakeasy.com',
      logo: 'https://speakeasy.com/logo.png',
      description: '专业的AI英语学习平台',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+86-400-123-4567',
        contactType: 'customer service',
        email: 'support@speakeasy.com'
      },
      sameAs: [
        'https://twitter.com/SpeakEasyApp',
        'https://facebook.com/SpeakEasyApp',
        'https://linkedin.com/company/speakeasy'
      ]
    }
  }
  
  // 面包屑导航结构化数据
  const getBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  }
  
  return {
    getCourseStructuredData,
    getOrganizationStructuredData,
    getBreadcrumbStructuredData
  }
}

// SEO工具函数
export const useSEOUtils = () => {
  // 生成页面标题
  const generateTitle = (pageTitle: string, includesSiteName = true) => {
    return includesSiteName ? `${pageTitle} - ${defaultSEO.siteName}` : pageTitle
  }
  
  // 生成描述
  const generateDescription = (content: string, maxLength = 160) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength - 3) + '...'
  }
  
  // 生成关键词
  const generateKeywords = (keywords: string[]) => {
    return [...new Set([...keywords, ...defaultSEO.keywords.split(',')])].join(',')
  }
  
  // 生成URL
  const generateURL = (path: string) => {
    return `${defaultSEO.url}${path.startsWith('/') ? path : '/' + path}`
  }
  
  return {
    generateTitle,
    generateDescription,
    generateKeywords,
    generateURL
  }
}