<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6"
        @click="$emit('close')"
      >
        <div
          class="bg-gradient-to-br from-neonPink/20 to-neonCyan/20 rounded-card border border-neonCyan p-8 text-center space-y-6 max-w-sm"
          @click.stop
        >
          <div class="text-7xl animate-bounce">🎉</div>
          <h2 class="text-3xl font-bold">It's a Match!</h2>
          <p class="text-slate-300">You both liked each other</p>
          <div class="space-y-3">
            <button
              @click="$emit('chat')"
              class="w-full py-3 bg-gradient-to-r from-neonCyan to-neonGreen rounded-xl font-semibold shadow-neon-cyan"
            >
              Start Chatting
            </button>
            <button
              @click="$emit('close')"
              class="w-full py-3 bg-slate-800/50 border border-slate-700 rounded-xl font-semibold"
            >
              Keep Swiping
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
defineEmits<{
  close: []
  chat: []
}>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
