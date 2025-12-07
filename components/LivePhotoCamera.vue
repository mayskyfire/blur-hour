<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 bg-black z-[200] flex flex-col">
      <!-- Header -->
      <div class="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button @click="close" class="p-2 text-white">
          <PhX :size="28" weight="bold" />
        </button>
        <h2 class="text-white font-bold flex items-center gap-2">
          <PhCamera :size="20" weight="fill" />
          ถ่ายรูป Live
        </h2>
        <div class="w-10"></div>
      </div>

      <!-- Camera Preview -->
      <div class="flex-1 relative flex items-center justify-center">
        <video ref="videoRef" autoplay playsinline class="w-full h-full object-cover"></video>
        
        <!-- Loading -->
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black/50">
          <div class="text-white text-center">
            <PhCamera :size="48" class="mx-auto mb-2 animate-pulse" weight="fill" />
            <p>กำลังเปิดกล้อง...</p>
          </div>
        </div>

        <!-- Uploading -->
        <div v-if="uploading" class="absolute inset-0 flex items-center justify-center bg-black/80">
          <div class="text-white text-center">
            <PhSpinner :size="48" class="mx-auto mb-2 animate-spin" weight="bold" />
            <p>กำลังอัพโหลด...</p>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
        <div class="flex items-center justify-center gap-8">
          <!-- Flip Camera -->
          <button @click="flipCamera" class="p-4 bg-white/20 rounded-full backdrop-blur-sm">
            <PhCameraRotate :size="24" class="text-white" weight="bold" />
          </button>

          <!-- Capture Button -->
          <button 
            @click="capture" 
            :disabled="uploading"
            class="w-20 h-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all disabled:opacity-50"
          >
            <div class="w-full h-full rounded-full bg-white"></div>
          </button>

          <!-- Gallery Button -->
          <button @click="fileInput?.click()" class="p-4 bg-white/20 rounded-full backdrop-blur-sm">
            <PhImage :size="24" class="text-white" weight="bold" />
          </button>
        </div>
      </div>
      
      <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" class="hidden" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  venueId: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'captured', photoId: string): void
}>()

const { captureLivePhoto } = useLivePhotos()

const videoRef = ref<HTMLVideoElement>()
const stream = ref<MediaStream>()
const loading = ref(true)
const uploading = ref(false)
const facingMode = ref<'user' | 'environment'>('user')
const fileInput = ref<HTMLInputElement>()

const startCamera = async () => {
  loading.value = true
  try {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
    }

    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode.value },
      audio: false
    })

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
    }
  } catch (error) {
    console.error('Camera error:', error)
    alert('ไม่สามารถเปิดกล้องได้')
  } finally {
    loading.value = false
  }
}

const flipCamera = () => {
  facingMode.value = facingMode.value === 'user' ? 'environment' : 'user'
  startCamera()
}

const capture = async () => {
  if (!videoRef.value || uploading.value) return

  uploading.value = true
  try {
    // Create canvas and capture frame
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.value.videoWidth
    canvas.height = videoRef.value.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context error')

    ctx.drawImage(videoRef.value, 0, 0)

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Blob creation failed')),
        'image/jpeg',
        0.8
      )
    })

    // Upload
    const photoId = await captureLivePhoto(blob, props.venueId)
    
    emit('captured', photoId)
    close()
  } catch (error) {
    console.error('Capture error:', error)
    alert('ไม่สามารถถ่ายรูปได้')
  } finally {
    uploading.value = false
  }
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const blob = new Blob([file], { type: file.type })
    const photoId = await captureLivePhoto(blob, props.venueId)
    
    emit('captured', photoId)
    close()
  } catch (error) {
    console.error('File upload error:', error)
    alert('ไม่สามารถอัพโหลดรูปได้')
  } finally {
    uploading.value = false
  }
}

const close = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
  emit('close')
}

watch(() => props.show, (show) => {
  if (show) {
    startCamera()
  } else {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
    }
  }
})

onUnmounted(() => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
})
</script>
