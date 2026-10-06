import { createApp } from 'vue'
import 'uno.css'
import '@/styles/tokens.css'
import App from './App.vue'

// 禁用浏览器滚动位置恢复:刷新后回到顶部,避免与虚拟滚动的初始渲染竞争
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createApp(App).mount('#app')
