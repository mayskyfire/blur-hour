# 📋 TECHNICAL DEBT & IMPROVEMENTS NEEDED

## 1. ❌ Data Model Updates

### Profile Model
```typescript
// ปัจจุบัน
interface Profile {
  age: number  // ❌ ต้องเปลี่ยน
  gender: string
  mood: string
}

// ต้องการ
interface Profile {
  ageRange: '18-22' | '23-27' | '28-32' | '33-37' | '38+'
  gender: 'male' | 'female' | 'other'
  mood: 'อยากคุย' | 'ไม่ค่อยอยากคุย' | 'อยากเต้น' | 'อยากร้องคาราโอเกะ'
  personalityTags: Array<'😆 สายฮา' | '🧠 สายคุยลึก' | '🕺 สายแดนซ์' | '🎮 สายเกม' | '🎤 สายร้องเพลง'>
  zone: string  // เพิ่ม
  activityStatus: '🟢 พร้อมคุยเลย' | '🟠 กำลังเต้น' | '🔵 กำลังร้องเพลง'  // เพิ่ม
  lastActive: Timestamp  // เพิ่ม
}
```

### Collections ที่ต้องเพิ่ม
- `vibes` - ระบบส่งสัญญาณ
- `crushes` - ระบบ crush
- `missions` - ภารกิจ
- `user_missions` - ความคืบหน้าภารกิจ
- `rewards` - รางวัล
- `song_requests` - คำขอเพลง
- `broadcasts` - ประกาศจากร้าน
- `zones` - โซนในร้าน
- `reports` - รายงานผู้ใช้
- `blocks` - บล็อกผู้ใช้

## 2. ❌ UI/UX Improvements

### หน้าที่ต้องสร้างใหม่
- `/venue/[venueId]/live` - Grid view แสดงคนโสดทั้งหมด
- `/venue/[venueId]/map` - แผนที่ร้าน
- `/crushes` - จัดการ crush
- `/missions` - ภารกิจ

### Components ที่ต้องสร้าง
- `LiveGrid.vue` - แสดงผู้ใช้แบบ grid
- `FilterBar.vue` - กรองตามเพศ, อายุ, mood, zone
- `VibeButton.vue` - ปุ่มส่ง vibe
- `CrushPicker.vue` - เลือก crush
- `MissionCard.vue` - การ์ดภารกิจ
- `VenueMap.vue` - แผนที่ร้าน
- `ZoneSelector.vue` - เลือกโซน
- `ReportModal.vue` - รายงานผู้ใช้

### ปรับปรุง Components เดิม
- `ProfileCard.vue` - เพิ่ม activity badge, zone
- `ShotOrNotSwipe.vue` - เปลี่ยนเป็น vibe system
- Chat components - เพิ่มปุ่ม "ขอชนแก้ว", "ร่วมโต๊ะ"

## 3. ❌ Real-time Features

### Activity Status Tracking
```typescript
// ต้องเพิ่ม
const updateActivityStatus = async () => {
  await updateDoc(doc(db, 'profiles', userId), {
    lastActive: serverTimestamp(),
    activityStatus: currentActivity
  })
}

// เรียกทุก 30 วินาที
setInterval(updateActivityStatus, 30000)
```

### Live Zone Population
```typescript
// Real-time listener
const subscribeZonePopulation = (venueId: string) => {
  return onSnapshot(
    query(collection(db, 'profiles'), where('venueId', '==', venueId)),
    (snapshot) => {
      const zoneCounts = {}
      snapshot.docs.forEach(doc => {
        const zone = doc.data().zone
        zoneCounts[zone] = (zoneCounts[zone] || 0) + 1
      })
      updateZoneUI(zoneCounts)
    }
  )
}
```

### Broadcast Notifications
```typescript
// Listen for broadcasts
const subscribeBroadcasts = (venueId: string) => {
  return onSnapshot(
    query(
      collection(db, 'broadcasts'),
      where('venueId', '==', venueId),
      orderBy('sentAt', 'desc'),
      limit(1)
    ),
    (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          showNotification(change.doc.data())
        }
      })
    }
  )
}
```

## 4. ❌ Cloud Functions Needed

### functions/src/index.ts
```typescript
// 1. Mutual Crush Detection
export const onCrushCreated = functions.firestore
  .document('crushes/{crushId}')
  .onCreate(async (snap, context) => {
    const crush = snap.data()
    const reverseQuery = await db.collection('crushes')
      .where('fromUserId', '==', crush.toUserId)
      .where('toUserId', '==', crush.fromUserId)
      .get()
    
    if (!reverseQuery.empty) {
      // Mutual crush! Create match
      await db.collection('matches').add({
        userIds: [crush.fromUserId, crush.toUserId],
        type: 'crush',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })
    }
  })

// 2. Message Expiry Cleanup
export const cleanupExpiredMessages = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now()
    const chatsSnapshot = await db.collection('chats').get()
    
    for (const chatDoc of chatsSnapshot.docs) {
      const messagesQuery = await chatDoc.ref
        .collection('messages')
        .where('expiresAt', '<', now)
        .get()
      
      const batch = db.batch()
      messagesQuery.docs.forEach(doc => batch.delete(doc.ref))
      await batch.commit()
    }
  })

// 3. Activity Status Updates
export const updateInactiveUsers = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const fiveMinutesAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 5 * 60 * 1000)
    )
    
    const inactiveUsers = await db.collection('profiles')
      .where('lastActive', '<', fiveMinutesAgo)
      .where('activityStatus', '!=', 'offline')
      .get()
    
    const batch = db.batch()
    inactiveUsers.docs.forEach(doc => {
      batch.update(doc.ref, { activityStatus: 'offline' })
    })
    await batch.commit()
  })

// 4. Mutual Vibe Detection
export const onVibeCreated = functions.firestore
  .document('vibes/{vibeId}')
  .onCreate(async (snap, context) => {
    const vibe = snap.data()
    const reverseQuery = await db.collection('vibes')
      .where('fromUserId', '==', vibe.toUserId)
      .where('toUserId', '==', vibe.fromUserId)
      .where('venueId', '==', vibe.venueId)
      .get()
    
    if (!reverseQuery.empty) {
      // Mutual vibe! Create match
      await db.collection('matches').add({
        userIds: [vibe.fromUserId, vibe.toUserId],
        venueId: vibe.venueId,
        type: 'vibe',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })
    }
  })
```

