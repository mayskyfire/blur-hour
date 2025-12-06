import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import type { Profile, Swipe, Match } from '~/types'

export const useSwipesAndMatches = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const handleSwipe = async (profile: Profile, direction: 'right' | 'left') => {
    if (!currentUser.value) {
      console.log('No current user, simulating swipe')
      return { matched: false }
    }
    
    try {
      console.log('Processing swipe:', direction, 'for profile:', profile.displayName)
      
      const swipeData: Omit<Swipe, 'id'> = {
        fromUserId: currentUser.value.uid,
        toUserId: profile.userId,
        venueId: profile.venueId,
        direction,
        createdAt: new Date()
      }
      await addDoc(collection(db, 'swipes'), swipeData)
      console.log('Swipe saved to Firebase')

      if (direction === 'right') {
        console.log('Checking for match...')
        const matchExists = await checkForMatch(profile.userId, profile.venueId)
        console.log('Match exists:', matchExists)
        
        if (matchExists) {
          console.log('Creating match...')
          await createMatch(profile.userId, profile.venueId)
          console.log('Match created!')
          return { matched: true }
        }
      }
      return { matched: false }
    } catch (error) {
      console.error('Error in handleSwipe:', error)
      // Return success to prevent UI issues
      return { matched: false }
    }
  }

  const checkForMatch = async (otherUserId: string, venueId: string): Promise<boolean> => {
    if (!currentUser.value) return false
    
    try {
      console.log('Checking match for:', { otherUserId, currentUserId: currentUser.value.uid, venueId })
      
      // Check for mutual swipe right only
      const swipeQuery = query(collection(db, 'swipes'), where('fromUserId', '==', otherUserId), where('toUserId', '==', currentUser.value.uid), where('direction', '==', 'right'))
      const swipeSnapshot = await getDocs(swipeQuery)
      console.log('Swipe check result:', !swipeSnapshot.empty)
      
      return !swipeSnapshot.empty
    } catch (error) {
      console.error('Error in checkForMatch:', error)
      return false
    }
  }

  const createMatch = async (otherUserId: string, venueId: string) => {
    if (!currentUser.value) return
    const userIds = [currentUser.value.uid, otherUserId].sort()
    const matchData: Omit<Match, 'id'> = { userIds, venueId, createdAt: new Date() }
    const matchRef = await addDoc(collection(db, 'matches'), matchData)
    await addDoc(collection(db, 'chats'), { matchId: matchRef.id, userIds, venueId, createdAt: new Date() })
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
