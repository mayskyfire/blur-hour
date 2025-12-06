// Import missions and rewards using Firebase Admin SDK
// 1. Download service account key from Firebase Console
//    Project Settings > Service Accounts > Generate new private key
// 2. Save as serviceAccountKey.json in project root
// 3. Run: node scripts/import-missions-admin.js

import admin from 'firebase-admin'
import { readFileSync } from 'fs'

// Initialize Admin SDK
try {
  const serviceAccount = JSON.parse(
    readFileSync('./serviceAccountKey.json', 'utf8')
  )

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
} catch (error) {
  console.error('❌ Error: serviceAccountKey.json not found')
  console.log('\nPlease download service account key from Firebase Console:')
  console.log('1. Go to Project Settings > Service Accounts')
  console.log('2. Click "Generate new private key"')
  console.log('3. Save as serviceAccountKey.json in project root\n')
  process.exit(1)
}

const db = admin.firestore()

// Read data
const data = JSON.parse(readFileSync('./scripts/import-missions.json', 'utf8'))

async function importData() {
  console.log('Starting import with Admin SDK...')
  
  try {
    // Import missions
    console.log('\n📋 Importing missions...')
    for (let i = 0; i < data.missions.length; i++) {
      const mission = data.missions[i]
      const docId = `mission${i + 1}`
      await db.collection('missions').doc(docId).set(mission)
      console.log(`✅ Imported: ${mission.title}`)
    }
    
    // Import rewards
    console.log('\n🎁 Importing rewards...')
    for (let i = 0; i < data.rewards.length; i++) {
      const reward = data.rewards[i]
      const docId = `reward${i + 1}`
      await db.collection('rewards').doc(docId).set(reward)
      console.log(`✅ Imported: ${reward.title}`)
    }
    
    // Create sample user document structure
    console.log('\n👤 Creating sample user document...')
    const sampleUserId = 'sample_user'
    const sampleUser = {
      points: 0,
      activeMissions: [],
      completedMissions: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
    await db.collection('users').doc(sampleUserId).set(sampleUser)
    console.log(`✅ Created sample user document`)
    
    console.log('\n🎉 All data imported successfully!')
    console.log('\nCollections created:')
    console.log('- missions (${data.missions.length} documents)')
    console.log('- rewards (${data.rewards.length} documents)')
    console.log('- users (1 sample document)')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

importData()
