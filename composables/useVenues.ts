import { collection, query, where, getDocs } from 'firebase/firestore'
import type { Venue } from '~/types'

export const useVenues = () => {
  const { db } = useFirebase()

  const getVenueByCode = async (code: string): Promise<Venue | null> => {
    const q = query(collection(db, 'venues'), where('code', '==', code))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Venue
  }

  const getAllVenues = async (): Promise<Venue[]> => {
    const snapshot = await getDocs(collection(db, 'venues'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Venue))
  }

  return { getVenueByCode, getAllVenues }
}
