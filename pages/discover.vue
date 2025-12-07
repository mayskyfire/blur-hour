<template>
  <div class="h-[calc(100vh-13rem)] p-4">
    <!-- Stats Bar -->
    <div class="mb-4 p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <PhMartini :size="24" class="text-neonCyan" weight="fill" />
        <div>
          <p class="text-xs text-slate-400">Shot วันนี้</p>
          <p class="text-lg font-bold">{{ todaySwipeCount }}</p>
        </div>
      </div>
      <button
        @click="showHistoryModal = true"
        class="px-4 py-2 bg-gradient-to-r from-neonCyan to-neonPink rounded-lg text-sm font-semibold"
      >
        ดูประวัติ
      </button>
    </div>



    <!-- Toast Alerts -->
    <div class="fixed top-20 left-4 right-4 z-50 space-y-2">
      <!-- Zone Filter Toast -->
      <Transition name="slide-down">
        <div v-if="showZoneToast && selectedZone" class="bg-gradient-to-r from-neonCyan/10 to-neonPink/10 backdrop-blur-md rounded-lg p-3 shadow-lg border border-neonCyan/30 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <PhMapPin :size="16" class="text-neonCyan" weight="fill" />
            <span class="text-sm font-semibold">กำลังดูคนใน {{ selectedZone }}</span>
          </div>
          <button @click="hideZoneToast" class="text-slate-400 hover:text-white text-lg leading-none">
            ×
          </button>
        </div>
      </Transition>
      
      <!-- Received Vibes Toast -->
      <Transition name="slide-down">
        <div v-if="showVibesAlert && receivedVibes.length > 0" class="bg-gradient-to-r from-neonPink/20 to-neonCyan/20 backdrop-blur-md rounded-lg p-3 shadow-lg border border-neonPink/30 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <PhHeart :size="16" class="text-neonPink animate-pulse" weight="fill" />
            <span class="text-sm font-semibold">{{ receivedVibes.length }} คนส่ง vibe ให้คุณ!</span>
          </div>
          <button @click="hideVibesAlert" class="text-slate-400 hover:text-white text-lg leading-none">
            ×
          </button>
        </div>
      </Transition>
    </div>

    <div v-if="loading" class="h-full flex items-center justify-center">
      <div class="text-center space-y-4">
        <PhUsers :size="60" class="text-neonCyan animate-pulse mx-auto" weight="fill" />
        <p class="text-slate-400">กำลังหาคนโสดใกล้ๆ...</p>
      </div>
    </div>

    <div
      v-else-if="availableProfiles.length === 0"
      class="h-full flex items-center justify-center"
    >
      <div class="text-center space-y-4 max-w-sm">
        <PhSmiley :size="80" class="text-slate-500 mx-auto" weight="fill" />
        <h2 class="text-2xl font-bold">ยังไม่มีใครอยู่ที่นี่</h2>
        <p class="text-slate-400">เป็นคนแรกหรือกลับมาดูใหม่อีกทีนะ!</p>
      </div>
    </div>

    <ShotOrNotSwipe
      v-else
      :profiles="availableProfiles"
      :receivedVibes="receivedVibes"
      @swipe="handleSwipe"
    />

    <!-- Match Modal -->
    <Teleport to="body">
      <div
        v-if="showMatchModal"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6"
        @click="closeMatchModal"
      >
        <div
          class="bg-gradient-to-br from-neonPink/20 to-neonCyan/20 rounded-card border border-neonCyan p-8 text-center space-y-6 max-w-sm"
          style="animation: ease-in-out 3"
        >
          <PhHeart :size="80" class="text-neonPink mx-auto" weight="fill" />
          <h2 class="text-3xl font-bold">จับคู่สำเร็จ!</h2>
          <p class="text-slate-300">คุณทั้งคู่ชอบกัน</p>
          <button
            @click="goToChat"
            class="w-full py-3 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            เริ่มแชท
          </button>
        </div>
      </div>
    </Teleport>

    <!-- History Modal -->
    <Teleport to="body">
      <div
        v-if="showHistoryModal"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6"
        @click="showHistoryModal = false"
      >
        <div
          @click.stop
          class="bg-slate-900 rounded-card border border-slate-700 w-full max-w-md max-h-[80vh] flex flex-col"
        >
          <!-- Header -->
          <div class="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 class="text-xl font-bold">ประวัติ Shot</h2>
            <button @click="showHistoryModal = false" class="text-2xl">×</button>
          </div>

          <!-- Tabs -->
          <div class="flex border-b border-slate-700">
            <button
              @click="activeTab = 'shot'"
              :class="[
                'flex-1 py-3 font-semibold transition-colors',
                activeTab === 'shot'
                  ? 'text-neonCyan border-b-2 border-neonCyan'
                  : 'text-slate-400'
              ]"
            >
              <PhMartini :size="20" class="inline" weight="fill" /> Shot
            </button>
            <button
              @click="activeTab = 'pass'"
              :class="[
                'flex-1 py-3 font-semibold transition-colors',
                activeTab === 'pass'
                  ? 'text-neonPink border-b-2 border-neonPink'
                  : 'text-slate-400'
              ]"
            >
              <PhX :size="20" class="inline" weight="bold" /> Pass
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div v-if="loadingHistory" class="text-center py-8">
              <PhCircle :size="40" class="text-slate-400 animate-spin mx-auto mb-2" />
              <p class="text-slate-400">กำลังโหลด...</p>
            </div>

            <div v-else-if="filteredHistory.length === 0" class="text-center py-8">
              <component :is="activeTab === 'shot' ? 'PhMartini' : 'PhX'" :size="60" class="mx-auto mb-2" :class="activeTab === 'shot' ? 'text-neonCyan' : 'text-neonPink'" weight="fill" />
              <p class="text-slate-400">ยังไม่มีประวัติ</p>
            </div>

            <div
              v-else
              v-for="item in filteredHistory"
              :key="item.id"
              class="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3"
            >
              <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  v-if="item.profile.photos?.[0]"
                  :src="item.profile.photos[0]"
                  :alt="item.profile.displayName"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-white font-bold"
                >
                  {{ item.profile.displayName.charAt(0) }}
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <p class="font-semibold truncate">{{ item.profile.displayName }}</p>
                <p class="text-xs text-slate-400">{{ formatTime(item.createdAt) }}</p>
              </div>

              <span
                v-if="activeTab === 'shot'"
                :class="[
                  'text-xs px-2 py-1 rounded-full whitespace-nowrap',
                  item.matchStatus === 'matched'
                    ? 'bg-neonGreen/20 text-neonGreen'
                    : item.matchStatus === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-slate-700 text-slate-400'
                ]"
              >
                {{ 
                  item.matchStatus === 'matched' ? 'จับคู่แล้ว' :
                  item.matchStatus === 'pending' ? 'รอ match' :
                  'ไม่ match'
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Profile } from "~/types";
import ShotOrNotSwipe from "~/components/swipe/ShotOrNotSwipe.vue";

const router = useRouter();
const route = useRoute();
const { subscribeVenueProfiles, getCurrentProfile } = useProfiles();
const { handleSwipe: processSwipe, getSwipedProfileIds } =
  useSwipesAndMatches();
const { subscribeReceivedVibes } = useVibes();
const { getSwipeHistory, getTodaySwipeCount } = useSwipeHistory();

// Get zone filter from query params
const selectedZone = computed(() => route.query.zone as string || null);

const loading = ref(true);
const profiles = ref<Profile[]>([]);
const swipedIds = ref<string[]>([]);
const currentProfile = ref<Profile | null>(null);
const showMatchModal = ref(false);
const lastMatchProfile = ref<Profile | null>(null);
const receivedVibes = ref<string[]>([]);
const showHistoryModal = ref(false);
const activeTab = ref<'shot' | 'pass'>('shot');
const swipeHistory = ref<any[]>([]);
const loadingHistory = ref(false);
const todaySwipeCount = ref(0);

// Toast visibility controls
const showZoneToast = ref(false);
const showVibesAlert = ref(false);
let zoneToastTimer: NodeJS.Timeout | null = null;
let vibesAlertTimer: NodeJS.Timeout | null = null;

const availableProfiles = computed(() => {
  // Show only profiles that haven't been swiped
  let filtered = profiles.value.filter(
    (p) => !swipedIds.value.includes(p.userId)
  );
  
  // Filter by zone if selected
  if (selectedZone.value) {
    filtered = filtered.filter(p => p.zone === selectedZone.value);
  }
  
  // Prioritize profiles that sent vibes to current user
  return filtered.sort((a, b) => {
    const aHasVibe = receivedVibes.value.includes(a.userId);
    const bHasVibe = receivedVibes.value.includes(b.userId);
    if (aHasVibe && !bHasVibe) return -1;
    if (!aHasVibe && bHasVibe) return 1;
    return 0;
  });
});

const filteredHistory = computed(() => {
  return swipeHistory.value.filter(item => item.direction === (activeTab.value === 'shot' ? 'right' : 'left'))
})

const formatTime = (timestamp: any) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'เมื่อสักครู่'
  if (hours < 24) return `${hours} ชม.ที่แล้ว`
  return `${Math.floor(hours / 24)} วันที่แล้ว`
}

