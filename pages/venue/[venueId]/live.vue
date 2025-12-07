<template>
  <div class="min-h-screen p-4">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-2">คนโสดในบาร์ตอนนี้</h1>
      <p class="text-slate-400">{{ profileCount }} คน</p>
    </div>

    <!-- Filters -->
    <div class="mb-6 space-y-4">
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="gender in GENDERS"
          :key="gender.value"
          @click="toggleFilter('gender', gender.value)"
          :class="[
            'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors',
            filters.gender.includes(gender.value)
              ? 'bg-neonCyan text-black'
              : 'bg-slate-800 text-slate-300',
          ]"
        >
          {{ gender.label }}
        </button>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="mood in MOODS"
          :key="mood.value"
          @click="toggleFilter('mood', mood.value)"
          :class="[
            'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors',
            filters.mood.includes(mood.value)
              ? 'bg-neonPink text-black'
              : 'bg-slate-800 text-slate-300',
          ]"
        >
          {{ mood.emoji }} {{ mood.label }}
        </button>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="zone in ZONES"
          :key="zone"
          @click="toggleFilter('zone', zone)"
          :class="[
            'px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors',
            filters.zone.includes(zone)
              ? 'bg-lime-400 text-black font-semibold'
              : 'bg-slate-800 text-slate-300',
          ]"
        >
          <PhMapPin :size="16" class="inline" weight="fill" /> {{ zone }}
        </button>
      </div>
    </div>

    <!-- Profiles Grid -->
    <div>
      <div v-if="loading" class="text-center py-8">
        <PhUsers :size="60" class="text-neonCyan animate-pulse mx-auto mb-4" weight="fill" />
        <p class="text-slate-400">กำลังหาคนโสด...</p>
      </div>

      <div v-else-if="filteredProfiles.length === 0" class="text-center py-8">
        <PhSmiley :size="80" class="text-slate-500 mx-auto mb-4" weight="fill" />
        <h2 class="text-xl font-bold mb-2">ไม่มีใครตรงเงื่อนไข</h2>
        <p class="text-slate-400">ลองเปลี่ยน filter ดูนะ</p>
      </div>

      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="profile in filteredProfiles"
          :key="profile.id"
          class="bg-slate-900/80 rounded-xl border border-slate-700/60 p-4 space-y-3"
        >
          <!-- Profile Info -->
          <div class="text-center">
            <div
              class="w-16 h-16 rounded-full mx-auto mb-2 bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center shadow-neon-cyan overflow-hidden"
            >
              <img
                v-if="
                  profile.photos?.[0] && (profile.photos[0].startsWith('data:') || profile.photos[0].startsWith('http'))
                "
                :src="profile.photos[0]"
                :alt="profile.displayName"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-white font-bold text-2xl"
              >
                {{ profile.displayName.charAt(0) }}
              </div>
            </div>
            <h3 class="font-semibold">{{ profile.displayName }}</h3>
            <p class="text-sm text-slate-400">{{ profile.ageRange }}</p>
          </div>

          <!-- Activity Status -->
          <div class="flex justify-center">
            <span
              :class="getActivityStatusColor(profile.activityStatus)"
              class="text-xs px-2 py-1 rounded-full bg-slate-800"
            >
              {{ getActivityStatusEmoji(profile.activityStatus) }}
              {{ profile.activityStatus }}
            </span>
          </div>

          <!-- Mood & Zone -->
          <div class="text-center space-y-1">
            <p class="text-sm">
              {{ getMoodEmoji(profile.mood) }} {{ profile.mood }}
            </p>
            <p class="text-xs text-slate-400 flex items-center justify-center gap-1"><PhMapPin :size="12" weight="fill" /> {{ profile.zone }}</p>
          </div>

          <!-- Personality Tags -->
          <div class="flex flex-wrap gap-1 justify-center">
            <span
              v-for="tag in profile.personalityTags"
              :key="tag"
              class="text-xs px-2 py-1 bg-slate-800 rounded-full"
            >
              {{ getPersonalityTagEmoji(tag) }}
            </span>
          </div>

          <!-- Social Media -->
          <div
            v-if="profile.lineId || profile.instagram || profile.tiktok"
            class="flex gap-2 justify-center"
          >
            <a
              v-if="profile.lineId"
              :href="`https://line.me/ti/p/~${profile.lineId}`"
              target="_blank"
              class="hover:scale-110 transition-transform"
              ><img src="/images/line-icon.png" class="w-5 h-5" /></a
            >
            <a
              v-if="profile.instagram"
              :href="`https://instagram.com/${profile.instagram.replace(
                '@',
                ''
              )}`"
              target="_blank"
              class="text-pink-400 text-lg hover:scale-110 transition-transform"
              ><PhInstagramLogo :size="20" weight="fill" /></a
            >
            <a
              v-if="profile.tiktok"
              :href="`https://tiktok.com/@${profile.tiktok.replace('@', '')}`"
              target="_blank"
              class="text-red-400 text-lg hover:scale-110 transition-transform"
              ><PhTiktokLogo :size="20" weight="fill" /></a
            >
          </div>

          <!-- Vibe Buttons -->
          <div class="flex flex-wrap gap-1 justify-center">
            <button
              v-for="vibe in VIBE_TYPES"
              :key="vibe.value"
              @click="handleSendVibe(profile.userId, vibe.value)"
              :disabled="sendingVibe"
              class="p-1.5 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg hover:from-neonCyan/20 hover:to-neonPink/20 transition-all disabled:opacity-50 flex-shrink-0"
            >
              <span class="text-sm">{{ vibe.emoji }}</span>
            </button>

            <!-- Report Button -->
            <button
              @click="openSafetyModal(profile.userId)"
              class="p-1.5 bg-slate-700 rounded-lg hover:bg-red-600/20 transition-all text-slate-400 hover:text-red-400 flex-shrink-0"
            >
              <PhWarning :size="16" weight="fill" />
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Vibe Success Modal -->
    <Teleport to="body">
      <div
        v-if="showVibeModal"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6"
        @click="closeVibeModal"
      >
        <div
          class="bg-gradient-to-br from-neonCyan/20 to-neonPink/20 rounded-card border border-neonCyan p-6 text-center space-y-4 max-w-sm"
        >
          <PhHeart :size="60" :class="vibeResult.matched ? 'text-neonPink' : 'text-neonCyan'" class="mx-auto" weight="fill" />
          <h2 class="text-xl font-bold">
            {{ vibeResult.matched ? "Match แล้ว!" : "ส่ง Vibe แล้ว!" }}
          </h2>
          <p class="text-slate-300">
            {{
              vibeResult.matched
                ? "คุณสองคนส่ง vibe ให้กัน"
                : "รอดูว่าเขาจะตอบกลับไหม"
            }}
          </p>
          <button
            v-if="vibeResult.matched"
            @click="goToChats"
            class="w-full py-2 bg-gradient-to-r from-neonCyan to-neonGreen rounded-xl font-semibold"
          >
            ไปแชท
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Safety Modal -->
    <SafetyModal
      :show="showSafetyModal"
      :user-id="selectedUserId"
      :venue-id="venueId"
      @close="showSafetyModal = false"
      @reported="handleUserReported"
      @blocked="handleUserReported"
    />
  </div>
