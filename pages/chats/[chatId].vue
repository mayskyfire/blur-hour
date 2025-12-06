<template>
  <div class="h-screen flex flex-col">
    <!-- Chat Header -->
    <div
      class="bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/60 p-4 fixed top-[65px] left-0 right-0 z-10"
    >
      <div class="flex items-center gap-3">
        <button
          @click="router.back()"
          class="text-2xl text-white hover:text-neonCyan transition-colors p-1"
        >
          ←
        </button>
        <div
          class="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20"
        >
          <img
            v-if="
              otherProfile?.photos?.[0] &&
              (otherProfile.photos[0].startsWith('data:') ||
                otherProfile.photos[0].startsWith('http'))
            "
            :src="otherProfile.photos[0]"
            :alt="otherProfile.displayName"
            class="w-full h-full object-cover"
          />
          <div
            v-else-if="
              otherProfile?.photos?.[0] &&
              !otherProfile.photos[0].startsWith('data:') &&
              !otherProfile.photos[0].startsWith('http')
            "
            class="w-full h-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-lg font-bold text-white"
          >
            {{ otherProfile.photos[0] }}
          </div>
          <div
            v-else
            class="w-full h-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-white font-bold text-lg"
          >
            {{ otherProfile?.displayName?.charAt(0) || "?" }}
          </div>
        </div>
        <div class="flex-1">
          <h2 class="font-semibold text-white text-lg">
            {{ otherProfile?.displayName || "กำลังโหลด..." }}
          </h2>
          <p class="text-sm text-slate-400">
            📍 {{ otherProfile?.zone || "ไม่ทราบโซน" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-3 pt-20 pb-20"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="
          message.senderId === currentUser?.uid
            ? 'justify-end'
            : 'justify-start'
        "
      >
        <div
          class="max-w-[75%] px-4 py-2 rounded-2xl"
          :class="
            message.senderId === currentUser?.uid
              ? 'bg-gradient-to-r from-neonCyan to-neonGreen text-white'
              : 'bg-slate-800 text-white'
          "
        >
          <p>{{ message.text }}</p>
          <p class="text-xs opacity-70 mt-1">
            {{ formatTime(message.createdAt) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div
      class="bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/60 p-4 fixed bottom-[76px] left-0 right-0 z-10"
    >
      <div class="mb-2">
        <IcebreakerButton @select="insertQuestion" />
      </div>
      <form @submit.prevent="sendMsg" class="flex gap-3 items-end">
        <input
          v-model="newMessage"
          type="text"
          placeholder="พิมพ์ข้อความ..."
          class="flex-1 px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-neonCyan focus:ring-1 focus:ring-neonCyan/50 transition-all"
          maxlength="500"
        />
        <button
          type="submit"
          :disabled="!newMessage.trim()"
          class="px-6 py-3 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl font-semibold text-white shadow-lg disabled:opacity-50 disabled:shadow-none hover:shadow-xl transition-all"
        >
          ส่ง
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc } from "firebase/firestore";
import type { Message, Profile } from "~/types";
import IcebreakerButton from "@/components/IcebreakerButton.vue";

const route = useRoute();
const router = useRouter();
const { subscribeToMessages, sendMessage } = useChats();
const { currentUser } = useAuth();
const { db } = useFirebase();

const chatId = route.params.chatId as string;
const messages = ref<Message[]>([]);
const newMessage = ref("");
const otherProfile = ref<Profile | null>(null);
const messagesContainer = ref<HTMLElement>();

let unsubscribe: (() => void) | null = null;

onMounted(async () => {
  // Subscribe to messages
  unsubscribe = subscribeToMessages(chatId, (newMessages) => {
    messages.value = newMessages;
    nextTick(() => scrollToBottom());
  });
  
  // Initial scroll to bottom
  nextTick(() => scrollToBottom());

  // Get chat info to find other user
  const chatDoc = await getDoc(doc(db, "chats", chatId));
  if (chatDoc.exists()) {
    const chatData = chatDoc.data();
    const otherUserId = chatData.userIds.find(
      (id: string) => id !== currentUser.value?.uid
    );

    if (otherUserId) {
      const profileDoc = await getDoc(doc(db, "profiles", otherUserId));
      if (profileDoc.exists()) {
        otherProfile.value = {
          id: profileDoc.id,
          ...profileDoc.data(),
        } as Profile;
      }
    }
  }
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const sendMsg = async () => {
  if (!newMessage.value.trim()) return;

  await sendMessage(chatId, newMessage.value);
  newMessage.value = "";
  nextTick(() => scrollToBottom());
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatTime = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp instanceof Date ? timestamp : (timestamp.toDate ? timestamp.toDate() : new Date(timestamp));
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const insertQuestion = (question: string) => {
  newMessage.value = question;
};
</script>
