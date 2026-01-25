/**
 * Transaction Store Service - Skipline Go
 * Central data store for all transactions
 * Uses localStorage for persistence (production would use Firebase)
 * 
 * This is the SINGLE SOURCE OF TRUTH for all transaction data
 * Both Customer and Staff blocks read/write from here
 */

import { Transaction, CartItem, TheftAnalysis } from '../types';

const STORAGE_KEY = 'skipline_transactions';
const SESSION_KEY = 'skipline_current_session';

// Event system for real-time updates
type TransactionListener = (transactions: Transaction[]) => void;
const listeners: Set<TransactionListener> = new Set();

/**
 * Get all transactions from storage
 */
export const getAllTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Get a specific transaction by ID
 */
export const getTransactionById = (txId: string): Transaction | null => {
  const transactions = getAllTransactions();
  return transactions.find(t => t.id === txId) || null;
};

/**
 * Save a new transaction
 */
export const saveTransaction = (transaction: Transaction): void => {
  const transactions = getAllTransactions();
  const existingIndex = transactions.findIndex(t => t.id === transaction.id);
  
  if (existingIndex >= 0) {
    transactions[existingIndex] = transaction;
  } else {
    transactions.unshift(transaction); // Add to beginning
  }
  
  // Keep only last 100 transactions
  const trimmed = transactions.slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  
  // Notify listeners
  notifyListeners();
};

/**
 * Update transaction status
 */
export const updateTransactionStatus = (
  txId: string, 
  status: Transaction['status'],
  verifiedBy?: string,
  auditNotes?: string
): boolean => {
  const transactions = getAllTransactions();
  const index = transactions.findIndex(t => t.id === txId);
  
  if (index >= 0) {
    transactions[index] = {
      ...transactions[index],
      status,
      verifiedBy,
      verifiedAt: Date.now(),
      auditNotes
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    notifyListeners();
    return true;
  }
  return false;
};

/**
 * Expire QR code for a transaction (called when gate is released)
 * This invalidates the exit QR token so it cannot be reused
 */
export const expireTransactionQR = (txId: string): boolean => {
  const transactions = getAllTransactions();
  const index = transactions.findIndex(t => t.id === txId);
  
  if (index >= 0) {
    transactions[index] = {
      ...transactions[index],
      exitQRExpiry: Date.now() - 1000, // Set expiry to past time
      qrExpired: true, // Flag as expired
      qrExpiredAt: Date.now(),
      qrExpiredReason: 'GATE_RELEASED'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    notifyListeners();
    return true;
  }
  return false;
};

/**
 * Check if QR is expired for a transaction
 */
export const isQRExpired = (txId: string): boolean => {
  const transaction = getTransactionById(txId);
  if (!transaction) return true;
  
  // Check if manually expired
  if ((transaction as any).qrExpired) return true;
  
  // Check if expired by time
  if (transaction.exitQRExpiry && transaction.exitQRExpiry < Date.now()) return true;
  
  return false;
};

/**
 * Subscribe to transaction changes
 */
export const subscribeToTransactions = (callback: TransactionListener): (() => void) => {
  listeners.add(callback);
  // Immediately call with current data
  callback(getAllTransactions());
  // Return unsubscribe function
  return () => listeners.delete(callback);
};

/**
 * Notify all listeners of changes
 */
const notifyListeners = (): void => {
  const transactions = getAllTransactions();
  listeners.forEach(listener => listener(transactions));
};

/**
 * Generate unique transaction ID
 */
export const generateTransactionId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SG-${timestamp}-${random}`;
};

/**
 * Get transaction statistics
 */
export const getTransactionStats = () => {
  const transactions = getAllTransactions();
  const today = new Date().setHours(0, 0, 0, 0);
  const todayTransactions = transactions.filter(t => t.timestamp >= today);
  
  return {
    totalTransactions: todayTransactions.length,
    totalRevenue: todayTransactions.reduce((sum, t) => sum + t.total, 0),
    flaggedCount: todayTransactions.filter(t => t.status === 'FLAGGED').length,
    verifiedCount: todayTransactions.filter(t => t.status === 'VERIFIED').length,
    pendingCount: todayTransactions.filter(t => t.status === 'PAID').length,
    averageTheftScore: todayTransactions.length > 0
      ? todayTransactions.reduce((sum, t) => sum + (t.theftScore || 0), 0) / todayTransactions.length
      : 0,
    highRiskCount: todayTransactions.filter(t => (t.theftScore || 0) > 65).length
  };
};

/**
 * Clear all transactions (for testing)
 */
export const clearAllTransactions = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  notifyListeners();
};

// Current shopping session management
export const saveCurrentSession = (data: any): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
};

export const getCurrentSession = (): any | null => {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearCurrentSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};
