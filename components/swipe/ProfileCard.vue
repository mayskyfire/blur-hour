<template>
  <div 
    class="absolute inset-4 bg-slate-900/90 backdrop-blur-xl rounded-card border border-slate-700/60 shadow-card overflow-hidden"
    :style="cardStyle"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-neonCyan/10 via-transparent to-neonPink/10" />
    
    <div class="relative h-full flex flex-col p-6">
      <div class="flex-1 flex flex-col justify-end">
        <div class="space-y-3">
          <div>
            <h2 class="text-4xl font-bold text-white mb-1">{{ profile.displayName }}</h2>
            <p class="text-xl text-slate-300">{{ profile.age }} • {{ profile.gender }}</p>
          </div>

          <div class="flex items-center gap-2 text-neonCyan">
            <span class="text-2xl">{{ getMoodEmoji(profile.mood) }}</span>
            <span class="text-lg">{{ profile.mood }}</span>
          </div>

          <div class="flex items-center gap-2 text-slate-300">
            <span class="text-xl">📍</span>
            <span>{{ profile.zone }}</span>
          </div>

          <div class="bg-slate-800/50 rounded-xl px-4 py-2 border border-slate-700/50">
            <p class="text-sm text-slate-400">Looking for</p>
            <p class="text-white">{{ profile.lookingFor }}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in profile.tags" 
              :key="tag"
              class="px-3 py-1 bg-gradient-to-r from-neonCyan/20 to-neonGreen/20 rounded-full text-sm border border-neonCyan/30"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div 
      v-if="swipeDirection" 
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div v-if="swipeDirection === 'right'" class="text-8xl animate-pulse">🍸</div>
      <div v-else class="text-8xl opacity-50">❌</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Profile } from '~/types'

interface Props {
  profile: Profile
  rotation?: number
  translateX?: number
  translateY?: number
  swipeDirection?: 'left' | 'right' | null
}

const props = withDefaults(defineProps<Props>(), {
  rotation: 0,
  translateX: 0,
  translateY: 0,
  swipeDirection: null
})

const cardStyle = computed(() => ({
  transform: `translate(${props.translateX}px, ${props.translateY}px) rotate(${props.rotation}deg)`,
  transition: props.translateX === 0 ? 'transform 0.3s ease-out' : 'none'
}))

const getMoodEmoji = (mood: string): string => {
  const moodMap: Record<string, string> = {
    'อยากคุย': '🍻',
    'อยากเต้น': '💃',
    'ชิล ๆ': '🎵',
    'สนุก': '🎉'
  }
  return moodMap[mood] || '✨'
}
</script>
