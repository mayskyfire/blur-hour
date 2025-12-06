<template>
  <div class="min-h-screen p-4 pb-24">
    <!-- Header -->
    <div class="mb-6 text-center">
      <div class="text-6xl mb-3">🎮</div>
      <h1 class="text-3xl font-bold mb-2">ภารกิจคืนนี้</h1>
      <p class="text-slate-400">ทำภารกิจให้สำเร็จรับรางวัล!</p>
    </div>

    <!-- Points Display -->
    <div class="mb-6 p-4 bg-gradient-to-r from-neonPink/20 to-neonCyan/20 rounded-xl border border-neonCyan">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-400">คะแนนของคุณ</p>
          <p class="text-3xl font-bold text-neonCyan">{{ userPoints }} 🌟</p>
        </div>
        <button @click="showRewards = true" class="px-4 py-2 bg-neonGold rounded-lg font-semibold text-black">
          🎁 รางวัล
        </button>
      </div>
    </div>

    <!-- Active Missions -->
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-3">ภารกิจที่กำลังทำ</h2>
      <div v-if="activeMissions.length === 0" class="text-center py-8 bg-slate-900/50 rounded-xl">
        <p class="text-slate-400">ยังไม่มีภารกิจที่กำลังทำ</p>
      </div>
      <div v-else class="space-y-3">
        <div v-for="mission in activeMissions" :key="mission.id" 
          class="bg-gradient-to-r from-neonCyan/10 to-neonPink/10 rounded-xl border border-neonCyan/30 p-4">
          <div class="flex items-start gap-3">
            <div class="text-3xl">{{ mission.emoji }}</div>
            <div class="flex-1">
              <h3 class="font-bold mb-1">{{ mission.title }}</h3>
              <p class="text-sm text-slate-300 mb-2">{{ mission.description }}</p>
              <div class="flex items-center gap-2 mb-2">
                <div class="flex-1 bg-slate-800 rounded-full h-2">
                  <div class="bg-neonCyan h-2 rounded-full transition-all" 
                    :style="{ width: `${mission.progress || 0}%` }"></div>
                </div>
                <span class="text-xs text-neonCyan font-bold">{{ mission.progress || 0 }}%</span>
              </div>
              <div class="flex gap-2">
                <button v-if="mission.progress < 100" @click="updateProgress(mission.id, 50)"
                  class="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs">
                  ทำ 50%
                </button>
                <button v-if="mission.progress < 100" @click="completeMission(mission.id)"
                  class="px-3 py-1 bg-neonGreen hover:bg-neonGreen/80 rounded-lg text-xs font-semibold">
                  ✅ ทำสำเร็จ
                </button>
                <span v-else class="px-3 py-1 bg-neonGreen/20 text-neonGreen rounded-lg text-xs font-semibold">
                  ✅ สำเร็จแล้ว
                </span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-neonGold font-bold">+{{ mission.points }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Missions -->
    <div>
      <h2 class="text-xl font-bold mb-3">ภารกิจใหม่</h2>
      <div v-if="loading" class="text-center py-8">
        <div class="text-4xl animate-pulse mb-2">⏳</div>
        <p class="text-slate-400">กำลังโหลด...</p>
      </div>
      <div v-else-if="availableMissions.length === 0" class="text-center py-8 bg-slate-900/50 rounded-xl">
        <p class="text-slate-400">ไม่มีภารกิจ</p>
      </div>
      <div v-else class="space-y-3">
        <div v-for="mission in availableMissions" :key="mission.id"
          class="bg-slate-900/80 rounded-xl border border-slate-700/60 p-4 hover:border-neonCyan/50 transition-all">
          <div class="flex items-start gap-3">
            <div class="text-3xl">{{ mission.emoji }}</div>
            <div class="flex-1">
              <h3 class="font-bold mb-1">{{ mission.title }}</h3>
              <p class="text-sm text-slate-400 mb-3">{{ mission.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-neonGold font-bold">🌟 {{ mission.points }} คะแนน</span>
                <button @click="acceptMission(mission.id)"
                  class="px-4 py-2 bg-gradient-to-r from-neonPink to-neonCyan rounded-lg font-semibold text-sm">
                  รับภารกิจ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <Teleport to="body">
      <Transition name="slide-down">
        <div v-if="showSuccessToast" class="fixed top-20 left-4 right-4 z-[200] mx-auto max-w-md">
          <div class="bg-gradient-to-r from-neonGreen/95 to-neonCyan/95 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/20">
            <div class="flex items-center gap-3">
              <span class="text-3xl">🎉</span>
              <div class="flex-1">
                <p class="font-bold text-white">{{ toastMessage }}</p>
              </div>
              <button @click="showSuccessToast = false" class="text-white/80 hover:text-white text-xl leading-none">
                ×
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Rewards Modal -->
    <Teleport to="body">
      <div v-if="showRewards" @click="showRewards = false"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
        <div @click.stop class="bg-slate-900 rounded-card border border-neonGold w-full max-w-md max-h-[80vh] overflow-y-auto">
          <div class="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
            <h2 class="text-2xl font-bold">🎁 รางวัล</h2>
            <button @click="showRewards = false" class="text-2xl">×</button>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="reward in rewards" :key="reward.id"
              class="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div class="flex items-center gap-3 mb-3">
                <div class="text-4xl">{{ reward.emoji }}</div>
                <div class="flex-1">
                  <h3 class="font-bold">{{ reward.title }}</h3>
                  <p class="text-sm text-slate-400">{{ reward.description }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neonGold font-bold">{{ reward.points }} คะแนน</span>
                <button @click="claimReward(reward.id)" :disabled="userPoints < reward.points"
                  class="px-4 py-2 bg-neonGold rounded-lg font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed">
                  แลกรางวัล
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot, getDoc, serverTimestamp } from 'firebase/firestore'

const { db } = useFirebase()
const { currentUser } = useAuth()

const userPoints = ref(0)
const showRewards = ref(false)
const loading = ref(true)
const activeMissions = ref<any[]>([])
const availableMissions = ref<any[]>([])
const rewards = ref<any[]>([])
const showSuccessToast = ref(false)
const toastMessage = ref('')
let toastTimer: NodeJS.Timeout | null = null

const loadMissions = () => {
  const missionsQuery = query(collection(db, 'missions'), where('active', '==', true))
  onSnapshot(missionsQuery, (snapshot) => {
    availableMissions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('Missions loaded:', availableMissions.value)
  }, (error) => {
    console.error('Error loading missions:', error)
  })
}

const loadRewards = () => {
  const rewardsQuery = query(collection(db, 'rewards'), where('active', '==', true))
  onSnapshot(rewardsQuery, (snapshot) => {
    rewards.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('Rewards loaded:', rewards.value)
  }, (error) => {
    console.error('Error loading rewards:', error)
  })
}

const loadUserData = async () => {
  if (!currentUser.value) {
    console.log('No current user')
    return
  }
  
  console.log('Loading user data for:', currentUser.value.uid)
  const userDocRef = doc(db, 'users', currentUser.value.uid)
  
  // Subscribe to user data
  onSnapshot(userDocRef, async (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data()
      userPoints.value = data.points || 0
      activeMissions.value = data.activeMissions || []
      console.log('User data loaded:', { points: userPoints.value, activeMissions: activeMissions.value })
    } else {
      console.log('User document not found, creating...')
      // Create user document if not exists
      try {
        const { setDoc, serverTimestamp } = await import('firebase/firestore')
        await setDoc(userDocRef, {
          points: 0,
          activeMissions: [],
          completedMissions: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
        console.log('User document created')
      } catch (error) {
        console.error('Error creating user document:', error)
      }
    }
  })
}

onMounted(async () => {
  console.log('Missions page mounted')
  console.log('Current user:', currentUser.value)
  
  if (!currentUser.value) {
    console.error('User not authenticated')
    loading.value = false
    return
  }
  
  loading.value = true
  loadMissions()
  loadRewards()
  await loadUserData()
  setTimeout(() => {
    loading.value = false
  }, 1000)
})

const acceptMission = async (missionId: string) => {
  if (!currentUser.value) return
  
  const mission = availableMissions.value.find(m => m.id === missionId)
  if (mission) {
    const newMission = { ...mission, progress: 0, acceptedAt: new Date() }
    activeMissions.value.push(newMission)
    
    try {
      const userDocRef = doc(db, 'users', currentUser.value.uid)
      await updateDoc(userDocRef, {
        activeMissions: activeMissions.value
      })
    } catch (error) {
      console.error('Error accepting mission:', error)
    }
  }
}

const updateProgress = async (missionId: string, progress: number) => {
  if (!currentUser.value) return
  
  const missionIndex = activeMissions.value.findIndex(m => m.id === missionId)
  if (missionIndex !== -1) {
    activeMissions.value[missionIndex].progress = progress
    
    try {
      const userDocRef = doc(db, 'users', currentUser.value.uid)
      await updateDoc(userDocRef, {
        activeMissions: activeMissions.value
      })
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }
}

const showToast = (message: string) => {
  toastMessage.value = message
  showSuccessToast.value = true
  
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    showSuccessToast.value = false
  }, 5000)
}

const completeMission = async (missionId: string) => {
  if (!currentUser.value) return
  
  const missionIndex = activeMissions.value.findIndex(m => m.id === missionId)
  if (missionIndex !== -1) {
    const mission = activeMissions.value[missionIndex]
    mission.progress = 100
    mission.completedAt = new Date()
    
    try {
      const userDocRef = doc(db, 'users', currentUser.value.uid)
      const userDoc = await getDoc(userDocRef)
      const userData = userDoc.data()
      
      // เตรียม completed mission เพื่อบันทึกประวัติ
      const completedMission = {
        missionId: mission.id,
        title: mission.title,
        points: mission.points,
        completedAt: serverTimestamp()
      }
      
      const completedMissions = userData?.completedMissions || []
      completedMissions.push(completedMission)
      
      await updateDoc(userDocRef, {
        activeMissions: activeMissions.value,
        completedMissions: completedMissions,
        points: userPoints.value + mission.points
      })
      
      showToast(`ทำภารกิจสำเร็จ! ได้รับ ${mission.points} คะแนน`)
      
      // Remove completed mission after 2 seconds
      setTimeout(() => {
        activeMissions.value.splice(missionIndex, 1)
        updateDoc(userDocRef, {
          activeMissions: activeMissions.value
        })
      }, 2000)
    } catch (error) {
      console.error('Error completing mission:', error)
    }
  }
}

const claimReward = async (rewardId: string) => {
  if (!currentUser.value) return
  
  const reward = rewards.value.find(r => r.id === rewardId)
  if (reward && userPoints.value >= reward.points) {
    try {
      const userDocRef = doc(db, 'users', currentUser.value.uid)
      await updateDoc(userDocRef, {
        points: userPoints.value - reward.points
      })
      showToast(`คุณได้รับ ${reward.title} แล้ว!`)
      showRewards.value = false
    } catch (error) {
      console.error('Error claiming reward:', error)
    }
  }
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
