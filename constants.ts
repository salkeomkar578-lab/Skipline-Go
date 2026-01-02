/**
 * Constants - Skipline Go
 * Product catalog, store layout, and app configuration
 */

import { Product } from './types';

// ==================== PRODUCT CATALOG ====================
// Using DiceBear API for reliable, consistent product images

// Helper function to generate product image
const getProductImage = (seed: string, style: string = 'shapes') => 
  `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f8fafc&size=200`;

// Product icon mapping for better visuals
const PRODUCT_ICONS: Record<string, string> = {
  milk: '🥛', butter: '🧈', curd: '🥣', cheese: '🧀',
  noodles: '🍜', tea: '🍵', coffee: '☕', juice: '🧃', cola: '🥤',
  biscuits: '🍪', chips: '🥔', snacks: '🍿',
  soap: '🧼', toothpaste: '🦷', shampoo: '🧴',
  rice: '🍚', oil: '🫒', dal: '🫘', atta: '🌾', salt: '🧂',
  masala: '🌶️', turmeric: '🟡', chilli: '🌶️',
  headphones: '🎧', powerbank: '🔋', bulb: '💡', speaker: '🔊',
  tomato: '🍅', onion: '🧅', potato: '🥔', banana: '🍌', apple: '🍎'
};

export const MOCK_PRODUCTS: Product[] = [
  // Dairy & Breakfast (Aisle 3-4)
  { 
    id: '8901030663428', 
    name: 'Amul Gold Milk (1L)', 
    price: 66, 
    category: 'Dairy', 
    image: getProductImage('amul-milk-gold', 'icons'),
    icon: '🥛',
    aisle: 'Aisle 3', 
    tags: ['milk', 'dairy', 'breakfast'] 
  },
  { 
    id: '8901030663429', 
    name: 'Amul Butter (500g)', 
    price: 285, 
    category: 'Dairy', 
    image: getProductImage('amul-butter-500', 'icons'),
    icon: '🧈',
    aisle: 'Aisle 3', 
    tags: ['butter', 'dairy', 'spread'] 
  },
  { 
    id: '8901030663430', 
    name: 'Mother Dairy Curd (400g)', 
    price: 45, 
    category: 'Dairy', 
    image: getProductImage('mother-dairy-curd', 'icons'),
    icon: '🥣',
    aisle: 'Aisle 3', 
    tags: ['curd', 'yogurt', 'dairy'] 
  },
  { 
    id: '8901030663431', 
    name: 'Amul Cheese Slices (10 pcs)', 
    price: 120, 
    category: 'Dairy', 
    image: getProductImage('amul-cheese-slices', 'icons'),
    icon: '🧀',
    aisle: 'Aisle 3', 
    tags: ['cheese', 'dairy', 'sandwich'] 
  },
  
  // Instant Food & Noodles (Aisle 13-14)
  { 
    id: '8901058000106', 
    name: 'Maggi 2-Minute Noodles', 
    price: 14, 
    category: 'Instant Food', 
    image: getProductImage('maggi-noodles', 'icons'),
    icon: '🍜',
    aisle: 'Aisle 13', 
    tags: ['noodles', 'instant', 'maggi'] 
  },
  { 
    id: '8901058000107', 
    name: 'Yippee Noodles Magic Masala', 
    price: 52, 
    category: 'Instant Food', 
    image: getProductImage('yippee-noodles', 'icons'),
    icon: '🍜',
    aisle: 'Aisle 13', 
    tags: ['noodles', 'instant', 'yippee'] 
  },
  { 
    id: '8901058000108', 
    name: 'Top Ramen Curry Noodles', 
    price: 45, 
    category: 'Instant Food', 
    image: getProductImage('top-ramen-curry', 'icons'),
    icon: '🍜',
    aisle: 'Aisle 13', 
    tags: ['noodles', 'cup', 'instant'] 
  },
  
  // Beverages (Aisle 7-8)
  { 
    id: '8901491101831', 
    name: 'Tata Tea Gold (500g)', 
    price: 275, 
    category: 'Beverages', 
    image: getProductImage('tata-tea-gold', 'icons'),
    icon: '🍵',
    aisle: 'Aisle 7', 
    tags: ['tea', 'beverages', 'tata'] 
  },
  { 
    id: '8901491101832', 
    name: 'Nescafe Classic Coffee (100g)', 
    price: 285, 
    category: 'Beverages', 
    image: getProductImage('nescafe-coffee', 'icons'),
    icon: '☕',
    aisle: 'Aisle 7', 
    tags: ['coffee', 'nescafe', 'beverages'] 
  },
  { 
    id: '8901491101833', 
    name: 'Real Fruit Power Mixed Fruit (1L)', 
    price: 99, 
    category: 'Beverages', 
    image: getProductImage('real-juice-mixed', 'icons'),
    icon: '🧃',
    aisle: 'Aisle 8', 
    tags: ['juice', 'fruit', 'real'] 
  },
  { 
    id: '8901491101834', 
    name: 'Coca Cola (750ml)', 
    price: 40, 
    category: 'Beverages', 
    image: getProductImage('coca-cola-bottle', 'icons'),
    icon: '🥤',
    aisle: 'Aisle 8', 
    tags: ['cola', 'soft drink', 'coca cola'] 
  },
  
  // Snacks & Biscuits (Aisle 5-6)
  { 
    id: '8901063142103', 
    name: 'Parle-G Gold Biscuits', 
    price: 30, 
    category: 'Biscuits', 
    image: getProductImage('parle-g-gold', 'icons'),
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['biscuits', 'parle', 'snacks'] 
  },
  { 
    id: '8901063142104', 
    name: 'Britannia Good Day Cashew', 
    price: 55, 
    category: 'Biscuits', 
    image: getProductImage('britannia-goodday', 'icons'),
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['biscuits', 'britannia', 'cookies'] 
  },
  { 
    id: '8901063142105', 
    name: 'Lays Classic Salted (52g)', 
    price: 20, 
    category: 'Snacks', 
    image: getProductImage('lays-classic', 'icons'),
    icon: '🥔',
    aisle: 'Aisle 6', 
    tags: ['chips', 'lays', 'snacks'] 
  },
  { 
    id: '8901063142106', 
    name: 'Kurkure Masala Munch (90g)', 
    price: 25, 
    category: 'Snacks', 
    image: getProductImage('kurkure-masala', 'icons'),
    icon: '🍿',
    aisle: 'Aisle 6', 
    tags: ['kurkure', 'snacks', 'namkeen'] 
  },
  { 
    id: '8901063142107', 
    name: 'Haldirams Aloo Bhujia (200g)', 
    price: 65, 
    category: 'Snacks', 
    image: getProductImage('haldirams-bhujia', 'icons'),
    icon: '🍿',
    aisle: 'Aisle 6', 
    tags: ['bhujia', 'haldirams', 'namkeen'] 
  },
  
  // Personal Care (Aisle 9-10)
  { 
    id: '8901207040416', 
    name: 'Dettol Original Soap (125g)', 
    price: 45, 
    category: 'Personal Care', 
    image: getProductImage('dettol-soap', 'icons'),
    icon: '🧼',
    aisle: 'Aisle 9', 
    tags: ['soap', 'dettol', 'hygiene'] 
  },
  { 
    id: '8901207040417', 
    name: 'Colgate MaxFresh Blue (150g)', 
    price: 95, 
    category: 'Personal Care', 
    image: getProductImage('colgate-maxfresh', 'icons'),
    icon: '🦷',
    aisle: 'Aisle 9', 
    tags: ['toothpaste', 'colgate', 'dental'] 
  },
  { 
    id: '8901207040418', 
    name: 'Head & Shoulders Shampoo (180ml)', 
    price: 199, 
    category: 'Personal Care', 
    image: getProductImage('head-shoulders', 'icons'),
    icon: '🧴',
    aisle: 'Aisle 10', 
    tags: ['shampoo', 'haircare', 'dandruff'] 
  },
  { 
    id: '8901207040419', 
    name: 'Dove Soap (100g x 3)', 
    price: 175, 
    category: 'Personal Care', 
    image: getProductImage('dove-soap-pack', 'icons'),
    icon: '🧼',
    aisle: 'Aisle 9', 
    tags: ['soap', 'dove', 'moisturizing'] 
  },
  
  // Staples (Aisle 15-16)
  { 
    id: '8901725181001', 
    name: 'India Gate Basmati Rice (5kg)', 
    price: 450, 
    category: 'Staples', 
    image: getProductImage('indiagate-rice', 'icons'),
    icon: '🍚',
    aisle: 'Aisle 15', 
    tags: ['rice', 'basmati', 'staples'] 
  },
  { 
    id: '8901725181002', 
    name: 'Fortune Sunflower Oil (1L)', 
    price: 155, 
    category: 'Staples', 
    image: getProductImage('fortune-oil', 'icons'),
    icon: '🫒',
    aisle: 'Aisle 15', 
    tags: ['oil', 'cooking', 'sunflower'] 
  },
  { 
    id: '8901725181003', 
    name: 'Tata Toor Dal (1kg)', 
    price: 165, 
    category: 'Staples', 
    image: getProductImage('tata-toor-dal', 'icons'),
    icon: '🫘',
    aisle: 'Aisle 16', 
    tags: ['dal', 'lentils', 'pulses'] 
  },
  { 
    id: '8901725181004', 
    name: 'Aashirvaad Atta (5kg)', 
    price: 285, 
    category: 'Staples', 
    image: getProductImage('aashirvaad-atta', 'icons'),
    icon: '🌾',
    aisle: 'Aisle 16', 
    tags: ['atta', 'flour', 'wheat'] 
  },
  { 
    id: '8901725181005', 
    name: 'Saffola Gold Oil (1L)', 
    price: 199, 
    category: 'Staples', 
    image: getProductImage('saffola-gold', 'icons'),
    icon: '🫒',
    aisle: 'Aisle 15', 
    tags: ['oil', 'cooking', 'healthy'] 
  },
  
  // Spices & Masalas (Aisle 17-18)
  { 
    id: '8901042100012', 
    name: 'MDH Garam Masala (100g)', 
    price: 85, 
    category: 'Spices', 
    image: getProductImage('mdh-garam-masala', 'icons'),
    icon: '🌶️',
    aisle: 'Aisle 17', 
    tags: ['masala', 'spices', 'mdh'] 
  },
  { 
    id: '8901042100013', 
    name: 'Everest Turmeric Powder (100g)', 
    price: 55, 
    category: 'Spices', 
    image: getProductImage('everest-turmeric', 'icons'),
    icon: '🟡',
    aisle: 'Aisle 17', 
    tags: ['turmeric', 'haldi', 'spices'] 
  },
  { 
    id: '8901042100014', 
    name: 'Catch Red Chilli Powder (100g)', 
    price: 65, 
    category: 'Spices', 
    image: getProductImage('catch-chilli', 'icons'),
    icon: '🌶️',
    aisle: 'Aisle 18', 
    tags: ['chilli', 'mirch', 'spices'] 
  },
  { 
    id: '8901042100015', 
    name: 'Tata Salt (1kg)', 
    price: 28, 
    category: 'Spices', 
    image: getProductImage('tata-salt', 'icons'),
    icon: '🧂',
    aisle: 'Aisle 17', 
    tags: ['salt', 'tata', 'iodized'] 
  },
  
  // Electronics (Aisle 19-20) - High Value Items
  { 
    id: '8901234567001', 
    name: 'boAt Rockerz 450 Headphones', 
    price: 1499, 
    category: 'Electronics', 
    image: getProductImage('boat-rockerz-450', 'icons'),
    icon: '🎧',
    aisle: 'Aisle 19', 
    tags: ['headphones', 'boat', 'audio'], 
    weight: 200 
  },
  { 
    id: '8901234567002', 
    name: 'Mi Power Bank 10000mAh', 
    price: 1199, 
    category: 'Electronics', 
    image: getProductImage('mi-powerbank', 'icons'),
    icon: '🔋',
    aisle: 'Aisle 19', 
    tags: ['powerbank', 'xiaomi', 'charging'], 
    weight: 250 
  },
  { 
    id: '8901234567003', 
    name: 'Syska LED Bulb 9W (2 Pack)', 
    price: 199, 
    category: 'Electronics', 
    image: getProductImage('syska-led-bulb', 'icons'),
    icon: '💡',
    aisle: 'Aisle 20', 
    tags: ['led', 'bulb', 'lighting'], 
    weight: 100 
  },
  { 
    id: '8901234567004', 
    name: 'Portronics Bluetooth Speaker', 
    price: 899, 
    category: 'Electronics', 
    image: getProductImage('portronics-speaker', 'icons'),
    icon: '🔊',
    aisle: 'Aisle 19', 
    tags: ['speaker', 'bluetooth', 'audio'], 
    weight: 300 
  },
  
  // Fresh Produce (Aisle 1-2)
  { 
    id: '8901234560001', 
    name: 'Fresh Tomatoes (500g)', 
    price: 30, 
    category: 'Fresh Produce', 
    image: getProductImage('fresh-tomatoes', 'icons'),
    icon: '🍅',
    aisle: 'Aisle 1', 
    tags: ['vegetables', 'tomato', 'fresh'] 
  },
  { 
    id: '8901234560002', 
    name: 'Onion (1kg)', 
    price: 35, 
    category: 'Fresh Produce', 
    image: getProductImage('fresh-onions', 'icons'),
    icon: '🧅',
    aisle: 'Aisle 1', 
    tags: ['vegetables', 'onion', 'fresh'] 
  },
  { 
    id: '8901234560003', 
    name: 'Fresh Potatoes (1kg)', 
    price: 40, 
    category: 'Fresh Produce', 
    image: getProductImage('fresh-potatoes', 'icons'),
    icon: '🥔',
    aisle: 'Aisle 1', 
    tags: ['vegetables', 'potato', 'fresh'] 
  },
  { 
    id: '8901234560004', 
    name: 'Fresh Bananas (6 pcs)', 
    price: 45, 
    category: 'Fresh Produce', 
    image: getProductImage('fresh-bananas', 'icons'),
    icon: '🍌',
    aisle: 'Aisle 2', 
    tags: ['fruits', 'banana', 'fresh'] 
  },
  { 
    id: '8901234560005', 
    name: 'Shimla Apples (500g)', 
    price: 120, 
    category: 'Fresh Produce', 
    image: getProductImage('shimla-apples', 'icons'),
    icon: '🍎',
    aisle: 'Aisle 2', 
    tags: ['fruits', 'apple', 'fresh'] 
  },
];

