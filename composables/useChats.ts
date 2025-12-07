import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, getDocs, type Unsubscribe } from 'firebase/firestore'
import type { Chat, Message } from '~/types'

export const useChats = () => {
  const { db } = useFirebase()
  const { currentUser } = useAuth()

  const subscribeToMessages = (chatId: string, callback: (messages: Message[]) => void): Unsubscribe => {
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'))
    return onSnapshot(q, (snapshot) => {
      const now = new Date()
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)).filter(msg => {
        if (!msg.expiresAt) return true
        const expiresAt = msg.expiresAt instanceof Date ? msg.expiresAt : (msg.expiresAt.toDate ? msg.expiresAt.toDate() : new Date(msg.expiresAt))
        return expiresAt > now
      })
      callback(messages)
    })
  }

  const sendMessage = async (chatId: string, text: string, options?: { imageUrl?: string, replyTo?: Message['replyTo'] }) => {
    if (!currentUser.value) throw new Error('Not authenticated')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 6)
    const messageData: any = {
      senderId: currentUser.value.uid,
      text,
      type: options?.imageUrl ? 'image' : 'text',
      createdAt: serverTimestamp(),
      expiresAt: expiresAt,
      readBy: [currentUser.value.uid],
      status: 'sent'
    }
    if (options?.imageUrl) messageData.imageUrl = options.imageUrl
    if (options?.replyTo) messageData.replyTo = options.replyTo
    await addDoc(collection(db, 'chats', chatId, 'messages'), messageData)
    
    // อัปเดต unread count สำหรับผู้รับ
    const { doc: docRef, getDoc, updateDoc, increment } = await import('firebase/firestore')
    const chatRef = docRef(db, 'chats', chatId)
    const chatDoc = await getDoc(chatRef)
    if (chatDoc.exists()) {
      const chatData = chatDoc.data()
      const otherUserId = chatData.userIds.find((id: string) => id !== currentUser.value!.uid)
      if (otherUserId) {
        await updateDoc(chatRef, {
          [`unreadCount_${otherUserId}`]: increment(1),
          lastMessageAt: serverTimestamp()
        })
      }
    }
  }

  const getUserChats = async (): Promise<Chat[]> => {
    if (!currentUser.value) return []
    const q = query(collection(db, 'chats'), where('userIds', 'array-contains', currentUser.value.uid))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat))
  }

  const markAsRead = async (chatId: string, messageIds: string[]) => {
    if (!currentUser.value) return
    const { doc: docRef, updateDoc, arrayUnion } = await import('firebase/firestore')
    for (const messageId of messageIds) {
      const messageRef = docRef(db, 'chats', chatId, 'messages', messageId)
      await updateDoc(messageRef, {
        readBy: arrayUnion(currentUser.value.uid)
      })
    }
  }

  return { subscribeToMessages, sendMessage, getUserChats, markAsRead }
}
