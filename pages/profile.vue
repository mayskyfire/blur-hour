<template>
  <div class="min-h-screen p-6">
    <div class="max-w-md mx-auto space-y-6">
      <h1 class="text-3xl font-bold mb-6">Your Profile</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="text-4xl animate-pulse">⚙️</div>
      </div>

      <div v-else-if="profile" class="space-y-4">
        <!-- Profile Card -->
        <div class="bg-slate-900/80 backdrop-blur-xl rounded-card border border-slate-700/60 p-6 space-y-4">
          <div class="text-center">
            <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-5xl mb-4">
              👤
            </div>
            <h2 class="text-2xl font-bold">{{ profile.displayName }}</h2>
            <p class="text-slate-400">{{ profile.age }} • {{ profile.gender }}</p>
          </div>

          <div class="space-y-3 pt-4 border-t border-slate-700/50">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ getMoodEmoji(profile.mood) }}</span>
              <div>
                <p class="text-xs text-slate-400">Mood</p>
                <p>{{ profile.mood }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-2xl">📍</span>
              <div>
                <p class="text-xs text-slate-400">Zone</p>
                <p>{{ profile.zone }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-2xl">🔍</span>
              <div>
                <p class="text-xs text-slate-400">Looking For</p>
                <p>{{ profile.lookingFor }}</p>
              </div>
            </div>

            <div>
              <p class="text-xs text-slate-400 mb-2">Tags</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in profile.tags"
                  :key="tag"
                  class="px-3 py-1 bg-neonCyan/20 border border-neonCyan/30 rounded-full text-sm"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Toggle -->
        <div class="bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/60 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">Status</p>
              <p class="text-sm text-slate-400">{{ profile.status === 'single' ? 'Available' : 'Busy' }}</p>
            </div>
            <button
              @click="toggleStatus"
              class="px-4 py-2 rounded-lg transition-colors"
              :class="profile.status === 'single'
                ? 'bg-neonGreen/20 text-neonGreen border border-neonGreen'
                : 'bg-slate-700 text-slate-300 border border-slate-600'"
            >
              {{ profile.status === 'single' ? '✓ Available' : '✗ Busy' }}
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <NuxtLink
            to="/onboarding"
            class="block w-full py-3 bg-slate-800 border border-slate-700 rounded-xl text-center font-semibold hover:border-neonCyan transition-colors"
          >
            Edit Profile
          </NuxtLink>

          <button
            @click="leaveSession"
            class="w-full py-3 bg-neonPink/20 border border-neonPink rounded-xl font-semibold text-neonPink hover:bg-neonPink/30 transition-colors"
          >
            Leave Blur Hour Session
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Profile } from '~/types'

const router = useRouter()
const { getCurrentProfile, createOrUpdateProfile } = useProfiles()

const loading = ref(true)
const profile = ref<Profile | null>(null)

onMounted(async () => {
  profile.value = await getCurrentProfile()
  loading.value = false
})

const getMoodEmoji = (mood: string): string => {
  const moodMap: Record<string, string> = {
    'อยากคุย': '🍻',
    'อยากเต้น': '💃',
    'ชิล ๆ': '🎵',
    'สนุก': '🎉'
  }
  return moodMap[mood] || '✨'
}

const toggleStatus = async () => {
  if (!profile.value) return

  const newStatus = profile.value.status === 'single' ? 'busy' : 'single'
  
  await createOrUpdateProfile({
    ...profile.value,
    status: newStatus
  })

  profile.value.status = newStatus
}

const leaveSession = async () => {
  if (!profile.value) return

  await createOrUpdateProfile({
    ...profile.value,
    status: 'hidden'
  })

  router.push('/')
}
</script>
