// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  css: ['/assets/css/main.css'],
  devtools: { enabled: true },
  // 生成配置
  ssr: true,

  // 路由配置
  router: {
    options: {
      strict: false
    }
  },

  // 添加路由配置
  routeRules: {
    '/**': { ssr: true }
  },

 // 添加这个配置
  features: {
    inlineStyles: false
  },

  // 服务器配置
  experimental: {
    asyncContext: true
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
  ],
  
  // 字体提供者配置，禁用外网字体/图标请求（避免 Google/GoogleIcons 超时告警）
  fonts: {
    providers: {
      google: false,
      googleicons: false,
    },
    priority: ['local'],
  },
  
  // Vite 配置
  vite: {
    plugins: [tsconfigPaths()],
    optimizeDeps: {
      include: ['naive-ui', 'vueuc']
    }
  },

  // 构建配置
  build: {
    transpile: ['naive-ui', 'vueuc']
  },
  


  // SEO 配置
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'SpeakEasy - AI驱动的英语口语学习平台',
      meta: [
        { name: 'description', content: '通过AI驱动的语音识别和智能对话，提升你的英语口语能力。SpeakEasy提供个性化的学习体验。' },
        { name: 'keywords', content: '英语学习,口语练习,AI对话,语音识别,在线教育' },
        { name: 'author', content: 'SpeakEasy Team' },
        { property: 'og:title', content: 'SpeakEasy - AI驱动的英语口语学习平台' },
        { property: 'og:description', content: '通过AI驱动的语音识别和智能对话，提升你的英语口语能力。' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'SpeakEasy - AI驱动的英语口语学习平台' },
        { name: 'twitter:description', content: '通过AI驱动的语音识别和智能对话，提升你的英语口语能力。' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
});
