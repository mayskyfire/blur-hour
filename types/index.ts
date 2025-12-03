import type { Timestamp } from 'firebase/firestore'

export interface Venue {
  id: string
  name: string
  code: string
  location: string
  settings?: { sessionDuration?: number; maxDistance?: number }
}

export interface Profile {
  id: string
  userId: string
  venueId: string
  displayName: string
  age: number
  gender: 'male' | 'female' | 'other'
  zone: string
  mood: string
  tags: string[]
  lookingFor: string
  status: 'single' | 'busy' | 'hidden'
  photos: string[]
  lineId?: string
  instagram?: string
  tiktok?: string
  x?: string
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

export interface Swipe {
  id: string
  fromUserId: string
  toUserId: string
  venueId: string
  direction: 'right' | 'left'
  createdAt: Timestamp | Date
}

export interface Match {
  id: string
  userIds: string[]
  venueId: string
  createdAt: Timestamp | Date
  lastMessageAt?: Timestamp | Date
}

export interface Chat {
  id: string
  matchId: string
  userIds: string[]
  venueId: string
  createdAt: Timestamp | Date
}

export interface Message {
  id: string
  senderId: string
  text: string
  createdAt: Timestamp | Date
  expiresAt: Timestamp | Date
}
