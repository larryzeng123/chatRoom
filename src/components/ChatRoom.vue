<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { db } from '../services/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import moment from 'moment';
//聊天室訊息

const currentUser = 'Tom';

let showMoney = ref(false);
const displayMoney = () => {
  showMoney.value = !showMoney.value;
};

const message = ref('');
const chatList = ref([]);
let unsubscribe;

const submitMessage = async () => {
  console.log('message', message.value);
  if (!message.value) {
    console.error('訊息不得為空');
    return;
  }
  try {
    await addDoc(collection(db, 'chatRoom'), {
      username: currentUser,
      message: message.value,
      avatar: 'https://media.eldamu.com//common/port/avatar_4.png',
      timestamp: new Date()
    });
    console.log('Message added');
    message.value = '';
  } catch (e) {
    console.error('Error');
  }
};
const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'chatRoom'));
    chatList.value = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    console.log('即時更新的聊天室資料：', chatList.value);
  } catch (error) {
    console.error('獲取資料失敗：', error);
  }
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

    console.log('即時更新的聊天室資料：', chatList.value);
  });

  // 如果不想監聽了，可以調用 unsubscribe()
  return unsubscribe;
};

onMounted(async () => {
  subscribeToUsers();
  // getUsers();
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

watch(
  () => {
    message.value;
  },
  (newValue, oldValue) => {
    console.log('newValue', newValue);
    console.log('oldValue', oldValue);
  }
);
</script>

<template>
  <div class="room">
    <header class="header">
      <div class="left"><</div>
      <div class="roomName">聊天室</div>
      <div class="right">
        <span @click="displayMoney">{{ showMoney ? '显示余额' : ' $1000000' }}</span>
        <div style="padding: 0 0.5rem">．．．</div>
      </div>
    </header>
    <div class="message_container">
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
            <img :src="data.avatar" />
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
      <button @click="submitMessage">Send</button>
    </div>
  </div>
</template>

<style scoped>
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
  margin-left: 0.875rem;
}
.content {
  padding: 0.75rem;
}
.username {
  color: #7a7a7a;
  font-size: 0.875rem;
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
  width: 8%;
  margin: 0 5px;
  padding: 5px 0;
  border-radius: 10px;
  border: none;
}
.inputArea button:hover {
  background-color: white;
  border: 1px solid #7a7a7a;
}
</style>
