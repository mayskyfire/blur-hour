import { collection, addDoc, query, where, onSnapshot, serverTimestamp, updateDoc, doc, getDocs, type Unsubscribe } from 'firebase/firestore'
import type { Vibe } from '~/types'

export const useVibes = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const sendVibe = async (toUserId: string, venueId: string, type: '🍻' | '🎵' | '😆') => {
    if (!currentUser.value) throw new Error('Not authenticated')

    const vibeMessages = {
      '🍻': 'ขอชนแก้วหน่อยไหม',
      '🎵': 'ชอบเพลงที่คุณขอเมื่อกี้เลย',
      '😆': 'ขอคุยเล่นหน่อย'
    }

    const vibeData = {
      fromUserId: currentUser.value.uid,
      toUserId,
      venueId,
      type,
      message: vibeMessages[type],
      read: false,
      createdAt: serverTimestamp()
    }

    const vibeRef = await addDoc(collection(db, 'vibes'), vibeData)

    // Check for mutual vibe
    const mutualQuery = query(
      collection(db, 'vibes'),
      where('fromUserId', '==', toUserId),
      where('toUserId', '==', currentUser.value.uid),
      where('venueId', '==', venueId)
    )
    const mutualSnap = await getDocs(mutualQuery)

    if (!mutualSnap.empty) {
      // Create match
      await addDoc(collection(db, 'matches'), {
        userIds: [currentUser.value.uid, toUserId],
        venueId,
        type: 'vibe',
        createdAt: serverTimestamp()
      })

      return { vibeId: vibeRef.id, matched: true }
    }

    return { vibeId: vibeRef.id, matched: false }
  }

  const subscribeReceivedVibes = (callback: (vibes: Vibe[]) => void): Unsubscribe => {
    if (!currentUser.value) throw new Error('Not authenticated')

    const q = query(
      collection(db, 'vibes'),
      where('toUserId', '==', currentUser.value.uid),
      where('read', '==', false)
    )

    return onSnapshot(q, (snapshot) => {
      const vibes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vibe))
      callback(vibes)
    })
  }

  const markVibeAsRead = async (vibeId: string) => {
    await updateDoc(doc(db, 'vibes', vibeId), { read: true })
  }

  return { sendVibe, subscribeReceivedVibes, markVibeAsRead }
}
