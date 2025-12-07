<template>
  <div class="min-h-screen p-6 pb-20">
    <div class="max-w-md mx-auto space-y-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold mb-2">สร้างโปรไฟล์ 30 วินาที</h1>
        <p class="text-slate-400">เลือกแบบง่าย ๆ ได้เลย</p>
        <p v-if="hasExistingProfile" class="text-xs text-neonCyan mt-2">พบข้อมูลเดิมของคุณ</p>
      </div>

      <form @submit.prevent="submitProfile" class="space-y-5">
        <!-- Profile Photo -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">รูปโปรไฟล์</label>
          <div class="flex items-center gap-4">
            <div class="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-800">
              <img v-if="form.profilePhoto" :src="form.profilePhoto" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-500 text-3xl">+</div>
            </div>
            <div class="flex-1">
              <button type="button" @click="profilePhotoInput?.click()" class="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm hover:border-neonCyan transition-colors">
                อัพโหลดรูป
              </button>
              <input ref="profilePhotoInput" type="file" accept="image/*" @change="handleProfilePhotoUpload" class="hidden" />
            </div>
          </div>
        </div>

        <!-- Gallery Photos -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">รูป Gallery (สูงสุด 6 รูป)</label>
          <div class="grid grid-cols-3 gap-2">
            <div v-for="(photo, i) in form.galleryPhotos" :key="i" class="relative aspect-square rounded-xl overflow-hidden bg-slate-800">
              <img :src="photo" class="w-full h-full object-cover" />
              <button type="button" @click="removeGalleryPhoto(i)" class="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white text-sm font-bold flex items-center justify-center hover:bg-red-600 leading-none">×</button>
            </div>
            <button v-if="form.galleryPhotos && form.galleryPhotos.length < 6" type="button" @click="galleryPhotoInput?.click()" class="aspect-square rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:border-neonCyan hover:text-neonCyan transition-colors">
              <span class="text-3xl">+</span>
            </button>
          </div>
          <input ref="galleryPhotoInput" type="file" accept="image/*" multiple @change="handleGalleryPhotoUpload" class="hidden" />
        </div>

        <!-- Nickname -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">ชื่อเล่น</label>
          <input
            v-model="form.displayName"
            type="text"
            required
            placeholder="ใส่ชื่อเล่น"
            class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan"
          />
        </div>

        <!-- Age & Gender -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm text-slate-400 mb-2">อายุ</label>
            <input
              v-model.number="form.age"
              type="number"
              required
              min="18"
              max="99"
              class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan"
            />
          </div>
          <div>
            <label class="block text-sm text-slate-400 mb-2">เพศ</label>
            <select
              v-model="form.gender"
              class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan"
            >
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่น ๆ</option>
            </select>
          </div>
        </div>

        <!-- Tags (Quick Select) -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">สไตล์ของคุณ (เลือก 1-3)</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in quickTags"
              :key="tag.value"
              type="button"
              @click="toggleTag(tag.value)"
              class="px-4 py-2 rounded-full text-sm border transition-all"
              :class="form.tags.includes(tag.value)
                ? 'bg-neonPink/20 border-neonPink text-neonPink'
                : 'bg-slate-800/50 border-slate-700 text-slate-300'"
            >
              {{ tag.emoji }} {{ tag.label }}
            </button>
          </div>
        </div>

        <!-- Personality Tags -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">บุคลิกภาพ (เลือก 1-3)</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in personalityTags"
              :key="tag.value"
              type="button"
              @click="togglePersonalityTag(tag.value)"
              class="px-3 py-2 rounded-full text-sm border transition-all"
              :class="form.personalityTags.includes(tag.value)
                ? 'bg-neonCyan/20 border-neonCyan text-neonCyan'
                : 'bg-slate-800/50 border-slate-700 text-slate-300'"
            >
              {{ tag.emoji }} {{ tag.label }}
            </button>
          </div>
        </div>

        <!-- Looking For -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">มองหาอะไร</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="lf in lookingForOptions"
              :key="lf"
              type="button"
              @click="form.lookingFor = lf"
              class="py-3 rounded-xl border text-sm transition-all"
              :class="form.lookingFor === lf
                ? 'bg-neonCyan/20 border-neonCyan text-neonCyan'
                : 'bg-slate-800/50 border-slate-700 text-slate-300'"
            >
              {{ lf }}
            </button>
          </div>
        </div>

        <!-- Social Accounts -->
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
          :disabled="loading || !isValid"
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

const loading = ref(false)

const form = reactive({
  displayName: '',
  age: 25,
  gender: 'male' as 'male' | 'female' | 'other',
  tags: [] as string[],
  personalityTags: [] as string[],
  lookingFor: 'เพื่อนกินดื่ม',
  profilePhoto: '',
  galleryPhotos: [] as string[],
  lineId: '',
  instagram: '',
  tiktok: '',
  x: ''
})

