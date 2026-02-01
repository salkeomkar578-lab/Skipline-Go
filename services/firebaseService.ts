0.
/**
 * Firebase Service - Skipline Go
 * Block 3: Central Database Operations
 * 
 * Uses Firestore when available, falls back to localStorage
 * Collections: products, users, carts, transactions, auditLogs
 */

import { db, isDemoMode } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import * as transactionStore from './transactionStore';
import {
  Product,
  UserProfile,
  Transaction,
  ShoppingSession,
  CartItem,
  BehaviorLog,
  AuditLog,
  InventoryAlert
} from '../types';
import { MOCK_PRODUCTS } from '../constants';

// ==================== COLLECTIONS ====================
const COLLECTIONS = {
  PRODUCTS: 'products',
  USERS: 'users',
  CARTS: 'carts',
  TRANSACTIONS: 'transactions',
  AUDIT_LOGS: 'auditLogs',
  INVENTORY_ALERTS: 'inventoryAlerts'
};

// ==================== PRODUCT OPERATIONS ====================

/**
 * Get product by barcode - checks Firestore first, falls back to mock data
 */
export const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
  // Use mock products directly when in demo mode
  if (isDemoMode || !db) {
    const mockProduct = MOCK_PRODUCTS.find(p => p.id === barcode);
    if (mockProduct) return mockProduct;
    
    // Generate product for unknown barcodes
    return {
      id: barcode,
      name: `Smart Item (${barcode.slice(-4)})`,
      price: parseFloat((Math.random() * 500 + 50).toFixed(2)),
      category: 'General',
      image: `https://picsum.photos/200/200?seed=${barcode}`,
      aisle: `Aisle ${Math.floor(Math.random() * 10) + 1}`
    };
  }
  
  try {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, barcode);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    
    // Fallback to mock products
    const mockProduct = MOCK_PRODUCTS.find(p => p.id === barcode);
    if (mockProduct) return mockProduct;
    
    return {
      id: barcode,
      name: `Smart Item (${barcode.slice(-4)})`,
      price: parseFloat((Math.random() * 500 + 50).toFixed(2)),
      category: 'General',
      image: `https://picsum.photos/200/200?seed=${barcode}`,
      aisle: `Aisle ${Math.floor(Math.random() * 10) + 1}`
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    const mockProduct = MOCK_PRODUCTS.find(p => p.id === barcode);
    return mockProduct || null;
  }
};

/**
 * Save a scanned product to Firebase
 * This stores any barcode that's scanned for future reference
 */
export const saveScannedProduct = async (product: Product): Promise<void> => {
  if (isDemoMode || !db) {
    console.log('📦 Product saved locally (demo mode):', product.id);
    // Save to localStorage as backup
    const scannedProducts = JSON.parse(localStorage.getItem('scannedProducts') || '[]');
    if (!scannedProducts.find((p: Product) => p.id === product.id)) {
      scannedProducts.push({ ...product, scannedAt: Date.now() });
      localStorage.setItem('scannedProducts', JSON.stringify(scannedProducts));
    }
    return;
  }
  
  try {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, product.id);
    await setDoc(docRef, {
      ...product,
      scannedAt: serverTimestamp(),
      source: 'customer_scan'
    }, { merge: true });
    console.log('✅ Product saved to Firebase:', product.id);
  } catch (error) {
    console.error('Error saving scanned product:', error);
    // Fallback to localStorage
    const scannedProducts = JSON.parse(localStorage.getItem('scannedProducts') || '[]');
    scannedProducts.push({ ...product, scannedAt: Date.now() });
    localStorage.setItem('scannedProducts', JSON.stringify(scannedProducts));
  }
};

/**
 * Save transaction to Firebase (in addition to local store)
 */
