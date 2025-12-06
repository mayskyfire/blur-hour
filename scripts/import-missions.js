// Import missions and rewards to Firebase
// Run: node scripts/import-missions.js

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'
import { readFileSync } from 'fs'

// Replace with your actual Firebase config
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

// Read data
const data = JSON.parse(readFileSync('./scripts/import-missions.json', 'utf8'))

async function importData() {
  console.log('Starting import...')
  
  try {
    // Import missions
    console.log('\n📋 Importing missions...')
    for (let i = 0; i < data.missions.length; i++) {
      const mission = data.missions[i]
      const docId = `mission${i + 1}`
      await setDoc(doc(db, 'missions', docId), mission)
      console.log(`✅ Imported: ${mission.title}`)
    }
    
    // Import rewards
    console.log('\n🎁 Importing rewards...')
    for (let i = 0; i < data.rewards.length; i++) {
      const reward = data.rewards[i]
      const docId = `reward${i + 1}`
      await setDoc(doc(db, 'rewards', docId), reward)
      console.log(`✅ Imported: ${reward.title}`)
    }
    
    console.log('\n🎉 Import completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

importData()
