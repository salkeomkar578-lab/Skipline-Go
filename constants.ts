/**
 * Constants - Skipline Go
 * Product catalog, store layout, and app configuration
 */

import { Product } from './types';

// ==================== PRODUCT CATALOG ====================
// Using real product images from Open Food Facts and reliable CDN sources

// Real product image URLs - Using verified working CDN sources
const PRODUCT_IMAGES: Record<string, string> = {
  // Dairy - Amul and Mother Dairy products
  'amul-milk': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/10840a.jpg',
  'amul-butter': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/25825a.jpg',
  'mother-dairy-curd': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/389267a.jpg',
  'amul-cheese': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/99169a.jpg',
  // Noodles - Maggi, Yippee, Top Ramen
  'maggi': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/11610a.jpg',
  'yippee': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/122952a.jpg',
  'top-ramen': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/166296a.jpg',
  // Beverages - Tea, Coffee, Juice, Soft drinks
  'tata-tea': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/12008a.jpg',
  'nescafe': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/47597a.jpg',
  'real-juice': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/15693a.jpg',
  'coca-cola': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/39430a.jpg',
  // Snacks - Biscuits, Chips, Namkeen
  'parle-g': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/12170a.jpg',
  'britannia': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/99330a.jpg',
  'lays': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/136097a.jpg',
  'kurkure': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/2951a.jpg',
  'haldirams': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/20866a.jpg',
  'banana-chips': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/133028a.jpg',
  // Personal Care - Soaps, Toothpaste, Shampoo
  'dettol': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/53573a.jpg',
  'colgate': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/14093a.jpg',
  'head-shoulders': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/14196a.jpg',
  'dove': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/14140a.jpg',
  // Staples - Rice, Oil, Dal, Flour
  'india-gate': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/12229a.jpg',
  'fortune-oil': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/11965a.jpg',
  'tata-dal': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/12059a.jpg',
  'aashirvaad': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/11930a.jpg',
  'saffola': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/12047a.jpg',
  // Spices - Masala, Turmeric, Chilli
  'mdh': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/12103a.jpg',
  'everest': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/12097a.jpg',
  'catch': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/12071a.jpg',
  'tata-salt': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/12080a.jpg',
  // Electronics
  'boat-headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  'powerbank': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
  'led-bulb': 'https://images.unsplash.com/photo-1532007943853-f7dfa0f960a9?w=400&q=80',
  'speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  // Fresh Produce
  'tomatoes': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/50083a.jpg',
  'onions': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/50022a.jpg',
  'potatoes': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/50038a.jpg',
  'bananas': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/50009a.jpg',
  'apples': 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/50012a.jpg'
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
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/76e3a4b5-3d8f-4e2c-9b7a-1c6d8f4e2a3b.jpg',
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
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/5c9d4e2a-8b6f-4e3c-9a7d-2f1b8c4e7a3b.jpg',
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
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/2d8e4c9a-7b3f-4e6c-8a5d-1f9b2c4e7a3b.jpg',
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
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/3c7d8e4a-9b2f-4e5c-8a6d-4f1b7c2e9a3b.jpg',
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
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/8a7b4c5d-3e2f-4a8b-9c6d-1f5e7b9a2c3d.jpg',
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
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/e39b9fa7-6eb7-4aa0-89c7-2b9b0e3acb3c.jpg',
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
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/c14ebe16-8ab7-4aff-8bb7-4ff03a33fd49.jpg',
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
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/d0a13d28-07f0-4e5f-974b-9a89826f8b7e.jpg',
    icon: '🍵',
    aisle: 'Aisle 7', 
    tags: ['tea', 'beverages', 'tata'] 
  },
  { 
    id: '8901491101832', 
    name: 'Nescafe Classic Coffee (100g)', 
    price: 285, 
    category: 'Beverages', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/46a19bdf-f3a3-4a72-8430-a5c8d38722e8.jpg',
    icon: '☕',
    aisle: 'Aisle 7', 
    tags: ['coffee', 'nescafe', 'beverages'] 
  },
  { 
    id: '8901491101833', 
    name: 'Real Fruit Power Mixed Fruit (1L)', 
    price: 99, 
    category: 'Beverages', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/93b5f813-a7cb-4be9-9a12-b4c6ef63a7c9.jpg',
    icon: '🧃',
    aisle: 'Aisle 8', 
    tags: ['juice', 'fruit', 'real'] 
  },
  { 
    id: '8901491101834', 
    name: 'Coca Cola (750ml)', 
    price: 40, 
    category: 'Beverages', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/01eb48b9-b977-4c18-ad97-5f7d8f8b5cb3.jpg',
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
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/8c9eb0c1-5ff7-4618-b37c-0f92c9b5cf2e.jpg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['biscuits', 'parle', 'snacks'] 
  },
  { 
    id: '8901063142104', 
    name: 'Britannia Good Day Cashew', 
    price: 55, 
    category: 'Biscuits', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/39c8e4e5-26e3-4ed9-ba72-c23ca7ae0c8b.jpg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['biscuits', 'britannia', 'cookies'] 
  },
  { 
    id: '8901063142105', 
    name: 'Lays Classic Salted (52g)', 
    price: 20, 
    category: 'Snacks', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/a1c89f7e-b0b3-4825-956e-76b234a9e8c3.jpg',
    icon: '🥔',
    aisle: 'Aisle 6', 
    tags: ['chips', 'lays', 'snacks'] 
  },
  { 
    id: '8901063142106', 
    name: 'Kurkure Masala Munch (90g)', 
    price: 25, 
    category: 'Snacks', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/7e0b4a5d-1c8c-4bc0-85f9-d99c7c254d1c.jpg',
    icon: '🍟',
    aisle: 'Aisle 6', 
    tags: ['kurkure', 'snacks', 'namkeen'] 
  },
  { 
    id: '8901063142107', 
    name: 'Haldirams Aloo Bhujia (200g)', 
    price: 65, 
    category: 'Snacks', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/2f6e5d4c-3c4a-4ef8-8d82-f82b1d2a3e4f.jpg',
    icon: '🍟',
    aisle: 'Aisle 6', 
    tags: ['bhujia', 'haldirams', 'namkeen'] 
  },
  
  // Personal Care (Aisle 9-10)
  { 
    id: '8901207040416', 
    name: 'Dettol Original Soap (125g)', 
    price: 45, 
    category: 'Personal Care', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/8d3b4e1f-5c2a-4b6e-9a8f-d72c1e4b9a3c.jpg',
    icon: '🧼',
    aisle: 'Aisle 9', 
    tags: ['soap', 'dettol', 'hygiene'] 
  },
  { 
    id: '8901207040417', 
    name: 'Colgate MaxFresh Blue (150g)', 
    price: 95, 
    category: 'Personal Care', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/5e8c2d3b-7a1f-4c9e-8b6d-9f3a2c4e1b8d.jpg',
    icon: '🦷',
    aisle: 'Aisle 9', 
    tags: ['toothpaste', 'colgate', 'dental'] 
  },
  { 
    id: '8901207040418', 
    name: 'Head & Shoulders Shampoo (180ml)', 
    price: 199, 
    category: 'Personal Care', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/4c9d5e2a-8b3f-4d7e-9c6a-2f1b8e7d4c3a.jpg',
    icon: '🧴',
    aisle: 'Aisle 10', 
    tags: ['shampoo', 'haircare', 'dandruff'] 
  },
  { 
    id: '8901207040419', 
    name: 'Dove Soap (100g x 3)', 
    price: 175, 
    category: 'Personal Care', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/7b2e8f3d-6c4a-4e9b-8d5c-1a7f4b9e2c3d.jpg',
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
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/b8e4a2c9-5d7f-4e3b-9c6a-1f8d2b4e7a3c.jpg',
    icon: '🍚',
    aisle: 'Aisle 15', 
    tags: ['rice', 'basmati', 'staples'] 
  },
  { 
    id: '8901725181002', 
    name: 'Fortune Sunflower Oil (1L)', 
    price: 155, 
    category: 'Staples', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/9c3e8d2a-4b6f-4e7c-8a5b-2d1f9e4c3b7a.jpg',
    icon: '🫒',
    aisle: 'Aisle 15', 
    tags: ['oil', 'cooking', 'sunflower'] 
  },
  { 
    id: '8901725181003', 
    name: 'Tata Toor Dal (1kg)', 
    price: 165, 
    category: 'Staples', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/6d4e9c3b-2a8f-4b7e-9c5d-3f1a2e8b4c7d.jpg',
    icon: '🫘',
    aisle: 'Aisle 16', 
    tags: ['dal', 'lentils', 'pulses'] 
  },
  { 
    id: '8901725181004', 
    name: 'Aashirvaad Atta (5kg)', 
    price: 285, 
    category: 'Staples', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/1e7d4c9a-8b3f-4e6c-9a2d-5f8b1c4e7a3b.jpg',
    icon: '🌾',
    aisle: 'Aisle 16', 
    tags: ['atta', 'flour', 'wheat'] 
  },
  { 
    id: '8901725181005', 
    name: 'Saffola Gold Oil (1L)', 
    price: 199, 
    category: 'Staples', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/8e5c3d4a-2b9f-4e7c-9a6d-1f4b8c2e3a7b.jpg',
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
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/4a9d3e8c-7b2f-4e5c-8a6d-2f1b9c4e7a3b.jpg',
    icon: '🌶️',
    aisle: 'Aisle 17', 
    tags: ['masala', 'spices', 'mdh'] 
  },
  { 
    id: '8901042100013', 
    name: 'Everest Turmeric Powder (100g)', 
    price: 55, 
    category: 'Spices', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/6c8d4e2a-9b3f-4e7c-8a5d-3f1b2c4e9a7b.jpg',
    icon: '🟡',
    aisle: 'Aisle 17', 
    tags: ['turmeric', 'haldi', 'spices'] 
  },
  { 
    id: '8901042100014', 
    name: 'Catch Red Chilli Powder (100g)', 
    price: 65, 
    category: 'Spices', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/7d9e4c3a-8b2f-4e6c-9a5d-4f1b3c2e8a7b.jpg',
    icon: '🌶️',
    aisle: 'Aisle 18', 
    tags: ['chilli', 'mirch', 'spices'] 
  },
  { 
    id: '8901042100015', 
    name: 'Tata Salt (1kg)', 
    price: 28, 
    category: 'Spices', 
    image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/app/assets/products/sliding_images/jpeg/9e8d5c4a-2b3f-4e7c-8a6d-5f1b4c3e9a7b.jpg',
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
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1532007045127-32e35a2ddfc4?w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1546470427-227c7369a9a8?w=400&q=80',
    icon: '🍅',
    aisle: 'Aisle 1', 
    tags: ['vegetables', 'tomato', 'fresh'] 
  },
  { 
    id: '8901234560002', 
    name: 'Onion (1kg)', 
    price: 35, 
    category: 'Fresh Produce', 
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80',
    icon: '🧅',
    aisle: 'Aisle 1', 
    tags: ['vegetables', 'onion', 'fresh'] 
  },
  { 
    id: '8901234560003', 
    name: 'Fresh Potatoes (1kg)', 
    price: 40, 
    category: 'Fresh Produce', 
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber6eb6?w=400&q=80',
    icon: '🥔',
    aisle: 'Aisle 1', 
    tags: ['vegetables', 'potato', 'fresh'] 
  },
  { 
    id: '8901234560004', 
    name: 'Fresh Bananas (6 pcs)', 
    price: 45, 
    category: 'Fresh Produce', 
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
    icon: '🍌',
    aisle: 'Aisle 2', 
    tags: ['fruits', 'banana', 'fresh'] 
  },
  { 
    id: '8901234560005', 
    name: 'Shimla Apples (500g)', 
    price: 120, 
    category: 'Fresh Produce', 
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80',
    icon: '🍎',
    aisle: 'Aisle 2', 
    tags: ['fruits', 'apple', 'fresh'] 
  },
  
  // ==================== ADDITIONAL PRODUCTS WITH REAL IMAGES ====================
  { 
    id: '0000000016087', 
    name: 'Mixed Dry Fruits (200g)', 
    price: 299, 
    category: 'Healthy Snacks', 
    image: 'https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=400&q=80',
    icon: '🥜',
    aisle: 'Aisle 6', 
    tags: ['nuts', 'organic', 'healthy', 'snacks'],
    description: 'Premium mixed dry fruits. Perfect for healthy snacking. Contains almonds, cashews, raisins, and pistachios.',
    rating: 4.4,
    reviews: 892
  },
  { 
    id: '0000000016094', 
    name: 'Dalia - Broken Wheat (500g)', 
    price: 65, 
    category: 'Staples', 
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
    icon: '🌾',
    aisle: 'Aisle 16', 
    tags: ['dalia', 'wheat', 'grains'],
    description: 'Premium broken wheat. Great for upma, khichdi and healthy breakfast.',
    rating: 4.2,
    reviews: 456
  },
  { 
    id: '0000000016100', 
    name: 'Kelloggs Muesli Fruit & Nut (500g)', 
    price: 345, 
    category: 'Breakfast', 
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&q=80',
    icon: '🥣',
    aisle: 'Aisle 4', 
    tags: ['muesli', 'breakfast', 'healthy', 'nuts'],
    description: 'Crunchy muesli with fruits and nuts. Perfect with milk or yogurt.',
    rating: 4.6,
    reviews: 1234
  },
  { 
    id: '0000000016117', 
    name: 'Daawat Basmati Rice (1kg)', 
    price: 165, 
    category: 'Staples', 
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    icon: '🍚',
    aisle: 'Aisle 15', 
    tags: ['rice', 'basmati', 'staples'],
    description: 'Premium long grain basmati rice. Aromatic and fluffy.',
    rating: 4.5,
    reviews: 2156
  },
  { 
    id: '0000000016124', 
    name: 'Saffola Oats (1kg)', 
    price: 199, 
    category: 'Breakfast', 
    image: 'https://images.unsplash.com/photo-1614961908988-db0356a3f8d0?w=400&q=80',
    icon: '🥣',
    aisle: 'Aisle 4', 
    tags: ['oats', 'breakfast', 'healthy'],
    description: 'Wholesome rolled oats with fiber and protein. Heart-healthy breakfast.',
    rating: 4.3,
    reviews: 876
  },
  { 
    id: '0000000016193', 
    name: 'Cadbury Bournville Dark Chocolate (80g)', 
    price: 120, 
    category: 'Confectionery', 
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&q=80',
    icon: '🍫',
    aisle: 'Aisle 5', 
    tags: ['chocolate', 'cadbury', 'dark chocolate'],
    description: 'Premium dark chocolate with rich cocoa flavor.',
    rating: 4.7,
    reviews: 3421
  },
  { 
    id: '0000000016513', 
    name: 'Sundrop Heart Sunflower Oil (1L)', 
    price: 145, 
    category: 'Staples', 
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    icon: '🌻',
    aisle: 'Aisle 15', 
    tags: ['oil', 'cooking', 'sunflower'],
    description: 'Heart-healthy sunflower oil. Light and cholesterol-free.',
    rating: 4.4,
    reviews: 1567
  },
  { 
    id: '0000000016612', 
    name: 'Tata Rajma - Red Kidney Beans (500g)', 
    price: 95, 
    category: 'Pulses', 
    image: 'https://images.unsplash.com/photo-1614961909012-276e6d0d8a01?w=400&q=80',
    icon: '🫘',
    aisle: 'Aisle 16', 
    tags: ['rajma', 'beans', 'pulses', 'protein'],
    description: 'Premium Kashmiri rajma. Rich in protein and fiber.',
    rating: 4.2,
    reviews: 432
  },
  { 
    id: '0000000016650', 
    name: 'Del Monte Penne Pasta (500g)', 
    price: 125, 
    category: 'Pasta', 
    image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=400&q=80',
    icon: '🍝',
    aisle: 'Aisle 13', 
    tags: ['pasta', 'penne', 'italian'],
    description: 'Premium durum wheat penne pasta. Cooks to perfect al dente.',
    rating: 4.5,
    reviews: 987
  },
  { 
    id: '0000000018012', 
    name: 'Kelloggs Corn Flakes (475g)', 
    price: 199, 
    category: 'Breakfast', 
    image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=400&q=80',
    icon: '🥣',
    aisle: 'Aisle 4', 
    tags: ['cornflakes', 'kelloggs', 'breakfast'],
    description: 'Crispy golden corn flakes. Classic breakfast cereal.',
    rating: 4.4,
    reviews: 756
  },
  { 
    id: '0000000018050', 
    name: 'Happilo Almonds (200g)', 
    price: 299, 
    category: 'Healthy Snacks', 
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80',
    icon: '🌰',
    aisle: 'Aisle 6', 
    tags: ['almonds', 'nuts', 'healthy'],
    description: 'Premium California almonds. Rich, buttery flavor.',
    rating: 4.6,
    reviews: 645
  },
  { 
    id: '0000000004530', 
    name: 'Banana Chips Sweetened (150g)', 
    price: 85, 
    category: 'Snacks', 
    image: 'https://images.unsplash.com/photo-1622168026561-e8f8c4791ca8?w=400&q=80',
    icon: '🍌',
    aisle: 'Aisle 6', 
    tags: ['banana', 'chips', 'snacks', 'sweet'],
    description: 'Crispy sweetened banana chips. A delicious tropical snack.',
    rating: 4.1,
    reviews: 1234
  },
  { 
    id: '0000000018173', 
    name: 'Kerala Banana Chips (200g)', 
    price: 99, 
    category: 'Snacks', 
    image: 'https://images.unsplash.com/photo-1571953295899-e24ba6fbbe6e?w=400&q=80',
    icon: '🍌',
    aisle: 'Aisle 6', 
    tags: ['banana', 'chips', 'kerala', 'snacks'],
    description: 'Crispy Kerala banana chips. Crunchy and naturally delicious.',
    rating: 4.3,
    reviews: 567
  },
  { 
    id: '0000000018197', 
    name: 'Kohinoor Brown Rice (1kg)', 
    price: 195, 
    category: 'Staples', 
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80',
    icon: '🍚',
    aisle: 'Aisle 15', 
    tags: ['rice', 'brown rice', 'healthy'],
    description: 'Premium brown rice. Nutty flavor and rich in fiber.',
    rating: 4.5,
    reviews: 1089
  },
  { 
    id: '0000000018265', 
    name: 'Nutraj Mixed Nuts (250g)', 
    price: 245, 
    category: 'Healthy Snacks', 
    image: 'https://images.unsplash.com/photo-1551892589-865f69869476?w=400&q=80',
    icon: '⚡',
    aisle: 'Aisle 6', 
    tags: ['energy', 'nuts', 'healthy', 'snacks'],
    description: 'Power-packed mix of almonds, cashews and raisins.',
    rating: 4.5,
    reviews: 876
  },
  { 
    id: '0000000018289', 
    name: 'Cadbury Dairy Milk Fruit & Nut (80g)', 
    price: 99, 
    category: 'Confectionery', 
    image: 'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=400&q=80',
    icon: '🍫',
    aisle: 'Aisle 5', 
    tags: ['chocolate', 'cadbury', 'fruit', 'nuts'],
    description: 'Delicious milk chocolate with raisins and almonds.',
    rating: 4.6,
    reviews: 654
  },
  { 
    id: '0000000018319', 
    name: 'Bagrry\'s Muesli with Almonds (400g)', 
    price: 295, 
    category: 'Breakfast', 
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80',
    icon: '🥣',
    aisle: 'Aisle 4', 
    tags: ['muesli', 'oats', 'almonds', 'breakfast'],
    description: 'Crunchy muesli with oat clusters, almonds and raisins.',
    rating: 4.4,
    reviews: 432
  },
  { 
    id: '0000000018371', 
    name: 'Himalayan Pink Salt (1kg)', 
    price: 199, 
    category: 'Spices', 
    image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&q=80',
    icon: '🧂',
    aisle: 'Aisle 17', 
    tags: ['salt', 'himalayan', 'pink salt', 'spices'],
    description: 'Pure Himalayan pink salt. Contains 84 natural minerals.',
    rating: 4.7,
    reviews: 2345
  },
  { 
    id: '0000000018395', 
    name: 'Happilo Roasted Cashews (200g)', 
    price: 299, 
    category: 'Healthy Snacks', 
    image: 'https://images.unsplash.com/photo-1563292769-4e0d0a8f0e92?w=400&q=80',
    icon: '🥜',
    aisle: 'Aisle 6', 
    tags: ['cashews', 'roasted', 'snacks'],
    description: 'Premium roasted cashews with salt and pepper.',
    rating: 4.5,
    reviews: 567
  },
  { 
    id: '0000000018401', 
    name: 'Haldirams Moong Dal (200g)', 
    price: 55, 
    category: 'Snacks', 
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80',
    icon: '🥜',
    aisle: 'Aisle 6', 
    tags: ['moong dal', 'haldirams', 'namkeen'],
    description: 'Crispy moong dal namkeen. Light and crunchy snack.',
    rating: 4.3,
    reviews: 432
  },
  { 
    id: '0000000018449', 
    name: 'Patanjali Desiccated Coconut (100g)', 
    price: 45, 
    category: 'Baking', 
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    icon: '🥥',
    aisle: 'Aisle 18', 
    tags: ['coconut', 'baking', 'patanjali'],
    description: 'Fine desiccated coconut. Perfect for baking and cooking.',
    rating: 4.4,
    reviews: 654
  },
  { 
    id: '0000000018456', 
    name: 'True Elements Quinoa (500g)', 
    price: 299, 
    category: 'Healthy Grains', 
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    icon: '🌾',
    aisle: 'Aisle 16', 
    tags: ['quinoa', 'healthy', 'superfoods'],
    description: 'Nutritious quinoa. Complete protein with essential amino acids.',
    rating: 4.6,
    reviews: 876
  },
  { 
    id: '0000000018500', 
    name: 'Snickers Chocolate Bar (52g)', 
    price: 50, 
    category: 'Confectionery', 
    image: 'https://images.unsplash.com/photo-1534260164206-2a3a4a72891d?w=400&q=80',
    icon: '🍫',
    aisle: 'Aisle 5', 
    tags: ['chocolate', 'snickers', 'peanuts'],
    description: 'Chocolate bar with peanuts, caramel and nougat.',
    rating: 4.5,
    reviews: 543
  },
  { 
    id: '0000000030038', 
    name: 'Tata Masoor Dal (500g)', 
    price: 85, 
    category: 'Pulses', 
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80',
    icon: '🫘',
    aisle: 'Aisle 16', 
    tags: ['masoor', 'dal', 'lentils', 'pulses'],
    description: 'Premium unpolished masoor dal. Rich in protein and fiber.',
    rating: 4.4,
    reviews: 432
  },
  { 
    id: '0000000030540', 
    name: 'Tata Chana Dal (500g)', 
    price: 75, 
    category: 'Pulses', 
    image: 'https://images.unsplash.com/photo-1515543904323-87f037a9fa7d?w=400&q=80',
    icon: '🫘',
    aisle: 'Aisle 16', 
    tags: ['chana dal', 'pulses'],
    description: 'Premium unpolished chana dal. Perfect for dal and sweets.',
    rating: 4.5,
    reviews: 1234
  },
  { 
    id: '0000000030649', 
    name: 'Tata Moong Dal (500g)', 
    price: 95, 
    category: 'Pulses', 
    image: 'https://images.unsplash.com/photo-1612257416648-ee7a6c533b4f?w=400&q=80',
    icon: '🫘',
    aisle: 'Aisle 16', 
    tags: ['moong dal', 'pulses', 'protein'],
    description: 'Premium unpolished moong dal. Great for khichdi and dal.',
    rating: 4.3,
    reviews: 567
  },
  { 
    id: '0000000032070', 
    name: 'Bambino Vermicelli (400g)', 
    price: 45, 
    category: 'Instant Food', 
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80',
    icon: '🍝',
    aisle: 'Aisle 13', 
    tags: ['vermicelli', 'sewai', 'instant'],
    description: 'Premium roasted vermicelli. Ready to cook upma or kheer.',
    rating: 4.4,
    reviews: 654
  },
  { 
    id: '0000000032858', 
    name: 'Del Monte Spaghetti Pasta (500g)', 
    price: 125, 
    category: 'Pasta', 
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80',
    icon: '🍝',
    aisle: 'Aisle 13', 
    tags: ['spaghetti', 'pasta', 'italian'],
    description: 'Premium durum wheat spaghetti. Restaurant quality.',
    rating: 4.5,
    reviews: 1098
  },
  { 
    id: '0000000033060', 
    name: 'MTR Rava Idli Mix (500g)', 
    price: 125, 
    category: 'Instant Food', 
    image: 'https://images.unsplash.com/photo-1630383249896-483f1997f59b?w=400&q=80',
    icon: '🥣',
    aisle: 'Aisle 13', 
    tags: ['idli', 'rava', 'breakfast', 'mix'],
    description: 'Ready to cook rava idli mix. Soft idlis in minutes!',
    rating: 4.6,
    reviews: 876
  },
  { 
    id: '0000000033084', 
    name: 'Catch Black Salt (200g)', 
    price: 35, 
    category: 'Spices', 
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=400&q=80',
    icon: '🧂',
    aisle: 'Aisle 17', 
    tags: ['salt', 'black salt', 'kala namak', 'spices'],
    description: 'Pure black salt powder. Perfect for chaats and fruits.',
    rating: 4.3,
    reviews: 1543
  },
  { 
    id: '0000000033268', 
    name: 'Tata Sugar (1kg)', 
    price: 50, 
    category: 'Baking', 
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80',
    icon: '🍬',
    aisle: 'Aisle 18', 
    tags: ['sugar', 'tata', 'baking'],
    description: 'Organic cane sugar from fair trade certified farms.',
    rating: 4.4,
    reviews: 987
  },
  { 
    id: '0000000034135', 
    name: 'Happilo Cashews W320 (250g)', 
    price: 375, 
    category: 'Healthy Snacks', 
    image: 'https://images.unsplash.com/photo-1563292769-4e0d0a8f0e92?w=400&q=80',
    icon: '🥜',
    aisle: 'Aisle 6', 
    tags: ['cashews', 'raw', 'nuts'],
    description: 'Premium whole cashews. Raw and naturally tasty.',
    rating: 4.7,
    reviews: 1234
  },
  { 
    id: '0000000034548', 
    name: 'Nutraj Walnuts (200g)', 
    price: 345, 
    category: 'Healthy Snacks', 
    image: 'https://images.unsplash.com/photo-1563412885-139e4ddb6e5c?w=400&q=80',
    icon: '🥜',
    aisle: 'Aisle 6', 
    tags: ['walnuts', 'raw', 'nuts'],
    description: 'Premium raw walnuts. Rich in omega-3 fatty acids.',
    rating: 4.6,
    reviews: 876
  },
  { 
    id: '0000000034623', 
    name: 'Happilo Trail Mix (300g)', 
    price: 285, 
    category: 'Healthy Snacks', 
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&q=80',
    icon: '🥜',
    aisle: 'Aisle 6', 
    tags: ['trail mix', 'nuts', 'dried fruits'],
    description: 'Classic trail mix with nuts, seeds, and dried fruits.',
    rating: 4.5,
    reviews: 1087
  },
  { 
    id: '0000000034791', 
    name: 'True Elements Pumpkin Seeds (150g)', 
    price: 195, 
    category: 'Healthy Snacks', 
    image: 'https://images.unsplash.com/photo-1509402308-5ed76c2e8b94?w=400&q=80',
    icon: '🎃',
    aisle: 'Aisle 6', 
    tags: ['pumpkin seeds', 'seeds'],
    description: 'Raw pumpkin seeds. High in zinc and magnesium.',
    rating: 4.4,
    reviews: 654
  },
  { 
    id: '0000000035071', 
    name: 'Borges Extra Virgin Olive Oil (500ml)', 
    price: 495, 
    category: 'Staples', 
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    icon: '🫒',
    aisle: 'Aisle 15', 
    tags: ['olive oil', 'extra virgin', 'cooking'],
    description: 'Premium cold-pressed extra virgin olive oil from Spain.',
    rating: 4.8,
    reviews: 2345
  },
  { 
    id: '0000000035170', 
    name: 'Ching\'s Soy Sauce (200ml)', 
    price: 55, 
    category: 'Condiments', 
    image: 'https://images.unsplash.com/photo-1590794802021-5ac7e303f7f2?w=400&q=80',
    icon: '🥢',
    aisle: 'Aisle 18', 
    tags: ['soy sauce', 'chings', 'condiment'],
    description: 'Premium dark soy sauce. Perfect for Indo-Chinese dishes.',
    rating: 4.5,
    reviews: 1543
  },
  { 
    id: '0000000018944', 
    name: 'True Elements Chia Seeds (250g)', 
    price: 225, 
    category: 'Superfoods', 
    image: 'https://images.unsplash.com/photo-1541990193336-f41cc39c7f82?w=400&q=80',
    icon: '🌱',
    aisle: 'Aisle 6', 
    tags: ['chia seeds', 'superfoods', 'seeds'],
    description: 'Nutrient-dense chia seeds. High in fiber and omega-3.',
    rating: 4.7,
    reviews: 1876
  },
  { 
    id: '0000000016933', 
    name: 'True Elements Flax Seeds (250g)', 
    price: 165, 
    category: 'Superfoods', 
    image: 'https://images.unsplash.com/photo-1622733838040-c7b9d96e7f55?w=400&q=80',
    icon: '🌾',
    aisle: 'Aisle 6', 
    tags: ['flax seeds', 'superfoods', 'omega-3'],
    description: 'Golden flax seeds. Rich in lignans and omega-3 fatty acids.',
    rating: 4.5,
    reviews: 987
  },
  { 
    id: '0000000034562', 
    name: 'True Elements Sunflower Seeds (150g)', 
    price: 125, 
    category: 'Healthy Snacks', 
    image: 'https://images.unsplash.com/photo-1564894809611-1742fc40ed80?w=400&q=80',
    icon: '🌻',
    aisle: 'Aisle 6', 
    tags: ['sunflower seeds', 'raw', 'seeds'],
    description: 'Raw sunflower seeds. Great source of Vitamin E.',
    rating: 4.3,
    reviews: 654
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
