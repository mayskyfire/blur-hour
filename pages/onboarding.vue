<template>
  <div class="min-h-screen p-6 pb-20">
    <div class="max-w-md mx-auto space-y-6">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">{{ hasExistingProfile ? 'แก้ไขโปรไฟล์' : 'สร้างโปรไฟล์' }}</h1>
        <p class="text-slate-400">{{ hasExistingProfile ? 'อัพเดทข้อมูลของคุณ' : 'เตรียมตัวสำหรับคืนนี้กันเถอะ' }}</p>
      </div>

      <form @submit.prevent="submitProfile" class="space-y-4">
        <!-- Profile Photo -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">รูปโปรไฟล์</label>
          <div class="flex justify-center">
            <div class="relative w-32 h-32">
              <button 
                v-if="form.profilePhoto"
                type="button" 
                @click="showPhotoOptions = true"
                class="w-full h-full rounded-full overflow-hidden bg-slate-800 border-4 border-neonCyan hover:border-neonPink transition-colors"
              >
                <img :src="form.profilePhoto" class="w-full h-full object-cover" />
              </button>
              <button 
                v-else
                type="button" 
                @click="profilePhotoInput?.click()" 
                class="w-full h-full rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:border-neonCyan hover:text-neonCyan transition-colors bg-slate-800"
              >
                <div class="text-center">
                  <PhCamera :size="32" class="text-slate-500 mb-1" weight="fill" />
                  <div class="text-xs">เพิ่มรูป</div>
                </div>
              </button>
            </div>
          </div>
          <input ref="profilePhotoInput" type="file" accept="image/*" @change="handleProfilePhotoUpload" class="hidden" />
        </div>

        <!-- Photo Options Modal -->
        <Teleport to="body">
          <div v-if="showPhotoOptions" @click="showPhotoOptions = false" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center z-[200] p-4">
            <div @click.stop class="bg-slate-900 rounded-t-3xl w-full max-w-md p-6 space-y-3 animate-slide-up">
              <button 
                @click="profilePhotoInput?.click(); showPhotoOptions = false"
                class="w-full py-4 bg-gradient-to-r from-neonCyan to-blue-500 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <PhPencil :size="20" weight="bold" />
                เปลี่ยนรูป
              </button>
              <button 
                @click="form.profilePhoto = ''; profilePhotoInput!.value = ''; showPhotoOptions = false"
                class="w-full py-4 bg-red-500/20 border border-red-500 rounded-xl font-semibold text-red-400 hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
              >
                <PhTrash :size="20" weight="bold" />
                ลบรูป
              </button>
              <button 
                @click="showPhotoOptions = false"
                class="w-full py-4 bg-slate-800 rounded-xl font-semibold text-slate-300 hover:bg-slate-700 transition-all"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </Teleport>

        <!-- Display Name -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">ชื่อเล่น</label>
          <input
            v-model="form.displayName"
            type="text"
            required
            placeholder="คนอื่นจะเรียกคุณว่าอะไร?"
            class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan"
          />
        </div>

        <!-- Age Range -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">ช่วงอายุ</label>
          <select
            v-model="form.ageRange"
            required
            class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan"
          >
            <option value="">เลือกช่วงอายุ</option>
            <option v-for="age in AGE_RANGES" :key="age.value" :value="age.value">
              {{ age.label }}
            </option>
          </select>
        </div>

        <!-- Gender -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">เพศ</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="g in GENDERS"
              :key="g.value"
              type="button"
              @click="form.gender = g.value"
              class="py-3 rounded-xl border transition-all"
              :class="form.gender === g.value 
                ? 'bg-neonCyan/20 border-neonCyan text-neonCyan' 
                : 'bg-slate-800/50 border-slate-700 text-slate-300'"
            >
              {{ g.label }}
            </button>
          </div>
        </div>

        <!-- Mood -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">อารมณ์ตอนนี้</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="mood in MOODS"
              :key="mood.value"
              type="button"
              @click="form.mood = mood.value"
              class="p-3 rounded-xl border transition-all text-left"
              :class="form.mood === mood.value
                ? 'bg-neonPink/20 border-neonPink text-neonPink'
                : 'bg-slate-800/50 border-slate-700 text-slate-300'"
            >
              <div class="text-lg mb-1">{{ mood.emoji }}</div>
              <div class="text-xs">{{ mood.label }}</div>
            </button>
          </div>
        </div>

        <!-- Zone -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">โซนของคุณ</label>
          <select
            v-model="form.zone"
            required
            class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan"
          >
            <option value="">เลือกโซน</option>
            <option v-for="zone in ZONES" :key="zone" :value="zone">
              {{ zone }}
            </option>
          </select>
        </div>

        <!-- Personality Tags -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">บุคลิกภาพ (เลือกได้ {{ MAX_PROFILE_TAGS }} อัน)</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="tag in PERSONALITY_TAGS"
              :key="tag.value"
              type="button"
              @click="togglePersonalityTag(tag.value)"
              class="p-3 rounded-xl border transition-all text-left"
              :class="form.personalityTags.includes(tag.value)
                ? 'bg-neonCyan/20 border-neonCyan text-neonCyan'
                : 'bg-slate-800/50 border-slate-700 text-slate-300'"
              :disabled="!form.personalityTags.includes(tag.value) && form.personalityTags.length >= MAX_PROFILE_TAGS"
            >
              <div class="text-lg mb-1">{{ tag.emoji }}</div>
              <div class="text-xs">{{ tag.value }}</div>
            </button>
          </div>
        </div>

        <!-- Activity Status -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">สถานะกิจกรรม</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="status in ACTIVITY_STATUS"
              :key="status.value"
              type="button"
              @click="form.activityStatus = status.value"
              class="p-3 rounded-xl border transition-all text-left"
              :class="form.activityStatus === status.value
                ? 'bg-neonGreen/20 border-neonGreen text-neonGreen'
                : 'bg-slate-800/50 border-slate-700 text-slate-300'"
            >
              <div class="text-lg mb-1">{{ status.emoji }}</div>
              <div class="text-xs">{{ status.label }}</div>
            </button>
          </div>
        </div>

        <!-- Photos Gallery -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">แกลเลอรี่ (อัปโหลดได้ 6 รูป)</label>
          <div class="grid grid-cols-3 gap-2">
            <div v-for="(photo, i) in form.galleryPhotos" :key="i" class="relative aspect-square rounded-xl overflow-hidden bg-slate-800">
              <img :src="photo" class="w-full h-full object-cover" />
              <button type="button" @click="removeGalleryPhoto(i)" class="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white text-sm font-bold flex items-center justify-center hover:bg-red-600 leading-none">×</button>
            </div>
            <button 
              v-if="form.galleryPhotos.length < 6" 
              type="button" 
              @click="galleryPhotoInput?.click()" 
              class="aspect-square rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:border-neonCyan hover:text-neonCyan transition-colors"
            >
              <div class="text-center">
                <PhCamera :size="24" class="text-slate-500 mb-1" weight="fill" />
                <div class="text-xs">เพิ่มรูป</div>
              </div>
            </button>
          </div>
          <input ref="galleryPhotoInput" type="file" accept="image/*" multiple @change="handleGalleryPhotoUpload" class="hidden" />
        </div>

        <!-- Social Media -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">โซเชียลมีเดีย (เลือกได้)</label>
          <div class="space-y-3">
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2"><img src="/images/line-icon.png" class="w-5 h-5" /></div>
              <input 
                v-model="form.lineId" 
                type="text" 
                placeholder="Line ID" 
                class="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-neonCyan" 
              />
            </div>
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400"><PhInstagramLogo :size="20" weight="fill" /></div>
              <input 
                v-model="form.instagram" 
                type="text" 
                placeholder="Instagram @username" 
                class="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-neonCyan" 
              />
            </div>
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400"><PhTiktokLogo :size="20" weight="fill" /></div>
              <input 
                v-model="form.tiktok" 
                type="text" 
                placeholder="TikTok @username" 
                class="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-neonCyan" 
              />
            </div>
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300"><PhTwitterLogo :size="20" weight="fill" /></div>
              <input 
                v-model="form.x" 
                type="text" 
                placeholder="X (Twitter) @username" 
                class="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-neonCyan" 
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          <span v-if="loading">กำลังสร้าง...</span>
          <span v-else class="flex items-center justify-center gap-2">เริ่มใช้งาน <PhCaretRight :size="20" weight="bold" /></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { createOrUpdateProfile } = useProfiles()