const loadHistory = async () => {
  if (!currentProfile.value) return
  loadingHistory.value = true
  try {
    swipeHistory.value = await getSwipeHistory(currentProfile.value.venueId)
  } catch (error) {
    console.error('Error loading history:', error)
    swipeHistory.value = []
  } finally {
    loadingHistory.value = false
  }
}

const loadTodayCount = async () => {
  if (!currentProfile.value) return
  todaySwipeCount.value = await getTodaySwipeCount(currentProfile.value.venueId)
}

watch(showHistoryModal, (show) => {
  if (show) loadHistory()
})

let unsubscribeProfiles: (() => void) | null = null
let unsubscribeVibes: (() => void) | null = null

onMounted(async () => {
  try {
    // Initialize swipedIds from localStorage
    const savedSwipedIds = JSON.parse(
      localStorage.getItem("swipedIds") || "[]"
    )
    swipedIds.value = savedSwipedIds

    currentProfile.value = await getCurrentProfile()

    if (!currentProfile.value) {
      loading.value = false
      return
    }

    const realSwipedIds = await getSwipedProfileIds(
      currentProfile.value.venueId
    )

    // Subscribe to received vibes
    unsubscribeVibes = subscribeReceivedVibes((vibes) => {
      receivedVibes.value = vibes.map((v) => v.fromUserId)
    })

    unsubscribeProfiles = subscribeVenueProfiles(currentProfile.value.venueId, (newProfiles) => {
      profiles.value = newProfiles
      loading.value = false
    })

    // Load today's swipe count
    await loadTodayCount()
  } catch (error) {
    console.error("Error in discover onMounted:", error)
    loading.value = false
  }
})