export const saveTransactionToFirebase = async (transaction: Transaction): Promise<void> => {
  if (isDemoMode || !db) {
    console.log('💾 Transaction saved locally (demo mode):', transaction.id);
    return;
  }
  
  try {
    const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transaction.id);
    await setDoc(docRef, {
      ...transaction,
      createdAt: serverTimestamp(),
      syncedToCloud: true
    });
    console.log('✅ Transaction saved to Firebase:', transaction.id);
  } catch (error) {
    console.error('Error saving transaction to Firebase:', error);
  }
};

/**
 * Get all products for offline caching
 */
export const getAllProducts = async (): Promise<Product[]> => {
  if (isDemoMode || !db) {
    return MOCK_PRODUCTS;
  }
  
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return products.length > 0 ? products : MOCK_PRODUCTS;
  } catch (error) {
    console.error('Error fetching products:', error);
    return MOCK_PRODUCTS;
  }
};

// ==================== USER OPERATIONS ====================

/**
 * Save guest user data to Firebase/localStorage
 * This tracks all guest sessions for analytics
 */
export const saveGuestUser = async (guestUser: {
  uid: string;
  displayName: string;
  isAnonymous: boolean;
  isAuthenticated: boolean;
}): Promise<void> => {
  const guestData = {
    ...guestUser,
    deviceInfo: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    createdAt: Date.now(),
    lastActive: Date.now(),
    sessionCount: 1
  };

  // Always save to localStorage for local tracking
  const guestSessions = JSON.parse(localStorage.getItem('skipline_guest_sessions') || '[]');
  guestSessions.push(guestData);
  localStorage.setItem('skipline_guest_sessions', JSON.stringify(guestSessions));
  
  // Update total guest count
  const guestCount = parseInt(localStorage.getItem('skipline_guest_count') || '0') + 1;
  localStorage.setItem('skipline_guest_count', guestCount.toString());
  
  console.log(`👤 Guest #${guestCount} saved:`, guestUser.uid);

  if (isDemoMode || !db) {
    console.log('📊 Guest data saved locally (demo mode)');
    return;
  }
  
  try {
    const docRef = doc(db, COLLECTIONS.USERS, guestUser.uid);
    await setDoc(docRef, {
      ...guestData,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    });
    console.log('✅ Guest saved to Firebase:', guestUser.uid);
  } catch (error) {
    console.error('Error saving guest to Firebase:', error);
  }
};

/**
 * Get all guest sessions (for analytics)
 */
export const getGuestSessions = (): any[] => {
  return JSON.parse(localStorage.getItem('skipline_guest_sessions') || '[]');
};

/**
 * Get total guest count
 */
export const getGuestCount = (): number => {
  return parseInt(localStorage.getItem('skipline_guest_count') || '0');
};

/**
 * Create or update user profile
 */
export const upsertUserProfile = async (user: Partial<UserProfile> & { uid: string }): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Update existing user
      await updateDoc(docRef, {
        ...user,
        lastLoginAt: serverTimestamp()
      });
    } else {
      // Create new user with initial theft score
      await setDoc(docRef, {
        ...user,
        theftScore: 0,
        totalTransactions: 0,
        flaggedTransactions: 0,
        tier: 'NEW',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error upserting user:', error);
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

/**
 * Update user theft score and tier
 */
export const updateUserTheftScore = async (
  uid: string,
  newScore: number,
  wasFlagged: boolean
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    
    // Calculate new tier based on score
    let tier: UserProfile['tier'] = 'NEW';
    if (newScore >= 70) tier = 'FLAGGED';
    else if (newScore <= 10) tier = 'VIP';
    else if (newScore <= 30) tier = 'TRUSTED';
    
    await updateDoc(docRef, {
      theftScore: newScore,
      tier,
      totalTransactions: increment(1),
      ...(wasFlagged && { flaggedTransactions: increment(1) })
    });
  } catch (error) {
    console.error('Error updating theft score:', error);
  }
};

// ==================== CART/SESSION OPERATIONS ====================

/**
 * Save shopping session (for offline sync)
 */
export const saveShoppingSession = async (session: ShoppingSession): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.CARTS, session.userId);
    await setDoc(docRef, {
      ...session,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

/**
 * Get active shopping session
 */
export const getShoppingSession = async (userId: string): Promise<ShoppingSession | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.CARTS, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as ShoppingSession;
    }
    return null;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
};

/**
 * Clear shopping session after checkout
 */
export const clearShoppingSession = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CARTS, userId));
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

