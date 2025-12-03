import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import type { Report, Block } from '~/types'

export const useSafety = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const reportUser = async (reportedUserId: string, venueId: string, reason: string, description?: string) => {
    if (!currentUser.value) throw new Error('Not authenticated')
    
    const reportData: Omit<Report, 'id'> = {
      reporterId: currentUser.value.uid,
      reportedUserId,
      venueId,
      reason,
      description,
      status: 'pending',
      createdAt: serverTimestamp() as any
    }
    
    await addDoc(collection(db, 'reports'), reportData)
  }

  const blockUser = async (blockedUserId: string, venueId: string) => {
    if (!currentUser.value) throw new Error('Not authenticated')
    
    const blockData: Omit<Block, 'id'> = {
      blockerId: currentUser.value.uid,
      blockedUserId,
      venueId,
      createdAt: serverTimestamp() as any
    }
    
    await addDoc(collection(db, 'blocks'), blockData)
  }

  const getBlockedUsers = async (venueId: string): Promise<string[]> => {
    if (!currentUser.value) return []
    
    const q = query(
      collection(db, 'blocks'),
      where('blockerId', '==', currentUser.value.uid),
      where('venueId', '==', venueId)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data().blockedUserId)
  }

  const isUserBlocked = async (userId: string, venueId: string): Promise<boolean> => {
    if (!currentUser.value) return false
    
    // Check if current user blocked the other user
    const blockedByMe = query(
      collection(db, 'blocks'),
      where('blockerId', '==', currentUser.value.uid),
      where('blockedUserId', '==', userId),
      where('venueId', '==', venueId)
    )
    
    // Check if other user blocked current user
    const blockedMe = query(
      collection(db, 'blocks'),
      where('blockerId', '==', userId),
      where('blockedUserId', '==', currentUser.value.uid),
      where('venueId', '==', venueId)
    )
    
    const [blockedByMeSnap, blockedMeSnap] = await Promise.all([
      getDocs(blockedByMe),
      getDocs(blockedMe)
    ])
    
    return !blockedByMeSnap.empty || !blockedMeSnap.empty
  }

  return {
    reportUser,
    blockUser,
    getBlockedUsers,
    isUserBlocked
  }
}