import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/styles/global.css'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

const app = createApp(App)

app.use(router)

app.mount('#app')

app.use(VCalendar, {})
