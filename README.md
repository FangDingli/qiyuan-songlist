# 点歌单(qiyuan-songlist)

唱歌主播的歌曲展示页,供直播间观众搜索、筛选、一键复制口令点歌。
纯前端静态页面,部署在 Cloudflare Pages,无后端、无数据库。

技术栈:Vite + Vue3 + TypeScript + UnoCSS(不依赖组件库)。
视觉基调来自旧项目(`E:\Frontend\Vue\qiyuan-songlist`):淡紫底 + 白色大圆角卡片 +
侧栏唱片机 + 卡片编号水印,支持自动/手动暗黑模式。

## 常用命令

```bash
npm install          # 安装依赖
npm run dev          # 本地开发
npm run build        # 类型检查 + 构建产物到 dist/
npm run preview      # 本地预览构建产物
```

## 数据更新流程

数据直接消费远端(qylive)原生结构,无需任何转换:

- **自动(主通道)**:远端 songs.json 由 CF Worker `songs-cache` 缓存 5 天后从
  同源 `/api/songs.json` 提供,页面挂载时自动拉取替换,失败时使用内置数据。
- **手动(兜底)**:浏览器下载 `https://qylive.pages.dev/songs.json`,
  **原样覆盖** `src/data/songs.json`,提交推送即可,零转换。

### 数据缓存 Worker 部署教程(一次性配置)

作用:页面拉取同源 `/api/songs.json`,Worker 从 Cloudflare 内部抓取 qylive 的数据
(CF 到 CF,不受 pages.dev 被墙影响),用 Cache API 缓存 5 天——每 5 天才回源一次,
等效「5 天更新一次」,无需定时器。

1. Cloudflare 控制台 → **Workers & Pages → Create → Worker**,命名 `songs-cache` → Deploy
2. 点 **Edit code**,全选替换为以下代码后 Deploy:

```js
const UPSTREAM = 'https://qylive.pages.dev/songs.json'
const CACHE_TTL = 432000 // 5 天(秒)

export default {
  async fetch(request, env, ctx) {
    const cache = caches.default
    let res = await cache.match(request)
    if (!res) {
      const upstream = await fetch(UPSTREAM)
      if (!upstream.ok) return new Response('upstream error', { status: 502 })
      res = new Response(upstream.body, upstream)
      res.headers.set('Cache-Control', 'public, max-age=' + CACHE_TTL)
      res.headers.set('Access-Control-Allow-Origin', '*')
      ctx.waitUntil(cache.put(request, res.clone()))
    }
    return res
  },
}
```

3. 该 Worker 的 **Settings → Domains & Routes → Add Route**,区域选 `qiyuanyuan.live`,
   路由填 `qiyuanyuan.live/api/songs.json`
4. 验证:浏览器访问 `https://www.qiyuanyuan.live/api/songs.json`,能返回歌单 JSON 即成功;
   页面此后加载时会自动使用该数据

想立即刷新缓存:Worker 的 Deployments 里重新部署一次即可(旧缓存作废)。

## 部署(Cloudflare Pages)

1. 把仓库推到 GitHub。
2. Cloudflare 控制台 → Workers & Pages → 创建 Pages 项目 → 连接该仓库。
3. 构建配置:框架预设选 Vite;构建命令 `npm run build`;输出目录 `dist`。
4. 在项目的 Custom domains 里绑定自定义域名(国内访问稳定性明显更好)。

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

## 点歌口令格式

在 `src/config.ts` 的 `siteConfig.orderTemplate` 里改,支持占位符
`{title}` `{singer}` `{lang}` `{tags}`,例如:

```ts
orderTemplate: '点歌 {title} {singer}'
```

## 代码结构

```
src/
  App.vue                  # 页面:移动端吸顶栏/桌面侧栏/卡片网格/Toast
  config.ts                # 站点文案与点歌口令模板
  types.ts                 # Song 数据结构
  data/songs.json          # 歌曲数据(由脚本生成,勿手改)
  components/
    SongCard.vue           # 歌曲卡片(编号水印/复制遮罩/彩色 tag)
    FilterPanel.vue        # 搜索 + 随机按钮 + 语种/类型筛选(移动与桌面共用)
    TagPill.vue            # 筛选标签
    RotatingDisc.vue       # 侧栏旋转唱片机
  composables/
    useClipboard.ts        # 剪切板(含非 HTTPS 兜底)
    useToast.ts            # 全局提示
    useTheme.ts            # 亮暗主题(自动跟随系统 + 手动循环切换)
  styles/tokens.css        # 设计 token(改主题色在这里)
```
