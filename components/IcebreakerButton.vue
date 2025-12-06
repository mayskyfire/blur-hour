<template>
  <div>
    <button @click="showModal = true"
      class="px-4 py-2 bg-gradient-to-r from-neonCyan/20 to-neonPink/20 border border-neonCyan/30 rounded-xl text-sm font-semibold hover:from-neonCyan/30 hover:to-neonPink/30 transition-all">
      💬 คำถามเริ่มต้น
    </button>

    <Teleport to="body">
      <div v-if="showModal" @click="showModal = false"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
        <div @click.stop class="bg-slate-900 rounded-card border border-neonCyan w-full max-w-md max-h-[70vh] overflow-y-auto">
          <div class="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
            <h2 class="text-xl font-bold">💬 คำถามเริ่มต้นสนทนา</h2>
            <button @click="showModal = false" class="text-2xl">×</button>
          </div>
          
          <div class="p-6 space-y-3">
            <div v-for="(question, i) in questions" :key="i"
              @click="selectQuestion(question)"
              class="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-neonCyan/50 transition-all cursor-pointer">
              <div class="flex items-start gap-3">
                <div class="text-2xl">{{ question.emoji }}</div>
                <div class="flex-1">
                  <p class="font-semibold mb-1">{{ question.text }}</p>
                  <p class="text-xs text-slate-400">{{ question.category }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'select', question: string): void
}>()

const showModal = ref(false)

const questions = ref([
  { emoji: '🏖️', text: 'คุณเป็นสายเที่ยวภูเขาหรือทะเล?', category: 'ไลฟ์สไตล์' },
  { emoji: '🎵', text: 'เพลงที่ฟังแล้วมีความสุขที่สุดคืออะไร?', category: 'ดนตรี' },
  { emoji: '🍕', text: 'อาหารที่ชอบที่สุดคืออะไร?', category: 'อาหาร' },
  { emoji: '🎬', text: 'หนังเรื่องโปรดของคุณคืออะไร?', category: 'บันเทิง' },
  { emoji: '✈️', text: 'ถ้าได้เที่ยวฟรี 1 ที่ อยากไปไหน?', category: 'ท่องเที่ยว' },
  { emoji: '🎮', text: 'เกมที่เล่นบ่อยที่สุดคืออะไร?', category: 'เกม' },
  { emoji: '☕', text: 'คุณเป็นคนตื่นเช้าหรือนอนดึก?', category: 'ไลฟ์สไตล์' },
  { emoji: '🐶', text: 'ชอบสุนัขหรือแมว?', category: 'สัตว์เลี้ยง' },
  { emoji: '🎨', text: 'งานอดิเรกของคุณคืออะไร?', category: 'ความสนใจ' },
  { emoji: '🌟', text: 'ถ้าได้ superpower 1 อย่าง อยากได้อะไร?', category: 'สนุกๆ' },
  { emoji: '📚', text: 'หนังสือเล่มสุดท้ายที่อ่านคืออะไร?', category: 'หนังสือ' },
  { emoji: '🎤', text: 'ถ้าได้ร้องเพลงกับศิลปินคนหนึ่ง อยากร้องกับใคร?', category: 'ดนตรี' },
  { emoji: '🍜', text: 'ร้านอาหารประจำของคุณคือที่ไหน?', category: 'อาหาร' },
  { emoji: '🏃', text: 'ออกกำลังกายบ่อยไหม? ชอบกีฬาอะไร?', category: 'กีฬา' },
  { emoji: '🎭', text: 'ถ้าได้เป็นตัวละครในหนัง อยากเป็นใคร?', category: 'บันเทิง' }
])

const selectQuestion = (question: any) => {
  emit('select', question.text)
  showModal.value = false
}
</script>
