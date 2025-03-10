import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupFirebase } from './services/firebase'
setupFirebase;
createApp(App).mount('#app')
