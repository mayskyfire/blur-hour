<template>
  <div class="min-h-screen p-6 pb-20">
    <div class="max-w-md mx-auto space-y-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold mb-2">สร้างโปรไฟล์ 30 วินาที</h1>
        <p class="text-slate-400">เลือกแบบง่าย ๆ ได้เลย</p>
        <p v-if="hasExistingProfile" class="text-xs text-neonCyan mt-2">พบข้อมูลเดิมของคุณ</p>
      </div>

      <form @submit.prevent="submitProfile" class="space-y-5">
        <!-- Avatar/Emoji Selector -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">เลือก Avatar</label>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="avatar in avatars"
              :key="avatar"
              type="button"
              @click="form.avatar = avatar"
              class="aspect-square rounded-xl border-2 text-4xl flex items-center justify-center transition-all"
              :class="form.avatar === avatar ? 'border-neonCyan bg-neonCyan/20 scale-110' : 'border-slate-700 bg-slate-800/50'"
            >
              {{ avatar }}
            </button>
          </div>
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

        <button
          type="submit"
          :disabled="loading || !isValid"
          class="w-full py-4 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {{ loading ? 'กำลังสร้าง...' : 'เริ่มใช้งาน 🚀' }}
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
  avatar: '😎',
  displayName: '',
  age: 25,
  gender: 'male' as 'male' | 'female' | 'other',
  tags: [] as string[],
  personalityTags: [] as string[],
  lookingFor: 'เพื่อนกินดื่ม'
})

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
  return form.displayName && form.age >= 18 && (form.tags.length > 0 || form.personalityTags.length > 0)
})

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
      photos: [form.avatar]
    }

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
      form.avatar = existingProfile.photos[0]
    }
  }
})
</script>
