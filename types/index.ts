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