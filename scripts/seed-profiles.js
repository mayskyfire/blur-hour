// Script to seed sample profiles to Firebase
// Run with: node scripts/seed-profiles.js

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore'

// Firebase config (replace with your config)
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

// Sample profiles data
const sampleProfiles = [
  {
    userId: 'user1',
    displayName: 'อิงค์',
    age: 24,
    gender: 'female',
    venueId: 'venue1',
    zone: 'Zone A',
    mood: 'ชิลล์',
    tags: ['เพลง', 'เต้น'],
    lookingFor: 'คุยกัน',
    status: 'single',
    activityStatus: 'online'
  },
  {
    userId: 'user2',
    displayName: 'ต้น',
    age: 26,
    gender: 'male',
    venueId: 'venue1',
    zone: 'Bar',
    mood: 'สนุก',
    tags: ['ดื่ม', 'คุย'],
    lookingFor: 'หาเพื่อน',
    status: 'single',
    activityStatus: 'online'
  },
  {
    userId: 'user3',
    displayName: 'มิ้น',
    age: 22,
    gender: 'female',
    venueId: 'venue1',
    zone: 'Dance Floor',
    mood: 'เต้น',
    tags: ['เต้น', 'เพลง'],
    lookingFor: 'เต้นด้วยกัน',
    status: 'single',
    activityStatus: 'online'
  },
  {
    userId: 'user4',
    displayName: 'เจ',
    age: 28,
    gender: 'male',
    venueId: 'venue1',
    zone: 'VIP',
    mood: 'พรีเมี่ยม',
    tags: ['VIP', 'ดื่ม'],
    lookingFor: 'คุยกัน',
    status: 'single',
    activityStatus: 'online'
  },
  {
    userId: 'user5',
    displayName: 'นิ้ง',
    age: 25,
    gender: 'female',
    venueId: 'venue1',
    zone: 'Outdoor',
    mood: 'ชิลล์',
    tags: ['ชิลล์', 'คุย'],
    lookingFor: 'หาเพื่อน',
    status: 'single',
    activityStatus: 'online'
  },
  {
    userId: 'user6',
    displayName: 'โอ',
    age: 27,
    gender: 'male',
    venueId: 'venue1',
    zone: 'Zone B',
    mood: 'สบาย',
    tags: ['คุย', 'ดื่ม'],
    lookingFor: 'คุยกัน',
    status: 'single',
    activityStatus: 'online'
  },
  {
    userId: 'user7',
    displayName: 'เฟิร์น',
    age: 23,
    gender: 'female',
    venueId: 'venue1',
    zone: 'Dance Floor',
    mood: 'เต้น',
    tags: ['เต้น', 'สนุก'],
    lookingFor: 'เต้นด้วยกัน',
    status: 'single',
    activityStatus: 'online'
  },
  {
    userId: 'user8',
    displayName: 'บิ๊ก',
    age: 29,
    gender: 'male',
    venueId: 'venue1',
    zone: 'Bar',
    mood: 'ดื่ม',
    tags: ['ดื่ม', 'คุย'],
    lookingFor: 'หาเพื่อน',
    status: 'single',
    activityStatus: 'online'
  }
]

async function seedProfiles() {
  console.log('Starting to seed profiles...')
  
  try {
    for (const profile of sampleProfiles) {
      const now = Timestamp.now()
      const profileData = {
        ...profile,
        createdAt: now,
        updatedAt: now,
        lastActiveAt: now
      }
      
      await setDoc(doc(db, 'profiles', profile.userId), profileData)
      console.log(`✅ Added profile: ${profile.displayName}`)
    }
    
    console.log('🎉 All profiles seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding profiles:', error)
  }
}

seedProfiles()