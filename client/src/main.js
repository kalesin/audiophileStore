import { createApp } from 'vue'
import router from './router/index.js';
import store from './store/store.js'
import App from './App.vue'
import './index.css'

const app = createApp(App);

app.use(router).use(store).mount('#app');
