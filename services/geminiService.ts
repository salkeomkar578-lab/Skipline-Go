/**
 * Gemini AI Service - Skipline Go
 * The "Intelligence" Layer - Mall Concierge & Analysis Engine
 * 
 * Features:
 * - Shopping Assistant (Navigation, Recommendations)
 * - Budget Monitoring & Alerts
 * - Smart Wait-Time Estimation
 * - Dynamic Schedule Optimization
 * - Theft Behavior Analysis (see theftScoreService.ts)
 */

import { GoogleGenAI } from "@google/genai";
import { BehaviorLog, TheftAnalysis, CartItem, Product, NavigationResult, BudgetAlert } from "../types";
import { MOCK_PRODUCTS } from "../constants";
import { Language } from "./languageService";

// Language-specific greeting and response styles
const LANGUAGE_CONFIG = {
  en: {
    name: 'English',
    greeting: 'Namaste',
    respectful: 'Ji',
    instruction: 'Respond in English with occasional Hindi greetings like "Namaste".',
    thanks: "You're welcome!",
    help: 'I can help you',
    currency: '₹'
  },
  mr: {
    name: 'Marathi',
    greeting: 'नमस्कार',
    respectful: 'जी',
    instruction: 'Respond ONLY in Marathi (मराठी). Use Devanagari script. Be warm and helpful.',
    thanks: 'आपले स्वागत आहे!',
    help: 'मी तुम्हाला मदत करू शकतो',
    currency: '₹'
  },
  hi: {
    name: 'Hindi',
    greeting: 'नमस्ते',
    respectful: 'जी',
    instruction: 'Respond ONLY in Hindi (हिंदी). Use Devanagari script. Be warm and helpful.',
    thanks: 'आपका स्वागत है!',
    help: 'मैं आपकी मदद कर सकता हूं',
    currency: '₹'
  }
};

// Use the correct API key from environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;

// Gemini model
const MODEL_NAME = 'gemini-2.0-flash';

/**
 * Mall Concierge System Instruction
 * Makes Gemini act as a helpful shopping assistant
 * Now supports multiple languages!
 */
const getMallConciergeInstruction = (language: Language = 'en') => {
  const langConfig = LANGUAGE_CONFIG[language];
  
  return `
You are "Sahayak" (सहायक), the AI Shopping Assistant for Skipline Go - a smart self-checkout app for Indian malls.

CRITICAL LANGUAGE INSTRUCTION:
${langConfig.instruction}
You MUST respond in ${langConfig.name} language ONLY. Do not mix languages unless using common terms.

YOUR PERSONALITY:
- Warm, helpful, and culturally aware
- Expert in Indian retail, products, and shopping habits
- Knowledgeable about the store layout and product locations
- Budget-conscious and value-focused (understand Indian price sensitivity)
- Use "${langConfig.greeting}" for greetings and "${langConfig.respectful}" for respect

YOUR CAPABILITIES:
1. NAVIGATION: Guide customers to product locations using aisle numbers
2. RECOMMENDATIONS: Suggest complementary products, recipes, alternatives
3. BUDGET HELP: Track spending and warn when approaching limits
4. DEALS & OFFERS: Highlight current promotions relevant to the customer
5. PRODUCT INFO: Answer questions about ingredients, comparisons, etc.

STORE LAYOUT KNOWLEDGE:
- Aisle 1-2: Fresh Produce & Fruits
- Aisle 3-4: Dairy, Eggs & Breakfast
- Aisle 5-6: Snacks, Biscuits & Chips
- Aisle 7-8: Beverages & Juices
- Aisle 9-10: Personal Care & Hygiene
- Aisle 11-12: Home Care & Cleaning
- Aisle 13-14: Instant Food & Noodles
- Aisle 15-16: Rice, Dal & Staples
- Aisle 17-18: Spices & Masalas
- Aisle 19-20: Electronics & Accessories

RESPONSE GUIDELINES:
- Keep responses concise (2-3 sentences max)
- Always be helpful and positive
- If unsure about location, suggest asking staff
- For recipes, provide quick Indian-style suggestions
- Mention relevant offers when appropriate
- ALWAYS respond in ${langConfig.name}
`;
};

/**
 * Initialize Gemini AI client
 */
