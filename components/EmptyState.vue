<template>
  <div class="flex items-center justify-center p-12">
    <div class="text-center space-y-4 max-w-sm">
      <div class="text-6xl">{{ emoji }}</div>
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <p class="text-slate-400">{{ description }}</p>
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  emoji: string
  title: string
  description: string
}>()
</script>
