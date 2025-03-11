<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGlobalStore } from '../store/GlobalStore';
import { storeToRefs } from 'pinia';

const globalStore = useGlobalStore();
const { currentUser, isLogin, userAvatar } = storeToRefs(globalStore);
let defaultAvatar = 'https://media.eldamu.com//common/port/avatar_1.png';

const avatarList = [
  { id: 1, src: 'https://media.eldamu.com//common/port/avatar_1.png' },
  { id: 2, src: 'https://media.eldamu.com//common/port/avatar_2.png' },
  { id: 3, src: 'https://media.eldamu.com//common/port/avatar_3.png' },
  { id: 4, src: 'https://media.eldamu.com//common/port/avatar_4.png' },
  { id: 5, src: 'https://media.eldamu.com//common/port/avatar_5.png' }
];


// 存放選中的圖案 ID
const selectedImage = ref(null);

const selectImage = (id, src) => {
  userAvatar.value = src;
  defaultAvatar = src;
  selectedImage.value = id;
};

const router = useRouter();
const createUser = (username) => {
  if (username === '') {
    alert('名字不得為空');
    isLogin = false;
    return;
  }
  currentUser.value = username;
  isLogin.value = true;
  router.push('chatRoom');
};

onMounted(() => {
  const savedUsername = currentUser.value;
  if (savedUsername) {
    currentUser.value = savedUsername;
    isLogin.value = true;
    alert('你已經登入過了！！，自動導向到聊天室！！');
    router.push('chatRoom');
  }
});

</script>
<template>
  <div class="login">
    <div class="createUserArea">
      <div>
        <img width="120px" :src="defaultAvatar" />
      </div>
      <input v-model="currentUser" placeholder="請輸入你的名字...." type="text" v-model.trim="currentUser" @keyup.enter="createUser(currentUser)" />
      <div class="avatarArea">
        <span>選擇頭像:</span>
        <img width="30px" :src="avatar.src" :key="avatar.id" v-for="avatar in avatarList" :class="{ selected: selectedImage === avatar.id }" @click="selectImage(avatar.id, avatar.src)" />
      </div>
      <button @click="createUser(currentUser)">Start</button>
    </div>
  </div>
</template>
<style>
.login {
  width: 600px;
  height: 100vh;
  padding: 0 0.625rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login input {
  width: 90%;
  height: 2rem;
}
.login button {
  height: 2rem;
}

.createUserArea {
  width: 80%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: skyblue;
  border-radius: 25px;
}
.createUserArea input {
  width: 80%;
  height: 2rem;
  border-radius: 10px;
  border: none;
}
.createUserArea button {
  width: 80%;
  border-radius: 10px;
  border: none;
}
.createUserArea button:hover {
  background-color: white;
  border: 1px solid #f5f5f5;
}
.avatarArea {
  display: flex;
  align-items: center;
  margin: 20px;
}
.avatarArea span {
  font-size: larger;
}
.avatarArea img {
  margin: 0 5px;
}
button {
  font-size: larger;
  background-color: rgb(229, 234, 234);
}

.selected {
  border: 2px solid rgb(237, 174, 151); /* 選中時變藍色 */
  border-radius: 50%;
  width: 36px;
}
</style>