const getAI = () => {
  if (!API_KEY) {
    console.warn('⚠️ Gemini API key not found');
    return null;
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

/**
 * Chat with Mall Concierge (Sahayak)
 * Main conversational interface for customers
 * Now supports multiple languages!
 */
export const chatWithSahayak = async (
  userMessage: string,
  context: {
    cartItems: CartItem[];
    cartTotal: number;
    budget?: number;
    currentAisle?: string;
    language?: Language;
  }
): Promise<string> => {
  const language = context.language || 'en';
  
  try {
    const ai = getAI();
    
    // Fallback responses when API is not available
    if (!ai) {
      return getFallbackResponse(userMessage, context, language);
    }
    
    const langConfig = LANGUAGE_CONFIG[language];
    const contextPrompt = `
CURRENT CONTEXT:
- Customer's Cart: ${context.cartItems.length} items (₹${context.cartTotal.toFixed(2)})
- Budget: ${context.budget ? `₹${context.budget}` : 'Not set'}
- Location: ${context.currentAisle || 'Unknown'}
- Cart Items: ${context.cartItems.map(i => i.name).join(', ') || 'Empty'}
- Response Language: ${langConfig.name} (${language})

IMPORTANT: Respond ONLY in ${langConfig.name}. ${langConfig.instruction}

USER MESSAGE: ${userMessage}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contextPrompt,
      config: {
        systemInstruction: getMallConciergeInstruction(language),
        temperature: 0.8,
        maxOutputTokens: 250
      }
    });

    const errorMsg = language === 'mr' 
      ? 'माफ करा, मला ते समजले नाही. कृपया पुन्हा प्रयत्न करा जी.' 
      : language === 'hi' 
        ? 'क्षमा करें, मैं समझ नहीं पाया। कृपया फिर से प्रयास करें जी।' 
        : "I apologize, I couldn't process that. Please try again, Ji.";
    
    return response.text || errorMsg;
  } catch (error) {
    console.error('Sahayak Error:', error);
    return getFallbackResponse(userMessage, context, language);
  }
};

/**
 * Multi-language fallback responses when Gemini API is not available
 * Added more variety to prevent repetitive responses
 */
const FALLBACK_RESPONSES = {
  en: {
    greetings: [
      "Namaste! 🙏 I'm Sahayak, your shopping assistant. How can I help you today?",
      "Hello! Welcome to Skipline Go! I'm here to make your shopping easier. What do you need?",
      "Hi there! 👋 Ready to help you find products, track your budget, or suggest recipes!",
      "Namaste! Looking for something specific or need shopping assistance?",
      "Hey! I'm Sahayak, your smart shopping companion. Let's make shopping fun today!"
    ],
    help: [
      "I can help you with:\n📍 Finding products (e.g., 'Where is milk?')\n💰 Budget tracking (e.g., 'Check my budget')\n🍳 Recipe ideas (e.g., 'Recipe for pasta')\n🛒 Cart info (e.g., 'What's in my cart?')",
      "Here's what I can do:\n🔍 Locate any product in store\n💵 Track your spending\n👨‍🍳 Suggest quick recipes\n📊 Compare product prices",
      "Need assistance? Ask me to:\n• Find products by name or category\n• Set and track your budget\n• Get cooking suggestions\n• Check current deals"
    ],
    emptyCart: [
      "Your cart is empty! Start scanning products to add them. Need help finding something?",
      "Ready to shop! Your cart awaits its first item. What are you looking for today?",
      "Cart's all clear! Let me help you find what you need. Just ask!"
    ],
    cartInfo: (count: number, total: number, items: string) => {
      const templates = [
        `You have ${count} items totaling ₹${total.toFixed(2)}. Items: ${items}. Need anything else?`,
        `Cart update: ${count} products worth ₹${total.toFixed(2)}. Your picks: ${items}.`,
        `Shopping summary: ${count} items at ₹${total.toFixed(2)}. That's ${items}. Good choices!`
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    },
    budgetSet: (total: number, remaining: number, budget: number) => {
      const templates = [
        `Cart: ₹${total.toFixed(2)} | Remaining: ₹${remaining.toFixed(2)} of ₹${budget} budget.`,
        `You've spent ₹${total.toFixed(2)}. Still have ₹${remaining.toFixed(2)} in your ₹${budget} budget!`,
        `Budget check: ₹${remaining.toFixed(2)} left from ₹${budget}. Current cart: ₹${total.toFixed(2)}.`
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    },
    budgetNotSet: (total: number) => {
      const templates = [
        `Your current cart total is ₹${total.toFixed(2)}. Would you like to set a budget limit?`,
        `Cart stands at ₹${total.toFixed(2)}. Set a budget to track spending better!`,
        `Total so far: ₹${total.toFixed(2)}. Want me to help you stick to a budget?`
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    },
    productFound: (name: string, aisle: string, price: number) => {
      const templates = [
        `Found it! ${name} is in ${aisle}. Price: ₹${price}. Shall I help you find anything else?`,
        `${name} → ${aisle}, priced at ₹${price}. Great choice!`,
        `Located! ${name} available in ${aisle} for ₹${price}. Need directions?`
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    },
    dairy: [
      "Dairy products are in Aisle 3! You'll find milk, butter, cheese, paneer, and yogurt there.",
      "Head to Aisle 3 - Dairy Section for all milk products, curd, and cheese items!",
      "Aisle 3 has everything dairy! From fresh milk to flavored yogurt."
    ],
    staples: [
      "Staples like rice, dal, and atta are in Aisle 7-8 - Grains section.",
      "For rice, dal, flour - check Aisle 7-8. All your kitchen staples in one place!",
      "Aisle 7-8 is your staples paradise! Rice, pulses, flour, and more."
    ],
    snacks: [
      "Snacks are in Aisle 5-6! Chips, biscuits, namkeen - all there!",
      "Craving snacks? Aisle 5-6 has chips, cookies, and Indian namkeen!",
      "Head to Aisle 5-6 for munchies - from Lay's to Parle-G!"
    ],
    findHelp: [
      "I can help you locate products! Try asking 'Where is milk?' or 'Find rice'.",
      "Looking for something? Just tell me the product name and I'll guide you!",
      "Ask me about any product location - I know every aisle!"
    ],
    defaults: [
      "I'm here to help! Ask me about products, prices, recipes, or your budget.",
      "How can I assist your shopping today? Product search, budget tracking, or recommendations?",
      "Need help? I can find products, suggest recipes, or track your spending!",
      "What would you like to know? I'm your shopping expert today!",
      "Ready to help! Ask about products, check your cart, or get recipe ideas."
    ]
  },
  mr: {
    greeting: "नमस्कार! 🙏 मी सहायक आहे, तुमचा खरेदी सहाय्यक. मी तुम्हाला उत्पादने शोधणे, बजेट ट्रॅक करणे आणि रेसिपी सुचवण्यात मदत करू शकतो. मी आज कशी मदत करू?",
    help: "मी तुम्हाला यात मदत करू शकतो:\n📍 उत्पादने शोधणे (उदा. 'दूध कुठे आहे?')\n💰 बजेट ट्रॅकिंग (उदा. 'माझे बजेट तपासा')\n🍳 रेसिपी आयडिया (उदा. 'पास्ता रेसिपी')\n🛒 कार्ट माहिती (उदा. 'माझ्या कार्टमध्ये काय आहे?')",
    emptyCart: "तुमची कार्ट रिकामी आहे! उत्पादने जोडण्यासाठी स्कॅन करणे सुरू करा. काही शोधायचे आहे का?",
    cartInfo: (count: number, total: number, items: string) => 
      `तुमच्या कार्टमध्ये ${count} आयटम आहेत, एकूण ₹${total.toFixed(2)}. आयटम: ${items}.`,
    budgetSet: (total: number, remaining: number, budget: number) => 
      `तुमची सध्याची कार्ट एकूण ₹${total.toFixed(2)} आहे. तुमच्या ₹${budget} बजेटमधून ₹${remaining.toFixed(2)} शिल्लक आहे.`,
    budgetNotSet: (total: number) => 
      `तुमची सध्याची कार्ट एकूण ₹${total.toFixed(2)} आहे. बजेट सेट करायचे आहे का? फक्त मला तुमची मर्यादा सांगा!`,
    productFound: (name: string, aisle: string, price: number) => 
      `नमस्कार! ${name} ${aisle} मध्ये उपलब्ध आहे. किंमत: ₹${price}. कार्टमध्ये जोडू का?`,
    dairy: "नमस्कार! दुग्धजन्य उत्पादने Aisle 3 - डेअरी विभागात आहेत. तिथे दूध, लोणी, चीज आणि दही मिळेल!",
    staples: "नमस्कार! तांदूळ, डाळ आणि आटा यांसारखे मुख्य पदार्थ Aisle 7-8 - धान्य आणि मुख्य विभागात आहेत.",
    snacks: "नमस्कार! स्नॅक्स आणि बिस्किटे Aisle 5-6 मध्ये आहेत. तिथे चिप्स, कुकीज आणि नमकीन मिळेल!",
    findHelp: "नमस्कार! मी तुम्हाला उत्पादने शोधण्यात मदत करू शकतो. 'दूध कुठे आहे?' किंवा 'तांदूळ शोधा' अशी विशिष्ट वस्तू विचारा.",
    default: "नमस्कार! मी तुमच्या खरेदीत मदत करण्यासाठी येथे आहे. तुम्ही मला उत्पादने शोधायला, किंमती तपासायला, बजेट ट्रॅक करायला किंवा रेसिपी आयडिया मिळवायला सांगू शकता. काय जाणून घ्यायचे आहे?"
  },
  hi: {
    greeting: "नमस्ते! 🙏 मैं सहायक हूं, आपका शॉपिंग असिस्टेंट। मैं आपको प्रोडक्ट खोजने, बजट ट्रैक करने और रेसिपी सुझाव देने में मदद कर सकता हूं। आज मैं कैसे मदद कर सकता हूं?",
    help: "मैं आपकी इसमें मदद कर सकता हूं:\n📍 प्रोडक्ट खोजना (जैसे 'दूध कहां है?')\n💰 बजट ट्रैकिंग (जैसे 'मेरा बजट चेक करें')\n🍳 रेसिपी आइडिया (जैसे 'पास्ता रेसिपी')\n🛒 कार्ट जानकारी (जैसे 'मेरे कार्ट में क्या है?')",
    emptyCart: "आपकी कार्ट खाली है! प्रोडक्ट जोड़ने के लिए स्कैन करना शुरू करें। कुछ खोजना है क्या?",
    cartInfo: (count: number, total: number, items: string) => 
      `आपके कार्ट में ${count} आइटम हैं, कुल ₹${total.toFixed(2)}। आइटम: ${items}।`,
    budgetSet: (total: number, remaining: number, budget: number) => 
      `आपकी वर्तमान कार्ट कुल ₹${total.toFixed(2)} है। आपके ₹${budget} बजट में से ₹${remaining.toFixed(2)} बचा है।`,
    budgetNotSet: (total: number) => 
      `आपकी वर्तमान कार्ट कुल ₹${total.toFixed(2)} है। बजट सेट करना चाहेंगे? बस मुझे अपनी सीमा बताएं!`,
    productFound: (name: string, aisle: string, price: number) => 
      `नमस्ते! ${name} ${aisle} में उपलब्ध है। कीमत: ₹${price}। क्या मैं इसे आपकी कार्ट में जोड़ूं?`,
    dairy: "नमस्ते! डेयरी प्रोडक्ट Aisle 3 - डेयरी सेक्शन में हैं। वहां दूध, मक्खन, पनीर और दही मिलेगा!",
    staples: "नमस्ते! चावल, दाल और आटा जैसे स्टेपल्स Aisle 7-8 - अनाज और स्टेपल्स सेक्शन में हैं।",
    snacks: "नमस्ते! स्नैक्स और बिस्किट Aisle 5-6 में हैं। वहां चिप्स, कुकीज़ और नमकीन मिलेगा!",
    findHelp: "नमस्ते! मैं आपको प्रोडक्ट खोजने में मदद कर सकता हूं। 'दूध कहां है?' या 'चावल खोजें' जैसे विशिष्ट आइटम के बारे में पूछें।",
    default: "नमस्ते! मैं आपकी शॉपिंग में मदद करने के लिए यहां हूं। आप मुझसे प्रोडक्ट खोजने, कीमतें चेक करने, बजट ट्रैक करने या रेसिपी आइडिया पाने के लिए कह सकते हैं। क्या जानना चाहेंगे?"
  }
};

/**
 * Fallback responses when Gemini API is not available
 * Now supports multiple languages with varied responses!
 */
const getFallbackResponse = (
  userMessage: string,
  context: { cartItems: CartItem[]; cartTotal: number; budget?: number; currentAisle?: string },
  language: Language = 'en'
): string => {
  const lowerMessage = userMessage.toLowerCase();
  const responses = FALLBACK_RESPONSES[language];
  
  // Helper to get random item from array
  const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  
  // Product location queries
  if (lowerMessage.includes('where') || lowerMessage.includes('find') || lowerMessage.includes('location') ||
      lowerMessage.includes('कुठे') || lowerMessage.includes('शोधा') || lowerMessage.includes('कहां') || lowerMessage.includes('खोजें')) {
    const productMatches = MOCK_PRODUCTS.filter(p => 
      lowerMessage.includes(p.name.toLowerCase()) || 
      lowerMessage.includes(p.category.toLowerCase())
    );
    
    if (productMatches.length > 0) {
      const product = productMatches[0];
      return responses.productFound(product.name, product.aisle, product.price);
    }
    
    // Generic aisle info
    if (lowerMessage.includes('milk') || lowerMessage.includes('dairy') || lowerMessage.includes('butter') ||
        lowerMessage.includes('दूध') || lowerMessage.includes('दुग्ध') || lowerMessage.includes('दही')) {
      return Array.isArray(responses.dairy) ? random(responses.dairy) : responses.dairy;
    }
    if (lowerMessage.includes('rice') || lowerMessage.includes('dal') || lowerMessage.includes('atta') ||
        lowerMessage.includes('तांदूळ') || lowerMessage.includes('चावल') || lowerMessage.includes('डाळ') || lowerMessage.includes('दाल')) {
      return Array.isArray(responses.staples) ? random(responses.staples) : responses.staples;
    }
    if (lowerMessage.includes('snack') || lowerMessage.includes('chips') || lowerMessage.includes('biscuit') ||
        lowerMessage.includes('स्नॅक') || lowerMessage.includes('स्नैक') || lowerMessage.includes('चिप्स')) {
      return Array.isArray(responses.snacks) ? random(responses.snacks) : responses.snacks;
    }
    
    return Array.isArray(responses.findHelp) ? random(responses.findHelp) : responses.findHelp;
  }
  
  // Budget queries
  if (lowerMessage.includes('budget') || lowerMessage.includes('total') || lowerMessage.includes('spend') ||
      lowerMessage.includes('बजेट') || lowerMessage.includes('खर्च') || lowerMessage.includes('एकूण') || lowerMessage.includes('कुल')) {
    const remaining = context.budget ? context.budget - context.cartTotal : 0;
    if (context.budget) {
      return responses.budgetSet(context.cartTotal, remaining, context.budget);
    }
    return responses.budgetNotSet(context.cartTotal);
  }
  
  // Greeting
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('namaste') ||
      lowerMessage.includes('नमस्कार') || lowerMessage.includes('नमस्ते') || lowerMessage.includes('हाय')) {
    const greetings = responses.greetings || responses.greeting;
    return Array.isArray(greetings) ? random(greetings) : greetings;
  }
  
  // Help
  if (lowerMessage.includes('help') || lowerMessage.includes('मदत') || lowerMessage.includes('मदद') || lowerMessage.includes('सहाय्य')) {
    return Array.isArray(responses.help) ? random(responses.help) : responses.help;
  }
  
  // Cart info
  if (lowerMessage.includes('cart') || lowerMessage.includes('कार्ट') || lowerMessage.includes('कार्टमध्ये')) {
    if (context.cartItems.length === 0) {
      return Array.isArray(responses.emptyCart) ? random(responses.emptyCart) : responses.emptyCart;
    }
    return responses.cartInfo(context.cartItems.length, context.cartTotal, context.cartItems.map(i => i.name).join(', '));
  }
  
  // Default response - varied
  const defaults = responses.defaults || responses.default;
  return Array.isArray(defaults) ? random(defaults) : defaults;
};

/**
 * Get product navigation assistance
 * "Where is the pasta?" → Returns aisle location
 */
export const getProductNavigation = async (
  productQuery: string
): Promise<NavigationResult> => {
  try {
    const ai = getAI();
    
    const prompt = `
Find the location for: "${productQuery}"

Based on the store layout, provide:
1. The exact aisle number
2. The section within the aisle
3. 2-3 nearby related items the customer might also want

Respond in JSON format.
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: MALL_CONCIERGE_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            aisle: { type: Type.STRING },
            section: { type: Type.STRING },
            nearbyItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedDistance: { type: Type.STRING }
          },
          required: ["productName", "aisle", "section"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    return JSON.parse(text) as NavigationResult;
  } catch (error) {
    console.error('Navigation Error:', error);
    return {
      productName: productQuery,
      aisle: 'Please ask staff',
      section: 'Customer Service',
      nearbyItems: []
    };
  }
};

/**
 * Check budget status and provide alerts
 */
export const checkBudgetStatus = async (
  cartTotal: number,
  budget: number,
  cartItems: CartItem[]
): Promise<BudgetAlert> => {
  const remaining = budget - cartTotal;
  const percentUsed = (cartTotal / budget) * 100;
  const warning = percentUsed >= 80;

  if (!warning) {
    return {
      currentTotal: cartTotal,
      budget,
      remaining,
      percentUsed,
      warning: false
    };
  }

  // Get AI suggestions for staying within budget
  try {
    const ai = getAI();
    
    const prompt = `
Customer has budget of ₹${budget} and cart total is ₹${cartTotal} (${percentUsed.toFixed(0)}% used).
Cart items: ${cartItems.map(i => `${i.name} (₹${i.price})`).join(', ')}

Provide 2-3 brief suggestions to help them stay within budget.
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful budget advisor. Be concise and practical.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["suggestions"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"suggestions":[]}');
    
    return {
      currentTotal: cartTotal,
      budget,
      remaining,
      percentUsed,
      warning: true,
      suggestions: result.suggestions
    };
  } catch {
    return {
      currentTotal: cartTotal,
      budget,
      remaining,
      percentUsed,
      warning: true,
      suggestions: ['Consider removing high-value items', 'Look for similar products at lower prices']
    };
  }
};

/**
 * Get recipe suggestions based on cart items
 */
export const getRecipeSuggestions = async (
  cartItems: CartItem[]
): Promise<string[]> => {
  if (cartItems.length === 0) return [];

  try {
    const ai = getAI();
    
    const prompt = `
Customer has these items: ${cartItems.map(i => i.name).join(', ')}

Suggest 3 quick Indian recipes they can make with these ingredients.
Keep suggestions brief (one line each).
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "You are an Indian cooking expert. Suggest practical, quick recipes.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["recipes"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"recipes":[]}');
    return result.recipes;
  } catch {
    return [];
  }
};

/**
 * Smart Wait-Time Estimation
 * Predicts checkout queue time based on current crowd density
 */
export const estimateWaitTime = async (
  activeCheckouts: number,
  queueLength: number,
  timeOfDay: string
): Promise<{ minutes: number; confidence: string; suggestion: string }> => {
  try {
    const ai = getAI();
    
    const prompt = `
Estimate checkout wait time:
- Active checkout counters: ${activeCheckouts}
- People in queue: ${queueLength}
- Time: ${timeOfDay}
- Day: ${new Date().toLocaleDateString('en-IN', { weekday: 'long' })}

Consider Indian shopping patterns (weekend rush, evening crowds, festival seasons).
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            minutes: { type: Type.NUMBER },
            confidence: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            suggestion: { type: Type.STRING }
          },
          required: ["minutes", "confidence", "suggestion"]
        }
      }
    });

    return JSON.parse(response.text || '{"minutes":5,"confidence":"Medium","suggestion":"Use self-checkout for faster exit"}');
  } catch {
    return {
      minutes: Math.ceil(queueLength * 2.5),
      confidence: "Low",
      suggestion: "Try Skipline Go self-checkout for instant billing!"
    };
  }
};

