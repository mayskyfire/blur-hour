import { collection, doc, setDoc, getDoc, query, where, onSnapshot, serverTimestamp, updateDoc, getDocs, type Unsubscribe } from 'firebase/firestore'
import type { Profile } from '~/types'

export const useProfiles = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()
  
  const getBlockedUsers = async (venueId: string): Promise<string[]> => {
    if (!currentUser.value) return []
    
    try {
      const q = query(
        collection(db, 'blocks'),
        where('blockerId', '==', currentUser.value.uid),
        where('venueId', '==', venueId)
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => doc.data().blockedUserId)
    } catch (error) {
      console.warn('Error fetching blocked users:', error)
      return []
    }
  }

  const createOrUpdateProfile = async (profileData: Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'lastActiveAt'>) => {
    if (!currentUser.value) throw new Error('Not authenticated')
    const profileRef = doc(db, 'profiles', currentUser.value.uid)
    const profileDoc = await getDoc(profileRef)
    const data = {
      ...profileData,
      userId: currentUser.value.uid,
      lastActiveAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...(profileDoc.exists() ? {} : { createdAt: serverTimestamp() })
    }
    await setDoc(profileRef, data, { merge: true })
    return profileRef.id
  }

  const updateActivityStatus = async (activityStatus: Profile['activityStatus']) => {
    if (!currentUser.value) return
    const profileRef = doc(db, 'profiles', currentUser.value.uid)
    await updateDoc(profileRef, {
      activityStatus,
      lastActiveAt: serverTimestamp()
    })
  }

  const getCurrentProfile = async (): Promise<Profile | null> => {
    if (!currentUser.value) return null
    const profileRef = doc(db, 'profiles', currentUser.value.uid)
    const profileDoc = await getDoc(profileRef)
    if (!profileDoc.exists()) return null
    return { id: profileDoc.id, ...profileDoc.data() } as Profile
  }

  const subscribeVenueProfiles = (venueId: string, callback: (profiles: Profile[]) => void): Unsubscribe => {
    if (!venueId) {
      console.warn('No venueId provided')
      return () => {}
    }
    
    const q = query(collection(db, 'profiles'), where('venueId', '==', venueId))
    return onSnapshot(q, async (snapshot) => {
      try {
        let profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile))
        
        // Only filter out current user if authenticated
        if (currentUser.value) {
          profiles = profiles.filter(p => p.userId !== currentUser.value.uid)
        }
        
        // Filter out blocked users only if authenticated
        if (currentUser.value) {
          const blockedUserIds = await getBlockedUsers(venueId)
          profiles = profiles.filter(p => !blockedUserIds.includes(p.userId))
        }
        
        callback(profiles)
      } catch (error) {
        console.error('Error processing profiles:', error)
        callback([])
      }
    }, (error) => {
      console.error('Snapshot error:', error)
      callback([])
    })
  }

  const getProfilesByZone = async (venueId: string, zone: string): Promise<Profile[]> => {
    const q = query(
      collection(db, 'profiles'),
      where('venueId', '==', venueId),
      where('zone', '==', zone),
      where('status', '==', 'single')
    )
    const snapshot = await getDocs(q)
    let profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile))
      .filter(p => p.userId !== currentUser.value?.uid)
    
    // Filter out blocked users
    const blockedUserIds = await getBlockedUsers(venueId)
    profiles = profiles.filter(p => !blockedUserIds.includes(p.userId))
    
    return profiles
  }

  const getProfileById = async (userId: string): Promise<Profile | null> => {
    try {
      const profileRef = doc(db, 'profiles', userId)
      const profileDoc = await getDoc(profileRef)
      if (!profileDoc.exists()) return null
      return { id: profileDoc.id, ...profileDoc.data() } as Profile
    } catch (error) {
      console.error('Error getting profile:', error)
      return null
    }
  }

  return { 
    createOrUpdateProfile, 
    getCurrentProfile, 
    subscribeVenueProfiles,
    updateActivityStatus,
    getProfilesByZone,
    getProfileById
  }
}
