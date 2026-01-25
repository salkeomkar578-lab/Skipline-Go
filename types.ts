/**
 * Skipline Go - Type Definitions
 * Complete type system for the 3-Block Architecture
 */

// ==================== PRODUCT TYPES ====================

export interface Product {
  id: string;           // Barcode as ID
  barcode?: string;     // Explicit barcode field (id is also barcode)
  name: string;
  price: number;
  category: string;
  image: string;
  icon?: string;        // Emoji icon for product
  aisle?: string;       // For navigation: "Aisle 4"
  weight?: number;      // For weight verification (grams)
  tags?: string[];      // For AI recommendations
  description?: string; // Product description for online browsing
  rating?: number;      // Product rating (1-5)
  reviews?: number;     // Number of reviews
}

export interface CartItem extends Product {
  quantity: number;
  addedAt: number;
  scannedLocation?: string;  // Aisle where item was scanned
}

// ==================== USER & AUTH TYPES ====================

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  createdAt: number;
  theftScore: number;           // 0-100, persisted across sessions
  totalTransactions: number;
  flaggedTransactions: number;
  tier: 'NEW' | 'TRUSTED' | 'VIP' | 'FLAGGED';
}

// ==================== BEHAVIOR & THEFT DETECTION ====================

export interface BehaviorLog {
  action: 'ADD' | 'REMOVE' | 'SCAN_FAIL' | 'DWELL' | 'BULK_SCAN' | 'CHECKOUT_APPROACH';
  productId: string;
  timestamp: number;
  location?: string;        // Aisle or section
  metadata?: {
    dwellTimeSeconds?: number;
    itemsInAisle?: number;
    itemValue?: number;
  };
}

export interface TheftAnalysis {
  score: number;                  // 0-100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  reasoning: string;
  flags: TheftFlag[];
  recommendation: 'INSTANT_RELEASE' | 'QUICK_CHECK' | 'FULL_AUDIT' | 'SECURITY_ALERT';
}

export interface TheftFlag {
  type: 'DWELL_TIME' | 'CART_DELETION' | 'BULK_SCAN' | 'HIGH_VALUE_REMOVAL' | 'SCAN_INCONSISTENCY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  dataPoint: string;
}

export interface DwellTimeRecord {
  aisle: string;
  enteredAt: number;
  exitedAt?: number;
  itemsScanned: number;
  expectedItems?: number;
}

// ==================== TRANSACTION TYPES ====================

export interface Transaction {
  id: string;                     // Format: SG-XXXXXX
  userId: string;
  userTier: UserProfile['tier'];
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  timestamp: number;
  theftScore: number;
  theftAnalysis: TheftAnalysis;
  status: 'PENDING' | 'PAID' | 'VERIFIED' | 'FLAGGED' | 'AUDITED' | 'PREORDER_PENDING' | 'PREORDER_READY' | 'PREORDER_COLLECTED';
  paymentMethod: 'GOOGLE_PAY' | 'CARD' | 'UPI' | 'CASH';
  exitQRToken?: string;           // JWT token for exit verification
  exitQRExpiry?: number;          // Token expiry timestamp
  verifiedBy?: string;            // Staff UID who verified
  verifiedAt?: number;
  auditNotes?: string;
  behaviorLogs: BehaviorLog[];
  sessionDuration: number;        // Total shopping time in seconds
  syncedToCloud: boolean;         // For offline mode tracking
  branch?: string;                // Mall branch name
  qrExpired?: boolean;            // Flag if QR code has been expired
  qrExpiredAt?: number;           // When QR was expired
  qrExpiredReason?: string;       // Reason for QR expiration
  // Preorder specific fields
  isPreorder?: boolean;           // True if this is a preorder
  preorderPickupCode?: string;    // Pickup code for preorder
  preorderMall?: string;          // Mall for preorder pickup
  preorderMallAddress?: string;   // Mall address
  orderType?: 'ONLINE' | 'OFFLINE'; // Type of order for history filtering
}

// ==================== CART & SESSION TYPES ====================

export interface ShoppingSession {
  sessionId: string;
  userId: string;
  startedAt: number;
  cart: CartItem[];
  behaviorLogs: BehaviorLog[];
  dwellTimes: DwellTimeRecord[];
  currentAisle?: string;
  budget?: number;
  isOffline: boolean;
  pendingSync: boolean;
}

// ==================== STAFF & ADMIN TYPES ====================

export interface StaffProfile {
  uid: string;
  name: string;
  role: 'CASHIER' | 'SECURITY' | 'MANAGER' | 'ADMIN';
  terminal: string;
  sector: string;
  verificationCount: number;
  flagsRaised: number;
}

export interface AuditLog {
  id: string;
  transactionId: string;
  staffId: string;
  action: 'VERIFIED' | 'FLAGGED' | 'MANUAL_AUDIT' | 'CLEARED' | 'ESCALATED';
  timestamp: number;
  notes?: string;
  itemsChecked?: string[];
  discrepancyFound?: boolean;
}

export interface InventoryAlert {
  productId: string;
  productName: string;
  alertType: 'LOW_STOCK' | 'HIGH_SHRINKAGE' | 'UNUSUAL_ACTIVITY';
  currentStock: number;
  threshold: number;
  timestamp: number;
}

// ==================== AI ASSISTANT TYPES ====================

export interface AIConversation {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  context?: {
    cartTotal?: number;
    budget?: number;
    currentAisle?: string;
  };
}

export interface NavigationResult {
  productName: string;
  aisle: string;
  section: string;
  nearbyItems?: string[];
  estimatedDistance?: string;
}

export interface BudgetAlert {
  currentTotal: number;
  budget: number;
  remaining: number;
  percentUsed: number;
  warning: boolean;
  suggestions?: string[];
}

// ==================== NETWORK & SYNC TYPES ====================

export interface NetworkStatus {
  isOnline: boolean;
  connectionType: 'OFFLINE' | 'LTE' | 'MALL_WIFI' | '5G';
  signalStrength: 'WEAK' | 'MODERATE' | 'STRONG';
  canSync: boolean;
  lastSyncAt?: number;
  pendingOperations: number;
}

export interface SyncOperation {
  id: string;
  type: 'TRANSACTION' | 'CART_UPDATE' | 'BEHAVIOR_LOG';
  data: any;
  createdAt: number;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'COMPLETED' | 'FAILED';
}

// ==================== APP MODE TYPES ====================

export type AppMode = 'CUSTOMER' | 'STAFF';
export type AppView = 'LOGIN' | 'SCANNER' | 'CART' | 'CHECKOUT' | 'EXIT_QR' | 'VERIFICATION' | 'DASHBOARD';
