<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6">
    <div class="max-w-md w-full space-y-8">
      <!-- Branding -->
      <div class="text-center space-y-4">
        <div class="text-7xl mb-4">🍸</div>
        <h1 class="text-5xl font-bold">
          <span class="bg-gradient-to-r from-neonCyan to-neonPink bg-clip-text text-transparent">Blur Hour</span>
        </h1>
        <p class="text-xl text-slate-300">
          Find singles in your venue tonight
        </p>
      </div>

      <!-- Venue Selection -->
      <div class="bg-slate-900/80 backdrop-blur-xl rounded-card border border-slate-700/60 p-6 space-y-4">
        <div>
          <label class="block text-sm text-slate-400 mb-2">Venue Code</label>
          <input
            v-model="venueCode"
            type="text"
            placeholder="Enter venue code"
            class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-neonCyan transition-colors"
          />
        </div>

        <button
          @click="enterVenue"
          :disabled="!venueCode"
          class="w-full py-4 bg-gradient-to-r from-neonCyan to-neonGreen rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Blur Hour
        </button>
      </div>

      <!-- Quick Info -->
      <div class="text-center text-sm text-slate-400 space-y-2">
        <p>🔥 Swipe to find singles</p>
        <p>💬 Match and chat tonight</p>
        <p>✨ Ephemeral connections</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { signIn } = useAuth()

const venueCode = ref('')

onMounted(async () => {
  // Check for venue in query params
  if (route.query.venueId) {
    venueCode.value = route.query.venueId as string
  }

  // Auto sign in anonymously
  await signIn()
})

const enterVenue = () => {
  if (!venueCode.value) return
  
  router.push({
    path: '/mode-selection',
    query: { venueId: venueCode.value }
  })
}
</script>
