import admin from 'firebase-admin'
import { readFileSync } from 'fs'

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

const icebreakers = [
  { emoji: '🍹', text: 'แก้วนั้นอร่อยไหมครับ ถ้าอร่อยเดี๋ยวผมสั่งตาม จะได้มีเรื่องคุยต่อ 😄', category: 'ทักทาย' },
  { emoji: '👋', text: 'ขอแค่ทัก… ไม่ได้จีบแรงนะ แต่ถ้าคุณให้ ก็ไม่ปฏิเสธ 😉', category: 'เนียนจีบ' },
  { emoji: '🙈', text: 'ผมกำลังหาข้ออ้างเดินมาคุยกับคุณอยู่… สรุปไม่คิดแล้ว เดินมาละ 😂', category: 'ขำๆ' },
  { emoji: '🧊', text: 'ผมไม่ใช่น้ำแข็งนะ แต่เห็นคุณแล้วละลายเฉยเลย 😳', category: 'จีบหวาน' },
  { emoji: '🥃', text: 'ชนแก้วด้วยกันไหมครับ เผื่อคืนนี้จะจำกันได้มากกว่าเดิม 😉', category: 'ทักทาย' },
  { emoji: '🎧', text: 'เพลงนี้ vibe ดีเนอะ แต่ vibe คุณดีกว่าอีก 😌', category: 'ชมเนียนๆ' },
  { emoji: '🪑', text: 'ถ้าผมนั่งตรงนี้ คุณจะไล่ไหมครับ หรือจะยอมให้ทำความรู้จักดีๆ ก่อน 😁', category: 'ขอเข้าไปใกล้' },
  { emoji: '😆', text: 'ผมไม่ได้เมานะ แค่ใจเต้นเพราะเห็นคุณเฉยๆ 😂', category: 'จีบขำๆ' },
  { emoji: '😉', text: 'คุณมายืนตรงนี้บ่อยไหมครับ ผมอยากเจอบ่อยๆ', category: 'เจ้าชู้สุภาพ' },
  { emoji: '📱', text: 'ผมขอไอจีคุณได้ไหม เผื่อเลื่อนเจอแล้วจะคิดถึงคืนนี้ 😊', category: 'ขอไอจี' },
  { emoji: '💞', text: 'ผมว่าคืนนี้มันขาดอะไรบางอย่าง… ขาดการรู้จักคุณนี่แหละครับ 😌', category: 'หวานๆ' },
  { emoji: '🤝', text: 'เราเป็นเพื่อนกันก่อนก็ได้นะครับ เดี๋ยวขั้นต่อไปค่อยว่ากัน 😉', category: 'เริ่มคุย' },
  { emoji: '👀', text: 'ผมมองคุณหลายรอบแล้วนะ… คราวนี้ขอทักจริงๆ 😳', category: 'ทักตรงๆ' },
  { emoji: '😌', text: 'โต๊ะคุณดูน่าสนุกนะครับ มีที่ให้คนน่ารักแบบผมแทรกไหม 😄', category: 'กวนๆ' },
  { emoji: '🌙', text: 'คืนนี้ฟีลดีเนอะ… ถ้ามีคุณคุยด้วยคงดีขึ้นอีก', category: 'ละมุนๆ' },
  { emoji: '🎉', text: 'ผมว่า vibe เราคล้ายกันนะ ลองคุยกันหน่อยไหมครับ?', category: 'ชวนคุย' },
  { emoji: '😳', text: 'บอกตรงๆ นะ… คุณดูเป็นคนน่าค้นหา ผมเลยอยากเริ่มจากคำว่า “สวัสดีครับ”', category: 'จริงใจ' },
  { emoji: '🍀', text: 'วันนี้ผมว่าวันดีนะ… เพราะได้เจอคุณ 😊', category: 'หวานๆ' },
  { emoji: '🫠', text: 'คุณตั้งใจทำผมเขิน หรือผมคิดไปเองครับ 😅', category: 'จีบเนียน' },
  { emoji: '🥰', text: 'คุณเป็นคนประเภทที่ผมอยากทำความรู้จักตั้งแต่เจอครั้งแรกเลย', category: 'ตรงๆ' },
  { emoji: '💬', text: 'ผมคุยไม่ค่อยเก่งนะ แต่ตั้งใจคุยกับคุณมากอะ 😌', category: 'อบอุ่น' },
  { emoji: '😎', text: 'ถ้าผมขอถ่ายรูปด้วยหนึ่งรูป จะมากเกินไปไหมครับ 😄', category: 'เจ้าชู้วัยรุ่น' },
  { emoji: '🌟', text: 'คุณมีพลังพิเศษอะไรไหมครับ ทำไมผมมองแล้วแยกสายตาไม่ได้เลย 😳', category: 'ชมเนียน' },
  { emoji: '💗', text: 'ถ้าคืนนี้มีคนหนึ่งที่คุณอยากคุยด้วย… ขอให้เป็นผมได้ไหมครับ?', category: 'จีบตรงๆ' },
  { emoji: '🫶', text: 'เริ่มคุยกับผมระวังติดใจนะครับ ผมเตือนแล้วนะ 😌', category: 'กวนหวาน' }
]

async function seedIcebreakers() {
  console.log('🔥 Starting to seed icebreakers...')
  
  try {
    for (let i = 0; i < icebreakers.length; i++) {
      const icebreaker = icebreakers[i]
      const docId = `icebreaker${i + 1}`
      await db.collection('icebreakers').doc(docId).set(icebreaker)
      console.log(`✅ Added: ${icebreaker.text}`)
    }
    console.log(`\n🎉 Successfully seeded ${icebreakers.length} icebreakers!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding icebreakers:', error.message)
    process.exit(1)
  }
}

seedIcebreakers()
