<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, onBeforeMount } from 'vue';
import { db } from '../services/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import moment from 'moment';
import { useGlobalStore } from '../store/GlobalStore';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const globalStore = useGlobalStore();
const { currentUser, userAvatar, isLogin } = storeToRefs(globalStore);
const message = ref('');
const chatList = ref([]);
const avatar = ref('');
const chatContainer = ref(null);
const isLoading = ref(true);

// 滾動到底部
const scrollToBottom = () => {
  const container = chatContainer.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
    isLoading.value = false;
  }
};

const submitMessage = async () => {
  console.log('message', message.value);
  if (!message.value) {
    alert('訊息不得為空');
    return;
  }
  try {
    const submitData = await addDoc(collection(db, 'chatRoom'), {
      username: currentUser.value,
      message: message.value,
      avatar: userAvatar.value,
      timestamp: new Date()
    });
    console.log('Message added', submitData);
    message.value = '';
    await nextTick();
    scrollToBottom();
  } catch (e) {
    console.error('Error');
  }
};

const logout = () => {
  currentUser.value = '';
  isLogin.value = false;
  userAvatar.value = '';
  router.push('/');
};

const formatTimestamp = (timestamp) => {
  return moment.unix(timestamp).format('YYYY-MM-DD HH:mm');
};

const subscribeToUsers = () => {
  const unsubscribe = onSnapshot(collection(db, 'chatRoom'), (snapshot) => {
    chatList.value = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
    if (chatList.value) {
      isLoading.value = false;
    }
    console.log('即時更新的聊天室資料：', chatList.value);
  });

  return unsubscribe;
};

onMounted(async () => {
  if (!currentUser.value) {
    alert('尚未登入，返回登入頁面');
    router.push('/');
  }
  subscribeToUsers();
  await nextTick();
  scrollToBottom();
});

watch(chatList, async () => {
  await nextTick();
  scrollToBottom();
});
</script>

<template>
  <!-- 讀取動畫 -->
  <div v-if="isLoading" class="loading-container">
    <div class="spinner"></div>
    <p>載入中...</p>
  </div>
  <div v-else class="room">
    <header class="header">
      <div class="left"><</div>
      <div class="roomName">聊天室</div>
      <div class="right" @click="logout()">登出</div>
    </header>
    <div class="message_container" ref="chatContainer">
      <div class="message_item" v-for="data in chatList">
        <div v-if="currentUser !== data.username" class="user">
          <div class="avatar">
            <img :src="data.avatar" />
          </div>
          <div class="message">
            <div class="username">
              <span style="margin: 0 5px">
                {{ data.username }}
              </span>
              <span>{{ formatTimestamp(data.timestamp?.seconds) }}</span>
            </div>
            <div class="content">{{ data.message }}</div>
          </div>
        </div>
        <div v-else class="currenUser">
          <div class="avatar">
            <img :src="userAvatar" />
          </div>
          <div class="message">
            <div class="username">
              <span>{{ data.username }}</span>
              <span style="margin: 0 5px">{{ formatTimestamp(data.timestamp?.seconds) }}</span>
            </div>
            <div class="content">{{ data.message }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="inputArea">
      <input v-model="message" @change="submitMessage" placeholder="請輸入訊息......." />
    </div>
  </div>
</template>

<style scoped>
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
  width: 100%;
}
.createUserArea input {
  width: 85%;
  height: 2rem;
}
.createUserArea button {
  width: 15%;
}

.room {
  width: 600px;
  height: 100vh;
  padding: 0 0.625rem;
}
.header {
  width: 100%;
  min-height: 2.875rem;
  padding: 0 0.625rem;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  background-color: #3365a6;
  color: aliceblue;
}
.header > div {
  flex: 1 1;
  display: flex;
  align-items: center;
}
.left {
  display: flex;
  justify-content: flex-start;
}
.right {
  display: flex;
  justify-content: end;
}

.message_container {
  height: 85vh;
  background-color: #f5f5f5;
  overflow: scroll;
}

.message_item {
  padding: 0.625rem;
}
.user {
  display: flex;
}
.currenUser {
  display: flex;
  flex-direction: row-reverse;
}
.message {
  display: flex;
  flex-direction: column;
  padding: 2px;
  background-color: white;
  margin: 0 0.875rem;
  border-radius: 10px;
}
.content {
  padding: 0.5rem;
}
.username {
  color: #7a7a7a;
  font-size: 0.875rem;
  padding: 3px;
}

.avatar img {
  width: 32px;
}

.inputArea {
  background-color: white;
  line-height: 2;
  padding: 0.1rem;
  display: flex;
}

.inputArea input {
  width: 90%;
  line-height: 2;
  background-color: #f5f5f5;
  border-radius: 25px;
  border: 1px solid #7a7a7a;
}
.inputArea input:hover {
  background-color: white;
}
.inputArea button {
  width: 10%;
  margin: 0 5px;
  padding: 5px 0;
  border-radius: 10px;
  border: none;
}
.inputArea button:hover {
  background-color: white;
  border: 1px solid #7a7a7a;
}

@media screen and (max-width: 420px) {
  .inputArea input {
    width: 85%;
  }
  .inputArea button {
    width: 15%;
  }
}

/* 讀取畫面 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f9f9f9;
}

/* 旋轉動畫 */
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
