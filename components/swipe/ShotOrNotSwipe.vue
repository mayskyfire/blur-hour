<template>
  <div class="relative w-full h-full flex flex-col">
    <div 
      ref="stackRef"
      class="relative flex-1 pb-24"
      @mousedown="handleStart"
      @touchstart="handleStart"
    >
      <ProfileCard
        v-for="(profile, index) in visibleProfiles"
        :key="profile.userId"
        :profile="profile"
        :rotation="index === 0 ? rotation : 0"
        :translateX="index === 0 ? translateX : 0"
        :translateY="index === 0 ? translateY : 0"
        :swipeDirection="index === 0 ? swipeDirection : null"
        :hasVibeFromUser="props.receivedVibes.includes(profile.userId)"
        :style="{ zIndex: visibleProfiles.length - index }"
      />
    </div>

    <!-- Controls -->
    <div class="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-8 py-4 bg-gradient-to-t from-night via-night/80 to-transparent">
      <button
        @click="() => handleButtonSwipe('left')"
        class="w-16 h-16 rounded-full bg-slate-800/80 backdrop-blur border-2 border-slate-600 flex items-center justify-center text-3xl hover:scale-110 transition-transform active:scale-95"
      >
        ❌
      </button>

      <div class="flex gap-2">
        <div 
          v-for="i in Math.min(profiles.length, 1)" 
          :key="i"
          class="w-2 h-2 rounded-full bg-neonCyan"
        />
      </div>

      <button
        @click="() => handleButtonSwipe('right')"
        class="w-16 h-16 rounded-full bg-gradient-to-br from-neonGreen to-neonCyan shadow-neon-green flex items-center justify-center text-3xl hover:scale-110 transition-transform active:scale-95"
      >
        🍸
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Profile } from '~/types'
import ProfileCard from '~/components/swipe/ProfileCard.vue'

interface Props {
  profiles: Profile[]
  receivedVibes?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  receivedVibes: () => []
})
const emit = defineEmits<{
  swipe: [{ profile: Profile; direction: 'left' | 'right' }]
}>()

const stackRef = ref<HTMLElement>()
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const translateX = ref(0)
const translateY = ref(0)
const rotation = ref(0)
const swipeDirection = ref<'left' | 'right' | null>(null)

const SWIPE_THRESHOLD = 80

const visibleProfiles = computed(() => props.profiles.slice(0, 3))

const handleStart = (e: MouseEvent | TouchEvent) => {
  if (props.profiles.length === 0) return

  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  startX.value = clientX
  startY.value = clientY

  if ('touches' in e) {
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleEnd)
  } else {
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)
  }
}

const handleMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

  translateX.value = clientX - startX.value
  translateY.value = clientY - startY.value
  rotation.value = translateX.value / 20

  if (Math.abs(translateX.value) > SWIPE_THRESHOLD / 2) {
    swipeDirection.value = translateX.value > 0 ? 'right' : 'left'
  } else {
    swipeDirection.value = null
  }
}

const handleEnd = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMove)
  document.removeEventListener('mouseup', handleEnd)
  document.removeEventListener('touchmove', handleMove)
  document.removeEventListener('touchend', handleEnd)

  if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
    const direction = translateX.value > 0 ? 'right' : 'left'
    completeSwipe(direction)
  } else {
    resetCard()
  }
}

const completeSwipe = (direction: 'left' | 'right') => {
  const profile = props.profiles[0]
  
  translateX.value = direction === 'right' ? 500 : -500
  
  setTimeout(() => {
    emit('swipe', { profile, direction })
    resetCard()
  }, 300)
}

const handleButtonSwipe = (direction: 'left' | 'right') => {
  if (props.profiles.length === 0) return
  completeSwipe(direction)
}

const resetCard = () => {
  translateX.value = 0
  translateY.value = 0
  rotation.value = 0
  swipeDirection.value = null
}
</script>
