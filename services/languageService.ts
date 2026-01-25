/**
 * Language Service - Skipline Go
 * Multi-language support: English, Marathi, Hindi
 */

export type Language = 'en' | 'mr' | 'hi';

export interface Translations {
  // Common
  app: {
    name: string;
    tagline: string;
    smartMallCheckout: string;
    version: string;
    myTechTeam: string;
  };
  
  // Landing & Auth
  landing: {
    welcomeTo: string;
    quickAccess: string;
    continueAsGuest: string;
    noSignUpNeeded: string;
    startShoppingInstantly: string;
    withAccount: string;
    continueWithGoogle: string;
    syncAcrossDevices: string;
    howToUse: string;
    orSignInToSaveHistory: string;
    signOut: string;
  };
  
  // Mode Selection
  modeSelect: {
    customerMode: string;
    customerModeDesc: string;
    staffMode: string;
    staffModeDesc: string;
    exit: string;
    firstTimeLearn: string;
  };
  
  // User Guide
  guide: {
    howToUseApp: string;
    step: string;
    of: string;
    nextStep: string;
    back: string;
    imReady: string;
    skipGuide: string;
    steps: {
      openApp: { title: string; instruction: string; tip: string };
      connectWifi: { title: string; instruction: string; tip: string };
      scanProducts: { title: string; instruction: string; tip: string };
      payInApp: { title: string; instruction: string; tip: string };
      getExitQR: { title: string; instruction: string; tip: string };
      showQRAtExit: { title: string; instruction: string; tip: string };
    };
  };
  
  // Customer View
  customer: {
    startShopping: string;
    connectToMallWifi: string;
    browseProducts: string;
    viewItemsFromHome: string;
    myOrders: string;
    transactions: string;
    orders: string;
    spent: string;
    minsSaved: string;
    member: string;
    selectYourMall: string;
    connectToStart: string;
    connecting: string;
    searchProducts: string;
    products: string;
    readyToShop: string;
    visitMallToScan: string;
    findNearestMall: string;
    totalTimeSaved: string;
    totalSpent: string;
    noOrdersYet: string;
    startShoppingToSee: string;
    startShoppingHistory: string;
    downloadInvoice: string;
    items: string;
    ordersCount: string;
    browseMode: string;
  };
  
  // Shopping
  shopping: {
    scanProduct: string;
    added: string;
    cart: string;
    emptyCart: string;
    scanItemsToAdd: string;
    total: string;
    totalInclGST: string;
    checkout: string;
    payWith: string;
    googlePay: string;
    upi: string;
    card: string;
    cash: string;
    processing: string;
    pay: string;
    subtotal: string;
    gst: string;
  };
  
  // Exit QR
  exitQR: {
    paymentDone: string;
    showQRAtExit: string;
    securedExitPass: string;
    invoice: string;
    store: string;
    qrExpired: string;
    regenerate: string;
    quickCheckRequired: string;
    readyForExit: string;
    aiScore: string;
    showQRInstructions: string;
    expiresIn: string;
    continueShoppingBtn: string;
    backToHome: string;
    copyTokenForTesting: string;
  };
  
  // Staff View
  staff: {
    exitGate: string;
    staffTerminal: string;
    dashboard: string;
    scanCustomerExitQR: string;
    today: string;
    flagged: string;
    cleared: string;
    pendingVerification: string;
    verifying: string;
    decryptingJWT: string;
    qrExpired: string;
    customerMustRegenerate: string;
    verificationFailed: string;
    scanAgain: string;
    backToScanner: string;
    transaction: string;
    needsCheck: string;
    risk: string;
    aiAnalysis: string;
    cartContents: string;
    release: string;
    releaseGate: string;
    fullAudit: string;
    
    // Dashboard
    totalTransactions: string;
    revenue: string;
    verified: string;
    theftRiskAnalytics: string;
    avgRiskScore: string;
    lowRisk: string;
    medium: string;
    highRisk: string;
    recentTransactions: string;
    noTransactionsYet: string;
    
    // Customer Details (Enhanced)
    customerDetails: string;
    customerId: string;
    customerTier: string;
    sessionDuration: string;
    paymentMethod: string;
    branch: string;
    shopDate: string;
    shopTime: string;
    itemsPurchased: string;
    totalAmount: string;
    taxPaid: string;
    behaviorAnalysis: string;
    riskAssessment: string;
    verificationStatus: string;
    qrExpiredNotice: string;
    gateReleased: string;
    customerFlagged: string;
  };
  
  // Common Actions
  actions: {
    back: string;
    cancel: string;
    confirm: string;
    continue: string;
    close: string;
    retry: string;
    save: string;
    delete: string;
    home: string;
  };
  
