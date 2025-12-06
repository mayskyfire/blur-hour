<template>
  <div class="min-h-screen p-6">
    <div class="max-w-md mx-auto space-y-6">
      <h1 class="text-3xl font-bold mb-6">โปรไฟล์ของคุณ</h1>

      <div v-if="loading" class="text-center py-12">
        <div class="text-4xl animate-pulse">⚙️</div>
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
              v-for="(photo, i) in profile.photos.slice(1)"
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
              <span class="text-2xl">📍</span>
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
                  <span>📱</span>
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
                  <span>📸</span>
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
                  <span>🎵</span>
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
              {{ profile.status === "single" ? "✓ พร้อมคุย" : "✗ ไม่ว่าง" }}
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <NuxtLink
            to="/song-request"
            class="block w-full py-3 bg-gradient-to-r from-neonPink/20 to-neonCyan/20 border border-neonCyan rounded-xl font-semibold text-center hover:from-neonPink/30 hover:to-neonCyan/30 transition-all"
          >
            🎵 ขอเพลง
          </NuxtLink>
          <button
            @click="editProfile"
            class="w-full py-3 bg-slate-800 border border-slate-700 rounded-xl font-semibold hover:border-neonCyan transition-colors"
          >
            แก้ไขโปรไฟล์
          </button>

          <button
            @click="leaveSession"
            class="w-full py-3 bg-neonPink/20 border border-neonPink rounded-xl font-semibold text-neonPink hover:bg-neonPink/30 transition-colors"
          >
            ออกจากร้าน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Profile } from "~/types";

const router = useRouter();
const { getCurrentProfile, createOrUpdateProfile } = useProfiles();

const loading = ref(true);
const profile = ref<Profile | null>(null);

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

  router.push("/");
};
</script>
