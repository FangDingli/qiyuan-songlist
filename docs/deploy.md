# 部署(Cloudflare Pages)

## 站点部署

1. 把仓库推到 GitHub。
2. Cloudflare 控制台 → Workers & Pages → 创建 Pages 项目 → 连接该仓库。
3. 构建配置:框架预设选 Vite;构建命令 `npm run build`;输出目录 `dist`。
   建议加环境变量 `NODE_VERSION=22`。
4. 在项目的 Custom domains 里绑定自定义域名(国内访问稳定性明显更好)。

## 数据缓存 Worker(一次性配置)

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

## 自定义域名(域名在其他注册商时)

两种方式:

- **NS 迁移到 Cloudflare 托管(推荐)**:CF 控制台 Add a domain → 按提示到注册商处
  把 DNS 服务器改为 CF 分配的两个 NS → 生效后 Pages 绑定域名全自动,根域也能用。
- **保留原 DNS,加 CNAME**:Pages 项目里添加子域名后,到注册商解析处加 CNAME 指向
  `<项目名>.pages.dev`(或项目提示的目标值),回 CF 验证。根域名此方式较麻烦,
  建议绑定子域名。

注意:Workers 项目的自定义域必须在**项目内**添加(它会自动创建 DNS 记录);
若先手动在 DNS 里建了同名记录,添加时会报 "externally managed DNS records" 错,
把手动记录删掉再添加即可。
