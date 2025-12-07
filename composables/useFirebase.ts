import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

let firebaseApp: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let initialized = false

export const useFirebase = () => {
  // Only initialize on client side
  if (!process.client) {
    return { app: null as any, auth: null as any, db: null as any, storage: null as any }
  }

  if (!initialized) {
    try {
      const firebaseConfig = {
        apiKey: 'AIzaSyCsD29ycdQ22Vs1k5MEuyY850wjrLvTRbw',
        authDomain: 'blur-hour.firebaseapp.com',
        projectId: 'blur-hour',
        storageBucket: 'blur-hour.firebasestorage.com',
        messagingSenderId: '812200063590',
        appId: '1:812200063590:web:16e67cb708fd020d9ef3a7'
      }

      firebaseApp = initializeApp(firebaseConfig)
      auth = getAuth(firebaseApp)
      db = getFirestore(firebaseApp)
      storage = getStorage(firebaseApp)
      
      // Enable offline persistence
      if (process.client) {
        enableIndexedDbPersistence(db).catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('Persistence failed: Multiple tabs open')
          } else if (err.code === 'unimplemented') {
            console.warn('Persistence not available')
          }
        })
      }
      
      initialized = true
    } catch (error) {
      console.error('Firebase initialization error:', error)
      throw error
    }
  }

  return { app: firebaseApp, auth, db, storage }
}