## 5. ❌ Admin Panel Enhancements

### ต้องเพิ่มใน Admin Dashboard
- Song request approval UI (✅ เสร็จแล้ว)
- Broadcast composer (✅ เสร็จแล้ว)
- User management (✅ เสร็จแล้ว)
- Mission management (❌ ยังไม่มี)
- Zone configuration (✅ เสร็จแล้ว)
- Analytics dashboard (✅ เสร็จแล้ว)

### Mission Management UI
```vue
<!-- pages/admin/missions.vue -->
<template>
  <div>
    <h1>จัดการภารกิจ</h1>
    <button @click="createMission">สร้างภารกิจใหม่</button>
    <div v-for="mission in missions" :key="mission.id">
      <h3>{{ mission.title }}</h3>
      <p>{{ mission.description }}</p>
      <p>รางวัล: {{ mission.reward }}</p>
      <button @click="toggleMission(mission.id)">
        {{ mission.isActive ? 'ปิด' : 'เปิด' }}
      </button>
    </div>
  </div>
</template>
```

## 6. ❌ Security Improvements

### Firestore Rules ที่ต้องเพิ่ม
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Vibes - ป้องกัน spam
    match /vibes/{vibeId} {
      allow create: if request.auth != null &&
                       request.resource.data.fromUserId == request.auth.uid &&
                       !exists(/databases/$(database)/documents/blocks/$(request.auth.uid + '_' + request.resource.data.toUserId));
      allow read: if request.auth != null &&
                     (resource.data.fromUserId == request.auth.uid ||
                      resource.data.toUserId == request.auth.uid);
    }
    
    // Blocks
    match /blocks/{blockId} {
      allow create, read: if request.auth != null &&
                             blockId.matches(request.auth.uid + '_.*');
    }
    
    // Reports
    match /reports/{reportId} {
      allow create: if request.auth != null &&
                       request.resource.data.reporterId == request.auth.uid;
      allow read: if false; // Only admins via backend
    }
    
    // Venue isolation
    match /profiles/{userId} {
      allow read: if request.auth != null &&
                     get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.venueId == resource.data.venueId;
    }
  }
}
```

## 7. ❌ Performance Optimizations

### Indexing
```javascript
// ต้องสร้าง Composite Indexes
// profiles: venueId + lastActive
// vibes: toUserId + venueId + createdAt
// matches: userIds (array) + venueId
// song_requests: venueId + status + createdAt
```

### Caching
```typescript
// Cache venue data
const venueCache = new Map()

const getVenue = async (venueId: string) => {
  if (venueCache.has(venueId)) {
    return venueCache.get(venueId)
  }
  const venue = await fetchVenue(venueId)
  venueCache.set(venueId, venue)
  return venue
}
```

### Pagination
```typescript
// Live grid pagination
const loadMoreUsers = async (lastDoc: DocumentSnapshot) => {
  const query = query(
    collection(db, 'profiles'),
    where('venueId', '==', venueId),
    orderBy('lastActive', 'desc'),
    startAfter(lastDoc),
    limit(20)
  )
  return await getDocs(query)
}
```

## 8. ❌ Testing Requirements

### Unit Tests ต้องเพิ่ม
- Vibe system logic
- Crush detection
- Mission completion
- Activity status updates

### Integration Tests
- End-to-end user flow
- Match creation
- Chat functionality
- Admin operations

### E2E Tests
- User registration → profile → vibe → match → chat
- Admin dashboard operations
- Broadcast delivery

## 📊 Priority Summary

### 🔴 Critical (ต้องทำก่อน)
1. Data model updates (Profile, Collections)
2. Vibe system
3. Live grid UI
4. Zone detection
5. Security rules
6. Cloud Functions (mutual detection)

### 🟡 Important (ทำตาม)
1. Crush system
2. Mission system
3. Song requests
4. Enhanced chat features
5. Real-time activity tracking

### 🟢 Nice to Have (ทำทีหลัง)
1. Venue map
2. AI icebreaker
3. Shy mode
4. Advanced analytics

## 🚀 Implementation Order

1. **Week 1-2**: Data models + Vibe system
2. **Week 3-4**: Live grid + Filters + Zone detection
3. **Week 5-6**: Cloud Functions + Security
4. **Week 7-8**: Crush system + Missions
5. **Week 9-10**: Enhanced chat + Song requests
6. **Week 11-12**: Testing + Bug fixes

---

**Total Estimated Time**: 12 weeks for complete implementation