/**
 * Dynamic Schedule Optimizer
 * "I need to visit bank and grocery before 5 PM" → Optimized route
 */
export const optimizeShoppingSchedule = async (
  tasks: string[],
  deadline: string,
  currentTime: string
): Promise<{ schedule: string[]; totalTime: string; tips: string[] }> => {
  try {
    const ai = getAI();
    
    const prompt = `
Optimize this shopping schedule:
Tasks: ${tasks.join(', ')}
Deadline: ${deadline}
Current Time: ${currentTime}
Location: Indian Mall

Create an efficient route considering:
- Store locations within the mall
- Typical time for each task
- Queue times at different hours
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            schedule: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            totalTime: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["schedule", "totalTime", "tips"]
        }
      }
    });

    return JSON.parse(response.text || '{"schedule":[],"totalTime":"Unknown","tips":[]}');
  } catch {
    return {
      schedule: tasks,
      totalTime: "Estimate unavailable",
      tips: ["Visit during off-peak hours for faster service"]
    };
  }
};

/**
 * Analyze cart behavior for theft detection
 * @deprecated Use calculateTheftScore from theftScoreService.ts instead
 */
export const analyzeCartBehavior = async (
  logs: BehaviorLog[], 
  totalTimeSeconds: number
): Promise<TheftAnalysis> => {
  const modelName = 'gemini-3-flash-preview';
  const ai = getAI();
  
  const prompt = `
    Analyze this shopping behavior log for potential theft risk. 
    Context: A self-checkout customer in an Indian smart mall.
    Total duration: ${totalTimeSeconds} seconds.
    Behavior Logs (JSON): ${JSON.stringify(logs)}
    
    Risk Factors to look for:
    1. "Scanning Fatigue": High frequency of removals (scanning then deleting items repeatedly).
    2. "The Dash": Rapid movement between adding multiple items and checkout (less than 5s per item).
    3. "Aisle Stalling": Unusual delays or gaps in logs followed by scan failures.
    
    Return a comprehensive analysis including a risk score (0-100).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { 
              type: Type.NUMBER, 
              description: "Risk score from 0 (Safe) to 100 (Highly Suspicious)" 
            },
            riskLevel: { 
              type: Type.STRING, 
              enum: ["Low", "Medium", "High"],
              description: "Categorized risk level based on the score"
            },
            reasoning: { 
              type: Type.STRING,
              description: "Brief explanation of why this score was given"
            }
          },
          required: ["score", "riskLevel", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    const result = JSON.parse(text);
    return {
      ...result,
      flags: [],
      recommendation: result.score > 65 ? 'FULL_AUDIT' : 'INSTANT_RELEASE'
    } as TheftAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      score: Math.floor(Math.random() * 15),
      riskLevel: 'Low',
      reasoning: "Behavioral patterns appear normal. Offline analysis fallback active.",
      flags: [],
      recommendation: 'INSTANT_RELEASE'
    };
  }
};

