import { collection, doc, setDoc, getDoc, query, where, onSnapshot, serverTimestamp, updateDoc, type Unsubscribe } from 'firebase/firestore'
import type { Profile } from '~/types'

export const useProfiles = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()
  const { getBlockedUsers } = useSafety()

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
    const q = query(collection(db, 'profiles'), where('venueId', '==', venueId), where('status', '==', 'single'))
    return onSnapshot(q, async (snapshot) => {
      let profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile))
        .filter(p => p.userId !== currentUser.value?.uid)
      
      // Filter out blocked users
      const blockedUserIds = await getBlockedUsers(venueId)
      profiles = profiles.filter(p => !blockedUserIds.includes(p.userId))
      
      callback(profiles)
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

  return { 
    createOrUpdateProfile, 
    getCurrentProfile, 
    subscribeVenueProfiles,
    updateActivityStatus,
    getProfilesByZone
  }
}