const { detectZoneFromUrl } = useZones()

const loading = ref(false)
const hasExistingProfile = ref(false)
const showPhotoOptions = ref(false)

const form = reactive({
  displayName: '',
  ageRange: '' as any,
  gender: '' as any,
  zone: '',
  mood: '' as any,
  personalityTags: [] as string[],
  activityStatus: 'พร้อมคุยเลย' as any,
  status: 'single' as const,
  profilePhoto: '' as string,
  galleryPhotos: [] as string[],
  lineId: '',
  instagram: '',
  tiktok: '',
  x: ''
})

const profilePhotoInput = ref<HTMLInputElement>()
const galleryPhotoInput = ref<HTMLInputElement>()
const uploadingPhotos = ref(false)

const togglePersonalityTag = (tag: string) => {
  const index = form.personalityTags.indexOf(tag)
  if (index > -1) {
    form.personalityTags.splice(index, 1)
  } else if (form.personalityTags.length < MAX_PROFILE_TAGS) {
    form.personalityTags.push(tag)
  }
}

const handleProfilePhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    form.profilePhoto = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleGalleryPhotoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return

  uploadingPhotos.value = true
  Array.from(files).forEach(file => {
    if (form.galleryPhotos.length >= 6) return
    const reader = new FileReader()
    reader.onload = (e) => {
      form.galleryPhotos.push(e.target?.result as string)
      uploadingPhotos.value = false
    }
    reader.readAsDataURL(file)
  })
}

