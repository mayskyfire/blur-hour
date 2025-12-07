import { collection, addDoc, query, where, getDocs, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'
import type { Crush } from '~/types'

export const useCrushes = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const addCrush = async (toUserId: string, venueId: string) => {
    if (!currentUser.value) throw new Error('Not authenticated')

    // Check if already crushed
    const existingQuery = query(
      collection(db, 'crushes'),
      where('fromUserId', '==', currentUser.value.uid),
      where('toUserId', '==', toUserId)
    )
    const existing = await getDocs(existingQuery)
    if (!existing.empty) return { crushId: existing.docs[0].id, matched: false }

    // Add crush
    const crushRef = await addDoc(collection(db, 'crushes'), {
      fromUserId: currentUser.value.uid,
      toUserId,
      venueId,
      createdAt: serverTimestamp()
    })

    // Check for mutual crush
    const mutualQuery = query(
      collection(db, 'crushes'),
      where('fromUserId', '==', toUserId),
      where('toUserId', '==', currentUser.value.uid)
    )
    const mutualSnap = await getDocs(mutualQuery)

    if (!mutualSnap.empty) {
      // Create match
      await addDoc(collection(db, 'matches'), {
        userIds: [currentUser.value.uid, toUserId],
        venueId,
        type: 'crush',
        createdAt: serverTimestamp()
      })

      return { crushId: crushRef.id, matched: true }
    }

    return { crushId: crushRef.id, matched: false }
  }

  const removeCrush = async (crushId: string) => {
    await deleteDoc(doc(db, 'crushes', crushId))
  }

  const getMyCrushes = async (venueId: string): Promise<Crush[]> => {
    if (!currentUser.value) return []

    const q = query(
      collection(db, 'crushes'),
      where('fromUserId', '==', currentUser.value.uid),
      where('venueId', '==', venueId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Crush))
  }

  return { addCrush, removeCrush, getMyCrushes }
}
