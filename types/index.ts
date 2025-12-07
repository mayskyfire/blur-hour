import type { Timestamp } from 'firebase/firestore'

export interface Profile {
  id: string
  userId: string
  venueId: string
  displayName: string
  ageRange: '18-22' | '23-27' | '28-32' | '33-37' | '38-42' | '43+'
  gender: 'male' | 'female' | 'other'
  zone: string
  mood: 'อยากคุย' | 'ไม่ค่อยอยากคุย' | 'อยากเต้น' | 'อยากร้องคาราโอเกะ'
  personalityTags: string[]
  lookingFor: string
  status: 'single' | 'busy' | 'hidden'
  activityStatus: 'พร้อมคุยเลย' | 'กำลังเต้น' | 'กำลังร้องเพลง' | 'offline'
  photos: string[]
  lineId?: string
  instagram?: string
  tiktok?: string
  x?: string
  lastActive: Timestamp | Date
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

export interface Vibe {
  id: string
  fromUserId: string
  toUserId: string
  venueId: string
  type: '🍻' | '🎵' | '😆'
  message: string
  createdAt: Timestamp | Date
  read: boolean
}

export interface Crush {
  id: string
  fromUserId: string
  toUserId: string
  venueId: string
  createdAt: Timestamp | Date
}

export interface Match {
  id: string
  userIds: string[]
  venueId: string
  type: 'vibe' | 'crush' | 'swipe'
  createdAt: Timestamp | Date
  lastMessageAt?: Timestamp | Date
}

export interface Chat {
  id: string
  matchId: string
  userIds: string[]
  venueId: string
  createdAt: Timestamp | Date
  lastMessageAt?: Timestamp | Date
  [key: `unreadCount_${string}`]: number
}

export interface Message {
  id: string
  senderId: string
  text: string
  createdAt: Timestamp | Date
  expiresAt: Timestamp | Date
}

export interface Zone {
  id: string
  venueId: string
  name: string
  qrCode: string
  capacity?: number
}

export interface Venue {
  id: string
  name: string
  code: string
  location: string
  zones: string[]
  settings?: {
    sessionDuration?: number
    maxDistance?: number
  }
}

export interface Broadcast {
  id: string
  venueId: string
  message: string
  sentAt: Timestamp | Date
  expiresAt?: Timestamp | Date
}

export interface Block {
  id: string
  blockerId: string
  blockedUserId: string
  createdAt: Timestamp | Date
}

export interface Report {
  id: string
  reporterId: string
  reportedUserId: string
  reason: string
  details?: string
  createdAt: Timestamp | Date
  status: 'pending' | 'reviewed' | 'resolved'
}

export interface Mission {
  id: string
  venueId: string
  title: string
  description: string
  reward: string
  isActive: boolean
  createdAt: Timestamp | Date
}

export interface UserMission {
  id: string
  userId: string
  missionId: string
  status: 'in_progress' | 'completed'
  completedAt?: Timestamp | Date
}

export interface SongRequest {
  id: string
  venueId: string
  userId: string
  songTitle: string
  noteForScreen?: string
  fromTable?: string
  toTable?: string
  approved: boolean
  createdAt: Timestamp | Date
}

export const MOODS = [
  { value: 'อยากคุย', emoji: '💬' },
  { value: 'ไม่ค่อยอยากคุย', emoji: '🤐' },
  { value: 'อยากเต้น', emoji: '💃' },
  { value: 'อยากร้องคาราโอเกะ', emoji: '🎤' }
] as const

export const PERSONALITY_TAGS = [
  { value: 'สายฮา', emoji: '😆' },
  { value: 'สายคุยลึก', emoji: '🧠' },
  { value: 'สายแดนซ์', emoji: '🕺' },
  { value: 'สายเกม', emoji: '🎮' },
  { value: 'สายร้องเพลง', emoji: '🎤' }
] as const

export const ACTIVITY_STATUS = [
  { value: 'พร้อมคุยเลย', emoji: '🟢' },
  { value: 'กำลังเต้น', emoji: '🟠' },
  { value: 'กำลังร้องเพลง', emoji: '🔵' },
  { value: 'offline', emoji: '⚫' }
] as const

export const GENDERS = [
  { value: 'male', label: 'ชาย' },
  { value: 'female', label: 'หญิง' },
  { value: 'other', label: 'อื่น ๆ' }
] as const

export const VIBE_TYPES = [
  { type: '🍻', message: 'ขอชนแก้วหน่อยไหม' },
  { type: '🎵', message: 'ชอบเพลงที่คุณขอเมื่อกี้เลย' },
  { type: '😆', message: 'ขอคุยเล่นหน่อย' }
] as const
