import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export const useStorage = () => {
  const { storage } = useFirebase()
  const { currentUser } = useAuth()

  const uploadChatImage = async (file: File, chatId: string): Promise<string> => {
    if (!currentUser.value) throw new Error('Not authenticated')
    
    const timestamp = Date.now()
    const fileName = `${currentUser.value.uid}_${timestamp}.jpg`
    const fileRef = storageRef(storage, `chats/${chatId}/${fileName}`)
    
    await uploadBytes(fileRef, file)
    return await getDownloadURL(fileRef)
  }

  const uploadLivePhoto = async (blob: Blob, userId: string): Promise<string> => {
    const formData = new FormData()
    formData.append('file', blob, 'live.jpg')
    formData.append('userId', userId)
    formData.append('type', 'livePhotos')
    
    const response = await $fetch<{ url: string }>('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    return response.url
  }

  const uploadProfilePhoto = async (file: File, userId: string): Promise<string> => {
    const timestamp = Date.now()
    const fileName = `profile_${timestamp}.jpg`
    const fileRef = storageRef(storage, `profiles/${userId}/${fileName}`)
    
    await uploadBytes(fileRef, file)
    return await getDownloadURL(fileRef)
  }

  const uploadGalleryPhotos = async (files: File[], userId: string): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now()
      const fileName = `gallery_${timestamp}_${index}.jpg`
      const fileRef = storageRef(storage, `profiles/${userId}/gallery/${fileName}`)
      
      await uploadBytes(fileRef, file)
      return await getDownloadURL(fileRef)
    })
    
    return await Promise.all(uploadPromises)
  }

  return { uploadChatImage, uploadLivePhoto, uploadProfilePhoto, uploadGalleryPhotos }
}
