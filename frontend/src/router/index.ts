import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue'
import Cadastro from '@/views/cadastro.vue'
import Eventos from '@/views/eventos.vue'
import Modal from '@/componentes/Modal.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/cadastro', component: Cadastro },
    { path: '/eventos', component: Eventos },
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
