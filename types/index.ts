export interface Profile {
  id: string
  userId: string
  displayName: string
  ageRange: string
  gender: string
  mood: string
  zone: string
  activityStatus: string
  personalityTags: string[]
  photos: string[]
  lineId?: string
  instagram?: string
  tiktok?: string
}

export interface SwipeHistory {
  id: string
  profile: Profile
  direction: 'left' | 'right'
  createdAt: any
  matchStatus: 'matched' | 'pending' | 'not-matched'
}

export interface Chat {
  id: string
  userIds: string[]
  matchId: string
  venueId: string
  createdAt: any
  lastMessageAt?: any
  [key: `unreadCount_${string}`]: number
}

export interface Message {
  id: string
  senderId: string
  text: string
  createdAt: any
  expiresAt: any
}