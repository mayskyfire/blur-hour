<template>
  <div
    class="absolute inset-4 bg-slate-900/90 backdrop-blur-xl rounded-card border border-slate-700/60 shadow-card overflow-hidden"
    :style="cardStyle"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-neonCyan/10 via-transparent to-neonPink/10"
    />

    <!-- Live Badge -->
    <div v-if="profile.livePhotoUrl" class="absolute top-4 left-4 z-10">
      <div class="bg-red-500 rounded-full px-3 py-1 text-sm font-bold text-white shadow-lg flex items-center gap-1 animate-pulse">
        <span class="w-2 h-2 bg-white rounded-full"></span>
        LIVE
      </div>
    </div>

    <!-- Vibe Indicator -->
    <div v-if="hasVibeFromUser" class="absolute top-4 right-4 z-10">
      <div
        class="bg-gradient-to-r from-neonPink to-neonCyan rounded-full px-3 py-1 text-sm font-bold text-white shadow-lg animate-pulse"
      >
        💖 ส่ง Vibe ให้คุณ!
      </div>
    </div>

    <div class="relative h-full flex flex-col p-6">
      <div class="flex-1 flex flex-col justify-start">
        <div class="space-y-3">
          <!-- Profile Photo -->
          <div class="flex justify-center mb-4">
            <div
              class="w-24 h-24 rounded-full overflow-hidden border-4"
              :class="profile.livePhotoUrl ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-white/20'"
            >
              <img
                v-if="profile.livePhotoUrl"
                :src="profile.livePhotoUrl"
                :alt="profile.displayName"
                class="w-full h-full object-cover"
              />
              <img
                v-else-if="
                  profile.photos?.[0] &&
                  (profile.photos[0].startsWith('data:') ||
                    profile.photos[0].startsWith('http'))
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
          </div>
          
          <!-- Live Photo Timestamp -->
          <div v-if="profile.livePhotoUrl && profile.livePhotoCapturedAt" class="text-center -mt-2 mb-2">
            <p class="text-xs text-red-400">ถ่ายเมื่อ {{ getTimeAgo(profile.livePhotoCapturedAt) }}</p>
          </div>

          <div>
            <h2 class="text-4xl font-bold text-white mb-1">
              {{ profile.displayName }}
            </h2>
            <p class="text-xl text-slate-300">
              {{ profile.ageRange || profile.age }} •
              {{ getGenderLabel(profile.gender) }}
            </p>
          </div>

          <div class="flex items-center gap-2 text-neonCyan">
            <span class="text-2xl">{{ getMoodEmoji(profile.mood) }}</span>
            <span class="text-lg">{{ profile.mood }}</span>
          </div>

          <div class="flex items-center gap-2 text-slate-300">
            <span class="text-xl">📍</span>
            <span>{{ profile.zone }}</span>
          </div>

          <div
            class="bg-slate-800/50 rounded-xl px-4 py-2 border border-slate-700/50"
          >
            <p class="text-sm text-slate-400">สถานะ</p>
            <p class="text-white">
              {{ getActivityStatusEmoji(profile.activityStatus) }}
              {{ profile.activityStatus }}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in profile.personalityTags || profile.tags"
              :key="tag"
              class="px-3 py-1 bg-gradient-to-r from-neonCyan/20 to-neonGreen/20 rounded-full text-sm border border-neonCyan/30"
            >
              {{ getPersonalityTagEmoji(tag) }} {{ tag }}
            </span>
          </div>

          <!-- Gallery Button -->
          <button
            @click.stop="handleGalleryClick"
            class="w-full py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm hover:border-neonCyan transition-colors"
          >
            📷 ดูรูปภาพ
            {{
              profile.photos && profile.photos.length > 1
                ? `(${profile.photos.length})`
                : ""
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Gallery Modal -->
    <Teleport to="body">
      <div
        v-if="showGallery"
        @click.stop="showGallery = false"
        class="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4"
      >
        <div @click.stop class="relative w-full max-w-2xl">
          <!-- No Photos Message -->
          <div
            v-if="!profile.photos || profile.photos.length <= 1"
            class="bg-slate-900/90 rounded-xl p-8 text-center"
          >
            <div class="text-6xl mb-4">📷</div>
            <h3 class="text-xl font-bold mb-2">ยังไม่มีรูปเพิ่ม</h3>
            <p class="text-slate-400">คนนี้ยังไม่ได้อัปโหลดรูปเพิ่ม</p>
            <button
              @click="showGallery = false"
              class="mt-6 px-6 py-3 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              ปิด
            </button>
          </div>

          <template v-else>
            <!-- Close Button -->
            <button
              @click="showGallery = false"
              class="absolute -top-12 right-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              ✕
            </button>

            <!-- Image -->
            <div
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
              @mousedown="handleTouchStart"
              @mousemove="handleTouchMove"
              @mouseup="handleTouchEnd"
              class="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 cursor-grab active:cursor-grabbing"
            >
              <div
                class="w-full h-full transition-transform duration-300 ease-out"
                :style="{ transform: `translateX(${dragOffset}px)` }"
              >
                <img
                  v-if="
                    profile.photos[currentImageIndex] &&
                    (profile.photos[currentImageIndex].startsWith('data:') ||
                      profile.photos[currentImageIndex].startsWith('http'))
                  "
                  :src="profile.photos[currentImageIndex]"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-9xl"
                >
                  {{ profile.photos[currentImageIndex] }}
                </div>
              </div>

              <!-- Navigation Arrows -->
              <button
                v-if="currentImageIndex > 0"
                @click.stop="currentImageIndex--"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                ←
              </button>
              <button
                v-if="currentImageIndex < profile.photos.length - 1"
                @click.stop="currentImageIndex++"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                →
              </button>
            </div>

            <!-- Dots Indicator -->
            <div class="flex justify-center gap-2 mt-4">
              <button
                v-for="(photo, i) in profile.photos"
                :key="i"
                @click.stop="currentImageIndex = i"
                class="w-2 h-2 rounded-full transition-all"
                :class="
                  i === currentImageIndex ? 'bg-neonCyan w-6' : 'bg-white/30'
                "
              />
            </div>
          </template>
        </div>
      </div>
    </Teleport>

    <div
      v-if="swipeDirection"
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div v-if="swipeDirection === 'right'" class="text-8xl animate-pulse">
        🍸
      </div>
      <div v-else class="text-8xl opacity-50">❌</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Profile } from "~/types";

interface Props {
  profile: Profile;
  rotation?: number;
  translateX?: number;
  translateY?: number;
  swipeDirection?: "left" | "right" | null;
  hasVibeFromUser?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  rotation: 0,
  translateX: 0,
  translateY: 0,
  swipeDirection: null,
  hasVibeFromUser: false,
});

