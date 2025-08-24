import { setup } from '@css-render/vue3-ssr'
import { defineNuxtPlugin } from '#app'
import {
  NConfigProvider,
  NButton,
  NCard,
  NIcon,
  NBadge,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NMessageProvider
} from 'naive-ui'

export default defineNuxtPlugin((nuxtApp: any) => {
  // 注册全局组件
  const components = [
    NConfigProvider,
    NButton,
    NCard,
    NIcon,
    NBadge,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NMessageProvider
  ]
  
  components.forEach(component => {
    nuxtApp.vueApp.component(component.name, component)
  })

  // SSR 样式处理
  if (process.server) {
    const { collect } = setup(nuxtApp.vueApp)
    const originalRenderMeta = nuxtApp.ssrContext?.renderMeta
    nuxtApp.ssrContext = nuxtApp.ssrContext || {}
    nuxtApp.ssrContext.renderMeta = () => {
      if (!originalRenderMeta) {
        return {
          headTags: collect()
        }
      }
      const originalMeta = originalRenderMeta()
      if ('then' in originalMeta) {
        return originalMeta.then((resolvedOriginalMeta: any) => {
          return {
            ...resolvedOriginalMeta,
            headTags: resolvedOriginalMeta['headTags'] + collect()
          }
        })
      } else {
        return {
          ...originalMeta,
          headTags: originalMeta['headTags'] + collect()
        }
      }
    }
  }
})
