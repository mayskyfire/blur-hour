<template>
  <div class="min-h-screen p-6 pb-20">
    <div class="max-w-md mx-auto space-y-6">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Create Your Profile</h1>
        <p class="text-slate-400">Quick setup to start meeting people</p>
      </div>

      <form @submit.prevent="submitProfile" class="space-y-4">
        <!-- Display Name -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">Nickname</label>
          <input
            v-model="form.displayName"
            type="text"
            required
            class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan"
          />
        </div>

        <!-- Age -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">Age</label>
          <input
            v-model.number="form.age"
            type="number"
            required
            min="18"
            max="99"
            class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan"
          />
        </div>

        <!-- Gender -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">Gender</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="g in genders"
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

        <!-- Looking For -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">Looking For</label>
          <select
            v-model="form.lookingFor"
            class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan"
          >
            <option value="เพื่อนกินดื่ม">เพื่อนกินดื่ม</option>
            <option value="คนคุย">คนคุย</option>
            <option value="สายเต้น">สายเต้น</option>
            <option value="สายเล่นเกม">สายเล่นเกม</option>
          </select>
        </div>

        <!-- Zone -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">Your Zone</label>
          <select
            v-model="form.zone"
            class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan"
          >
            <option value="Outdoor">Outdoor</option>
            <option value="Bar Counter">Bar Counter</option>
            <option value="หน้าเวที">หน้าเวที</option>
            <option value="VIP">VIP</option>
            <option value="Rooftop">Rooftop</option>
          </select>
        </div>

        <!-- Mood -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">Current Mood</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="m in moods"
              :key="m"
              type="button"
              @click="form.mood = m"
              class="py-3 rounded-xl border transition-all text-sm"
              :class="form.mood === m 
                ? 'bg-neonPink/20 border-neonPink text-neonPink' 
                : 'bg-slate-800/50 border-slate-700 text-slate-300'"
            >
              {{ m }}
            </button>
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm text-slate-400 mb-2">Tags (select up to 3)</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in availableTags"
              :key="tag"
              type="button"
              @click="toggleTag(tag)"
              class="px-3 py-2 rounded-full text-sm border transition-all"
              :class="form.tags.includes(tag)
                ? 'bg-neonGreen/20 border-neonGreen text-neonGreen'
                : 'bg-slate-800/50 border-slate-700 text-slate-300'"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-gradient-to-r from-neonCyan to-neonGreen rounded-xl font-semibold text-lg shadow-neon-cyan mt-8"
        >
          {{ loading ? 'Creating...' : 'Start Blurring the Night' }}
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
  lookingFor: 'เพื่อนกินดื่ม',
  zone: 'Bar Counter',
  mood: 'อยากคุย 🍻',
  tags: [] as string[]
})

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
]

const moods = ['อยากคุย 🍻', 'อยากเต้น 💃', 'ชิล ๆ 🎵', 'สนุก 🎉']

const availableTags = [
  'Cocktails', 'Beer', 'Wine', 'Shots',
  'Dancing', 'Music', 'Games', 'Chill',
  'Party', 'Deep Talk', 'Fun', 'Adventure'
]

const toggleTag = (tag: string) => {
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  } else if (form.tags.length < 3) {
    form.tags.push(tag)
  }
}

const submitProfile = async () => {
  loading.value = true
  try {
    await createOrUpdateProfile({
      venueId: route.query.venueId as string || 'default',
      displayName: form.displayName,
      age: form.age,
      gender: form.gender,
      zone: form.zone,
      mood: form.mood,
      tags: form.tags,
      lookingFor: form.lookingFor,
      status: 'single'
    })

    router.push('/discover')
  } catch (error) {
    console.error('Profile creation error:', error)
  } finally {
    loading.value = false
  }
}
</script>
