/**
 * Preorder QR Code Component
 * Simple QR code for preorder pickup verification
 * Uses base64 encoded JSON (NOT JWT) for transparency and easy scanning
 */

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Transaction } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { Loader2, CheckCircle } from 'lucide-react';

interface PreorderQRCodeProps {
  transaction: Transaction;
  size?: number;
  showAnimation?: boolean;
}

// Generate simple preorder QR data (NOT JWT - just base64 encoded JSON)
export const generatePreorderQRData = (transaction: Transaction): string => {
  const qrPayload = {
    type: 'SKIPLINE_PREORDER',
    version: '1.0',
    txId: transaction.id,
    pickupCode: transaction.preorderPickupCode || '',
    total: transaction.total,
    itemCount: transaction.items?.length || 0,
    mall: transaction.preorderMall || transaction.branch || '',
    timestamp: transaction.timestamp,
    // Include a simple checksum for basic validation
    checksum: generateChecksum(transaction.id, transaction.total)
  };
  
  // Simple base64 encoding for readability and easy parsing
  const jsonString = JSON.stringify(qrPayload);
  const base64Data = btoa(jsonString);
  
  // Prefix with identifier for easy detection
  return `SLGO:${base64Data}`;
};

// Simple checksum for basic validation
const generateChecksum = (txId: string, total: number): string => {
  const str = `${txId}-${total.toFixed(2)}`;
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
  data?: {
    type: string;
    version: string;
    txId: string;
    pickupCode: string;
    total: number;
    itemCount: number;
    mall: string;
    timestamp: number;
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
    const expectedChecksum = generateChecksum(data.txId, data.total);
    if (data.checksum !== expectedChecksum) {
      return { valid: false, error: 'Checksum mismatch - QR may be tampered' };
    }
    
    return { valid: true, data };
  } catch (e) {
    console.error('Failed to decode preorder QR:', e);
    return { valid: false, error: 'Invalid QR code format' };
  }
};

export const PreorderQRCode: React.FC<PreorderQRCodeProps> = ({ transaction, size = 200, showAnimation = true }) => {
  const [isGenerating, setIsGenerating] = useState(showAnimation);
  const [showQR, setShowQR] = useState(!showAnimation);
  const qrData = generatePreorderQRData(transaction);
  
  // QR Generation Animation
  useEffect(() => {
    if (showAnimation) {
      const timer1 = setTimeout(() => {
        setIsGenerating(false);
      }, 1500);
      
      const timer2 = setTimeout(() => {
        setShowQR(true);
      }, 1700);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [showAnimation]);
  
  return (
    <div className="flex flex-col items-center">
      {/* QR Code with Animation */}
      <div className="relative">
        {/* Loading State */}
        {isGenerating && (
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center" style={{ width: size + 32, height: size + 32 }}>
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
            </div>
            <p className="mt-3 text-purple-700 font-bold text-sm animate-pulse">Generating QR...</p>
          </div>
        )}
        
        {/* Success Animation */}
        {!isGenerating && !showQR && (
          <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center" style={{ width: size + 32, height: size + 32 }}>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping" />
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <p className="mt-3 text-emerald-700 font-bold text-sm">QR Ready!</p>
          </div>
        )}
        
        {/* QR Code */}
        {showQR && (
          <div className={`bg-white p-4 rounded-2xl shadow-lg transition-all duration-500 ${showAnimation ? 'animate-fadeInScale' : ''}`}>
            <QRCodeSVG
              value={qrData}
              size={size}
              level="M"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#1e1b4b"
            />
          </div>
        )}
      </div>
      
      {/* Pickup Code Display */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pickup Code</p>
        <p className="text-3xl font-black text-purple-700 tracking-[0.15em] font-mono">
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
      <p className="mt-3 text-xs text-slate-400 text-center">
        Staff can scan this QR or enter the pickup code
      </p>
    </div>
  );
};

export default PreorderQRCode;
