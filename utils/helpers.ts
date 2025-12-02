import type { Timestamp } from 'firebase/firestore'

export const formatTime = (timestamp: Timestamp | Date): string => {
  const date = timestamp instanceof Date ? timestamp : timestamp.toDate()
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export const getMoodEmoji = (mood: string): string => {
  const map: Record<string, string> = {
    'อยากคุย': '🍻', 'อยากเต้น': '💃', 'ชิล ๆ': '🎵', 'สนุก': '🎉', 'เหงา': '🌙'
  }
  return map[mood] || '✨'
}
