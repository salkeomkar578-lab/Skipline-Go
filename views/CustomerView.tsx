/**
 * Customer View - Skipline Go
 * "Just Skip the Line and Go!"
 * 
 * Clean, Modern UI with Invoice Download
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  ShoppingBag, Trash2, CheckCircle, Loader2, X, 
  ShoppingCart, AlertTriangle, ArrowRight,
  Minus, Plus, CreditCard, IndianRupee, Wifi, WifiOff,
  History, MapPin, Store, Globe, Signal, Clock,
  ChevronRight, Package, Receipt, Star, TrendingUp, Home,
  Download, FileText, Share2, ChevronDown, Search, Filter
} from 'lucide-react';
import { CameraScanner } from '../components/CameraScanner';
import { ExitQRCode } from '../components/ExitQRCode';
import { AIChatbot } from '../components/AIChatbot';
import { CartItem, Product, Transaction, TheftAnalysis } from '../types';
import { MOCK_PRODUCTS, CURRENCY_SYMBOL, TAX_RATE } from '../constants';
import { 
  saveTransaction, 
  generateTransactionId,
  getAllTransactions
} from '../services/transactionStore';
import { saveScannedProduct, saveTransactionToFirebase } from '../services/firebaseService';

interface CustomerViewProps {
  userId: string;
  userTier?: string;
  onLogout?: () => void;
}

type ViewState = 'MODE_SELECT' | 'BRANCH_SELECT' | 'SHOPPING' | 'CHECKOUT' | 'PAYMENT' | 'EXIT_QR' | 'HISTORY' | 'ONLINE_BROWSE';
type PaymentMethod = 'GOOGLE_PAY' | 'UPI' | 'CARD' | 'CASH';
type AppMode = 'ONLINE' | 'OFFLINE';

// Mall branches for WiFi demo
const MALL_BRANCHES = [
  { id: 'phoenix', name: 'Phoenix Mall', location: 'Mumbai', wifi: 'SkiplineGo-Phoenix', signal: 'Excellent' },
  { id: 'dlf', name: 'DLF Cyber Hub', location: 'Gurugram', wifi: 'SkiplineGo-DLF', signal: 'Good' },
  { id: 'orion', name: 'Orion Mall', location: 'Bangalore', wifi: 'SkiplineGo-Orion', signal: 'Excellent' },
  { id: 'select', name: 'Select Citywalk', location: 'Delhi', wifi: 'SkiplineGo-Select', signal: 'Good' },
];

// Generate Invoice HTML
const generateInvoice = (transaction: Transaction, branchName: string): string => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${transaction.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; background: #fff; }
    .header { text-align: center; border-bottom: 3px solid #f59e0b; padding-bottom: 24px; margin-bottom: 24px; }
    .logo { font-size: 32px; font-weight: 900; color: #1e293b; }
    .tagline { color: #f59e0b; font-size: 14px; margin-top: 4px; font-weight: 600; }
    .invoice-badge { display: inline-block; background: #dcfce7; color: #166534; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 700; margin: 16px 0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0; }
    .info-item { background: #f8fafc; padding: 12px; border-radius: 8px; }
    .info-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    .info-value { font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 4px; }
    .items-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    .items-table th { background: #f1f5f9; padding: 14px 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .items-table td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .items-table tr:last-child td { border-bottom: none; }
    .total-section { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 24px; border-radius: 12px; margin-top: 24px; }
    .total-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; }
    .grand-total { font-size: 28px; font-weight: 900; color: #059669; }
    .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
    .footer p { margin: 4px 0; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🛒 Skipline Go</div>
    <div class="tagline">"Just Skip the Line and Go!"</div>
  </div>
  
  <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">TAX INVOICE</h1>
  <span class="invoice-badge">✓ PAID</span>
  
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">Invoice No</div>
      <div class="info-value">${transaction.id}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Date & Time</div>
      <div class="info-value">${new Date(transaction.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • ${new Date(transaction.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Store</div>
      <div class="info-value">${branchName}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Payment Method</div>
      <div class="info-value">${transaction.paymentMethod.replace('_', ' ')}</div>
    </div>
  </div>
  
  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 50%">Item</th>
        <th style="text-align: center">Qty</th>
        <th style="text-align: right">Price</th>
        <th style="text-align: right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${transaction.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td style="text-align: center">${item.quantity}</td>
          <td style="text-align: right">₹${item.price.toFixed(2)}</td>
          <td style="text-align: right; font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="total-section">
    <div class="total-row"><span>Subtotal (${transaction.items.length} items)</span><span>₹${transaction.subtotal.toFixed(2)}</span></div>
    <div class="total-row"><span>GST (18%)</span><span>₹${transaction.tax.toFixed(2)}</span></div>
    <div class="total-row" style="border-top: 2px solid #cbd5e1; padding-top: 16px; margin-top: 16px;">
      <span style="font-size: 18px; font-weight: 700;">Grand Total</span>
      <span class="grand-total">₹${transaction.total.toFixed(2)}</span>
    </div>
  </div>
  
  <div class="footer">
    <p style="font-weight: 600; color: #1e293b;">Thank you for shopping with Skipline Go! 🙏</p>
    <p style="margin-top: 8px;">For support: support@skiplinego.com</p>
    <p style="margin-top: 16px; font-size: 10px; color: #94a3b8;">This is a computer-generated invoice and does not require a signature.</p>
  </div>
</body>
</html>`;
};

// Download invoice function
const downloadInvoice = (transaction: Transaction, branchName: string) => {
  const invoiceHTML = generateInvoice(transaction, branchName);
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Skipline-Invoice-${transaction.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const CustomerView: React.FC<CustomerViewProps> = ({ 
  userId, 
  userTier = 'NEW'
}) => {
  // App Mode State
  const [appMode, setAppMode] = useState<AppMode>('OFFLINE');
  const [selectedBranch, setSelectedBranch] = useState(MALL_BRANCHES[0]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [viewState, setViewState] = useState<ViewState>('MODE_SELECT');
  const [lastScannedProduct, setLastScannedProduct] = useState<Product | null>(null);
  
  // Payment State
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('GOOGLE_PAY');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Transaction State
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Session tracking
  const [sessionStart] = useState(Date.now());

  // Load transaction history
  useEffect(() => {
    const history = getAllTransactions().filter(t => t.userId === userId);
    setTransactionHistory(history);
  }, [userId, viewState]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Play beep sound on scan
  const playBeep = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 1800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 150);
    } catch (e) {
      console.log('Audio not available');
    }
  }, []);

  // Find product by barcode - accepts ANY barcode
  const findProduct = (barcode: string): Product => {
    const found = MOCK_PRODUCTS.find(p => p.id === barcode);
    if (found) return found;
    
    const newProduct: Product = {
      id: barcode,
      name: `Scanned Item (${barcode.slice(-6)})`,
      price: Math.floor(Math.random() * 200) + 50,
      category: 'Scanned',
      image: `https://api.dicebear.com/7.x/shapes/svg?seed=${barcode}`,
      icon: '📦',
      aisle: 'Scanned Items'
    };
    
    saveScannedProduct(newProduct);
    return newProduct;
  };

  // Handle barcode scan with beep sound
  const handleScan = useCallback((barcode: string) => {
    if (viewState !== 'SHOPPING') return;
    if (!barcode || barcode.trim() === '') return;
    
    playBeep();
    console.log('📦 Scanned barcode:', barcode);
    
    const product = findProduct(barcode.trim());
    setLastScannedProduct(product);
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, addedAt: Date.now() }];
    });
    
    setTimeout(() => setLastScannedProduct(null), 2000);
  }, [viewState, playBeep]);

  // Cart management with beep
  const updateQuantity = (productId: string, delta: number) => {
    playBeep();
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return newQty === 0 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setViewState('CHECKOUT');
  };

  // Process payment
  const handlePayment = async () => {
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);
    const theftScore = Math.min(100, Math.max(0, 
      (cart.length < 3 ? 10 : 0) +
      (sessionDuration < 60 ? 15 : 0) +
      (total > 2000 ? 10 : 0) +
      Math.floor(Math.random() * 20)
    ));
    
    const theftAnalysis: TheftAnalysis = {
      score: theftScore,
      riskLevel: theftScore > 65 ? 'High' : theftScore > 35 ? 'Medium' : 'Low',
      reasoning: theftScore > 65 
        ? 'Quick checkout with limited scanning activity detected.'
        : theftScore > 35
          ? 'Normal shopping pattern with minor anomalies.'
          : 'Standard shopping behavior observed.',
      flags: [],
      recommendation: theftScore > 65 ? 'QUICK_CHECK' : 'INSTANT_RELEASE'
    };
    
    const transaction: Transaction = {
      id: generateTransactionId(),
      userId,
      userTier: userTier as any,
      items: [...cart],
      subtotal,
      tax,
      total,
      timestamp: Date.now(),
      theftScore,
      theftAnalysis,
      status: 'PAID',
      paymentMethod: selectedPayment,
      behaviorLogs: [],
      sessionDuration,
      syncedToCloud: true,
      branch: selectedBranch.name
    };
    
    saveTransaction(transaction);
    saveTransactionToFirebase(transaction);
    
    console.log('✅ Transaction completed:', transaction.id);
    
    setCompletedTransaction(transaction);
    setIsProcessing(false);
    setViewState('EXIT_QR');
  };

  // Reset session
  const resetSession = () => {
    setCart([]);
    setCompletedTransaction(null);
    setViewState('SHOPPING');
    setLastScannedProduct(null);
  };

  // Connect to Mall WiFi (simulated)
  const connectToMallWifi = async (branch: typeof MALL_BRANCHES[0]) => {
    setIsConnecting(true);
    setSelectedBranch(branch);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnecting(false);
    setAppMode('OFFLINE');
    setViewState('SHOPPING');
  };

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];
  
  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ============================================
  // MODE SELECTION VIEW - Home Screen
  // ============================================
  if (viewState === 'MODE_SELECT') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 safe-area-inset">
        <div className="max-w-md mx-auto pt-6 pb-20">
          {/* Hero Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-amber-500/30 transform rotate-3">
              <span className="text-5xl">🛒</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Skipline Go</h1>
            <p className="text-amber-400 font-bold mt-2 text-lg">"Just Skip the Line and Go!"</p>
            <p className="text-slate-400 text-sm mt-1">Smart Mall Checkout</p>
          </div>

          {/* Mode Selection Cards */}
          <div className="space-y-4">
            {/* Start Shopping - Primary CTA */}
            <button
              onClick={() => setViewState('BRANCH_SELECT')}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-5 rounded-2xl shadow-xl text-left active:scale-[0.98] transition-transform group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-active:scale-90 transition-transform">
                  <Wifi className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-black text-white">Start Shopping</h2>
                  <p className="text-white/70 text-sm mt-0.5">Connect to mall WiFi • Scan & Pay</p>
                </div>
                <ArrowRight className="w-6 h-6 text-white/50" />
              </div>
            </button>

            {/* Browse Products */}
            <button
              onClick={() => setViewState('ONLINE_BROWSE')}
              className="w-full bg-white/5 backdrop-blur border border-white/10 p-5 rounded-2xl text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">Browse Products</h2>
                  <p className="text-slate-400 text-sm">View items from home</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            </button>

            {/* My Orders */}
            <button
              onClick={() => setViewState('HISTORY')}
              className="w-full bg-white/5 backdrop-blur border border-white/10 p-5 rounded-2xl text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Receipt className="w-7 h-7 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">My Orders</h2>
                  <p className="text-slate-400 text-sm">{transactionHistory.length} transactions</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-xl text-center">
              <p className="text-3xl font-black text-white">{transactionHistory.length}</p>
              <p className="text-xs text-slate-400 mt-1">Orders</p>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-xl text-center">
              <p className="text-3xl font-black text-emerald-400">
                {(transactionHistory.reduce((s, t) => s + t.total, 0) / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-slate-400 mt-1">Spent</p>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-xl text-center">
              <p className="text-3xl font-black text-amber-400">{transactionHistory.length * 15}</p>
              <p className="text-xs text-slate-400 mt-1">Mins Saved</p>
            </div>
          </div>

          {/* User Badge */}
          <div className="mt-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">{userTier} Member</p>
              <p className="text-amber-400/70 text-sm">ID: {userId.slice(0, 8)}...</p>
            </div>
          </div>
        </div>
        
        <AIChatbot mode="CUSTOMER" isOnline={true} cartItems={[]} cartTotal={0} />
      </div>
    );
  }

  // ============================================
  // BRANCH SELECTION VIEW
  // ============================================
  if (viewState === 'BRANCH_SELECT') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 safe-area-inset">
        <div className="max-w-md mx-auto pt-6">
          <button onClick={() => setViewState('MODE_SELECT')} className="text-slate-400 text-sm mb-6 flex items-center gap-2 active:text-white">
            ← Back
          </button>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
              <Signal className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Select Your Mall</h1>
            <p className="text-slate-400 mt-1">Connect to start shopping</p>
          </div>

          <div className="space-y-3">
            {MALL_BRANCHES.map(branch => (
              <button
                key={branch.id}
                onClick={() => connectToMallWifi(branch)}
                disabled={isConnecting}
                className="w-full bg-white/5 backdrop-blur border border-white/10 p-4 rounded-xl text-left active:bg-white/10 transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{branch.name}</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {branch.location}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    branch.signal === 'Excellent' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {branch.signal}
                  </span>
                </div>
                
                {isConnecting && selectedBranch.id === branch.id && (
                  <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ONLINE BROWSE VIEW
  // ============================================
  if (viewState === 'ONLINE_BROWSE') {
    return (
      <div className="min-h-screen bg-slate-50 safe-area-inset">
        <div className="bg-white border-b sticky top-0 z-40 px-4 py-3">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setViewState('MODE_SELECT')} className="text-slate-500 active:text-slate-700">
                ← Back
              </button>
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <Globe className="w-3 h-3" /> Browse Mode
              </span>
            </div>
            
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-100 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 ring-amber-500"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white border-b px-4 py-3 overflow-x-auto">
          <div className="max-w-lg mx-auto flex gap-2">
            {categories.slice(0, 6).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-slate-100 text-slate-600 active:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-lg mx-auto p-4 pb-24">
          <p className="text-slate-500 text-sm mb-4">{filteredProducts.length} products</p>
          
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100">
                <div className="w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl mb-3 flex items-center justify-center text-5xl">
                  {product.icon || '📦'}
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{product.name}</h3>
                <p className="text-emerald-600 font-black text-lg mt-1">{CURRENCY_SYMBOL}{product.price}</p>
                <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {product.aisle}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-center">
            <h3 className="text-white font-black text-lg">Ready to Shop?</h3>
            <p className="text-white/80 text-sm mt-1">Visit a mall to scan & checkout</p>
            <button 
              onClick={() => setViewState('BRANCH_SELECT')}
              className="mt-4 bg-white text-amber-600 px-6 py-3 rounded-xl font-bold active:bg-amber-50"
            >
              Find Nearest Mall
            </button>
          </div>
        </div>
        
        <AIChatbot mode="CUSTOMER" isOnline={true} cartItems={[]} cartTotal={0} />
      </div>
    );
  }

  // ============================================
  // HISTORY VIEW with Invoice Download
  // ============================================
  if (viewState === 'HISTORY') {
    return (
      <div className="min-h-screen bg-slate-900 safe-area-inset">
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <button onClick={() => setViewState('MODE_SELECT')} className="text-slate-400 active:text-white">
              ← Back
            </button>
            <h1 className="text-lg font-bold text-white">My Orders</h1>
            <div className="w-12" />
          </div>
        </div>

        <div className="max-w-lg mx-auto p-4 pb-24">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Time Saved</p>
                <p className="text-4xl font-black text-white">{transactionHistory.length * 15} min</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-white/60 text-xs mt-3">
              {transactionHistory.length} orders • ₹{transactionHistory.reduce((s, t) => s + t.total, 0).toFixed(0)} total spent
            </p>
          </div>

          {transactionHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-white font-bold text-lg">No orders yet</h3>
              <p className="text-slate-500 text-sm mt-1">Start shopping to see your history</p>
              <button
                onClick={() => setViewState('BRANCH_SELECT')}
                className="mt-6 bg-amber-500 text-white px-6 py-3 rounded-xl font-bold"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {transactionHistory.map(tx => (
                <div key={tx.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500 font-mono">{tx.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      tx.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' :
                      tx.status === 'PAID' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-white">{tx.items.length} items</p>
                      <p className="text-slate-500 text-sm">
                        {new Date(tx.timestamp).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'short', year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <p className="text-2xl font-black text-white">₹{tx.total.toFixed(0)}</p>
                  </div>
                  
                  <button
                    onClick={() => downloadInvoice(tx, (tx as any).branch || selectedBranch.name)}
                    className="w-full mt-2 bg-slate-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-slate-600"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <AIChatbot mode="CUSTOMER" isOnline={true} cartItems={[]} cartTotal={0} />
      </div>
    );
  }

  // ============================================
  // EXIT QR VIEW with Invoice Download
  // ============================================
  if (viewState === 'EXIT_QR' && completedTransaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 p-4 safe-area-inset">
        <div className="max-w-md mx-auto pt-6 pb-20">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-emerald-500/40">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white">Payment Done! 🎉</h1>
            <p className="text-emerald-300 mt-2">Show this QR at exit gate</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-2xl">
            <ExitQRCode 
              transaction={completedTransaction}
              onExpired={() => console.log('QR expired')}
            />
          </div>
          
          <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-emerald-300/70">Invoice</p>
                <p className="text-white font-mono font-bold">{completedTransaction.id}</p>
              </div>
              <div>
                <p className="text-emerald-300/70">Items</p>
                <p className="text-white font-bold">{completedTransaction.items.length}</p>
              </div>
              <div>
                <p className="text-emerald-300/70">Store</p>
                <p className="text-white font-bold">{selectedBranch.name}</p>
              </div>
              <div>
                <p className="text-emerald-300/70">Total</p>
                <p className="text-emerald-400 font-black text-xl">{CURRENCY_SYMBOL}{completedTransaction.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={() => downloadInvoice(completedTransaction, selectedBranch.name)}
              className="w-full bg-white text-emerald-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-emerald-50"
            >
              <Download className="w-5 h-5" />
              Download Invoice
            </button>
            
            <button
              onClick={resetSession}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-emerald-700"
            >
              <ShoppingCart className="w-5 h-5" />
              Continue Shopping
            </button>
            
            <button
              onClick={() => setViewState('MODE_SELECT')}
              className="w-full bg-white/10 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-white/20"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
        
        <AIChatbot mode="CUSTOMER" isOnline={true} cartItems={[]} cartTotal={0} />
      </div>
    );
  }

  // ============================================
  // CHECKOUT VIEW
  // ============================================
  if (viewState === 'CHECKOUT') {
    return (
      <div className="min-h-screen bg-white safe-area-inset">
        <div className="bg-white border-b sticky top-0 z-40 px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <button onClick={() => setViewState('SHOPPING')} className="p-2 active:bg-slate-100 rounded-xl">
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Checkout</h1>
            <div className="w-10" />
          </div>
        </div>
        
        <div className="max-w-lg mx-auto p-4 pb-32">
          <div className="space-y-3 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl border">
                  {item.icon || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{item.name}</p>
                  <p className="text-slate-500 text-xs">×{item.quantity}</p>
                </div>
                <p className="font-bold">{CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(0)}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span>{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST (18%)</span>
                <span>{CURRENCY_SYMBOL}{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t mt-3">
                <span>Total</span>
                <span className="text-emerald-600">{CURRENCY_SYMBOL}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold text-slate-700 mb-3">Pay with</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'GOOGLE_PAY' as PaymentMethod, name: 'Google Pay', icon: '📱' },
                { id: 'UPI' as PaymentMethod, name: 'UPI', icon: '🔗' },
                { id: 'CARD' as PaymentMethod, name: 'Card', icon: '💳' },
                { id: 'CASH' as PaymentMethod, name: 'Cash', icon: '💵' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all active:scale-[0.98] ${
                    selectedPayment === method.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-slate-200'
                  }`}
                >
                  <span className="text-2xl block mb-1">{method.icon}</span>
                  <span className="text-sm font-bold">{method.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 active:bg-emerald-700 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay {CURRENCY_SYMBOL}{total.toFixed(0)}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN SHOPPING VIEW
  // ============================================
  return (
    <div className="min-h-screen bg-slate-100 safe-area-inset">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setViewState('MODE_SELECT')} className="text-slate-500 text-sm">
              ← Home
            </button>
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-700 text-xs font-bold">{selectedBranch.name}</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-slate-900">{CURRENCY_SYMBOL}{total.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4 pb-32">
        <CameraScanner
          title="Scan Product"
          onScan={handleScan}
          isQR={false}
        />
        
        {lastScannedProduct && (
          <div className="bg-emerald-500 text-white p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl">
              {lastScannedProduct.icon || '✓'}
            </div>
            <div className="flex-1">
              <p className="font-bold">Added!</p>
              <p className="text-sm text-emerald-100">{lastScannedProduct.name}</p>
            </div>
            <p className="font-bold">{CURRENCY_SYMBOL}{lastScannedProduct.price}</p>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-600" />
              <h2 className="font-bold text-slate-800">Cart</h2>
            </div>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
              {cart.length}
            </span>
          </div>
          
          {cart.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">Empty cart</p>
              <p className="text-sm text-slate-400">Scan items to add</p>
            </div>
          ) : (
            <div className="divide-y max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="p-3 flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-2xl">
                    {item.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{item.name}</p>
                    <p className="text-slate-500 text-xs">{CURRENCY_SYMBOL}{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center active:bg-slate-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center active:bg-slate-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-rose-500 active:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="bg-white rounded-xl p-4 flex items-center justify-between">
            <span className="text-slate-600">Total (incl. GST)</span>
            <span className="text-2xl font-black text-emerald-600">{CURRENCY_SYMBOL}{total.toFixed(0)}</span>
          </div>
        )}
      </div>
      
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
          <div className="max-w-lg mx-auto">
            <button
              onClick={handleCheckout}
              className="w-full bg-amber-500 active:bg-amber-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
            >
              <CreditCard className="w-5 h-5" />
              Checkout • {CURRENCY_SYMBOL}{total.toFixed(0)}
            </button>
          </div>
        </div>
      )}
      
      <AIChatbot 
        mode="CUSTOMER"
        isOnline={true}
        cartItems={cart}
        cartTotal={total}
        currentAisle={lastScannedProduct?.aisle}
      />
    </div>
  );
};
