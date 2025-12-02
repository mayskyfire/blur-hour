<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[200] space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="px-4 py-3 rounded-xl shadow-lg backdrop-blur-xl border"
          :class="{
            'bg-neonGreen/20 border-neonGreen text-neonGreen': notification.type === 'success',
            'bg-neonPink/20 border-neonPink text-neonPink': notification.type === 'error',
            'bg-neonCyan/20 border-neonCyan text-neonCyan': notification.type === 'info'
          }"
        >
          {{ notification.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { notifications } = useNotifications()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
