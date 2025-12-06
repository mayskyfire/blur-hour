import { collection, addDoc, query, where, getDocs, updateDoc, doc, onSnapshot, type Unsubscribe } from 'firebase/firestore'

export const useMissions = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const getAvailableMissions = async () => {
    try {
      const q = query(collection(db, 'missions'), where('active', '==', true))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error getting missions:', error)
      return []
    }
  }

  const getUserMissions = async () => {
    if (!currentUser.value) return []
    
    try {
      const q = query(
        collection(db, 'user_missions'),
        where('userId', '==', currentUser.value.uid),
        where('status', 'in', ['active', 'completed'])
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error getting user missions:', error)
      return []
    }
  }

  const acceptMission = async (missionId: string) => {
    if (!currentUser.value) return
    
    try {
      await addDoc(collection(db, 'user_missions'), {
        userId: currentUser.value.uid,
        missionId,
        status: 'active',
        progress: 0,
        acceptedAt: new Date(),
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error accepting mission:', error)
    }
  }

  const updateMissionProgress = async (userMissionId: string, progress: number) => {
    try {
      await updateDoc(doc(db, 'user_missions', userMissionId), {
        progress,
        updatedAt: new Date(),
        ...(progress >= 100 ? { status: 'completed', completedAt: new Date() } : {})
      })
    } catch (error) {
      console.error('Error updating mission:', error)
    }
  }

  const getUserPoints = async () => {
    if (!currentUser.value) return 0
    
    try {
      const profileDoc = await getDocs(
        query(collection(db, 'profiles'), where('userId', '==', currentUser.value.uid))
      )
      return profileDoc.docs[0]?.data()?.points || 0
    } catch (error) {
      return 0
    }
  }

  return { getAvailableMissions, getUserMissions, acceptMission, updateMissionProgress, getUserPoints }
}
