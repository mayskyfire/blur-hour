<template>
  <div class="min-h-screen p-4">
    <div class="max-w-2xl mx-auto space-y-4">
      <h1 class="text-3xl font-bold mb-6">คู่ของคุณ</h1>

      <div v-if="loading" class="text-center py-12">
        <PhChatCircle :size="60" class="text-neonCyan animate-pulse mx-auto mb-4" weight="fill" />
        <p class="text-slate-400">กำลังโหลดแชท...</p>
      </div>

      <div v-else-if="chatsWithProfiles.length === 0" class="text-center py-12">
        <PhHeart :size="80" class="text-slate-600 mx-auto mb-4" weight="fill" />
        <h2 class="text-xl font-semibold mb-2">ยังไม่มีคู่</h2>
        <p class="text-slate-400 mb-6">เริ่มสไวป์เพื่อหาคู่ของคุณ!</p>
        <NuxtLink
          to="/discover"
          class="inline-block px-6 py-3 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          เริ่มหาคู่
        </NuxtLink>
      </div>

      <div v-else class="space-y-3">
        <NuxtLink
          v-for="chat in chatsWithProfiles"
          :key="chat.id"
          :to="`/chats/${chat.id}`"
          class="block bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/60 p-4 hover:border-neonCyan/50 transition-all relative"
        >
          <UnreadBadge :count="chat[`unreadCount_${currentUser?.uid}`] || 0" />
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full overflow-hidden relative">
              <img 
                v-if="chat.otherProfile?.photos?.[0] && (chat.otherProfile.photos[0].startsWith('data:') || chat.otherProfile.photos[0].startsWith('http'))" 
                :src="chat.otherProfile.photos[0]" 
                :alt="chat.otherProfile.displayName"
                class="w-full h-full object-cover"
              />
              <div 
                v-else-if="chat.otherProfile?.photos?.[0] && !chat.otherProfile.photos[0].startsWith('data:') && !chat.otherProfile.photos[0].startsWith('http')"
                class="w-full h-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-xl"
              >
                {{ chat.otherProfile.photos[0] }}
              </div>
              <div 
                v-else
                class="w-full h-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-white font-bold text-xl"
              >
                {{ chat.otherProfile?.displayName?.charAt(0) || '?' }}
              </div>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-lg">{{ chat.otherProfile?.displayName }}</h3>
              <p class="text-sm text-slate-400">{{ chat.otherProfile?.mood }}</p>
              <p class="text-xs text-neonCyan flex items-center gap-1"><PhMapPin :size="12" weight="fill" /> {{ chat.otherProfile?.zone }}</p>
            </div>
            <PhChatCircle :size="28" class="text-neonCyan" weight="fill" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore'
import type { Chat, Profile } from '~/types'
import UnreadBadge from '~/components/UnreadBadge.vue'

const { currentUser } = useAuth()
const { db } = useFirebase()

const loading = ref(true)
const chatsWithProfiles = ref<Array<Chat & { otherProfile?: Profile }>>([])

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  if (!currentUser.value) return
  
  const q = query(collection(db, 'chats'), where('userIds', 'array-contains', currentUser.value.uid))
  
  unsubscribe = onSnapshot(q, async (snapshot) => {
    const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat))
    
    chatsWithProfiles.value = []
    for (const chat of chats) {
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
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>
