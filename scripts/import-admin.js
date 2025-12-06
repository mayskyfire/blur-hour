// Import using Firebase Admin SDK
// 1. Download service account key from Firebase Console
// 2. Save as serviceAccountKey.json
// 3. Run: node scripts/import-admin.js

import admin from 'firebase-admin'
import { readFileSync } from 'fs'

// Initialize Admin SDK
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

// Read profiles data
const data = JSON.parse(readFileSync('./scripts/profiles-data.json', 'utf8'))

async function importProfiles() {
  console.log('Starting import with Admin SDK...')
  
  const batch = db.batch()
  
  for (const [docId, profile] of Object.entries(data.profiles)) {
    const docRef = db.collection('profiles').doc(docId)
    batch.set(docRef, profile)
    console.log(`📝 Queued: ${profile.displayName}`)
  }
  
  try {
    await batch.commit()
    console.log('🎉 All profiles imported successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

importProfiles()
