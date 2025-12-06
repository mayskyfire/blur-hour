<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" @click="$emit('close')" 
        class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
        <div @click.stop class="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden">
          <!-- Header -->
          <div class="p-6 border-b border-slate-700 bg-gradient-to-r from-red-500/10 to-orange-500/10">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-3xl">⚠️</span>
                <h2 class="text-xl font-bold">รายงานปัญหา</h2>
              </div>
              <button @click="$emit('close')" class="text-2xl text-slate-400 hover:text-white">×</button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-4">
            <!-- User Info -->
            <div class="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-neonPink to-neonCyan flex items-center justify-center text-white font-bold text-lg">
                {{ userName?.charAt(0) || '?' }}
              </div>
              <div>
                <p class="font-semibold">{{ userName }}</p>
                <p class="text-xs text-slate-400">กำลังรายงานผู้ใช้คนนี้</p>
              </div>
            </div>

            <!-- Report Reasons -->
            <div class="space-y-2">
              <label class="text-sm text-slate-400">เลือกเหตุผล</label>
              <div class="space-y-2">
                <button v-for="reason in reportReasons" :key="reason.value"
                  @click="selectedReason = reason.value"
                  :class="[
                    'w-full p-3 rounded-xl border-2 text-left transition-all',
                    selectedReason === reason.value
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  ]">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">{{ reason.emoji }}</span>
                    <div class="flex-1">
                      <p class="font-semibold">{{ reason.label }}</p>
                      <p class="text-xs text-slate-400">{{ reason.description }}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Additional Details -->
            <div v-if="selectedReason" class="space-y-2">
              <label class="text-sm text-slate-400">รายละเอียดเพิ่มเติม (ถ้ามี)</label>
              <textarea v-model="details"
                class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                rows="3"
                placeholder="อธิบายเพิ่มเติม..."></textarea>
            </div>

            <!-- Actions -->
            <div class="space-y-2 pt-2">
              <button @click="handleReport" :disabled="!selectedReason || loading"
                class="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all">
                {{ loading ? 'กำลังส่ง...' : '🚨 ส่งรายงาน' }}
              </button>
              
              <button @click="handleBlock" :disabled="loading"
                class="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold transition-all">
                🚫 บล็อกผู้ใช้คนนี้
              </button>
              
              <button @click="$emit('close')"
                class="w-full py-3 text-slate-400 hover:text-white transition-colors">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  userId: string
  userName: string
}>()

const emit = defineEmits<{
  close: []
  reported: []
  blocked: []
}>()

const { reportUser, blockUser } = useReportBlock()

const selectedReason = ref('')
const details = ref('')
const loading = ref(false)

const reportReasons = [
  {
    value: 'inappropriate_content',
    emoji: '🚫',
    label: 'เนื้อหาไม่เหมาะสม',
    description: 'ส่งข้อความหรือรูปภาพที่ไม่เหมาะสม'
  },
  {
    value: 'harassment',
    emoji: '😡',
    label: 'การล่วงละเมิด',
    description: 'พฤติกรรมรบกวนหรือคุกคาม'
  },
  {
    value: 'fake_profile',
    emoji: '🎭',
    label: 'โปรไฟล์ปลอม',
    description: 'ใช้ข้อมูลหรือรูปภาพปลอม'
  },
  {
    value: 'spam',
    emoji: '📢',
    label: 'สแปม',
    description: 'ส่งข้อความซ้ำๆ หรือโฆษณา'
  },
  {
    value: 'underage',
    emoji: '🔞',
    label: 'อายุไม่ถึง',
    description: 'ผู้ใช้อายุต่ำกว่า 18 ปี'
  },
  {
    value: 'other',
    emoji: '❓',
    label: 'อื่นๆ',
    description: 'เหตุผลอื่นที่ไม่ได้ระบุไว้'
  }
]

const handleReport = async () => {
  if (!selectedReason.value) return
  
  loading.value = true
  try {
    await reportUser(props.userId, selectedReason.value, details.value)
    emit('reported')
    emit('close')
    
    // Show success toast
    alert('✅ ส่งรายงานเรียบร้อยแล้ว\nเราจะตรวจสอบและดำเนินการโดยเร็วที่สุด')
  } catch (error) {
    console.error('Error reporting user:', error)
    alert('❌ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
  } finally {
    loading.value = false
  }
}

const handleBlock = async () => {
  if (!confirm('คุณแน่ใจหรือไม่ที่จะบล็อกผู้ใช้คนนี้?\n\nเมื่อบล็อกแล้ว:\n- คุณจะไม่เห็นโปรไฟล์ของเขา\n- เขาจะไม่สามารถส่งข้อความหาคุณได้\n- คุณสามารถยกเลิกการบล็อกได้ในภายหลัง')) {
    return
  }
  
  loading.value = true
  try {
    // ส่งสาเหตุการ block ไปด้วย (ถ้ามีการเลือกเหตุผล)
    await blockUser(props.userId, selectedReason.value, details.value)
    emit('blocked')
    emit('close')
    alert('🚫 บล็อกผู้ใช้เรียบร้อยแล้ว')
  } catch (error) {
    console.error('Error blocking user:', error)
    alert('❌ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
  } finally {
    loading.value = false
  }
}

// Reset when modal closes
watch(() => props.show, (show) => {
  if (!show) {
    selectedReason.value = ''
    details.value = ''
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
