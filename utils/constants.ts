export const SWIPE_THRESHOLD = 80
export const MESSAGE_EXPIRY_HOURS = 6
export const MAX_PROFILE_TAGS = 3
export const MAX_CRUSHES = 3

export const AGE_RANGES = [
  { value: '18-22', label: '18-22 ปี' },
  { value: '23-27', label: '23-27 ปี' },
  { value: '28-32', label: '28-32 ปี' },
  { value: '33-37', label: '33-37 ปี' },
  { value: '38-42', label: '38-42 ปี' },
  { value: '43+', label: '43+ ปี' }
] as const

export const PERSONALITY_TAGS = [
  { value: 'สายฮา', label: '😆 สายฮา', emoji: '😆' },
  { value: 'สายคุยลึก', label: '🧠 สายคุยลึก', emoji: '🧠' },
  { value: 'สายแดนซ์', label: '🕺 สายแดนซ์', emoji: '🕺' },
  { value: 'สายเกม', label: '🎮 สายเกม', emoji: '🎮' },
  { value: 'สายร้องเพลง', label: '🎤 สายร้องเพลง', emoji: '🎤' }
] as const

export const MOODS = [
  { value: 'อยากคุย', label: 'อยากคุย', emoji: '💬' },
  { value: 'ไม่ค่อยอยากคุย', label: 'ไม่ค่อยอยากคุย', emoji: '🤫' },
  { value: 'อยากเต้น', label: 'อยากเต้น', emoji: '💃' },
  { value: 'อยากร้องคาราโอเกะ', label: 'อยากร้องคาราโอเกะ', emoji: '🎤' }
] as const

export const ACTIVITY_STATUS = [
  { value: 'พร้อมคุยเลย', label: 'พร้อมคุยเลย', emoji: '🟢', color: 'text-green-400' },
  { value: 'กำลังเต้น', label: 'กำลังเต้น', emoji: '🟠', color: 'text-orange-400' },
  { value: 'กำลังร้องเพลง', label: 'กำลังร้องเพลง', emoji: '🔵', color: 'text-blue-400' },
  { value: 'ออฟไลน์', label: 'ออฟไลน์', emoji: '⚫', color: 'text-gray-400' }
] as const

export const VIBE_TYPES = [
  { value: 'cheers', label: 'ขอชนแก้วหน่อยไหม', emoji: '🍻', message: 'ขอชนแก้วหน่อยไหม' },
  { value: 'music', label: 'ชอบเพลงที่คุณขอเมื่อกี้เลย', emoji: '🎵', message: 'ชอบเพลงที่คุณขอเมื่อกี้เลย' },
  { value: 'chat', label: 'ขอคุยเล่นหน่อย', emoji: '😆', message: 'ขอคุยเล่นหน่อย' }
] as const

export const GENDERS = [
  { value: 'male', label: 'ชาย' },
  { value: 'female', label: 'หญิง' },
  { value: 'non-binary', label: 'เพศทางเลือก' },
  { value: 'prefer-not-to-say', label: 'ไม่ระบุ' }
] as const

export const ZONES = ['Zone A', 'Zone B', 'Outdoor', 'Bar Counter', 'VIP'] as const
