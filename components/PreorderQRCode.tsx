/**
 * Preorder QR Code Component
 * QR code with 5-minute validity timer and regeneration
 * Uses base64 encoded JSON (NOT JWT) for transparency and easy scanning
 */

import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Transaction } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { Loader2, CheckCircle, RefreshCw, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

interface PreorderQRCodeProps {
  transaction: Transaction;
  size?: number;
  showAnimation?: boolean;
  isVerified?: boolean;
  onRegenerate?: () => void;
  expiresAt?: number;
}

// QR validity duration in milliseconds (5 minutes)
const QR_VALIDITY_MS = 5 * 60 * 1000;

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
    
    // Check if QR has expired (only if expiresAt is present)
    if (data.expiresAt && Date.now() > data.expiresAt) {
      return { valid: false, expired: true, data, error: 'QR code has expired. Ask customer to regenerate.' };
    }
    
    return { valid: true, data };
  } catch (e) {
    console.error('Failed to decode preorder QR:', e);
    return { valid: false, error: 'Invalid QR code format' };
  }
};

export const PreorderQRCode: React.FC<PreorderQRCodeProps> = ({ 
  transaction, 
  size = 200, 
  showAnimation = true,
  isVerified = false,
  onRegenerate,
  expiresAt: propExpiresAt
}) => {
  const [animationPhase, setAnimationPhase] = useState<'cube' | 'building' | 'ready' | 'done'>(showAnimation ? 'cube' : 'done');
  const [qrGeneratedAt, setQrGeneratedAt] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(QR_VALIDITY_MS);
  const [isExpired, setIsExpired] = useState(false);
  
  // Generate QR data with current timestamp
  const qrData = generatePreorderQRData(transaction, qrGeneratedAt);
  const expiresAt = propExpiresAt || (qrGeneratedAt + QR_VALIDITY_MS);
  
  // Countdown timer for QR validity
  useEffect(() => {
    if (isVerified) return; // Stop timer if verified
    
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
  }, [expiresAt, isVerified]);
  
  // Regenerate QR code
  const handleRegenerate = useCallback(() => {
    setAnimationPhase('cube');
    setQrGeneratedAt(Date.now());
    setIsExpired(false);
    setTimeRemaining(QR_VALIDITY_MS);
    onRegenerate?.();
  }, [onRegenerate]);
  
  // 3D QR Generation Animation Sequence
  useEffect(() => {
    if (showAnimation && animationPhase === 'cube') {
      // Phase 1: 3D Cube spinning (1.5s)
      const timer1 = setTimeout(() => setAnimationPhase('building'), 1500);
      // Phase 2: QR Building animation (1s)
      const timer2 = setTimeout(() => setAnimationPhase('ready'), 2500);
      // Phase 3: Success flash (0.5s)
      const timer3 = setTimeout(() => setAnimationPhase('done'), 3000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [showAnimation, animationPhase]);
  
  return (
    <div className="flex flex-col items-center">
      {/* QR Code with 3D Animation */}
      <div className="relative" style={{ perspective: '1000px' }}>
        
        {/* Phase 1: 3D Spinning Cube */}
        {animationPhase === 'cube' && (
          <div 
            className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl shadow-2xl"
            style={{ width: size + 32, height: size + 32 }}
          >
            <div className="qr-cube-container" style={{ width: 80, height: 80 }}>
              <div className="qr-3d-cube">
                <div className="cube-face cube-front">📦</div>
                <div className="cube-face cube-back">🎁</div>
                <div className="cube-face cube-right">🛒</div>
                <div className="cube-face cube-left">✨</div>
                <div className="cube-face cube-top">🔐</div>
                <div className="cube-face cube-bottom">📱</div>
              </div>
            </div>
            <p className="mt-4 text-purple-300 font-bold text-sm animate-pulse">Securing your order...</p>
            <div className="flex gap-1 mt-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
            </div>
          </div>
        )}
        
        {/* Phase 2: QR Code Building Animation */}
        {animationPhase === 'building' && (
          <div 
            className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-lg overflow-hidden"
            style={{ width: size + 32, height: size + 32 }}
          >
            <div className="relative">
              <div className="qr-grid-build" style={{ width: size, height: size }}>
                {Array.from({length: 64}).map((_, i) => (
                  <div 
                    key={i}
                    className="qr-cell-build"
                    style={{ 
                      animationDelay: `${i * 15}ms`,
                      backgroundColor: Math.random() > 0.5 ? '#1e1b4b' : 'transparent'
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 qr-scan-line" />
            </div>
            <p className="mt-3 text-indigo-700 font-bold text-sm">Building QR Code...</p>
          </div>
        )}
        
        {/* Phase 3: Success Flash */}
        {animationPhase === 'ready' && (
          <div 
            className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl shadow-2xl"
            style={{ width: size + 32, height: size + 32 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/50 rounded-full animate-ping" style={{width: 80, height: 80}} />
              <CheckCircle className="w-20 h-20 text-white drop-shadow-lg" />
            </div>
            <p className="mt-3 text-white font-black text-lg">QR Ready!</p>
          </div>
        )}
        
        {/* Final: QR Code Revealed - with Verified/Expired overlay */}
        {animationPhase === 'done' && (
          <div className="relative">
            <div className={`bg-white p-4 rounded-2xl shadow-xl ${showAnimation ? 'qr-reveal-3d' : ''} ${isExpired && !isVerified ? 'opacity-30' : ''} ${isVerified ? 'ring-4 ring-emerald-500' : ''}`}>
              <QRCodeSVG
                value={qrData}
                size={size}
                level="M"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#1e1b4b"
              />
            </div>
            
            {/* Verified Badge Overlay */}
            {isVerified && (
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/90 rounded-2xl">
                <div className="text-center">
                  <ShieldCheck className="w-16 h-16 text-white mx-auto mb-2" />
                  <p className="text-white font-black text-xl">VERIFIED</p>
                  <p className="text-white/80 text-sm">Collection Complete</p>
                </div>
              </div>
            )}
            
            {/* Expired Overlay */}
            {isExpired && !isVerified && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-2xl">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <p className="text-white font-bold">QR Expired</p>
                  <p className="text-slate-400 text-xs mb-3">Tap below to regenerate</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Timer Display - Only show if not verified */}
      {animationPhase === 'done' && !isVerified && (
        <div className={`mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-xl ${
          isExpired ? 'bg-red-100' : timeRemaining < 60000 ? 'bg-amber-100' : 'bg-emerald-100'
        }`}>
          <Clock className={`w-4 h-4 ${isExpired ? 'text-red-500' : timeRemaining < 60000 ? 'text-amber-600' : 'text-emerald-600'}`} />
          <span className={`font-bold text-sm ${isExpired ? 'text-red-600' : timeRemaining < 60000 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {isExpired ? 'QR Expired' : `Valid for ${Math.floor(timeRemaining / 60000)}:${String(Math.floor((timeRemaining % 60000) / 1000)).padStart(2, '0')}`}
          </span>
        </div>
      )}
      
      {/* Verified Status Badge */}
      {isVerified && (
        <div className="mt-3 bg-emerald-100 border border-emerald-300 rounded-xl px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-emerald-700">Verification Complete</span>
          </div>
          <p className="text-emerald-600 text-xs mt-1">Your order has been collected</p>
        </div>
      )}
      
      {/* Regenerate Button - Only show if expired and not verified */}
      {isExpired && !isVerified && (
        <button
          onClick={handleRegenerate}
          className="mt-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform w-full"
        >
          <RefreshCw className="w-5 h-5" />
          Regenerate QR Code
        </button>
      )}
      
      {/* Pickup Code Display */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pickup Code</p>
        <p className={`text-3xl font-black tracking-[0.15em] font-mono ${isVerified ? 'text-emerald-600 line-through' : 'text-purple-700'}`}>
          {transaction.preorderPickupCode || ''}
        </p>
      </div>
      
      {/* Quick Info */}
      <div className="mt-3 bg-purple-50 rounded-xl px-4 py-2 text-center">
        <p className="text-purple-600 text-sm">
          <span className="font-bold">{transaction.items?.length || 0} items</span>
          <span className="mx-2">•</span>
          <span className="font-bold">{CURRENCY_SYMBOL}{transaction.total.toFixed(0)}</span>
        </p>
      </div>
      
      {/* Scan Instructions */}
      {!isVerified && (
        <p className="mt-3 text-xs text-slate-400 text-center">
          Staff can scan this QR or enter the pickup code
        </p>
      )}
    </div>
  );
};

export default PreorderQRCode;
