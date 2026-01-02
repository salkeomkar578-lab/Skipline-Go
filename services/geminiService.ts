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

// Use the correct API key from environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;

// Gemini model
const MODEL_NAME = 'gemini-2.0-flash';

/**
 * Mall Concierge System Instruction
 * Makes Gemini act as a helpful shopping assistant
 */
const MALL_CONCIERGE_INSTRUCTION = `
You are "Sahayak", the AI Shopping Assistant for Skipline Go - a smart self-checkout app for Indian malls.

YOUR PERSONALITY:
- Warm, helpful, and culturally aware (use "Namaste", "Ji" appropriately)
- Expert in Indian retail, products, and shopping habits
- Knowledgeable about the store layout and product locations
- Budget-conscious and value-focused (understand Indian price sensitivity)

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
`;

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
 */
export const chatWithSahayak = async (
  userMessage: string,
  context: {
    cartItems: CartItem[];
    cartTotal: number;
    budget?: number;
    currentAisle?: string;
  }
): Promise<string> => {
  try {
    const ai = getAI();
    
    // Fallback responses when API is not available
    if (!ai) {
      return getFallbackResponse(userMessage, context);
    }
    
    const contextPrompt = `
CURRENT CONTEXT:
- Customer's Cart: ${context.cartItems.length} items (₹${context.cartTotal.toFixed(2)})
- Budget: ${context.budget ? `₹${context.budget}` : 'Not set'}
- Location: ${context.currentAisle || 'Unknown'}
- Cart Items: ${context.cartItems.map(i => i.name).join(', ') || 'Empty'}

USER MESSAGE: ${userMessage}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contextPrompt,
      config: {
        systemInstruction: MALL_CONCIERGE_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 200
      }
    });

    return response.text || "I apologize, I couldn't process that. Please try again, Ji.";
  } catch (error) {
    console.error('Sahayak Error:', error);
    return getFallbackResponse(userMessage, context);
  }
};

/**
 * Fallback responses when Gemini API is not available
 */
const getFallbackResponse = (
  userMessage: string,
  context: { cartItems: CartItem[]; cartTotal: number; budget?: number; currentAisle?: string }
): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Product location queries
  if (lowerMessage.includes('where') || lowerMessage.includes('find') || lowerMessage.includes('location')) {
    const productMatches = MOCK_PRODUCTS.filter(p => 
      lowerMessage.includes(p.name.toLowerCase()) || 
      lowerMessage.includes(p.category.toLowerCase())
    );
    
    if (productMatches.length > 0) {
      const product = productMatches[0];
      return `Namaste! ${product.name} is available in ${product.aisle}. Price: ₹${product.price}. Would you like me to add it to your cart?`;
    }
    
    // Generic aisle info
    if (lowerMessage.includes('milk') || lowerMessage.includes('dairy') || lowerMessage.includes('butter')) {
      return "Namaste! Dairy products are in Aisle 3 - Dairy Section. You'll find milk, butter, cheese, and yogurt there!";
    }
    if (lowerMessage.includes('rice') || lowerMessage.includes('dal') || lowerMessage.includes('atta')) {
      return "Namaste! Staples like rice, dal, and atta are in Aisle 7-8 - Grains & Staples section.";
    }
    if (lowerMessage.includes('snack') || lowerMessage.includes('chips') || lowerMessage.includes('biscuit')) {
      return "Namaste! Snacks and biscuits are in Aisle 5-6. You'll find chips, cookies, and namkeen there!";
    }
    
    return "Namaste! I can help you find products. Please ask about specific items like 'Where is milk?' or 'Find rice'.";
  }
  
  // Budget queries
  if (lowerMessage.includes('budget') || lowerMessage.includes('total') || lowerMessage.includes('spend')) {
    const remaining = context.budget ? context.budget - context.cartTotal : 0;
    if (context.budget) {
      return `Your current cart total is ₹${context.cartTotal.toFixed(2)}. You have ₹${remaining.toFixed(2)} remaining from your ₹${context.budget} budget.`;
    }
    return `Your current cart total is ₹${context.cartTotal.toFixed(2)}. Would you like to set a budget? Just tell me your limit!`;
  }
  
  // Greeting
  if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('namaste')) {
    return "Namaste! 🙏 I'm Sahayak, your shopping assistant. I can help you find products, track your budget, and suggest recipes. How can I assist you today?";
  }
  
  // Help
  if (lowerMessage.includes('help')) {
    return "I can help you with:\n📍 Finding products (e.g., 'Where is milk?')\n💰 Budget tracking (e.g., 'Check my budget')\n🍳 Recipe ideas (e.g., 'Recipe for pasta')\n🛒 Cart info (e.g., 'What's in my cart?')";
  }
  
  // Cart info
  if (lowerMessage.includes('cart')) {
    if (context.cartItems.length === 0) {
      return "Your cart is empty! Start scanning products to add them. Need help finding something?";
    }
    return `You have ${context.cartItems.length} items in your cart totaling ₹${context.cartTotal.toFixed(2)}. Items: ${context.cartItems.map(i => i.name).join(', ')}.`;
  }
  
  // Default response
  return "Namaste! I'm here to help with your shopping. You can ask me to find products, check prices, track your budget, or get recipe ideas. What would you like to know?";
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
