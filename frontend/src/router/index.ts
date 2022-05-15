import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import("../views/SongList.vue")
  },
  {
    path: '/admin',
    component: () => import("../views/Admin.vue")
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})