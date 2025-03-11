import { createWebHistory, createRouter } from 'vue-router';
import Login from '../components/Login.vue';
import ChatRoom from '../components/ChatRoom.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/chatRoom', component: ChatRoom }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
