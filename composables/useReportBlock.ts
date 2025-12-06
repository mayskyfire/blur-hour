import { collection, addDoc, query, where, getDocs, serverTimestamp, doc, setDoc } from 'firebase/firestore'

export const useReportBlock = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const reportUser = async (reportedUserId: string, reason: string, details?: string) => {
    if (!currentUser.value) throw new Error('Not authenticated')
    
    const reportData = {
      reporterId: currentUser.value.uid,
      reportedUserId,
      reason,
      details: details || '',
      status: 'pending',
      createdAt: serverTimestamp()
    }
    
    await addDoc(collection(db, 'reports'), reportData)
  }

  const blockUser = async (blockedUserId: string, reason?: string, details?: string) => {
    if (!currentUser.value) throw new Error('Not authenticated')
    
    const blockId = `${currentUser.value.uid}_${blockedUserId}`
    await setDoc(doc(db, 'blocks', blockId), {
      blockerId: currentUser.value.uid,
      blockedUserId,
      reason: reason || 'manual_block',
      details: details || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  const unblockUser = async (blockedUserId: string) => {
    if (!currentUser.value) throw new Error('Not authenticated')
    
    const blockId = `${currentUser.value.uid}_${blockedUserId}`
    const blockRef = doc(db, 'blocks', blockId)
    await setDoc(blockRef, { deleted: true }, { merge: true })
  }

  const getBlockedUsers = async (): Promise<string[]> => {
    if (!currentUser.value) return []
    
    const q = query(
      collection(db, 'blocks'),
      where('blockerId', '==', currentUser.value.uid)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs
      .filter(doc => !doc.data().deleted)
      .map(doc => doc.data().blockedUserId)
  }

  const isUserBlocked = async (userId: string): Promise<boolean> => {
    const blockedUsers = await getBlockedUsers()
    return blockedUsers.includes(userId)
  }

  return {
    reportUser,
    blockUser,
    unblockUser,
    getBlockedUsers,
    isUserBlocked
  }
}
