// Import profiles to Firebase
// Run: node scripts/import-profiles.js

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { readFileSync } from 'fs'

// Load Firebase config from .env or hardcode here
const firebaseConfig = {
  apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Read profiles data
const data = JSON.parse(readFileSync('./scripts/profiles-data.json', 'utf8'))

async function importProfiles() {
  console.log('Starting import...')
  
  try {
    for (const [docId, profile] of Object.entries(data.profiles)) {
      await setDoc(doc(db, 'profiles', docId), profile)
      console.log(`✅ Imported: ${profile.displayName}`)
    }
    console.log('🎉 Import completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

importProfiles()