// ==================== STORE LAYOUT ====================

export const STORE_LAYOUT = {
  aisles: [
    { id: 'aisle-1-2', name: 'Aisle 1-2', category: 'Fresh Produce & Fruits', icon: '🥬' },
    { id: 'aisle-3-4', name: 'Aisle 3-4', category: 'Dairy, Eggs & Breakfast', icon: '🥛' },
    { id: 'aisle-5-6', name: 'Aisle 5-6', category: 'Snacks, Biscuits & Chips', icon: '🍪' },
    { id: 'aisle-7-8', name: 'Aisle 7-8', category: 'Beverages & Juices', icon: '🧃' },
    { id: 'aisle-9-10', name: 'Aisle 9-10', category: 'Personal Care & Hygiene', icon: '🧴' },
    { id: 'aisle-11-12', name: 'Aisle 11-12', category: 'Home Care & Cleaning', icon: '🧹' },
    { id: 'aisle-13-14', name: 'Aisle 13-14', category: 'Instant Food & Noodles', icon: '🍜' },
    { id: 'aisle-15-16', name: 'Aisle 15-16', category: 'Rice, Dal & Staples', icon: '🍚' },
    { id: 'aisle-17-18', name: 'Aisle 17-18', category: 'Spices & Masalas', icon: '🌶️' },
    { id: 'aisle-19-20', name: 'Aisle 19-20', category: 'Electronics & Accessories', icon: '🔌' },
  ],
  exitGates: ['Gate A', 'Gate B', 'Gate C'],
  customerService: 'Near Gate A'
};

