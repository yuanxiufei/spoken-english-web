// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },

  // 路由配置
  router: {
    options: {
      strict: false
    }
  },

  // 添加路由配置
  routeRules: {
    // 首页预渲染
    '/': { prerender: true },
    // 静态页面
    '/about': { prerender: true },
    '/privacy': { prerender: true },
    '/terms': { prerender: true },
    // 课程页面ISR
    '/courses/**': { isr: 60 },
    // API路由
    '/api/**': { cors: true },
    // 管理页面SPA
    '/admin/**': { ssr: false }
  },

  // 添加这个配置
  features: {
    inlineStyles: false
  },

  // 服务器配置
  experimental: {
    asyncContext: true,
    payloadExtraction: false
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/tailwindcss"
  ],
  
  // Vite 配置
  vite: {
    plugins: [tsconfigPaths()],
    optimizeDeps: {
      include: [
        'naive-ui',
        'vueuc',
        '@css-render/vue3-ssr',
        '@juggle/resize-observer'
      ]
    },
    ssr: {
      noExternal: ['naive-ui', '@css-render/vue3-ssr', 'vueuc']
    }
  },

  // 构建配置
  build: {
    transpile: [
      'naive-ui',
      'vueuc',
      '@css-render/vue3-ssr'
    ]
  },

  // 运行时配置
  runtimeConfig: {
    // 私有配置（仅服务端可用）
    openaiApiKey: process.env.OPENAI_API_KEY,
    
    // 公共配置（客户端可用）
    public: {
      siteUrl: process.env.SITE_URL || 'https://speakeasy.com',
      siteName: 'SpeakEasy',
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
      environment: process.env.NODE_ENV || 'development'
    }
  },

  // SEO 和性能优化配置
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
      title: 'SpeakEasy - AI驱动的英语口语学习平台',
      titleTemplate: '%s - SpeakEasy',
      meta: [
        // 基础SEO
        { name: 'description', content: '专业的AI英语学习平台，提供智能对话练习、发音纠正、个性化学习路径。与AI助手Emma一起，轻松提升英语口语水平。' },
        { name: 'keywords', content: '英语学习,AI对话,口语练习,发音纠正,英语教育,在线学习,ChatGPT,语言学习' },
        { name: 'author', content: 'SpeakEasy Team' },
        { name: 'robots', content: 'index, follow' },
        { name: 'language', content: 'zh-CN' },
        
        // Open Graph
        { property: 'og:title', content: 'SpeakEasy - AI驱动的英语口语学习平台' },
        { property: 'og:description', content: '专业的AI英语学习平台，提供智能对话练习、发音纠正、个性化学习路径。' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'SpeakEasy' },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:image', content: '/images/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'SpeakEasy - AI英语学习平台' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@SpeakEasyApp' },
        { name: 'twitter:creator', content: '@SpeakEasyApp' },
        { name: 'twitter:title', content: 'SpeakEasy - AI驱动的英语口语学习平台' },
        { name: 'twitter:description', content: '专业的AI英语学习平台，提供智能对话练习、发音纠正、个性化学习路径。' },
        { name: 'twitter:image', content: '/images/og-image.jpg' },
        
        // 移动端优化
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'SpeakEasy' },
        
        // 主题色
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        { name: 'msapplication-config', content: '/browserconfig.xml' },
        
        // 安全性
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        // 图标
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#3b82f6' },
        
        // 预连接和DNS预取
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
        { rel: 'dns-prefetch', href: 'https://api.openai.com' },
        
        // 规范链接
        { rel: 'canonical', href: 'https://speakeasy.com' }
      ],
      script: [
        // 结构化数据
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'SpeakEasy',
            description: '专业的AI英语学习平台，提供智能对话练习、发音纠正、个性化学习路径。',
            url: 'https://speakeasy.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://speakeasy.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            },
            publisher: {
              '@type': 'Organization',
              name: 'SpeakEasy',
              logo: {
                '@type': 'ImageObject',
                url: 'https://speakeasy.com/logo.png'
              }
            }
          })
        }
      ]
    }
  },

  // Nitro配置
  nitro: {
    compressPublicAssets: true,
    minify: true
  }
})
