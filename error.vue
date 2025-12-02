<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="text-center space-y-6 max-w-md">
      <div class="text-8xl">😵</div>
      <h1 class="text-4xl font-bold">{{ error.statusCode }}</h1>
      <p class="text-xl text-slate-300">{{ error.message }}</p>
      <button
        @click="handleError"
        class="px-6 py-3 bg-gradient-to-r from-neonCyan to-neonGreen rounded-xl font-semibold shadow-neon-cyan"
      >
        Go Back Home
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })
</script>