// ==================== TRANSACTION OPERATIONS ====================

/**
 * Save completed transaction
 */
export const saveTransaction = async (transaction: Transaction): Promise<void> => {
  // Always save to local store first
  transactionStore.saveTransaction(transaction);
  
  if (isDemoMode || !db) return;
  
  try {
    const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transaction.id);
    await setDoc(docRef, {
      ...transaction,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving transaction to Firestore:', error);
  }
};

/**
 * Get transaction by ID
 */
export const getTransaction = async (transactionId: string): Promise<Transaction | null> => {
  // Check local store first
  const localTx = transactionStore.getTransactionById(transactionId);
  if (localTx) return localTx;
  
  if (isDemoMode || !db) return null;
  
  try {
    const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Transaction;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
};

/**
 * Get all transactions (for staff dashboard)
 */
export const getAllTransactions = async (limitCount: number = 50): Promise<Transaction[]> => {
  // Return from local store in demo mode
  if (isDemoMode || !db) {
    return transactionStore.getAllTransactions().slice(0, limitCount);
  }
  
  try {
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return transactionStore.getAllTransactions().slice(0, limitCount);
  }
};

/**
 * Get flagged transactions for review
 */
export const getFlaggedTransactions = async (): Promise<Transaction[]> => {
  if (isDemoMode || !db) {
    return transactionStore.getAllTransactions().filter(t => t.status === 'FLAGGED');
  }
  
  try {
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where('status', '==', 'FLAGGED'),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
  } catch (error) {
    console.error('Error fetching flagged transactions:', error);
    return [];
  }
};

/**
 * Update transaction status (for staff verification)
 */
export const updateTransactionStatus = async (
  transactionId: string,
  status: Transaction['status'],
  verifiedBy?: string,
  auditNotes?: string
): Promise<void> => {
  // Always update local store first
  transactionStore.updateTransactionStatus(transactionId, status, verifiedBy);
  
  if (isDemoMode || !db) return;
  
  try {
    const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
    await updateDoc(docRef, {
      status,
      verifiedBy,
      verifiedAt: serverTimestamp(),
      ...(auditNotes && { auditNotes })
    });
  } catch (error) {
    console.error('Error updating transaction in Firestore:', error);
  }
};

/**
 * Real-time listener for transactions (staff dashboard)
 * This syncs transactions across all devices in real-time
 */
export const subscribeToTransactions = (
  callback: (transactions: Transaction[]) => void
): (() => void) => {
  // In demo mode, use local store subscription
  if (isDemoMode || !db) {
    console.log('📴 Demo mode - using local storage subscription');
    return transactionStore.subscribeToTransactions(callback);
  }
  
  console.log('🔥 Setting up Firebase real-time subscription...');
  
  const q = query(
    collection(db, COLLECTIONS.TRANSACTIONS),
    orderBy('timestamp', 'desc'),
    limit(100) // Increased limit to fetch more transactions
  );
  
  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Transaction));
    console.log('🔥 Firebase sync: Received', transactions.length, 'transactions');
    
    // Also sync to local storage for offline access
    transactions.forEach(tx => {
      transactionStore.saveTransaction(tx);
    });
    
    callback(transactions);
  }, (error) => {
    console.error('🔥 Firebase subscription error:', error);
    // Fallback to local storage on error
    callback(transactionStore.getAllTransactions());
  });
};

// ==================== AUDIT LOG OPERATIONS ====================

