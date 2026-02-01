/**
 * Constants - Skipline Go
 * Product catalog, store layout, and app configuration
 */

import { Product } from './types';

// ==================== PRODUCT CATALOG ====================
// Using real product images from reliable CDN sources

// Real product image URLs (using reliable image sources - Unsplash & Pexels)
const PRODUCT_IMAGES: Record<string, string> = {
  // Dairy - Real milk, butter, cheese, curd images
  'amul-milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
  'amul-butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80',
  'mother-dairy-curd': 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&q=80',
  'amul-cheese': 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400&q=80',
  // Noodles - Real instant noodles images
  'maggi': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
  'yippee': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80',
  'top-ramen': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&q=80',
  // Beverages - Real tea, coffee, juice, cola
  'tata-tea': 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&q=80',
  'nescafe': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
  'real-juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80',
  'coca-cola': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80',
  // Snacks - Real biscuits, chips, namkeen
  'parle-g': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80',
  'britannia': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80',
  'lays': 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&q=80',
  'kurkure': 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400&q=80',
  'haldirams': 'https://images.unsplash.com/photo-1613919517906-4144d4f5a66a?w=400&q=80',
  // Personal Care - Real soap, toothpaste, shampoo
  'dettol': 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&q=80',
  'colgate': 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&q=80',
  'head-shoulders': 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80',
  'dove': 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&q=80',
  // Staples - Real rice, oil, dal, flour
  'india-gate': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
  'fortune-oil': 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&q=80',
  'tata-dal': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80',
  'aashirvaad': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
  'saffola': 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&q=80',
  // Spices - Real masala, turmeric, chilli images
  'mdh': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
  'everest': 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
  'catch': 'https://images.unsplash.com/photo-1599909533986-3ee58c69cf6a?w=400&q=80',
  'tata-salt': 'https://images.unsplash.com/photo-1518110925495-5fe2f8cbf7f1?w=400&q=80',
  // Electronics - Real headphones, powerbank, speaker
  'boat-headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  'powerbank': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
  'led-bulb': 'https://images.unsplash.com/photo-1532007943853-f7dfa0f960a9?w=400&q=80',
  'speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  // Fresh Produce - Real vegetables and fruits
  'tomatoes': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
  'onions': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80',
  'potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82abe2ff?w=400&q=80',
  'bananas': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&q=80',
  'apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80'
};

// Fallback image generator for products without real images
const getFallbackImage = (seed: string) => 
  `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f8fafc&size=200`;

// Helper function to get product image (uses real images where available, fallback otherwise)
const getProductImage = (key: string, _style?: string) => {
  // Map old keys to new image keys
  const keyMap: Record<string, string> = {
    'amul-milk-gold': 'amul-milk',
    'amul-butter-500': 'amul-butter',
    'mother-dairy-curd': 'mother-dairy-curd',
    'amul-cheese-slices': 'amul-cheese',
    'maggi-noodles': 'maggi',
    'yippee-noodles': 'yippee',
    'top-ramen-curry': 'top-ramen',
    'tata-tea-gold': 'tata-tea',
    'nescafe-coffee': 'nescafe',
    'real-juice-mixed': 'real-juice',
    'coca-cola-bottle': 'coca-cola',
    'parle-g-gold': 'parle-g',
    'britannia-goodday': 'britannia',
    'lays-classic': 'lays',
    'kurkure-masala': 'kurkure',
    'haldirams-bhujia': 'haldirams',
    'dettol-soap': 'dettol',
    'colgate-maxfresh': 'colgate',
    'head-shoulders': 'head-shoulders',
    'dove-soap-pack': 'dove',
    'indiagate-rice': 'india-gate',
    'fortune-oil': 'fortune-oil',
    'tata-toor-dal': 'tata-dal',
    'aashirvaad-atta': 'aashirvaad',
    'saffola-gold': 'saffola',
    'mdh-garam-masala': 'mdh',
    'everest-turmeric': 'everest',
    'catch-chilli': 'catch',
    'tata-salt': 'tata-salt',
    'boat-rockerz-450': 'boat-headphones',
    'mi-powerbank': 'powerbank',
    'syska-led-bulb': 'led-bulb',
    'portronics-speaker': 'speaker',
    'fresh-tomatoes': 'tomatoes',
    'fresh-onions': 'onions',
    'fresh-potatoes': 'potatoes',
    'fresh-bananas': 'bananas',
    'shimla-apples': 'apples'
  };
  
  const mappedKey = keyMap[key] || key;
  return PRODUCT_IMAGES[mappedKey] || getFallbackImage(key);
};

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
    tags: ['milk', 'dairy', 'breakfast'],
    description: 'Full cream milk with 6% fat content. Rich, creamy taste perfect for tea, coffee, or drinking plain. Fortified with Vitamin A & D.',
    rating: 4.5,
    reviews: 2340
  },
  { 
    id: '8901030663429', 
    name: 'Amul Butter (500g)', 
    price: 285, 
    category: 'Dairy', 
    image: getProductImage('amul-butter-500', 'icons'),
    icon: '🧈',
    aisle: 'Aisle 3', 
    tags: ['butter', 'dairy', 'spread'],
    description: 'Premium salted butter made from fresh cream. Perfect for spreading on toast, parathas, or cooking. Rich, creamy flavor.',
    rating: 4.7,
    reviews: 5621
  },
  { 
    id: '8901030663430', 
    name: 'Mother Dairy Curd (400g)', 
    price: 45, 
    category: 'Dairy', 
    image: getProductImage('mother-dairy-curd', 'icons'),
    icon: '🥣',
    aisle: 'Aisle 3', 
    tags: ['curd', 'yogurt', 'dairy'],
    description: 'Fresh, creamy curd with live active cultures. Great for digestion and perfect for raita, lassi, or eating with rice.',
    rating: 4.3,
    reviews: 1856
  },
  { 
    id: '8901030663431', 
    name: 'Amul Cheese Slices (10 pcs)', 
    price: 120, 
    category: 'Dairy', 
    image: getProductImage('amul-cheese-slices', 'icons'),
    icon: '🧀',
    aisle: 'Aisle 3', 
    tags: ['cheese', 'dairy', 'sandwich'],
    description: 'Processed cheese slices, individually wrapped. Perfect for sandwiches, burgers, and grilled cheese. Melts smoothly.',
    rating: 4.4,
    reviews: 3120
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
    tags: ['noodles', 'instant', 'maggi'],
    description: 'India\'s favorite instant noodles! Ready in 2 minutes with the iconic masala flavor. Quick snack for any time.',
    rating: 4.6,
    reviews: 15420
  },
  { 
    id: '8901058000107', 
    name: 'Yippee Noodles Magic Masala', 
    price: 52, 
    category: 'Instant Food', 
    image: getProductImage('yippee-noodles', 'icons'),
    icon: '🍜',
    aisle: 'Aisle 13', 
    tags: ['noodles', 'instant', 'yippee'],
    description: 'Long, slurpy noodles with magic masala flavor. Stays non-sticky even after cooking. Family pack of 4.',
    rating: 4.2,
    reviews: 8954
  },
  { 
    id: '8901058000108', 
    name: 'Top Ramen Curry Noodles', 
    price: 45, 
    category: 'Instant Food', 
    image: getProductImage('top-ramen-curry', 'icons'),
    icon: '🍜',
    aisle: 'Aisle 13', 
    tags: ['noodles', 'cup', 'instant'],
    description: 'Smooth curry flavored noodles with vegetables. Authentic Japanese style instant noodles. Ready in minutes.',
    rating: 4.1,
    reviews: 4532
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
