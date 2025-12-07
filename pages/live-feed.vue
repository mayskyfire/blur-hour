<template>
  <div class="min-h-screen p-6 pb-24">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold flex items-center gap-2">
          <PhRecordFill :size="32" class="text-red-500" weight="fill" /> Live ในร้าน
        </h1>
        <p class="text-slate-400 mt-1">คนที่กำลังอยู่ในร้านตอนนี้</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <PhSpinner :size="48" class="text-neonCyan animate-spin" weight="bold" />
        <p class="text-slate-400 mt-2">กำลังโหลด...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="livePhotos.length === 0" class="text-center py-12">
        <PhCamera :size="64" class="text-slate-600 mx-auto mb-4" weight="duotone" />
        <h3 class="text-xl font-bold mb-2">ยังไม่มีรูป Live</h3>
        <p class="text-slate-400 mb-6">เป็นคนแรกที่ถ่ายรูป Live ในร้านนี้!</p>
        <NuxtLink 
          to="/profile"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-semibold hover:shadow-xl transition-all"
        >
          <PhCamera :size="20" weight="bold" />
          ถ่ายรูป Live
        </NuxtLink>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-3 gap-3">
        <div 
          v-for="photo in livePhotos" 
          :key="photo.id"
          @click="viewPhoto(photo)"
          class="relative aspect-square rounded-xl overflow-hidden bg-slate-800 cursor-pointer group"
        >
          <!-- Photo -->
          <img 
            :src="photo.photoUrl" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="absolute bottom-2 left-2 right-2">
              <p class="text-xs text-white font-semibold truncate">{{ getUserName(photo.userId) }}</p>
              <p class="text-xs text-slate-300">{{ getTimeAgo(photo.capturedAt) }}</p>
            </div>
          </div>

          <!-- Live Badge -->
          <div class="absolute top-2 left-2 bg-red-500 rounded-full px-2 py-0.5 text-xs font-bold text-white flex items-center gap-1">
            <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            LIVE
          </div>

          <!-- Likes -->
          <div v-if="photo.likes > 0" class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white flex items-center gap-1">
            <PhHeart :size="12" weight="fill" class="text-red-400" />
            {{ photo.likes }}
          </div>
        </div>
      </div>
    </div>

    <!-- Photo Detail Modal -->
    <Teleport to="body">
      <div 
        v-if="selectedPhoto" 
        @click="selectedPhoto = null"
        class="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4"
      >
        <div @click.stop class="relative w-full max-w-md">
          <!-- Close Button -->
          <button 
            @click="selectedPhoto = null"
            class="absolute -top-12 right-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <PhX :size="24" weight="bold" class="text-white" />
          </button>

          <!-- Photo Card -->
          <div class="bg-slate-900 rounded-xl overflow-hidden">
            <!-- Image -->
            <div class="relative aspect-square">
              <img :src="selectedPhoto.photoUrl" class="w-full h-full object-cover" />
              
              <!-- Live Badge -->
              <div class="absolute top-4 left-4 bg-red-500 rounded-full px-3 py-1 text-sm font-bold text-white flex items-center gap-1">
                <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIVE
              </div>
            </div>

            <!-- Info -->
            <div class="p-4 space-y-3">
              <!-- User Info -->
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-white font-bold">
                  {{ getUserName(selectedPhoto.userId).charAt(0) }}
                </div>
                <div class="flex-1">
                  <p class="font-semibold">{{ getUserName(selectedPhoto.userId) }}</p>
                  <p class="text-sm text-slate-400">{{ getTimeAgo(selectedPhoto.capturedAt) }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button 
                  @click="likePhoto(selectedPhoto.id)"
                  :disabled="hasLiked(selectedPhoto)"
                  class="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <PhHeart :size="20" :weight="hasLiked(selectedPhoto) ? 'fill' : 'bold'" />
                  <span>{{ selectedPhoto.likes }} ถูกใจ</span>
                </button>
                <button 
                  @click="sendVibeToUser(selectedPhoto.userId)"
                  class="flex-1 py-3 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <PhChatCircle :size="20" weight="fill" />
                  ส่ง Vibe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { LivePhoto, Profile } from '~/types'

definePageMeta({
  middleware: 'auth'
})

const { subscribeLivePhotos, likeLivePhoto, viewLivePhoto } = useLivePhotos()
const { sendVibe } = useVibes()
const { currentUser } = useAuth()
const router = useRouter()

const livePhotos = ref<LivePhoto[]>([])
const selectedPhoto = ref<LivePhoto | null>(null)
const loading = ref(true)
const profiles = ref<Map<string, Profile>>(new Map())

const venueId = ref(localStorage.getItem('lastVenueId') || '')

let unsubscribe: (() => void) | null = null

onMounted(() => {
  if (!venueId.value) {
    router.push('/')
    return
  }

  unsubscribe = subscribeLivePhotos(venueId.value, async (photos) => {
    livePhotos.value = photos
    loading.value = false

    // Load profiles
    for (const photo of photos) {
      if (!profiles.value.has(photo.userId)) {
        try {
          const { doc, getDoc } = await import('firebase/firestore')
          const { db } = useFirebase()
          const profileDoc = await getDoc(doc(db, 'profiles', photo.userId))
          if (profileDoc.exists()) {
            profiles.value.set(photo.userId, { id: profileDoc.id, ...profileDoc.data() } as Profile)
          }
        } catch (error) {
          console.error('Error loading profile:', error)
        }
      }
    }
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const getUserName = (userId: string) => {
  return profiles.value.get(userId)?.displayName || 'ผู้ใช้'
}

const getTimeAgo = (timestamp: any) => {
  if (!timestamp) return ''
  const date = timestamp instanceof Date ? timestamp : (timestamp.toDate ? timestamp.toDate() : new Date(timestamp))
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)
  
  if (diff < 1) return 'เพิ่งกี้'
  if (diff < 60) return `${diff} นาทีที่แล้ว`
  const hours = Math.floor(diff / 60)
  return `${hours} ชั่วโมงที่แล้ว`
}

const viewPhoto = async (photo: LivePhoto) => {
  selectedPhoto.value = photo
  await viewLivePhoto(photo.id)
}

const hasLiked = (photo: LivePhoto) => {
  return photo.likedBy?.includes(currentUser.value?.uid || '')
}

const likePhoto = async (photoId: string) => {
  await likeLivePhoto(photoId)
}

const sendVibeToUser = async (userId: string) => {
  if (userId === currentUser.value?.uid) {
    alert('ไม่สามารถส่ง Vibe ให้ตัวเองได้')
    return
  }

  try {
    await sendVibe(userId, '🍻', 'เห็นรูป Live แล้วอยากทำความรู้จัก')
    selectedPhoto.value = null
    alert('ส่ง Vibe สำเร็จ! 💫')
  } catch (error) {
    console.error('Error sending vibe:', error)
    alert('ส่ง Vibe ไม่สำเร็จ')
  }
}
</script>
