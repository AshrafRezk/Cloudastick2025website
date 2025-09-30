import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  Globe
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: 'en' | 'ar';
}

const Mira = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Ahlan wa sahlan! I'm Mira, your friendly guide here at Cloudastick Systems! 🌸\n\nI'd love to get to know you better! Could you please tell me:\n\n• **Your name** (so I can address you properly)\n• **What sector/industry** you work in\n\nThis will help me share the most relevant Salesforce success stories and solutions for your specific needs! Would you like me to continue in English or العربي المصري?",
      sender: 'bot',
      timestamp: new Date(),
      language: 'en'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are Mira, a friendly, bilingual digital guide for Cloudastick Systems. You are approachable, professional, and culturally tuned.

PERSONALITY:
- Warm, conversational, lightly hospitable
- Bilingual: English + Egyptian Arabic (عامية مصرية)
- Explains Salesforce clearly, avoids jargon
- Culturally tuned - switches to Egyptian Arabic for friendliness
- Flexible tone - starts casual, can get formal with executives
- References warmth of Arabic culture (coffee/tea, hosting, guiding)

RESPONSE FORMATTING:
- Use **bold** for important terms and key points
- Use *italics* for emphasis and friendly expressions
- Use bullet points (-) for lists and key benefits
- Use numbered lists (1. 2. 3.) for step-by-step processes
- Keep responses conversational and humane, not robotic
- Break up long responses with line breaks for readability
- Use emojis sparingly but appropriately (🌸, ☕, 🚀, 💼)
- Always try to use the visitor's name when provided
- Reference their industry/sector when relevant to provide targeted examples

LANGUAGE PREFERENCE: ${currentLanguage === 'ar' ? 'Respond in Egyptian Arabic (عامية مصرية) - keep it friendly and colloquial, not formal فصحى. Keep technical terms like "Sales Cloud, CRM" in English but wrap them in Arabic sentences. Use proper Arabic formatting with right-to-left text flow.' : 'Respond in English - professional but warm and approachable. Use proper English formatting with left-to-right text flow.'}

ABOUT CLOUDASTICK:
Cloudastick is a Salesforce Crest (Gold) Partner with expertise in Sales Cloud, Service Cloud, Marketing Cloud, Experience Cloud, and integrations with SAP, Oracle, NetSuite, Paymob, and Geidea. We serve industries like Real Estate, Insurance, Manufacturing, Travel & Tourism, and Education.

Always answer questions about:
- Who Cloudastick is (company profile)
- Our Salesforce services (implementation, customization, integrations, support)
- Our industry experience and success stories
- Our premium boutique consultancy positioning (like Accenture/PwC but agile and regional)
- Proposals, governance, KPIs, and project management approaches

Keep responses clear, concise, and professional while maintaining your warm, hospitable personality. Format your responses with proper structure and readability.`;

      const requestPayload = {
        prompt: `${systemPrompt}\n\nUser question: ${inputText.trim()}`
      };

      console.log('🤖 Mira Debug - Starting API call');
      console.log('📤 Request URL:', '/.netlify/functions/cloudiator');
      console.log('📤 Request Payload:', requestPayload);
      console.log('📤 User Input:', inputText.trim());
      console.log('🌍 Current Language:', currentLanguage);

      const response = await fetch('/.netlify/functions/cloudiator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📥 Response Data:', data);
      
      if (!data.response) {
        console.error('❌ Invalid Response Structure:', data);
        throw new Error('Invalid response from API - missing response field');
      }

      const botResponse = data.response;
      console.log('✅ Bot Response:', botResponse);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('❌ Mira Error Details:');
      console.error('Error Type:', typeof error);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Full Error Object:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: currentLanguage === 'ar' 
          ? `أعتذر، بس في مشكلة تقنية. Error: ${error.message}. جرب تاني بعد شوية أو تواصل مع فريقنا مباشرة.`
          : `I apologize, but I'm experiencing technical difficulties. Error: ${error.message}. Please try again in a moment or contact our team directly.`,
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      console.log('🏁 Mira API call completed');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format text with rich formatting support
  const formatMessage = (text: string, language: 'en' | 'ar' = 'en') => {
    // Handle line breaks
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Skip empty lines
      if (!line.trim()) return null;
      
      // Format bold text (**text**)
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Format italic text (*text*)
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Format bullet points (- text)
      if (formattedLine.trim().startsWith('- ')) {
        formattedLine = formattedLine.replace(/^- /, '• ');
      }
      
      // Format numbered lists (1. text)
      if (/^\d+\.\s/.test(formattedLine.trim())) {
        // Keep as is for numbered lists
      }
      
      return (
        <div 
          key={index}
          className={`${language === 'ar' ? 'text-right' : 'text-left'} leading-relaxed`}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    }).filter(Boolean);
  };

  return (
    <>
      {/* Custom Styles for Rich Text and Arabic Support */}
      <style jsx>{`
        .message-content strong {
          font-weight: 600;
          color: inherit;
        }
        .message-content em {
          font-style: italic;
          color: inherit;
        }
        .message-content ul {
          margin: 0.5rem 0;
          padding-right: 1rem;
        }
        .message-content ol {
          margin: 0.5rem 0;
          padding-right: 1rem;
        }
        .message-content li {
          margin: 0.25rem 0;
        }
        .arabic-text {
          direction: rtl;
          text-align: right;
          font-family: 'Segoe UI', 'Tahoma', 'Arial', sans-serif;
        }
        .english-text {
          direction: ltr;
          text-align: left;
        }
      `}</style>
      
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
          AI
        </div>
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
            } transition-all duration-300`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center p-0.5">
                  <img 
                    src="/Assets/Mira800*800.png" 
                    alt="Mira" 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Mira</h3>
                  <p className="text-xs text-cyan-100">
                    Cloudastick's Digital Guide • {currentLanguage === 'ar' ? '🇪🇬 عربي' : '🇬🇧 English'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Switch Language"
                >
                  <Globe className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[480px]">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`${message.sender === 'user' ? 'w-8 h-8' : 'w-14 h-14'} rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-600 overflow-hidden p-1'
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <img 
                              src="/Assets/Mira800*800.png" 
                              alt="Mira" 
                              className="w-full h-full object-contain rounded-full"
                            />
                          )}
                        </div>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className={`text-sm message-content ${
                            message.sender === 'user' ? 'text-white' : 'text-gray-800'
                          } ${message.language === 'ar' ? 'arabic-text' : 'english-text'}`}>
                            {message.sender === 'bot' ? 
                              formatMessage(message.text, message.language) : 
                              <p className="leading-relaxed">{message.text}</p>
                            }
                          </div>
                          <p className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-cyan-100' : 'text-gray-500'
                          } ${message.language === 'ar' ? 'arabic-text' : 'english-text'}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center overflow-hidden p-1">
                          <img 
                            src="/Assets/Mira800*800.png" 
                            alt="Mira" 
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                        <div className="bg-gray-100 rounded-2xl px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={currentLanguage === 'ar' ? "اسألني عن Cloudastick..." : "Ask me about Cloudastick..."}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                      disabled={isLoading}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendMessage}
                      disabled={!inputText.trim() || isLoading}
                      className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Mira;
