<template>
  <div class="h-[calc(100vh-18rem)] p-4">
    <!-- Stats Bar -->
    <div class="mb-4 p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🍸</span>
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

    <!-- Received Vibes Indicator -->
    <div
      v-if="receivedVibes.length > 0"
      class="mb-4 p-3 bg-gradient-to-r from-neonPink/20 to-neonCyan/20 rounded-xl border border-neonPink/30"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl animate-pulse">💖</span>
        <span class="text-sm font-semibold"
          >{{ receivedVibes.length }} คนส่ง vibe ให้คุณ!</span
        >
      </div>
    </div>

    <div v-if="loading" class="h-full flex items-center justify-center">
      <div class="text-center space-y-4">
        <div class="text-5xl animate-pulse">🔍</div>
        <p class="text-slate-400">กำลังหาคนโสดใกล้ๆ...</p>
      </div>
    </div>

    <div
      v-else-if="availableProfiles.length === 0"
      class="h-full flex items-center justify-center"
    >
      <div class="text-center space-y-4 max-w-sm">
        <div class="text-6xl">😴</div>
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
          <div class="text-7xl">🎉</div>
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
              🍸 Shot
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
              ❌ Pass
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div v-if="loadingHistory" class="text-center py-8">
              <div class="text-4xl animate-pulse mb-2">⏳</div>
              <p class="text-slate-400">กำลังโหลด...</p>
            </div>

            <div v-else-if="filteredHistory.length === 0" class="text-center py-8">
              <div class="text-5xl mb-2">{{ activeTab === 'shot' ? '🍸' : '❌' }}</div>
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
                  item.matchStatus === 'matched' ? '✓ จับคู่แล้ว' :
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
const { subscribeVenueProfiles, getCurrentProfile } = useProfiles();
const { handleSwipe: processSwipe, getSwipedProfileIds } =
  useSwipesAndMatches();
const { subscribeToReceivedVibes } = useVibes();
const { getSwipeHistory, getTodaySwipeCount } = useSwipeHistory();

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

const availableProfiles = computed(() => {
  // Show only profiles that haven't been swiped
  const filtered = profiles.value.filter(
    (p) => !swipedIds.value.includes(p.userId)
  );
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

onMounted(async () => {
  console.log("Discover page mounted");

  try {
    // Initialize swipedIds from localStorage
    const savedSwipedIds = JSON.parse(
      localStorage.getItem("swipedIds") || "[]"
    );
    swipedIds.value = savedSwipedIds;
    console.log("Loaded swipedIds from localStorage:", swipedIds.value);

    currentProfile.value = await getCurrentProfile();
    console.log("Current profile:", currentProfile.value);

    if (!currentProfile.value) {
      console.log("No current profile, but showing mock data anyway");
      return;
    }

    console.log("Discover - Current profile:", currentProfile.value);
    console.log("Discover - Venue ID:", currentProfile.value.venueId);

    const realSwipedIds = await getSwipedProfileIds(
      currentProfile.value.venueId
    );
    console.log("Real Swiped IDs from Firebase:", realSwipedIds);
    // Don't overwrite swipedIds to keep mock profiles visible
    // swipedIds.value = realSwipedIds

    // Subscribe to received vibes
    subscribeToReceivedVibes((vibes) => {
      receivedVibes.value = vibes.map((v) => v.fromUserId);
      console.log("Received vibes from:", receivedVibes.value);
    });

    subscribeVenueProfiles(currentProfile.value.venueId, (newProfiles) => {
      console.log(
        "Received profiles from Firebase:",
        newProfiles.length,
        newProfiles
      );
      profiles.value = newProfiles;
      loading.value = false;
      console.log(
        "Available profiles after filter:",
        availableProfiles.value.length
      );
    });

    // Load today's swipe count
    loadTodayCount()
  } catch (error) {
    console.error("Error in discover onMounted:", error);
  }
});

const handleSwipe = async ({
  profile,
  direction,
}: {
  profile: Profile;
  direction: "left" | "right";
}) => {
  // Remove from receivedVibes if this profile sent a vibe
  const vibeIndex = receivedVibes.value.indexOf(profile.userId);
  if (vibeIndex > -1) {
    receivedVibes.value.splice(vibeIndex, 1);
  }

  // Always add to swipedIds to prevent re-showing
  swipedIds.value.push(profile.userId);
  // Save to localStorage for persistence
  const savedSwipedIds = JSON.parse(localStorage.getItem("swipedIds") || "[]");
  savedSwipedIds.push(profile.userId);
  localStorage.setItem("swipedIds", JSON.stringify(savedSwipedIds));

  console.log("Swiped profile:", profile.displayName, "direction:", direction);
  console.log("Updated swipedIds:", swipedIds.value);
  console.log("Updated receivedVibes:", receivedVibes.value);

  const result = await processSwipe(profile, direction);

  if (result.matched) {
    lastMatchProfile.value = profile;
    showMatchModal.value = true;
  }

  // Update today's count if it was a right swipe
  if (direction === 'right') {
    todaySwipeCount.value++
  }
};

const closeMatchModal = () => {
  showMatchModal.value = false;
};

const goToChat = () => {
  showMatchModal.value = false;
  router.push("/chats");
};
</script>
