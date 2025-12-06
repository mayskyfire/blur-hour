import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore'

export const useSongRequests = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const submitSongRequest = async (songName: string, artist: string, message: string, venueId: string) => {
    if (!currentUser.value) throw new Error('Not authenticated')
    
    try {
      await addDoc(collection(db, 'song_requests'), {
        userId: currentUser.value.uid,
        venueId,
        songName,
        artist,
        message: message || 'ขอเพลงนี้หน่อย 🎵',
        status: 'pending',
        createdAt: new Date()
      })
    } catch (error) {
      console.error('Error submitting song request:', error)
      throw error
    }
  }

  const getMyRequests = async (venueId: string) => {
    if (!currentUser.value) return []
    
    try {
      const q = query(
        collection(db, 'song_requests'),
        where('userId', '==', currentUser.value.uid),
        where('venueId', '==', venueId),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error getting requests:', error)
      return []
    }
  }

  const getPopularSongs = async (venueId: string) => {
    try {
      const q = query(
        collection(db, 'song_requests'),
        where('venueId', '==', venueId),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc'),
        limit(5)
      )
      const snapshot = await getDocs(q)
      
      // Count song requests
      const songCounts: any = {}
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        const key = `${data.songName}|${data.artist}`
        songCounts[key] = (songCounts[key] || 0) + 1
      })
      
      return Object.entries(songCounts)
        .map(([key, count]) => {
          const [name, artist] = key.split('|')
          return { name, artist, requests: count }
        })
        .sort((a: any, b: any) => b.requests - a.requests)
        .slice(0, 5)
    } catch (error) {
      console.error('Error getting popular songs:', error)
      return []
    }
  }

  return { submitSongRequest, getMyRequests, getPopularSongs }
}
