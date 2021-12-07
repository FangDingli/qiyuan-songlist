import { createRouter, createWebHistory } from "vue-router"
import SongList from '../views/SongList.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "SongList",
			component: SongList
		}
	]
})

// router.beforeEach((to, from, next) => {
// 	next()
// })

export default router