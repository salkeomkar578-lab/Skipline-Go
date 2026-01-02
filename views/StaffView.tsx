/**
 * Staff View - Skipline Go
 * Block 2: Exit Gate Verification & Dashboard
 * 
 * Features:
 * - QR Code verification with JWT decryption
 * - Transaction lookup from central store
 * - Dashboard with real-time stats
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, ArrowLeft, Loader2, 
  BarChart3, XCircle, Unlock, Clipboard, Timer, History,
  IndianRupee, Users, TrendingUp
} from 'lucide-react';
import { CameraScanner } from '../components/CameraScanner';
import { Transaction } from '../types';
import { verifyExitToken } from '../components/ExitQRCode';
import { 
  getTransactionById, 
  getAllTransactions,
  updateTransactionStatus,
  subscribeToTransactions,
  getTransactionStats
} from '../services/transactionStore';
import { CURRENCY_SYMBOL } from '../constants';

type ViewMode = 'SCANNER' | 'DASHBOARD' | 'RESULT';
type VerificationStatus = 'IDLE' | 'VERIFYING' | 'SUCCESS' | 'FLAGGED' | 'EXPIRED' | 'NOT_FOUND';

interface VerificationResult {
  status: VerificationStatus;
  transaction?: Transaction;
  error?: string;
}

export const StaffView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('SCANNER');
  const [verification, setVerification] = useState<VerificationResult>({ status: 'IDLE' });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState(getTransactionStats());

  // Subscribe to transaction updates
  useEffect(() => {
    const unsubscribe = subscribeToTransactions((txs) => {
      setTransactions(txs);
      setStats(getTransactionStats());
    });
    return () => unsubscribe();
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

  // Handle gate release
  const handleRelease = () => {
    if (verification.transaction) {
      updateTransactionStatus(verification.transaction.id, 'VERIFIED', 'STAFF-001');
    }
    resetScanner();
  };

  // Handle flag for audit
  const handleFlag = () => {
    if (verification.transaction) {
      updateTransactionStatus(verification.transaction.id, 'FLAGGED', 'STAFF-001', 'Manual audit required');
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

    // Loading state
    if (status === 'VERIFYING') {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
            <p className="text-white text-xl font-bold">Verifying...</p>
            <p className="text-slate-500 text-sm mt-2">Decrypting JWT token</p>
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
              <ArrowLeft className="w-4 h-4" /> Back
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
                {status === 'EXPIRED' ? 'QR Expired' : 'Verification Failed'}
              </h2>
              <p className="text-slate-400 mb-6">{error}</p>
              <button
                onClick={resetScanner}
                className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold"
              >
                Scan Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Success or Flagged
    if ((status === 'SUCCESS' || status === 'FLAGGED') && transaction) {
      const isFlagged = status === 'FLAGGED' || (transaction.theftScore || 0) > 65;
      
      return (
        <div className="min-h-screen bg-slate-900 p-4">
          <div className="max-w-lg mx-auto pt-4">
            <button 
              onClick={resetScanner}
              className="flex items-center gap-2 text-slate-500 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Scanner
            </button>
            
            {/* Status Card */}
            <div className={`rounded-2xl p-6 border-2 ${
              isFlagged 
                ? 'bg-orange-900/20 border-orange-500' 
                : 'bg-emerald-900/20 border-emerald-500'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase">Transaction</p>
                  <p className="text-white text-xl font-mono font-bold">{transaction.id}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  isFlagged 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-emerald-500 text-white'
                }`}>
                  {isFlagged ? 'NEEDS CHECK' : 'CLEARED'}
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-xs mb-1">Items</p>
                  <p className="text-white text-2xl font-bold">{transaction.items?.length || 0}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-xs mb-1">Total</p>
                  <p className="text-blue-400 text-2xl font-bold">{CURRENCY_SYMBOL}{transaction.total?.toFixed(0) || 0}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <p className="text-slate-500 text-xs mb-1">Risk</p>
                  <p className={`text-2xl font-bold ${
                    (transaction.theftScore || 0) > 65 ? 'text-orange-500' : 
                    (transaction.theftScore || 0) > 35 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>{transaction.theftScore || 0}%</p>
                </div>
              </div>
              
              {/* AI Analysis */}
              {transaction.theftAnalysis && (
                <div className="bg-white/5 p-4 rounded-xl mb-6">
                  <p className="text-slate-400 text-sm mb-2">AI Analysis:</p>
                  <p className="text-white text-sm">{transaction.theftAnalysis.reasoning}</p>
                </div>
              )}
              
              {/* Cart Items */}
              {transaction.items && transaction.items.length > 0 && (
                <div className="mb-6">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-3">Cart Contents</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {transaction.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                        <img src={item.image} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-white text-sm truncate">{item.name}</p>
                          <p className="text-slate-500 text-xs">×{item.quantity}</p>
                        </div>
                        <p className="text-white text-sm">{CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {isFlagged ? (
                  <>
                    <button
                      onClick={handleRelease}
                      className="bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <Unlock className="w-5 h-5" /> Release
                    </button>
                    <button
                      onClick={handleFlag}
                      className="bg-orange-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <Clipboard className="w-5 h-5" /> Full Audit
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleRelease}
                    className="col-span-2 bg-emerald-600 text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-6 h-6" /> Release Gate
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

  // DASHBOARD VIEW with Theft Score Analytics
  if (viewMode === 'DASHBOARD') {
    // Calculate theft analytics
    const highRiskCount = transactions.filter(t => (t.theftScore || 0) > 65).length;
    const mediumRiskCount = transactions.filter(t => (t.theftScore || 0) > 35 && (t.theftScore || 0) <= 65).length;
    const lowRiskCount = transactions.filter(t => (t.theftScore || 0) <= 35).length;
    const avgTheftScore = transactions.length > 0 
      ? Math.round(transactions.reduce((sum, t) => sum + (t.theftScore || 0), 0) / transactions.length)
      : 0;
    
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setViewMode('SCANNER')}
              className="flex items-center gap-2 text-slate-500 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <div className="w-16" />
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-slate-500 text-xs uppercase mb-2">
                <Users className="w-4 h-4" /> Transactions
              </div>
              <p className="text-4xl font-bold text-white">{stats.totalTransactions}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-slate-500 text-xs uppercase mb-2">
                <IndianRupee className="w-4 h-4" /> Revenue
              </div>
              <p className="text-4xl font-bold text-blue-400">{CURRENCY_SYMBOL}{stats.totalRevenue.toFixed(0)}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-orange-500/60 text-xs uppercase mb-2">
                <AlertTriangle className="w-4 h-4" /> Flagged
              </div>
              <p className="text-4xl font-bold text-orange-500">{stats.flaggedCount}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-emerald-500/60 text-xs uppercase mb-2">
                <CheckCircle2 className="w-4 h-4" /> Verified
              </div>
              <p className="text-4xl font-bold text-emerald-500">{stats.verifiedCount}</p>
            </div>
          </div>
          
          {/* Theft Score Analytics Card */}
          <div className="bg-gradient-to-br from-rose-900/30 to-orange-900/30 border border-rose-500/30 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 text-rose-400 text-sm font-bold uppercase mb-4">
              <AlertTriangle className="w-5 h-5" /> Theft Risk Analytics
            </div>
            
            {/* Average Score Gauge */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-sm">Avg Risk Score</p>
                <p className={`text-5xl font-black ${
                  avgTheftScore > 65 ? 'text-rose-500' : 
                  avgTheftScore > 35 ? 'text-amber-500' : 'text-emerald-500'
                }`}>{avgTheftScore}%</p>
              </div>
              <div className="w-24 h-24 rounded-full border-8 border-slate-700 relative flex items-center justify-center">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(${
                      avgTheftScore > 65 ? '#f43f5e' : avgTheftScore > 35 ? '#f59e0b' : '#10b981'
                    } ${avgTheftScore * 3.6}deg, transparent 0deg)`
                  }}
                />
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center z-10">
                  <span className="text-white font-bold text-lg">{avgTheftScore}</span>
                </div>
              </div>
            </div>
            
            {/* Risk Distribution */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-500/20 rounded-xl p-3 text-center">
                <p className="text-emerald-400 text-2xl font-bold">{lowRiskCount}</p>
                <p className="text-emerald-400/70 text-xs">Low Risk</p>
                <p className="text-emerald-400/50 text-[10px]">0-35%</p>
              </div>
              <div className="bg-amber-500/20 rounded-xl p-3 text-center">
                <p className="text-amber-400 text-2xl font-bold">{mediumRiskCount}</p>
                <p className="text-amber-400/70 text-xs">Medium</p>
                <p className="text-amber-400/50 text-[10px]">36-65%</p>
              </div>
              <div className="bg-rose-500/20 rounded-xl p-3 text-center">
                <p className="text-rose-400 text-2xl font-bold">{highRiskCount}</p>
                <p className="text-rose-400/70 text-xs">High Risk</p>
                <p className="text-rose-400/50 text-[10px]">66-100%</p>
              </div>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase mb-4">
              <History className="w-4 h-4" /> Recent Transactions
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-center text-slate-600 py-8">No transactions yet</p>
              ) : (
                transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        (tx.theftScore || 0) > 65 ? 'bg-rose-500' :
                        (tx.theftScore || 0) > 35 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div>
                        <p className="text-white text-sm font-mono">{tx.id}</p>
                        <p className="text-slate-500 text-xs">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div className={`text-xs px-2 py-1 rounded-full font-bold ${
                        (tx.theftScore || 0) > 65 ? 'bg-rose-500/20 text-rose-400' :
                        (tx.theftScore || 0) > 35 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {tx.theftScore || 0}%
                      </div>
                      <div>
                        <p className="text-white font-bold">{CURRENCY_SYMBOL}{tx.total?.toFixed(0) || 0}</p>
                        <p className={`text-xs ${
                          tx.status === 'VERIFIED' ? 'text-emerald-500' :
                          tx.status === 'FLAGGED' ? 'text-orange-500' : 'text-blue-400'
                        }`}>{tx.status}</p>
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

  // SCANNER VIEW (Default)
  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Exit Gate</h1>
              <p className="text-slate-500 text-xs">Staff Terminal</p>
            </div>
          </div>
          <button
            onClick={() => setViewMode('DASHBOARD')}
            className="bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" /> Dashboard
          </button>
        </div>
        
        {/* Scanner */}
        <CameraScanner
          title="Scan Customer Exit QR"
          onScan={handleScanQR}
          isQR={true}
        />
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-slate-500 text-xs uppercase mb-1">Today</p>
            <p className="text-2xl font-bold text-white">{stats.totalTransactions}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-orange-500/60 text-xs uppercase mb-1">Flagged</p>
            <p className="text-2xl font-bold text-orange-500">{stats.flaggedCount}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-emerald-500/60 text-xs uppercase mb-1">Cleared</p>
            <p className="text-2xl font-bold text-emerald-500">{stats.verifiedCount}</p>
          </div>
        </div>
        
        {/* Pending Queue */}
        {stats.pendingCount > 0 && (
          <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-amber-500 text-sm font-bold">
              {stats.pendingCount} transactions pending verification
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
