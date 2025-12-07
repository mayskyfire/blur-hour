import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export const useStorage = () => {
  const { storage } = useFirebase()
  const { currentUser } = useAuth()

  const uploadChatImage = async (file: File, chatId: string): Promise<string> => {
    if (!currentUser.value) throw new Error('Not authenticated')
    
    const timestamp = Date.now()
    const fileName = `${currentUser.value.uid}_${timestamp}_${file.name}`
    const fileRef = storageRef(storage, `chats/${chatId}/${fileName}`)
    
    await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(fileRef)
    
    return downloadURL
  }

  return { uploadChatImage }
}
