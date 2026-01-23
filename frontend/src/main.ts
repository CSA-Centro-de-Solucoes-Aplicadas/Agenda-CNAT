import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/styles/global.css'
import '@/assets/styles/swiper-custom.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
