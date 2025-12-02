# 🚀 Blur Hour - Complete Setup Guide

## Prerequisites

- Node.js 18+ installed
- Firebase account
- Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name it "blur-hour" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

#### Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Anonymous** sign-in method
4. Click "Save"

#### Enable Firestore

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (we'll add rules later)
4. Select your region
5. Click "Enable"

#### Add Security Rules

Go to **Firestore Database > Rules** and paste:

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
    
    match /venues/{venueId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

Click "Publish"

#### Get Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app name: "blur-hour-web"
5. Copy the config object

### 3. Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and paste your Firebase config:

```env
NUXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=blur-hour-xxx.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=blur-hour-xxx
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=blur-hour-xxx.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NUXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Create PWA Icons

Create `public/icons/` directory and add:

- `icon-192x192.png` (192x192px)
- `icon-512x512.png` (512x512px)

**Quick way using online tool:**
1. Go to [Favicon Generator](https://realfavicongenerator.net/)
2. Upload a logo/image
3. Download and extract to `public/icons/`

**Or use this emoji as placeholder:**
```bash
# Install imagemagick (if available)
# Then create simple icons:
convert -size 192x192 xc:transparent -font Arial -pointsize 120 -fill "#0ea5e9" -gravity center -annotate +0+0 "🍸" public/icons/icon-192x192.png
convert -size 512x512 xc:transparent -font Arial -pointsize 320 -fill "#0ea5e9" -gravity center -annotate +0+0 "🍸" public/icons/icon-512x512.png
```

### 5. Seed Test Data (Optional)

Add a test venue to Firestore manually:

1. Go to **Firestore Database**
2. Click "Start collection"
3. Collection ID: `venues`
4. Document ID: (auto-generate)
5. Add fields:
   - `name` (string): "The Neon Club"
   - `code` (string): "NEON123"
   - `location` (string): "Bangkok"
6. Click "Save"

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 7. Test the App

1. Enter venue code: `NEON123`
2. Create a profile
3. Open in another browser/incognito
4. Create another profile
5. Swipe right on each other
6. See the match!
7. Start chatting

### 8. Build for Production

```bash
npm run build
npm run preview
```

### 9. Test PWA Installation

1. Open in Chrome/Edge
2. Look for install icon in address bar
3. Click to install
4. App opens in standalone mode

## Deployment Options

### Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel
```

### Netlify

```bash
npm run generate
netlify deploy --prod --dir=.output/public
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run generate
firebase deploy
```

## Troubleshooting

### Firebase not connecting
- Check `.env` variables are correct
- Ensure no extra spaces in values
- Restart dev server after changing `.env`

### PWA not installing
- Must use HTTPS (or localhost)
- Check icons exist in `public/icons/`
- Run Lighthouse audit in Chrome DevTools

### Build errors
```bash
rm -rf .nuxt node_modules package-lock.json
npm install
npm run dev
```

## Next Steps

- Customize colors in `tailwind.config.ts`
- Add more venues to Firestore
- Implement QR code generation for venues
- Add profile photos with Firebase Storage
- Set up Firebase Cloud Functions for cleanup

## Support

For issues, check:
- [Nuxt Documentation](https://nuxt.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

Happy coding! 🍸
