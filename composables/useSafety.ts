import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'

export const useSafety = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const blockUser = async (blockedUserId: string) => {
    if (!currentUser.value) throw new Error('Not authenticated')

    await addDoc(collection(db, 'blocks'), {
      blockerId: currentUser.value.uid,
      blockedUserId,
      createdAt: serverTimestamp()
    })
  }

  const reportUser = async (reportedUserId: string, reason: string, details?: string) => {
    if (!currentUser.value) throw new Error('Not authenticated')

    await addDoc(collection(db, 'reports'), {
      reporterId: currentUser.value.uid,
      reportedUserId,
      reason,
      details,
      status: 'pending',
      createdAt: serverTimestamp()
    })
  }

  const getBlockedUsers = async (): Promise<string[]> => {
    if (!currentUser.value) return []

    const q = query(
      collection(db, 'blocks'),
      where('blockerId', '==', currentUser.value.uid)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data().blockedUserId)
  }

  const isBlocked = async (userId: string): Promise<boolean> => {
    if (!currentUser.value) return false

    const q = query(
      collection(db, 'blocks'),
      where('blockerId', '==', currentUser.value.uid),
      where('blockedUserId', '==', userId)
    )
    const snapshot = await getDocs(q)
    return !snapshot.empty
  }

  return { blockUser, reportUser, getBlockedUsers, isBlocked }
}
