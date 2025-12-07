<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-night via-night-light to-night">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center space-y-3">
        <div class="relative inline-block">
          <PhHeart :size="80" class="text-neonPink mx-auto animate-pulse" weight="fill" />
          <PhMartini :size="40" class="text-neonCyan absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" weight="fill" />
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-neonPink via-neonCyan to-neonPink bg-clip-text text-transparent">คุณมาที่นี่เพื่อ?</h1>
        <p class="text-slate-300 text-lg">เลือกสถานะของคุณคืนนี้</p>
      </div>

      <div class="space-y-4">
        <button
          v-for="mode in modes"
          :key="mode.value"
          @click="selectMode(mode.value)"
          class="group relative w-full p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden"
          :class="mode.color"
        >
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="mode.bgGlow"></div>
          <div class="relative flex items-center gap-5">
            <div class="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center" :class="mode.iconBg">
              <component :is="mode.icon" :size="32" weight="fill" />
            </div>
            <div class="text-left flex-1">
              <div class="font-bold text-xl mb-1">{{ mode.label }}</div>
              <div class="text-sm opacity-90">{{ mode.desc }}</div>
            </div>
            <PhCaretRight :size="24" class="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      </div>

      <p class="text-center text-xs text-slate-500 mt-6">สามารถเปลี่ยนสถานะได้ทุกเมื่อในโปรไฟล์</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const modes = [
  {
    value: 'single',
    icon: 'PhHeart',
    label: 'หาคู่คุย หาแฟน',
    desc: 'พร้อมพบปะและทำความรู้จักคนใหม่',
    color: 'bg-neonPink/10 border-neonPink text-neonPink hover:bg-neonPink/20',
    iconBg: 'bg-neonPink/20',
    bgGlow: 'bg-gradient-to-r from-neonPink/5 to-transparent'
  },
  {
    value: 'maybe',
    icon: 'PhSmiley',
    label: 'คุยเล่น ไม่จริงจัง',
    desc: 'เปิดกว้างสำหรับเพื่อนใหม่ แต่ไม่หาอะไรจริงจัง',
    color: 'bg-neonCyan/10 border-neonCyan text-neonCyan hover:bg-neonCyan/20',
    iconBg: 'bg-neonCyan/20',
    bgGlow: 'bg-gradient-to-r from-neonCyan/5 to-transparent'
  },
  {
    value: 'busy',
    icon: 'PhUsers',
    label: 'มากับเพื่อน ไม่หาคู่',
    desc: 'แค่มาสนุก ไม่ต้องการแสดงในรายการ',
    color: 'bg-slate-500/10 border-slate-500 text-slate-400 hover:bg-slate-500/20',
    iconBg: 'bg-slate-500/20',
    bgGlow: 'bg-gradient-to-r from-slate-500/5 to-transparent'
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
