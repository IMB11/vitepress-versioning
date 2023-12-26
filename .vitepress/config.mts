import { defineConfig } from 'vitepress'
import { generateVersionRewrites, generateVersionSidebars, generateVersionSwitcher } from './data/versions'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vitepress Versioning Example",
  description: "A VitePress Site",
  cleanUrls: true,
  rewrites: {
    ...generateVersionRewrites()
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      generateVersionSwitcher(),
    ],

    sidebar: {
      '/': [
        {
          text: 'Test',
          link: '/',
        },
        {
          text: 'Sub Test',
          link: '/sub/',
        }
      ],
      ...generateVersionSidebars()
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