  // Tier Labels
  tiers: {
    new: string;
    trusted: string;
    vip: string;
    flagged: string;
  };
  
  // Status Labels
  status: {
    pending: string;
    paid: string;
    verified: string;
    flagged: string;
    audited: string;
    expired: string;
  };
  
  // Time
  time: {
    minutes: string;
    seconds: string;
    min: string;
    sec: string;
  };
  
  // Language selector
  language: {
    selectLanguage: string;
    english: string;
    marathi: string;
    hindi: string;
  };
  
  // PDF Invoice
  pdf: {
    taxInvoice: string;
    paid: string;
    invoiceNo: string;
    date: string;
    store: string;
    payment: string;
    item: string;
    qty: string;
    price: string;
    total: string;
    subtotal: string;
    gst: string;
    grandTotal: string;
    thankYou: string;
    support: string;
    computerGenerated: string;
  };
}

// English Translations
const en: Translations = {
  app: {
    name: 'Skipline Go',
    tagline: '"Just Skip the Line and Go!"',
    smartMallCheckout: 'Smart Mall Checkout',
    version: 'v2.0.0',
    myTechTeam: 'MyTech Team',
  },
  
  landing: {
    welcomeTo: 'Welcome to Skipline Go',
    quickAccess: '⚡ Quick Access',
    continueAsGuest: 'Continue as Guest',
    noSignUpNeeded: 'No sign-up needed',
    startShoppingInstantly: 'Start shopping instantly',
    withAccount: '🔐 With Account',
    continueWithGoogle: 'Continue with Google',
    syncAcrossDevices: 'Sync purchases across devices',
    howToUse: '📖 How to use Skipline Go?',
    orSignInToSaveHistory: 'or sign in to save history',
    signOut: 'Sign Out',
  },
  
  modeSelect: {
    customerMode: 'Customer Mode',
    customerModeDesc: 'Scan products, pay & get exit QR',
    staffMode: 'Staff Mode',
    staffModeDesc: 'Verify exit QR codes & dashboard',
    exit: 'Exit',
    firstTimeLearn: '📖 First time? Learn how to use!',
  },
  
  guide: {
    howToUseApp: '📖 HOW TO USE SKIPLINE GO',
    step: 'STEP',
    of: 'OF',
    nextStep: 'Next Step',
    back: 'Back',
    imReady: "I'm Ready!",
    skipGuide: 'Skip Guide',
    steps: {
      openApp: {
        title: 'Open Skipline Go App',
        instruction: 'Launch the app on your phone and sign in as Guest or with Google.',
        tip: '💡 Guest mode works without any account!',
      },
      connectWifi: {
        title: 'Connect to Mall WiFi',
        instruction: "Select 'Online Mode' and choose your mall branch from the list.",
        tip: '💡 Offline mode also works - data syncs later!',
      },
      scanProducts: {
        title: 'Scan Products',
        instruction: 'Point your camera at product barcodes. Items auto-add to your cart.',
        tip: '💡 You can adjust quantity or remove items anytime!',
      },
      payInApp: {
        title: 'Pay in App',
        instruction: "Review your cart and tap 'Pay Now'. Complete payment securely.",
        tip: '💡 Supports UPI, Cards, and Wallets!',
      },
      getExitQR: {
        title: 'Get Exit QR Code',
        instruction: "After payment, you'll receive a unique QR code on your screen.",
        tip: "💡 Keep this QR ready - you'll need it at the exit!",
      },
      showQRAtExit: {
        title: 'Show QR at Exit',
        instruction: 'At the exit gate, show your QR to the staff scanner. Done!',
        tip: "💡 Green checkmark = You're free to go! 🎉",
      },
    },
  },
  
  customer: {
    startShopping: 'Start Shopping',
    connectToMallWifi: 'Connect to mall WiFi • Scan & Pay',
    browseProducts: 'Browse Products',
    viewItemsFromHome: 'View items from home',
    myOrders: 'My Orders',
    transactions: 'transactions',
    orders: 'Orders',
    spent: 'Spent',
    minsSaved: 'Mins Saved',
    member: 'Member',
    selectYourMall: 'Select Your Mall',
    connectToStart: 'Connect to start shopping',
    connecting: 'Connecting...',
    searchProducts: 'Search products...',
    products: 'products',
    readyToShop: 'Ready to Shop?',
    visitMallToScan: 'Visit a mall to scan & checkout',
    findNearestMall: 'Find Nearest Mall',
    totalTimeSaved: 'Total Time Saved',
    totalSpent: 'total spent',
    noOrdersYet: 'No orders yet',
    startShoppingToSee: 'Start shopping to see your history',
    startShoppingHistory: 'Start shopping to see your history',
    downloadInvoice: 'Download Invoice',
    items: 'items',
    ordersCount: 'orders',
    browseMode: 'Browse Mode',
  },
  
  shopping: {
    scanProduct: 'Scan Product',
    added: 'Added!',
    cart: 'Cart',
    emptyCart: 'Empty cart',
    scanItemsToAdd: 'Scan items to add',
    total: 'Total',
    totalInclGST: 'Total (incl. GST)',
    checkout: 'Checkout',
    payWith: 'Pay with',
    googlePay: 'Google Pay',
    upi: 'UPI',
    card: 'Card',
    cash: 'Cash',
    processing: 'Processing...',
    pay: 'Pay',
    subtotal: 'Subtotal',
    gst: 'GST (18%)',
  },
  
  exitQR: {
    paymentDone: 'Payment Done! 🎉',
    showQRAtExit: 'Show this QR at exit gate',
    securedExitPass: 'Secured Exit Pass',
    invoice: 'Invoice',
    store: 'Store',
    qrExpired: 'QR Expired',
    regenerate: 'Regenerate',
    quickCheckRequired: 'Quick Check Required',
    readyForExit: 'Ready for Exit',
    aiScore: 'AI Score',
    showQRInstructions: 'Show this QR code to the security staff at the exit gate.',
    expiresIn: 'The code will expire in',
    continueShoppingBtn: 'Continue Shopping',
    backToHome: 'Back to Home',
    copyTokenForTesting: '📋 Copy Token (for testing)',
  },
  
  staff: {
    exitGate: 'Exit Gate',
    staffTerminal: 'Staff Terminal',
    dashboard: 'Dashboard',
    scanCustomerExitQR: 'Scan Customer Exit QR',
    today: 'Today',
    flagged: 'Flagged',
    cleared: 'Cleared',
    pendingVerification: 'transactions pending verification',
    verifying: 'Verifying...',
    decryptingJWT: 'Decrypting JWT token',
    qrExpired: 'QR Expired',
    customerMustRegenerate: 'Customer must regenerate.',
    verificationFailed: 'Verification Failed',
    scanAgain: 'Scan Again',
    backToScanner: 'Back to Scanner',
    transaction: 'Transaction',
    needsCheck: 'NEEDS CHECK',
    risk: 'Risk',
    aiAnalysis: 'AI Analysis',
    cartContents: 'Cart Contents',
    release: 'Release',
    releaseGate: 'Release Gate',
    fullAudit: 'Full Audit',
    
    totalTransactions: 'Transactions',
    revenue: 'Revenue',
    verified: 'Verified',
    theftRiskAnalytics: 'Theft Risk Analytics',
    avgRiskScore: 'Avg Risk Score',
    lowRisk: 'Low Risk',
    medium: 'Medium',
    highRisk: 'High Risk',
    recentTransactions: 'Recent Transactions',
    noTransactionsYet: 'No transactions yet',
    
    customerDetails: 'Customer Details',
    customerId: 'Customer ID',
    customerTier: 'Customer Tier',
    sessionDuration: 'Session Duration',
    paymentMethod: 'Payment Method',
    branch: 'Store Branch',
    shopDate: 'Shopping Date',
    shopTime: 'Shopping Time',
    itemsPurchased: 'Items Purchased',
    totalAmount: 'Total Amount',
    taxPaid: 'Tax Paid',
    behaviorAnalysis: 'Behavior Analysis',
    riskAssessment: 'Risk Assessment',
    verificationStatus: 'Verification Status',
    qrExpiredNotice: 'QR Code Expired - Please ask customer to regenerate',
    gateReleased: 'Gate Released Successfully',
    customerFlagged: 'Please proceed to manual verification counter',
  },
  
  actions: {
    back: 'Back',
    cancel: 'Cancel',
    confirm: 'Confirm',
    continue: 'Continue',
    close: 'Close',
    retry: 'Retry',
    save: 'Save',
    delete: 'Delete',
    home: 'Home',
  },
  
  tiers: {
    new: 'NEW',
    trusted: 'TRUSTED',
    vip: 'VIP',
    flagged: 'FLAGGED',
  },
  
  status: {
    pending: 'PENDING',
    paid: 'PAID',
    verified: 'VERIFIED',
    flagged: 'FLAGGED',
    audited: 'AUDITED',
    expired: 'EXPIRED',
  },
  
  time: {
    minutes: 'minutes',
    seconds: 'seconds',
    min: 'min',
    sec: 'sec',
  },
  
  language: {
    selectLanguage: 'Select Language',
    english: 'English',
    marathi: 'मराठी',
    hindi: 'हिंदी',
  },
  
  pdf: {
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
  },
};