onUnmounted(() => {
  if (unsubscribeProfiles) unsubscribeProfiles()
  if (unsubscribeVibes) unsubscribeVibes()
  if (zoneToastTimer) clearTimeout(zoneToastTimer)
  if (vibesAlertTimer) clearTimeout(vibesAlertTimer)
})

const handleSwipe = async ({
  profile,
  direction,
}: {
  profile: Profile;
  direction: "left" | "right";
}) => {
  if (!profile?.userId) return
  
  try {
    // Remove from receivedVibes if this profile sent a vibe
    const vibeIndex = receivedVibes.value.indexOf(profile.userId)
    if (vibeIndex > -1) {
      receivedVibes.value.splice(vibeIndex, 1)
    }

    // Always add to swipedIds to prevent re-showing
    swipedIds.value.push(profile.userId)
    
    // Save to localStorage for persistence
    try {
      const savedSwipedIds = JSON.parse(localStorage.getItem("swipedIds") || "[]")
      savedSwipedIds.push(profile.userId)
      localStorage.setItem("swipedIds", JSON.stringify(savedSwipedIds))
    } catch (e) {
      console.warn('localStorage error:', e)
    }

    const result = await processSwipe(profile, direction)

    if (result.matched) {
      lastMatchProfile.value = profile
      showMatchModal.value = true
    }

    // Update today's count if it was a right swipe
    if (direction === 'right') {
      todaySwipeCount.value++
    }
  } catch (error) {
    console.error('Error handling swipe:', error)
  }
}

const closeMatchModal = () => {
  showMatchModal.value = false;
};

const goToChat = () => {
  showMatchModal.value = false;
  router.push("/chats");
};

const clearZoneFilter = () => {
  router.push('/discover');
};

// Toast management functions
const hideZoneToast = () => {
  showZoneToast.value = false;
  if (zoneToastTimer) clearTimeout(zoneToastTimer);
};

const hideVibesAlert = () => {
  showVibesAlert.value = false;
  if (vibesAlertTimer) clearTimeout(vibesAlertTimer);
};

// Watch for zone changes
watch(selectedZone, (newZone) => {
  if (newZone) {
    showZoneToast.value = true;
    if (zoneToastTimer) clearTimeout(zoneToastTimer);
    zoneToastTimer = setTimeout(() => {
      showZoneToast.value = false;
    }, 5000);
  } else {
    showZoneToast.value = false;
  }
}, { immediate: true });

// Watch for vibes changes
watch(receivedVibes, (newVibes) => {
  if (newVibes.length > 0) {
    showVibesAlert.value = true;
    if (vibesAlertTimer) clearTimeout(vibesAlertTimer);
    vibesAlertTimer = setTimeout(() => {
      showVibesAlert.value = false;
    }, 5000);
  } else {
    showVibesAlert.value = false;
  }
}, { immediate: true });
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
