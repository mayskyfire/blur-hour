<template>
  <div class="min-h-screen p-4 pb-24">
    <!-- Header -->
    <div class="mb-6 text-center">
      <PhMusicNote :size="60" class="text-neonCyan mx-auto mb-3" weight="fill" />
      <h1 class="text-3xl font-bold mb-2">ขอเพลง</h1>
      <p class="text-slate-400">ขอเพลงพร้อมส่งข้อความหวานๆ</p>
    </div>

    <!-- Request Form -->
    <div class="mb-6 bg-slate-900/80 rounded-xl border border-slate-700/60 p-6 space-y-4">
      <div>
        <label class="block text-sm text-slate-400 mb-2">ชื่อเพลง</label>
        <input v-model="songName" type="text" placeholder="พิมพ์ชื่อเพลงที่อยากฟัง"
          class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan">
      </div>

      <div>
        <label class="block text-sm text-slate-400 mb-2">ศิลปิน</label>
        <input v-model="artist" type="text" placeholder="ชื่อศิลปิน"
          class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan">
      </div>

      <div>
        <label class="block text-sm text-slate-400 mb-2">ข้อความ (แสดงบนจอ)</label>
        <textarea v-model="message" rows="3" placeholder="เพลงนี้ขอให้โต๊ะหมายเลข 5 จากโต๊ะ 8 😉"
          class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-neonCyan resize-none"></textarea>
        <p class="text-xs text-slate-500 mt-1">{{ message.length }}/100 ตัวอักษร</p>
      </div>

      <div class="flex gap-2 flex-wrap">
        <button v-for="template in messageTemplates" :key="template"
          @click="message = template"
          class="px-3 py-1 bg-slate-800 rounded-full text-sm hover:bg-neonCyan/20 hover:text-neonCyan transition-colors">
          {{ template }}
        </button>
      </div>

      <button @click="submitRequest" :disabled="!songName || !artist"
        class="w-full py-4 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2">
        ส่งคำขอ <PhMusicNote :size="20" weight="fill" />
      </button>
    </div>

    <!-- My Requests -->
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-3">คำขอของฉัน</h2>
      <div v-if="myRequests.length === 0" class="text-center py-8 bg-slate-900/50 rounded-xl">
        <p class="text-slate-400">ยังไม่มีคำขอเพลง</p>
      </div>
      <div v-else class="space-y-3">
        <div v-for="request in myRequests" :key="request.id"
          class="bg-slate-900/80 rounded-xl border border-slate-700/60 p-4">
          <div class="flex items-start gap-3">
            <PhMusicNote :size="32" class="text-neonCyan" weight="fill" />
            <div class="flex-1">
              <h3 class="font-bold">{{ request.songName }}</h3>
              <p class="text-sm text-slate-400">{{ request.artist }}</p>
              <p class="text-sm text-slate-300 mt-2">{{ request.message }}</p>
            </div>
            <div>
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                request.status === 'approved' ? 'bg-neonGreen/20 text-neonGreen' :
                request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              ]">
                {{ 
                  request.status === 'approved' ? 'อนุมัติ' :
                  request.status === 'pending' ? 'รอตรวจสอบ' :
                  'ปฏิเสธ'
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Popular Songs -->
    <div>
      <h2 class="text-xl font-bold mb-3 flex items-center gap-2"><PhFire :size="24" class="text-neonPink" weight="fill" /> เพลงฮิตคืนนี้</h2>
      <div class="space-y-2">
        <div v-for="(song, i) in popularSongs" :key="i"
          @click="quickRequest(song)"
          class="bg-slate-900/80 rounded-xl border border-slate-700/60 p-3 flex items-center gap-3 hover:border-neonCyan/50 transition-all cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-neonPink to-neonCyan flex items-center justify-center font-bold">
            {{ i + 1 }}
          </div>
          <div class="flex-1">
            <p class="font-semibold">{{ song.name }}</p>
            <p class="text-xs text-slate-400">{{ song.artist }}</p>
          </div>
          <div class="text-neonCyan">
            <span class="text-sm">{{ song.requests }} คำขอ</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <Teleport to="body">
      <div v-if="showSuccess" @click="showSuccess = false"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
        <div class="bg-gradient-to-br from-neonPink/20 to-neonCyan/20 rounded-card border border-neonCyan p-8 text-center space-y-4 max-w-sm">
          <PhConfetti :size="70" class="text-neonPink mx-auto" weight="fill" />
          <h2 class="text-2xl font-bold">ส่งคำขอแล้ว!</h2>
          <p class="text-slate-300">รอ DJ ตรวจสอบนะ</p>
          <button @click="showSuccess = false"
            class="w-full py-3 bg-gradient-to-r from-neonPink to-neonCyan rounded-xl font-semibold">
            ตกลง
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const songName = ref('')
const artist = ref('')
const message = ref('')
const showSuccess = ref(false)

const messageTemplates = [
  'เพลงนี้ขอให้คุณ',
  'ชอบเพลงนี้เหมือนกัน',
  'เพลงนี้เพราะมาก',
  'ขอให้โต๊ะข้างๆ',
  'เพลงนี้สำหรับคืนนี้'
]

const myRequests = ref([
  {
    id: '1',
    songName: 'ไม่บอกเธอ',
    artist: 'Polycat',
    message: 'เพลงนี้ขอให้โต๊ะ 5 💕',
    status: 'approved'
  },
  {
    id: '2',
    songName: 'คนที่คุณรัก',
    artist: 'Slot Machine',
    message: 'ชอบเพลงนี้มาก',
    status: 'pending'
  }
])

const popularSongs = ref([
  { name: 'ไม่บอกเธอ', artist: 'Polycat', requests: 15 },
  { name: 'คนที่คุณรัก', artist: 'Slot Machine', requests: 12 },
  { name: 'ขอบคุณที่รัก', artist: 'Potato', requests: 10 },
  { name: 'เธอคือ', artist: 'Singular', requests: 8 },
  { name: 'รักเธอเหมือนวันวาน', artist: '25 Hours', requests: 7 }
])

const submitRequest = () => {
  if (!songName.value || !artist.value) return
  
  myRequests.value.unshift({
    id: Date.now().toString(),
    songName: songName.value,
    artist: artist.value,
    message: message.value || 'ขอเพลงนี้หน่อย',
    status: 'pending'
  })
  
  songName.value = ''
  artist.value = ''
  message.value = ''
  showSuccess.value = true
}

const quickRequest = (song: any) => {
  songName.value = song.name
  artist.value = song.artist
}
</script>
