import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalStore = defineStore(
  'global',
  () => {
    const currentUser = ref('');
    const isLogin = ref(false);
    const userAvatar = ref('');
    return {
      currentUser,
      isLogin,
      userAvatar
    };
  },
  {
    persist: true
  }
);
