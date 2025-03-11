import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { setupFirebase } from './services/firebase';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
setupFirebase;
const app = createApp(App);
app.use(pinia);
app.use(router).mount('#app');
