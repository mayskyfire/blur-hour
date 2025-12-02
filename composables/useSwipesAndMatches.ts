import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import type { Profile, Swipe, Match } from '~/types'

export const useSwipesAndMatches = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const handleSwipe = async (profile: Profile, direction: 'right' | 'left') => {
    if (!currentUser.value) throw new Error('Not authenticated')
    const swipeData: Omit<Swipe, 'id'> = {
      fromUserId: currentUser.value.uid,
      toUserId: profile.userId,
      venueId: profile.venueId,
      direction,
      createdAt: serverTimestamp() as any
    }
    await addDoc(collection(db, 'swipes'), swipeData)

    if (direction === 'right') {
      const matchExists = await checkForMatch(profile.userId, profile.venueId)
      if (matchExists) {
        await createMatch(profile.userId, profile.venueId)
        return { matched: true }
      }
    }
    return { matched: false }
  }

  const checkForMatch = async (otherUserId: string, venueId: string): Promise<boolean> => {
    if (!currentUser.value) return false
    const q = query(collection(db, 'swipes'), where('fromUserId', '==', otherUserId), where('toUserId', '==', currentUser.value.uid), where('direction', '==', 'right'))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  }

  const createMatch = async (otherUserId: string, venueId: string) => {
    if (!currentUser.value) return
    const userIds = [currentUser.value.uid, otherUserId].sort()
    const matchData: Omit<Match, 'id'> = { userIds, venueId, createdAt: serverTimestamp() as any }
    const matchRef = await addDoc(collection(db, 'matches'), matchData)
    await addDoc(collection(db, 'chats'), { matchId: matchRef.id, userIds, venueId, createdAt: serverTimestamp() })
    return matchRef.id
  }

  const getSwipedProfileIds = async (venueId: string): Promise<string[]> => {
    if (!currentUser.value) return []
    const q = query(collection(db, 'swipes'), where('fromUserId', '==', currentUser.value.uid), where('venueId', '==', venueId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data().toUserId)
  }

  return { handleSwipe, getSwipedProfileIds }
}
