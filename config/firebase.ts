/**
 * Firebase Configuration for Skipline Go
 * Using Firebase Spark (Free) Plan
 * 
 * DEMO MODE: Works without real Firebase credentials
 * For production, add your Firebase config to .env file
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';

// Check if we're in demo mode (no real Firebase config)
const isDemoMode = !import.meta.env.VITE_FIREBASE_API_KEY || 
                   import.meta.env.VITE_FIREBASE_API_KEY === "demo-api-key";

// Firebase configuration - Replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skipline-go.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skipline-go",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skipline-go.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123"
};

// Initialize Firebase (only if not in demo mode)
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (!isDemoMode) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Initialize Firestore with offline persistence
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
    
    console.log('✅ Firebase initialized with offline persistence');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.log('🎮 Running in DEMO MODE - Firebase not configured');
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Demo user for testing - stored in localStorage for persistence
const DEMO_USER_KEY = 'skipline_demo_user';

const createDemoUser = (type: 'google' | 'guest'): User => {
  const timestamp = Date.now();
  const user = {
    uid: type === 'google' ? `demo-google-${timestamp}` : `demo-guest-${timestamp}`,
    email: type === 'google' ? 'demo@skipline.go' : null,
    displayName: type === 'google' ? 'Demo User' : 'Guest Shopper',
    photoURL: type === 'google' ? 'https://ui-avatars.com/api/?name=Demo+User&background=f59e0b&color=fff' : null,
    emailVerified: type === 'google',
    isAnonymous: type === 'guest',
    metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() },
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'demo-token',
    getIdTokenResult: async () => ({ token: 'demo-token', claims: {}, authTime: '', issuedAtTime: '', expirationTime: '', signInProvider: null, signInSecondFactor: null }),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    providerId: type === 'google' ? 'google.com' : 'anonymous'
  } as User;
  
  // Save to localStorage
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous
  }));
  
  return user;
};

// Get saved demo user from localStorage
const getSavedDemoUser = (): User | null => {
  try {
    const saved = localStorage.getItem(DEMO_USER_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        ...data,
        emailVerified: !data.isAnonymous,
        metadata: { creationTime: new Date().toISOString(), lastSignInTime: new Date().toISOString() },
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'demo-token',
        getIdTokenResult: async () => ({ token: 'demo-token', claims: {}, authTime: '', issuedAtTime: '', expirationTime: '', signInProvider: null, signInSecondFactor: null }),
        reload: async () => {},
        toJSON: () => ({}),
        phoneNumber: null,
        providerId: data.isAnonymous ? 'anonymous' : 'google.com'
      } as User;
    }
  } catch (e) {
    console.error('Error reading saved user:', e);
  }
  return null;
};

// Simple auth functions that return user directly
export const signInWithGoogle = async (): Promise<User | null> => {
  if (isDemoMode) {
    console.log('🎮 Demo: Google Sign-In');
    return createDemoUser('google');
  }
  
  try {
    if (!auth) throw new Error('Firebase not initialized');
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    return null;
  }
};

export const signInAsGuest = async (): Promise<User | null> => {
  if (isDemoMode) {
    console.log('🎮 Demo: Guest Sign-In');
    return createDemoUser('guest');
  }
  
  try {
    if (!auth) throw new Error('Firebase not initialized');
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Anonymous sign-in error:', error);
    return null;
  }
};

export const signOutUser = async (): Promise<void> => {
  if (isDemoMode) {
    localStorage.removeItem(DEMO_USER_KEY);
    return;
  }
  
  try {
    if (auth) await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
  }
};

// Check for existing session
export const getCurrentUser = (): User | null => {
  if (isDemoMode) {
    return getSavedDemoUser();
  }
  return auth?.currentUser || null;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (isDemoMode) {
    // In demo mode, just call callback once with saved user
    const savedUser = getSavedDemoUser();
    setTimeout(() => callback(savedUser), 100);
    return () => {};
  }
  
  if (!auth) {
    setTimeout(() => callback(null), 100);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};

// Get user profile from Firestore (stub for demo)
export const getUserProfile = async (uid: string): Promise<any> => {
  return {
    uid,
    tier: 'NEW',
    theftScore: 0,
    totalTransactions: 0
  };
};

export { app, auth, db, isDemoMode };
