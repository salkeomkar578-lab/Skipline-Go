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
  Download, FileText, Share2, ChevronDown, Search, Filter,
  ShieldCheck, PartyPopper, Copy
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { CameraScanner } from '../components/CameraScanner';
import { ExitQRCode } from '../components/ExitQRCode';
import { PreorderQRCode } from '../components/PreorderQRCode';
import { AIChatbot } from '../components/AIChatbot';
import { CartItem, Product, Transaction, TheftAnalysis } from '../types';
import { MOCK_PRODUCTS, CURRENCY_SYMBOL, TAX_RATE } from '../constants';
import { 
  saveTransaction, 
  generateTransactionId,
  getAllTransactions,
  getTransactionById
} from '../services/transactionStore';
import { 
  saveScannedProduct, 
  saveTransactionToFirebase,
  subscribeToTransactionNotification 
} from '../services/firebaseService';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

interface CustomerViewProps {
  userId: string;
  userTier?: string;
  onLogout?: () => void;
  onExit?: () => void;
}

type ViewState = 'MODE_SELECT' | 'BRANCH_SELECT' | 'SHOPPING' | 'CHECKOUT' | 'PAYMENT' | 'EXIT_QR' | 'HISTORY' | 'ONLINE_BROWSE' | 'CITY_SELECT' | 'PREORDER_MALL_SELECT' | 'PREORDER_PAYMENT' | 'PREORDER_QR' | 'VIEW_PREORDER_QR';
type PaymentMethod = 'GOOGLE_PAY' | 'UPI' | 'CARD' | 'CASH';
type AppMode = 'ONLINE' | 'OFFLINE';

// Cities with mall data
const CITIES = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', icon: '🌆' },
  { id: 'delhi', name: 'Delhi NCR', state: 'Delhi', icon: '🏛️' },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', icon: '🌳' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', icon: '🕌' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', icon: '🛕' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', icon: '⛰️' },
];

