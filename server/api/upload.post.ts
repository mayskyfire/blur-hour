import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, message: 'No file' })

  const file = formData.find(item => item.name === 'file')
  const userId = formData.find(item => item.name === 'userId')?.data.toString()
  const type = formData.find(item => item.name === 'type')?.data.toString() || 'uploads'
  
  if (!file || !userId) throw createError({ statusCode: 400, message: 'Missing data' })

  try {
    // Initialize Firebase Admin if not already initialized
    if (getApps().length === 0) {
      initializeApp({
        storageBucket: 'blur-hour.firebasestorage.com'
      })
    }

    const bucket = getStorage().bucket()
    const timestamp = Date.now()
    const fileName = `${type}/${userId}/${timestamp}.jpg`
    const fileUpload = bucket.file(fileName)

    await fileUpload.save(file.data, {
      metadata: { contentType: file.type || 'image/jpeg' },
      public: true
    })

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
    return { url: publicUrl }
  } catch (error: any) {
    console.error('Upload error:', error)
    // Fallback to base64
    const base64 = `data:${file.type};base64,${file.data.toString('base64')}`
    return { url: base64 }
  }
})
