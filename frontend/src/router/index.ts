import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import Cadastro from '@/views/cadastro.vue'

const routes = [
  { path: '/home', component: Home },
  { path: '/cadastro', component: Cadastro },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