// Mall branches for WiFi demo with city mapping
const MALL_BRANCHES = [
  { id: 'phoenix', name: 'Phoenix Mall', location: 'Mumbai', city: 'mumbai', wifi: 'SkiplineGo-Phoenix', signal: 'Excellent', address: 'Lower Parel, Mumbai', rating: 4.5, timing: '10 AM - 10 PM' },
  { id: 'inorbit', name: 'Inorbit Mall', location: 'Mumbai', city: 'mumbai', wifi: 'SkiplineGo-Inorbit', signal: 'Good', address: 'Malad West, Mumbai', rating: 4.3, timing: '10 AM - 9 PM' },
  { id: 'dlf', name: 'DLF Cyber Hub', location: 'Gurugram', city: 'delhi', wifi: 'SkiplineGo-DLF', signal: 'Good', address: 'Cyber City, Gurugram', rating: 4.6, timing: '10 AM - 11 PM' },
  { id: 'select', name: 'Select Citywalk', location: 'Delhi', city: 'delhi', wifi: 'SkiplineGo-Select', signal: 'Good', address: 'Saket, New Delhi', rating: 4.4, timing: '10 AM - 10 PM' },
  { id: 'orion', name: 'Orion Mall', location: 'Bangalore', city: 'bangalore', wifi: 'SkiplineGo-Orion', signal: 'Excellent', address: 'Dr Rajkumar Rd, Bangalore', rating: 4.5, timing: '10 AM - 10 PM' },
  { id: 'phoenix_blr', name: 'Phoenix Marketcity', location: 'Bangalore', city: 'bangalore', wifi: 'SkiplineGo-Phoenix-BLR', signal: 'Excellent', address: 'Whitefield, Bangalore', rating: 4.4, timing: '10 AM - 10 PM' },
  { id: 'inorbit_hyd', name: 'Inorbit Mall', location: 'Hyderabad', city: 'hyderabad', wifi: 'SkiplineGo-Inorbit-HYD', signal: 'Good', address: 'Hitech City, Hyderabad', rating: 4.3, timing: '10 AM - 9 PM' },
  { id: 'express', name: 'Express Avenue', location: 'Chennai', city: 'chennai', wifi: 'SkiplineGo-Express', signal: 'Excellent', address: 'Royapettah, Chennai', rating: 4.2, timing: '10 AM - 10 PM' },
  { id: 'seasons', name: 'Seasons Mall', location: 'Pune', city: 'pune', wifi: 'SkiplineGo-Seasons', signal: 'Good', address: 'Magarpatta, Pune', rating: 4.1, timing: '10 AM - 9 PM' },
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

// Sanitize text for PDF (remove non-ASCII characters)
const sanitizeForPDF = (text: string): string => {
  // Replace non-ASCII with closest ASCII equivalent or remove
  return text
    .replace(/[^\x00-\x7F]/g, '') // Remove all non-ASCII
    .trim() || text.split(' ').filter(w => /^[\x00-\x7F]+$/.test(w)).join(' ') || 'N/A';
};

// Download invoice as PDF function - always uses English for compatibility
const downloadInvoice = (transaction: Transaction, branchName: string, _pdfLabels?: any, _locale?: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;
  
  // Always use English labels and locale (jsPDF default fonts don't support Unicode)
  const labels = {
    taxInvoice: 'TAX INVOICE',
    paid: 'PAID',
    invoiceNo: 'Invoice No:',
    date: 'Date:',
    store: 'Store:',
    payment: 'Payment:',
    item: 'ITEM',
    qty: 'QTY',
    price: 'PRICE',
    total: 'TOTAL',
    subtotal: 'Subtotal',
    gst: 'GST (18%)',
    grandTotal: 'Grand Total',
    thankYou: 'Thank you for shopping with Skipline Go!',
    support: 'For support: support@skiplinego.com',
    computerGenerated: 'This is a computer-generated invoice and does not require a signature.',
  };
  
  // Always use English locale for dates to avoid Unicode
  const englishLocale = 'en-US';
  
  // Header - Use simple ASCII characters only
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('SKIPLINE GO', pageWidth / 2, y, { align: 'center' });
  
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'italic');
  doc.text('Just Skip the Line and Go!', pageWidth / 2, y, { align: 'center' });
  
  // Line
  y += 10;
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(1);
  doc.line(20, y, pageWidth - 20, y);
  
  // Tax Invoice Title
  y += 15;
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(labels.taxInvoice, 20, y);
  
  // Paid Badge
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(pageWidth - 50, y - 8, 30, 12, 3, 3, 'F');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.text(labels.paid, pageWidth - 35, y - 1, { align: 'center' });
  
  // Invoice Details
  y += 20;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  
  // Left column
  doc.text(labels.invoiceNo, 20, y);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(transaction.id, 50, y);
  
  // Right column - always use English locale for PDF compatibility
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(labels.date, pageWidth / 2 + 10, y);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  const dateStr = new Date(transaction.timestamp).toLocaleDateString(englishLocale, { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = new Date(transaction.timestamp).toLocaleTimeString(englishLocale, { hour: '2-digit', minute: '2-digit' });
  doc.text(`${dateStr} - ${timeStr}`, pageWidth / 2 + 28, y);
  
  y += 8;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(labels.store, 20, y);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(branchName, 50, y);
  
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(labels.payment, pageWidth / 2 + 10, y);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(transaction.paymentMethod.replace('_', ' '), pageWidth / 2 + 35, y);
  
  // Items Table Header
  y += 20;
  doc.setFillColor(241, 245, 249);
  doc.rect(20, y - 5, pageWidth - 40, 10, 'F');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text(labels.item, 25, y);
  doc.text(labels.qty, pageWidth / 2, y, { align: 'center' });
  doc.text(labels.price, pageWidth - 50, y, { align: 'right' });
  doc.text(labels.total, pageWidth - 25, y, { align: 'right' });
  
  // Items - Use Rs. instead of Unicode rupee symbol
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  transaction.items.forEach((item, i) => {
    doc.setFontSize(9);
    doc.text(item.name.substring(0, 30), 25, y);
    doc.text(item.quantity.toString(), pageWidth / 2, y, { align: 'center' });
    doc.text(`Rs.${item.price.toFixed(2)}`, pageWidth - 50, y, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs.${(item.price * item.quantity).toFixed(2)}`, pageWidth - 25, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    y += 8;
    
    // Line
    if (i < transaction.items.length - 1) {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(25, y - 3, pageWidth - 25, y - 3);
    }
  });
  
  // Totals Section
  y += 10;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, y - 5, pageWidth - 40, 45, 3, 3, 'F');
  
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`${labels.subtotal} (${transaction.items.length} items)`, 25, y);
  doc.text(`Rs.${transaction.subtotal.toFixed(2)}`, pageWidth - 25, y, { align: 'right' });
  
  y += 8;
  doc.text(labels.gst, 25, y);
  doc.text(`Rs.${transaction.tax.toFixed(2)}`, pageWidth - 25, y, { align: 'right' });
  
  // Grand Total
  y += 5;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(25, y, pageWidth - 25, y);
  
  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(labels.grandTotal, 25, y);
  doc.setFontSize(16);
  doc.setTextColor(5, 150, 105);
  doc.text(`Rs.${transaction.total.toFixed(2)}`, pageWidth - 25, y, { align: 'right' });
  
  // Footer
  y += 25;
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(labels.thankYou, pageWidth / 2, y, { align: 'center' });
  
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(labels.support, pageWidth / 2, y, { align: 'center' });
  
  y += 10;
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(labels.computerGenerated, pageWidth / 2, y, { align: 'center' });
  
  // Save the PDF
  doc.save(`Skipline-Invoice-${transaction.id}.pdf`);
};

export const CustomerView: React.FC<CustomerViewProps> = ({ 
  userId, 
  userTier = 'NEW',
  onExit
}) => {
  const { t, language } = useLanguage();
  
  // Locale mapping for date formatting
  const localeMap: Record<string, string> = {
    'en': 'en-IN',
    'mr': 'mr-IN',
    'hi': 'hi-IN'
  };
  
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
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Transaction State
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Session tracking
  const [sessionStart] = useState(Date.now());
  
  // Preorder state (for online browse mode)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [preorderCart, setPreorderCart] = useState<CartItem[]>([]);
  const [showPreorderModal, setShowPreorderModal] = useState(false);
  
  // Saved preorder QR view state
  const [viewingPreorder, setViewingPreorder] = useState<Transaction | null>(null);
  
  // City/Mall selection for preorder
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [preorderMall, setPreorderMall] = useState<typeof MALL_BRANCHES[0] | null>(null);
  const [preorderTransaction, setPreorderTransaction] = useState<{
    id: string;
    items: CartItem[];
    total: number;
    mall: string;
    timestamp: number;
    pickupCode: string;
  } | null>(null);
  
  // QR Verification notification state
  const [qrVerifiedNotification, setQrVerifiedNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'flagged';
  }>({ show: false, message: '', type: 'success' });

  // Preorder pickup confirmed state
  const [pickupConfirmed, setPickupConfirmed] = useState(false);
  const [pickupCountdown, setPickupCountdown] = useState(5);

  // History tab state (must be at top level for React hooks rules)
  const [historyTab, setHistoryTab] = useState<'ONLINE' | 'OFFLINE'>('OFFLINE');

  // Load transaction history
  useEffect(() => {
    const loadHistory = () => {
      const allTx = getAllTransactions();
      const userHistory = allTx.filter(t => t.userId === userId);
      console.log('📜 Loaded history:', userHistory.length, 'transactions');
      setTransactionHistory(userHistory);
    };
    
    loadHistory();
    
    // Also reload on storage changes (for cross-tab sync)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'skipline_transactions') {
        loadHistory();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [userId, viewState]);
  
  // Listen for QR verification events (staff releases gate) - Firebase real-time
  useEffect(() => {
    if (!completedTransaction) return;
    
    console.log('🔔 Setting up Firebase notification listener for transaction:', completedTransaction.id);
    
    // Subscribe to Firebase notification updates
    const unsubscribe = subscribeToTransactionNotification(completedTransaction.id, (notification) => {
      if (!notification) return;
      
      console.log('✅ Received notification from Firebase:', notification);
      
      const notificationType = notification.type === 'gate_released' ? 'success' : 
                               notification.type === 'flagged' ? 'flagged' : 'success';
      
      setQrVerifiedNotification({
        show: true,
        message: notification.message || 'Your QR code has been verified!',
        type: notificationType
      });
      
      // Auto redirect after showing notification
      if (notificationType === 'success') {
        // Redirect to home after 3 seconds
        setTimeout(() => {
          setQrVerifiedNotification({ show: false, message: '', type: 'success' });
          setCompletedTransaction(null);
          setCart([]);
          setViewState('MODE_SELECT');
        }, 3000);
      } else {
        // For flagged, just hide notification after 6 seconds
        setTimeout(() => {
          setQrVerifiedNotification({ show: false, message: '', type: 'success' });
        }, 6000);
      }
    });
    
    return () => unsubscribe();
  }, [completedTransaction]);

  // Listen for PREORDER pickup verification from staff - Firebase real-time
  useEffect(() => {
    if (!preorderTransaction || viewState !== 'PREORDER_QR') return;
    
    console.log('🔔 Setting up Firebase notification listener for preorder:', preorderTransaction.id);
    
    // Subscribe to Firebase notification updates
    const unsubscribe = subscribeToTransactionNotification(preorderTransaction.id, (notification) => {
      if (!notification) return;
      
      console.log('✅ Preorder pickup verified by staff via Firebase:', notification);
      
      // Update local transaction status
      const updatedTx = { ...preorderTransaction, status: 'PREORDER_COLLECTED' };
      setPreorderTransaction(updatedTx);
      
      // Update transaction history
      setTransactionHistory(prev => 
        prev.map(t => t.id === preorderTransaction.id ? { ...t, status: 'PREORDER_COLLECTED' } : t)
      );
      
      // Show pickup confirmed state
      setPickupConfirmed(true);
      setPickupCountdown(5);
    });
    
    return () => unsubscribe();
  }, [preorderTransaction, viewState]);

  // Listen for verification when viewing from history
  useEffect(() => {
    if (!viewingPreorder || viewState !== 'VIEW_PREORDER_QR') return;
    if (viewingPreorder.status === 'PREORDER_COLLECTED') return; // Already collected
    
    console.log('🔔 Setting up Firebase notification listener for saved preorder:', viewingPreorder.id);
    
    const unsubscribe = subscribeToTransactionNotification(viewingPreorder.id, (notification) => {
      if (!notification) return;
      
      console.log('✅ Saved preorder pickup verified by staff:', notification);
      
      // Update viewing preorder status
      setViewingPreorder(prev => prev ? { ...prev, status: 'PREORDER_COLLECTED' } : null);
      
      // Update transaction history
      setTransactionHistory(prev => 
        prev.map(t => t.id === viewingPreorder.id ? { ...t, status: 'PREORDER_COLLECTED' } : t)
      );
      
      // Show pickup confirmed state - redirect to success
      setPickupConfirmed(true);
      setPickupCountdown(5);
      setViewState('PREORDER_QR');
      setPreorderTransaction({
        id: viewingPreorder.id,
        items: viewingPreorder.items || [],
        total: viewingPreorder.total,
        mall: viewingPreorder.preorderMall || viewingPreorder.branch || '',
        timestamp: viewingPreorder.timestamp,
        pickupCode: viewingPreorder.preorderPickupCode || ''
      });
    });
    
    return () => unsubscribe();
  }, [viewingPreorder, viewState]);

  // Countdown timer when pickup is confirmed
  useEffect(() => {
    if (!pickupConfirmed) return;
    
    if (pickupCountdown <= 0) {
      // Redirect to shopping
      setPickupConfirmed(false);
      setPickupCountdown(5);
      setPreorderCart([]);
      setPreorderTransaction(null);
      setViewState('MODE_SELECT');
      return;
    }
    
    const timer = setTimeout(() => {
      setPickupCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [pickupConfirmed, pickupCountdown]);

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
    
    // Save to local storage
    saveTransaction(transaction);
    
    // Save to Firebase for cross-device sync
    try {
      await saveTransactionToFirebase(transaction);
      console.log('✅ Transaction saved to Firebase:', transaction.id);
    } catch (error) {
      console.error('❌ Firebase save error:', error);
    }
    
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
            <h1 className="text-4xl font-black text-white tracking-tight">{t.app.name}</h1>
            <p className="text-amber-400 font-bold mt-2 text-lg">{t.app.tagline}</p>
            <p className="text-slate-400 text-sm mt-1">{t.app.smartMallCheckout}</p>
          </div>

          {/* Mode Selection Cards */}
          <div className="space-y-4">
            {/* Preorder Online - PRIMARY CTA */}
            <button
              onClick={() => setViewState('CITY_SELECT')}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 p-5 rounded-2xl shadow-xl text-left active:scale-[0.98] transition-transform group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-active:scale-90 transition-transform">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-black text-white">Preorder & Pickup</h2>
                  <p className="text-white/70 text-sm mt-0.5">Order now, collect from mall</p>
                </div>
                <ArrowRight className="w-6 h-6 text-white/50" />
              </div>
            </button>

            {/* Shop In-Store */}
            <button
              onClick={() => setViewState('BRANCH_SELECT')}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-5 rounded-2xl shadow-xl text-left active:scale-[0.98] transition-transform group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-active:scale-90 transition-transform">
                  <Wifi className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-black text-white">{t.customer.startShopping}</h2>
                  <p className="text-white/70 text-sm mt-0.5">{t.customer.connectToMallWifi}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-white/50" />
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
                  <h2 className="text-lg font-bold text-white">{t.customer.myOrders}</h2>
                  <p className="text-slate-400 text-sm">{transactionHistory.length} {t.customer.transactions}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-xl text-center">
              <p className="text-3xl font-black text-white">{transactionHistory.length}</p>
              <p className="text-xs text-slate-400 mt-1">{t.customer.orders}</p>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-xl text-center">
              <p className="text-3xl font-black text-emerald-400">
                {(transactionHistory.reduce((s, t) => s + t.total, 0) / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-slate-400 mt-1">{t.customer.spent}</p>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 p-4 rounded-xl text-center">
              <p className="text-3xl font-black text-amber-400">{transactionHistory.length * 15}</p>
              <p className="text-xs text-slate-400 mt-1">{t.customer.minsSaved}</p>
            </div>
          </div>

          {/* User Badge */}
          <div className="mt-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">{t.tiers[userTier?.toLowerCase() as keyof typeof t.tiers] || userTier} {t.customer.member}</p>
              <p className="text-amber-400/70 text-sm">ID: {userId.slice(0, 8)}...</p>
            </div>
          </div>

          {/* Settings Section - Language & Exit */}
          <div className="mt-6 pt-6 border-t border-white/10">
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
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Exit App
                </button>
              )}
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
            ← {t.actions.back}
          </button>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
              <Signal className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">{t.customer.selectYourMall}</h1>
            <p className="text-slate-400 mt-1">{t.customer.connectToStart}</p>
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
                    {t.customer.connecting}
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
  // ONLINE BROWSE VIEW with Preordering
  // ============================================
  const addToPreorder = (product: Product) => {
    setPreorderCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1, addedAt: Date.now() }];
    });
  };
  
  const preorderTotal = preorderCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (viewState === 'ONLINE_BROWSE') {
    // Featured deals for online mode
    const featuredDeals = [
      { id: 'd1', title: '🔥 Flash Sale', discount: '30% OFF', category: 'Snacks', color: 'from-red-500 to-orange-500' },
      { id: 'd2', title: '🥛 Dairy Week', discount: 'Buy 2 Get 1', category: 'Dairy', color: 'from-blue-500 to-cyan-500' },
      { id: 'd3', title: '🍎 Fresh Picks', discount: '20% OFF', category: 'Produce', color: 'from-green-500 to-emerald-500' },
    ];
    
    const storeInfo = {
      hours: '10:00 AM - 10:00 PM',
      rating: 4.5,
      reviews: 2847,
      distance: '2.5 km'
    };

    return (
      <div className="min-h-screen bg-slate-50 safe-area-inset">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 pt-4 pb-6 sticky top-0 z-40">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setViewState('MODE_SELECT')} className="text-white/80 active:text-white flex items-center gap-1">
                <ArrowRight className="w-4 h-4 rotate-180" /> Back
              </button>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Online
                </span>
                {preorderCart.length > 0 && (
                  <button 
                    onClick={() => setShowPreorderModal(true)}
                    className="relative bg-white text-amber-600 p-2 rounded-xl shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {preorderCart.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                  </button>
                )}
              </div>
            </div>
            
            <h1 className="text-white font-black text-2xl mb-1">Browse Products</h1>
            <p className="text-white/70 text-sm">Explore & preorder from home</p>
            
            <div className="relative mt-4">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.customer.searchProducts}
                className="w-full bg-white rounded-xl pl-10 pr-4 py-3 text-sm outline-none shadow-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Featured Deals Carousel */}
        <div className="px-4 py-4 -mt-2">
          <div className="max-w-lg mx-auto">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {featuredDeals.map(deal => (
                <div 
                  key={deal.id}
                  onClick={() => setSelectedCategory(deal.category)}
                  className={`flex-shrink-0 w-40 bg-gradient-to-br ${deal.color} rounded-2xl p-4 cursor-pointer active:scale-95 transition-transform shadow-lg`}
                >
                  <p className="text-white font-black text-lg">{deal.title}</p>
                  <p className="text-white/90 text-sm font-bold mt-1">{deal.discount}</p>
                  <p className="text-white/70 text-xs mt-2">{deal.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Store Info Card - Dynamic based on preorderMall */}
        <div className="px-4 mb-4">
          <div className="max-w-lg mx-auto bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            {preorderMall ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{preorderMall.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {preorderMall.address}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setViewState('CITY_SELECT')}
                  className="text-amber-500 text-xs font-bold"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={() => setViewState('CITY_SELECT')}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-800">Select Pickup Store</h3>
                    <p className="text-slate-500 text-xs">Choose your nearest mall</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            )}
          </div>
        </div>
        
        {/* Categories - Fixed styling with flex-shrink-0 */}
        <div className="bg-white border-y px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="max-w-lg mx-auto flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-amber-500 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 active:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-lg mx-auto p-4 pb-32">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 text-sm">{filteredProducts.length} {t.customer.products}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">🏪 Store Pickup</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 cursor-pointer active:scale-95 transition-transform"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl mb-3 flex items-center justify-center text-5xl relative overflow-hidden">
                  {product.icon || '📦'}
                  {product.rating && (
                    <div className="absolute top-2 right-2 bg-amber-400 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" /> {product.rating}
                    </div>
                  )}
                  {/* Stock indicator */}
                  <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    In Stock
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{product.name}</h3>
                <p className="text-emerald-600 font-black text-lg mt-1">{CURRENCY_SYMBOL}{product.price}</p>
                <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {product.aisle}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); addToPreorder(product); }}
                  className="mt-2 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all"
                >
                  + Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button 
              onClick={() => setViewState('CITY_SELECT')}
              className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-left shadow-lg"
            >
              <MapPin className="w-6 h-6 text-white/80 mb-2" />
              <p className="text-white font-bold text-sm">Select Store</p>
              <p className="text-white/70 text-xs">Choose pickup location</p>
            </button>
            <button 
              onClick={() => setShowPreorderModal(true)}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 text-left shadow-lg"
            >
              <ShoppingBag className="w-6 h-6 text-white/80 mb-2" />
              <p className="text-white font-bold text-sm">My Preorder</p>
              <p className="text-white/70 text-xs">{preorderCart.length} items saved</p>
            </button>
          </div>

          {/* Promo Banner */}
          <div className="mt-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
            <div className="relative">
              <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">Limited Time</p>
              <h3 className="text-white font-black text-xl mt-1">First Order? Get 15% OFF</h3>
              <p className="text-slate-400 text-sm mt-1">Use code: SKIPFIRST</p>
              <button className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                Copy Code
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation for Online Mode */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="max-w-lg mx-auto flex items-center justify-around py-3">
            <button className="flex flex-col items-center text-amber-500">
              <Home className="w-5 h-5" />
              <span className="text-xs font-bold mt-1">Home</span>
            </button>
            <button 
              onClick={() => setSelectedCategory('All')}
              className="flex flex-col items-center text-slate-400"
            >
              <Search className="w-5 h-5" />
              <span className="text-xs mt-1">Browse</span>
            </button>
            <button 
              onClick={() => setShowPreorderModal(true)}
              className="flex flex-col items-center text-slate-400 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs mt-1">Cart</span>
              {preorderCart.length > 0 && (
                <span className="absolute -top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {preorderCart.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setViewState('HISTORY')}
              className="flex flex-col items-center text-slate-400"
            >
              <Receipt className="w-5 h-5" />
              <span className="text-xs mt-1">Orders</span>
            </button>
          </div>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={() => setSelectedProduct(null)}>
            <div 
              className="bg-white w-full max-w-lg rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
              
              <div className="flex gap-4 mb-4">
                <div className="w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-6xl flex-shrink-0">
                  {selectedProduct.icon || '📦'}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-black text-slate-800">{selectedProduct.name}</h2>
                  <p className="text-emerald-600 font-black text-2xl mt-1">{CURRENCY_SYMBOL}{selectedProduct.price}</p>
                  {selectedProduct.rating && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-500" /> {selectedProduct.rating}
                      </div>
                      <span className="text-slate-400 text-xs">{selectedProduct.reviews?.toLocaleString()} reviews</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Located in <strong>{selectedProduct.aisle}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Category: <strong>{selectedProduct.category}</strong></span>
                </div>
              </div>
              
              {selectedProduct.description && (
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <h3 className="font-bold text-slate-700 text-sm mb-2">Product Description</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedProduct.description}</p>
                </div>
              )}
              
              <button
                onClick={() => { addToPreorder(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-amber-600 transition-colors"
              >
                Add to Preorder Cart
              </button>
            </div>
          </div>
        )}

        {/* Preorder Cart Modal with Payment */}
        {showPreorderModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={() => setShowPreorderModal(false)}>
            <div 
              className="bg-white w-full max-w-lg rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
              
              <h2 className="text-xl font-black text-slate-800 mb-4">🛒 Your Preorder Cart</h2>
              
              {preorderCart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Your preorder cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                    {preorderCart.map(item => (
                      <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                        <span className="text-3xl">{item.icon || '📦'}</span>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                          <p className="text-amber-600 font-bold">{CURRENCY_SYMBOL}{item.price} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreorderCart(prev => prev.map(p => 
                              p.id === item.id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
                            ))}
                            className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => setPreorderCart(prev => prev.map(p => 
                              p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
                            ))}
                            className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setPreorderCart(prev => prev.filter(p => p.id !== item.id))}
                            className="text-red-500 p-1 ml-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pickup Store Info */}
                  {preorderMall ? (
                    <div className="bg-emerald-50 rounded-xl p-3 mb-4 flex items-center gap-3">
                      <Store className="w-5 h-5 text-emerald-600" />
                      <div className="flex-1">
                        <p className="text-emerald-800 font-bold text-sm">Pickup at: {preorderMall.name}</p>
                        <p className="text-emerald-600 text-xs">{preorderMall.address}</p>
                      </div>
                      <button onClick={() => setViewState('CITY_SELECT')} className="text-emerald-700 text-xs underline">Change</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setShowPreorderModal(false); setViewState('CITY_SELECT'); }}
                      className="w-full bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-4 mb-4 text-center"
                    >
                      <MapPin className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                      <p className="text-amber-700 font-bold text-sm">Select Pickup Store First</p>
                      <p className="text-amber-600 text-xs">Tap to choose your mall</p>
                    </button>
                  )}
                  
                  {/* Price Breakdown */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Subtotal ({preorderCart.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                      <span className="font-bold">{CURRENCY_SYMBOL}{preorderTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">GST (18%)</span>
                      <span className="font-bold">{CURRENCY_SYMBOL}{(preorderTotal * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex items-center justify-between">
                      <span className="text-slate-700 font-bold">Total</span>
                      <span className="text-2xl font-black text-emerald-600">{CURRENCY_SYMBOL}{(preorderTotal * 1.18).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Proceed to Payment Button */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (!preorderMall) {
                          setShowPreorderModal(false);
                          setViewState('CITY_SELECT');
                          return;
                        }
                        setShowPreorderModal(false);
                        setViewState('PREORDER_PAYMENT');
                      }}
                      disabled={!preorderMall}
                      className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
                        preorderMall 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      Proceed to Payment
                    </button>
                    
                    <button
                      onClick={() => setShowPreorderModal(false)}
                      className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold transition-colors hover:bg-slate-200"
                    >
                      Continue Shopping
                    </button>
                  </div>
                  
                  {/* Info */}
                  <div className="mt-4 bg-purple-50 rounded-xl p-3">
                    <p className="text-purple-800 text-xs flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Store Pickup:</strong> Pay now, we'll collect your items. Visit the store & show your QR code to pick up!</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        <AIChatbot mode="CUSTOMER" isOnline={true} cartItems={preorderCart} cartTotal={preorderTotal} />
      </div>
    );
  }

  // ============================================
  // CITY SELECTION VIEW for Preorder
  // ============================================
  if (viewState === 'CITY_SELECT') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 safe-area-inset">
        <div className="bg-slate-800/50 border-b border-slate-700 px-4 py-4 sticky top-0 z-40 backdrop-blur-lg">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <button onClick={() => setViewState('ONLINE_BROWSE')} className="text-slate-400 active:text-white flex items-center gap-1">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back
            </button>
            <h1 className="text-lg font-bold text-white">Select City</h1>
            <div className="w-16" />
          </div>
        </div>
        
        <div className="max-w-lg mx-auto p-4">
          {/* Pending Pickups Banner - Show if customer has pending preorders */}
          {(() => {
            const pendingPickups = transactionHistory.filter(tx => 
              tx.isPreorder && tx.status !== 'PREORDER_COLLECTED'
            );
            if (pendingPickups.length === 0) return null;
            return (
              <button
                onClick={() => { setHistoryTab('ONLINE'); setViewState('HISTORY'); }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-2xl shadow-xl mb-6 text-left active:scale-[0.98] transition-transform relative overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-white">Pending Pickups</h2>
                      <span className="bg-white text-amber-600 text-xs font-black px-2 py-0.5 rounded-full">
                        {pendingPickups.length}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">View your QR codes for collection</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/70" />
                </div>
              </button>
            );
          })()}
          
          {/* Header */}
          <div className="text-center mb-8 mt-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">Find Nearby Stores</h2>
            <p className="text-slate-400 mt-2">Select your city to see available malls</p>
          </div>
          
          {/* City Grid */}
          <div className="grid grid-cols-2 gap-3">
            {CITIES.map(city => (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedCity(city.id);
                  setViewState('PREORDER_MALL_SELECT');
                }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 text-left active:scale-95 transition-transform hover:bg-white/10"
              >
                <span className="text-3xl mb-2 block">{city.icon}</span>
                <h3 className="text-white font-bold">{city.name}</h3>
                <p className="text-slate-400 text-sm">{city.state}</p>
              </button>
            ))}
          </div>
          
          {/* Use Location Button */}
          <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
            <Signal className="w-5 h-5" />
            Use My Location
          </button>
          
          <p className="text-slate-500 text-xs text-center mt-4">
            Your items will be collected by the store. Visit to pick them up!
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // MALL SELECTION VIEW for Preorder
  // ============================================
  if (viewState === 'PREORDER_MALL_SELECT') {
    const cityMalls = MALL_BRANCHES.filter(m => m.city === selectedCity);
    const cityInfo = CITIES.find(c => c.id === selectedCity);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 safe-area-inset">
        <div className="bg-slate-800/50 border-b border-slate-700 px-4 py-4 sticky top-0 z-40 backdrop-blur-lg">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <button onClick={() => setViewState('CITY_SELECT')} className="text-slate-400 active:text-white flex items-center gap-1">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back
            </button>
            <h1 className="text-lg font-bold text-white">
              {cityInfo?.icon} {cityInfo?.name || 'Malls'}
            </h1>
            <div className="w-16" />
          </div>
        </div>
        
        <div className="max-w-lg mx-auto p-4">
          <h2 className="text-xl font-black text-white mb-4">Select Pickup Store</h2>
          
          <div className="space-y-3">
            {cityMalls.map(mall => (
              <button
                key={mall.id}
                onClick={() => {
                  setPreorderMall(mall);
                  setViewState('ONLINE_BROWSE');
                }}
                className="w-full bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 text-left active:scale-[0.98] transition-transform hover:bg-white/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Store className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{mall.name}</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {mall.address}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" /> {mall.rating}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {mall.timing}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              </button>
            ))}
          </div>
          
          {cityMalls.length === 0 && (
            <div className="text-center py-12">
              <Store className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-white font-bold">No Stores Yet</h3>
              <p className="text-slate-400 text-sm mt-1">We're coming to your city soon!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // PREORDER PAYMENT VIEW
  // ============================================
  if (viewState === 'PREORDER_PAYMENT') {
    const preorderTax = preorderTotal * 0.18;
    const preorderGrandTotal = preorderTotal + preorderTax;
    
    return (
      <div className="min-h-screen bg-slate-50 safe-area-inset">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => setViewState('ONLINE_BROWSE')} className="text-slate-500 active:text-slate-700 flex items-center gap-1">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back
            </button>
            <h1 className="text-lg font-bold text-slate-800">Payment</h1>
            <div className="w-16" />
          </div>
        </div>
        
        <div className="max-w-lg mx-auto p-4 pb-32">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
            <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              Order Summary
            </h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {preorderCart.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.icon} {item.name} × {item.quantity}</span>
                  <span className="font-bold">{CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>{CURRENCY_SYMBOL}{preorderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">GST (18%)</span>
                <span>{CURRENCY_SYMBOL}{preorderTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-emerald-600">{CURRENCY_SYMBOL}{preorderGrandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Pickup Store */}
          <div className="bg-purple-50 rounded-2xl p-4 mb-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-purple-900 font-bold">{preorderMall?.name}</p>
                <p className="text-purple-700 text-sm">{preorderMall?.address}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-purple-700 text-xs">
              <Clock className="w-4 h-4" />
              <span>Items will be ready for pickup in 30-45 minutes</span>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
            <h3 className="font-bold text-slate-800 mb-3">Select Payment Method</h3>
            <div className="space-y-2">
              {[
                { id: 'GOOGLE_PAY', name: 'Google Pay', icon: '💳', desc: 'Pay with Google Pay' },
                { id: 'UPI', name: 'UPI', icon: '📱', desc: 'PhonePe, Paytm, BHIM' },
                { id: 'CARD', name: 'Debit/Credit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id as PaymentMethod)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    selectedPayment === method.id 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-200 active:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">{method.name}</p>
                    <p className="text-slate-500 text-xs">{method.desc}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Fixed Bottom Pay Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-2xl">
          <div className="max-w-lg mx-auto">
            <button
              onClick={async () => {
                setIsProcessing(true);
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const pickupCode = `PU-${Date.now().toString(36).toUpperCase()}`;
                const txId = generateTransactionId();
                const txTimestamp = Date.now();
                
                // Deep clone items to ensure all properties are preserved
                const clonedItems = preorderCart.map(item => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  category: item.category,
                  image: item.image,
                  icon: item.icon || '📦',
                  aisle: item.aisle,
                  quantity: item.quantity,
                  addedAt: item.addedAt
                }));
                
                console.log('📦 Preorder items to save:', clonedItems.length, clonedItems.map(i => i.name));
                
                // Create and save preorder transaction immediately
                const preorderTx: Transaction = {
                  id: txId,
                  userId,
                  userTier: userTier as any,
                  items: clonedItems,
                  subtotal: preorderGrandTotal / 1.18,
                  tax: preorderGrandTotal * 0.18 / 1.18,
                  total: preorderGrandTotal,
                  timestamp: txTimestamp,
                  theftScore: 0,
                  theftAnalysis: { score: 0, riskLevel: 'Low', reasoning: 'Preorder', flags: [], recommendation: 'INSTANT_RELEASE' },
                  status: 'PREORDER_PENDING',
                  paymentMethod: selectedPayment,
                  behaviorLogs: [],
                  sessionDuration: 0,
                  syncedToCloud: true,
                  isPreorder: true,
                  preorderPickupCode: pickupCode,
                  preorderMall: preorderMall?.name,
                  preorderMallAddress: preorderMall?.address,
                  orderType: 'ONLINE',
                  branch: preorderMall?.name
                };
                
                // Save to transaction store immediately (local)
                saveTransaction(preorderTx);
                
                // Save to Firebase for cross-device sync
                try {
                  await saveTransactionToFirebase(preorderTx);
                  console.log('✅ Preorder saved to Firebase:', txId, 'Pickup Code:', pickupCode);
                } catch (error) {
                  console.error('❌ Firebase save error:', error);
                }
                
                // Verify save worked
                const verifyTx = getTransactionById(txId);
                console.log('📦 Local verification:', verifyTx ? 'Transaction found in storage' : '❌ NOT FOUND IN STORAGE');
                
                setPreorderTransaction({
                  id: txId,
                  items: clonedItems,
                  total: preorderGrandTotal,
                  mall: preorderMall?.name || '',
                  timestamp: txTimestamp,
                  pickupCode
                });
                
                setIsProcessing(false);
                setViewState('PREORDER_QR');
              }}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay {CURRENCY_SYMBOL}{preorderGrandTotal.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // PREORDER CONFIRMATION VIEW - Pickup Code Only
  // ============================================
  if (viewState === 'PREORDER_QR') {
    // Show PICKUP SUCCESS screen when staff verifies
    if (pickupConfirmed) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 safe-area-inset flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            {/* Success Animation */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
              <div className="absolute inset-2 bg-white/50 rounded-full animate-pulse" />
              <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <PartyPopper className="w-16 h-16 text-emerald-500" />
              </div>
            </div>
            
            {/* Main Message */}
            <h1 className="text-4xl font-black text-white mb-3">
              🎉 Pickup Done!
            </h1>
            <p className="text-white/90 text-lg mb-2">
              Your products have been collected successfully
            </p>
            <p className="text-white/70 text-sm mb-8">
              Thank you for shopping with Skipline Go!
            </p>
            
            {/* Verification Badge */}
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-6 border-2 border-white/40">
              <div className="flex items-center justify-center gap-2 text-white mb-2">
                <ShieldCheck className="w-6 h-6" />
                <span className="font-black text-lg">VERIFICATION COMPLETE</span>
              </div>
              <p className="text-white/80 text-sm">
                QR code regeneration is now disabled
              </p>
            </div>
            
            {/* Order Details Card */}
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-white">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-bold">{preorderTransaction?.items.length} items</span>
                <span>•</span>
                <span className="font-bold">{CURRENCY_SYMBOL}{preorderTransaction?.total.toFixed(0)}</span>
              </div>
              <p className="text-white/70 text-xs mt-2">
                Code: {preorderTransaction?.pickupCode}
              </p>
            </div>
            
            {/* Countdown */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <p className="text-slate-600 text-sm mb-2">Redirecting to shopping in</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-black text-white">{pickupCountdown}</span>
                </div>
                <span className="text-slate-400 text-xl">seconds</span>
              </div>
              
              {/* Skip Button */}
              <button
                onClick={() => {
                  setPickupConfirmed(false);
                  setPickupCountdown(5);
                  setPreorderCart([]);
                  setPreorderTransaction(null);
                  setViewState('MODE_SELECT');
                }}
                className="mt-4 text-emerald-600 font-bold text-sm hover:underline"
              >
                Skip &amp; Continue Shopping Now →
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 safe-area-inset pb-24">
        <div className="max-w-lg mx-auto p-4 pt-6">
          {/* Success Animation Header */}
          <div className="text-center mb-6">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white">Order Confirmed!</h1>
            <p className="text-white/80 text-sm mt-1">Show this code at pickup counter</p>
          </div>
          
          {/* Waiting for Pickup Status */}
          <div className="bg-amber-400/90 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-amber-900 font-bold text-sm">Waiting for Pickup</p>
              <p className="text-amber-800 text-xs">QR valid for 5 mins - regenerate if expired</p>
            </div>
          </div>
          
          {/* PREORDER QR CODE - Main Focus with Timer */}
          <div className="bg-white rounded-3xl p-6 shadow-2xl mb-4">
            {preorderTransaction && (
              <PreorderQRCode 
                transaction={{
                  ...preorderTransaction,
                  preorderPickupCode: preorderTransaction.pickupCode,
                  preorderMall: preorderTransaction.mall
                }} 
                size={180}
                isVerified={false}
              />
            )}
            
            {/* Copy Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  const code = preorderTransaction?.pickupCode || '';
                  navigator.clipboard.writeText(code).then(() => {
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  }).catch(() => {
                    const textArea = document.createElement('textarea');
                    textArea.value = code;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  });
                }}
                className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  copySuccess 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 active:scale-95'
                }`}
              >
                {copySuccess ? (
                  <><CheckCircle className="w-5 h-5" /> Copied!</>
                ) : (
                  <><Copy className="w-5 h-5" /> Copy Code</>
                )}
              </button>
            </div>
            
            {/* Order Summary */}
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID</span>
                <span className="font-mono font-bold text-slate-700">{preorderTransaction?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup Location</span>
                <span className="font-bold text-slate-700">{preorderTransaction?.mall}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid</span>
                <span className="font-bold text-emerald-600">{CURRENCY_SYMBOL}{preorderTransaction?.total.toFixed(0)}</span>
              </div>
            </div>
          </div>
          
          {/* Important Notice Banner */}
          <div className="bg-purple-500/90 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Show QR or tell code!</p>
              <p className="text-white/80 text-xs mt-1">Staff can scan your QR code or you can tell them your pickup code.</p>
            </div>
          </div>
          
          {/* Items List */}
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-500" />
              Your Items ({preorderTransaction?.items.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {preorderTransaction?.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl border">
                    {item.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                    <p className="text-slate-500 text-xs">×{item.quantity} • ₹{item.price}</p>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">₹{(item.price * item.quantity).toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Collection Steps */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
            <h3 className="text-white font-bold text-sm mb-3">How to Collect</h3>
            <div className="space-y-2">
              {[
                { step: 1, text: `Visit ${preorderTransaction?.mall}` },
                { step: 2, text: 'Go to Skipline Go counter' },
                { step: 3, text: 'Tell staff your pickup code' },
                { step: 4, text: 'Collect your items' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold">{step}</span>
                  <span className="text-white/90 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setPreorderCart([]);
                setPreorderTransaction(null);
                setViewState('MODE_SELECT');
              }}
              className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              Done - Back to Home
            </button>
            <button
              onClick={() => setViewState('HISTORY')}
              className="w-full bg-white/20 text-white py-3 rounded-xl font-bold active:bg-white/30 transition-colors"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // HISTORY VIEW with Separate Online/Offline Tabs
  // ============================================
  if (viewState === 'HISTORY') {
    // Force reload from storage to get latest data
    const latestHistory = getAllTransactions().filter(t => t.userId === userId);
    const onlineOrders = latestHistory.filter(tx => tx.isPreorder === true || tx.orderType === 'ONLINE');
    const offlineOrders = latestHistory.filter(tx => tx.isPreorder !== true && tx.orderType !== 'ONLINE');
    const displayOrders = historyTab === 'ONLINE' ? onlineOrders : offlineOrders;
    
    return (
      <div className="min-h-screen bg-slate-900 safe-area-inset">
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <button onClick={() => setViewState('MODE_SELECT')} className="text-slate-400 active:text-white">
              ← {t.actions.back}
            </button>
            <h1 className="text-lg font-bold text-white">{t.customer.myOrders}</h1>
            <div className="w-12" />
          </div>
        </div>

        <div className="max-w-lg mx-auto p-4 pb-24">
          {/* Stats Card */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">{t.customer.totalTimeSaved}</p>
                <p className="text-4xl font-black text-white">{transactionHistory.length * 15} {t.time.min}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-white/60 text-xs mt-3">
              {transactionHistory.length} {t.customer.ordersCount} • ₹{transactionHistory.reduce((s, t) => s + t.total, 0).toFixed(0)} {t.customer.totalSpent}
            </p>
          </div>
          
          {/* Tabs for Online/Offline */}
          <div className="bg-slate-800 rounded-xl p-1 flex gap-1 mb-4">
            <button
              onClick={() => setHistoryTab('OFFLINE')}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                historyTab === 'OFFLINE' 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-slate-400'
              }`}
            >
              <Store className="w-4 h-4" />
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
              <Globe className="w-4 h-4" />
              Preorders ({onlineOrders.length})
            </button>
          </div>

          {displayOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                {historyTab === 'ONLINE' ? (
                  <Globe className="w-10 h-10 text-slate-600" />
                ) : (
                  <Receipt className="w-10 h-10 text-slate-600" />
                )}
              </div>
              <h3 className="text-white font-bold text-lg">
                {historyTab === 'ONLINE' ? 'No preorders yet' : t.customer.noOrdersYet}
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                {historyTab === 'ONLINE' 
                  ? 'Your preorder pickups will appear here' 
                  : t.customer.startShoppingHistory}
              </p>
              <button
                onClick={() => setViewState(historyTab === 'ONLINE' ? 'CITY_SELECT' : 'BRANCH_SELECT')}
                className={`mt-6 px-6 py-3 rounded-xl font-bold ${
                  historyTab === 'ONLINE' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-amber-500 text-white'
                }`}
              >
                {historyTab === 'ONLINE' ? 'Start Preorder' : t.customer.startShopping}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {displayOrders.map(tx => (
                <div key={tx.id} className={`rounded-xl p-4 border ${
                  tx.isPreorder 
                    ? 'bg-purple-900/20 border-purple-500/30' 
                    : 'bg-slate-800 border-slate-700'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">{tx.id}</span>
                      {tx.isPreorder && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                          Pickup
                        </span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      tx.status === 'VERIFIED' || tx.status === 'PREORDER_COLLECTED' ? 'bg-emerald-500/20 text-emerald-400' :
                      tx.status === 'PAID' || tx.status === 'PREORDER_PENDING' ? 'bg-blue-500/20 text-blue-400' :
                      tx.status === 'PREORDER_READY' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {tx.status === 'PREORDER_PENDING' ? 'Awaiting Pickup' :
                       tx.status === 'PREORDER_READY' ? 'Ready for Pickup' :
                       tx.status === 'PREORDER_COLLECTED' ? 'Collected' :
                       t.status[tx.status.toLowerCase() as keyof typeof t.status] || tx.status}
                    </span>
                  </div>
                  
                  {/* Preorder: Show pickup info */}
                  {tx.isPreorder && tx.preorderPickupCode && (
                    <div className="bg-purple-500/10 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 text-xs">Pickup Code</span>
                        <span className="text-white font-mono font-bold">{tx.preorderPickupCode}</span>
                      </div>
                      {tx.preorderMall && (
                        <div className="flex items-center gap-1 mt-1 text-slate-400 text-xs">
                          <MapPin className="w-3 h-3" />
                          {tx.preorderMall}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Items preview */}
                  {tx.items && tx.items.length > 0 && (
                    <div className="flex gap-1 mb-3 overflow-x-auto">
                      {tx.items.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                          {item.icon || '📦'}
                        </div>
                      ))}
                      {tx.items.length > 5 && (
                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-xs text-slate-400 flex-shrink-0">
                          +{tx.items.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-white">{tx.items?.length || 0} {t.customer.items}</p>
                      <p className="text-slate-500 text-sm">
                        {new Date(tx.timestamp).toLocaleDateString(localeMap[language] || 'en-IN', { 
                          day: 'numeric', month: 'short', year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <p className="text-2xl font-black text-white">₹{tx.total.toFixed(0)}</p>
                  </div>
                  
                  <button
                    onClick={() => downloadInvoice(tx, (tx as any).branch || selectedBranch.name, t.pdf, localeMap[language] || 'en-IN')}
                    className="w-full mt-2 bg-slate-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-slate-600"
                  >
                    <Download className="w-4 h-4" />
                    {t.customer.downloadInvoice}
                  </button>
                  
                  {/* View QR Code button for pending preorders */}
                  {tx.isPreorder && tx.status !== 'PREORDER_COLLECTED' && (
                    <button
                      onClick={() => {
                        setViewingPreorder(tx);
                        setViewState('VIEW_PREORDER_QR');
                      }}
                      className="w-full mt-2 bg-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-purple-700"
                    >
                      📱 View QR Code
                    </button>
                  )}
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
  // VIEW SAVED PREORDER QR CODE
  // ============================================
  if (viewState === 'VIEW_PREORDER_QR' && viewingPreorder) {
    const isCollected = viewingPreorder.status === 'PREORDER_COLLECTED';
    
    return (
      <div className={`min-h-screen safe-area-inset pb-24 ${
        isCollected 
          ? 'bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600' 
          : 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600'
      }`}>
        <div className="max-w-lg mx-auto p-4 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setViewingPreorder(null);
                setViewState('HISTORY');
              }}
              className="text-white/80 active:text-white flex items-center gap-1"
            >
              ← Back
            </button>
            <h1 className="text-lg font-bold text-white">
              {isCollected ? 'Pickup Complete' : 'Pickup QR Code'}
            </h1>
            <div className="w-12" />
          </div>
          
          {/* VERIFIED - Pickup Done Message */}
          {isCollected && (
            <div className="text-center mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
                <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <ShieldCheck className="w-12 h-12 text-emerald-500" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">🎉 Items Verified!</h2>
              <p className="text-white/80">Your items have been picked up successfully</p>
              
              {/* Verification Badge */}
              <div className="mt-4 bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30">
                <p className="text-white font-bold text-lg">✅ Pickup Complete</p>
                <p className="text-white/70 text-sm mt-1">All items have been collected</p>
                <p className="text-white/50 text-xs mt-2">Code: {viewingPreorder.preorderPickupCode}</p>
              </div>
            </div>
          )}
          
          {/* Order Info */}
          <div className="text-center mb-4">
            <p className="text-white/70 text-sm">Order #{viewingPreorder.id}</p>
            <p className="text-white/50 text-xs mt-1">
              {new Date(viewingPreorder.timestamp).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          
          {/* Status Badge - Only show if not collected */}
          {!isCollected && (
            <div className="mx-auto w-fit mb-4 px-4 py-2 rounded-full font-bold text-sm bg-amber-500/20 text-amber-300">
              ⏳ Awaiting Pickup - QR valid for 5 mins
            </div>
          )}
          
          {/* QR Code Card - HIDE when verified, only show when pending */}
          {!isCollected && (
            <div className="bg-white rounded-3xl p-6 shadow-2xl mb-4">
              <PreorderQRCode 
                transaction={{
                  ...viewingPreorder,
                  preorderPickupCode: viewingPreorder.preorderPickupCode || '',
                  preorderMall: viewingPreorder.preorderMall || viewingPreorder.branch || ''
                } as Transaction} 
                size={200}
                showAnimation={false}
                isVerified={false}
              />
            </div>
          )}
          
          {/* Pickup Location */}
          {viewingPreorder.preorderMall && (
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Pickup Location</p>
                <p className="text-white/70 text-xs">{viewingPreorder.preorderMall}</p>
              </div>
            </div>
          )}
          
          {/* Items Summary */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-bold text-sm">Order Items</p>
              <p className="text-purple-300 font-bold">₹{viewingPreorder.total.toFixed(0)}</p>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {viewingPreorder.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-white/80 text-sm">
                  <span>{item.icon || '📦'}</span>
                  <span className="flex-1 truncate">{item.name}</span>
                  <span className="text-white/50">×{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                const code = viewingPreorder.preorderPickupCode || '';
                navigator.clipboard.writeText(code).then(() => {
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                });
              }}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                copySuccess 
                  ? 'bg-emerald-500 text-white' 
                  : isCollected ? 'bg-white/20 text-white/70' : 'bg-white text-purple-600'
              }`}
              disabled={isCollected}
            >
              {copySuccess ? (
                <><CheckCircle className="w-5 h-5" /> Code Copied!</>
              ) : isCollected ? (
                <>Pickup Code: {viewingPreorder.preorderPickupCode}</>
              ) : (
                <><Copy className="w-5 h-5" /> Copy Pickup Code</>
              )}
            </button>
            
            {isCollected ? (
              <button
                onClick={() => {
                  setViewingPreorder(null);
                  setViewState('MODE_SELECT');
                }}
                className="w-full bg-white text-emerald-600 py-4 rounded-xl font-bold"
              >
                🛒 Continue Shopping
              </button>
            ) : (
              <button
                onClick={() => {
                  setViewingPreorder(null);
                  setViewState('HISTORY');
                }}
                className="w-full bg-white/10 text-white py-4 rounded-xl font-bold"
              >
                Back to Orders
              </button>
            )}
          </div>
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
        {/* QR Verification Success Notification */}
        {qrVerifiedNotification.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`mx-4 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center transform animate-in zoom-in-95 duration-500 ${
              qrVerifiedNotification.type === 'success' 
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                : 'bg-gradient-to-br from-amber-500 to-orange-500'
            }`}>
              {/* Success Animation */}
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className={`absolute inset-0 rounded-full animate-ping opacity-40 ${
                  qrVerifiedNotification.type === 'success' ? 'bg-white' : 'bg-white'
                }`} />
                <div className={`absolute inset-2 rounded-full animate-pulse ${
                  qrVerifiedNotification.type === 'success' ? 'bg-white/30' : 'bg-white/30'
                }`} />
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                  {qrVerifiedNotification.type === 'success' ? (
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-10 h-10 text-amber-500" />
                  )}
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-white mb-2">
                {qrVerifiedNotification.type === 'success' ? '🎉 QR Verified!' : '⚠️ Audit Required'}
              </h2>
              <p className="text-white/90 text-sm mb-4">
                {qrVerifiedNotification.message}
              </p>
              
              {qrVerifiedNotification.type === 'success' && (
                <div className="bg-white/20 rounded-xl p-3 mb-4">
                  <p className="text-white/80 text-xs">Your exit gate has been released.</p>
                  <p className="text-white font-bold text-sm mt-1">Thank you for shopping! 🙏</p>
                  <p className="text-white/70 text-xs mt-2">Redirecting to shop in 4 seconds...</p>
                </div>
              )}
              
              <button
                onClick={() => {
                  setQrVerifiedNotification({ show: false, message: '', type: 'success' });
                  if (qrVerifiedNotification.type === 'success') {
                    setCompletedTransaction(null);
                    setCart([]);
                    setViewState('SHOPPING');
                  }
                }}
                className="bg-white text-slate-800 px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                {qrVerifiedNotification.type === 'success' ? 'Continue Shopping' : 'Understood'}
              </button>
            </div>
          </div>
        )}
        
        <div className="max-w-md mx-auto pt-6 pb-20">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-emerald-500/40">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white">{t.exitQR.paymentDone}</h1>
            <p className="text-emerald-300 mt-2">{t.exitQR.showQRAtExit}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-2xl">
            <ExitQRCode 
              transaction={completedTransaction}
              onExpired={() => console.log('QR expired')}
              onVerified={(type, message) => {
                setQrVerifiedNotification({ show: true, message, type });
              }}
            />
          </div>
          
          <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-emerald-300/70">{t.exitQR.invoice}</p>
                <p className="text-white font-mono font-bold">{completedTransaction.id}</p>
              </div>
              <div>
                <p className="text-emerald-300/70">{t.customer.items}</p>
                <p className="text-white font-bold">{completedTransaction.items.length}</p>
              </div>
              <div>
                <p className="text-emerald-300/70">{t.exitQR.store}</p>
                <p className="text-white font-bold">{selectedBranch.name}</p>
              </div>
              <div>
                <p className="text-emerald-300/70">{t.shopping.total}</p>
                <p className="text-emerald-400 font-black text-xl">{CURRENCY_SYMBOL}{completedTransaction.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={() => downloadInvoice(completedTransaction, selectedBranch.name, t.pdf, localeMap[language] || 'en-IN')}
              className="w-full bg-white text-emerald-700 py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-emerald-50"
            >
              <Download className="w-5 h-5" />
              {t.customer.downloadInvoice}
            </button>
            
            <button
              onClick={resetSession}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-emerald-700"
            >
              <ShoppingCart className="w-5 h-5" />
              {t.exitQR.continueShoppingBtn}
            </button>
            
            <button
              onClick={() => setViewState('MODE_SELECT')}
              className="w-full bg-white/10 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-white/20"
            >
              <Home className="w-5 h-5" />
              {t.exitQR.backToHome}
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
            <h1 className="text-xl font-bold">{t.shopping.checkout}</h1>
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
                <span className="text-slate-500">{t.shopping.subtotal}</span>
                <span>{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.shopping.gst}</span>
                <span>{CURRENCY_SYMBOL}{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t mt-3">
                <span>{t.shopping.total}</span>
                <span className="text-emerald-600">{CURRENCY_SYMBOL}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold text-slate-700 mb-3">{t.shopping.payWith}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'GOOGLE_PAY' as PaymentMethod, name: t.shopping.googlePay, icon: '📱' },
                { id: 'UPI' as PaymentMethod, name: t.shopping.upi, icon: '🔗' },
                { id: 'CARD' as PaymentMethod, name: t.shopping.card, icon: '💳' },
                { id: 'CASH' as PaymentMethod, name: t.shopping.cash, icon: '💵' },
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
                  {t.shopping.processing}
                </>
              ) : (
                <>
                  {t.shopping.pay} {CURRENCY_SYMBOL}{total.toFixed(0)}
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
  // MAIN SHOPPING VIEW (OFFLINE MODE)
  // ============================================
  // This is the default view for in-store shopping
  // Explicitly check for SHOPPING state or treat as default
  if (viewState === 'SHOPPING' || viewState === 'PAYMENT') {
    return (
      <div className="min-h-screen bg-slate-100 safe-area-inset">
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button onClick={() => setViewState('MODE_SELECT')} className="text-slate-500 text-sm">
                ← {t.actions.home}
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
            title={t.shopping.scanProduct}
            onScan={handleScan}
            isQR={false}
          />
        
        {lastScannedProduct && (
          <div className="bg-emerald-500 text-white p-4 rounded-xl flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl">
              {lastScannedProduct.icon || '✓'}
            </div>
            <div className="flex-1">
              <p className="font-bold">{t.shopping.added}</p>
              <p className="text-sm text-emerald-100">{lastScannedProduct.name}</p>
            </div>
            <p className="font-bold">{CURRENCY_SYMBOL}{lastScannedProduct.price}</p>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-600" />
              <h2 className="font-bold text-slate-800">{t.shopping.cart}</h2>
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
              <p className="text-slate-500 font-medium">{t.shopping.emptyCart}</p>
              <p className="text-sm text-slate-400">{t.shopping.scanItemsToAdd}</p>
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
            <span className="text-slate-600">{t.shopping.totalInclGST}</span>
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
              {t.shopping.checkout} • {CURRENCY_SYMBOL}{total.toFixed(0)}
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
  }

  // Fallback for unknown viewState - should never happen
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-white text-lg font-bold">Loading...</p>
        <p className="text-slate-400 text-sm mt-2">View: {viewState}</p>
        <button 
          onClick={() => setViewState('MODE_SELECT')}
          className="mt-4 bg-amber-500 text-white px-4 py-2 rounded-lg"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};
