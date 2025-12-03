import type { Timestamp } from 'firebase/firestore'

export interface Venue {
  id: string
  name: string
  code: string
  location: string
  settings?: { sessionDuration?: number; maxDistance?: number }
}

export type AgeRange = '18-22' | '23-27' | '28-32' | '33-37' | '38-42' | '43+'
export type PersonalityTag = 'สายฮา' | 'สายคุยลึก' | 'สายแดนซ์' | 'สายเกม' | 'สายร้องเพลง'
export type Mood = 'อยากคุย' | 'ไม่ค่อยอยากคุย' | 'อยากเต้น' | 'อยากร้องคาราโอเกะ'
export type ActivityStatus = 'พร้อมคุยเลย' | 'กำลังเต้น' | 'กำลังร้องเพลง' | 'ออฟไลน์'
export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'

export interface Profile {
  id: string
  userId: string
  venueId: string
  displayName: string
  ageRange: AgeRange
  gender: Gender
  zone: string
  mood: Mood
  personalityTags: PersonalityTag[]
  status: 'single' | 'busy' | 'hidden'
  activityStatus: ActivityStatus
  lastActiveAt: Timestamp | Date
  photos: string[]
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
  type?: 'text' | 'bar-request' | 'table-invite' | 'icebreaker'
  createdAt: Timestamp | Date
  expiresAt: Timestamp | Date
}

export interface Vibe {
  id: string
  fromUserId: string
  toUserId: string
  venueId: string
  type: 'cheers' | 'music' | 'chat'
  message: string
  createdAt: Timestamp | Date
  respondedAt?: Timestamp | Date
}

export interface Crush {
  id: string
  fromUserId: string
  toUserId: string
  venueId: string
  createdAt: Timestamp | Date
}

export interface Zone {
  id: string
  venueId: string
  name: string
  code: string
  capacity: number
  type: 'indoor' | 'outdoor' | 'bar' | 'vip'
}

export interface Report {
  id: string
  reporterId: string
  reportedUserId: string
  venueId: string
  reason: string
  description?: string
  status: 'pending' | 'reviewed' | 'resolved'
  createdAt: Timestamp | Date
}

export interface Block {
  id: string
  blockerId: string
  blockedUserId: string
  venueId: string
  createdAt: Timestamp | Date
}
