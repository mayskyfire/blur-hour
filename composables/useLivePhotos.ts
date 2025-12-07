import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, onSnapshot, orderBy, limit, Timestamp, increment } from 'firebase/firestore'
import type { LivePhoto } from '~/types'

export const useLivePhotos = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()
  const { uploadLivePhoto } = useStorage()

  const captureLivePhoto = async (imageBlob: Blob, venueId: string) => {
    if (!currentUser.value) throw new Error('Not authenticated')

    // Upload to storage
    const photoUrl = await uploadLivePhoto(imageBlob, currentUser.value.uid)

    // Create live photo document
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 6 * 60 * 60 * 1000) // 6 hours

    const livePhotoData = {
      userId: currentUser.value.uid,
      venueId,
      photoUrl,
      capturedAt: Timestamp.fromDate(now),
      expiresAt: Timestamp.fromDate(expiresAt),
      likes: 0,
      likedBy: [],
      viewers: []
    }

    const docRef = await addDoc(collection(db, 'livePhotos'), livePhotoData)

    // Update profile with live photo info
    const profileRef = doc(db, 'profiles', currentUser.value.uid)
    await updateDoc(profileRef, {
      livePhotoId: docRef.id,
      livePhotoUrl: photoUrl,
      livePhotoCapturedAt: Timestamp.fromDate(now)
    })

    return docRef.id
  }

  const getLivePhotosInVenue = async (venueId: string) => {
    const now = Timestamp.now()
    const q = query(
      collection(db, 'livePhotos'),
      where('venueId', '==', venueId),
      where('expiresAt', '>', now),
      orderBy('expiresAt', 'desc'),
      orderBy('capturedAt', 'desc')
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LivePhoto[]
  }

  const subscribeLivePhotos = (venueId: string, callback: (photos: LivePhoto[]) => void) => {
    const now = Timestamp.now()
    const q = query(
      collection(db, 'livePhotos'),
      where('venueId', '==', venueId),
      where('expiresAt', '>', now),
      orderBy('expiresAt', 'desc'),
      orderBy('capturedAt', 'desc'),
      limit(50)
    )

    return onSnapshot(q, (snapshot) => {
      const photos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LivePhoto[]
      callback(photos)
    })
  }

  const likeLivePhoto = async (livePhotoId: string) => {
    if (!currentUser.value) return

    const livePhotoRef = doc(db, 'livePhotos', livePhotoId)
    await updateDoc(livePhotoRef, {
      likes: increment(1),
      likedBy: [...(await (await getDocs(query(collection(db, 'livePhotos'), where('__name__', '==', livePhotoId)))).docs[0]?.data()?.likedBy || []), currentUser.value.uid]
    })
  }

  const viewLivePhoto = async (livePhotoId: string) => {
    if (!currentUser.value) return

    const livePhotoRef = doc(db, 'livePhotos', livePhotoId)
    const snapshot = await getDocs(query(collection(db, 'livePhotos'), where('__name__', '==', livePhotoId)))
    const data = snapshot.docs[0]?.data()
    
    if (data && !data.viewers?.includes(currentUser.value.uid)) {
      await updateDoc(livePhotoRef, {
        viewers: [...(data.viewers || []), currentUser.value.uid]
      })
    }
  }

  const deleteLivePhoto = async (livePhotoId: string) => {
    if (!currentUser.value) return

    await deleteDoc(doc(db, 'livePhotos', livePhotoId))

    // Clear from profile
    const profileRef = doc(db, 'profiles', currentUser.value.uid)
    await updateDoc(profileRef, {
      livePhotoId: null,
      livePhotoUrl: null,
      livePhotoCapturedAt: null
    })
  }

  return {
    captureLivePhoto,
    getLivePhotosInVenue,
    subscribeLivePhotos,
    likeLivePhoto,
    viewLivePhoto,
    deleteLivePhoto
  }
}
