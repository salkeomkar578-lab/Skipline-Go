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
  
  // ==================== DAIRY PRODUCTS (Aisle 3) ====================
  { 
    id: 'DAIRY001', 
    name: 'Amul Taaza Toned Milk (500ml)', 
    price: 28, 
    mrp: 30,
    discount: 7,
    category: 'Dairy', 
    image: '/products/amul-milk.jpeg',
    icon: '🥛',
    aisle: 'Aisle 3', 
    tags: ['milk', 'amul', 'dairy', 'toned milk'],
    description: 'Amul Taaza Toned Milk - Fresh pasteurized toned milk. Perfect for daily consumption, tea, and coffee.',
    rating: 4.5,
    reviews: 8976
  },
  { 
    id: 'DAIRY002', 
    name: 'Amul Butter (100g)', 
    price: 52, 
    mrp: 57,
    discount: 9,
    category: 'Dairy', 
    image: '/products/amul-batter.jpeg',
    icon: '🧈',
    aisle: 'Aisle 3', 
    tags: ['butter', 'amul', 'dairy', 'spread'],
    description: 'Amul Butter - Utterly Butterly Delicious! India\'s favorite butter for parathas and bread.',
    rating: 4.8,
    reviews: 15678
  },
  { 
    id: 'DAIRY003', 
    name: 'Amul Fresh Curd (400g)', 
    price: 38, 
    mrp: 42,
    discount: 10,
    category: 'Dairy', 
    image: '/products/amul-curd.jpeg',
    icon: '🥣',
    aisle: 'Aisle 3', 
    tags: ['curd', 'amul', 'dairy', 'dahi', 'yogurt'],
    description: 'Amul Fresh Dahi - Thick, creamy curd with live active cultures. Great for raita and lassi.',
    rating: 4.4,
    reviews: 5678
  },
  { 
    id: 'DAIRY004', 
    name: 'Amul Masti Dahi (400g)', 
    price: 36, 
    mrp: 40,
    discount: 10,
    category: 'Dairy', 
    image: '/products/amul-dahi.jpeg',
    icon: '🥣',
    aisle: 'Aisle 3', 
    tags: ['misti dahi', 'amul', 'dairy', 'sweet curd'],
    description: 'Amul Masti Dahi - Thick, creamy and delicious dahi. Perfect after meals.',
    rating: 4.4,
    reviews: 2890
  },
  { 
    id: 'DAIRY005', 
    name: 'Amul Processed Cheese (200g)', 
    price: 95, 
    mrp: 105,
    discount: 10,
    category: 'Dairy', 
    image: '/products/amul-cheese.jpeg',
    icon: '🧀',
    aisle: 'Aisle 3', 
    tags: ['cheese', 'amul', 'dairy', 'processed cheese'],
    description: 'Amul Processed Cheese Block - Smooth, creamy cheese. Perfect for sandwiches and cooking.',
    rating: 4.5,
    reviews: 6543
  },
  { 
    id: 'DAIRY006', 
    name: 'Amul Fresh Paneer (200g)', 
    price: 90, 
    mrp: 100,
    discount: 10,
    category: 'Dairy', 
    image: '/products/amul-paneer.jpeg',
    icon: '🧀',
    aisle: 'Aisle 3', 
    tags: ['paneer', 'amul', 'dairy', 'cottage cheese', 'protein'],
    description: 'Amul Fresh Paneer - Soft, fresh cottage cheese. Perfect for curries, tikka, and Indian dishes.',
    rating: 4.5,
    reviews: 4567
  },
  { 
    id: 'DAIRY007', 
    name: 'Patanjali Cow Ghee (500ml)', 
    price: 499, 
    mrp: 560,
    discount: 11,
    category: 'Dairy', 
    image: '/products/pantanjali-cow-ghee.jpeg',
    icon: '🥛',
    aisle: 'Aisle 3', 
    tags: ['ghee', 'patanjali', 'cow ghee', 'desi ghee', 'cooking'],
    description: 'Patanjali Cow Ghee - Pure desi cow ghee. Rich in nutrients. Traditional bilona method.',
    rating: 4.6,
    reviews: 8765
  },
  { 
    id: 'DAIRY008', 
    name: 'Amul Shrikhand Kesar (250g)', 
    price: 75, 
    mrp: 85,
    discount: 12,
    category: 'Dairy', 
    image: '/products/amul-shrikahand.jpeg',
    icon: '🍮',
    aisle: 'Aisle 3', 
    tags: ['shrikhand', 'amul', 'dairy', 'kesar', 'saffron', 'dessert'],
    description: 'Amul Shrikhand Kesar - Traditional Indian sweet made from strained yogurt with saffron.',
    rating: 4.7,
    reviews: 3456
  },
  { 
    id: 'DAIRY009', 
    name: 'Amul Amrakhand (250g)', 
    price: 85, 
    mrp: 95,
    discount: 10,
    category: 'Dairy', 
    image: '/products/amul-amarkhantd.jpeg',
    icon: '🥭',
    aisle: 'Aisle 3', 
    tags: ['amrakhand', 'amul', 'dairy', 'mango', 'dessert', 'shrikhand'],
    description: 'Amul Amrakhand - Delicious mango flavored shrikhand. Rich, creamy with authentic mango taste.',
    rating: 4.6,
    reviews: 2341
  },

  // ==================== BEVERAGES (Aisle 7-8) ====================
  { 
    id: 'BEV001', 
    name: 'Brooke Bond Red Label Tea (500g)', 
    price: 215, 
    mrp: 235,
    discount: 9,
    category: 'Beverages', 
    image: '/products/red-label.jpeg',
    icon: '🍵',
    aisle: 'Aisle 7', 
    tags: ['tea', 'red label', 'brooke bond', 'chai', 'beverages'],
    description: 'Brooke Bond Red Label - Rich, aromatic blend for the perfect Indian chai. Natural care with vitamins.',
    rating: 4.6,
    reviews: 9876
  },
  { 
    id: 'BEV002', 
    name: 'Nescafe Classic Coffee (100g)', 
    price: 255, 
    mrp: 285,
    discount: 11,
    category: 'Beverages', 
    image: '/products/nescafe-classic.jpeg',
    icon: '☕',
    aisle: 'Aisle 7', 
    tags: ['coffee', 'nescafe', 'instant coffee', 'beverages'],
    description: 'Nescafe Classic - It all starts with a Nescafe! Rich aroma and bold taste.',
    rating: 4.5,
    reviews: 11234
  },
  { 
    id: 'BEV003', 
    name: 'Rasna Orange (500g)', 
    price: 110, 
    mrp: 125,
    discount: 12,
    category: 'Beverages', 
    image: '/products/rasna.jpeg',
    icon: '🍊',
    aisle: 'Aisle 8', 
    tags: ['rasna', 'orange', 'drink mix', 'beverages', 'instant'],
    description: 'Rasna Orange - I Love You Rasna! Makes 32 glasses. Instant refreshing orange drink mix.',
    rating: 4.4,
    reviews: 6543
  },
  { 
    id: 'BEV004', 
    name: 'Fanta Orange', 
    price: 20, 
    mrp: 20,
    discount: 0,
    category: 'Beverages', 
    image: '/products/fanta.jpeg',
    icon: '🍊',
    aisle: 'Aisle 8', 
    tags: ['fanta', 'orange', 'soft drink', 'beverages'],
    description: 'Fanta Orange - Refreshing orange flavored carbonated drink. Bright, bubbly and fun!',
    rating: 4.3,
    reviews: 4532,
    variants: [
      { id: 'small', name: 'Small (250ml)', price: 20 },
      { id: 'large', name: 'Large (750ml)', price: 40 }
    ]
  },
  { 
    id: 'BEV005', 
    name: 'Fanta Orange (750ml)', 
    price: 40, 
    mrp: 42,
    discount: 5,
    category: 'Beverages', 
    image: '/products/fanta-large.jpeg',
    icon: '🍊',
    aisle: 'Aisle 8', 
    tags: ['fanta', 'orange', 'soft drink', 'beverages', 'large'],
    description: 'Fanta Orange Large - More orange fun! Family size refreshing carbonated drink.',
    rating: 4.3,
    reviews: 3421
  },
  { 
    id: 'BEV006', 
    name: 'Pepsi', 
    price: 20, 
    mrp: 20,
    discount: 0,
    category: 'Beverages', 
    image: '/products/pepshi.jpeg',
    icon: '🥤',
    aisle: 'Aisle 8', 
    tags: ['pepsi', 'cola', 'soft drink', 'beverages'],
    description: 'Pepsi - The choice of a new generation! Bold cola taste.',
    rating: 4.4,
    reviews: 8765,
    variants: [
      { id: 'small', name: 'Small (250ml)', price: 20 },
      { id: 'large', name: 'Large (750ml)', price: 40 }
    ]
  },
  { 
    id: 'BEV007', 
    name: 'Pepsi (750ml)', 
    price: 40, 
    mrp: 42,
    discount: 5,
    category: 'Beverages', 
    image: '/products/pepshi-large.jpeg',
    icon: '🥤',
    aisle: 'Aisle 8', 
    tags: ['pepsi', 'cola', 'soft drink', 'beverages', 'large'],
    description: 'Pepsi Large - Bold cola taste in family size bottle.',
    rating: 4.4,
    reviews: 6543
  },
  { 
    id: 'BEV008', 
    name: 'Thums Up (750ml)', 
    price: 40, 
    mrp: 42,
    discount: 5,
    category: 'Beverages', 
    image: '/products/thuns-up.jpeg',
    icon: '👍',
    aisle: 'Aisle 8', 
    tags: ['thums up', 'cola', 'soft drink', 'beverages', 'strong'],
    description: 'Thums Up - Taste The Thunder! India\'s most loved strong cola drink.',
    rating: 4.6,
    reviews: 12543
  },
  { 
    id: 'BEV009', 
    name: 'Sprite', 
    price: 20, 
    mrp: 20,
    discount: 0,
    category: 'Beverages', 
    image: '/products/sprite.jpeg',
    icon: '🍋',
    aisle: 'Aisle 8', 
    tags: ['sprite', 'lemon', 'lime', 'soft drink', 'beverages'],
    description: 'Sprite - Clear, crisp, refreshing lemon-lime taste. Seedhi Baat, No Bakwaas!',
    rating: 4.5,
    reviews: 7654,
    variants: [
      { id: 'small', name: 'Small (250ml)', price: 20 },
      { id: 'large', name: 'Large (750ml)', price: 40 }
    ]
  },
  { 
    id: 'BEV010', 
    name: 'Sprite (750ml)', 
    price: 40, 
    mrp: 42,
    discount: 5,
    category: 'Beverages', 
    image: '/products/sprite-large.jpeg',
    icon: '🍋',
    aisle: 'Aisle 8', 
    tags: ['sprite', 'lemon', 'lime', 'soft drink', 'beverages', 'large'],
    description: 'Sprite Large - Family size lemon-lime refreshment.',
    rating: 4.5,
    reviews: 5432
  },
  { 
    id: 'BEV011', 
    name: 'Coca-Cola (750ml)', 
    price: 40, 
    mrp: 42,
    discount: 5,
    category: 'Beverages', 
    image: '/products/coca-cola.jpeg',
    icon: '🥤',
    aisle: 'Aisle 8', 
    tags: ['coca cola', 'coke', 'soft drink', 'beverages'],
    description: 'Coca-Cola - Open Happiness! The original and timeless cola taste.',
    rating: 4.7,
    reviews: 15678
  },
  { 
    id: 'BEV012', 
    name: 'Complan Nutrition Drink (500g)', 
    price: 340, 
    mrp: 375,
    discount: 9,
    category: 'Beverages', 
    image: '/products/Complain.jpeg',
    icon: '💪',
    aisle: 'Aisle 7', 
    tags: ['complan', 'nutrition', 'health drink', 'kids', 'protein'],
    description: 'Complan - Complete Planned Food. 34 vital nutrients for growing children.',
    rating: 4.3,
    reviews: 5678,
    flavors: ['Chocolate', 'Vanilla', 'Kesar Badam', 'Pista Badam']
  },

  // ==================== BISCUITS (Aisle 5) ====================
  { 
    id: 'BIS001', 
    name: 'Parle-G Original (250g)', 
    price: 22, 
    mrp: 25,
    discount: 12,
    category: 'Biscuits', 
    image: '/products/parle-g.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['parle g', 'biscuits', 'glucose', 'tea time', 'classic'],
    description: 'Parle-G - G for Genius! India\'s most loved glucose biscuit since 1939.',
    rating: 4.7,
    reviews: 25678
  },
  { 
    id: 'BIS002', 
    name: 'Britannia Good Day Butter (75g)', 
    price: 25, 
    mrp: 28,
    discount: 11,
    category: 'Biscuits', 
    image: '/products/good-day.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['good day', 'britannia', 'biscuits', 'butter', 'cookies'],
    description: 'Britannia Good Day Butter - Rich, buttery cookies that make everyday a Good Day!',
    rating: 4.5,
    reviews: 8765
  },
  { 
    id: 'BIS003', 
    name: 'Sunfeast Bounce Cream Biscuit', 
    price: 10, 
    mrp: 10,
    discount: 0,
    category: 'Biscuits', 
    image: '/products/Bounce-Medium.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['bounce', 'sunfeast', 'cream', 'biscuits'],
    description: 'Sunfeast Bounce - Cream filled biscuits. Perfect tea-time snack with delicious filling.',
    rating: 4.2,
    reviews: 3456,
    flavors: ['Chocolate', 'Elaichi', 'Orange', 'Pineapple']
  },
  { 
    id: 'BIS004', 
    name: 'Britannia Bourbon', 
    price: 20, 
    mrp: 22,
    discount: 9,
    category: 'Biscuits', 
    image: '/products/Bourban-Medium.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['bourbon', 'britannia', 'chocolate', 'cream', 'biscuits'],
    description: 'Britannia Bourbon - Classic chocolate cream biscuits. Irresistible chocolate flavor.',
    rating: 4.5,
    reviews: 7654,
    variants: [
      { id: 'medium', name: 'Medium', price: 20 },
      { id: 'large', name: 'Large', price: 40 }
    ]
  },
  { 
    id: 'BIS005', 
    name: 'Britannia Bourbon Large', 
    price: 40, 
    mrp: 45,
    discount: 11,
    category: 'Biscuits', 
    image: '/products/BOURBON-Large.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['bourbon', 'britannia', 'chocolate', 'cream', 'biscuits', 'large'],
    description: 'Britannia Bourbon Large - Family pack of classic chocolate cream biscuits.',
    rating: 4.5,
    reviews: 5432
  },
  { 
    id: 'BIS006', 
    name: 'Sunfeast Dark Fantasy Choco Fills', 
    price: 35, 
    mrp: 40,
    discount: 13,
    category: 'Biscuits', 
    image: '/products/Dark-Fantasy.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['dark fantasy', 'sunfeast', 'chocolate', 'premium', 'choco fills'],
    description: 'Sunfeast Dark Fantasy - Premium chocolate filled cookies. Rich, indulgent experience.',
    rating: 4.7,
    reviews: 9876
  },
  { 
    id: 'BIS007', 
    name: 'Parle Hide & Seek', 
    price: 30, 
    mrp: 35,
    discount: 14,
    category: 'Biscuits', 
    image: '/products/Hide-and-Seek.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['hide and seek', 'parle', 'chocolate chips', 'biscuits'],
    description: 'Parle Hide & Seek - Biscuits loaded with real chocolate chips in every bite.',
    rating: 4.6,
    reviews: 8765
  },
  { 
    id: 'BIS008', 
    name: 'Parle Hide & Seek Milano', 
    price: 40, 
    mrp: 45,
    discount: 11,
    category: 'Biscuits', 
    image: '/products/Hide-and-Seek-MILANO.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['hide and seek', 'milano', 'parle', 'premium', 'chocolate'],
    description: 'Parle Hide & Seek Milano - Premium center-filled chocolate cookies.',
    rating: 4.7,
    reviews: 6543
  },
  { 
    id: 'BIS009', 
    name: 'Britannia Jim Jam', 
    price: 10, 
    mrp: 10,
    discount: 0,
    category: 'Biscuits', 
    image: '/products/Jim-Jam.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['jim jam', 'britannia', 'cream', 'biscuits'],
    description: 'Britannia Jim Jam - Biscuits with yummy cream filling. Kids\' favorite!',
    rating: 4.3,
    reviews: 4521,
    variants: [
      { id: 'regular', name: 'Regular', price: 10 },
      { id: 'large', name: 'Large', price: 25 }
    ]
  },
  { 
    id: 'BIS010', 
    name: 'Britannia Jim Jam Large', 
    price: 25, 
    mrp: 28,
    discount: 11,
    category: 'Biscuits', 
    image: '/products/Jim-Jam-Large.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['jim jam', 'britannia', 'cream', 'biscuits', 'large'],
    description: 'Britannia Jim Jam Large - Family size pack with yummy cream filling.',
    rating: 4.3,
    reviews: 3456
  },
  { 
    id: 'BIS011', 
    name: 'Parle Krack Jack', 
    price: 20, 
    mrp: 22,
    discount: 9,
    category: 'Biscuits', 
    image: '/products/Krack-Jack-Medium.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['krack jack', 'parle', 'sweet and salty', 'biscuits'],
    description: 'Parle Krack Jack - Sweet & salty biscuits with unique taste. Perfect snack anytime.',
    rating: 4.2,
    reviews: 6234
  },
  { 
    id: 'BIS012', 
    name: 'Parle Monaco', 
    price: 20, 
    mrp: 22,
    discount: 9,
    category: 'Biscuits', 
    image: '/products/MONACO.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['monaco', 'parle', 'salty', 'crispy', 'biscuits'],
    description: 'Parle Monaco - Salted crispy biscuits. Light, crunchy, and irresistible!',
    rating: 4.4,
    reviews: 5678
  },
  { 
    id: 'BIS013', 
    name: 'Cadbury Oreo', 
    price: 10, 
    mrp: 10,
    discount: 0,
    category: 'Biscuits', 
    image: '/products/Oreo.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['oreo', 'cadbury', 'chocolate', 'cream', 'biscuits'],
    description: 'Cadbury Oreo - America\'s favorite cookie! Chocolate sandwich with vanilla cream.',
    rating: 4.8,
    reviews: 12543,
    variants: [
      { id: 'regular', name: 'Regular', price: 10 },
      { id: 'large', name: 'Large', price: 30 }
    ]
  },
  { 
    id: 'BIS014', 
    name: 'Cadbury Oreo Large', 
    price: 30, 
    mrp: 35,
    discount: 14,
    category: 'Biscuits', 
    image: '/products/Oreo-Large.jpeg',
    icon: '🍪',
    aisle: 'Aisle 5', 
    tags: ['oreo', 'cadbury', 'chocolate', 'cream', 'biscuits', 'large'],
    description: 'Cadbury Oreo Large - Family pack of America\'s favorite cookie!',
    rating: 4.8,
    reviews: 9876
  },

  // ==================== SNACKS & NAMKEEN (Aisle 6) ====================
  { 
    id: 'SNK001', 
    name: 'Haldiram\'s Aloo Bhujia (200g)', 
    price: 55, 
    mrp: 60,
    discount: 8,
    category: 'Snacks', 
    image: '/products/haldirams-aloo-bujia.jpeg',
    icon: '🥔',
    aisle: 'Aisle 6', 
    tags: ['aloo bhujia', 'haldirams', 'namkeen', 'snacks', 'crispy'],
    description: 'Haldiram\'s Aloo Bhujia - Crispy potato-based namkeen. Perfect tea-time snack!',
    rating: 4.5,
    reviews: 7654
  },
  { 
    id: 'SNK002', 
    name: 'Haldiram\'s Banana Chips (150g)', 
    price: 50, 
    mrp: 55,
    discount: 9,
    category: 'Snacks', 
    image: '/products/haldirams-banana-chips.jpeg',
    icon: '🍌',
    aisle: 'Aisle 6', 
    tags: ['banana chips', 'haldirams', 'snacks', 'crispy', 'salted'],
    description: 'Haldiram\'s Banana Chips - Crispy, salted banana chips. Light and crunchy snack.',
    rating: 4.3,
    reviews: 3456
  },
  { 
    id: 'SNK003', 
    name: 'Kerala Banana Chips (200g)', 
    price: 85, 
    mrp: 95,
    discount: 11,
    category: 'Snacks', 
    image: '/products/kerala-banana-chips.jpeg',
    icon: '🍌',
    aisle: 'Aisle 6', 
    tags: ['banana chips', 'kerala', 'traditional', 'coconut oil', 'snacks'],
    description: 'Kerala Banana Chips - Traditional Kerala style chips fried in coconut oil. Authentic taste!',
    rating: 4.4,
    reviews: 4567
  },
  { 
    id: 'SNK004', 
    name: 'Haldiram\'s Moong Dal (200g)', 
    price: 55, 
    mrp: 60,
    discount: 8,
    category: 'Snacks', 
    image: '/products/haldirams-mong-dal.jpeg',
    icon: '🥜',
    aisle: 'Aisle 6', 
    tags: ['moong dal', 'haldirams', 'namkeen', 'snacks', 'crispy'],
    description: 'Haldiram\'s Moong Dal - Crispy fried moong dal namkeen. Light and tasty snack.',
    rating: 4.3,
    reviews: 5432
  },
  { 
    id: 'SNK005', 
    name: 'Haldiram\'s Soya Sticks (200g)', 
    price: 45, 
    mrp: 50,
    discount: 10,
    category: 'Snacks', 
    image: '/products/haldirams-soya-sticks.jpeg',
    icon: '🥢',
    aisle: 'Aisle 6', 
    tags: ['soya sticks', 'haldirams', 'healthy', 'protein', 'snacks'],
    description: 'Haldiram\'s Soya Sticks - Healthy and crunchy soya-based snack. High in protein.',
    rating: 4.2,
    reviews: 2345
  },
  { 
    id: 'SNK006', 
    name: 'Kurkure Masala Munch', 
    price: 10, 
    mrp: 10,
    discount: 0,
    category: 'Snacks', 
    image: '/products/kurkure.jpeg',
    icon: '🌶️',
    aisle: 'Aisle 6', 
    tags: ['kurkure', 'masala', 'crispy', 'spicy', 'snacks'],
    description: 'Kurkure Masala Munch - Tedha hai par mera hai! Crunchy masala flavored snack.',
    rating: 4.4,
    reviews: 9876
  },
  { 
    id: 'SNK007', 
    name: 'Lay\'s Classic Salted', 
    price: 20, 
    mrp: 20,
    discount: 0,
    category: 'Snacks', 
    image: '/products/lay-chips.jpeg',
    icon: '🥔',
    aisle: 'Aisle 6', 
    tags: ['lays', 'chips', 'potato', 'salted', 'snacks'],
    description: 'Lay\'s Classic Salted - Crispy potato chips with perfect saltiness. No one can eat just one!',
    rating: 4.5,
    reviews: 11234
  },

  // ==================== CEREALS & STAPLES (Aisle 15-16) ====================
  { 
    id: 'STP001', 
    name: 'India Gate Basmati Rice (5kg)', 
    price: 450, 
    mrp: 520,
    discount: 13,
    category: 'Staples', 
    image: '/products/india-gate-rice.jpeg',
    icon: '🍚',
    aisle: 'Aisle 15', 
    tags: ['rice', 'basmati', 'india gate', 'premium', 'staples'],
    description: 'India Gate Basmati Rice - Premium long grain basmati. Aromatic and fluffy when cooked.',
    rating: 4.6,
    reviews: 8765
  },
  { 
    id: 'STP002', 
    name: 'Fortune Sunflower Oil (1L)', 
    price: 145, 
    mrp: 165,
    discount: 12,
    category: 'Staples', 
    image: '/products/fortune-sunflower-oil.jpeg',
    icon: '🌻',
    aisle: 'Aisle 15', 
    tags: ['oil', 'sunflower', 'fortune', 'cooking', 'healthy'],
    description: 'Fortune Sunflower Oil - Heart-healthy refined sunflower oil. Light and cholesterol-free.',
    rating: 4.4,
    reviews: 6543
  },
  { 
    id: 'STP003', 
    name: 'Tata Salt (1kg)', 
    price: 28, 
    mrp: 30,
    discount: 7,
    category: 'Staples', 
    image: '/products/tata-salt.jpeg',
    icon: '🧂',
    aisle: 'Aisle 15', 
    tags: ['salt', 'tata', 'iodized', 'staples'],
    description: 'Tata Salt - Desh ka Namak! India\'s first iodized salt. Pure and hygienic.',
    rating: 4.5,
    reviews: 15678
  },
  { 
    id: 'STP004', 
    name: 'Aashirvaad Whole Wheat Atta (5kg)', 
    price: 285, 
    mrp: 320,
    discount: 11,
    category: 'Staples', 
    image: '/products/aashirvaad-ata.jpeg',
    icon: '🌾',
    aisle: 'Aisle 16', 
    tags: ['atta', 'wheat flour', 'aashirvaad', 'roti', 'staples'],
    description: 'Aashirvaad Atta - 100% whole wheat flour. Makes soft rotis every time.',
    rating: 4.6,
    reviews: 12345
  },

  // ==================== PERSONAL CARE (Aisle 9) ====================
  { 
    id: 'PC001', 
    name: 'Dettol Original Soap (125g)', 
    price: 45, 
    mrp: 52,
    discount: 13,
    category: 'Personal Care', 
    image: '/products/dettol-shoap.jpeg',
    icon: '🧼',
    aisle: 'Aisle 9', 
    tags: ['dettol', 'soap', 'antibacterial', 'hygiene', 'personal care'],
    description: 'Dettol Original Soap - Trusted protection from germs. Antibacterial formula.',
    rating: 4.5,
    reviews: 9876
  },
  { 
    id: 'PC002', 
    name: 'Colgate MaxFresh Toothpaste (150g)', 
    price: 95, 
    mrp: 110,
    discount: 14,
    category: 'Personal Care', 
    image: '/products/colgate-tuth-paste.webp',
    icon: '🦷',
    aisle: 'Aisle 9', 
    tags: ['colgate', 'toothpaste', 'dental care', 'oral hygiene', 'personal care'],
    description: 'Colgate MaxFresh Toothpaste - Fresh breath with cooling crystals. Fights cavities and whitens teeth.',
    rating: 4.6,
    reviews: 12543
  },
  { 
    id: 'PC003', 
    name: 'Head & Shoulders Anti-Dandruff Shampoo (180ml)', 
    price: 199, 
    mrp: 225,
    discount: 12,
    category: 'Personal Care', 
    image: '/products/head-and-sholdere-shampoo.webp',
    icon: '🧴',
    aisle: 'Aisle 9', 
    tags: ['head and shoulders', 'shampoo', 'anti-dandruff', 'hair care', 'personal care'],
    description: 'Head & Shoulders Anti-Dandruff Shampoo - Up to 100% dandruff free. Clinically proven formula.',
    rating: 4.5,
    reviews: 8765
  },
  { 
    id: 'PC004', 
    name: 'Sunsilk Lusciously Thick & Long Shampoo (180ml)', 
    price: 145, 
    mrp: 165,
    discount: 12,
    category: 'Personal Care', 
    image: '/products/sunsilk-shampoo.webp',
    icon: '💇',
    aisle: 'Aisle 9', 
    tags: ['sunsilk', 'shampoo', 'thick hair', 'long hair', 'personal care'],
    description: 'Sunsilk Lusciously Thick & Long Shampoo - Thicker, longer-looking hair with keratin yogurt nutrients.',
    rating: 4.4,
    reviews: 6543
  },

  // ==================== SPICES & MASALAS (Aisle 17-18) ====================
  { 
    id: 'SPC001', 
    name: 'MDH Garam Masala (100g)', 
    price: 85, 
    mrp: 95,
    discount: 11,
    category: 'Spices', 
    image: '/products/mdh-garam-masala.jpeg',
    icon: '🌶️',
    aisle: 'Aisle 17', 
    tags: ['garam masala', 'mdh', 'spices', 'masala'],
    description: 'MDH Garam Masala - Asli Masale Sach Sach! Perfect blend of aromatic spices.',
    rating: 4.6,
    reviews: 8765
  },
  { 
    id: 'SPC002', 
    name: 'Everest Turmeric Powder (100g)', 
    price: 45, 
    mrp: 52,
    discount: 13,
    category: 'Spices', 
    image: '/products/everest-turmuric.jpeg',
    icon: '🟡',
    aisle: 'Aisle 17', 
    tags: ['turmeric', 'haldi', 'everest', 'spices'],
    description: 'Everest Turmeric Powder - Pure turmeric with natural golden color. Essential for Indian cooking.',
    rating: 4.5,
    reviews: 6543
  },
  { 
    id: 'SPC003', 
    name: 'Everest Pav Bhaji Masala (100g)', 
    price: 65, 
    mrp: 75,
    discount: 13,
    category: 'Spices', 
    image: '/products/everest-pav-bhaji-masala.jpeg',
    icon: '🌶️',
    aisle: 'Aisle 17', 
    tags: ['pav bhaji', 'masala', 'everest', 'spices'],
    description: 'Everest Pav Bhaji Masala - Authentic spice blend for perfect pav bhaji.',
    rating: 4.4,
    reviews: 4567
  },
  { 
    id: 'SPC004', 
    name: 'Everest Sambhar Masala (100g)', 
    price: 55, 
    mrp: 65,
    discount: 15,
    category: 'Spices', 
    image: '/products/everst-sambhar-masala.jpeg',
    icon: '🌶️',
    aisle: 'Aisle 17', 
    tags: ['sambhar', 'masala', 'everest', 'spices', 'south indian'],
    description: 'Everest Sambhar Masala - Perfect blend for authentic South Indian sambhar.',
    rating: 4.5,
    reviews: 5432
  },
  { 
    id: 'SPC005', 
    name: 'Suhana Chicken Biryani Masala (50g)', 
    price: 45, 
    mrp: 55,
    discount: 18,
    category: 'Spices', 
    image: '/products/suhana-chicken-biryani-mix.jpeg',
    icon: '🍗',
    aisle: 'Aisle 17', 
    tags: ['biryani', 'masala', 'suhana', 'chicken', 'spices'],
    description: 'Suhana Chicken Biryani Masala - Restaurant style biryani at home. Authentic taste!',
    rating: 4.6,
    reviews: 3456
  },

  // ==================== INSTANT FOOD (Aisle 13-14) ====================
  { 
    id: 'INS001', 
    name: 'Maggi 2-Minute Noodles', 
    price: 14, 
    mrp: 14,
    discount: 0,
    category: 'Instant Food', 
    image: '/products/maggi-large-medium,-small.jpeg',
    icon: '🍜',
    aisle: 'Aisle 13', 
    tags: ['maggi', 'noodles', 'instant', '2 minute'],
    description: 'Maggi 2-Minute Noodles - India\'s favorite instant noodles with iconic masala flavor.',
    rating: 4.6,
    reviews: 25678,
    variants: [
      { id: 'single', name: 'Single Pack', price: 14 },
      { id: 'pack4', name: 'Pack of 4', price: 52 },
      { id: 'pack12', name: 'Pack of 12', price: 144 }
    ]
  },
  { 
    id: 'INS002', 
    name: 'Act II Instant Popcorn Butter', 
    price: 40, 
    mrp: 45,
    discount: 11,
    category: 'Instant Food', 
    image: '/products/act-2-popcorn.jpeg',
    icon: '🍿',
    aisle: 'Aisle 13', 
    tags: ['popcorn', 'act ii', 'butter', 'instant', 'microwave'],
    description: 'Act II Instant Popcorn Butter - Movie theater taste at home! Ready in 3 minutes.',
    rating: 4.3,
    reviews: 6543,
    variants: [
      { id: 'single', name: 'Single Pack', price: 40 },
      { id: 'multipack', name: 'Multi Pack (3)', price: 99 }
    ]
  },
  { 
    id: 'INS003', 
    name: 'Act II Popcorn Value Pack', 
    price: 99, 
    mrp: 120,
    discount: 18,
    category: 'Instant Food', 
    image: '/products/act-2-popcorn-muilti-pack.jpeg',
    icon: '🍿',
    aisle: 'Aisle 13', 
    tags: ['popcorn', 'act ii', 'value pack', 'family', 'instant'],
    description: 'Act II Popcorn Value Pack - 3 packs for movie nights with family and friends!',
    rating: 4.4,
    reviews: 4567
  },
  { 
    id: 'INS004', 
    name: 'Disano Fusilli Pasta (500g)', 
    price: 125, 
    mrp: 145,
    discount: 14,
    category: 'Instant Food', 
    image: '/products/disono-pasta.jpeg',
    icon: '🍝',
    aisle: 'Aisle 13', 
    tags: ['pasta', 'disano', 'fusilli', 'italian', 'durum wheat'],
    description: 'Disano Fusilli Pasta - Premium durum wheat pasta. Cooks to perfect al dente.',
    rating: 4.4,
    reviews: 3456
  },
  { 
    id: 'INS005', 
    name: 'Ching\'s Hakka Noodles (150g)', 
    price: 42, 
    mrp: 48,
    discount: 13,
    category: 'Instant Food', 
    image: '/products/ching-chinise-noodels.jpeg',
    icon: '🍜',
    aisle: 'Aisle 13', 
    tags: ['noodles', 'chings', 'hakka', 'chinese', 'instant'],
    description: 'Ching\'s Hakka Noodles - Authentic Chinese style noodles. Ready in minutes!',
    rating: 4.3,
    reviews: 5678
  },
  { 
    id: 'INS006', 
    name: 'Daily Good Instant Noodles', 
    price: 10, 
    mrp: 10,
    discount: 0,
    category: 'Instant Food', 
    image: '/products/daily-good-noodles.jpeg',
    icon: '🍜',
    aisle: 'Aisle 13', 
    tags: ['noodles', 'daily good', 'instant', 'budget'],
    description: 'Daily Good Instant Noodles - Tasty noodles at affordable price. Quick meal solution.',
    rating: 4.0,
    reviews: 2345
  },
  { 
    id: 'INS007', 
    name: 'Kellogg\'s Muesli Fruit & Nut (500g)', 
    price: 345, 
    mrp: 399,
    discount: 14,
    category: 'Instant Food', 
    image: '/products/kelloggs-muesli.jpeg',
    icon: '🥣',
    aisle: 'Aisle 4', 
    tags: ['muesli', 'kelloggs', 'breakfast', 'oats', 'healthy'],
    description: 'Kellogg\'s Muesli - Crunchy muesli with fruits and nuts. Perfect healthy breakfast!',
    rating: 4.5,
    reviews: 6789
  },
  { 
    id: 'INS008', 
    name: 'Knorr Classic Tomato Soup (53g)', 
    price: 55, 
    mrp: 65,
    discount: 15,
    category: 'Instant Food', 
    image: '/products/knorr-shop.jpeg',
    icon: '🍲',
    aisle: 'Aisle 13', 
    tags: ['soup', 'knorr', 'tomato', 'instant', 'hot'],
    description: 'Knorr Classic Tomato Soup - Enjoy rich tomato taste in every sip. Ready in 2 minutes!',
    rating: 4.4,
    reviews: 4567
  },

  // ==================== CONDIMENTS (Aisle 11) ====================
  { 
    id: 'CND001', 
    name: 'Kissan Fresh Tomato Ketchup (500g)', 
    price: 98, 
    mrp: 115,
    discount: 15,
    category: 'Condiments', 
    image: '/products/kissan-ketchup.jpeg',
    icon: '🍅',
    aisle: 'Aisle 11', 
    tags: ['ketchup', 'kissan', 'tomato', 'sauce', 'condiment'],
    description: 'Kissan Fresh Tomato Ketchup - Made with real tomatoes! Perfect with snacks and meals.',
    rating: 4.6,
    reviews: 12345
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
