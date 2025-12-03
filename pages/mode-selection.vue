<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center space-y-2">
        <div class="text-6xl mb-4">🍸</div>
        <h1 class="text-3xl font-bold">เลือกโหมดของคุณ</h1>
        <p class="text-slate-400">เพื่อให้คนอื่นเข้าใจคุณได้ง่ายขึ้น</p>
      </div>

      <div class="space-y-3">
        <button
          v-for="mode in modes"
          :key="mode.value"
          @click="selectMode(mode.value)"
          class="w-full p-6 rounded-card border-2 transition-all hover:scale-105"
          :class="mode.color"
        >
          <div class="flex items-center gap-4">
            <div class="text-4xl">{{ mode.emoji }}</div>
            <div class="text-left flex-1">
              <div class="font-bold text-lg">{{ mode.label }}</div>
              <div class="text-sm opacity-80">{{ mode.desc }}</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const modes = [
  {
    value: 'single',
    emoji: '✅',
    label: 'โสด เปิดรับทำความรู้จัก',
    desc: 'พร้อมพบปะคนใหม่ ๆ',
    color: 'bg-green-500/10 border-green-500 text-green-400 hover:bg-green-500/20'
  },
  {
    value: 'maybe',
    emoji: '🟡',
    label: 'คุยเล่นได้ ยังไม่แน่ใจ',
    desc: 'เปิดกว้าง แต่ไม่หาจริงจัง',
    color: 'bg-yellow-500/10 border-yellow-500 text-yellow-400 hover:bg-yellow-500/20'
  },
  {
    value: 'busy',
    emoji: '🔴',
    label: 'มาเมา/มาเพื่อน ไม่หาคนคุย',
    desc: 'ไม่แสดงในรายการ',
    color: 'bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500/20'
  }
]

const selectMode = (mode: string) => {
  router.push({
    path: '/quick-profile',
    query: { 
      venueId: route.query.venueId,
      mode 
    }
  })
}
</script>
