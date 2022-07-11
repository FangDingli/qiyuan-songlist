import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import SongList from '../views/SongList.vue'
import Login from '../views/Login.vue'
import { getToken } from '../utils'
import baseRequest from '../utils/request'
import { useSongStore } from '~/store/songTable'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: SongList
  },
  {
    path: '/admin',
    component: () => import("../views/Admin.vue")
  },
  {
    path: '/act1',
    component: () => import("../views/Act_1.vue")
  },
  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/admin' || to.path == '/act1') {
    const token = getToken()
    const store = useSongStore()
    if (!token) {
      // window.$message.warning('请先登录', { duration: 3000 })
      next({ path: '/login' })
    } else if (!store.isTokenVerified) {
      baseRequest('checkToken', {
        beforeFetch({ options }) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          }
        }
      }).json().then(res => {
        if (res.statusCode.value == 200) {
          next()
          store.setTokenVeri(true)
        } else {
          next({ path: '/login' })
        }
      })
    }
  } else {
    next()
  }
})

export default router