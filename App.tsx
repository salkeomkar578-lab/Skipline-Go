/**
 * Skipline Go - Main Application
 * MyTech Team - Smart Mall Checkout System
 * 
 * 3-Block Architecture:
 * - Block 1: Customer App (Shopping, Scanning, Payment)
 * - Block 2: Staff App (Exit Verification, Dashboard)
 * - Block 3: Central Database (Transaction Store)
 */

import React, { useState } from 'react';
import { 
  Store, ShoppingCart, ShieldCheck, Loader2, UserCircle, LogOut,
  CreditCard, QrCode, CheckCircle, ArrowRight, ArrowLeft, Sparkles,
  Smartphone, Wifi, Camera, DoorOpen
} from 'lucide-react';
import { CustomerView } from './views/CustomerView';
import { StaffView } from './views/StaffView';
import { signInWithGoogle } from './config/firebase';
import { saveGuestUser } from './services/firebaseService';
import { AnimatedLogo } from './components/AnimatedLogo';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';

type AppMode = 'LANDING' | 'GUIDE' | 'CUSTOMER' | 'STAFF';

// Icons for user guide steps
const guideStepIcons = [
  <Smartphone className="w-10 h-10" />,
  <Wifi className="w-10 h-10" />,
  <Camera className="w-10 h-10" />,
  <CreditCard className="w-10 h-10" />,
  <QrCode className="w-10 h-10" />,
  <DoorOpen className="w-10 h-10" />
];

