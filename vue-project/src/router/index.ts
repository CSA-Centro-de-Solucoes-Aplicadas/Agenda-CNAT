import { createRouter, createWebHistory } from 'vue-router'
import Modal from '@/componentes/modal.vue'

const routes = [{ path: '/modal', component: Modal }]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