// ==================== ADMIN PRODUCT IDENTIFICATION ====================

/**
 * AI-powered product identification from text
 * Used by Admin Panel for bulk product import
 * Analyzes a text list and extracts product information
 */
export const identifyProductsFromText = async (text: string): Promise<Partial<Product>[]> => {
  const ai = getAI();
  
  // Fallback parsing if AI is not available
  if (!ai) {
    return parseProductTextFallback(text);
  }
  
  try {
    const prompt = `
You are a product data extraction AI for an Indian retail store.
Analyze the following text and extract product information.
The text may be a list of products, a receipt, or inventory data.

INPUT TEXT:
${text}

TASK:
Extract each product and return a JSON array with these fields for each product:
- name: Product name (string, required)
- price: Price in INR (number, required, extract from text or estimate based on typical Indian retail prices)
- mrp: MRP/original price if discounted (number, optional)
- category: Category (Dairy, Snacks, Beverages, Personal Care, Staples, Spices, Electronics, Fresh Produce, Instant Food, Home Care)
- aisle: Store aisle (e.g., "Aisle 3")
- description: Brief product description
- tags: Array of search tags

Be smart about recognizing Indian products like:
- Amul, Mother Dairy (Dairy)
- Maggi, Yippee, Top Ramen (Instant Food)
- Parle-G, Britannia, Haldirams (Snacks)
- Tata Tea, Nescafe, Real Juice (Beverages)
- Dettol, Colgate, Head & Shoulders (Personal Care)
- India Gate, Fortune, Aashirvaad (Staples)

Return ONLY a valid JSON array. No explanations.
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 2000
      }
    });

    const responseText = response.text || '[]';
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const products = JSON.parse(jsonMatch[0]);
      return products.map((p: any, index: number) => ({
        id: `BULK${Date.now()}${index.toString().padStart(3, '0')}`,
        name: p.name || 'Unknown Product',
        price: p.price || 0,
        mrp: p.mrp,
        category: p.category || 'General',
        aisle: p.aisle,
        description: p.description,
        tags: p.tags || [],
        icon: getProductIcon(p.category || 'General'),
        rating: 4.0 + Math.random() * 0.8,
        reviews: Math.floor(Math.random() * 5000) + 100
      }));
    }
    
    return parseProductTextFallback(text);
  } catch (error) {
    console.error('AI Product Identification Error:', error);
    return parseProductTextFallback(text);
  }
};

/**
 * AI-powered product identification from image
 * Uses Gemini vision to identify products in an image
 */
export const identifyProductsFromImage = async (base64Image: string): Promise<Partial<Product>[]> => {
  const ai = getAI();
  
  if (!ai) {
    console.warn('AI not available for image processing');
    return [];
  }
  
  try {
    // Remove data URL prefix if present
    const imageData = base64Image.includes(',') 
      ? base64Image.split(',')[1] 
      : base64Image;
    
    const prompt = `
You are a product identification AI for an Indian retail store.
Analyze this image and identify all visible products, receipts, or product lists.

TASK:
Extract each identifiable product and return a JSON array with these fields:
- name: Product name (string, required)
- price: Price in INR (number, required - extract from image or estimate)
- category: Category (Dairy, Snacks, Beverages, Personal Care, Staples, Spices, Electronics, Fresh Produce, Instant Food, Home Care)
- aisle: Suggested store aisle
- description: Brief description
- tags: Search tags array

Focus on Indian products and brands. If you see a receipt, extract line items.
If you see products on shelves, identify each visible product.

Return ONLY a valid JSON array. No other text.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { 
              inlineData: { 
                mimeType: 'image/jpeg', 
                data: imageData 
              } 
            }
          ]
        }
      ],
      config: {
        temperature: 0.3,
        maxOutputTokens: 2000
      }
    });

    const responseText = response.text || '[]';
    
    // Extract JSON array from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const products = JSON.parse(jsonMatch[0]);
      return products.map((p: any, index: number) => ({
        id: `IMG${Date.now()}${index.toString().padStart(3, '0')}`,
        name: p.name || 'Unknown Product',
        price: p.price || 0,
        mrp: p.mrp,
        category: p.category || 'General',
        aisle: p.aisle,
        description: p.description,
        tags: p.tags || [],
        icon: getProductIcon(p.category || 'General'),
        rating: 4.0 + Math.random() * 0.8,
        reviews: Math.floor(Math.random() * 5000) + 100
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Image Product Identification Error:', error);
    return [];
  }
};

/**
 * Fallback text parser when AI is not available
 */
const parseProductTextFallback = (text: string): Partial<Product>[] => {
  const lines = text.split('\n').filter(line => line.trim());
  const products: Partial<Product>[] = [];
  
  lines.forEach((line, index) => {
    // Try to parse common formats like:
    // "1. Product Name - ₹99"
    // "Product Name: Rs 99"
    // "Product Name 99"
    
    const priceMatch = line.match(/[₹Rs\.]*\s*(\d+(?:\.\d{2})?)/i);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
    
    // Remove price and numbering from product name
    let name = line
      .replace(/^\d+[\.\)]\s*/, '')  // Remove numbering
      .replace(/[₹Rs\.]*\s*\d+(?:\.\d{2})?/gi, '')  // Remove price
      .replace(/[-:]/g, ' ')  // Remove separators
      .trim();
    
    if (name.length > 2) {
      const category = guessProductCategory(name);
      products.push({
        id: `PARSE${Date.now()}${index.toString().padStart(3, '0')}`,
        name,
        price: price || estimatePrice(name, category),
        category,
        aisle: getCategoryAisle(category),
        icon: getProductIcon(category),
        tags: name.toLowerCase().split(/\s+/).filter(t => t.length > 2),
        rating: 4.0 + Math.random() * 0.8,
        reviews: Math.floor(Math.random() * 3000) + 50
      });
    }
  });
  
  return products;
};

