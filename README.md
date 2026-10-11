# 栖苑的歌单

唱歌主播的歌曲展示页:直播间观众在这里搜索、筛选歌曲,点击卡片一键复制点歌口令,
回直播间粘贴即可点歌。纯前端静态页面,部署在 Cloudflare Pages。

**在线访问**:<https://www.qiyuanyuan.live>

## 技术栈

Vite · Vue 3 · TypeScript · UnoCSS

## 本地开发

```bash
npm install    # 安装依赖
npm run dev    # 启动开发服务器
npm run build  # 类型检查 + 构建产物到 dist/
```

## 文档

- [部署与数据缓存 Worker](docs/deploy.md)
- [开发指南(数据更新 / 口令格式 / 主题)](docs/guide.md)
