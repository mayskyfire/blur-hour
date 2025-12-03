<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6"
      @click="$emit('close')"
    >
      <div
        class="bg-slate-900 rounded-xl border border-slate-700 p-6 max-w-sm w-full space-y-4"
        @click.stop
      >
        <h2 class="text-xl font-bold text-center">รายงานผู้ใช้</h2>
        
        <div class="space-y-3">
          <button
            v-for="reason in reportReasons"
            :key="reason.value"
            @click="handleReport(reason.value)"
            :disabled="loading"
            class="w-full p-3 text-left rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <div class="font-medium">{{ reason.label }}</div>
            <div class="text-sm text-slate-400">{{ reason.description }}</div>
          </button>
        </div>

        <div class="pt-4 border-t border-slate-700 space-y-2">
          <button
            @click="handleBlock"
            :disabled="loading"
            class="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-colors disabled:opacity-50"
          >
            {{ loading ? 'กำลังบล็อก...' : 'บล็อกผู้ใช้นี้' }}
          </button>
          
          <button
            @click="$emit('close')"
            class="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  userId: string
  venueId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  reported: []
  blocked: []
}>()

const { reportUser, blockUser } = useSafety()
const loading = ref(false)

const reportReasons = [
  {
    value: 'inappropriate-behavior',
    label: 'พฤติกรรมไม่เหมาะสม',
    description: 'ส่งข้อความหรือรูปภาพที่ไม่เหมาะสม'
  },
  {
    value: 'harassment',
    label: 'การคุกคาม',
    description: 'ทำให้รู้สึกไม่ปลอดภัยหรือถูกคุกคาม'
  },
  {
    value: 'fake-profile',
    label: 'โปรไฟล์ปลอม',
    description: 'ใช้รูปภาพหรือข้อมูลของคนอื่น'
  },
  {
    value: 'spam',
    label: 'สแปม',
    description: 'ส่งข้อความซ้ำๆ หรือโฆษณา'
  },
  {
    value: 'other',
    label: 'อื่นๆ',
    description: 'เหตุผลอื่นที่ไม่เหมาะสม'
  }
]

const handleReport = async (reason: string) => {
  loading.value = true
  try {
    await reportUser(props.userId, props.venueId, reason)
    emit('reported')
    emit('close')
  } catch (error) {
    console.error('Error reporting user:', error)
  } finally {
    loading.value = false
  }
}

const handleBlock = async () => {
  loading.value = true
  try {
    await blockUser(props.userId, props.venueId)
    emit('blocked')
    emit('close')
  } catch (error) {
    console.error('Error blocking user:', error)
  } finally {
    loading.value = false
  }
}
</script>