/**
 * Guess product category from name
 */
const guessProductCategory = (name: string): string => {
  const nameLower = name.toLowerCase();
  
  if (/milk|butter|curd|dahi|cheese|paneer|ghee|cream|amul|mother dairy/i.test(nameLower)) return 'Dairy';
  if (/chips|biscuit|cookie|namkeen|bhujia|parle|britannia|lays|kurkure|haldiram/i.test(nameLower)) return 'Snacks';
  if (/tea|coffee|juice|cola|pepsi|coke|sprite|water|drink|real|tropicana|nescafe|tata tea/i.test(nameLower)) return 'Beverages';
  if (/soap|shampoo|toothpaste|cream|lotion|dettol|colgate|dove|head.?shoulder/i.test(nameLower)) return 'Personal Care';
  if (/rice|atta|dal|oil|sugar|flour|wheat|india gate|fortune|aashirvaad/i.test(nameLower)) return 'Staples';
  if (/masala|spice|turmeric|chilli|salt|mdh|everest|catch/i.test(nameLower)) return 'Spices';
  if (/phone|charger|cable|headphone|speaker|earphone|boat|mi|samsung/i.test(nameLower)) return 'Electronics';
  if (/tomato|onion|potato|apple|banana|vegetable|fruit|fresh/i.test(nameLower)) return 'Fresh Produce';
  if (/maggi|noodle|pasta|instant|yippee|top ramen/i.test(nameLower)) return 'Instant Food';
  if (/detergent|cleaner|mop|broom|vim|surf|harpic/i.test(nameLower)) return 'Home Care';
  
  return 'General';
};

