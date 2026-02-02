import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css' // Restaurando estilos globales
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus) // 3. Usar Element Plus
app.mount('#app')