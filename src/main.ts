import { createApp } from 'vue'
import 'virtual:uno.css'
import naive from 'naive-ui'
import { createPinia } from 'pinia'
import { router } from './router'
import "./style.css"
import App from './App.vue'

const app = createApp(App)
const store = createPinia()

app.use(store)

app.use(router)

app.use(naive)

app.mount('#app')
