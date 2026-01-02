/**
 * Camera Scanner Component - Skipline Go
 * PRODUCTION VERSION - Real-time Barcode & QR Scanning
 * 
 * Features:
 * - Native BarcodeDetector API for real barcode scanning
 * - Supports EAN-13, UPC-A, Code-128, QR codes
 * - Real-time continuous scanning with visual feedback
 * - Camera switching (front/back)
 * - Sound feedback on successful scan
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Scan, AlertCircle, RefreshCcw, MapPin, Zap, Eye, Volume2, VolumeX, SwitchCamera, Flashlight } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';

interface CameraScannerProps {
  onScan: (data: string) => void;
  title: string;
  isQR?: boolean;
  onAisleDetected?: (aisle: string) => void;
  disabled?: boolean;
  autoScan?: boolean; // Enable continuous auto-scanning
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ 
  onScan, 
  title, 
  isQR = false,
  onAisleDetected,
  disabled = false,
  autoScan = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [hasCamera, setHasCamera] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const [lastScanTime, setLastScanTime] = useState<number>(0);
  const [scanCount, setScanCount] = useState(0);
  const [flashActive, setFlashActive] = useState(false);
  const [currentAisle, setCurrentAisle] = useState<string | null>(null);
  const [hasBarcodeAPI, setHasBarcodeAPI] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  // Play beep sound on scan
  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Success beep: higher pitch, pleasant sound
      oscillator.frequency.value = 1800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.25;
      
      oscillator.start();
      setTimeout(() => {
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.stop(audioContext.currentTime + 0.15);
        audioContext.close();
      }, 100);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [soundEnabled]);

  // Detect product aisle from barcode
  const detectAisle = useCallback((barcode: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === barcode);
    if (product?.aisle && product.aisle !== currentAisle) {
      setCurrentAisle(product.aisle);
      onAisleDetected?.(product.aisle);
    }
    return product;
  }, [currentAisle, onAisleDetected]);

  // Switch camera
  const switchCamera = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  }, []);

  // Main camera and detection effect
  useEffect(() => {
    if (disabled) return;
    
    let detector: any = null;
    let frameId: number;
    let mounted = true;

    async function startScanning() {
      // Check for BarcodeDetector API
      if ('BarcodeDetector' in window) {
        setHasBarcodeAPI(true);
        try {
          const formats = isQR 
            ? ['qr_code'] 
            : ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code', 'codabar', 'itf', 'data_matrix'];
          
          // @ts-ignore
          detector = new window.BarcodeDetector({ formats });
          console.log('✅ BarcodeDetector initialized with formats:', formats);
        } catch (e) {
          console.log('BarcodeDetector creation failed:', e);
          setHasBarcodeAPI(false);
        }
      } else {
        setHasBarcodeAPI(false);
        console.log('⚠️ BarcodeDetector API not available - using manual entry');
      }

      // Start camera with HIGH FPS settings for stable scanning
      try {
        const constraints: MediaStreamConstraints = { 
          video: { 
            facingMode: facingMode,
            width: { ideal: 1920, min: 1280 }, 
            height: { ideal: 1080, min: 720 },
            // HIGH FPS for smoother, more stable scanning
            frameRate: { ideal: 60, min: 30 },
          } as MediaTrackConstraints
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Try to apply advanced camera settings after getting stream
        const track = stream.getVideoTracks()[0];
        if (track && 'applyConstraints' in track) {
          try {
            // Apply advanced constraints - use any type to bypass TS strict checking
            const advancedConstraints: any = {
              advanced: [
                { focusMode: 'continuous' },
                { exposureMode: 'continuous' },
                { whiteBalanceMode: 'continuous' }
              ]
            };
            await track.applyConstraints(advancedConstraints);
          } catch (e) {
            // Advanced constraints not supported - that's ok
          }
        }
        
        streamRef.current = stream;
        
        if (videoRef.current && mounted) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setHasCamera(true);
          setError(null);
          setCameraReady(true);
          
          // Log camera FPS info
          const track = stream.getVideoTracks()[0];
          if (track) {
            const settings = track.getSettings();
            console.log(`📷 Camera running at ${settings.frameRate || 30} FPS, ${settings.width}x${settings.height}`);
          }
          
          // Start high-performance detection loop if we have the API and autoScan is enabled
          if (detector && autoScan) {
            requestAnimationFrame(detectLoop);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setHasCamera(false);
          setCameraReady(false);
          if (err.name === 'NotAllowedError') {
            setError('Camera permission denied. Please enable camera access.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera found on this device.');
          } else if (err.name === 'NotReadableError') {
            setError('Camera is being used by another app.');
          } else {
            setError('Camera unavailable: ' + err.message);
          }
        }
      }
    }

    // High-performance detection loop - runs at 60fps for smooth scanning
    let lastDetectTime = 0;
    const DETECT_INTERVAL = 16; // ~60fps detection rate
    
    async function detectLoop(timestamp: number) {
      if (!detector || !videoRef.current || !scanning || !mounted || disabled) return;
      
      // Throttle detection to maintain consistent FPS
      if (timestamp - lastDetectTime < DETECT_INTERVAL) {
        frameId = requestAnimationFrame(detectLoop);
        return;
      }
      lastDetectTime = timestamp;
      
      try {
        if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          const barcodes = await detector.detect(videoRef.current);
          
          if (barcodes.length > 0 && scanning) {
            const rawData = barcodes[0].rawValue;
            const format = barcodes[0].format;
            const now = Date.now();
            
            // Faster debounce: 1 second for SAME code, 300ms for different codes
            const isSameCode = rawData === lastScannedCode;
            const cooldown = isSameCode ? 1000 : 300;
            
            if (now - lastScanTime > cooldown) {
              console.log(`📦 Scanned [${format}]:`, rawData);
              
              setLastScanTime(now);
              setLastScannedCode(rawData);
              setFlashActive(true);
              playBeep();
              setScanCount(prev => prev + 1);
              
              // Detect aisle if not QR mode
              if (!isQR) {
                detectAisle(rawData);
              }
              
              // Callback with scanned data
              onScan(rawData);
              
              // Brief visual flash
              setTimeout(() => {
                if (mounted) setFlashActive(false);
              }, 200);
            }
          }
        }
      } catch (e) {
        // Silent fail on detection errors - continue scanning
      }
      
      if (mounted && scanning) {
        frameId = requestAnimationFrame(detectLoop);
      }
    }

    startScanning();
    
    return () => {
      mounted = false;
      if (frameId) cancelAnimationFrame(frameId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScan, isQR, scanning, disabled, playBeep, detectAisle, facingMode, autoScan, lastScanTime, lastScannedCode]);

  // Manual input state
  const [manualInput, setManualInput] = useState('');
  
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      const trimmedInput = manualInput.trim();
      console.log('📝 Manual entry:', trimmedInput.substring(0, 50) + (trimmedInput.length > 50 ? '...' : ''));
      
      setFlashActive(true);
      playBeep();
      setScanCount(prev => prev + 1);
      setLastScannedCode(trimmedInput);
      
      if (!isQR) {
        detectAisle(trimmedInput);
      }
      
      onScan(trimmedInput);
      setManualInput('');
      setTimeout(() => setFlashActive(false), 300);
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] max-w-lg mx-auto overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Camera Feed */}
      {hasCamera && !error ? (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          />
          
          {/* Flash Effect */}
          {flashActive && (
            <div className="absolute inset-0 bg-emerald-500/50 z-10 transition-opacity duration-150" />
          )}
          
          {/* Camera Loading Overlay */}
          {!cameraReady && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-5">
              <div className="text-center">
                <RefreshCcw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
                <p className="text-white text-sm">Starting camera...</p>
              </div>
            </div>
          )}
          
          {/* Scanning Frame */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-72 h-44 border-2 rounded-2xl relative transition-all duration-300 ${
              flashActive ? 'border-emerald-400 scale-105' : 'border-white/30'
            }`}>
              {/* Corner brackets */}
              <div className={`absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg transition-colors ${flashActive ? 'border-emerald-400' : 'border-amber-500'}`} />
              <div className={`absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg transition-colors ${flashActive ? 'border-emerald-400' : 'border-amber-500'}`} />
              <div className={`absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg transition-colors ${flashActive ? 'border-emerald-400' : 'border-amber-500'}`} />
              <div className={`absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 rounded-br-lg transition-colors ${flashActive ? 'border-emerald-400' : 'border-amber-500'}`} />
              
              {/* Scanning line animation */}
              {scanning && !flashActive && (
                <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scan" />
              )}
              
              {/* Center crosshair for QR */}
              {isQR && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-amber-500 rounded-full opacity-50" />
                </div>
              )}
            </div>
          </div>
          
          {/* Last Scanned Indicator */}
          {lastScannedCode && flashActive && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="bg-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 animate-bounce">
                <Zap className="w-4 h-4" />
                Scanned!
              </div>
            </div>
          )}
        </>
      ) : (
        /* No Camera / Error State */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6">
          <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
          <p className="text-white text-center font-bold mb-2">{error || 'Camera not available'}</p>
          <p className="text-slate-400 text-sm text-center mb-4">
            {isQR ? 'Paste the QR token below' : 'Enter barcode manually'}
          </p>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
        {/* Left: Aisle Info or Sound Toggle */}
        <div className="flex gap-2">
          {currentAisle && !isQR && (
            <div className="bg-black/70 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2">
              <MapPin className="w-3 h-3 text-amber-500" />
              <span className="text-white text-xs font-bold">{currentAisle}</span>
            </div>
          )}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-black/70 backdrop-blur p-2 rounded-full"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-400" />
            )}
          </button>
        </div>
        
        {/* Right: Camera switch & Scan count */}
        <div className="flex gap-2">
          {hasCamera && (
            <button
              onClick={switchCamera}
              className="bg-black/70 backdrop-blur p-2 rounded-full active:bg-white/20"
            >
              <SwitchCamera className="w-4 h-4 text-white" />
            </button>
          )}
          <div className="bg-black/70 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2">
            <Eye className="w-3 h-3 text-emerald-400" />
            <span className="text-white text-xs font-mono">{scanCount}</span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 z-20">
        <div className="flex items-center justify-center gap-2 mb-3">
          {scanning && cameraReady ? (
            <>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-bold">Live Scanning</span>
            </>
          ) : (
            <>
              <RefreshCcw className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="text-amber-400 text-sm font-bold">Initializing...</span>
            </>
          )}
          <span className="text-white/50 text-sm">•</span>
          <span className="text-white text-sm font-bold">{title}</span>
        </div>
        
        {/* Quick Scan Buttons for Demo (when auto-scan not available) */}
        {!isQR && !hasBarcodeAPI && (
          <div className="mb-3">
            <p className="text-white/60 text-xs text-center mb-2">Tap to add demo products:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {MOCK_PRODUCTS.slice(0, 4).map(product => (
                <button
                  key={product.id}
                  onClick={() => {
                    playBeep();
                    setFlashActive(true);
                    setScanCount(prev => prev + 1);
                    setLastScannedCode(product.id);
                    detectAisle(product.id);
                    onScan(product.id);
                    setTimeout(() => setFlashActive(false), 300);
                  }}
                  className="bg-white/10 active:bg-amber-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                >
                  {product.name.split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Manual Input */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder={isQR ? "Paste Exit QR token here..." : "Enter barcode manually..."}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500 focus:bg-white/20"
          />
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="bg-amber-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm active:bg-amber-500 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Scan className="w-4 h-4" />
            {isQR ? 'Verify' : 'Add'}
          </button>
        </form>
        
        {/* Status Messages */}
        {hasBarcodeAPI && hasCamera && cameraReady && (
          <p className="text-emerald-400/70 text-xs text-center mt-2">
            ✓ Real-time {isQR ? 'QR' : 'barcode'} scanning active
          </p>
        )}
        {!hasBarcodeAPI && hasCamera && (
          <p className="text-amber-400/70 text-xs text-center mt-2">
            📷 Camera ready • Use Chrome/Edge for auto-scan or enter manually
          </p>
        )}
      </div>
      
      <style>{`
        @keyframes scan {
          0%, 100% { top: 10%; opacity: 1; }
          50% { top: 85%; opacity: 0.5; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
