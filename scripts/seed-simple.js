// Simple seed script with hardcoded config
// Replace with your actual Firebase config

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

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

// Simple test profile
const testProfile = {
  userId: 'test1',
  displayName: 'Test User',
  age: 25,
  gender: 'male',
  venueId: 'venue1',
  zone: 'Bar',
  mood: 'happy',
  tags: ['music', 'dance'],
  lookingFor: 'friends',
  status: 'single',
  activityStatus: 'online',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastActiveAt: new Date()
}

async function seedTest() {
  console.log('Testing Firebase connection...')
  
  try {
    await setDoc(doc(db, 'profiles', testProfile.userId), testProfile)
    console.log('✅ Test profile added successfully!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  }
}

seedTest()