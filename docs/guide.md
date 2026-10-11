# 开发指南

## 数据更新流程

数据直接消费远端(qylive)原生结构,无需任何转换:

- **自动(主通道)**:远端 songs.json 由 CF Worker `songs-cache` 缓存 5 天后从
  同源 `/api/songs.json` 提供,页面挂载时自动拉取替换,失败时使用内置数据。
- **手动(兜底)**:浏览器下载 `https://qylive.pages.dev/songs.json`,
  **原样覆盖** `src/data/songs.json`,提交推送即可,零转换。

Worker 部署步骤见 [deploy.md](./deploy.md)。

## 点歌口令格式

在 `src/config.ts` 的 `siteConfig.orderTemplate` 里改,支持占位符
`{title}` `{singer}` `{lang}` `{tags}`,例如:

```ts
orderTemplate: '点歌 {title} {singer}'
```

## 主题与暗黑模式

所有颜色 token 在 `src/styles/tokens.css`,以 rgb 三元组变量定义,
`:root` 为亮色值、`.dark` 为暗色值,UnoCSS 通过 `rgb(var(--x))` 引用,
因此两套模式自动切换,组件代码里不需要写 `dark:` 变体。

暗黑模式逻辑在 `src/composables/useTheme.ts`:默认跟随系统
(`prefers-color-scheme`),点击主题按钮在「跟随系统 → 亮色 → 暗色」间循环,
选择持久化在 localStorage(键 `songlist-theme`)。

改主题色时关注这几个变量:

```css
--brand: 170 153 255;        /* 主色 #AA99FF,用于填充/装饰 */
--brand-strong: 112 80 232;  /* 浅底上的可读紫(小字文字);.dark 里换浅紫 */
--on-brand: 30 27 58;        /* 印在品牌紫填充上的文字色 */
--bg-base / --bg-card        /* 页面底 / 卡片底,亮暗各一套 */
```

注意:主色 `#AA99FF` 对白底对比仅 2.4:1,不要直接用它做小字文字色或
垫白字,小字用 `text-brand-strong`,紫底文字用 `text-on-brand`。
改主题时记得同步 `index.html` 的 `<meta name="theme-color">`
以及 `useTheme.ts` 里暗色模式的对应值。

歌曲卡片的语种/类型彩色 tag 配色在 `src/components/SongCard.vue` 的
`TAG_PALETTE`,按 key 哈希稳定取色,新增语种/类型无需改动。

## 代码结构

```
src/
  App.vue                  # 页面:固定背景层/移动端吸顶栏/桌面侧栏/虚拟滚动网格/Toast
  config.ts                # 站点文案、头像/背景图、点歌口令模板
  types.ts                 # Song 数据结构(与远端字段一致)
  data/songs.json          # 歌曲数据(远端文件原样存放,更新即覆盖此文件)
  utils/songs.ts           # 运行时生成 id、genre+style 合并拆分为展示 tag
  components/
    SongCard.vue           # 歌曲卡片(编号水印/复制遮罩/SC 标记/彩色 tag)
    FilterPanel.vue        # 搜索 + 随机按钮 + 单选筛选(移动与桌面共用)
    MobileFilterBar.vue    # 移动端滚动时出现的紧凑筛选条
    TagPill.vue            # 筛选标签
    RotatingDisc.vue       # 侧栏旋转唱片机(链接到主播主页)
  composables/
    useClipboard.ts        # 剪切板(含非 HTTPS 兜底)
    useToast.ts            # 全局提示
    useTheme.ts            # 亮暗主题(自动跟随系统 + 手动循环切换)
  styles/tokens.css        # 设计 token + 全局 reset 兜底 + 动画
```
