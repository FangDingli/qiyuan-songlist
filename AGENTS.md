# AGENTS.md

主播歌曲展示页(点歌单)。观众在 PC/手机浏览器里搜索、筛选歌曲,点击卡片复制点歌口令,回直播间粘贴点歌。纯前端静态站,部署在 Cloudflare Pages,无后端。

## 技术栈

- Vite 7 + Vue 3(`<script setup>` + TS)+ UnoCSS(presetUno + presetIcons)
- 不用组件库,组件全部手写;图标用 `i-carbon-*`(carbon 图标集)
- `@vueuse/core`:仅用 `useElementSize` / `useWindowScroll` / `useWindowSize` 实现窗口级虚拟滚动
- 数据静态打包:`src/data/songs.json` 通过 `?raw` 导入,无运行时请求

## 常用命令

```bash
npm run dev                    # 开发
npm run build                  # vue-tsc 类型检查 + vite 构建 → dist/
```

## 目录结构

```
src/
  App.vue                # 布局:固定背景层 / 移动端吸顶栏 / 桌面侧栏 / 虚拟滚动网格 / footer / toast
  config.ts              # 站点标题、副标题、主播头像 URL、双端背景图、点歌口令模板(orderTemplate)
  types.ts               # Song { id, title, artist, language, genres[] }
  data/songs.json        # 歌曲数据,由脚本生成,勿手改
  components/
    SongCard.vue         # 歌曲卡片:固定高度,大编号水印(no prop,展示序号)、hover 复制遮罩、彩色 tag
    FilterPanel.vue      # 搜索 + 打乱/随机按钮 + 计数 + 合并的语种/类型 tag 组(移动与桌面共用)
    TagPill.vue          # 筛选标签
    RotatingDisc.vue     # 侧栏旋转唱片机(主播头像,点击跳主播 B 站主页)
  composables/
    useClipboard.ts      # 剪切板,navigator.clipboard + execCommand 兜底(HTTPS 下走前者)
    useToast.ts          # 模块级单例 toast
    useTheme.ts          # 亮暗主题:默认跟随系统,按钮循环「跟随系统→亮→暗」,localStorage 键 songlist-theme
  styles/tokens.css      # 全部设计 token(见下文)+ 全局 reset 兜底 + toast 过渡
```

## 数据流程

数据结构:前端直接消费远端(qylive)原生字段 `title/singer/lang/genre/style/sc`,
不做任何字段转换;`id` 由 `src/utils/songs.ts` 的 `withIds` 在运行时按行序生成,
仅用作 key 与随机排序,与外部编号解耦(见「打乱与编号」)。展示 tag 由 `songTags()`
从 genre+style 实时合并拆分。

主通道(自动):远端 songs.json 由 CF Worker(`songs-cache`)缓存 5 天后从同源
`/api/songs.json` 提供,页面挂载时拉取、`withIds` 替换内置数据,失败时静默保留。
Worker 代码与路由配置见 docs/deploy.md。

兜底数据(手动):浏览器下载 qylive 的 songs.json → **原样覆盖** `src/data/songs.json`
(零转换)→ 提交推送。仓库内该文件内容应与远端文件完全一致。

## 设计系统(重要)

所有颜色 token 在 `src/styles/tokens.css`,以 **rgb 三元组**定义(`--brand: 170 153 255`),`:root` 亮色、`.dark` 暗色;`uno.config.ts` 的 theme 通过 `rgb(var(--x))` 引用,因此组件里**不需要写 `dark:` 变体**,切 `.dark` 类自动生效。

- 主色 `--brand` = #AA99FF,只用于填充/装饰;**对白底对比仅 2.4:1,禁止直接做小字文字色或垫白字**
- 小字文字用 `--brand-strong`(亮色模式 #7050E8 / 暗色 #BABFFF);品牌紫填充上的文字用 `--on-brand`
- var() 颜色不支持 `/opacity` 修饰符,需要透明度变体时在 uno theme 里显式定义(如 `brand.soft/light`),或用 `bg-[rgb(var(--x)/0.15)]` 任意值

### UnoCSS preflight 的三个坑(已在 tokens.css 兜底,新项目同样要防)

1. 不重置 `<button>` 的 UA 默认 outset 边框、`<input>` 的 inset 边框
2. 不重置 `h1~h6`/`p` 的 UA 默认 1em 外边距(曾导致卡片超高、元素错位)
3. shortcut 里不能引用 `group`(不是 utility),父孙 hover 联动用 scoped CSS 写

## 虚拟滚动(改动须知)

`App.vue` 中窗口级虚拟滚动:列表按列数切块成行,只渲染视口附近约 60 张卡;外层 div 撑起总高度 `rows.length * ROW_H`,内层按 `translateY(firstVisible * ROW_H)` 平移。

- **常量必须与样式同步**:`CARD_H = 90` 对应 song-card 的 `h-90px`,`GAP = 16` 对应行间 `mb-16px/gap-16px`;改卡片高度时两处一起改,否则滚动定位错位
- 列数由容器宽度自动算(卡片最小 240px,1~5 列)
- 刻意**没有用 TransitionGroup**(全量 diff 是之前的性能问题来源);新增动画别加回去
- 随机点歌的定位按 `filtered 中的行列号`直接算 `scrollTo` 目标,不依赖卡片已渲染

## 打乱与编号(产品逻辑)

- 「打乱顺序」每次点击重新生成全量随机序(Fisher-Yates),无「恢复」态;随机序在后续筛选中保持稳定
- 卡片水印编号 = 当前展示顺序的序号(从 01 起),与 song.id **刻意解耦**:主播有「编号点歌」玩法(映射固定在 excel),打乱展示编号是为了防止观众背下映射
- 点歌口令模板在 `config.ts` 的 `orderTemplate`,占位符 `{title} {artist} {language} {genres}`;如需真实编号可加 `{id}` 占位符

## 约定与细节

- 改主题色:只动 `tokens.css` 的 `:root`/`.dark` 变量,并同步 `index.html` 的 `<meta name="theme-color">` 与 `useTheme.ts` 里暗色的 theme-color 值
- 背景层:`App.vue` 顶部的 `fixed inset-0 -z-10` 层,不随滚动;背景图配置在 `siteConfig.backgroundImages`(mobile/desktop 各一张)
- 卡片语种/类型 tag 颜色:`SongCard.vue` 的 `TAG_PALETTE` 按 key 哈希稳定取色,新增语种/类型无需改动
- 外链一律 `target="_blank" rel="noopener noreferrer"`;bilibili 图床加 `referrerpolicy="no-referrer"`
- 观众在国内:部署走 Cloudflare Pages + 自定义域名(见 docs/deploy.md),不要引入会被墙的运行时依赖
- 提交信息与代码注释用中文;`songs.json` 为生成物,不要手改
