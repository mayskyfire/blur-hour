<template>
  <div class="min-h-screen p-4">
    <div class="max-w-2xl mx-auto space-y-4">
      <h1 class="text-3xl font-bold mb-6">Your Matches</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="text-4xl animate-pulse mb-4">💬</div>
        <p class="text-slate-400">Loading chats...</p>
      </div>

      <div v-else-if="chatsWithProfiles.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">💔</div>
        <h2 class="text-xl font-semibold mb-2">No Matches Yet</h2>
        <p class="text-slate-400 mb-6">Start swiping to find your match!</p>
        <NuxtLink
          to="/discover"
          class="inline-block px-6 py-3 bg-gradient-to-r from-neonCyan to-neonGreen rounded-xl font-semibold"
        >
          Go to Discover
        </NuxtLink>
      </div>

      <div v-else class="space-y-3">
        <NuxtLink
          v-for="chat in chatsWithProfiles"
          :key="chat.id"
          :to="`/chats/${chat.id}`"
          class="block bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/60 p-4 hover:border-neonCyan/50 transition-all"
        >
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-2xl">
              👤
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-lg">{{ chat.otherProfile?.displayName }}</h3>
              <p class="text-sm text-slate-400">{{ chat.otherProfile?.mood }}</p>
              <p class="text-xs text-neonCyan">📍 {{ chat.otherProfile?.zone }}</p>
            </div>
            <div class="text-2xl">💬</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc } from 'firebase/firestore'
import type { Chat, Profile } from '~/types'

const { getUserChats } = useChats()
const { currentUser } = useAuth()
const { db } = useFirebase()

const loading = ref(true)
const chats = ref<Chat[]>([])
const chatsWithProfiles = ref<Array<Chat & { otherProfile?: Profile }>>([])

onMounted(async () => {
  chats.value = await getUserChats()

  // Fetch other user profiles
  for (const chat of chats.value) {
    const otherUserId = chat.userIds.find(id => id !== currentUser.value?.uid)
    if (otherUserId) {
      const profileDoc = await getDoc(doc(db, 'profiles', otherUserId))
      if (profileDoc.exists()) {
        chatsWithProfiles.value.push({
          ...chat,
          otherProfile: { id: profileDoc.id, ...profileDoc.data() } as Profile
        })
      }
    }
  }

  loading.value = false
})
</script>
