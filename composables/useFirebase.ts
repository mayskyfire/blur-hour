import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

let firebaseApp: FirebaseApp
let auth: Auth
let db: Firestore

export const useFirebase = () => {
  if (!firebaseApp) {
    const config = useRuntimeConfig()
    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId
    }

    console.log('Firebase Config:', { ...firebaseConfig, apiKey: firebaseConfig.apiKey?.substring(0, 10) + '...' })

    firebaseApp = initializeApp(firebaseConfig)
    auth = getAuth(firebaseApp)
    db = getFirestore(firebaseApp)
  }

  return { app: firebaseApp, auth, db }
}