// Marathi Translations
const mr: Translations = {
  app: {
    name: 'स्किपलाइन गो',
    tagline: '"रांगेत थांबा नका, सरळ जा!"',
    smartMallCheckout: 'स्मार्ट मॉल चेकआउट',
    version: 'v2.0.0',
    myTechTeam: 'मायटेक टीम',
  },
  
  landing: {
    welcomeTo: 'स्किपलाइन गो मध्ये आपले स्वागत आहे',
    quickAccess: '⚡ जलद प्रवेश',
    continueAsGuest: 'अतिथी म्हणून सुरू ठेवा',
    noSignUpNeeded: 'साइन-अप आवश्यक नाही',
    startShoppingInstantly: 'लगेच खरेदी सुरू करा',
    withAccount: '🔐 खात्यासह',
    continueWithGoogle: 'Google सह सुरू ठेवा',
    syncAcrossDevices: 'सर्व डिव्हाइसवर खरेदी सिंक करा',
    howToUse: '📖 स्किपलाइन गो कसे वापरायचे?',
    orSignInToSaveHistory: 'किंवा इतिहास सेव्ह करण्यासाठी साइन इन करा',
    signOut: 'साइन आउट',
  },
  
  modeSelect: {
    customerMode: 'ग्राहक मोड',
    customerModeDesc: 'उत्पादने स्कॅन करा, पेमेंट करा आणि एक्झिट QR मिळवा',
    staffMode: 'स्टाफ मोड',
    staffModeDesc: 'एक्झिट QR कोड तपासा आणि डॅशबोर्ड',
    exit: 'बाहेर पडा',
    firstTimeLearn: '📖 पहिल्यांदा? कसे वापरायचे ते शिका!',
  },
  
  guide: {
    howToUseApp: '📖 स्किपलाइन गो कसे वापरायचे',
    step: 'पायरी',
    of: 'पैकी',
    nextStep: 'पुढील पायरी',
    back: 'मागे',
    imReady: 'मी तयार आहे!',
    skipGuide: 'मार्गदर्शक वगळा',
    steps: {
      openApp: {
        title: 'स्किपलाइन गो ॲप उघडा',
        instruction: 'तुमच्या फोनवर ॲप लाँच करा आणि अतिथी किंवा Google ने साइन इन करा.',
        tip: '💡 अतिथी मोड कोणत्याही खात्याशिवाय कार्य करतो!',
      },
      connectWifi: {
        title: 'मॉल WiFi शी कनेक्ट करा',
        instruction: "'ऑनलाइन मोड' निवडा आणि सूचीमधून तुमची मॉल शाखा निवडा.",
        tip: '💡 ऑफलाइन मोड देखील कार्य करतो - डेटा नंतर सिंक होतो!',
      },
      scanProducts: {
        title: 'उत्पादने स्कॅन करा',
        instruction: 'तुमचा कॅमेरा उत्पादन बारकोडकडे वळवा. आयटम आपोआप कार्टमध्ये जोडले जातात.',
        tip: '💡 तुम्ही कधीही प्रमाण बदलू किंवा आयटम काढू शकता!',
      },
      payInApp: {
        title: 'ॲपमध्ये पेमेंट करा',
        instruction: "तुमची कार्ट तपासा आणि 'आता पेमेंट करा' वर टॅप करा. सुरक्षितपणे पेमेंट पूर्ण करा.",
        tip: '💡 UPI, कार्ड आणि वॉलेट्स सपोर्ट करते!',
      },
      getExitQR: {
        title: 'एक्झिट QR कोड मिळवा',
        instruction: 'पेमेंटनंतर, तुम्हाला तुमच्या स्क्रीनवर एक युनिक QR कोड मिळेल.',
        tip: '💡 हा QR तयार ठेवा - एक्झिटवर लागेल!',
      },
      showQRAtExit: {
        title: 'एक्झिटवर QR दाखवा',
        instruction: 'एक्झिट गेटवर, स्टाफ स्कॅनरला तुमचा QR दाखवा. झाले!',
        tip: '💡 हिरवा चेकमार्क = तुम्ही जाऊ शकता! 🎉',
      },
    },
  },
  
  customer: {
    startShopping: 'खरेदी सुरू करा',
    connectToMallWifi: 'मॉल WiFi शी कनेक्ट करा • स्कॅन आणि पे',
    browseProducts: 'उत्पादने ब्राउझ करा',
    viewItemsFromHome: 'घरातून आयटम पहा',
    myOrders: 'माझ्या ऑर्डर्स',
    transactions: 'व्यवहार',
    orders: 'ऑर्डर्स',
    spent: 'खर्च',
    minsSaved: 'मिनिटे वाचली',
    member: 'सदस्य',
    selectYourMall: 'तुमचा मॉल निवडा',
    connectToStart: 'खरेदी सुरू करण्यासाठी कनेक्ट करा',
    connecting: 'कनेक्ट होत आहे...',
    searchProducts: 'उत्पादने शोधा...',
    products: 'उत्पादने',
    readyToShop: 'खरेदीसाठी तयार?',
    visitMallToScan: 'स्कॅन आणि चेकआउटसाठी मॉलला भेट द्या',
    findNearestMall: 'जवळचा मॉल शोधा',
    totalTimeSaved: 'एकूण वाचलेला वेळ',
    totalSpent: 'एकूण खर्च',
    noOrdersYet: 'अजून ऑर्डर्स नाहीत',
    startShoppingToSee: 'तुमचा इतिहास पाहण्यासाठी खरेदी सुरू करा',
    startShoppingHistory: 'तुमचा इतिहास पाहण्यासाठी खरेदी सुरू करा',
    downloadInvoice: 'इनव्हॉइस डाउनलोड करा',
    items: 'आयटम्स',
    ordersCount: 'ऑर्डर्स',
    browseMode: 'ब्राउझ मोड',
  },
  
  shopping: {
    scanProduct: 'उत्पादन स्कॅन करा',
    added: 'जोडले!',
    cart: 'कार्ट',
    emptyCart: 'रिकामी कार्ट',
    scanItemsToAdd: 'जोडण्यासाठी आयटम स्कॅन करा',
    total: 'एकूण',
    totalInclGST: 'एकूण (GST सह)',
    checkout: 'चेकआउट',
    payWith: 'यासह पेमेंट करा',
    googlePay: 'Google Pay',
    upi: 'UPI',
    card: 'कार्ड',
    cash: 'रोख',
    processing: 'प्रक्रिया होत आहे...',
    pay: 'पेमेंट करा',
    subtotal: 'उप-एकूण',
    gst: 'GST (18%)',
  },
  
  exitQR: {
    paymentDone: 'पेमेंट पूर्ण! 🎉',
    showQRAtExit: 'एक्झिट गेटवर हा QR दाखवा',
    securedExitPass: 'सुरक्षित एक्झिट पास',
    invoice: 'इनव्हॉइस',
    store: 'स्टोअर',
    qrExpired: 'QR एक्सपायर झाला',
    regenerate: 'पुन्हा तयार करा',
    quickCheckRequired: 'त्वरित तपासणी आवश्यक',
    readyForExit: 'एक्झिटसाठी तयार',
    aiScore: 'AI स्कोअर',
    showQRInstructions: 'एक्झिट गेटवर सुरक्षा कर्मचाऱ्यांना हा QR कोड दाखवा.',
    expiresIn: 'कोड एक्सपायर होईल',
    continueShoppingBtn: 'खरेदी सुरू ठेवा',
    backToHome: 'होम वर परत',
    copyTokenForTesting: '📋 टोकन कॉपी करा (चाचणीसाठी)',
  },
  
  staff: {
    exitGate: 'एक्झिट गेट',
    staffTerminal: 'स्टाफ टर्मिनल',
    dashboard: 'डॅशबोर्ड',
    scanCustomerExitQR: 'ग्राहक एक्झिट QR स्कॅन करा',
    today: 'आज',
    flagged: 'फ्लॅग केलेले',
    cleared: 'क्लिअर केलेले',
    pendingVerification: 'व्यवहार प्रलंबित तपासणी',
    verifying: 'तपासणी होत आहे...',
    decryptingJWT: 'JWT टोकन डिक्रिप्ट होत आहे',
    qrExpired: 'QR एक्सपायर झाला',
    customerMustRegenerate: 'ग्राहकाने पुन्हा तयार करणे आवश्यक आहे.',
    verificationFailed: 'तपासणी अयशस्वी',
    scanAgain: 'पुन्हा स्कॅन करा',
    backToScanner: 'स्कॅनरवर परत',
    transaction: 'व्यवहार',
    needsCheck: 'तपासणी आवश्यक',
    risk: 'जोखीम',
    aiAnalysis: 'AI विश्लेषण',
    cartContents: 'कार्ट सामग्री',
    release: 'रिलीज',
    releaseGate: 'गेट रिलीज करा',
    fullAudit: 'संपूर्ण ऑडिट',
    
    totalTransactions: 'व्यवहार',
    revenue: 'महसूल',
    verified: 'तपासलेले',
    theftRiskAnalytics: 'चोरी जोखीम विश्लेषण',
    avgRiskScore: 'सरासरी जोखीम स्कोअर',
    lowRisk: 'कमी जोखीम',
    medium: 'मध्यम',
    highRisk: 'उच्च जोखीम',
    recentTransactions: 'अलीकडील व्यवहार',
    noTransactionsYet: 'अजून व्यवहार नाहीत',
    
    customerDetails: 'ग्राहक तपशील',
    customerId: 'ग्राहक आयडी',
    customerTier: 'ग्राहक श्रेणी',
    sessionDuration: 'सत्र कालावधी',
    paymentMethod: 'पेमेंट पद्धत',
    branch: 'स्टोअर शाखा',
    shopDate: 'खरेदी तारीख',
    shopTime: 'खरेदी वेळ',
    itemsPurchased: 'खरेदी केलेले आयटम',
    totalAmount: 'एकूण रक्कम',
    taxPaid: 'भरलेला कर',
    behaviorAnalysis: 'वर्तन विश्लेषण',
    riskAssessment: 'जोखीम मूल्यांकन',
    verificationStatus: 'तपासणी स्थिती',
    qrExpiredNotice: 'QR कोड एक्सपायर झाला - कृपया ग्राहकाला पुन्हा तयार करण्यास सांगा',
    gateReleased: 'गेट यशस्वीरित्या रिलीज झाला',
    customerFlagged: 'कृपया मॅन्युअल तपासणी काउंटरवर जा',
  },
  
  actions: {
    back: 'मागे',
    cancel: 'रद्द करा',
    confirm: 'पुष्टी करा',
    continue: 'सुरू ठेवा',
    close: 'बंद करा',
    retry: 'पुन्हा प्रयत्न करा',
    save: 'सेव्ह करा',
    delete: 'हटवा',
    home: 'होम',
  },
  
  tiers: {
    new: 'नवीन',
    trusted: 'विश्वसनीय',
    vip: 'VIP',
    flagged: 'फ्लॅग केलेले',
  },
  
  status: {
    pending: 'प्रलंबित',
    paid: 'भरलेले',
    verified: 'तपासलेले',
    flagged: 'फ्लॅग केलेले',
    audited: 'ऑडिट केलेले',
    expired: 'एक्सपायर्ड',
  },
  
  time: {
    minutes: 'मिनिटे',
    seconds: 'सेकंद',
    min: 'मिनि',
    sec: 'से',
  },
  
  language: {
    selectLanguage: 'भाषा निवडा',
    english: 'English',
    marathi: 'मराठी',
    hindi: 'हिंदी',
  },
  
  pdf: {
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
  },
};

