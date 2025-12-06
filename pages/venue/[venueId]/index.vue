<template>
  <div class="min-h-screen">
    <div class="max-w-md mx-auto p-6">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">🍸 {{ venueName }}</h1>
        <p class="text-slate-400">{{ onlineCount }} คนออนไลน์</p>
      </div>

      <div class="space-y-4">
        <NuxtLink
          :to="`/venue/${venueId}/live`"
          class="block w-full py-4 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl text-center font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          🔥 เริ่มหาคู่คุย
        </NuxtLink>

        <NuxtLink
          to="/chats"
          class="block w-full py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-center font-semibold text-lg hover:bg-slate-700/50 transition-all"
        >
          💬 แชทของฉัน
        </NuxtLink>

        <NuxtLink
          to="/profile"
          class="block w-full py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-center font-semibold text-lg hover:bg-slate-700/50 transition-all"
        >
          👤 โปรไฟล์
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const venueId = route.params.venueId as string

const venueName = computed(() => {
  const venues: Record<string, string> = {
    'demo-bar': 'Demo Bar',
    'NEON123': 'Neon Club',
    'default': 'Blur Hour Venue'
  }
  return venues[venueId] || venues.default
})

const onlineCount = ref(Math.floor(Math.random() * 50) + 10)
</script>