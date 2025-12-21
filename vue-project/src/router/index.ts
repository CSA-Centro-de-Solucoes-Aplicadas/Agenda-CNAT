import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import Cadastro from '@/views/cadastro.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/cadastro', component: Cadastro },
  ],

  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    return { top: 0 }
  },
})

export default router