</template>

<script setup lang="ts">
import type { Profile } from "~/types";
import {
  GENDERS,
  MOODS,
  ZONES,
  ACTIVITY_STATUS,
  PERSONALITY_TAGS,
  VIBE_TYPES,
} from "~/utils/constants";

const route = useRoute();
const router = useRouter();
const venueId = route.params.venueId as string;

const { subscribeVenueProfiles, getCurrentProfile } = useProfiles();
const { sendVibe } = useVibes();
const { getUserChats } = useChats();

const loading = ref(true);
const profiles = ref<Profile[]>([]);
const matchedUserIds = ref<string[]>([]);
const sendingVibe = ref(false);
const showVibeModal = ref(false);
const vibeResult = ref({ matched: false });
const showSafetyModal = ref(false);
const selectedUserId = ref("");

const filters = reactive({
  gender: [] as string[],
  mood: [] as string[],
  zone: [] as string[],
});

const filteredProfiles = computed(() => {
  return profiles.value.filter((profile) => {
    // Hide matched users
    if (matchedUserIds.value.includes(profile.userId)) return false;
    if (filters.gender.length && !filters.gender.includes(profile.gender))
      return false;
    if (filters.mood.length && !filters.mood.includes(profile.mood))
      return false;
    if (filters.zone.length && !filters.zone.includes(profile.zone))
      return false;
    return true;
  });
});

const profileCount = computed(() => {
  return process.client ? filteredProfiles.value.length : 0;
});

const toggleFilter = (type: keyof typeof filters, value: string) => {
  const filterArray = filters[type] as string[];
  const index = filterArray.indexOf(value);
  if (index > -1) {
    filterArray.splice(index, 1);
  } else {
    filterArray.push(value);
  }
};

const getActivityStatusColor = (status: string) => {
  const statusObj = ACTIVITY_STATUS.find((s) => s.value === status);
  return statusObj?.color || "text-gray-400";
};

const getActivityStatusEmoji = (status: string) => {
  const statusObj = ACTIVITY_STATUS.find((s) => s.value === status);
  return statusObj?.emoji || "⚫";
};

const getMoodEmoji = (mood: string) => {
  const moodObj = MOODS.find((m) => m.value === mood);
  return moodObj?.emoji || "😊";
};

const getPersonalityTagEmoji = (tag: string) => {
  const tagObj = PERSONALITY_TAGS.find((t) => t.value === tag);
  return tagObj?.emoji || "✨";
};

const handleSendVibe = async (
  toUserId: string,
  vibeType: "cheers" | "music" | "chat"
) => {
  sendingVibe.value = true;
  try {
    const result = await sendVibe(toUserId, vibeType, venueId);
    vibeResult.value = { matched: result.matched };
    showVibeModal.value = true;
  } catch (error) {
    console.error("Error sending vibe:", error);
    vibeResult.value = { matched: false };
    showVibeModal.value = true;
  } finally {
    sendingVibe.value = false;
  }
};

const closeVibeModal = () => {
  showVibeModal.value = false;
};

const goToChats = () => {
  showVibeModal.value = false;
  router.push("/chats");
};

const openSafetyModal = (userId: string) => {
  selectedUserId.value = userId;
  showSafetyModal.value = true;
};

const handleUserReported = () => {
  profiles.value = profiles.value.filter(
    (p) => p.userId !== selectedUserId.value
  );
};

onMounted(async () => {
  try {
    const currentProfile = await getCurrentProfile();
    
    if (!currentProfile) {
      matchedUserIds.value = [];
    } else {
      // Get matched users
      const chats = await getUserChats();
      matchedUserIds.value = chats.flatMap(chat => 
        chat.userIds.filter(id => id !== currentProfile.userId)
      );
    }
    
    subscribeVenueProfiles(venueId, (newProfiles) => {
      profiles.value = newProfiles;
      loading.value = false;
    });
  } catch (error) {
    console.error("Error loading profiles:", error);
    loading.value = false;
  }
});
</script>
