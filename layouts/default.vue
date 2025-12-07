<template>
  <div class="min-h-screen flex flex-col">
    <header
      class="sticky top-0 z-50 bg-night-light/80 backdrop-blur-lg border-b border-slate-700/50"
    >
      <div class="flex items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-2">
          <PhMartini :size="28" class="text-neonCyan" />
          <span
            class="text-xl font-bold bg-gradient-to-r from-neonCyan to-neonPink bg-clip-text text-transparent"
          >
            Blur Hour
          </span>
        </NuxtLink>
        <ClientOnly>
          <NuxtLink
            v-if="currentUser"
            to="/profile"
            class="w-10 h-10 rounded-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center shadow-neon-cyan overflow-hidden"
          >
            <img
              v-if="
                currentProfile?.photos?.[0] &&
                (currentProfile.photos[0].startsWith('data:') ||
                  currentProfile.photos[0].startsWith('http'))
              "
              :src="currentProfile.photos[0]"
              :alt="currentProfile.displayName"
              class="w-full h-full object-cover"
            />
            <PhUser v-else :size="20" weight="bold" class="text-white" />
          </NuxtLink>
        </ClientOnly>
      </div>
    </header>

    <main class="flex-1 overflow-auto">
      <slot />
    </main>

    <!-- Notification Toasts -->
    <div class="fixed top-20 right-4 z-50 space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="bg-slate-900/90 backdrop-blur-xl border rounded-xl p-4 shadow-lg animate-slide-in-right max-w-sm"
        :class="{
          'border-neonGreen': notification.type === 'success',
          'border-red-500': notification.type === 'error',
          'border-neonCyan': notification.type === 'info',
        }"
      >
        <p class="text-white text-sm">{{ notification.message }}</p>
      </div>
    </div>

    <ClientOnly>
      <nav
        v-if="currentUser && showBottomNav"
        class="sticky bottom-0 bg-night-light/90 backdrop-blur-lg border-t border-slate-700/50 safe-bottom"
      >
        <div class="flex items-center justify-around px-2 py-3">
          <NuxtLink
            to="/live-feed"
            class="flex flex-col items-center gap-1 transition-all relative"
            :class="
              route.path === '/live-feed'
                ? 'text-red-500 scale-110'
                : 'text-slate-400 hover:text-slate-300'
            "
          >
            <div class="relative">
              <PhCamera :size="24" weight="fill" />
              <span v-if="route.path === '/live-feed'" class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </div>
            <span class="text-xs font-medium">Live</span>
            <span
              v-if="route.path === '/live-feed'"
              class="absolute -bottom-1 w-6 h-0.5 bg-red-500 rounded-full"
            ></span>
          </NuxtLink>
          <NuxtLink
            to="/discover"
            class="flex flex-col items-center gap-1 transition-all relative"
            :class="
              route.path === '/discover'
                ? 'text-neonPink scale-110'
                : 'text-slate-400 hover:text-slate-300'
            "
          >
            <PhFire :size="24" weight="fill" />
            <span class="text-xs font-medium">Swipe</span>
            <span
              v-if="route.path === '/discover'"
              class="absolute -bottom-1 w-6 h-0.5 bg-neonPink rounded-full"
            ></span>
          </NuxtLink>
          <NuxtLink
            to="/venue-map"
            class="flex flex-col items-center gap-1 transition-all relative"
            :class="
              route.path === '/venue-map'
                ? 'text-neonGold scale-110'
                : 'text-slate-400 hover:text-slate-300'
            "
          >
            <PhMapPin :size="24" weight="fill" />
            <span class="text-xs font-medium">Map</span>
            <span
              v-if="route.path === '/venue-map'"
              class="absolute -bottom-1 w-6 h-0.5 bg-neonGold rounded-full"
            ></span>
          </NuxtLink>
          <NuxtLink
            to="/missions"
            class="flex flex-col items-center gap-1 transition-all relative"
            :class="
              route.path === '/missions'
                ? 'text-purple-400 scale-110'
                : 'text-slate-400 hover:text-slate-300'
            "
          >
            <PhGameController :size="24" weight="fill" />
            <span class="text-xs font-medium">Quest</span>
            <span
              v-if="route.path === '/missions'"
              class="absolute -bottom-1 w-6 h-0.5 bg-purple-400 rounded-full"
            ></span>
          </NuxtLink>
          <NuxtLink
            to="/chats"
            class="flex flex-col items-center gap-1 transition-all relative"
            :class="
              route.path.startsWith('/chats')
                ? 'text-neonGreen scale-110'
                : 'text-slate-400 hover:text-slate-300'
            "
          >
            <PhChatCircle :size="24" weight="fill" />
            <span class="text-xs font-medium">Chat</span>
            <span
              v-if="route.path.startsWith('/chats')"
              class="absolute -bottom-1 w-6 h-0.5 bg-neonGreen rounded-full"
            ></span>
          </NuxtLink>
        </div>
      </nav>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const { currentUser } = useAuth();
const { getCurrentProfile } = useProfiles();
const { notifications } = useNotifications();
const route = useRoute();
const showBottomNav = computed(
  () => !["/onboarding", "/"].includes(route.path)
);

const currentProfile = ref<any>(null);
const liveGridUrl = computed(() => {
  return currentProfile.value?.venueId
    ? `/venue/${currentProfile.value.venueId}/live`
    : "/venue/NEON123/live";
});

onMounted(async () => {
  if (currentUser.value) {
    currentProfile.value = await getCurrentProfile();
    console.log("Current profile loaded:", currentProfile.value);
  }
});

// Watch for user changes
watch(currentUser, async (newUser) => {
  if (newUser) {
    currentProfile.value = await getCurrentProfile();
  } else {
    currentProfile.value = null;
  }
});
</script>