const guideStepColors = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-green-500",
  "from-orange-500 to-amber-500",
  "from-rose-500 to-red-500",
  "from-teal-500 to-cyan-500"
];

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  // Initialize user from localStorage immediately (no loading state needed)
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('skipline_demo_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return null;
  });
  const [signingIn, setSigningIn] = useState(false);
  const [mode, setMode] = useState<AppMode>('LANDING');
  const [guideStep, setGuideStep] = useState(0);
  const [hasSeenGuide, setHasSeenGuide] = useState(() => {
    return localStorage.getItem('skipline_guide_seen') === 'true';
  });

  // GOOGLE SIGN IN - With proper authentication
  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      // Try real Firebase Google auth
      const result = await signInWithGoogle();
      if (result) {
        // Save authenticated user
        const googleUser = {
          uid: result.uid,
          email: result.email,
          displayName: result.displayName || 'Google User',
          photoURL: result.photoURL,
          isAnonymous: false,
          isAuthenticated: true
        };
        localStorage.setItem('skipline_demo_user', JSON.stringify(googleUser));
        setUser(googleUser);
      }
    } catch (e) {
      console.error('Google sign in error:', e);
      // Fallback to demo Google user if Firebase fails
      const timestamp = Date.now();
      const demoGoogleUser = {
        uid: `google-${timestamp}`,
        email: 'user@gmail.com',
        displayName: 'Google User',
        isAnonymous: false,
        isAuthenticated: true
      };
      localStorage.setItem('skipline_demo_user', JSON.stringify(demoGoogleUser));
      setUser(demoGoogleUser);
    }
    setSigningIn(false);
  };

  // GUEST SIGN IN - Direct access, NO authentication needed
  const handleGuestSignIn = () => {
    // Create guest user directly - NO async, NO waiting
    const timestamp = Date.now();
    const guestUser = {
      uid: `guest-${timestamp}`,
      email: null,
      displayName: 'Guest Shopper',
      isAnonymous: true,
      isAuthenticated: false  // Guest = no authentication
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('skipline_demo_user', JSON.stringify(guestUser));
    
    // Set user immediately - instant access
    setUser(guestUser);
    
    // Save guest data to Firebase in background (fire and forget)
    saveGuestUser(guestUser).catch(console.error);
  };

  const handleSignOut = () => {
    localStorage.removeItem('skipline_demo_user');
    setUser(null);
    setMode('LANDING');
  };

  const completeGuide = () => {
    localStorage.setItem('skipline_guide_seen', 'true');
    setHasSeenGuide(true);
    setMode('LANDING');
  };

  const startGuide = () => {
    setGuideStep(0);
    setMode('GUIDE');
  };

  // Get translated guide steps
  const userGuideSteps = [
    { ...t.guide.steps.openApp, step: 1, icon: guideStepIcons[0], color: guideStepColors[0] },
    { ...t.guide.steps.connectWifi, step: 2, icon: guideStepIcons[1], color: guideStepColors[1] },
    { ...t.guide.steps.scanProducts, step: 3, icon: guideStepIcons[2], color: guideStepColors[2] },
    { ...t.guide.steps.payInApp, step: 4, icon: guideStepIcons[3], color: guideStepColors[3] },
    { ...t.guide.steps.getExitQR, step: 5, icon: guideStepIcons[4], color: guideStepColors[4] },
    { ...t.guide.steps.showQRAtExit, step: 6, icon: guideStepIcons[5], color: guideStepColors[5] },
  ];

  // USER GUIDE screen - Step by step instructions
  if (mode === 'GUIDE') {
    const step = userGuideSteps[guideStep];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col p-6">
        {/* Language Selector - Opens downward at top */}
        <div className="absolute top-4 right-4">
          <LanguageSelector variant="dark" openDirection="down" />
        </div>
        
        <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-amber-500 font-black text-lg">{t.guide.howToUseApp}</h1>
          </div>
          
          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-6">
            {userGuideSteps.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-slate-700">
                <div 
                  className={`h-full transition-all duration-300 ${i <= guideStep ? 'bg-amber-500' : 'bg-transparent'}`}
                  style={{ width: i < guideStep ? '100%' : i === guideStep ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>

          {/* Step number */}
          <div className="text-center mb-4">
            <span className="bg-amber-500 text-slate-900 px-4 py-1 rounded-full text-sm font-black">
              {t.guide.step} {step.step} {t.guide.of} {userGuideSteps.length}
            </span>
          </div>

          {/* Step content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mb-6 shadow-2xl text-white`}>
              {step.icon}
            </div>
            <h2 className="text-2xl font-black text-white mb-3">{step.title}</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-4">{step.instruction}</p>
            <p className="text-amber-400 text-sm bg-amber-500/10 px-4 py-2 rounded-xl">{step.tip}</p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {guideStep > 0 && (
              <button
                onClick={() => setGuideStep(s => s - 1)}
                className="flex-1 bg-slate-700 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-600 transition-all"
              >
                <ArrowLeft className="w-5 h-5" /> {t.guide.back}
              </button>
            )}
            
            {guideStep < userGuideSteps.length - 1 ? (
              <button
                onClick={() => setGuideStep(s => s + 1)}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                {t.guide.nextStep} <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={completeGuide}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <CheckCircle className="w-5 h-5" /> {t.guide.imReady}
              </button>
            )}
          </div>

          {/* Skip button */}
          <button
            onClick={completeGuide}
            className="w-full text-slate-500 py-3 mt-3 text-sm font-medium hover:text-slate-300 transition-colors"
          >
            {t.guide.skipGuide}
          </button>
        </div>
      </div>
    );
  }

  // Not logged in - show login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex flex-col items-center justify-center p-6">
        {/* Language Selector - Opens downward at top */}
        <div className="absolute top-4 right-4">
          <LanguageSelector variant="light" openDirection="down" />
        </div>
        
        <div className="max-w-md w-full space-y-8">
          {/* Animated Logo */}
          <AnimatedLogo size="lg" showText={true} animate={true} />
          <p className="text-slate-400 text-sm text-center -mt-4">{t.app.smartMallCheckout} • Scan & Pay</p>

          {/* Login Options - Two Separate Sections */}
          <div className="space-y-4">
            
            {/* OPTION 1: Quick Guest Access - NO Authentication */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-1 rounded-3xl shadow-xl">
              <div className="bg-white p-6 rounded-[1.4rem]">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">{t.landing.quickAccess}</p>
                <button
                  onClick={handleGuestSignIn}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-lg hover:scale-[1.02] transition-all text-lg"
                >
                  <UserCircle className="w-6 h-6" />
                  {t.landing.continueAsGuest}
                </button>
                <p className="text-xs text-slate-400 text-center mt-2">{t.landing.noSignUpNeeded} • {t.landing.startShoppingInstantly}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 text-slate-400 text-sm font-medium">{t.landing.orSignInToSaveHistory}</span>
              </div>
            </div>

            {/* OPTION 2: Google Authentication */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">{t.landing.withAccount}</p>
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="w-full bg-white border-2 border-slate-200 text-slate-800 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
              >
                {signingIn ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {t.landing.continueWithGoogle}
              </button>
              <p className="text-xs text-slate-400 text-center mt-2">{t.landing.syncAcrossDevices}</p>
            </div>
          </div>

          {/* How it works button */}
          <button
            onClick={startGuide}
            className="w-full text-amber-600 py-3 text-sm font-semibold hover:text-amber-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> {t.landing.howToUse}
          </button>

          <p className="text-center text-xs text-slate-400">
            {t.app.myTechTeam} • {t.app.version}
          </p>
        </div>
      </div>
    );
  }

  // Logged in but no mode selected - show mode selector
  if (mode === 'LANDING') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-6">
        {/* Language Selector - Opens downward at top */}
        <div className="absolute top-4 right-4">
          <LanguageSelector variant="light" openDirection="down" />
        </div>
        
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{t.landing.welcomeTo}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {user.displayName || 'Guest'} • {user.email || 'Anonymous User'}
            </p>
          </div>

          {/* New user guide prompt */}
          {!hasSeenGuide && (
            <button
              onClick={startGuide}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all mb-2"
            >
              <Sparkles className="w-5 h-5" /> {t.modeSelect.firstTimeLearn}
            </button>
          )}

          {/* Mode Selection */}
          <div className="space-y-4">
            {/* Customer Mode */}
            <button
              onClick={() => setMode('CUSTOMER')}
              className="w-full bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-amber-500 transition-all text-left flex items-center gap-4 group"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                <ShoppingCart className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900">{t.modeSelect.customerMode}</h2>
                <p className="text-slate-500 text-sm">{t.modeSelect.customerModeDesc}</p>
              </div>
            </button>

            {/* Staff Mode */}
            <button
              onClick={() => setMode('STAFF')}
              className="w-full bg-slate-900 p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-emerald-500 transition-all text-left flex items-center gap-4 group"
            >
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                <ShieldCheck className="w-8 h-8 text-emerald-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{t.modeSelect.staffMode}</h2>
                <p className="text-slate-400 text-sm">{t.modeSelect.staffModeDesc}</p>
              </div>
            </button>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full text-slate-500 py-3 text-sm font-medium hover:text-slate-700 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> {t.landing.signOut}
          </button>
        </div>
      </div>
    );
  }

  // CUSTOMER MODE - Full screen customer experience (standalone)
  if (mode === 'CUSTOMER') {
    return (
      <div className="min-h-screen bg-slate-50">
        <CustomerView 
          userId={user.uid} 
          userTier="NEW" 
          onExit={() => setMode('LANDING')}
        />
      </div>
    );
  }

  // STAFF MODE - Full screen staff experience (standalone - no floating buttons)
  if (mode === 'STAFF') {
    return (
      <div className="min-h-screen bg-slate-900">
        <StaffView onExit={() => setMode('LANDING')} />
      </div>
    );
  }

  return null;
};

// Main App component wrapped with LanguageProvider
const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;