// Hindi Translations
const hi: Translations = {
  app: {
    name: 'स्किपलाइन गो',
    tagline: '"लाइन छोड़ो, सीधे जाओ!"',
    smartMallCheckout: 'स्मार्ट मॉल चेकआउट',
    version: 'v2.0.0',
    myTechTeam: 'माईटेक टीम',
  },
  
  landing: {
    welcomeTo: 'स्किपलाइन गो में आपका स्वागत है',
    quickAccess: '⚡ त्वरित प्रवेश',
    continueAsGuest: 'अतिथि के रूप में जारी रखें',
    noSignUpNeeded: 'साइन-अप की जरूरत नहीं',
    startShoppingInstantly: 'तुरंत खरीदारी शुरू करें',
    withAccount: '🔐 खाते के साथ',
    continueWithGoogle: 'Google से जारी रखें',
    syncAcrossDevices: 'सभी उपकरणों पर खरीदारी सिंक करें',
    howToUse: '📖 स्किपलाइन गो कैसे उपयोग करें?',
    orSignInToSaveHistory: 'या इतिहास सहेजने के लिए साइन इन करें',
    signOut: 'साइन आउट',
  },
  
  modeSelect: {
    customerMode: 'ग्राहक मोड',
    customerModeDesc: 'उत्पाद स्कैन करें, भुगतान करें और एक्जिट QR प्राप्त करें',
    staffMode: 'स्टाफ मोड',
    staffModeDesc: 'एक्जिट QR कोड सत्यापित करें और डैशबोर्ड',
    exit: 'बाहर निकलें',
    firstTimeLearn: '📖 पहली बार? उपयोग करना सीखें!',
  },
  
  guide: {
    howToUseApp: '📖 स्किपलाइन गो कैसे उपयोग करें',
    step: 'चरण',
    of: 'में से',
    nextStep: 'अगला चरण',
    back: 'वापस',
    imReady: 'मैं तैयार हूं!',
    skipGuide: 'गाइड छोड़ें',
    steps: {
      openApp: {
        title: 'स्किपलाइन गो ऐप खोलें',
        instruction: 'अपने फोन पर ऐप लॉन्च करें और अतिथि या Google से साइन इन करें।',
        tip: '💡 अतिथि मोड बिना किसी खाते के काम करता है!',
      },
      connectWifi: {
        title: 'मॉल WiFi से कनेक्ट करें',
        instruction: "'ऑनलाइन मोड' चुनें और सूची से अपनी मॉल शाखा चुनें।",
        tip: '💡 ऑफलाइन मोड भी काम करता है - डेटा बाद में सिंक होता है!',
      },
      scanProducts: {
        title: 'उत्पाद स्कैन करें',
        instruction: 'अपना कैमरा उत्पाद बारकोड की ओर करें। आइटम स्वचालित रूप से कार्ट में जुड़ जाते हैं।',
        tip: '💡 आप कभी भी मात्रा बदल सकते हैं या आइटम हटा सकते हैं!',
      },
      payInApp: {
        title: 'ऐप में भुगतान करें',
        instruction: "अपनी कार्ट देखें और 'अभी भुगतान करें' पर टैप करें। सुरक्षित रूप से भुगतान पूरा करें।",
        tip: '💡 UPI, कार्ड और वॉलेट समर्थित हैं!',
      },
      getExitQR: {
        title: 'एक्जिट QR कोड प्राप्त करें',
        instruction: 'भुगतान के बाद, आपको अपनी स्क्रीन पर एक अद्वितीय QR कोड मिलेगा।',
        tip: '💡 यह QR तैयार रखें - एक्जिट पर इसकी जरूरत होगी!',
      },
      showQRAtExit: {
        title: 'एक्जिट पर QR दिखाएं',
        instruction: 'एक्जिट गेट पर, स्टाफ स्कैनर को अपना QR दिखाएं। हो गया!',
        tip: '💡 हरा चेकमार्क = आप जा सकते हैं! 🎉',
      },
    },
  },
  
  customer: {
    startShopping: 'खरीदारी शुरू करें',
    connectToMallWifi: 'मॉल WiFi से कनेक्ट करें • स्कैन और पे',
    browseProducts: 'उत्पाद ब्राउज़ करें',
    viewItemsFromHome: 'घर से आइटम देखें',
    myOrders: 'मेरे ऑर्डर',
    transactions: 'लेनदेन',
    orders: 'ऑर्डर',
    spent: 'खर्च',
    minsSaved: 'मिनट बचे',
    member: 'सदस्य',
    selectYourMall: 'अपना मॉल चुनें',
    connectToStart: 'खरीदारी शुरू करने के लिए कनेक्ट करें',
    connecting: 'कनेक्ट हो रहा है...',
    searchProducts: 'उत्पाद खोजें...',
    products: 'उत्पाद',
    readyToShop: 'खरीदारी के लिए तैयार?',
    visitMallToScan: 'स्कैन और चेकआउट के लिए मॉल जाएं',
    findNearestMall: 'निकटतम मॉल खोजें',
    totalTimeSaved: 'कुल बचा हुआ समय',
    totalSpent: 'कुल खर्च',
    noOrdersYet: 'अभी तक कोई ऑर्डर नहीं',
    startShoppingToSee: 'अपना इतिहास देखने के लिए खरीदारी शुरू करें',
    startShoppingHistory: 'अपना इतिहास देखने के लिए खरीदारी शुरू करें',
    downloadInvoice: 'इनवॉइस डाउनलोड करें',
    items: 'आइटम',
    ordersCount: 'ऑर्डर',
    browseMode: 'ब्राउज़ मोड',
  },
  
  shopping: {
    scanProduct: 'उत्पाद स्कैन करें',
    added: 'जोड़ा गया!',
    cart: 'कार्ट',
    emptyCart: 'खाली कार्ट',
    scanItemsToAdd: 'जोड़ने के लिए आइटम स्कैन करें',
    total: 'कुल',
    totalInclGST: 'कुल (GST सहित)',
    checkout: 'चेकआउट',
    payWith: 'इससे भुगतान करें',
    googlePay: 'Google Pay',
    upi: 'UPI',
    card: 'कार्ड',
    cash: 'नकद',
    processing: 'प्रोसेसिंग...',
    pay: 'भुगतान करें',
    subtotal: 'उप-योग',
    gst: 'GST (18%)',
  },
  
  exitQR: {
    paymentDone: 'भुगतान हो गया! 🎉',
    showQRAtExit: 'एक्जिट गेट पर यह QR दिखाएं',
    securedExitPass: 'सुरक्षित एक्जिट पास',
    invoice: 'इनवॉइस',
    store: 'स्टोर',
    qrExpired: 'QR समाप्त हो गया',
    regenerate: 'पुनः बनाएं',
    quickCheckRequired: 'त्वरित जांच आवश्यक',
    readyForExit: 'एक्जिट के लिए तैयार',
    aiScore: 'AI स्कोर',
    showQRInstructions: 'एक्जिट गेट पर सुरक्षा कर्मचारी को यह QR कोड दिखाएं।',
    expiresIn: 'कोड समाप्त होगा',
    continueShoppingBtn: 'खरीदारी जारी रखें',
    backToHome: 'होम पर वापस',
    copyTokenForTesting: '📋 टोकन कॉपी करें (परीक्षण के लिए)',
  },
  
  staff: {
    exitGate: 'एक्जिट गेट',
    staffTerminal: 'स्टाफ टर्मिनल',
    dashboard: 'डैशबोर्ड',
    scanCustomerExitQR: 'ग्राहक एक्जिट QR स्कैन करें',
    today: 'आज',
    flagged: 'फ्लैग किया गया',
    cleared: 'क्लियर किया गया',
    pendingVerification: 'लेनदेन सत्यापन लंबित',
    verifying: 'सत्यापित हो रहा है...',
    decryptingJWT: 'JWT टोकन डिक्रिप्ट हो रहा है',
    qrExpired: 'QR समाप्त हो गया',
    customerMustRegenerate: 'ग्राहक को पुनः बनाना होगा।',
    verificationFailed: 'सत्यापन विफल',
    scanAgain: 'फिर से स्कैन करें',
    backToScanner: 'स्कैनर पर वापस',
    transaction: 'लेनदेन',
    needsCheck: 'जांच आवश्यक',
    risk: 'जोखिम',
    aiAnalysis: 'AI विश्लेषण',
    cartContents: 'कार्ट सामग्री',
    release: 'रिलीज',
    releaseGate: 'गेट रिलीज करें',
    fullAudit: 'पूर्ण ऑडिट',
    
    totalTransactions: 'लेनदेन',
    revenue: 'राजस्व',
    verified: 'सत्यापित',
    theftRiskAnalytics: 'चोरी जोखिम विश्लेषण',
    avgRiskScore: 'औसत जोखिम स्कोर',
    lowRisk: 'कम जोखिम',
    medium: 'मध्यम',
    highRisk: 'उच्च जोखिम',
    recentTransactions: 'हाल के लेनदेन',
    noTransactionsYet: 'अभी तक कोई लेनदेन नहीं',
    
    customerDetails: 'ग्राहक विवरण',
    customerId: 'ग्राहक आईडी',
    customerTier: 'ग्राहक स्तर',
    sessionDuration: 'सत्र अवधि',
    paymentMethod: 'भुगतान विधि',
    branch: 'स्टोर शाखा',
    shopDate: 'खरीदारी तिथि',
    shopTime: 'खरीदारी समय',
    itemsPurchased: 'खरीदे गए आइटम',
    totalAmount: 'कुल राशि',
    taxPaid: 'भुगतान किया गया कर',
    behaviorAnalysis: 'व्यवहार विश्लेषण',
    riskAssessment: 'जोखिम मूल्यांकन',
    verificationStatus: 'सत्यापन स्थिति',
    qrExpiredNotice: 'QR कोड समाप्त हो गया - कृपया ग्राहक को पुनः बनाने के लिए कहें',
    gateReleased: 'गेट सफलतापूर्वक रिलीज हो गया',
    customerFlagged: 'कृपया मैनुअल सत्यापन काउंटर पर जाएं',
  },
  
  actions: {
    back: 'वापस',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    continue: 'जारी रखें',
    close: 'बंद करें',
    retry: 'पुनः प्रयास करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    home: 'होम',
  },
  
  tiers: {
    new: 'नया',
    trusted: 'विश्वसनीय',
    vip: 'VIP',
    flagged: 'फ्लैग किया गया',
  },
  
  status: {
    pending: 'लंबित',
    paid: 'भुगतान किया',
    verified: 'सत्यापित',
    flagged: 'फ्लैग किया',
    audited: 'ऑडिट किया',
    expired: 'समाप्त',
  },
  
  time: {
    minutes: 'मिनट',
    seconds: 'सेकंड',
    min: 'मिनि',
    sec: 'से',
  },
  
  language: {
    selectLanguage: 'भाषा चुनें',
    english: 'English',
    marathi: 'मराठी',
    hindi: 'हिंदी',
  },
  
  pdf: {
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
  },
};

// All translations
const translations: Record<Language, Translations> = { en, mr, hi };

// Current language state (stored in localStorage)
const LANGUAGE_KEY = 'skipline_language';

export const getStoredLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored && (stored === 'en' || stored === 'mr' || stored === 'hi')) {
      return stored;
    }
  } catch (e) {}
  return 'en';
};

export const setStoredLanguage = (lang: Language): void => {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {}
};

export const getTranslations = (lang: Language): Translations => {
  return translations[lang] || translations.en;
};

// Export default translations
export default translations;
