<template>
  <div class="min-h-screen p-4 pb-24">
    <!-- Header -->
    <div class="mb-6 text-center">
      <div class="text-6xl mb-3">🗺️</div>
      <h1 class="text-3xl font-bold mb-2">แผนที่บาร์</h1>
      <p class="text-slate-400">ดูว่าโซนไหนมีคนเยอะ</p>
    </div>

    <!-- Legend -->
    <div class="mb-4 flex gap-2 justify-center flex-wrap">
      <div class="flex items-center gap-2 px-3 py-1 bg-slate-900/80 rounded-full border border-slate-700">
        <div class="w-3 h-3 rounded-full bg-neonGreen"></div>
        <span class="text-xs">คนเยอะ</span>
      </div>
      <div class="flex items-center gap-2 px-3 py-1 bg-slate-900/80 rounded-full border border-slate-700">
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span class="text-xs">ปานกลาง</span>
      </div>
      <div class="flex items-center gap-2 px-3 py-1 bg-slate-900/80 rounded-full border border-slate-700">
        <div class="w-3 h-3 rounded-full bg-slate-500"></div>
        <span class="text-xs">คนน้อย</span>
      </div>
    </div>

    <!-- Venue Map -->
    <div class="relative bg-slate-900/80 rounded-xl border border-slate-700/60 p-6 aspect-square max-w-md mx-auto">
      <!-- DJ Booth -->
      <div class="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-12 bg-neonPink/30 border-2 border-neonPink rounded-lg flex items-center justify-center">
        <span class="text-2xl">🎧</span>
      </div>

      <!-- Dance Floor -->
      <div class="absolute top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-neonCyan/20 border-2 border-neonCyan rounded-xl flex items-center justify-center">
        <div class="text-center">
          <div class="text-3xl mb-1">💃</div>
          <div class="text-xs font-bold">Dance Floor</div>
          <div class="text-xs text-neonGreen">{{ loading ? '...' : zones.danceFloor }} คน</div>
        </div>
      </div>

      <!-- Bar Counter -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-16 bg-neonGold/30 border-2 border-neonGold rounded-lg flex items-center justify-center">
        <div class="text-center">
          <div class="text-2xl mb-1">🍺</div>
          <div class="text-xs font-bold">Bar</div>
          <div class="text-xs text-neonGreen">{{ loading ? '...' : zones.bar }} คน</div>
        </div>
      </div>

      <!-- Zone A (Left) -->
      <div @click="selectZone('A')" 
        class="absolute top-1/2 left-4 -translate-y-1/2 w-16 h-24 bg-slate-800/50 border-2 rounded-lg flex items-center justify-center cursor-pointer hover:border-neonCyan transition-all"
        :class="zones.zoneA > 10 ? 'border-neonGreen' : zones.zoneA > 5 ? 'border-yellow-500' : 'border-slate-600'">
        <div class="text-center">
          <div class="text-xl mb-1">🪑</div>
          <div class="text-xs font-bold">Zone A</div>
          <div class="text-xs">{{ loading ? '...' : zones.zoneA }} คน</div>
        </div>
      </div>

      <!-- Zone B (Right) -->
      <div @click="selectZone('B')"
        class="absolute top-1/2 right-4 -translate-y-1/2 w-16 h-24 bg-slate-800/50 border-2 rounded-lg flex items-center justify-center cursor-pointer hover:border-neonCyan transition-all"
        :class="zones.zoneB > 10 ? 'border-neonGreen' : zones.zoneB > 5 ? 'border-yellow-500' : 'border-slate-600'">
        <div class="text-center">
          <div class="text-xl mb-1">🪑</div>
          <div class="text-xs font-bold">Zone B</div>
          <div class="text-xs">{{ loading ? '...' : zones.zoneB }} คน</div>
        </div>
      </div>

      <!-- Outdoor (Top Right) -->
      <div @click="selectZone('Outdoor')"
        class="absolute top-4 right-4 w-20 h-20 bg-slate-800/50 border-2 rounded-lg flex items-center justify-center cursor-pointer hover:border-neonCyan transition-all"
        :class="zones.outdoor > 10 ? 'border-neonGreen' : zones.outdoor > 5 ? 'border-yellow-500' : 'border-slate-600'">
        <div class="text-center">
          <div class="text-xl mb-1">🌙</div>
          <div class="text-xs font-bold">Outdoor</div>
          <div class="text-xs">{{ loading ? '...' : zones.outdoor }} คน</div>
        </div>
      </div>

      <!-- VIP (Top Left) -->
      <div @click="selectZone('VIP')"
        class="absolute top-4 left-4 w-20 h-20 bg-slate-800/50 border-2 rounded-lg flex items-center justify-center cursor-pointer hover:border-neonCyan transition-all"
        :class="zones.vip > 10 ? 'border-neonGreen' : zones.vip > 5 ? 'border-yellow-500' : 'border-slate-600'">
        <div class="text-center">
          <div class="text-xl mb-1">👑</div>
          <div class="text-xs font-bold">VIP</div>
          <div class="text-xs">{{ loading ? '...' : zones.vip }} คน</div>
        </div>
      </div>
    </div>

    <!-- Zone Details -->
    <div v-if="selectedZone" class="mt-6 bg-gradient-to-r from-neonCyan/10 to-neonPink/10 rounded-xl border border-neonCyan/30 p-6">
      <h3 class="text-xl font-bold mb-3">{{ selectedZone.name }}</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-slate-400">จำนวนคน</span>
          <span class="font-bold text-neonCyan">{{ selectedZone.count }} คน</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-400">บรรยากาศ</span>
          <span class="font-bold">{{ selectedZone.vibe }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-400">เพลงที่กำลังเล่น</span>
          <span class="text-sm">{{ selectedZone.currentSong }}</span>
        </div>
        <button @click="goToZone"
          class="w-full py-3 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl font-semibold mt-4">
          ไปที่โซนนี้ 🚀
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="mt-6 grid grid-cols-2 gap-3">
      <div class="bg-slate-900/80 rounded-xl border border-slate-700/60 p-4 text-center">
        <div class="text-3xl mb-2">👥</div>
        <div class="text-2xl font-bold text-neonCyan">{{ totalPeople }}</div>
        <div class="text-xs text-slate-400">คนในบาร์</div>
      </div>
      <div class="bg-slate-900/80 rounded-xl border border-slate-700/60 p-4 text-center">
        <div class="text-3xl mb-2">🔥</div>
        <div class="text-2xl font-bold text-neonPink">{{ hottestZone }}</div>
        <div class="text-xs text-slate-400">โซนที่คึกคักที่สุด</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { subscribeVenueProfiles, getCurrentProfile } = useProfiles()

const zones = ref({
  danceFloor: 0,
  bar: 0,
  zoneA: 0,
  zoneB: 0,
  outdoor: 0,
  vip: 0
})

const selectedZone = ref<any>(null)
const loading = ref(true)
const currentProfile = ref<any>(null)

const totalPeople = computed(() => {
  return Object.values(zones.value).reduce((sum, count) => sum + count, 0)
})

const hottestZone = computed(() => {
  const entries = Object.entries(zones.value)
  const max = entries.reduce((prev, curr) => curr[1] > prev[1] ? curr : prev)
  const zoneNames: any = {
    danceFloor: 'Dance Floor',
    bar: 'Bar',
    zoneA: 'Zone A',
    zoneB: 'Zone B',
    outdoor: 'Outdoor',
    vip: 'VIP'
  }
  return zoneNames[max[0]]
})

const selectZone = (zoneName: string) => {
  const zoneData: any = {
    'A': { name: 'Zone A', count: zones.value.zoneA, vibe: '🎵 สบายๆ', currentSong: 'ไม่บอกเธอ - Polycat' },
    'B': { name: 'Zone B', count: zones.value.zoneB, vibe: '💬 คุยกัน', currentSong: 'คนที่คุณรัก - Slot Machine' },
    'Outdoor': { name: 'Outdoor', count: zones.value.outdoor, vibe: '🌙 ชิลล์', currentSong: 'ขอบคุณที่รัก - Potato' },
    'VIP': { name: 'VIP', count: zones.value.vip, vibe: '👑 พรีเมี่ยม', currentSong: 'เธอคือ - Singular' }
  }
  selectedZone.value = zoneData[zoneName]
}

const goToZone = () => {
  // Navigate to discover page with zone filter
  navigateTo({
    path: '/discover',
    query: { zone: selectedZone.value.name }
  })
}

// Count profiles by zone
const countProfilesByZone = (profiles: any[]) => {
  const counts = {
    danceFloor: 0,
    bar: 0,
    zoneA: 0,
    zoneB: 0,
    outdoor: 0,
    vip: 0
  }
  
  profiles.forEach(profile => {
    const zone = profile.zone
    if (zone === 'Dance Floor') counts.danceFloor++
    else if (zone === 'Bar') counts.bar++
    else if (zone === 'Zone A') counts.zoneA++
    else if (zone === 'Zone B') counts.zoneB++
    else if (zone === 'Outdoor') counts.outdoor++
    else if (zone === 'VIP') counts.vip++
  })
  
  return counts
}

let unsubscribeProfiles: (() => void) | null = null

onMounted(async () => {
  try {
    currentProfile.value = await getCurrentProfile()
    
    if (!currentProfile.value) {
      loading.value = false
      return
    }
    
    // Subscribe to venue profiles to get real-time zone counts
    unsubscribeProfiles = subscribeVenueProfiles(currentProfile.value.venueId, (profiles) => {
      zones.value = countProfilesByZone(profiles)
      loading.value = false
    })
  } catch (error) {
    console.error('Error loading venue map:', error)
    loading.value = false
  }
})

onUnmounted(() => {
  if (unsubscribeProfiles) unsubscribeProfiles()
})
</script>