const showGallery = ref(false);
const currentImageIndex = ref(0);
const touchStartX = ref(0);
const currentX = ref(0);
const isDragging = ref(false);
const dragOffset = ref(0);

const handleGalleryClick = () => {
  showGallery.value = true;
  currentImageIndex.value = 0;
};

const handleTouchStart = (e: TouchEvent | MouseEvent) => {
  isDragging.value = true;
  touchStartX.value = "touches" in e ? e.touches[0].clientX : e.clientX;
  currentX.value = touchStartX.value;
};

const handleTouchMove = (e: TouchEvent | MouseEvent) => {
  if (!isDragging.value) return;
  e.preventDefault();

  currentX.value =
    "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
  dragOffset.value = currentX.value - touchStartX.value;
};

const handleTouchEnd = (e: TouchEvent | MouseEvent) => {
  if (!isDragging.value) return;

  const touchEndX =
    "changedTouches" in e
      ? e.changedTouches[0].clientX
      : (e as MouseEvent).clientX;
  const diff = touchStartX.value - touchEndX;

  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentImageIndex.value < props.profile.photos.length - 1) {
      currentImageIndex.value++;
    } else if (diff < 0 && currentImageIndex.value > 0) {
      currentImageIndex.value--;
    }
  }

  dragOffset.value = 0;
  isDragging.value = false;
};

watch(showGallery, (newVal) => {
  if (newVal) {
    currentImageIndex.value = 0;
  }
});

const cardStyle = computed(() => ({
  transform: `translate(${props.translateX}px, ${props.translateY}px) rotate(${props.rotation}deg)`,
  transition: props.translateX === 0 ? "transform 0.3s ease-out" : "none",
}));

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
</script>
