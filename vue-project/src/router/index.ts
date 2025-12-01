import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'

const routes = [{ path: '/home', component: Home }]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
