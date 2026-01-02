# 🔥 Firebase Setup Guide

Complete guide to set up Firebase for Skipline Go.

---

## 📋 Prerequisites

- Google Account
- Node.js 18+ installed

---

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `skipline-go` (or your preferred name)
4. Enable/Disable Google Analytics (optional)
5. Click **"Create project"**

---

## 🔐 Step 2: Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Go to **Sign-in method** tab
4. Enable these providers:

### Google Sign-In
- Click **Google** → Toggle **Enable**
- Add your support email
- Click **Save**

### Anonymous Sign-In
- Click **Anonymous** → Toggle **Enable**
- Click **Save**

---

## 🗄️ Step 3: Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location closest to your users
5. Click **"Enable"**

### Security Rules (Production)

For production, update rules in **Firestore → Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions - authenticated users only
    match /transactions/{transactionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Products - anyone can read
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## ⚙️ Step 4: Get Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"**
3. Click **Web icon** `</>`
4. Register app with nickname: `skipline-go-web`
5. Copy the configuration object

---

## 📝 Step 5: Configure Environment

Create/update `.env` file in project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Optional: Gemini AI for Chatbot
VITE_GEMINI_API_KEY=your-gemini-api-key
```

---

## 🌐 Step 6: Add Authorized Domains

For production deployment:

1. Go to **Authentication → Settings → Authorized domains**
2. Add your deployment domains:
   - `your-app.vercel.app`
   - `your-app.netlify.app`
   - `your-custom-domain.com`

---

## ✅ Step 7: Test Connection

1. Restart your dev server: `npm run dev`
2. Open the app in browser
3. Try signing in with Google
4. Check Firebase Console → Authentication → Users

---

## 🔧 Troubleshooting

### "Firebase not initialized" error
- Check if `.env` file exists and has correct values
- Restart the development server after changing `.env`

### Google Sign-In not working
- Verify Google provider is enabled in Authentication
- Check if domain is in Authorized domains list
- Clear browser cache and try again

### Firestore permission denied
- Check security rules allow the operation
- Verify user is authenticated
- Check if you're in test mode

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

Need help? Open an issue on GitHub!
