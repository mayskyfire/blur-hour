<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { initAuth, currentUser } = useAuth()
const { subscribeToReceivedVibes } = useVibes()
const { notify } = useNotifications()

let unsubscribeVibes: (() => void) | null = null

onMounted(() => {
  initAuth()
  
  // Subscribe to received vibes for notifications
  watch(currentUser, (user) => {
    if (user && !unsubscribeVibes) {
      unsubscribeVibes = subscribeToReceivedVibes((vibes) => {
        // Show notification for new vibes
        const newVibes = vibes.filter(v => {
          const vibeTime = v.createdAt?.toDate?.() || new Date(v.createdAt)
          return Date.now() - vibeTime.getTime() < 5000 // Last 5 seconds
        })
        
        newVibes.forEach(vibe => {
          const vibeType = VIBE_TYPES.find(t => t.value === vibe.type)
          notify(`${vibeType?.emoji || '✨'} Someone sent you a vibe!`, 'info')
        })
      })
    }
  }, { immediate: true })
})

onUnmounted(() => {
  if (unsubscribeVibes) unsubscribeVibes()
})
</script>
