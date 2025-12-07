# 🍸 Blur Hour

A Progressive Web App for finding singles in bars and clubs. Built with Nuxt 4, Vue 3, TypeScript, Tailwind CSS, and Firebase.

## 🎯 Features

- **Shot or Not Swipe**: Tinder-style swipe interface with custom "Shot" interaction
- **Live Photo Feed**: Capture and share real-time photos in the venue with 6-hour expiry
- **Real-time Matching**: Instant matches when both users swipe right
- **Ephemeral Chat**: Messages expire after 6 hours for privacy
- **Venue-based**: Users only see others in the same venue
- **PWA Support**: Installable as a mobile app with offline capabilities
- **Dark Neon Theme**: Nightclub-inspired UI with neon accents

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Nuxt 4, Vue 3 (Composition API), TypeScript
- **Styling**: Tailwind CSS with custom dark neon theme
- **Backend**: Firebase (Authentication + Firestore)
- **PWA**: @vite-pwa/nuxt for service worker and manifest

### Project Structure
```
blur-hour/
├── components/
│   ├── swipe/
│   │   ├── ShotOrNotSwipe.vue    # Main swipe component
│   │   └── ProfileCard.vue        # Profile display card
│   └── LivePhotoCamera.vue        # Camera for live photos
├── composables/
│   ├── useFirebase.ts             # Firebase initialization
│   ├── useAuth.ts                 # Authentication logic
│   ├── useProfiles.ts             # Profile CRUD operations
│   ├── useSwipesAndMatches.ts     # Swipe and match logic
│   ├── useChats.ts                # Chat messaging
│   ├── useLivePhotos.ts           # Live photo management
│   └── useStorage.ts              # Firebase Storage
├── pages/
│   ├── index.vue                  # Landing/venue selection
│   ├── onboarding.vue             # Profile creation
│   ├── discover.vue               # Swipe interface
│   ├── profile.vue                # User profile
│   ├── live-feed.vue              # Live photo feed
│   └── chats/
│       ├── index.vue              # Match list
│       └── [chatId].vue           # Chat room
├── layouts/
│   └── default.vue                # Main layout with nav
├── types/
│   └── index.ts                   # TypeScript interfaces
└── assets/css/
    └── main.css                   # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd blur-hour
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

Enable:
- Authentication (Anonymous or Email/Password)
- Firestore Database

Create `.env` file:
```bash
cp .env.example .env
```

Add your Firebase credentials to `.env`:
```env
NUXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **Setup Firestore Security Rules**

In Firebase Console > Firestore Database > Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /swipes/{swipeId} {
      allow read, write: if request.auth != null;
    }
    
    match /matches/{matchId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /chats/{chatId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.userIds;
      allow write: if request.auth != null;
      
      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
    }
  }
}
```

5. **Create PWA Icons**

Create icons in `public/icons/`:
- `icon-192x192.png` (192x192px)
- `icon-512x512.png` (512x512px)

You can use a tool like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) or create them manually.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📱 PWA Installation

### Testing PWA Locally

1. Build the project: `npm run build`
2. Preview: `npm run preview`
3. Open in Chrome/Edge
4. Click the install icon in the address bar
5. Or use DevTools > Application > Manifest > Install

### PWA Features

- **Installable**: Add to home screen on mobile/desktop
- **Offline Ready**: Basic offline functionality via service worker
- **App-like**: Runs in standalone mode without browser UI
- **Theme Color**: Neon cyan (#0ea5e9) for status bar

## 🎨 Design System

### Colors
- **Night**: `#020617` (background)
- **Neon Cyan**: `#0ea5e9` (primary accent)
- **Neon Green**: `#22c55e` (success/match)
- **Neon Pink**: `#e11d48` (secondary accent)

### Components
- Cards: Rounded (`rounded-card` = 1.5rem), dark with backdrop blur
- Buttons: Gradient backgrounds with neon glow shadows
- Typography: System fonts, mobile-optimized sizes

## 🔥 Key Features Explained

### Shot or Not Swipe
- Touch/mouse drag support
- 80px threshold for swipe detection
- Smooth animations and transitions
- Visual feedback (shot glass emoji for right swipe)

### Match Detection
1. User swipes right → Record in `swipes` collection
2. Check if other user already swiped right
3. If yes → Create `match` and `chat` documents
4. Show match modal with celebration

### Ephemeral Chat
- Messages have `expiresAt` timestamp (6 hours from creation)
- Frontend filters expired messages
- Simulates temporary connections for the night

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Netlify
```bash
npm run generate
netlify deploy --prod --dir=.output/public
```

### Firebase Hosting
```bash
npm run generate
firebase deploy
```

## 📊 Firestore Data Model

### Collections

**profiles**
- `userId` (string) - Auth user ID
- `venueId` (string) - Current venue
- `displayName` (string)
- `age` (number)
- `gender` (string)
- `zone` (string) - Location in venue
- `mood` (string)
- `tags` (array)
- `lookingFor` (string)
- `status` (string) - 'single' | 'busy' | 'hidden'

**swipes**
- `fromUserId` (string)
- `toUserId` (string)
- `venueId` (string)
- `direction` (string) - 'left' | 'right'
- `createdAt` (timestamp)

**matches**
- `userIds` (array) - [userId1, userId2]
- `venueId` (string)
- `createdAt` (timestamp)

**chats**
- `matchId` (string)
- `userIds` (array)
- `venueId` (string)
- `createdAt` (timestamp)

**chats/{chatId}/messages** (subcollection)
- `senderId` (string)
- `text` (string)
- `createdAt` (timestamp)
- `expiresAt` (timestamp)

**livePhotos**
- `userId` (string)
- `venueId` (string)
- `photoUrl` (string)
- `capturedAt` (timestamp)
- `expiresAt` (timestamp) - 6 hours from capture
- `likes` (number)
- `likedBy` (array)
- `viewers` (array)

## 🛠️ Troubleshooting

### Firebase Connection Issues
- Verify `.env` variables are correct
- Check Firebase project settings
- Ensure Firestore is enabled

### PWA Not Installing
- Must be served over HTTPS (or localhost)
- Check manifest.json is accessible
- Verify icons exist in `/public/icons/`
- Use Lighthouse audit in Chrome DevTools

### Build Errors
- Clear `.nuxt` and `node_modules`: `rm -rf .nuxt node_modules && npm install`
- Check Node.js version (18+)

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ for the nightlife community
