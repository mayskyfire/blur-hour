import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

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

  const uploadLivePhoto = async (blob: Blob, userId: string): Promise<string> => {
    const timestamp = Date.now()
    const fileName = `live_${userId}_${timestamp}.jpg`
    const fileRef = storageRef(storage, `livePhotos/${userId}/${fileName}`)
    
    await uploadBytes(fileRef, blob)
    const downloadURL = await getDownloadURL(fileRef)
    
    return downloadURL
  }

  const uploadProfilePhoto = async (file: File, userId: string): Promise<string> => {
    const timestamp = Date.now()
    const fileName = `profile_${timestamp}.jpg`
    const fileRef = storageRef(storage, `profiles/${userId}/${fileName}`)
    
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileRef, file)
      
      uploadTask.on('state_changed',
        () => {},
        (error) => reject(error),
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(downloadURL)
          } catch (error) {
            reject(error)
          }
        }
      )
    })
  }

  const uploadGalleryPhotos = async (files: File[], userId: string): Promise<string[]> => {
    const uploadPromises = files.map((file, index) => {
      return new Promise<string>((resolve, reject) => {
        const timestamp = Date.now()
        const fileName = `gallery_${timestamp}_${index}.jpg`
        const fileRef = storageRef(storage, `profiles/${userId}/gallery/${fileName}`)
        const uploadTask = uploadBytesResumable(fileRef, file)
        
        uploadTask.on('state_changed',
          () => {},
          (error) => reject(error),
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              resolve(downloadURL)
            } catch (error) {
              reject(error)
            }
          }
        )
      })
    })
    
    return await Promise.all(uploadPromises)
  }

  return { uploadChatImage, uploadLivePhoto, uploadProfilePhoto, uploadGalleryPhotos }
}
