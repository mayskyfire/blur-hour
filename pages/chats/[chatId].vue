<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col">
    <!-- Chat Header -->
    <div class="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/60 p-4">
      <div class="flex items-center gap-3">
        <button @click="router.back()" class="text-2xl">←</button>
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center">
          👤
        </div>
        <div>
          <h2 class="font-semibold">{{ otherProfile?.displayName }}</h2>
          <p class="text-xs text-slate-400">{{ otherProfile?.zone }}</p>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[75%] px-4 py-2 rounded-2xl"
          :class="message.senderId === currentUser?.uid
            ? 'bg-gradient-to-r from-neonCyan to-neonGreen text-white'
            : 'bg-slate-800 text-white'"
        >
          <p>{{ message.text }}</p>
          <p class="text-xs opacity-70 mt-1">
            {{ formatTime(message.createdAt) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="bg-slate-900/80 backdrop-blur-xl border-t border-slate-700/60 p-4 safe-bottom">
      <form @submit.prevent="sendMsg" class="flex gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message..."
          class="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-neonCyan"
        />
        <button
          type="submit"
          :disabled="!newMessage.trim()"
          class="px-6 py-3 bg-gradient-to-r from-neonCyan to-neonGreen rounded-xl font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc } from 'firebase/firestore'
import type { Message, Profile } from '~/types'

const route = useRoute()
const router = useRouter()
const { subscribeToMessages, sendMessage } = useChats()
const { currentUser } = useAuth()
const { db } = useFirebase()

const chatId = route.params.chatId as string
const messages = ref<Message[]>([])
const newMessage = ref('')
const otherProfile = ref<Profile | null>(null)
const messagesContainer = ref<HTMLElement>()

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  // Subscribe to messages
  unsubscribe = subscribeToMessages(chatId, (newMessages) => {
    messages.value = newMessages
    nextTick(() => scrollToBottom())
  })

  // Get chat info to find other user
  const chatDoc = await getDoc(doc(db, 'chats', chatId))
  if (chatDoc.exists()) {
    const chatData = chatDoc.data()
    const otherUserId = chatData.userIds.find((id: string) => id !== currentUser.value?.uid)
    
    if (otherUserId) {
      const profileDoc = await getDoc(doc(db, 'profiles', otherUserId))
      if (profileDoc.exists()) {
        otherProfile.value = { id: profileDoc.id, ...profileDoc.data() } as Profile
      }
    }
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const sendMsg = async () => {
  if (!newMessage.value.trim()) return

  await sendMessage(chatId, newMessage.value)
  newMessage.value = ''
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp: any) => {
  const date = timestamp instanceof Date ? timestamp : timestamp.toDate()
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
</script>
