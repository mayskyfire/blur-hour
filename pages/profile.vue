<template>
  <div class="min-h-screen p-6">
    <div class="max-w-md mx-auto space-y-6">
      <h1 class="text-3xl font-bold mb-6">โปรไฟล์ของคุณ</h1>

      <div v-if="loading" class="text-center py-12">
        <PhSpinner :size="48" class="text-neonCyan animate-spin" weight="bold" />
      </div>

      <div v-else-if="profile" class="space-y-4">
        <!-- Profile Card -->
        <div
          class="bg-slate-900/80 backdrop-blur-xl rounded-card border border-slate-700/60 p-6 space-y-4"
        >
          <div class="text-center">
            <div class="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
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
            <h2 class="text-2xl font-bold">{{ profile.displayName }}</h2>
            <p class="text-slate-400">
              {{ profile.ageRange }} • {{ getGenderLabel(profile.gender) }}
            </p>
          </div>

          <!-- Photos Gallery -->
          <div
            v-if="profile.photos && profile.photos.length > 1"
            class="grid grid-cols-3 gap-2"
          >
            <div
              v-for="(photo, i) in profile.photos.slice(1, 7)"
              :key="i"
              class="aspect-square rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center"
            >
              <img
                v-if="photo.startsWith('data:') || photo.startsWith('http')"
                :src="photo"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-2xl"
              >
                {{ photo }}
              </div>
            </div>
          </div>

          <div class="space-y-3 pt-4 border-t border-slate-700/50">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ getMoodEmoji(profile.mood) }}</span>
              <div>
                <p class="text-xs text-slate-400">อารมณ์</p>
                <p>{{ profile.mood }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <PhMapPin :size="24" class="text-neonCyan" weight="fill" />
              <div>
                <p class="text-xs text-slate-400">โซน</p>
                <p>{{ profile.zone }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="text-2xl">{{
                getActivityStatusEmoji(profile.activityStatus)
              }}</span>
              <div>
                <p class="text-xs text-slate-400">สถานะ</p>
                <p>{{ profile.activityStatus }}</p>
              </div>
            </div>

            <div>
              <p class="text-xs text-slate-400 mb-2">บุคลิกภาพ</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in profile.personalityTags"
                  :key="tag"
                  class="px-3 py-1 bg-neonCyan/20 border border-neonCyan/30 rounded-full text-sm"
                >
                  {{ getPersonalityTagEmoji(tag) }} {{ tag }}
                </span>
              </div>
            </div>

            <!-- Social Media -->
            <div v-if="profile.lineId || profile.instagram || profile.tiktok">
              <p class="text-xs text-slate-400 mb-2">โซเชียลมีเดีย</p>
              <div class="flex gap-3">
                <a
                  v-if="profile.lineId"
                  :href="`https://line.me/ti/p/~${profile.lineId}`"
                  target="_blank"
                  class="flex items-center gap-2 text-green-400 hover:text-green-300"
                >
                  <PhChatCircle :size="20" weight="fill" />
                  <span class="text-sm">{{ profile.lineId }}</span>
                </a>
                <a
                  v-if="profile.instagram"
                  :href="`https://instagram.com/${profile.instagram.replace(
                    '@',
                    ''
                  )}`"
                  target="_blank"
                  class="flex items-center gap-2 text-pink-400 hover:text-pink-300"
                >
                  <PhInstagramLogo :size="20" weight="fill" />
                  <span class="text-sm">{{ profile.instagram }}</span>
                </a>
                <a
                  v-if="profile.tiktok"
                  :href="`https://tiktok.com/@${profile.tiktok.replace(
                    '@',
                    ''
                  )}`"
                  target="_blank"
                  class="flex items-center gap-2 text-red-400 hover:text-red-300"
                >
                  <PhTiktokLogo :size="20" weight="fill" />
                  <span class="text-sm">{{ profile.tiktok }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Toggle -->
        <div
          class="bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/60 p-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">สถานะ</p>
              <p class="text-sm text-slate-400">
                {{ profile.status === "single" ? "พร้อมคุย" : "ไม่ว่าง" }}
              </p>
            </div>
            <button
              @click="toggleStatus"
              class="px-4 py-2 rounded-lg transition-colors"
              :class="
                profile.status === 'single'
                  ? 'bg-neonGreen/20 text-neonGreen border border-neonGreen'
                  : 'bg-slate-700 text-slate-300 border border-slate-600'
              "
            >
              <PhCheck v-if="profile.status === 'single'" :size="16" weight="bold" />
              <PhX v-else :size="16" weight="bold" />
              {{ profile.status === "single" ? "พร้อมคุย" : "ไม่ว่าง" }}
            </button>
          </div>
        </div>

        <!-- Live Photo -->
        <div v-if="profile.livePhotoUrl" class="bg-slate-900/80 backdrop-blur-xl rounded-xl border border-red-500/50 p-4">
          <div class="flex items-center gap-3">
            <div class="relative w-16 h-16 rounded-full overflow-hidden">
              <img :src="profile.livePhotoUrl" class="w-full h-full object-cover" />
              <div class="absolute inset-0 border-2 border-red-500 rounded-full animate-pulse"></div>
            </div>
            <div class="flex-1">
              <p class="font-semibold flex items-center gap-2">
                <PhRecordFill :size="16" class="text-red-500" weight="fill" /> LIVE
              </p>
              <p class="text-xs text-slate-400">ถ่ายเมื่อ {{ getTimeAgo(profile.livePhotoCapturedAt) }}</p>
            </div>
            <button @click="deleteLive" class="p-2 text-red-400 hover:text-red-300">
              <PhTrash :size="20" weight="bold" />
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <!-- Live Photo Button -->
          <button
            @click="showCamera = true"
            class="w-full py-3.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2 text-white"
          >
            <PhCamera :size="22" weight="bold" />
            <span>{{ profile.livePhotoUrl ? 'ถ่ายรูป Live ใหม่' : 'ถ่ายรูบ Live' }}</span>
          </button>

          <!-- Song Request Button -->
          <NuxtLink
            to="/song-request"
            class="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all text-white"
          >
            <PhMusicNote :size="22" weight="fill" />
            ขอเพลง
          </NuxtLink>

          <!-- Edit Profile Button -->
          <button
            @click="editProfile"
            class="w-full py-3.5 bg-gradient-to-r from-neonCyan to-blue-500 rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center gap-2 text-white"
          >
            <PhPencil :size="20" weight="bold" />
            แก้ไขโปรไฟล์
          </button>

          <!-- Leave Session Button -->
          <button
            @click="leaveSession"
            class="w-full py-3.5 bg-slate-800/80 border border-slate-600 rounded-xl font-semibold text-slate-300 hover:bg-slate-700 hover:border-slate-500 transition-all flex items-center justify-center gap-2"
          >
            <PhSignOut :size="20" weight="bold" />
            ออกจากร้าน
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Camera Modal -->
  <LivePhotoCamera 
    :show="showCamera" 
    :venue-id="profile?.venueId || ''"
    @close="showCamera = false"
    @captured="onPhotoCaptured"
  />
</template>

<script setup lang="ts">
import type { Profile } from "~/types";

const router = useRouter();
const { getCurrentProfile, createOrUpdateProfile } = useProfiles();
const { deleteLivePhoto } = useLivePhotos();

const loading = ref(true);
const profile = ref<Profile | null>(null);
const showCamera = ref(false);

onMounted(async () => {
  profile.value = await getCurrentProfile();
  loading.value = false;
});

const editProfile = () => {
  router.push("/onboarding");
};

const getMoodEmoji = (mood: string): string => {
  const moodObj = MOODS.find((m) => m.value === mood);
  return moodObj?.emoji || "✨";
};

const getGenderLabel = (gender: string): string => {
  const genderObj = GENDERS.find((g) => g.value === gender);
  return genderObj?.label || gender;
};

const getActivityStatusEmoji = (status: string): string => {
  const statusObj = ACTIVITY_STATUS.find((s) => s.value === status);
  return statusObj?.emoji || "✨";
};

const getPersonalityTagEmoji = (tag: string): string => {
  const tagObj = PERSONALITY_TAGS.find((t) => t.value === tag);
  return tagObj?.emoji || "✨";
};

const toggleStatus = async () => {
  if (!profile.value) return;

  const newStatus = profile.value.status === "single" ? "busy" : "single";

  await createOrUpdateProfile({
    ...profile.value,
    status: newStatus,
  });

  profile.value.status = newStatus;
};

const leaveSession = async () => {
  if (!profile.value) return;

  await createOrUpdateProfile({
    ...profile.value,
    status: "hidden",
  });

  // Clear localStorage
  localStorage.removeItem('lastVenueId');
  localStorage.removeItem('swipedIds');

  router.push("/");
};

const getTimeAgo = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp instanceof Date ? timestamp : (timestamp.toDate ? timestamp.toDate() : new Date(timestamp));
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
  
  if (diff < 1) return 'เพิ่งกี้';
  if (diff < 60) return `${diff} นาทีที่แล้ว`;
  const hours = Math.floor(diff / 60);
  return `${hours} ชั่วโมงที่แล้ว`;
};

const onPhotoCaptured = async () => {
  profile.value = await getCurrentProfile();
  showCamera.value = false;
};

const deleteLive = async () => {
  if (!profile.value?.livePhotoId) return;
  if (!confirm('ต้องการลบรูป Live หรือไม่?')) return;
  
  await deleteLivePhoto(profile.value.livePhotoId);
  profile.value = await getCurrentProfile();
};
</script>
