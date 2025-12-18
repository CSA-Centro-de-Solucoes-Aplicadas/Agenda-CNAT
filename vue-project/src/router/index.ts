import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import Cadastro from '@/views/cadastro.vue'
import Modal from '@/componentes/modal.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/cadastro', component: Cadastro },
  { path: '/modal', component: Modal },  
]


export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
