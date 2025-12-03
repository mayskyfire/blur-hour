<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-50 bg-night-light/80 backdrop-blur-lg border-b border-slate-700/50">
      <div class="flex items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-2xl">🍸</span>
          <span class="text-xl font-bold bg-gradient-to-r from-neonCyan to-neonPink bg-clip-text text-transparent">
            Blur Hour
          </span>
        </NuxtLink>
        <NuxtLink v-if="currentUser" to="/profile" class="w-10 h-10 rounded-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center shadow-neon-cyan">
          <span class="text-lg">👤</span>
        </NuxtLink>
      </div>
    </header>

    <main class="flex-1 overflow-auto">
      <slot />
    </main>

    <nav v-if="currentUser && showBottomNav" class="sticky bottom-0 bg-night-light/90 backdrop-blur-lg border-t border-slate-700/50 safe-bottom">
      <div class="flex items-center justify-around px-4 py-3">
        <NuxtLink to="/discover" class="flex flex-col items-center gap-1 transition-colors" :class="route.path === '/discover' ? 'text-neonCyan' : 'text-slate-400'">
          <span class="text-2xl">🔥</span>
          <span class="text-xs">Discover</span>
        </NuxtLink>
        <NuxtLink to="/chats" class="flex flex-col items-center gap-1 transition-colors" :class="route.path.startsWith('/chats') ? 'text-neonPink' : 'text-slate-400'">
          <span class="text-2xl">💬</span>
          <span class="text-xs">Chats</span>
        </NuxtLink>
        <NuxtLink to="/profile" class="flex flex-col items-center gap-1 transition-colors" :class="route.path === '/profile' ? 'text-neonGreen' : 'text-slate-400'">
          <span class="text-2xl">⚙️</span>
          <span class="text-xs">Profile</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { currentUser } = useAuth()
const route = useRoute()
const showBottomNav = computed(() => !['/onboarding', '/'].includes(route.path))
</script>
