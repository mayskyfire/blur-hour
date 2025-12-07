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
            <div v-if="loading" class="text-center py-8 text-slate-400">
              กำลังโหลด...
            </div>
            <div v-else-if="questions.length === 0" class="text-center py-8 text-slate-400">
              ไม่พบคำถาม
            </div>
            <div v-else v-for="(question, i) in questions" :key="i"
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
import { collection, getDocs } from 'firebase/firestore'

const emit = defineEmits<{
  (e: 'select', question: string): void
}>()

const { db } = useFirebase()
const showModal = ref(false)
const questions = ref<any[]>([])
const loading = ref(false)

const loadQuestions = async () => {
  loading.value = true
  try {
    const snapshot = await getDocs(collection(db, 'icebreakers'))
    questions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error loading questions:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadQuestions()
})

const selectQuestion = (question: any) => {
  emit('select', question.text)
  showModal.value = false
}
</script>
