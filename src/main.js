import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as echarts from "echarts"

const app = createApp(App)
app.config.globalProperties.$echarts = echarts
app.use(router)
app.use(ElementPlus)
app.mount('#app')
