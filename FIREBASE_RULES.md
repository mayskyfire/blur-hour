# Firebase Security Rules

## Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Profiles
    match /profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Swipes
    match /swipes/{swipeId} {
      allow read, write: if request.auth != null;
    }
    
    // Matches
    match /matches/{matchId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Chats
    match /chats/{chatId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.userIds;
      allow write: if request.auth != null;
      
      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
    }
    
    // Missions - อนุญาตให้ทุกคนอ่านได้
    match /missions/{missionId} {
      allow read: if request.auth != null;
      allow write: if false; // เฉพาะ admin
    }
    
    // Rewards - อนุญาตให้ทุกคนอ่านได้
    match /rewards/{rewardId} {
      allow read: if request.auth != null;
      allow write: if false; // เฉพาะ admin
    }
    
    // Users - อนุญาตให้อ่าน/เขียนข้อมูลตัวเองได้
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reports - ให้ user รายงานได้
    match /reports/{reportId} {
      allow create: if request.auth != null && 
                       request.resource.data.reporterId == request.auth.uid;
      allow read: if false; // เฉพาะ admin
      allow update, delete: if false; // เฉพาะ admin
    }
    
    // Blocks - ให้ user บล็อกได้
    match /blocks/{blockId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == resource.data.blockerId;
      allow create: if request.auth != null && 
                       request.resource.data.blockerId == request.auth.uid;
    }
    
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
