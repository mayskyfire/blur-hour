<template>
  <span v-if="count > 0" 
    class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse">
    {{ displayCount }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  count: number
}>()

const displayCount = computed(() => {
  return props.count > 99 ? '99+' : props.count.toString()
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
