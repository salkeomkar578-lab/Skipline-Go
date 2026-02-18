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
    image: 'https://www.bigbasket.com/media/uploads/p/l/241600_14-amul-gold-milk.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/126906_12-amul-butter.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40154714_8-mother-dairy-dahi.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40019621_8-amul-cheese-slices.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/266109_22-maggi-2-minute-instant-noodles-masala.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/271375_8-sunfeast-yippee-noodles-magic-masala.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/266199_12-top-ramen-noodles-curry.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/266424_21-tata-tea-gold.jpg',
    icon: '🍵',
    aisle: 'Aisle 7', 
    tags: ['tea', 'beverages', 'tata'] 
  },
  { 
    id: '8901491101832', 
    name: 'Nescafe Classic Coffee (100g)', 
    price: 285, 
    category: 'Beverages', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/265944_15-nescafe-classic-100-pure-instant-coffee.jpg',
    icon: '☕',
    aisle: 'Aisle 7', 
    tags: ['coffee', 'nescafe', 'beverages'] 
  },
  { 
    id: '8901491101833', 
    name: 'Real Fruit Power Mixed Fruit (1L)', 
    price: 99, 
    category: 'Beverages', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/265404_10-real-fruit-power-juice-mixed-fruit.jpg',
    icon: '🧃',
    aisle: 'Aisle 8', 
    tags: ['juice', 'fruit', 'real'] 
  },
  { 
    id: '8901491101834', 
    name: 'Coca Cola (750ml)', 
    price: 40, 
    category: 'Beverages', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/251006_15-coca-cola-soft-drink.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/266443_18-parle-g-gold-biscuits.jpg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['biscuits', 'parle', 'snacks'] 
  },
  { 
    id: '8901063142104', 
    name: 'Britannia Good Day Cashew', 
    price: 55, 
    category: 'Biscuits', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/241007_19-britannia-good-day-cookies-cashew.jpg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['biscuits', 'britannia', 'cookies'] 
  },
  { 
    id: '8901063142105', 
    name: 'Lays Classic Salted (52g)', 
    price: 20, 
    category: 'Snacks', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/241014_10-lay-s-potato-chips-classic-salted.jpg',
    icon: '🥔',
    aisle: 'Aisle 6', 
    tags: ['chips', 'lays', 'snacks'] 
  },
  { 
    id: '8901063142106', 
    name: 'Kurkure Masala Munch (90g)', 
    price: 25, 
    category: 'Snacks', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/266040_16-kurkure-namkeen-masala-munch.jpg',
    icon: '🍟',
    aisle: 'Aisle 6', 
    tags: ['kurkure', 'snacks', 'namkeen'] 
  },
  { 
    id: '8901063142107', 
    name: 'Haldirams Aloo Bhujia (200g)', 
    price: 65, 
    category: 'Snacks', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/265092_12-haldirams-namkeen-aloo-bhujia.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40015107_8-dettol-bathing-bar-soap-original.jpg',
    icon: '🧼',
    aisle: 'Aisle 9', 
    tags: ['soap', 'dettol', 'hygiene'] 
  },
  { 
    id: '8901207040417', 
    name: 'Colgate MaxFresh Blue (150g)', 
    price: 95, 
    category: 'Personal Care', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/265553_17-colgate-maxfresh-toothpaste-blue-peppermint-ice.jpg',
    icon: '🦷',
    aisle: 'Aisle 9', 
    tags: ['toothpaste', 'colgate', 'dental'] 
  },
  { 
    id: '8901207040418', 
    name: 'Head & Shoulders Shampoo (180ml)', 
    price: 199, 
    category: 'Personal Care', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/40068684_14-head-shoulders-anti-dandruff-shampoo-smooth-silky.jpg',
    icon: '🧴',
    aisle: 'Aisle 10', 
    tags: ['shampoo', 'haircare', 'dandruff'] 
  },
  { 
    id: '8901207040419', 
    name: 'Dove Soap (100g x 3)', 
    price: 175, 
    category: 'Personal Care', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/40015116_17-dove-cream-beauty-bathing-bar.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40019974_8-india-gate-basmati-rice-super.jpg',
    icon: '🍚',
    aisle: 'Aisle 15', 
    tags: ['rice', 'basmati', 'staples'] 
  },
  { 
    id: '8901725181002', 
    name: 'Fortune Sunflower Oil (1L)', 
    price: 155, 
    category: 'Staples', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/10002975_14-fortune-sunlite-refined-sunflower-oil.jpg',
    icon: '🫒',
    aisle: 'Aisle 15', 
    tags: ['oil', 'cooking', 'sunflower'] 
  },
  { 
    id: '8901725181003', 
    name: 'Tata Toor Dal (1kg)', 
    price: 165, 
    category: 'Staples', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000459_15-tata-sampann-unpolished-toor-dalarhar-dal.jpg',
    icon: '🫘',
    aisle: 'Aisle 16', 
    tags: ['dal', 'lentils', 'pulses'] 
  },
  { 
    id: '8901725181004', 
    name: 'Aashirvaad Atta (5kg)', 
    price: 285, 
    category: 'Staples', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000203_20-aashirvaad-atta-whole-wheat.jpg',
    icon: '🌾',
    aisle: 'Aisle 16', 
    tags: ['atta', 'flour', 'wheat'] 
  },
  { 
    id: '8901725181005', 
    name: 'Saffola Gold Oil (1L)', 
    price: 199, 
    category: 'Staples', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/147489_16-saffola-gold-pro-healthy-lifestyle-ricebran-based-blended-oil.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000070_17-mdh-masala-garam.jpg',
    icon: '🌶️',
    aisle: 'Aisle 17', 
    tags: ['masala', 'spices', 'mdh'] 
  },
  { 
    id: '8901042100013', 
    name: 'Everest Turmeric Powder (100g)', 
    price: 55, 
    category: 'Spices', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000255_19-everest-powder-turmeric.jpg',
    icon: '🟡',
    aisle: 'Aisle 17', 
    tags: ['turmeric', 'haldi', 'spices'] 
  },
  { 
    id: '8901042100014', 
    name: 'Catch Red Chilli Powder (100g)', 
    price: 65, 
    category: 'Spices', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/40000148_17-catch-red-chilli-powder.jpg',
    icon: '🌶️',
    aisle: 'Aisle 18', 
    tags: ['chilli', 'mirch', 'spices'] 
  },
  { 
    id: '8901042100015', 
    name: 'Tata Salt (1kg)', 
    price: 28, 
    category: 'Spices', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/251788_14-tata-salt-iodized.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40248078_1-boat-rockerz-510-bluetooth-headphone-with-thumping-bass-up-to-10h-playtime-dual-connectivity-modes-black.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40151361_3-syska-led-bulb-base-b22-9w-cool-day-light.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000204_15-fresho-tomato-hybrid.jpg',
    icon: '🍅',
    aisle: 'Aisle 1', 
    tags: ['vegetables', 'tomato', 'fresh'] 
  },
  { 
    id: '8901234560002', 
    name: 'Onion (1kg)', 
    price: 35, 
    category: 'Fresh Produce', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000148_16-fresho-onion.jpg',
    icon: '🧅',
    aisle: 'Aisle 1', 
    tags: ['vegetables', 'onion', 'fresh'] 
  },
  { 
    id: '8901234560003', 
    name: 'Fresh Potatoes (1kg)', 
    price: 40, 
    category: 'Fresh Produce', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000159_15-fresho-potato.jpg',
    icon: '🥔',
    aisle: 'Aisle 1', 
    tags: ['vegetables', 'potato', 'fresh'] 
  },
  { 
    id: '8901234560004', 
    name: 'Fresh Bananas (6 pcs)', 
    price: 45, 
    category: 'Fresh Produce', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000026_13-fresho-banana-robusta.jpg',
    icon: '🍌',
    aisle: 'Aisle 2', 
    tags: ['fruits', 'banana', 'fresh'] 
  },
  { 
    id: '8901234560005', 
    name: 'Shimla Apples (500g)', 
    price: 120, 
    category: 'Fresh Produce', 
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000023_16-fresho-apple-shimla.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40022163_7-bb-royal-dry-fruits-combo-pack.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40019037_5-bb-royal-dalia-broken-wheat.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40020081_12-kelloggs-muesli-crunchy-fruit-nut.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40019981_9-daawat-rozana-basmati-rice-super.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40018962_11-saffola-oats-with-fibre-protein.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/290566_7-cadbury-bournville-rich-cocoa-dark-chocolate.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/126962_7-sundrop-heart-sunflower-oil.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000457_15-tata-sampann-rajma-kashmiri-unpolished.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40018576_7-del-monte-penne-rigate-pasta.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/126064_9-kelloggs-corn-flakes-original.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40022183_9-happilo-100-natural-premium-californian-almonds.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40017654_5-bb-royal-banana-chips.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40017657_6-bb-royal-kerala-banana-chips-salted.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40019985_8-kohinoor-charminar-rice-brown.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40087933_9-nutraj-super-saver-pack-almonds-cashews-raisins.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/266110_8-cadbury-dairy-milk-fruit-nut-chocolate.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/276605_10-bagrrys-crunchy-muesli-crunchy-oat-clusters-with-almonds-raisins-honey.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40022151_9-bb-royal-himalayan-pink-salt.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40022185_10-happilo-premium-roasted-cashews-pepper-salt.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/265093_13-haldirams-namkeen-moong-dal.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40021282_4-patanjali-desiccated-coconut-powder.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40018921_10-true-elements-quinoa.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/265589_8-snickers-peanut-filled-chocolate-bar.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000458_15-tata-sampann-unpolished-masoor-dal.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000460_14-tata-sampann-unpolished-chana-dal.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/244476_13-tata-sampann-unpolished-moong-dal.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/241591_12-bambino-vermicelli.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40018574_7-del-monte-spaghetti-pasta.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40018451_7-mtr-breakfast-mix-rava-idli.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40000298_12-catch-black-salt-powder.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/302163_11-tata-sugar-sulphur-free.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40022184_9-happilo-100-natural-premium-whole-cashews.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40095308_8-nutraj-walnuts-halves.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40120285_4-happilo-premium-dry-fruit-trail-mix-super-saver-combo.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40102148_7-true-elements-raw-pumpkin-seeds.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40002044_15-borges-extra-virgin-olive-oil.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/284059_8-chings-secret-dark-soy-sauce.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40099903_6-true-elements-raw-chia-seeds.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40099902_8-true-elements-raw-flax-seeds.jpg',
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
    image: 'https://www.bigbasket.com/media/uploads/p/l/40102147_6-true-elements-raw-sunflower-seeds.jpg',
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
