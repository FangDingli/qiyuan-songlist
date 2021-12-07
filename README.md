# qiyuan-songlist

这是一个为[栖苑太困辽](https://space.bilibili.com/303246676)制作的简单的歌曲列表展示页面

整体和之前做的[Noko-songlist](https://github.com/FangDingli/noko-songlist)差不多，这次只是自己把后端和部署的活也干了

前端基于 Vue3+Vite+Naive-UI+Typescript 开发
后端基于Koa2+MySQL（第一次写后端）

感谢 [vite-ts-quick](https://github.com/pohunchn/vite-ts-quick) 提供的前端模板

## 主要实现特性：

- 简单的移动端适配
- 长列表实现虚拟滚动，免去翻页烦恼的同时保证性能
- 检测系统主题自动切换亮色与深色模式
- 网络请求基于JavaScript自带的fetch，不再引入axios