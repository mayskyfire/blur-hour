# Firebase Security Rules

## Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    match /venues/{venueId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }
    
    match /profiles/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && isOwner(userId);
    }
    
    match /swipes/{swipeId} {
      allow read, write: if isAuthenticated();
    }
    
    match /matches/{matchId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    match /chats/{chatId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      
      match /messages/{messageId} {
        allow read: if isAuthenticated();
        allow write: if isAuthenticated();
      }
    }
    
    match /vibes/{vibeId} {
      allow read, write: if isAuthenticated();
    }
    
    match /blocks/{blockId} {
      allow read, write: if isAuthenticated();
    }
    
    match /reports/{reportId} {
      allow read, write: if isAuthenticated();
    }
    
    match /zones/{zoneId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }
  }
}
```
