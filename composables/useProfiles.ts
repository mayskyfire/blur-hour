import { collection, doc, setDoc, getDoc, query, where, onSnapshot, serverTimestamp, type Unsubscribe } from 'firebase/firestore'
import type { Profile } from '~/types'

export const useProfiles = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const createOrUpdateProfile = async (profileData: Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser.value) throw new Error('Not authenticated')
    const profileRef = doc(db, 'profiles', currentUser.value.uid)
    const profileDoc = await getDoc(profileRef)
    const data = {
      ...profileData,
      userId: currentUser.value.uid,
      updatedAt: serverTimestamp(),
      ...(profileDoc.exists() ? {} : { createdAt: serverTimestamp() })
    }
    await setDoc(profileRef, data, { merge: true })
    return profileRef.id
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
    return onSnapshot(q, (snapshot) => {
      const profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile)).filter(p => p.userId !== currentUser.value?.uid)
      callback(profiles)
    })
  }

  return { createOrUpdateProfile, getCurrentProfile, subscribeVenueProfiles }
}