const profilePhotoInput = ref<HTMLInputElement>()
const galleryPhotoInput = ref<HTMLInputElement>()

const avatars = ['😎', '🤩', '😊', '🥳', '😏', '🤗', '😇', '🥰', '😜', '🤪', '🔥', '✨', '💫', '⭐', '🌟']

const quickTags = [
  { value: 'สายชิล', emoji: '🎵', label: 'สายชิล' },
  { value: 'สายแดนซ์', emoji: '💃', label: 'สายแดนซ์' },
  { value: 'สายเนิร์ด', emoji: '🤓', label: 'สายเนิร์ด' },
  { value: 'สายฮา', emoji: '😂', label: 'สายฮา' },
  { value: 'สายดื่ม', emoji: '🍺', label: 'สายดื่ม' },
  { value: 'สายเกม', emoji: '🎮', label: 'สายเกม' }
]

const personalityTags = [
  { value: 'สายฮา', emoji: '😆', label: 'สายฮา' },
  { value: 'สายคุยลึก', emoji: '🧠', label: 'สายคุยลึก' },
  { value: 'สายแดนซ์', emoji: '🕺', label: 'สายแดนซ์' },
  { value: 'สายเกม', emoji: '🎮', label: 'สายเกม' },
  { value: 'สายร้องเพลง', emoji: '🎤', label: 'สายร้องเพลง' }
]

const lookingForOptions = ['เพื่อนกินดื่ม', 'คนคุย', 'สายเต้น', 'สายเล่นเกม']

const isValid = computed(() => {
  return form.displayName && form.age >= 18 && form.profilePhoto && (form.tags.length > 0 || form.personalityTags.length > 0)
})

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

  Array.from(files).forEach(file => {
    if (form.galleryPhotos.length >= 6) return
    const reader = new FileReader()
    reader.onload = (e) => {
      form.galleryPhotos.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

const removeGalleryPhoto = (index: number) => {
  form.galleryPhotos.splice(index, 1)
}

const toggleTag = (tag: string) => {
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  } else if (form.tags.length < 3) {
    form.tags.push(tag)
  }
}

const togglePersonalityTag = (tag: string) => {
  const index = form.personalityTags.indexOf(tag)
  if (index > -1) {
    form.personalityTags.splice(index, 1)
  } else if (form.personalityTags.length < 3) {
    form.personalityTags.push(tag)
  }
}

const submitProfile = async () => {
  loading.value = true
  try {
    const mode = route.query.mode as string || 'single'
    const status = mode === 'busy' ? 'hidden' : mode === 'maybe' ? 'busy' : 'single'
    const venueId = route.query.venueId as string || 'NEON123'
    
    console.log('Submit profile - venueId:', venueId)
    console.log('Route query:', route.query)

    // Convert age to age range
    const ageRange = form.age < 23 ? '18-22' : 
                    form.age < 28 ? '23-27' : 
                    form.age < 33 ? '28-32' : 
                    form.age < 38 ? '33-37' : 
                    form.age < 43 ? '38-42' : '43+'

    const photos = [form.profilePhoto, ...form.galleryPhotos]

    const profileData: any = {
      venueId,
      displayName: form.displayName,
      ageRange,
      gender: form.gender,
      zone: 'Zone A',
      mood: 'อยากคุย',
      personalityTags: form.personalityTags.length > 0 ? form.personalityTags : form.tags,
      activityStatus: 'พร้อมคุยเลย',
      status,
      photos
    }

    if (form.lineId) profileData.lineId = form.lineId
    if (form.instagram) profileData.instagram = form.instagram
    if (form.tiktok) profileData.tiktok = form.tiktok
    if (form.x) profileData.x = form.x

    await createOrUpdateProfile(profileData)

    if (status === 'hidden') {
      router.push('/profile')
    } else {
      const targetPath = `/venue/${venueId}`
      console.log('Navigating to:', targetPath)
      router.push(targetPath)
    }
  } catch (error) {
    console.error('Profile creation error:', error)
  } finally {
    loading.value = false
  }
}

const hasExistingProfile = ref(false)

onMounted(async () => {
  const { getCurrentProfile } = useProfiles()
  const existingProfile = await getCurrentProfile()
  if (existingProfile) {
    hasExistingProfile.value = true
    form.displayName = existingProfile.displayName
    form.age = existingProfile.ageRange ? parseInt(existingProfile.ageRange.split('-')[0]) : 25
    form.gender = existingProfile.gender
    form.tags = existingProfile.personalityTags || []
    
    if (existingProfile.photos && existingProfile.photos.length > 0) {
      form.profilePhoto = existingProfile.photos[0]
      form.galleryPhotos = existingProfile.photos.slice(1)
    }
    
    form.lineId = existingProfile.lineId || ''
    form.instagram = existingProfile.instagram || ''
    form.tiktok = existingProfile.tiktok || ''
    form.x = existingProfile.x || ''
  }
})
</script>
