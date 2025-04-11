import './assets/main.css'
import App from './App.vue'
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';


const app = createApp(App)
app.use(Antd).mount('#app');