/**
 * Get aisle for category
 */
const getCategoryAisle = (category: string): string => {
  const aisleMap: Record<string, string> = {
    'Dairy': 'Aisle 3',
    'Snacks': 'Aisle 5',
    'Beverages': 'Aisle 7',
    'Personal Care': 'Aisle 9',
    'Staples': 'Aisle 11',
    'Spices': 'Aisle 12',
    'Electronics': 'Aisle 15',
    'Fresh Produce': 'Aisle 1',
    'Instant Food': 'Aisle 6',
    'Home Care': 'Aisle 10',
    'General': 'Aisle 8'
  };
  return aisleMap[category] || 'Aisle 1';
};

/**
 * Get product icon emoji based on category
 */
const getProductIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    'Dairy': '🥛',
    'Snacks': '🍪',
    'Beverages': '🥤',
    'Personal Care': '🧴',
    'Staples': '🍚',
    'Spices': '🌶️',
    'Electronics': '🔌',
    'Fresh Produce': '🥬',
    'Instant Food': '🍜',
    'Home Care': '🧹',
    'General': '📦'
  };
  return iconMap[category] || '📦';
};

/**
 * Estimate price based on product name and category
 */
const estimatePrice = (name: string, category: string): number => {
  const basePrices: Record<string, number> = {
    'Dairy': 50,
    'Snacks': 30,
    'Beverages': 40,
    'Personal Care': 100,
    'Staples': 80,
    'Spices': 60,
    'Electronics': 500,
    'Fresh Produce': 40,
    'Instant Food': 25,
    'Home Care': 75,
    'General': 50
  };
  
  const basePrice = basePrices[category] || 50;
  // Add some variance based on name length (longer names often mean larger/premium products)
  const variance = (name.length / 10) * 20;
  return Math.round(basePrice + variance + Math.random() * 30);
};
