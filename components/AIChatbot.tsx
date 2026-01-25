/**
 * AI Chatbot Component - Skipline Go
 * "Sahayak" - The Mall Concierge AI Assistant
 * 
 * Features:
 * - Real-time typing indicator
 * - Context-aware suggestions
 * - Product Navigation
 * - Budget Monitoring
 * - Recipe Suggestions
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, Loader2, MapPin, IndianRupee, ChefHat, Clock, Navigation, Mic, MicOff, Zap, ShoppingCart, TrendingUp } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CartItem, AIConversation, BudgetAlert } from '../types';
import { chatWithSahayak, getProductNavigation, checkBudgetStatus, getRecipeSuggestions } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

interface AIChatbotProps {
  mode: 'CUSTOMER' | 'STAFF';
  isOnline: boolean;
  cartItems?: CartItem[];
  cartTotal?: number;
  budget?: number;
  currentAisle?: string;
  onBudgetAlert?: (alert: BudgetAlert) => void;
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  prompt: string;
  color: string;
}

// Typing animation component
const TypingIndicator: React.FC<{ language: string }> = ({ language }) => {
  const typingText = language === 'mr' ? 'सहायक टाइप करत आहे...' 
    : language === 'hi' ? 'सहायक टाइप कर रहा है...' 
    : 'Sahayak is typing...';
  
  return (
    <div className="flex items-center gap-1 p-3">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-xs text-slate-500 ml-2">{typingText}</span>
    </div>
  );
};

export const AIChatbot: React.FC<AIChatbotProps> = ({ 
  mode, 
  isOnline,
  cartItems = [],
  cartTotal = 0,
  budget,
  currentAisle,
  onBudgetAlert
}) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Language-aware quick action labels
  const quickActionLabels = {
    en: {
      findProduct: 'Find Product',
      findPrompt: 'Where can I find ',
      budgetCheck: 'Budget Check',
      budgetPrompt: "How much have I spent and what's left?",
      recipeIdeas: 'Recipe Ideas',
      recipePrompt: 'Suggest recipes with my cart items',
      todaysDeals: "Today's Deals",
      dealsPrompt: "What are today's best deals?"
    },
    mr: {
      findProduct: 'उत्पादन शोधा',
      findPrompt: 'मला कुठे मिळेल ',
      budgetCheck: 'बजेट तपासा',
      budgetPrompt: 'मी किती खर्च केली आणि किती शिल्लक आहे?',
      recipeIdeas: 'रेसिपी आयडिया',
      recipePrompt: 'माझ्या कार्टमध्ये आयटमसह रेसिपी सुचवा',
      todaysDeals: 'आजच्या ऑफर्स',
      dealsPrompt: 'आजच्या सर्वोत्तम ऑफर्स कोणत्या?'
    },
    hi: {
      findProduct: 'प्रोडक्ट खोजें',
      findPrompt: 'मुझे कहां मिलेगा ',
      budgetCheck: 'बजट चेक',
      budgetPrompt: 'मैंने कितना खर्च किया और कितना बचा है?',
      recipeIdeas: 'रेसिपी आइडिया',
      recipePrompt: 'मेरे कार्ट आइटम्स के साथ रेसिपी सुझाएं',
      todaysDeals: 'आज की डील्स',
      dealsPrompt: 'आज की सबसे अच्छी डील्स क्या हैं?'
    }
  };
  
  const currentLabels = quickActionLabels[language] || quickActionLabels.en;

  // Enhanced quick actions with colors
  const quickActions: QuickAction[] = [
    { id: 'navigate', icon: <MapPin className="w-4 h-4" />, label: currentLabels.findProduct, prompt: currentLabels.findPrompt, color: 'bg-blue-500' },
    { id: 'budget', icon: <IndianRupee className="w-4 h-4" />, label: currentLabels.budgetCheck, prompt: currentLabels.budgetPrompt, color: 'bg-emerald-500' },
    { id: 'recipe', icon: <ChefHat className="w-4 h-4" />, label: currentLabels.recipeIdeas, prompt: currentLabels.recipePrompt, color: 'bg-orange-500' },
    { id: 'deals', icon: <Zap className="w-4 h-4" />, label: currentLabels.todaysDeals, prompt: currentLabels.dealsPrompt, color: 'bg-purple-500' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingText]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Typewriter effect for responses
  const typeResponse = async (text: string) => {
    setIsTyping(true);
    setTypingText('');
    
    const words = text.split(' ');
    let current = '';
    
    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? '' : ' ') + words[i];
      setTypingText(current);
      await new Promise(r => setTimeout(r, 30 + Math.random() * 20));
    }
    
    setIsTyping(false);
    setTypingText('');
    return text;
  };

  const handleSend = async (customPrompt?: string) => {
    const messageText = customPrompt || input.trim();
    if (!messageText || loading) return;
    
    setInput('');
    setShowQuickActions(false);
    
    const userMessage: AIConversation = {
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
      context: { cartTotal, budget, currentAisle }
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    if (!isOnline) {
      await new Promise(r => setTimeout(r, 500));
      const offlineResponse = "Namaste! 🙏 I'm in offline mode right now. Connect to Mall WiFi for full AI assistance. But don't worry - your cart and scanning still work perfectly!";
      const typed = await typeResponse(offlineResponse);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: typed,
        timestamp: Date.now()
      }]);
      setLoading(false);
      return;
    }

    try {
      const lowerMessage = messageText.toLowerCase();
      let response: string;

      // Smart intent detection
      if (lowerMessage.includes('where') || lowerMessage.includes('find') || lowerMessage.includes('aisle') || lowerMessage.includes('location')) {
        const productQuery = messageText.replace(/where|can|i|find|is|the|located|aisle|location/gi, '').trim();
        try {
          const navResult = await getProductNavigation(productQuery || messageText);
          response = `📍 **Found it!**\n\n**${navResult.productName}** is in **${navResult.aisle}**, ${navResult.section} section.\n\n${
            navResult.nearbyItems?.length 
              ? `💡 **While you're there:** ${navResult.nearbyItems.join(', ')}`
              : ''
          }`;
        } catch {
          response = `🗺️ **Store Layout:**\n\n• 🥬 Fresh Produce: Aisle 1-2\n• 🥛 Dairy: Aisle 3-4\n• 🍪 Snacks: Aisle 5-6\n• ☕ Beverages: Aisle 7-8\n• 🧴 Personal Care: Aisle 9-10\n• 🍜 Instant Food: Aisle 13-14\n• 🍚 Staples: Aisle 15-16\n\nTell me what you're looking for!`;
        }
      } else if (lowerMessage.includes('recipe') || lowerMessage.includes('cook') || lowerMessage.includes('make')) {
        try {
          const recipes = await getRecipeSuggestions(cartItems);
          response = recipes.length > 0
            ? `👨‍🍳 **Recipe Ideas:**\n\n${recipes.map((r, i) => `${i + 1}. ${r}`).join('\n\n')}\n\n*Based on your ${cartItems.length} cart items*`
            : "Add some veggies, protein, or spices to your cart and I'll suggest delicious recipes! 🍳";
        } catch {
          response = "I'd love to help with recipes! Add a few items to your cart first 🛒";
        }
      } else if (lowerMessage.includes('budget') || lowerMessage.includes('spend') || lowerMessage.includes('left') || lowerMessage.includes('money') || lowerMessage.includes('spent')) {
        if (budget) {
          const remaining = budget - cartTotal;
          const percent = Math.round((cartTotal / budget) * 100);
          response = `💰 **Budget Status:**\n\n• **Budget:** ₹${budget}\n• **Spent:** ₹${cartTotal.toFixed(2)} (${percent}%)\n• **Remaining:** ₹${remaining.toFixed(2)}\n\n${
            percent > 80 ? '⚠️ You\'re close to your limit!' : percent > 50 ? '📊 Halfway through your budget' : '✅ Plenty of budget left!'
          }`;
        } else {
          response = `🛒 **Your Cart:** ₹${cartTotal.toFixed(2)}\n\n${cartItems.length} items total.\n\nWant me to set a budget? Just say "set budget to ₹1000"`;
        }
      } else if (lowerMessage.includes('deal') || lowerMessage.includes('offer') || lowerMessage.includes('discount') || lowerMessage.includes('sale')) {
        response = `🔥 **Today's Hot Deals:**\n\n1. 🥛 **Amul Products** - 10% off on bulk\n2. 🍜 **Maggi Noodles** - Buy 4 Get 1 Free\n3. ☕ **Nescafe Coffee** - ₹50 off on 200g pack\n4. 🧴 **Personal Care** - Flat 15% off\n\n*Deals auto-applied at checkout!*`;
      } else if (lowerMessage.includes('cart') || lowerMessage.includes('items') || lowerMessage.includes('what did i')) {
        if (cartItems.length > 0) {
          response = `🛒 **Your Cart (${cartItems.length} items):**\n\n${cartItems.slice(0, 5).map(item => `• ${item.name} ×${item.quantity} — ₹${(item.price * item.quantity).toFixed(0)}`).join('\n')}${cartItems.length > 5 ? `\n• ...and ${cartItems.length - 5} more` : ''}\n\n**Total: ₹${cartTotal.toFixed(2)}**`;
        } else {
          response = "Your cart is empty! 🛒\n\nStart scanning products to add them. I'm here to help find anything!";
        }
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste') || lowerMessage.includes('help') || lowerMessage.includes('hey')) {
        response = `Namaste! 🙏 I'm **Sahayak**, your AI shopping assistant!\n\n**I can help with:**\n• 📍 Finding products\n• 💰 Budget tracking\n• 👨‍🍳 Recipe ideas\n• 🔥 Today's deals\n\nWhat do you need?`;
      } else if (lowerMessage.includes('thank')) {
        response = `You're welcome! 🙏\n\nHappy to help. Enjoy your shopping! 🛍️`;
      } else {
        try {
          response = await chatWithSahayak(messageText, {
            cartItems,
            cartTotal,
            budget,
            currentAisle
          });
        } catch {
          response = `I'm here to help! 🙏 Try asking:\n\n• "Where is pasta?"\n• "What's in my cart?"\n• "Recipe ideas"\n• "Today's deals"`;
        }
      }

      const typed = await typeResponse(response);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: typed,
        timestamp: Date.now()
      }]);
    } catch (err) {
      const errorMsg = "Oops! Let me try that again. 🙏";
      const typed = await typeResponse(errorMsg);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: typed,
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    if (action.id === 'navigate') {
      setInput(action.prompt);
      inputRef.current?.focus();
    } else {
      handleSend(action.prompt);
    }
  };

  const renderMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={i} className="block text-slate-900">{line.replace(/\*\*/g, '')}</strong>;
      }
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={i}>
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          </p>
        );
      }
      if (line.startsWith('•') || line.startsWith('-')) {
        return <li key={i} className="ml-4 text-sm">{line.substring(1).trim()}</li>;
      }
      if (line.match(/^\d+\./)) {
        return <li key={i} className="ml-4 text-sm list-decimal">{line.substring(line.indexOf('.') + 1).trim()}</li>;
      }
      if (line.startsWith('*') && line.endsWith('*')) {
        return <p key={i} className="text-xs text-slate-500 italic mt-2">{line.replace(/\*/g, '')}</p>;
      }
      return line ? <p key={i}>{line}</p> : <br key={i} />;
    });
  };

  return (
    <div className="fixed bottom-32 right-6 z-[60]">
      {isOpen ? (
        <GlassCard className="w-96 h-[560px] flex flex-col p-0 overflow-hidden border-2 border-amber-200 shadow-2xl animate-in slide-in-from-bottom-10">
          {/* Header with pulse animation */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 flex items-center justify-between text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg">Sahayak</span>
                  <div className="flex items-center gap-1 bg-emerald-500 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold uppercase">Live</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/80">Your AI Shopping Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm relative z-10">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-slate-50 to-white">
            {messages.length === 0 && (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Sparkles className="w-10 h-10 text-amber-600" />
                </div>
                <p className="font-black text-xl text-slate-900 mb-1">
                  {language === 'mr' ? 'नमस्कार! 🙏' : language === 'hi' ? 'नमस्ते! 🙏' : 'Namaste! 🙏'}
                </p>
                <p className="text-sm text-slate-500">
                  {language === 'mr' ? 'मी सहायक, तुमचा AI सहाय्यक' : language === 'hi' ? 'मैं सहायक, आपका AI असिस्टेंट' : "I'm Sahayak, your AI assistant"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'mr' ? 'काहीही विचारा!' : language === 'hi' ? 'कुछ भी पूछें!' : 'Ask me anything!'}
                </p>
              </div>
            )}
            
            {/* Quick Actions with colors */}
            {messages.length === 0 && showQuickActions && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className="flex items-center gap-2 p-3 bg-white rounded-2xl border-2 border-slate-100 hover:border-amber-300 hover:shadow-lg transition-all text-left group"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{action.label}</span>
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-50`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-tr-sm shadow-lg' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm shadow-md'
                }`}>
                  {m.role === 'assistant' ? renderMessage(m.content) : m.content}
                </div>
              </div>
            ))}
            
            {/* Typing indicator with animation */}
            {isTyping && typingText && (
              <div className="flex justify-start animate-in fade-in-50">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm bg-white text-slate-700 border border-slate-100 shadow-md text-sm leading-relaxed">
                  {renderMessage(typingText)}
                  <span className="inline-block w-2 h-4 bg-amber-500 ml-1 animate-pulse" />
                </div>
              </div>
            )}
            
            {loading && !isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-2 shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-100 shadow-md">
                  <TypingIndicator language={language} />
                </div>
              </div>
            )}
          </div>

          {/* Smart Context Bar */}
          {(cartItems.length > 0 || budget) && (
            <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-amber-800">{cartItems.length} items</span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-700">₹{cartTotal.toFixed(0)}</span>
              </div>
              {budget && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${cartTotal > budget * 0.8 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  <TrendingUp className="w-3 h-3" />
                  <span className="font-bold">₹{(budget - cartTotal).toFixed(0)} left</span>
                </div>
              )}
            </div>
          )}

          {/* Input with better UX */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'mr' ? 'संदेश टाइप करा...' : language === 'hi' ? 'संदेश टाइप करें...' : 'Type a message...'}
              className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 ring-amber-400 focus:bg-white transition-all"
            />
            <button 
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-2xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </GlassCard>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/40 hover:scale-110 hover:shadow-amber-500/60 transition-all group relative animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
          <Bot className="w-8 h-8 relative z-10" />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {language === 'mr' ? 'सहायक AI शी चॅट करा' : language === 'hi' ? 'सहायक AI से चैट करें' : 'Chat with Sahayak AI'}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        </button>
      )}
    </div>
  );
};

