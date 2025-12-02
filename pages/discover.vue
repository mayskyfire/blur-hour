<template>
  <div class="h-[calc(100vh-8rem)] p-4">
    <div v-if="loading" class="h-full flex items-center justify-center">
      <div class="text-center space-y-4">
        <div class="text-5xl animate-pulse">🔍</div>
        <p class="text-slate-400">Finding singles nearby...</p>
      </div>
    </div>

    <div v-else-if="availableProfiles.length === 0" class="h-full flex items-center justify-center">
      <div class="text-center space-y-4 max-w-sm">
        <div class="text-6xl">😴</div>
        <h2 class="text-2xl font-bold">No One Here Yet</h2>
        <p class="text-slate-400">Be the first or check back soon!</p>
      </div>
    </div>

    <ShotOrNotSwipe
      v-else
      :profiles="availableProfiles"
      @swipe="handleSwipe"
    />

    <!-- Match Modal -->
    <Teleport to="body">
      <div
        v-if="showMatchModal"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6"
        @click="closeMatchModal"
      >
        <div class="bg-gradient-to-br from-neonPink/20 to-neonCyan/20 rounded-card border border-neonCyan p-8 text-center space-y-6 max-w-sm animate-bounce">
          <div class="text-7xl">🎉</div>
          <h2 class="text-3xl font-bold">It's a Match!</h2>
          <p class="text-slate-300">You both liked each other</p>
          <button
            @click="goToChat"
            class="w-full py-3 bg-gradient-to-r from-neonCyan to-neonGreen rounded-xl font-semibold shadow-neon-cyan"
          >
            Start Chatting
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Profile } from '~/types'

const router = useRouter()
const { subscribeVenueProfiles, getCurrentProfile } = useProfiles()
const { handleSwipe: processSwipe, getSwipedProfileIds } = useSwipesAndMatches()

const loading = ref(true)
const profiles = ref<Profile[]>([])
const swipedIds = ref<string[]>([])
const currentProfile = ref<Profile | null>(null)
const showMatchModal = ref(false)
const lastMatchProfile = ref<Profile | null>(null)

const availableProfiles = computed(() => {
  return profiles.value.filter(p => !swipedIds.value.includes(p.userId))
})

onMounted(async () => {
  currentProfile.value = await getCurrentProfile()
  
  if (!currentProfile.value) {
    router.push('/onboarding')
    return
  }

  swipedIds.value = await getSwipedProfileIds(currentProfile.value.venueId)

  subscribeVenueProfiles(currentProfile.value.venueId, (newProfiles) => {
    profiles.value = newProfiles
    loading.value = false
  })
})

const handleSwipe = async ({ profile, direction }: { profile: Profile; direction: 'left' | 'right' }) => {
  swipedIds.value.push(profile.userId)

  const result = await processSwipe(profile, direction)

  if (result.matched) {
    lastMatchProfile.value = profile
    showMatchModal.value = true
  }
}

const closeMatchModal = () => {
  showMatchModal.value = false
}

const goToChat = () => {
  showMatchModal.value = false
  router.push('/chats')
}
</script>