/**
 * Log audit action
 */
export const logAuditAction = async (auditLog: Omit<AuditLog, 'id'>): Promise<void> => {
  if (isDemoMode || !db) {
    console.log('Audit log (demo mode):', auditLog);
    return;
  }
  
  try {
    const docRef = doc(collection(db, COLLECTIONS.AUDIT_LOGS));
    await setDoc(docRef, {
      ...auditLog,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error logging audit:', error);
  }
};

// ==================== SYNC OPERATIONS ====================

/**
 * Sync pending local transactions to cloud
 */
export const syncPendingTransactions = async (): Promise<number> => {
  if (isDemoMode || !db) {
    console.log('Sync skipped - demo mode');
    return 0;
  }
  
  const pendingTxns = transactionStore.getAllTransactions().filter(t => !t.syncedToCloud);
  if (pendingTxns.length === 0) return 0;
  
  const batch = writeBatch(db);
  let syncedCount = 0;
  
  try {
    for (const txn of pendingTxns) {
      const docRef = doc(db, COLLECTIONS.TRANSACTIONS, txn.id);
      batch.set(docRef, { ...txn, syncedToCloud: true });
      syncedCount++;
    }
    
    await batch.commit();
    console.log(`✅ Synced ${syncedCount} transactions to cloud`);
    return syncedCount;
  } catch (error) {
    console.error('Error syncing transactions:', error);
    return 0;
  }
};

// ==================== STATS & DASHBOARD ====================

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<{
  totalTransactions: number;
  flaggedCount: number;
  verifiedCount: number;
  totalRevenue: number;
  averageTheftScore: number;
}> => {
  try {
    const transactions = await getAllTransactions(100);
    
    const flaggedCount = transactions.filter(t => t.status === 'FLAGGED').length;
    const verifiedCount = transactions.filter(t => t.status === 'VERIFIED').length;
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
    const averageTheftScore = transactions.length > 0
      ? transactions.reduce((sum, t) => sum + t.theftScore, 0) / transactions.length
      : 0;
    
    return {
      totalTransactions: transactions.length,
      flaggedCount,
      verifiedCount,
      totalRevenue,
      averageTheftScore
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalTransactions: 0,
      flaggedCount: 0,
      verifiedCount: 0,
      totalRevenue: 0,
      averageTheftScore: 0
    };
  }
};

// ==================== NOTIFICATION SYSTEM ====================
// Real-time notifications for cross-device communication

/**
 * Send verification notification to customer
 * This allows staff on Device A to notify customer on Device B
 * ENHANCED: Now writes to multiple storage keys and dispatches storage event
 */
export const sendVerificationNotification = async (
  transactionId: string,
  notificationType: 'gate_released' | 'flagged' | 'preorder_collected',
  message: string
): Promise<void> => {
  const notificationData = {
    type: notificationType === 'flagged' ? 'flagged' : 'success',
    message,
    timestamp: Date.now(),
    transactionId
  };
  
  // Save to multiple localStorage keys for maximum compatibility
  const keysToWrite = [
    notificationType === 'preorder_collected' 
      ? `preorder_verified_${transactionId}`
      : `qr_verified_${transactionId}`,
    `notification_${transactionId}`
  ];
  
  keysToWrite.forEach(key => {
    localStorage.setItem(key, JSON.stringify(notificationData));
  });
  
  // Also update the transaction in localStorage to trigger cross-tab sync
  const txData = localStorage.getItem('skipline_transactions');
  if (txData) {
    try {
      const transactions = JSON.parse(txData);
      const txIndex = transactions.findIndex((t: any) => t.id === transactionId);
      if (txIndex >= 0) {
        transactions[txIndex].lastNotification = notificationData;
        transactions[txIndex].status = notificationType === 'preorder_collected' ? 'PREORDER_COLLECTED' : 
                                        notificationType === 'flagged' ? 'FLAGGED' : 'VERIFIED';
        transactions[txIndex]._notificationSent = false; // Reset to allow re-detection
        localStorage.setItem('skipline_transactions', JSON.stringify(transactions));
      }
    } catch (e) {
      console.error('Error updating transaction with notification:', e);
    }
  }
  
  // Dispatch storage event for cross-tab synchronization
  window.dispatchEvent(new StorageEvent('storage', {
    key: `qr_verified_${transactionId}`,
    newValue: JSON.stringify(notificationData),
    url: window.location.href
  }));
  
  console.log('📢 Notification dispatched to all tabs:', transactionId, notificationType);
  
  if (isDemoMode || !db) {
    console.log('📢 Notification saved locally (demo mode):', transactionId);
    return;
  }
  
  try {
    // Update the transaction document with notification data AND status
    const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
    const newStatus = notificationType === 'preorder_collected' ? 'PREORDER_COLLECTED' : 
                      notificationType === 'flagged' ? 'FLAGGED' : 'VERIFIED';
    await updateDoc(docRef, {
      status: newStatus,
      notification: {
        type: notificationType,
        message,
        timestamp: serverTimestamp(),
        read: false
      }
    });
    console.log('📢 Notification sent via Firebase:', transactionId, notificationType, 'Status:', newStatus);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

/**
 * Subscribe to SINGLE transaction status updates (Firebase real-time)
 * Used for cross-device verification notifications
 */
export const subscribeToTransactionStatus = (
  transactionId: string,
  callback: (transaction: Transaction | null) => void
): (() => void) => {
  if (isDemoMode || !db) {
    console.log('📴 Demo mode - Firebase real-time disabled for:', transactionId);
    // Return no-op for demo mode
    return () => {};
  }
  
  console.log('🔥 Setting up Firebase real-time listener for transaction:', transactionId);
  
  const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const tx = { id: docSnap.id, ...docSnap.data() } as Transaction;
      console.log('🔥 Transaction update received:', tx.id, 'Status:', tx.status);
      callback(tx);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('🔥 Firebase transaction listener error:', error);
  });
};

/**
 * Subscribe to transaction notification updates
 * Customer uses this to listen for verification from staff
 * ENHANCED: Now uses BOTH Firebase real-time AND localStorage polling
 */
export const subscribeToTransactionNotification = (
  transactionId: string,
  callback: (notification: { type: string; message: string } | null) => void
): (() => void) => {
  console.log('📡 Setting up DUAL notification system for:', transactionId);
  
  let lastCheckTime = Date.now();
  let lastKnownStatus: string | null = null;
  let notificationTriggered = false;
  
  const triggerCallback = (type: string, message: string) => {
    if (notificationTriggered) return; // Prevent duplicate triggers
    notificationTriggered = true;
    console.log('🎯 Triggering notification callback:', type, message);
    callback({ type, message });
  };
  
  // Check localStorage for notifications
  const checkLocalNotifications = () => {
    if (notificationTriggered) return;
    
    // Check notification keys
    const keysToCheck = [
      `qr_verified_${transactionId}`,
      `preorder_verified_${transactionId}`,
      `notification_${transactionId}`,
      `qr_verified_${transactionId.split('-').slice(-1)[0]}`,
    ];
    
    for (const key of keysToCheck) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          if (!parsedData.processedAt || parsedData.timestamp > lastCheckTime - 1000) {
            console.log('📬 Found localStorage notification:', key, parsedData);
            localStorage.removeItem(key);
            parsedData.processedAt = Date.now();
            triggerCallback(parsedData.type, parsedData.message);
            return;
          }
        } catch (e) {
          console.error('Parse error for key', key, ':', e);
          localStorage.removeItem(key);
        }
      }
    }
    
    // Check transactions storage for status changes
    const txData = localStorage.getItem('skipline_transactions');
    if (txData) {
      try {
        const transactions = JSON.parse(txData);
        const tx = transactions.find((t: any) => t.id === transactionId);
        if (tx && tx.status !== lastKnownStatus) {
          lastKnownStatus = tx.status;
          if (tx.status === 'VERIFIED' && !tx._notificationSent) {
            console.log('📬 Detected VERIFIED status in localStorage:', transactionId);
            tx._notificationSent = true;
            localStorage.setItem('skipline_transactions', JSON.stringify(transactions));
            triggerCallback('success', 'Gate released! You may exit.');
          } else if (tx.status === 'PREORDER_COLLECTED' && !tx._notificationSent) {
            console.log('📬 Detected PREORDER_COLLECTED status in localStorage:', transactionId);
            tx._notificationSent = true;
            localStorage.setItem('skipline_transactions', JSON.stringify(transactions));
            triggerCallback('success', 'Order collected successfully!');
          } else if (tx.status === 'FLAGGED' && !tx._notificationSent) {
            console.log('📬 Detected FLAGGED status in localStorage:', transactionId);
            tx._notificationSent = true;
            localStorage.setItem('skipline_transactions', JSON.stringify(transactions));
            triggerCallback('flagged', 'Please proceed to customer service.');
          }
        }
      } catch (e) {
        console.error('Error checking transaction status:', e);
      }
    }
    
    lastCheckTime = Date.now();
  };
  
  // Poll localStorage every 300ms for same-browser sync
  const localInterval = setInterval(checkLocalNotifications, 300);
  
  // Listen for storage events for instant cross-tab sync
  const storageHandler = (e: StorageEvent) => {
    if (e.key?.includes(transactionId) || e.key === 'skipline_transactions') {
      console.log('📡 Storage event detected, checking notifications');
      setTimeout(checkLocalNotifications, 50);
    }
  };
  window.addEventListener('storage', storageHandler);
  
  // FIREBASE REAL-TIME: Subscribe to transaction document changes
  // This enables cross-device/cross-account verification
  let unsubscribeFirebase: (() => void) | null = null;
  
  if (!isDemoMode && db) {
    console.log('🔥 Setting up Firebase real-time listener for:', transactionId);
    const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
    
    unsubscribeFirebase = onSnapshot(docRef, (docSnap) => {
      if (notificationTriggered) return;
      
      if (docSnap.exists()) {
        const tx = docSnap.data();
        console.log('🔥 Firebase transaction update:', transactionId, 'Status:', tx.status, 'Notification:', tx.notification);
        
        // Check for status change
        if (tx.status !== lastKnownStatus) {
          lastKnownStatus = tx.status;
          
          if (tx.status === 'VERIFIED') {
            console.log('🔥 Firebase: VERIFIED status detected');
            triggerCallback('success', tx.notification?.message || 'Gate released! You may exit.');
          } else if (tx.status === 'PREORDER_COLLECTED') {
            console.log('🔥 Firebase: PREORDER_COLLECTED status detected');
            triggerCallback('success', tx.notification?.message || 'Order collected successfully!');
          } else if (tx.status === 'FLAGGED') {
            console.log('🔥 Firebase: FLAGGED status detected');
            triggerCallback('flagged', tx.notification?.message || 'Please proceed to customer service.');
          }
        }
        
        // Also check notification field
        if (tx.notification && !tx.notification.read) {
          const notifType = tx.notification.type === 'flagged' ? 'flagged' : 'success';
          console.log('🔥 Firebase notification found:', tx.notification);
          triggerCallback(notifType, tx.notification.message);
        }
      }
    }, (error) => {
      console.error('🔥 Firebase listener error:', error);
    });
  }
  
  // Initial check
  checkLocalNotifications();
  
  // Cleanup function
  return () => {
    clearInterval(localInterval);
    window.removeEventListener('storage', storageHandler);
    if (unsubscribeFirebase) {
      unsubscribeFirebase();
    }
  };
};
