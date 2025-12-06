import { collection, query, where, getDocs } from 'firebase/firestore'
import type { SwipeHistory } from '~/types'

export const useSwipeHistory = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()
  const { getProfileById } = useProfiles()

  const getSwipeHistory = async (venueId: string): Promise<SwipeHistory[]> => {
    if (!currentUser.value) return []
    
    try {
      const q = query(
        collection(db, 'swipes'),
        where('fromUserId', '==', currentUser.value.uid),
        where('venueId', '==', venueId)
      )
      
      const snapshot = await getDocs(q)
      const history: SwipeHistory[] = []
      
      for (const doc of snapshot.docs) {
        const data = doc.data()
        const profile = await getProfileById(data.toUserId)
        
        if (profile) {
          const matchStatus = await checkMatchStatus(data.toUserId, venueId)
          history.push({
            id: doc.id,
            profile,
            direction: data.direction,
            createdAt: data.createdAt,
            matchStatus
          })
        }
      }
      
      return history.sort((a, b) => {
        const aTime = a.createdAt?.getTime ? a.createdAt.getTime() : new Date(a.createdAt).getTime()
        const bTime = b.createdAt?.getTime ? b.createdAt.getTime() : new Date(b.createdAt).getTime()
        return bTime - aTime
      })
    } catch (error) {
      console.error('Error loading swipe history:', error)
      return []
    }
  }

  const checkMatchStatus = async (otherUserId: string, venueId: string): Promise<'matched' | 'pending' | 'not-matched'> => {
    if (!currentUser.value) return 'not-matched'
    
    try {
      // Check if matched
      const userIds = [currentUser.value.uid, otherUserId].sort()
      const matchQuery = query(
        collection(db, 'matches'),
        where('userIds', '==', userIds),
        where('venueId', '==', venueId)
      )
      const matchSnapshot = await getDocs(matchQuery)
      
      if (!matchSnapshot.empty) return 'matched'
      
      // Check if other user swiped right
      const swipeQuery = query(
        collection(db, 'swipes'),
        where('fromUserId', '==', otherUserId),
        where('toUserId', '==', currentUser.value.uid),
        where('venueId', '==', venueId)
      )
      const swipeSnapshot = await getDocs(swipeQuery)
      
      // Check if they swiped right
      const hasSwipedRight = swipeSnapshot.docs.some(doc => doc.data().direction === 'right')
      
      // If no swipe at all = pending, if swiped left = not-matched
      if (swipeSnapshot.empty) return 'pending'
      return hasSwipedRight ? 'pending' : 'not-matched'
    } catch (error) {
      console.error('Error checking match status:', error)
      return 'pending'
    }
  }

  const getTodaySwipeCount = async (venueId: string): Promise<number> => {
    if (!currentUser.value) return 0
    
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const q = query(
        collection(db, 'swipes'),
        where('fromUserId', '==', currentUser.value.uid),
        where('venueId', '==', venueId),
        where('direction', '==', 'right')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.filter(doc => {
        const createdAt = doc.data().createdAt
        const date = createdAt?.getTime ? createdAt : new Date(createdAt)
        return date && date >= today
      }).length
    } catch (error) {
      console.error('Error counting today swipes:', error)
      return 0
    }
  }

  return { getSwipeHistory, getTodaySwipeCount }
}