// ==================== PRODUCT CATALOG (For Firestore) ====================

export const PRODUCT_CATALOG = MOCK_PRODUCTS.reduce((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {} as Record<string, Product>);

// ==================== NETWORK CONFIGURATION ====================

export const MALL_WIFI_NAME = 'Reliance-Smart-Bazaar-5G';
export const MALL_WIFI_NAMES = [
  'Reliance-Smart-Bazaar-5G',
  'Mall-Guest-WiFi',
  'Phoenix-Mall-Free',
  'Inorbit-Guest',
  'Mall_Guest_WiFi'
];

// ==================== CURRENCY ====================

export const CURRENCY_SYMBOL = '₹';
export const TAX_RATE = 0.18; // 18% GST

// ==================== THEFT SCORE THRESHOLDS ====================

export const THEFT_THRESHOLDS = {
  LOW: 25,
  MEDIUM: 50,
  HIGH: 75,
  CRITICAL: 90
};

export const AUDIT_RANDOM_CHECK_RATE = 0.1; // 1 in 10 customers get random spot check

// ==================== QR CODE SETTINGS ====================

export const QR_EXPIRY_MINUTES = 10;
export const QR_REGENERATE_BUFFER = 60; // Warn when < 60 seconds remaining

// ==================== GEMINI AI SETTINGS ====================

export const AI_MODEL = 'gemini-3-flash-preview';
export const AI_MAX_TOKENS = 500;
export const AI_TEMPERATURE = 0.7;

// ==================== OFFLINE SETTINGS ====================

export const OFFLINE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
export const SYNC_RETRY_INTERVAL = 30000; // 30 seconds
export const MAX_OFFLINE_TRANSACTIONS = 50;

// ==================== APP VERSION ====================

export const APP_VERSION = '2.0.0';
export const APP_NAME = 'Skipline Go';
export const BUILD_DATE = '2024-01-15';
