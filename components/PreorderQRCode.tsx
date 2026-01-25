/**
 * Preorder QR Code Component
 * QR code with 5-minute validity timer and regeneration
 * - NO auto-generation for pending orders: User must click to generate
 * - Fast animation on regeneration (400ms)
 * - Disable regeneration after verification
 * - 24-hour limit for regeneration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Transaction } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { CheckCircle, RefreshCw, Clock, AlertCircle, ShieldCheck, QrCode, Sparkles } from 'lucide-react';

interface PreorderQRCodeProps {
  transaction: Transaction;
  size?: number;
  showAnimation?: boolean;
  isVerified?: boolean;
  onRegenerate?: () => void;
  expiresAt?: number;
  autoGenerate?: boolean; // Whether to auto-generate QR on mount (default: true for new orders)
}

// QR validity duration in milliseconds (5 minutes)
const QR_VALIDITY_MS = 5 * 60 * 1000;
// 24 hour limit for regeneration from order time
const REGENERATION_LIMIT_MS = 24 * 60 * 60 * 1000;

// Generate simple preorder QR data with timestamp for expiry
export const generatePreorderQRData = (transaction: Transaction, generatedAt?: number): string => {
  const timestamp = generatedAt || Date.now();
  const qrPayload = {
    type: 'SKIPLINE_PREORDER',
    version: '1.0',
    txId: transaction.id,
    pickupCode: transaction.preorderPickupCode || '',
    total: transaction.total,
    itemCount: transaction.items?.length || 0,
    mall: transaction.preorderMall || transaction.branch || '',
    timestamp: transaction.timestamp,
    generatedAt: timestamp,
    expiresAt: timestamp + QR_VALIDITY_MS,
    // Include a simple checksum for basic validation
    checksum: generateChecksum(transaction.id, transaction.total, timestamp)
  };
  
  // Simple base64 encoding for readability and easy parsing
  const jsonString = JSON.stringify(qrPayload);
  const base64Data = btoa(jsonString);
  
  // Prefix with identifier for easy detection
  return `SLGO:${base64Data}`;
};

// Simple checksum for basic validation
const generateChecksum = (txId: string, total: number, timestamp?: number): string => {
  const str = `${txId}-${total.toFixed(2)}-${timestamp || 0}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 8).toUpperCase();
};

// Decode and verify preorder QR data
export const decodePreorderQR = (qrData: string): {
  valid: boolean;
  expired?: boolean;
  data?: {
    type: string;
    version: string;
    txId: string;
    pickupCode: string;
    total: number;
    itemCount: number;
    mall: string;
    timestamp: number;
    generatedAt?: number;
    expiresAt?: number;
    checksum: string;
  };
  error?: string;
} => {
  try {
    // Check for SLGO prefix
    if (!qrData.startsWith('SLGO:')) {
      return { valid: false, error: 'Not a Skipline preorder QR code' };
    }
    
    // Extract base64 data
    const base64Data = qrData.substring(5);
    const jsonString = atob(base64Data);
    const data = JSON.parse(jsonString);
    
    // Validate required fields
    if (data.type !== 'SKIPLINE_PREORDER') {
      return { valid: false, error: 'Invalid QR type' };
    }
    
    // Verify checksum
    const expectedChecksum = generateChecksum(data.txId, data.total, data.generatedAt);
    if (data.checksum !== expectedChecksum) {
      return { valid: false, error: 'Checksum mismatch - QR may be tampered' };
    }
    
    // Check if QR has expired - still return valid but mark as expired
    // Staff can still verify expired QRs, they just need customer to regenerate for scanning
    const isExpired = data.expiresAt && Date.now() > data.expiresAt;
    
    return { valid: true, expired: isExpired, data };
  } catch (e) {
    console.error('Failed to decode preorder QR:', e);
    return { valid: false, error: 'Invalid QR code format' };
  }
};

export const PreorderQRCode: React.FC<PreorderQRCodeProps> = ({ 
  transaction, 
  size = 200, 
  showAnimation = false,
  isVerified = false,
  onRegenerate,
  expiresAt: propExpiresAt,
  autoGenerate = true
}) => {
  // States for QR generation
  const [qrGenerated, setQrGenerated] = useState(autoGenerate);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrGeneratedAt, setQrGeneratedAt] = useState(autoGenerate ? Date.now() : 0);
  const [timeRemaining, setTimeRemaining] = useState(QR_VALIDITY_MS);
  const [isExpired, setIsExpired] = useState(false);
  
  // Calculate if within 24-hour regeneration window
  const orderTimestamp = transaction.timestamp;
  const canRegenerate = !isVerified && (Date.now() - orderTimestamp) < REGENERATION_LIMIT_MS;
  const hoursRemaining = Math.max(0, Math.floor((orderTimestamp + REGENERATION_LIMIT_MS - Date.now()) / (60 * 60 * 1000)));
  
  // Generate QR data with current timestamp
  const qrData = qrGenerated ? generatePreorderQRData(transaction, qrGeneratedAt) : '';
  const expiresAt = propExpiresAt || (qrGeneratedAt + QR_VALIDITY_MS);
  
  // Countdown timer for QR validity
  useEffect(() => {
    if (isVerified || !qrGenerated) return;
    
    const interval = setInterval(() => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsExpired(true);
      } else {
        setTimeRemaining(remaining);
        setIsExpired(false);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [expiresAt, isVerified, qrGenerated]);
  
  // Generate QR code (first time or regenerate) - FAST 400ms animation
  const handleGenerate = useCallback(() => {
    if (isVerified || !canRegenerate) return;
    
    setIsGenerating(true);
    
    // Quick animation - only 400ms
    setTimeout(() => {
      setQrGeneratedAt(Date.now());
      setQrGenerated(true);
      setIsExpired(false);
      setTimeRemaining(QR_VALIDITY_MS);
      setIsGenerating(false);
      onRegenerate?.();
    }, 400);
  }, [isVerified, canRegenerate, onRegenerate]);
  
  // ============================================
  // VERIFIED STATE - Item picked up, NO regeneration
  // ============================================
  if (isVerified) {
    return (
      <div className="flex flex-col items-center">
        {/* Verified Badge */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-3xl shadow-2xl text-center" style={{ width: size + 32 }}>
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
            <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
              <ShieldCheck className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          <h3 className="text-white font-black text-xl mb-1">✅ Item Verified!</h3>
          <p className="text-white/80 text-sm">Your order has been picked up</p>
        </div>
        
        {/* Pickup Code - Strikethrough */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pickup Code</p>
          <p className="text-2xl font-black tracking-[0.15em] font-mono text-emerald-600 line-through opacity-60">
            {transaction.preorderPickupCode || ''}
          </p>
        </div>
        
        {/* Verification Complete Badge */}
        <div className="mt-4 bg-emerald-100 border-2 border-emerald-300 rounded-xl px-5 py-3 text-center w-full">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-emerald-700">Collection Complete</span>
          </div>
          <p className="text-emerald-600 text-xs mt-1">QR regeneration disabled</p>
        </div>
        
        {/* Order Summary */}
        <div className="mt-3 bg-slate-100 rounded-xl px-4 py-2 text-center w-full">
          <p className="text-slate-600 text-sm">
            <span className="font-bold">{transaction.items?.length || 0} items</span>
            <span className="mx-2">•</span>
            <span className="font-bold">{CURRENCY_SYMBOL}{transaction.total.toFixed(0)}</span>
          </p>
        </div>
      </div>
    );
  }
  
  // ============================================
  // NOT GENERATED YET - Show Generate Button
  // ============================================
  if (!qrGenerated && !isGenerating) {
    return (
      <div className="flex flex-col items-center">
        {/* Generate QR Prompt */}
        <div 
          className="bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-dashed border-purple-300 rounded-3xl flex flex-col items-center justify-center p-6"
          style={{ width: size + 32, height: size + 32 }}
        >
          <div className="w-16 h-16 bg-purple-200 rounded-2xl flex items-center justify-center mb-4">
            <QrCode className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-purple-700 font-bold text-center mb-2">Generate QR Code</p>
          <p className="text-purple-500 text-xs text-center mb-4">Tap to create scannable QR</p>
          
          <button
            onClick={handleGenerate}
            disabled={!canRegenerate}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              canRegenerate 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg active:scale-95'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Generate QR
          </button>
        </div>
        
        {/* Pickup Code Display */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pickup Code</p>
          <p className="text-3xl font-black tracking-[0.15em] font-mono text-purple-700">
            {transaction.preorderPickupCode || ''}
          </p>
        </div>
        
        {/* Time Remaining for Regeneration */}
        {canRegenerate ? (
          <div className="mt-3 bg-amber-100 border border-amber-300 rounded-xl px-4 py-2 text-center">
            <p className="text-amber-700 text-xs">
              ⏰ Can generate QR for next <span className="font-bold">{hoursRemaining}h</span>
            </p>
          </div>
        ) : (
          <div className="mt-3 bg-red-100 border border-red-300 rounded-xl px-4 py-2 text-center">
            <p className="text-red-700 text-xs font-bold">
              ❌ 24-hour window expired
            </p>
          </div>
        )}
        
        {/* Order Summary */}
        <div className="mt-3 bg-purple-50 rounded-xl px-4 py-2 text-center w-full">
          <p className="text-purple-600 text-sm">
            <span className="font-bold">{transaction.items?.length || 0} items</span>
            <span className="mx-2">•</span>
            <span className="font-bold">{CURRENCY_SYMBOL}{transaction.total.toFixed(0)}</span>
          </p>
        </div>
      </div>
    );
  }
  
  // ============================================
  // GENERATING - Quick Spinner Animation (400ms)
  // ============================================
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center">
        <div 
          className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex flex-col items-center justify-center shadow-2xl"
          style={{ width: size + 32, height: size + 32 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <QrCode className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-white font-bold text-sm">Generating...</p>
        </div>
      </div>
    );
  }
  
  // ============================================
  // QR CODE DISPLAYED
  // ============================================
  return (
    <div className="flex flex-col items-center">
      {/* QR Code */}
      <div className="relative">
        <div className={`bg-white p-4 rounded-2xl shadow-xl transition-opacity duration-300 ${isExpired ? 'opacity-30' : ''}`}>
          <QRCodeSVG
            value={qrData}
            size={size}
            level="M"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#1e1b4b"
          />
        </div>
        
        {/* Expired Overlay */}
        {isExpired && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-2xl">
            <div className="text-center p-4">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <p className="text-white font-bold text-sm">QR Expired</p>
              <p className="text-slate-400 text-xs">Tap regenerate below</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Timer Display */}
      <div className={`mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-xl ${
        isExpired ? 'bg-red-100' : timeRemaining < 60000 ? 'bg-amber-100' : 'bg-emerald-100'
      }`}>
        <Clock className={`w-4 h-4 ${isExpired ? 'text-red-500' : timeRemaining < 60000 ? 'text-amber-600' : 'text-emerald-600'}`} />
        <span className={`font-bold text-sm ${isExpired ? 'text-red-600' : timeRemaining < 60000 ? 'text-amber-700' : 'text-emerald-700'}`}>
          {isExpired ? 'QR Expired' : `Valid: ${Math.floor(timeRemaining / 60000)}:${String(Math.floor((timeRemaining % 60000) / 1000)).padStart(2, '0')}`}
        </span>
      </div>
      
      {/* Regenerate Button - Only when expired and can regenerate */}
      {isExpired && canRegenerate && (
        <button
          onClick={handleGenerate}
          className="mt-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform w-full"
        >
          <RefreshCw className="w-5 h-5" />
          Regenerate QR Code
        </button>
      )}
      
      {/* Cannot regenerate warning */}
      {isExpired && !canRegenerate && (
        <div className="mt-3 bg-red-100 border border-red-300 rounded-xl px-4 py-3 text-center w-full">
          <p className="text-red-700 text-sm font-bold">❌ Cannot Regenerate</p>
          <p className="text-red-600 text-xs mt-1">24-hour window has expired</p>
        </div>
      )}
      
      {/* Pickup Code Display */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pickup Code</p>
        <p className="text-3xl font-black tracking-[0.15em] font-mono text-purple-700">
          {transaction.preorderPickupCode || ''}
        </p>
      </div>
      
      {/* Time remaining for regeneration */}
      {canRegenerate && !isExpired && (
        <div className="mt-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2 text-center">
          <p className="text-purple-600 text-xs">
            🔄 Can regenerate for <span className="font-bold">{hoursRemaining}h</span> • Each QR valid 5 mins
          </p>
        </div>
      )}
      
      {/* Order Summary */}
      <div className="mt-3 bg-purple-50 rounded-xl px-4 py-2 text-center w-full">
        <p className="text-purple-600 text-sm">
          <span className="font-bold">{transaction.items?.length || 0} items</span>
          <span className="mx-2">•</span>
          <span className="font-bold">{CURRENCY_SYMBOL}{transaction.total.toFixed(0)}</span>
        </p>
      </div>
      
      {/* Scan Instructions */}
      {!isExpired && (
        <p className="mt-3 text-xs text-slate-400 text-center">
          Staff will scan this QR or enter pickup code
        </p>
      )}
    </div>
  );
};

export default PreorderQRCode;
