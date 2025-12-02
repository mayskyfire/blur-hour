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
        const expiresAt = msg.expiresAt instanceof Date ? msg.expiresAt : msg.expiresAt.toDate()
        return expiresAt > now
      })
      callback(messages)
    })
  }

  const sendMessage = async (chatId: string, text: string) => {
    if (!currentUser.value) throw new Error('Not authenticated')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 6)
    const messageData: Omit<Message, 'id'> = {
      senderId: currentUser.value.uid,
      text,
      createdAt: serverTimestamp() as any,
      expiresAt: expiresAt as any
    }
    await addDoc(collection(db, 'chats', chatId, 'messages'), messageData)
  }

  const getUserChats = async (): Promise<Chat[]> => {
    if (!currentUser.value) return []
    const q = query(collection(db, 'chats'), where('userIds', 'array-contains', currentUser.value.uid))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat))
  }

  return { subscribeToMessages, sendMessage, getUserChats }
}
