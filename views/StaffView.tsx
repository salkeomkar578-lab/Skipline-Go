/**
 * Staff View - Skipline Go
 * Block 2: Exit Gate Verification & Dashboard
 * 
 * Features:
 * - QR Code verification with JWT decryption
 * - Transaction lookup from central store
 * - Dashboard with real-time stats
 * - Enhanced customer details display
 * - Auto QR expiration on gate release
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, ArrowLeft, Loader2, 
  BarChart3, XCircle, Unlock, Clipboard, Timer, History,
  IndianRupee, Users, TrendingUp, User, Calendar, Clock,
  CreditCard, MapPin, ShoppingBag, FileText, Shield, Activity,
  BadgeCheck, AlertCircle
} from 'lucide-react';
import { CameraScanner } from '../components/CameraScanner';
import { Transaction } from '../types';
import { verifyExitToken } from '../components/ExitQRCode';
import { 
  getTransactionById, 
  getAllTransactions,
  updateTransactionStatus as updateLocalTransactionStatus,
  getTransactionStats,
  expireTransactionQR,
  isQRExpired
} from '../services/transactionStore';
import { 
  subscribeToTransactions as subscribeToFirebaseTransactions,
  updateTransactionStatus as updateFirebaseTransactionStatus 
} from '../services/firebaseService';
import { CURRENCY_SYMBOL } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

type ViewMode = 'SCANNER' | 'DASHBOARD' | 'RESULT' | 'PREORDER_SCANNER' | 'PREORDER_RESULT' | 'HISTORY';
type VerificationStatus = 'IDLE' | 'VERIFYING' | 'SUCCESS' | 'FLAGGED' | 'EXPIRED' | 'NOT_FOUND';
type HistoryTab = 'OFFLINE' | 'ONLINE';

interface StaffViewProps {
  onExit?: () => void;
}

interface VerificationResult {
  status: VerificationStatus;
  transaction?: Transaction;
  error?: string;
}

export const StaffView: React.FC<StaffViewProps> = ({ onExit }) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('SCANNER');
  const [verification, setVerification] = useState<VerificationResult>({ status: 'IDLE' });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState(getTransactionStats());
  const [gateReleaseSuccess, setGateReleaseSuccess] = useState(false);
  
  // Preorder verification state
  const [preorderCode, setPreorderCode] = useState('');
  const [preorderVerification, setPreorderVerification] = useState<{
    status: 'IDLE' | 'VERIFYING' | 'FOUND' | 'NOT_FOUND';
    transaction?: Transaction;
  }>({ status: 'IDLE' });
  
  // History tab state
  const [historyTab, setHistoryTab] = useState<HistoryTab>('OFFLINE');

  // Subscribe to transaction updates from Firebase (real-time sync across devices)
  useEffect(() => {
    console.log('📡 Subscribing to Firebase transactions...');
    const unsubscribe = subscribeToFirebaseTransactions((txs) => {
      console.log('📦 Received', txs.length, 'transactions from Firebase');
      setTransactions(txs);
      setStats(getTransactionStats());
    });
    return () => {
      console.log('📡 Unsubscribing from Firebase transactions');
      unsubscribe();
    };
  }, []);

  // Handle QR scan
  const handleScanQR = useCallback(async (data: string) => {
    console.log('=== QR SCAN RECEIVED ===' );
    console.log('Raw data length:', data?.length);
    console.log('Raw data (first 100 chars):', data?.substring(0, 100));
    console.log('Raw data (last 50 chars):', data?.substring(data.length - 50));
    
    setVerification({ status: 'VERIFYING' });
    setViewMode('RESULT');
    
    try {
      // First try to verify as JWT token
      const jwtResult = await verifyExitToken(data);
      
      if (jwtResult.valid && jwtResult.payload) {
        const { txId } = jwtResult.payload;
        
        // Look up transaction in our store
        const transaction = getTransactionById(txId);
        
        if (transaction) {
          const isFlagged = transaction.status === 'FLAGGED' || (transaction.theftScore || 0) > 65;
          setVerification({
            status: isFlagged ? 'FLAGGED' : 'SUCCESS',
            transaction
          });
        } else {
          // Transaction not in local store but JWT valid - create from JWT data
          const mockTransaction: Transaction = {
            id: txId,
            userId: jwtResult.payload.userId || 'unknown',
            userTier: 'NEW',
            items: [],
            total: jwtResult.payload.total || 0,
            subtotal: (jwtResult.payload.total || 0) / 1.18,
            tax: (jwtResult.payload.total || 0) * 0.18 / 1.18,
            timestamp: jwtResult.payload.timestamp || Date.now(),
            theftScore: jwtResult.payload.theftScore || 0,
            theftAnalysis: {
              score: jwtResult.payload.theftScore || 0,
              riskLevel: 'Low',
              reasoning: 'Transaction verified via JWT',
              flags: [],
              recommendation: 'INSTANT_RELEASE'
            },
            status: 'PAID',
            paymentMethod: 'GOOGLE_PAY',
            behaviorLogs: [],
            sessionDuration: 0,
            syncedToCloud: false
          };
          
          setVerification({
            status: 'SUCCESS',
            transaction: mockTransaction
          });
        }
      } else if (jwtResult.expired) {
        setVerification({
          status: 'EXPIRED',
          error: 'QR code has expired. Customer must regenerate.'
        });
      } else {
        // JWT verification failed - show the actual error
        console.log('JWT verification failed:', jwtResult.error);
        
        // Try to parse as plain JSON (legacy format) only if it looks like JSON
        if (data.startsWith('{')) {
          try {
            const parsed = JSON.parse(data);
            if (parsed.txId) {
              const transaction = getTransactionById(parsed.txId);
              if (transaction) {
                setVerification({
                  status: (transaction.theftScore || 0) > 65 ? 'FLAGGED' : 'SUCCESS',
                  transaction
                });
              } else {
                setVerification({
                  status: 'NOT_FOUND',
                  error: `Transaction ${parsed.txId} not found.`
                });
              }
              return;
            }
          } catch {
            // Not valid JSON, fall through
          }
        }
        
        // Show the JWT error if available
        setVerification({
          status: 'NOT_FOUND',
          error: jwtResult.error || 'Invalid QR code format.'
        });
      }
    } catch (e: any) {
      setVerification({
        status: 'NOT_FOUND',
        error: 'Failed to verify QR code: ' + e.message
      });
    }
  }, []);

  // Handle gate release - Also expires the QR code
  const handleRelease = async () => {
    if (verification.transaction) {
      const txId = verification.transaction.id;
      
      // Update transaction status - syncs to both local and Firebase
      await updateFirebaseTransactionStatus(txId, 'VERIFIED', 'STAFF-001');
      
      // IMPORTANT: Expire the QR code so it cannot be reused
      expireTransactionQR(txId);
      
      // Send verification notification to customer view via localStorage
      localStorage.setItem(`qr_verified_${txId}`, JSON.stringify({
        type: 'success',
        message: t.staff.gateReleased,
        timestamp: Date.now()
      }));
      
      // Show success feedback
      setGateReleaseSuccess(true);
      
      // Reset after delay
      setTimeout(() => {
        setGateReleaseSuccess(false);
        resetScanner();
      }, 2000);
    }
  };

  // Handle flag for audit
  const handleFlag = async () => {
    if (verification.transaction) {
      const txId = verification.transaction.id;
      
      await updateFirebaseTransactionStatus(txId, 'FLAGGED', 'STAFF-001', 'Manual audit required');
      
      // Also expire QR when flagged
      expireTransactionQR(txId);
      
      // Send flagged notification to customer view via localStorage
      localStorage.setItem(`qr_verified_${txId}`, JSON.stringify({
        type: 'flagged',
        message: t.staff.customerFlagged,
        timestamp: Date.now()
      }));
    }
    resetScanner();
  };

  // Reset to scanner
  const resetScanner = () => {
    setVerification({ status: 'IDLE' });
    setViewMode('SCANNER');
  };

  // VERIFICATION RESULT VIEW
  if (viewMode === 'RESULT') {
    const { status, transaction, error } = verification;

    // Gate Release Success Animation
    if (gateReleaseSuccess) {
      return (
        <div className="min-h-screen bg-emerald-900 flex items-center justify-center">
          <div className="text-center animate-pulse">
            <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/50">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">{t.staff.gateReleased}</h2>
            <p className="text-emerald-300 text-lg">QR Code {t.status.expired}</p>
          </div>
        </div>
      );
    }

    // Loading state
    if (status === 'VERIFYING') {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
            <p className="text-white text-xl font-bold">{t.staff.verifying}</p>
            <p className="text-slate-500 text-sm mt-2">{t.staff.decryptingJWT}</p>
          </div>
        </div>
      );
    }

    // Error states
    if (status === 'EXPIRED' || status === 'NOT_FOUND') {
      return (
        <div className="min-h-screen bg-slate-900 p-4">
          <div className="max-w-md mx-auto pt-8">
            <button 
              onClick={resetScanner}
              className="flex items-center gap-2 text-slate-500 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> {t.actions.back}
            </button>
            
            <div className={`rounded-2xl p-8 text-center ${
              status === 'EXPIRED' ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-rose-900/20 border border-rose-500/30'
            }`}>
              {status === 'EXPIRED' ? (
                <Timer className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
              )}
              <h2 className="text-2xl font-bold text-white mb-2">
                {status === 'EXPIRED' ? t.staff.qrExpired : t.staff.verificationFailed}
              </h2>
              <p className="text-slate-400 mb-6">{error || t.staff.customerMustRegenerate}</p>
              <button
                onClick={resetScanner}
                className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold"
              >
                {t.staff.scanAgain}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Success or Flagged - Enhanced Customer Details View
    if ((status === 'SUCCESS' || status === 'FLAGGED') && transaction) {
      const isFlagged = status === 'FLAGGED' || (transaction.theftScore || 0) > 65;
      const shopDate = new Date(transaction.timestamp);
      const sessionMins = Math.floor((transaction.sessionDuration || 0) / 60);
      const sessionSecs = (transaction.sessionDuration || 0) % 60;
      
      // Get tier color
      const getTierColor = (tier: string) => {
        switch(tier) {
          case 'VIP': return 'bg-amber-500 text-white';
          case 'TRUSTED': return 'bg-emerald-500 text-white';
          case 'FLAGGED': return 'bg-rose-500 text-white';
          default: return 'bg-blue-500 text-white';
        }
      };
      
      return (
        <div className="min-h-screen bg-slate-900 p-4 pb-32">
          <div className="max-w-lg mx-auto pt-4">
            <button 
              onClick={resetScanner}
              className="flex items-center gap-2 text-slate-500 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> {t.staff.backToScanner}
            </button>
            
            {/* Main Status Card */}
            <div className={`rounded-2xl p-6 border-2 ${
              isFlagged 
                ? 'bg-orange-900/20 border-orange-500' 
                : 'bg-emerald-900/20 border-emerald-500'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase">{t.staff.transaction}</p>
                  <p className="text-white text-xl font-mono font-bold">{transaction.id}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  isFlagged 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-emerald-500 text-white'
                }`}>
                  {isFlagged ? t.staff.needsCheck : 'CLEARED'}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-xs mb-1">{t.customer.items}</p>
                  <p className="text-white text-2xl font-bold">{transaction.items?.length || 0}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-xs mb-1">{t.shopping.total}</p>
                  <p className="text-blue-400 text-2xl font-bold">{CURRENCY_SYMBOL}{transaction.total?.toFixed(0) || 0}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-xs mb-1">{t.staff.risk}</p>
                  <p className={`text-2xl font-bold ${
                    (transaction.theftScore || 0) > 65 ? 'text-orange-500' : 
                    (transaction.theftScore || 0) > 35 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>{transaction.theftScore || 0}%</p>
                </div>
              </div>
            </div>
            
            {/* ENHANCED CUSTOMER DETAILS SECTION */}
            <div className="mt-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
              {/* Section Header */}
              <div className="bg-slate-800 px-5 py-4 border-b border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{t.staff.customerDetails}</h3>
                  <p className="text-slate-500 text-xs">{t.staff.verificationStatus}</p>
                </div>
              </div>
              
              {/* Customer Info Grid */}
              <div className="p-5 space-y-4">
                {/* Row 1: Customer ID & Tier */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BadgeCheck className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-400 text-xs uppercase">{t.staff.customerId}</p>
                    </div>
                    <p className="text-white font-mono font-bold text-sm truncate">{transaction.userId}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-400 text-xs uppercase">{t.staff.customerTier}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTierColor(transaction.userTier)}`}>
                      {t.tiers[transaction.userTier?.toLowerCase() as keyof typeof t.tiers] || transaction.userTier}
                    </span>
                  </div>
                </div>
                
                {/* Row 2: Shopping Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-400 text-xs uppercase">{t.staff.shopDate}</p>
                    </div>
                    <p className="text-white font-bold">{shopDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-400 text-xs uppercase">{t.staff.shopTime}</p>
                    </div>
                    <p className="text-white font-bold">{shopDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                
                {/* Row 3: Session Duration & Payment */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-400 text-xs uppercase">{t.staff.sessionDuration}</p>
                    </div>
                    <p className="text-white font-bold">{sessionMins}m {sessionSecs}s</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-400 text-xs uppercase">{t.staff.paymentMethod}</p>
                    </div>
                    <p className="text-white font-bold">{transaction.paymentMethod?.replace('_', ' ')}</p>
                  </div>
                </div>
                
                {/* Row 4: Branch */}
                {(transaction as any).branch && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <p className="text-slate-400 text-xs uppercase">{t.staff.branch}</p>
                    </div>
                    <p className="text-white font-bold">{(transaction as any).branch}</p>
                  </div>
                )}
                
                {/* Financial Summary */}
                <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <p className="text-blue-400 text-xs font-bold uppercase">Financial Summary</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">{t.staff.itemsPurchased}</p>
                      <p className="text-white font-bold text-lg">{transaction.items?.length || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">{t.staff.taxPaid}</p>
                      <p className="text-white font-bold text-lg">{CURRENCY_SYMBOL}{transaction.tax?.toFixed(0) || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">{t.staff.totalAmount}</p>
                      <p className="text-emerald-400 font-black text-xl">{CURRENCY_SYMBOL}{transaction.total?.toFixed(0) || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Analysis */}
            {transaction.theftAnalysis && (
              <div className="mt-4 bg-white/5 p-5 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className={`w-5 h-5 ${
                    (transaction.theftScore || 0) > 65 ? 'text-orange-500' : 
                    (transaction.theftScore || 0) > 35 ? 'text-amber-500' : 'text-emerald-500'
                  }`} />
                  <p className="text-slate-400 text-sm font-bold uppercase">{t.staff.behaviorAnalysis}</p>
                </div>
                <p className="text-white text-sm leading-relaxed">{transaction.theftAnalysis.reasoning}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    transaction.theftAnalysis.riskLevel === 'High' || transaction.theftAnalysis.riskLevel === 'Critical'
                      ? 'bg-rose-500/20 text-rose-400'
                      : transaction.theftAnalysis.riskLevel === 'Medium'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {transaction.theftAnalysis.riskLevel} Risk
                  </span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-slate-400 text-xs">{transaction.theftAnalysis.recommendation?.replace('_', ' ')}</span>
                </div>
              </div>
            )}
            
            {/* Cart Contents */}
            {transaction.items && transaction.items.length > 0 && (
              <div className="mt-4 bg-white/5 rounded-xl border border-slate-700 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-700 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-400 text-xs font-bold uppercase">{t.staff.cartContents}</p>
                  <span className="ml-auto bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold">
                    {transaction.items.length} items
                  </span>
                </div>
                <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                  {transaction.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                      <img src={item.image} className="w-12 h-12 rounded-lg object-cover" alt={item.name} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        <p className="text-slate-500 text-xs">×{item.quantity} • {CURRENCY_SYMBOL}{item.price}/unit</p>
                      </div>
                      <p className="text-white font-bold">{CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-800">
              <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
                {isFlagged ? (
                  <>
                    <button
                      onClick={handleRelease}
                      className="bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-emerald-700"
                    >
                      <Unlock className="w-5 h-5" /> {t.staff.release}
                    </button>
                    <button
                      onClick={handleFlag}
                      className="bg-orange-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-orange-700"
                    >
                      <Clipboard className="w-5 h-5" /> {t.staff.fullAudit}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleRelease}
                    className="col-span-2 bg-emerald-600 text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-2 active:bg-emerald-700"
                  >
                    <Unlock className="w-6 h-6" /> {t.staff.releaseGate}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  // DASHBOARD VIEW with Enhanced Modern UI
  if (viewMode === 'DASHBOARD') {
    // Calculate theft analytics
    const highRiskCount = transactions.filter(t => (t.theftScore || 0) > 65).length;
    const mediumRiskCount = transactions.filter(t => (t.theftScore || 0) > 35 && (t.theftScore || 0) <= 65).length;
    const lowRiskCount = transactions.filter(t => (t.theftScore || 0) <= 35).length;
    const avgTheftScore = transactions.length > 0 
      ? Math.round(transactions.reduce((sum, t) => sum + (t.theftScore || 0), 0) / transactions.length)
      : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setViewMode('SCANNER')}
              className="flex items-center gap-2 text-slate-400 hover:text-white bg-white/5 px-4 py-2 rounded-xl border border-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> {t.actions.back}
            </button>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              {t.staff.dashboard}
            </h1>
            <div className="w-16" />
          </div>
          
          {/* Stats Grid with 3D Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-3xl p-6 transform hover:scale-[1.02] transition-all shadow-xl">
              <div className="flex items-center gap-2 text-slate-500 text-xs uppercase mb-3">
                <Users className="w-4 h-4" /> {t.staff.totalTransactions}
              </div>
              <p className="text-5xl font-black text-white">{stats.totalTransactions}</p>
              <p className="text-slate-500 text-sm mt-1">customers today</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-3xl p-6 transform hover:scale-[1.02] transition-all shadow-xl">
              <div className="flex items-center gap-2 text-indigo-400/60 text-xs uppercase mb-3">
                <IndianRupee className="w-4 h-4" /> {t.staff.revenue}
              </div>
              <p className="text-5xl font-black text-white">{CURRENCY_SYMBOL}{stats.totalRevenue.toFixed(0)}</p>
              <p className="text-indigo-400/60 text-sm mt-1">total revenue</p>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-rose-900/30 border border-orange-500/30 rounded-3xl p-6 transform hover:scale-[1.02] transition-all shadow-xl">
              <div className="flex items-center gap-2 text-orange-500/60 text-xs uppercase mb-3">
                <AlertTriangle className="w-4 h-4" /> {t.staff.flagged}
              </div>
              <p className="text-5xl font-black text-orange-400">{stats.flaggedCount}</p>
              <p className="text-orange-400/60 text-sm mt-1">needs review</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-3xl p-6 transform hover:scale-[1.02] transition-all shadow-xl">
              <div className="flex items-center gap-2 text-emerald-500/60 text-xs uppercase mb-3">
                <CheckCircle2 className="w-4 h-4" /> {t.staff.verified}
              </div>
              <p className="text-5xl font-black text-emerald-400">{stats.verifiedCount}</p>
              <p className="text-emerald-400/60 text-sm mt-1">cleared exits</p>
            </div>
          </div>
          
          {/* Theft Score Analytics Card */}
          <div className="bg-gradient-to-br from-rose-900/20 to-orange-900/20 border border-rose-500/20 rounded-3xl p-6 mb-6 shadow-xl">
            <div className="flex items-center gap-2 text-rose-400 text-sm font-bold uppercase mb-5">
              <Shield className="w-5 h-5" /> {t.staff.theftRiskAnalytics}
            </div>
            
            {/* Average Score Gauge with 3D Effect */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-sm">{t.staff.avgRiskScore}</p>
                <p className={`text-6xl font-black ${
                  avgTheftScore > 65 ? 'text-rose-500' : 
                  avgTheftScore > 35 ? 'text-amber-500' : 'text-emerald-500'
                }`}>{avgTheftScore}%</p>
                <p className="text-slate-500 text-sm mt-1">
                  {avgTheftScore > 65 ? 'High risk detected' : 
                   avgTheftScore > 35 ? 'Moderate risk level' : 'System secure'}
                </p>
              </div>
              <div className="w-28 h-28 rounded-full border-8 border-slate-700 relative flex items-center justify-center shadow-2xl" 
                style={{ boxShadow: `0 0 40px ${avgTheftScore > 65 ? 'rgba(244,63,94,0.3)' : avgTheftScore > 35 ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}` }}>
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(${
                      avgTheftScore > 65 ? '#f43f5e' : avgTheftScore > 35 ? '#f59e0b' : '#10b981'
                    } ${avgTheftScore * 3.6}deg, transparent 0deg)`
                  }}
                />
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center z-10">
                  <span className="text-white font-black text-2xl">{avgTheftScore}</span>
                </div>
              </div>
            </div>
            
            {/* Risk Distribution with 3D Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center transform hover:scale-105 transition-all">
                <p className="text-emerald-400 text-3xl font-black">{lowRiskCount}</p>
                <p className="text-emerald-400/70 text-sm font-bold">{t.staff.lowRisk}</p>
                <div className="mt-2 h-1 bg-emerald-500/30 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(lowRiskCount / (transactions.length || 1)) * 100}%` }} />
                </div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center transform hover:scale-105 transition-all">
                <p className="text-amber-400 text-3xl font-black">{mediumRiskCount}</p>
                <p className="text-amber-400/70 text-sm font-bold">{t.staff.medium}</p>
                <div className="mt-2 h-1 bg-amber-500/30 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${(mediumRiskCount / (transactions.length || 1)) * 100}%` }} />
                </div>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-center transform hover:scale-105 transition-all">
                <p className="text-rose-400 text-3xl font-black">{highRiskCount}</p>
                <p className="text-rose-400/70 text-sm font-bold">{t.staff.highRisk}</p>
                <div className="mt-2 h-1 bg-rose-500/30 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${(highRiskCount / (transactions.length || 1)) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Transactions with Enhanced UI */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase">
                <History className="w-4 h-4" /> {t.staff.recentTransactions}
              </div>
              <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                {transactions.length} total
              </span>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-500">{t.staff.noTransactionsYet}</p>
                </div>
              ) : (
                transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        (tx.theftScore || 0) > 65 ? 'bg-rose-500/20' :
                        (tx.theftScore || 0) > 35 ? 'bg-amber-500/20' : 'bg-emerald-500/20'
                      }`}>
                        {(tx.theftScore || 0) > 65 ? (
                          <AlertTriangle className="w-6 h-6 text-rose-400" />
                        ) : (
                          <CheckCircle2 className={`w-6 h-6 ${
                            (tx.theftScore || 0) > 35 ? 'text-amber-400' : 'text-emerald-400'
                          }`} />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-mono font-bold text-sm">{tx.id}</p>
                        <p className="text-slate-500 text-xs flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                        (tx.theftScore || 0) > 65 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        (tx.theftScore || 0) > 35 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {tx.theftScore || 0}% risk
                      </div>
                      <div>
                        <p className="text-white font-black text-lg">{CURRENCY_SYMBOL}{tx.total?.toFixed(0) || 0}</p>
                        <p className={`text-xs font-bold ${
                          tx.status === 'VERIFIED' ? 'text-emerald-400' :
                          tx.status === 'FLAGGED' ? 'text-orange-400' : 'text-blue-400'
                        }`}>{t.status[tx.status?.toLowerCase() as keyof typeof t.status] || tx.status}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // PREORDER PICKUP VIEW - Code Only (No QR)
  // ============================================
  if (viewMode === 'PREORDER_SCANNER') {
    // Get all preorders for display
    const allPreorders = transactions.filter(tx => tx.isPreorder === true);
    const pendingPreorders = allPreorders.filter(tx => tx.status !== 'PREORDER_COLLECTED');
    const collectedPreorders = allPreorders.filter(tx => tx.status === 'PREORDER_COLLECTED');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-4 pb-8">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setViewMode('SCANNER')}
              className="flex items-center gap-2 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              Preorder Pickup
            </h1>
            <div className="w-16" />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-amber-400">{pendingPreorders.length}</p>
              <p className="text-amber-400/70 text-sm">Pending Pickup</p>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-emerald-400">{collectedPreorders.length}</p>
              <p className="text-emerald-400/70 text-sm">Collected Today</p>
            </div>
          </div>
          
          {/* Pickup Code Search */}
          <div className="bg-purple-900/30 rounded-2xl p-5 mb-6 border-2 border-purple-500/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <p className="text-white font-bold">Enter Pickup Code</p>
            </div>
            <input
              type="text"
              value={preorderCode}
              onChange={(e) => {
                setPreorderCode(e.target.value.toUpperCase());
                setPreorderVerification({ status: 'IDLE' }); // Reset error on input change
              }}
              placeholder="PU-XXXXXX"
              className="w-full bg-slate-800 text-white text-3xl font-mono text-center py-5 rounded-xl border-2 border-purple-500/50 focus:border-purple-400 outline-none tracking-[0.25em] placeholder:tracking-normal placeholder:text-xl"
              autoFocus
            />
            <button
              onClick={() => {
                if (!preorderCode.trim()) return;
                setPreorderVerification({ status: 'VERIFYING' });
                
                // Use transactions from Firebase real-time subscription (already synced across devices)
                // Also merge with localStorage for any pending local transactions
                const localTransactions = getAllTransactions();
                const allTransactions = [...transactions];
                
                // Add any local transactions not already in Firebase sync
                localTransactions.forEach(localTx => {
                  if (!allTransactions.find(tx => tx.id === localTx.id)) {
                    allTransactions.push(localTx);
                  }
                });
                
                const freshPreorders = allTransactions.filter(tx => tx.isPreorder === true);
                
                console.log('🔍 Searching for code:', preorderCode.trim());
                console.log('📦 Firebase preorders:', transactions.filter(tx => tx.isPreorder).length);
                console.log('📦 Local preorders:', localTransactions.filter(tx => tx.isPreorder).length);
                console.log('📦 Combined preorders:', freshPreorders.length);
                console.log('📋 All pickup codes:', freshPreorders.map(tx => tx.preorderPickupCode));
                
                // Search preorders by pickup code
                const searchCode = preorderCode.trim().toUpperCase();
                
                // Direct match first
                let found = freshPreorders.find(tx => {
                  const txPickupCode = (tx.preorderPickupCode || '').toUpperCase();
                  return txPickupCode === searchCode;
                });
                
                // If not found, try partial match
                if (!found) {
                  found = freshPreorders.find(tx => {
                    const txPickupCode = (tx.preorderPickupCode || '').toUpperCase();
                    return txPickupCode.includes(searchCode) || searchCode.includes(txPickupCode);
                  });
                }
                
                // Also try transaction ID
                if (!found) {
                  found = freshPreorders.find(tx => tx.id.toUpperCase() === searchCode);
                }
                
                if (found) {
                  console.log('✅ PREORDER found:', found.id, 'Code:', found.preorderPickupCode);
                  const txWithItems = {
                    ...found,
                    items: found.items ? found.items.map(item => ({...item})) : []
                  };
                  setPreorderVerification({ status: 'FOUND', transaction: txWithItems });
                  setViewMode('PREORDER_RESULT');
                } else {
                  console.log('❌ Not found. Available codes:', freshPreorders.map(tx => tx.preorderPickupCode));
                  setPreorderVerification({ status: 'NOT_FOUND' });
                }
              }}
              disabled={preorderVerification.status === 'VERIFYING' || !preorderCode.trim()}
              className="w-full mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              {preorderVerification.status === 'VERIFYING' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Searching...</>
              ) : (
                <>🔍 Find Order</>
              )}
            </button>
            
            {preorderVerification.status === 'NOT_FOUND' && (
              <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
                <p className="text-red-400 font-bold">❌ Order Not Found</p>
                <p className="text-red-400/70 text-sm mt-1">Check the code and try again</p>
              </div>
            )}
          </div>
          
          {/* Pending Preorders List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Pending Pickups ({pendingPreorders.length})
              </h3>
              <button
                onClick={() => {
                  const fresh = getAllTransactions();
                  setTransactions(fresh);
                  console.log('🔄 Refreshed transactions. Preorders:', fresh.filter(tx => tx.isPreorder).length);
                }}
                className="text-sm bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-purple-500/30 transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {pendingPreorders.length === 0 ? (
                <div className="bg-slate-800/30 rounded-xl p-6 text-center">
                  <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500">No pending preorders</p>
                </div>
              ) : (
                pendingPreorders.map(tx => (
                  <button
                    key={tx.id}
                    onClick={() => {
                      const txWithItems = {
                        ...tx,
                        items: tx.items ? tx.items.map(item => ({...item})) : []
                      };
                      setPreorderVerification({ status: 'FOUND', transaction: txWithItems });
                      setViewMode('PREORDER_RESULT');
                    }}
                    className="w-full bg-slate-800/50 p-4 rounded-xl border border-amber-500/30 flex items-center justify-between text-left hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div>
                        <p className="text-white font-mono font-bold text-lg">{tx.preorderPickupCode}</p>
                        <p className="text-slate-400 text-sm">{tx.items?.length || 0} items • ₹{tx.total.toFixed(0)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full font-bold">
                        PENDING
                      </span>
                      <p className="text-slate-500 text-xs mt-1">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // PREORDER RESULT VIEW
  // ============================================
  if (viewMode === 'PREORDER_RESULT' && preorderVerification.transaction) {
    const tx = preorderVerification.transaction;
    const isCollected = tx.status === 'PREORDER_COLLECTED';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-4 pb-32">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={() => {
              setViewMode('PREORDER_SCANNER');
              setPreorderCode('');
              setPreorderVerification({ status: 'IDLE' });
            }}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {/* Order Found Card */}
          <div className={`rounded-2xl p-6 border-2 mb-4 ${
            isCollected 
              ? 'bg-slate-800/50 border-slate-600' 
              : 'bg-purple-900/20 border-purple-500'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-500 text-xs">PICKUP CODE</p>
                <p className="text-white text-3xl font-mono font-bold">{tx.preorderPickupCode}</p>
              </div>
              <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                isCollected ? 'bg-slate-600 text-slate-300' : 'bg-purple-500 text-white'
              }`}>
                {isCollected ? 'COLLECTED' : 'READY'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 p-3 rounded-xl">
                <p className="text-slate-500 text-xs">Items</p>
                <p className="text-white font-bold text-lg">{tx.items?.length || 0}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <p className="text-slate-500 text-xs">Total</p>
                <p className="text-emerald-400 font-bold text-lg">₹{tx.total.toFixed(0)}</p>
              </div>
            </div>
            
            {tx.preorderMall && (
              <div className="bg-white/5 p-3 rounded-xl mb-4">
                <p className="text-slate-500 text-xs">Pickup Store</p>
                <p className="text-white font-bold">{tx.preorderMall}</p>
              </div>
            )}
          </div>
          
          {/* Items List with Images */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 mb-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              Order Items ({tx.items?.length || 0})
            </h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {(!tx.items || tx.items.length === 0) ? (
                <div className="text-center py-6">
                  <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No items found in order</p>
                  <p className="text-slate-600 text-xs mt-1">Order ID: {tx.id}</p>
                </div>
              ) : (
                tx.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                    <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                      {item.icon || '📦'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{item.name}</p>
                      <p className="text-slate-500 text-xs">×{item.quantity} • ₹{item.price}/unit</p>
                    </div>
                    <p className="text-white font-bold">₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Action Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-800">
            <div className="max-w-lg mx-auto">
              {!isCollected ? (
                <button
                  onClick={async () => {
                    // Mark as collected - updates both local storage AND Firebase
                    await updateFirebaseTransactionStatus(tx.id, 'PREORDER_COLLECTED', 'STAFF-001');
                    
                    // Send notification to customer that order is collected
                    const notificationKey = `preorder_verified_${tx.id}`;
                    console.log('📢 Sending pickup notification:', notificationKey);
                    localStorage.setItem(notificationKey, JSON.stringify({
                      type: 'success',
                      message: 'Order collected successfully!',
                      timestamp: Date.now()
                    }));
                    
                    setPreorderVerification({ 
                      status: 'FOUND', 
                      transaction: { ...tx, status: 'PREORDER_COLLECTED' }
                    });
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Mark as Collected
                </button>
              ) : (
                <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-emerald-400 font-bold">Order Collected</p>
                  <p className="text-slate-400 text-sm">Customer has picked up this order</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // HISTORY VIEW with Tabs
  // ============================================
  if (viewMode === 'HISTORY') {
    const onlineOrders = transactions.filter(tx => tx.isPreorder);
    const offlineOrders = transactions.filter(tx => !tx.isPreorder);
    const displayOrders = historyTab === 'ONLINE' ? onlineOrders : offlineOrders;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setViewMode('SCANNER')}
              className="flex items-center gap-2 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-lg font-bold text-white">Transaction History</h1>
            <div className="w-16" />
          </div>
          
          {/* Tabs */}
          <div className="bg-slate-800 rounded-xl p-1 flex gap-1 mb-4">
            <button
              onClick={() => setHistoryTab('OFFLINE')}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                historyTab === 'OFFLINE' 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-slate-400'
              }`}
            >
              In-Store ({offlineOrders.length})
            </button>
            <button
              onClick={() => setHistoryTab('ONLINE')}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                historyTab === 'ONLINE' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-slate-400'
              }`}
            >
              Preorders ({onlineOrders.length})
            </button>
          </div>
          
          {/* Orders List */}
          <div className="space-y-3">
            {displayOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">No orders in this category</p>
              </div>
            ) : (
              displayOrders.map(tx => (
                <div key={tx.id} className={`rounded-xl p-4 border ${
                  tx.isPreorder 
                    ? 'bg-purple-900/20 border-purple-500/30' 
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-mono">{tx.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      tx.status === 'VERIFIED' || tx.status === 'PREORDER_COLLECTED' ? 'bg-emerald-500/20 text-emerald-400' :
                      tx.status === 'PAID' || tx.status === 'PREORDER_PENDING' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {tx.status.replace('_', ' ')}
                    </span>
                  </div>
                  {tx.isPreorder && tx.preorderPickupCode && (
                    <p className="text-purple-400 font-mono font-bold mb-2">{tx.preorderPickupCode}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-white font-bold">{tx.items?.length || 0} items</p>
                    <p className="text-white font-bold">₹{tx.total.toFixed(0)}</p>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    {new Date(tx.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // SCANNER VIEW (Default) - Modern Dark Theme with 3D Elements
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header with 3D Effect */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {onExit && (
              <button
                onClick={onExit}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 transform hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">{t.staff.exitGate}</h1>
              <p className="text-emerald-400/60 text-xs font-medium">{t.staff.staffTerminal} • Gate 01</p>
            </div>
          </div>
          <button
            onClick={() => setViewMode('DASHBOARD')}
            className="bg-white/10 backdrop-blur text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 border border-white/10 hover:bg-white/20 transition-all hover:scale-105 shadow-lg"
          >
            <BarChart3 className="w-4 h-4" /> {t.staff.dashboard}
          </button>
        </div>
        
        {/* Mode Selector - Exit Gate vs Preorder Pickup */}
        <div className="bg-slate-800 rounded-xl p-1 flex gap-1 mb-4">
          <button
            className="flex-1 bg-emerald-500 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Exit Gate
          </button>
          <button
            onClick={() => {
              // Refresh transactions when entering preorder scanner
              setTransactions(getAllTransactions());
              setViewMode('PREORDER_SCANNER');
            }}
            className="flex-1 text-slate-400 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:text-white transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> Preorder Pickup
          </button>
        </div>
        
        {/* Live Status Banner */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl p-4 mb-6 border border-emerald-500/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
              <span className="text-emerald-300 font-bold text-sm">SYSTEM ACTIVE</span>
            </div>
            <div className="text-slate-400 text-xs flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        
        {/* Scanner with Enhanced UI */}
        <div className="bg-slate-800/50 rounded-3xl p-1 border border-slate-700/50 shadow-2xl backdrop-blur">
          <CameraScanner
            title={t.staff.scanCustomerExitQR}
            onScan={handleScanQR}
            isQR={true}
          />
        </div>
        
        {/* Quick Stats with 3D Cards */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-center transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg group">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-500/30 transition-colors">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">{t.staff.today}</p>
            <p className="text-3xl font-black text-white">{stats.totalTransactions}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-orange-500/20 rounded-2xl p-4 text-center transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg group">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-500/30 transition-colors">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-orange-400/60 text-[10px] uppercase tracking-wider mb-1">{t.staff.flagged}</p>
            <p className="text-3xl font-black text-orange-400">{stats.flaggedCount}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-emerald-500/20 rounded-2xl p-4 text-center transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg group">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-500/30 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-emerald-400/60 text-[10px] uppercase tracking-wider mb-1">{t.staff.cleared}</p>
            <p className="text-3xl font-black text-emerald-400">{stats.verifiedCount}</p>
          </div>
        </div>
        
        {/* Revenue Card */}
        <div className="mt-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-5 border border-indigo-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-300/60 text-xs uppercase tracking-wider mb-1">{t.staff.revenue}</p>
              <p className="text-4xl font-black text-white">{CURRENCY_SYMBOL}{stats.totalRevenue.toFixed(0)}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        {/* Pending Queue */}
        {stats.pendingCount > 0 && (
          <div className="mt-4 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
            <div>
              <p className="text-amber-400 font-bold">{stats.pendingCount} {t.staff.pendingVerification}</p>
              <p className="text-amber-400/60 text-xs">Customers waiting at exit</p>
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button 
            onClick={() => setViewMode('HISTORY')}
            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-left hover:bg-slate-800 transition-colors group"
          >
            <History className="w-6 h-6 text-slate-400 mb-2 group-hover:text-white transition-colors" />
            <p className="text-white font-bold text-sm">{t.staff.recentTransactions}</p>
            <p className="text-slate-500 text-xs">View history</p>
          </button>
          <button 
            onClick={() => setViewMode('DASHBOARD')}
            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-left hover:bg-slate-800 transition-colors group"
          >
            <BarChart3 className="w-6 h-6 text-slate-400 mb-2 group-hover:text-white transition-colors" />
            <p className="text-white font-bold text-sm">{t.staff.theftRiskAnalytics}</p>
            <p className="text-slate-500 text-xs">AI Insights</p>
          </button>
        </div>
        
        {/* Settings Section - Language & Exit */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3">Settings</p>
          <div className="flex gap-3">
            {/* Language Selector */}
            <div className="flex-1">
              <LanguageSelector variant="dark" showLabel={true} />
            </div>
            
            {/* Exit Button */}
            {onExit && (
              <button
                onClick={onExit}
                className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-500/30 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Exit App
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
