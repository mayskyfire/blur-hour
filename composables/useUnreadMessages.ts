import { collection, query, where, onSnapshot, orderBy, limit, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

export const useUnreadMessages = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  // นับจำนวนข้อความที่ยังไม่ได้อ่านในแชทหนึ่งๆ
  const getUnreadCount = async (chatId: string): Promise<number> => {
    if (!currentUser.value) return 0

    try {
      const chatRef = doc(db, 'chats', chatId)
      const chatDoc = await getDocs(query(collection(db, 'chats')))
      const chatData = chatDoc.docs.find(d => d.id === chatId)?.data()
      
      if (!chatData) return 0

      const lastRead = chatData[`lastRead_${currentUser.value.uid}`]
      
      const messagesQuery = query(
        collection(db, 'chats', chatId, 'messages'),
        where('senderId', '!=', currentUser.value.uid),
        orderBy('senderId'),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(messagesQuery)
      
      if (!lastRead) return snapshot.size

      let unreadCount = 0
      snapshot.forEach(doc => {
        const messageTime = doc.data().createdAt?.toDate()
        const lastReadTime = lastRead?.toDate()
        if (messageTime && lastReadTime && messageTime > lastReadTime) {
          unreadCount++
        }
      })

      return unreadCount
    } catch (error) {
      console.error('Error getting unread count:', error)
      return 0
    }
  }

  // นับจำนวนข้อความที่ยังไม่ได้อ่านทั้งหมด
  const getTotalUnreadCount = (chats: any[]): number => {
    if (!currentUser.value) return 0
    
    let total = 0
    chats.forEach(chat => {
      const unread = chat[`unreadCount_${currentUser.value!.uid}`] || 0
      total += unread
    })
    
    return Math.min(total, 99) // จำกัดไม่เกิน 99
  }

  // อัปเดตเวลาที่อ่านล่าสุด
  const markAsRead = async (chatId: string) => {
    if (!currentUser.value) return

    try {
      const chatRef = doc(db, 'chats', chatId)
      await updateDoc(chatRef, {
        [`lastRead_${currentUser.value.uid}`]: serverTimestamp(),
        [`unreadCount_${currentUser.value.uid}`]: 0
      })
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  // Subscribe to unread count changes
  const subscribeToUnreadCount = (chatId: string, callback: (count: number) => void) => {
    if (!currentUser.value) return () => {}

    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      where('senderId', '!=', currentUser.value.uid),
      orderBy('senderId'),
      orderBy('createdAt', 'desc'),
      limit(100)
    )

    return onSnapshot(messagesQuery, async (snapshot) => {
      const chatRef = doc(db, 'chats', chatId)
      const chatDoc = await getDocs(query(collection(db, 'chats')))
      const chatData = chatDoc.docs.find(d => d.id === chatId)?.data()
      
      if (!chatData) {
        callback(0)
        return
      }

      const lastRead = chatData[`lastRead_${currentUser.value!.uid}`]
      
      if (!lastRead) {
        callback(snapshot.size)
        return
      }

      let unreadCount = 0
      snapshot.forEach(doc => {
        const messageTime = doc.data().createdAt?.toDate()
        const lastReadTime = lastRead?.toDate()
        if (messageTime && lastReadTime && messageTime > lastReadTime) {
          unreadCount++
        }
      })

      callback(unreadCount)
    })
  }

  return {
    getUnreadCount,
    getTotalUnreadCount,
    markAsRead,
    subscribeToUnreadCount
  }
}
