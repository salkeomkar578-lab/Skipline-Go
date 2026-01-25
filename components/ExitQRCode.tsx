/**
 * Exit QR Code Component - Skipline Go
 * Generates encrypted JWT-based QR code for exit verification
 * 
 * Security Features:
 * - JWT signed token
 * - 5-minute expiry (reduced from 10)
 * - Transaction data encoded
 * - 3D Animation on generation
 */

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import * as jose from 'jose';
import { Transaction } from '../types';
import { CURRENCY_SYMBOL } from '../constants';

interface ExitQRCodeProps {
  transaction: Transaction;
  onExpired?: () => void;
  onVerified?: (type: 'success' | 'flagged', message: string) => void;
}

// Secret key for JWT signing (in production, this would be server-side)
const JWT_SECRET = new TextEncoder().encode('skipline-go-secret-2026');

/**
 * Generate signed JWT token for exit QR
 */
const generateExitToken = async (transaction: Transaction): Promise<string> => {
  const payload = {
    txId: transaction.id,
    userId: transaction.userId,
    total: transaction.total,
    itemCount: transaction.items.length,
    theftScore: transaction.theftScore,
    status: transaction.status,
    timestamp: transaction.timestamp
  };

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m') // 5 minute expiry (reduced from 10)
    .sign(JWT_SECRET);

  return token;
};

/**
 * Verify JWT token (used by staff scanner)
 */
export const verifyExitToken = async (token: string): Promise<{
  valid: boolean;
  expired?: boolean;
  payload?: any;
  error?: string;
}> => {
  // Basic validation - JWT should have 3 parts separated by dots
  if (!token || typeof token !== 'string') {
    console.log('verifyExitToken: Invalid input - not a string');
    return { valid: false, expired: false, error: 'Invalid QR code data.' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    console.log('verifyExitToken: Not a JWT format, parts:', parts.length);
    return { valid: false, expired: false, error: 'Not a valid JWT token format.' };
  }

  try {
    console.log('verifyExitToken: Attempting to verify JWT...');
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    console.log('verifyExitToken: SUCCESS, payload:', payload);
    return { valid: true, payload };
  } catch (error: any) {
    console.log('verifyExitToken: Error:', error.code, error.message);
    if (error.code === 'ERR_JWT_EXPIRED') {
      return { valid: false, expired: true, error: 'QR Code has expired. Please regenerate.' };
    }
    if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      return { valid: false, expired: false, error: 'QR Code signature invalid.' };
    }
    return { valid: false, expired: false, error: `JWT Error: ${error.message || 'Unknown error'}` };
  }
};

