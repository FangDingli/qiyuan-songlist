import { defineConfig, presetIcons, presetUno } from 'unocss'

// 颜色统一引用 src/styles/tokens.css 中的 rgb 三元组变量,亮/暗两套值随 .dark 类自动切换。
// 注意:var() 颜色不支持 /opacity 修饰符,需要透明度变体时在 theme 里显式定义(如 brand.soft)。
export default defineConfig({
  presets: [presetUno(), presetIcons()],
  theme: {
    colors: {
      brand: {
        DEFAULT: 'rgb(var(--brand))',
        // 浅底上的可读紫 / 暗底上的可读紫(随模式切换取值)
        strong: 'rgb(var(--brand-strong))',
        soft: 'rgb(var(--brand) / 0.12)',
        light: 'rgb(var(--brand) / 0.35)',
      },
      'on-brand': 'rgb(var(--on-brand))',
      bg: {
        base: 'rgb(var(--bg-base))',
        card: 'rgb(var(--bg-card))',
      },
      text: {
        primary: 'rgb(var(--text-primary))',
        secondary: 'rgb(var(--text-secondary))',
      },
      border: 'rgb(var(--border))',
      error: 'rgb(var(--error))',
    },
  },
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    // 卡片表面:白/深紫底、大圆角、细描边
    'surface-card': 'bg-bg-card border border-border rounded-3xl',
    // 主题切换按钮
    'theme-toggle':
      'flex-center w-32px h-32px rounded-lg bg-brand-soft text-brand-strong text-16px cursor-pointer transition-opacity duration-200 hover:opacity-80',
    // 软底按钮:页面上的同级操作(打乱顺序/随机点歌)
    'btn-soft':
      'flex-center gap-8px h-40px px-16px rounded-xl bg-brand-soft text-brand-strong text-14px font-bold cursor-pointer select-none whitespace-nowrap transition-all duration-200 hover:opacity-80 active:scale-95',
    // 回到顶部按钮
    'back-to-top':
      'fixed right-16px bottom-24px z-50 flex-center w-40px h-40px rounded-full bg-[rgb(var(--bg-card)/0.9)] backdrop-blur-xl border border-border text-brand-strong text-18px cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-colors duration-200 hover:(text-brand border-brand)',
    // 筛选标签:无边框,灰底未选中 / 品牌紫实底选中
    'tag-pill':
      'inline-flex items-center h-30px px-12px rounded-lg text-13px font-medium cursor-pointer select-none whitespace-nowrap transition-colors duration-200 bg-[rgb(var(--text-primary)/0.06)] text-text-secondary hover:text-brand-strong',
    'tag-pill-selected': 'bg-brand text-on-brand font-bold',
    // 歌曲卡片:紧凑双行、固定高度(虚拟滚动按此行距计算),无边框,hover 用品牌紫光晕代替描边
    'song-card':
      'relative overflow-hidden w-full h-90px text-left bg-bg-card p-18px rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-[0_6px_20px_rgb(var(--brand)/0.3)] active:scale-95',
    'song-tag': 'inline-flex items-center h-20px px-8px rounded-full text-12px lh-20px whitespace-nowrap font-medium',
    toast:
      'pointer-events-auto max-w-80vw px-14px py-9px rounded-xl text-13px text-white shadow-[0_6px_16px_rgba(0,0,0,0.2)]',
  },
})
