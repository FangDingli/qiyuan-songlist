import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'

import '@unocss/reset/normalize.css'
import 'uno.css'

import './styles/common.css'
import './styles/rainbow.css'

import { useRequest } from '~/composables/useRequest'
import { getToken } from '~/utils'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = getToken()
    if (token) {
      const { statusCode } = await useRequest('/checkToken').get().json()

      if (statusCode.value === 200) {
        next()
      } else {
        next({ path: '/login', query: { redirect: to.fullPath } })
      }
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  } else {
    next()
  }
})
app.use(router)
app.mount('#app')
