import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import './styles/main.css'
import 'uno.css'

const app = createApp(App)
app.use(createPinia()).use(router)
app.mount('#app')