const removeGalleryPhoto = (index: number) => {
  form.galleryPhotos.splice(index, 1)
}

const submitProfile = async () => {
  loading.value = true
  try {
    const venueId = route.query.venue as string || 'NEON123'
    const detectedZone = detectZoneFromUrl()
    
    const profileData: any = {
      venueId,
      displayName: form.displayName,
      ageRange: form.ageRange,
      gender: form.gender,
      zone: detectedZone || form.zone,
      mood: form.mood,
      personalityTags: form.personalityTags,
      activityStatus: form.activityStatus,
      status: form.status,
      photos: form.profilePhoto ? [form.profilePhoto, ...form.galleryPhotos] : form.galleryPhotos
    }

    // Add social media if provided
    if (form.lineId) profileData.lineId = form.lineId
    if (form.instagram) profileData.instagram = form.instagram
    if (form.tiktok) profileData.tiktok = form.tiktok
    if (form.x) profileData.x = form.x

    await createOrUpdateProfile(profileData)
    
    router.push(`/venue/${venueId}/live`)
  } catch (error) {
    console.error('Profile creation error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Auto-detect zone from QR code URL
  const detectedZone = detectZoneFromUrl()
  if (detectedZone) {
    form.zone = detectedZone
  }

  // Load existing profile if available
  const { getCurrentProfile } = useProfiles()
  const existingProfile = await getCurrentProfile()
  if (existingProfile) {
    hasExistingProfile.value = true
    form.displayName = existingProfile.displayName
    form.ageRange = existingProfile.ageRange
    form.gender = existingProfile.gender
    form.zone = existingProfile.zone
    form.mood = existingProfile.mood
    form.personalityTags = existingProfile.personalityTags || []
    form.activityStatus = existingProfile.activityStatus
    const photos = existingProfile.photos || []
    form.profilePhoto = photos[0] || ''
    form.galleryPhotos = photos.slice(1)
    form.lineId = existingProfile.lineId || ''
    form.instagram = existingProfile.instagram || ''
    form.tiktok = existingProfile.tiktok || ''
    form.x = existingProfile.x || ''
  }
})
</script>