export const ExitQRCode: React.FC<ExitQRCodeProps> = ({ transaction, onExpired, onVerified }) => {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true); // For 3D animation
  const [showQR, setShowQR] = useState(false); // For reveal animation
  const [isVerified, setIsVerified] = useState(false); // QR has been scanned and verified

  const generateToken = async () => {
    setIsRegenerating(true);
    setIsGenerating(true);
    setShowQR(false);
    try {
      const token = await generateExitToken(transaction);
      setQrToken(token);
      setTimeRemaining(300); // 5 minutes
      setIsExpired(false);
      
      // Trigger 3D animation sequence
      setTimeout(() => {
        setIsGenerating(false);
        setTimeout(() => {
          setShowQR(true);
        }, 300);
      }, 1500);
    } catch (error) {
      console.error('Failed to generate token:', error);
      setIsGenerating(false);
    } finally {
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    generateToken();
  }, [transaction.id]);
  
  // Listen for verification events from staff
  useEffect(() => {
    const checkVerification = () => {
      const verificationData = localStorage.getItem(`qr_verified_${transaction.id}`);
      if (verificationData) {
        try {
          const data = JSON.parse(verificationData);
          // Mark QR as verified/used - it's now invalid
          setIsVerified(true);
          setIsExpired(true); // Also mark as expired so timer stops
          onVerified?.(data.type, data.message);
          // Don't remove immediately - let the parent handle it
        } catch (e) {
          console.error('Failed to parse verification data:', e);
        }
      }
    };
    
    const interval = setInterval(checkVerification, 500); // Check faster
    return () => clearInterval(interval);
  }, [transaction.id, onVerified]);

  // Countdown timer
  useEffect(() => {
    if (isExpired) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          onExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExpired, onExpired]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    if (timeRemaining <= 60) return 'text-rose-600';
    if (timeRemaining <= 180) return 'text-orange-500';
    return 'text-emerald-600';
  };

  const getRiskColor = (): string => {
    if (transaction.theftScore > 65) return 'border-orange-500 bg-orange-50';
    if (transaction.theftScore > 30) return 'border-amber-500 bg-amber-50';
    return 'border-emerald-500 bg-emerald-50';
  };

  return (
    <div className="flex flex-col items-center">
      {/* QR Code Container */}
      <div className={`relative p-8 rounded-[2.5rem] border-4 ${isVerified ? 'border-emerald-500 bg-emerald-50' : getRiskColor()} shadow-2xl bg-white`}>
        {/* Status Banner */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
            isVerified
              ? 'bg-emerald-500 text-white'
              : transaction.theftScore > 65 
                ? 'bg-orange-500 text-white' 
                : 'bg-emerald-500 text-white'
          }`}>
            {isVerified ? '✓ Verified & Used' : transaction.theftScore > 65 ? 'Quick Check Required' : 'Ready for Exit'}
          </div>
        </div>

        {isVerified ? (
          // QR Has Been Used - Show Invalid State
          <div className="w-[220px] h-[220px] flex flex-col items-center justify-center bg-emerald-50 rounded-2xl">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <p className="font-black text-emerald-700 text-center text-lg mb-1">QR Verified!</p>
            <p className="text-emerald-600 text-sm text-center mb-2">Gate has been released</p>
            <div className="bg-emerald-100 px-4 py-2 rounded-xl">
              <p className="text-emerald-700 text-xs font-bold">This QR is now invalid</p>
            </div>
          </div>
        ) : isExpired ? (
          // Expired State
          <div className="w-[220px] h-[220px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl">
            <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
            <p className="font-black text-slate-900 text-center mb-4">QR Expired</p>
            <button
              onClick={generateToken}
              disabled={isRegenerating}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          </div>
        ) : isGenerating ? (
          // Modern Pulse Wave Animation
          <div className="w-[260px] h-[260px] flex items-center justify-center">
            <div className="relative">
              {/* Animated circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-40 h-40 rounded-full border-2 border-amber-400"
                    style={{
                      animation: `pulse-ring 1.5s ease-out infinite`,
                      animationDelay: `${i * 0.4}s`,
                      opacity: 0
                    }}
                  />
                ))}
              </div>
              
              {/* Center QR placeholder with scan effect */}
              <div className="w-44 h-44 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden border-2 border-amber-200">
                {/* QR Grid animation */}
                <div className="w-32 h-32 grid grid-cols-6 gap-1 p-2">
                  {[...Array(36)].map((_, i) => (
                    <div 
                      key={i} 
                      className="rounded-sm bg-slate-800 transition-all"
                      style={{ 
                        animation: `qr-cell-pop 0.3s ease-out forwards`,
                        animationDelay: `${i * 30}ms`,
                        opacity: 0,
                        transform: 'scale(0)'
                      }} 
                    />
                  ))}
                </div>
                
                {/* Scanning beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                  style={{ 
                    animation: 'scan-beam 1s ease-in-out infinite',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
                  }} 
                />
                
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-3 border-t-3 border-amber-500 rounded-tl" />
                <div className="absolute top-2 right-2 w-6 h-6 border-r-3 border-t-3 border-amber-500 rounded-tr" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-3 border-b-3 border-amber-500 rounded-bl" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-3 border-b-3 border-amber-500 rounded-br" />
              </div>
              
              {/* Loading spinner */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              
              {/* Loading text */}
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  Generating Secure QR
                </p>
              </div>
            </div>
          </div>
        ) : qrToken ? (
          // QR Code with simple reveal animation
          <div className={`p-4 bg-white rounded-2xl transition-all duration-500 ${
            showQR 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`}>
            {console.log('QR Token generated, length:', qrToken?.length, 'token:', qrToken?.substring(0, 50) + '...')}
            <QRCodeSVG
              value={qrToken}
              size={240}
              level="L"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        ) : (
          // Loading State
          <div className="w-[220px] h-[220px] flex items-center justify-center bg-slate-50 rounded-2xl animate-pulse">
            <RefreshCw className="w-10 h-10 text-slate-300 animate-spin" />
          </div>
        )}

        {/* Timer */}
        {!isExpired && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
            <div className={`flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-slate-100 ${getTimeColor()}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-black text-sm">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Info */}
      <div className="mt-10 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Secured Exit Pass</span>
        </div>
        
        <p className="font-mono text-3xl font-black text-slate-900 tracking-tight">
          {transaction.id}
        </p>
        
        <div className="flex items-center justify-center gap-6 text-sm">
          <div>
            <span className="text-slate-400">Items:</span>
            <span className="font-bold text-slate-900 ml-1">{transaction.items.length}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div>
            <span className="text-slate-400">Total:</span>
            <span className="font-bold text-emerald-600 ml-1">{CURRENCY_SYMBOL}{transaction.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Copy Token Button for Testing */}
        {qrToken && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(qrToken);
              alert('Token copied! Paste it in Staff scanner manual input.');
            }}
            className="mt-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            📋 Copy Token (for testing)
          </button>
        )}

        {/* AI Risk Assessment */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${
          transaction.theftScore > 65 
            ? 'bg-orange-50 text-orange-700 border border-orange-200'
            : transaction.theftScore > 30
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          <CheckCircle className="w-3 h-3" />
          AI Score: {transaction.theftScore}% • {transaction.theftAnalysis?.recommendation || 'INSTANT_RELEASE'}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-slate-50 rounded-2xl max-w-sm">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          Show this QR code to the security staff at the exit gate. 
          The code will expire in <span className="font-bold">{formatTime(timeRemaining)}</span>.
        </p>
      </div>
    </div>
  );
};
