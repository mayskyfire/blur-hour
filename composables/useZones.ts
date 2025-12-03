import { collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore'
import type { Zone } from '~/types'

export const useZones = () => {
  const { db } = useFirebase()

  const getZoneByCode = async (code: string): Promise<Zone | null> => {
    const q = query(collection(db, 'zones'), where('code', '==', code))
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    
    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Zone
  }

  const getVenueZones = async (venueId: string): Promise<Zone[]> => {
    const q = query(collection(db, 'zones'), where('venueId', '==', venueId))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Zone))
  }

  const detectZoneFromUrl = (): string | null => {
    if (typeof window === 'undefined') return null
    
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('zone') || urlParams.get('table')
  }

  return {
    getZoneByCode,
    getVenueZones,
    detectZoneFromUrl
  }
}