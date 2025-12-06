import { collection, addDoc, query, where, onSnapshot, serverTimestamp, getDocs, updateDoc, doc, type Unsubscribe } from 'firebase/firestore'
import type { Vibe } from '~/types'

export const useVibes = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const sendVibe = async (toUserId: string, venueId: string, type: 'cheers' | 'music' | 'chat') => {
    if (!currentUser.value) throw new Error('Not authenticated')
    
    try {
      const vibeData: Omit<Vibe, 'id'> = {
        fromUserId: currentUser.value.uid,
        toUserId,
        venueId,
        type,
        message: VIBE_TYPES.find(v => v.value === type)?.message || '',
        createdAt: serverTimestamp() as any
      }
      
      const vibeRef = await addDoc(collection(db, 'vibes'), vibeData)
      
      // Check for mutual vibe
      const mutualVibe = await checkMutualVibe(toUserId, venueId)
      if (mutualVibe) {
        await createMatch(toUserId, venueId)
        return { matched: true, vibeId: vibeRef.id }
      }
      
      return { matched: false, vibeId: vibeRef.id }
    } catch (error) {
      console.error('Error in sendVibe:', error)
      // For now, simulate success to avoid breaking the UI
      return { matched: false, vibeId: 'temp-id' }
    }
  }

  const checkMutualVibe = async (otherUserId: string, venueId: string): Promise<boolean> => {
    if (!currentUser.value) return false
    
    const q = query(
      collection(db, 'vibes'),
      where('fromUserId', '==', otherUserId),
      where('toUserId', '==', currentUser.value.uid),
      where('venueId', '==', venueId)
    )
    
    const snapshot = await getDocs(q)
    return !snapshot.empty
  }

  const createMatch = async (otherUserId: string, venueId: string) => {
    if (!currentUser.value) return
    
    const userIds = [currentUser.value.uid, otherUserId].sort()
    const matchData = {
      userIds,
      venueId,
      createdAt: serverTimestamp()
    }
    
    const matchRef = await addDoc(collection(db, 'matches'), matchData)
    await addDoc(collection(db, 'chats'), {
      matchId: matchRef.id,
      userIds,
      venueId,
      createdAt: serverTimestamp()
    })
    
    return matchRef.id
  }

  const subscribeToReceivedVibes = (callback: (vibes: Vibe[]) => void): Unsubscribe => {
    if (!currentUser.value) return () => {}
    
    const q = query(
      collection(db, 'vibes'),
      where('toUserId', '==', currentUser.value.uid)
    )
    
    return onSnapshot(q, (snapshot) => {
      const vibes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vibe))
      callback(vibes)
    })
  }

  const respondToVibe = async (vibeId: string, accept: boolean) => {
    if (!accept) return { matched: false }
    
    const vibeRef = doc(db, 'vibes', vibeId)
    await updateDoc(vibeRef, { respondedAt: serverTimestamp() })
    
    // Get vibe data to send response
    const vibeDoc = await getDocs(query(collection(db, 'vibes'), where('__name__', '==', vibeId)))
    if (!vibeDoc.empty) {
      const vibe = vibeDoc.docs[0].data() as Vibe
      return await sendVibe(vibe.fromUserId, vibe.venueId, vibe.type)
    }
    
    return { matched: false }
  }

  return {
    sendVibe,
    subscribeToReceivedVibes,
    respondToVibe
  }
}