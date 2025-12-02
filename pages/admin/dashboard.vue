<template>
  <div class="min-h-screen p-6">
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-3xl font-bold">Admin Dashboard</h1>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-slate-900/80 rounded-xl border border-slate-700/60 p-6">
          <div class="text-4xl mb-2">👥</div>
          <div class="text-3xl font-bold text-neonCyan">{{ stats.totalUsers }}</div>
          <div class="text-sm text-slate-400">Total Users</div>
        </div>

        <div class="bg-slate-900/80 rounded-xl border border-slate-700/60 p-6">
          <div class="text-4xl mb-2">💚</div>
          <div class="text-3xl font-bold text-neonGreen">{{ stats.activeSingles }}</div>
          <div class="text-sm text-slate-400">Active Singles</div>
        </div>

        <div class="bg-slate-900/80 rounded-xl border border-slate-700/60 p-6">
          <div class="text-4xl mb-2">🔥</div>
          <div class="text-3xl font-bold text-neonPink">{{ stats.totalMatches }}</div>
          <div class="text-sm text-slate-400">Total Matches</div>
        </div>

        <div class="bg-slate-900/80 rounded-xl border border-slate-700/60 p-6">
          <div class="text-4xl mb-2">💬</div>
          <div class="text-3xl font-bold text-neonCyan">{{ stats.activeChats }}</div>
          <div class="text-sm text-slate-400">Active Chats</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, query, where, getDocs } from 'firebase/firestore'

const { db } = useFirebase()

const stats = reactive({
  totalUsers: 0,
  activeSingles: 0,
  totalMatches: 0,
  activeChats: 0
})

onMounted(async () => {
  const profilesSnap = await getDocs(collection(db, 'profiles'))
  stats.totalUsers = profilesSnap.size

  const singlesQuery = query(collection(db, 'profiles'), where('status', '==', 'single'))
  const singlesSnap = await getDocs(singlesQuery)
  stats.activeSingles = singlesSnap.size

  const matchesSnap = await getDocs(collection(db, 'matches'))
  stats.totalMatches = matchesSnap.size

  const chatsSnap = await getDocs(collection(db, 'chats'))
  stats.activeChats = chatsSnap.size
})
</script>
