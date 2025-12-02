<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm text-slate-400 mb-2">Select Venue</label>
      <select
        v-model="selectedVenue"
        class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan"
        @change="$emit('select', selectedVenue)"
      >
        <option value="">Choose a venue...</option>
        <option v-for="venue in venues" :key="venue.id" :value="venue.id">
          {{ venue.name }}
        </option>
      </select>
    </div>

    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-slate-700"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-night text-slate-400">OR</span>
      </div>
    </div>

    <div>
      <label class="block text-sm text-slate-400 mb-2">Enter Venue Code</label>
      <input
        v-model="venueCode"
        type="text"
        placeholder="e.g., CLUB123"
        class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-neonCyan"
        @input="$emit('code', venueCode)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Venue } from '~/types'

defineProps<{
  venues: Venue[]
}>()

defineEmits<{
  select: [venueId: string]
  code: [code: string]
}>()

const selectedVenue = ref('')
const venueCode = ref('')
</script>
