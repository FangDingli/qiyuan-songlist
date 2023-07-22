import { defineConfig, presetAttributify, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      exclude: [
        'node_modules',
        'dist',
        '.git',
        '.husky',
        '.vscode',
        'public',
        'build',
        'mock',
        './stats.html',
      ],
    },
  },
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
    },
  ],
  rules: [
    [
      'font-yahei',
      { 'font-family': '"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf","微软雅黑"' },
    ],
    [
      /^color-(\d+)$/,
      ([, colorNum]) => {
        return { color: `rgb(var(--color-${colorNum}))` }
        // return { color: `var(--color-${colorNum})${hexAlpha}` }
      },
    ],
    [
      /^bgc-(\d+)$/,
      ([, colorNum]) => {
        return { 'background-color': `rgb(var(--color-${colorNum}))` }
        // return { color: `var(--color-${colorNum})${hexAlpha}` }
      },
    ],
  ],
  theme: {},
  presets: [presetUno(), presetIcons(), presetAttributify()],
})
