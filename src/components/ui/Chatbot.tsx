"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, User, Bot, Phone, HelpCircle } from 'lucide-react';
import { useChatbot, Message } from '@/contexts/ChatbotContext';
import Image from 'next/image';

interface Question {
  id: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
}

export default function Chatbot() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const { isOpen, setIsOpen, messages, setMessages } = useChatbot();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [workingHours, setWorkingHours] = useState({ start: 10, end: 22 });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isArabicText = (text: string) => /[\u0600-\u06FF]/.test(text);

  // NLP Helpers
  const getLevenshteinDistance = (a: string, b: string): number => {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[a.length][b.length];
  };

  const getSimiliarity = (s1: string, s2: string): number => {
    const longer = s1.length > s2.length ? s1 : s2;
    if (longer.length === 0) return 1.0;
    return (longer.length - getLevenshteinDistance(s1, s2)) / longer.length;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/site-content');
        if (res.ok) {
          const data = await res.json();
          if (data.chatbot && data.chatbot.questions) {
            setQuestions(data.chatbot.questions);
          }
          if (data.settings && data.settings.whatsapp_number) {
            setWhatsappNumber(data.settings.whatsapp_number);
          }
          if (data.settings) {
            setWorkingHours({
              start: data.settings.working_hour_start ?? 10,
              end: data.settings.working_hour_end ?? 22
            });
          }
        }
      } catch (err) {
        console.error("Chatbot data load error:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = isRTL 
        ? "مرحباً بك في نتي ساينتستس! كيف يمكنني مساعدتك اليوم؟"
        : "Welcome to Nutty Scientists! How can I help you today?";
      
      setMessages([{
        id: 'welcome',
        text: welcomeMsg,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, isRTL, messages.length, setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleQuestionClick = (q: Question) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text: isRTL ? q.question_ar : q.question_en,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    
    setIsTyping(true);
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: isRTL ? q.answer_ar : q.answer_en,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleTextSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    const query = inputText.toLowerCase().trim();
    setInputText('');
    
    setIsTyping(true);
    setTimeout(() => {
      let botResponse = "";

      // Check for common greetings with fuzzy matching
      const greetings_en = ["hi", "hello", "hey", "greetings", "good morning", "good evening", "howdy", "sup", "how are you", "whats up", "what's up"];
      const greetings_ar = ["مرحبا", "اهلا", "هلو", "السلام عليكم", "صباح الخير", "مساء الخير", "هلا", "كيفك", "كيف الحال", "اخبارك", "منور", "ازيك", "هلا والله"];
      
      const isArabic = /[\u0600-\u06FF]/.test(query);

      const checkGreeting = (str: string, wordList: string[]) => {
        // Direct match or word match
        const words = str.split(/\s+/);
        if (wordList.some(g => str === g || words.includes(g))) return true;
        // Fuzzy match for long words or greeting phrases
        return wordList.some(g => getSimiliarity(str, g) > 0.8);
      };

      if (checkGreeting(query, greetings_en)) {
        botResponse = "Hello! How can I help you today?";
      } else if (checkGreeting(query, greetings_ar)) {
        botResponse = "أهلاً بك! كيف يمكنني مساعدتك اليوم؟";
      } else {
        // Site Knowledge Base for Navigation
        const siteKnowledge = [
          {
            id: 'services',
            keywords: ["خدمات", "برامج", "كورسات", "نشاطات", "تجارب", "services", "programs", "activities", "experiments", "what do you do"],
            answer_ar: "نقدم مجموعة متنوعة من البرامج العلمية المرحة، منها ورش العمل، المعسكرات، وأعياد الميلاد العلمية. يمكنك رؤية كل خدماتنا هنا: [صفحة الخدمات](/services)",
            answer_en: "We offer a variety of fun scientific programs, including workshops, camps, and science parties. You can see all our services here: [Services Page](/services)"
          },
          {
            id: 'workshops',
            keywords: ["ورش", "ورشه", "workshops", "workshop"],
            answer_ar: "ورش العمل لدينا تفاعلية وممتعة جداً للأطفال! استكشف تفاصيل ورش العمل هنا: [ورش العمل](/services?category=families)",
            answer_en: "Our workshops are interactive and very fun for kids! Explore workshop details here: [Workshops](/services?category=families)"
          },
          {
            id: 'camps',
            keywords: ["معسكر", "كامب", "camps", "camp"],
            answer_ar: "نقدم معسكرات علمية مذهلة خلال الإجازات. تفقد المعسكرات القادمة: [المعسكرات](/services?category=families)",
            answer_en: "We offer amazing science camps during holidays. Check out upcoming camps: [Camps](/services?category=families)"
          },
          {
            id: 'about',
            keywords: ["من انتم", "قصتكم", "قصة", "فاروق", "عبارة عن", "مين", "نتي", "نوتي", "who are you", "about us", "story", "team", "what is"],
            answer_ar: "نحن نهدف لجعل العلوم ممتعة للأطفال حول العالم! نتي ساينتستس هي الرائدة عالمياً في البرامج العلمية التفاعلية. اقرأ قصتنا هنا: [عن نتي ساينتستس](/about)",
            answer_en: "We aim to make science fun for kids around the world! Nutty Scientists is the global leader in interactive science programs. Read our story here: [About Nutty Scientists](/about)"
          },
          {
            id: 'schools',
            keywords: ["مدرسة", "مدرسه", "مدارس", "تعليم", "تلاميذ", "طلاب", "school", "schools", "education", "student", "students"],
            answer_ar: "نحن نقدم برامج علمية مميزة للمدارس والمراكز التعليمية. استكشف برامجنا المدرسية هنا: [برامج المدارس](/services?category=schools)",
            answer_en: "We provide unique science programs for schools and educational centers. Explore our school programs here: [School Programs](/services?category=schools)"
          },
          {
            id: 'corporate',
            keywords: ["شركة", "شركات", "موظفين", "فعالية", "فعاليات", "تيم بلدينج", "شركاء", "corporate", "company", "companies", "employees", "events", "event", "team building"],
            answer_ar: "نحن نقدم تجارب علمية فريدة وممتعة لفعاليات الشركات وتطوير الفريق. استكشف خدمات الشركات هنا: [فعاليات الشركات](/services?category=corporate)",
            answer_en: "We offer unique and fun science experiences for corporate events and team building. Explore our corporate services here: [Corporate Events](/services?category=corporate)"
          },
          {
            id: 'careers',
            keywords: ["وظيفة", "شغل", "توظيف", "انضمام", "careers", "jobs", "work with us", "hiring"],
            answer_ar: "يسعدنا دائماً انضمام مبدعين جدد لفريقنا! يمكنك التقديم من هنا: [انضم إلينا](/careers)",
            answer_en: "We're always looking for creative people to join our team! You can apply here: [Careers](/careers)"
          },
          {
            id: 'blog',
            keywords: ["مقالات", "نصائح", "علمية", "blog", "articles", "tips", "news"],
            answer_ar: "اكتشف أحدث المقالات والنصائح العلمية في مدونتنا: [المدونة](/blog)",
            answer_en: "Discover the latest scientific articles and tips in our blog: [Blog](/blog)"
          },
          {
            id: 'csr',
            keywords: ["مسؤولية", "مجتمعية", "أثر", "مجتمع", "تبرع", "مساعدة", "csr", "social responsibility", "impact", "society", "community", "giving back"],
            answer_ar: "نحن نهتم بمجتمعنا! نقوم بالعديد من المبادرات المجتمعية لخدمة الأطفال في كل مكان. اقرأ عن أثرنا هنا: [المسؤولية المجتمعية](#csr)",
            answer_en: "We care about our community! We conduct many initiatives to serve children everywhere. Read about our impact here: [Social Responsibility](#csr)"
          }
        ];

        // Intent/Synonym Mapping
        const intents = [
          { keywords: ["سعر", "اسعار", "بكام", "تكلفة", "فلوس", "مصاريف", "قسط", "price", "cost", "money", "how much", "fees"], topic: "price", labelAr: "الأسعار", labelEn: "Prices" },
          { keywords: ["مكان", "عنوان", "فين", "موقع", "فروع", "لوكيشن", "location", "address", "where", "place", "found"], topic: "location", labelAr: "الموقع", labelEn: "Location" },
          { keywords: ["موعد", "مواعيد", "وقت", "ساعة", "ساعات", "متى", "فتح", "قفل", "شغالين", "hours", "time", "when", "open", "close"], topic: "hours", labelAr: "مواعيد العمل", labelEn: "Working Hours" },
          { keywords: ["حجز", "اشتراك", "تسجيل", "انضمام", "تقديم", "سجل", "book", "reserve", "register", "join", "sign up", "apply"], topic: "booking", labelAr: "الحجز", labelEn: "Booking" },
          { keywords: ["نشاط", "تجارب", "عرض", "برنامج", "فعالية", "كورس", "كورسات", "activities", "experiments", "shows", "programs", "events", "course"], topic: "activities", labelAr: "الأنشطة", labelEn: "Activities" },
          { keywords: ["دعم", "خدمة العملاء", "تواصل", "تكلم", "اتصل", "رقم", "واتس", "support", "help", "customer service", "contact", "call", "whatsapp", "phone"], topic: "support", labelAr: "الدعم الفني", labelEn: "Support" },
          { keywords: ["مسؤولية", "مجتمع", "أثر", "رعاية", "csr", "social", "impact", "community", "sponsor", "society"], topic: "csr", labelAr: "المسؤولية المجتمعية", labelEn: "CSR" }
        ];

        // Find best FAQ match using Fuzzy Logic + Intent Mapping
        let bestMatch: { q: Question, score: number } | null = null;

        for (const q of questions) {
          const qTextEn = q.question_en.toLowerCase();
          const qTextAr = q.question_ar.toLowerCase();
          
          // 1. Direct contains check (Highest Priority)
          if (qTextEn.includes(query) || query.includes(qTextEn) || qTextAr.includes(query) || query.includes(qTextAr)) {
            if (!bestMatch || bestMatch.score < 0.95) {
              bestMatch = { q, score: 0.95 };
            }
          }

          // 2. Fuzzy similarity check
          const scoreEn = getSimiliarity(query, qTextEn);
          const scoreAr = getSimiliarity(query, qTextAr);
          const maxFuzzy = Math.max(scoreEn, scoreAr);
          if (maxFuzzy > 0.75 && (!bestMatch || maxFuzzy > bestMatch.score)) {
            bestMatch = { q, score: maxFuzzy };
          }

          // 3. Intent Keyword Check
          for (const intent of intents) {
            const hasKeyword = intent.keywords.some(k => query.includes(k) || getSimiliarity(query, k) > 0.85);
            if (hasKeyword) {
              const qAndA = (q.question_en + q.answer_en + q.question_ar + q.answer_ar).toLowerCase();
              const hasTopicMatch = intent.keywords.some(k => qAndA.includes(k));
              if (hasTopicMatch && (!bestMatch || bestMatch.score < 0.85)) {
                bestMatch = { q, score: 0.85 };
              }
            }
          }
        }

        if (bestMatch && bestMatch.score > 0.65) {
          botResponse = isArabic ? bestMatch.q.answer_ar : bestMatch.q.answer_en;
        } else {
          // 4. Site Knowledge Discovery Check
          let discoveryMatch = null;
          for (const item of siteKnowledge) {
            if (item.keywords.some(k => query.includes(k) || getSimiliarity(query, k) > 0.85)) {
              discoveryMatch = item;
              break;
            }
          }

          if (discoveryMatch) {
            botResponse = isArabic ? discoveryMatch.answer_ar : discoveryMatch.answer_en;
          } else {
            // Special check for "Support" intent even if no FAQ found
            const isSupportIntent = intents.find(i => i.topic === 'support')?.keywords.some(k => query.includes(k) || getSimiliarity(query, k) > 0.85);
            
            if (isSupportIntent) {
              botResponse = isRTL 
                ? "يمكنك التواصل معنا مباشرة عبر الواتساب للمساعدة الفورية:"
                : "You can contact us directly via WhatsApp for immediate assistance:";
              
              const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
                showSupportButton: true
              };
              setMessages(prev => [...prev, botMsg]);
              setIsTyping(false);
              return;
            }

            // Fallback logic depends on working hours
            const now = new Date();
            const currentHour = now.getHours();
            const isWorkingNow = currentHour >= workingHours.start && currentHour < workingHours.end;

            if (isWorkingNow) {
              botResponse = isArabic 
                ? "للمساعدة في هذا الاستفسار، يمكنك التحدث معنا مباشرة:"
                : "For help with this inquiry, you can talk to us directly:";
              
              const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
                showSupportButton: true
              };
              setMessages(prev => [...prev, botMsg]);
            } else {
              botResponse = isArabic
                ? `عذراً، نحن خارج أوقات العمل حالياً. مواعيدنا من ${workingHours.start} ص حتى ${workingHours.end > 12 ? workingHours.end - 12 : workingHours.end} م. يرجى مراسلتنا لاحقاً.`
                : `Sorry, we are currently closed. Our hours are ${workingHours.start}:00 to ${workingHours.end}:00. Please contact us later.`;
              
              const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
                showSupportButton: false
              };
              setMessages(prev => [...prev, botMsg]);
            }
            setIsTyping(false);
            return;
          }
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleWhatsAppChat = () => {
    const message = encodeURIComponent(isRTL ? "مرحباً، أود التحدث مع خدمة العملاء." : "Hello, I would like to talk to customer service.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  if (!whatsappNumber && questions.length === 0) return null;

  return (
    <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-[9999] group/chatbot`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`absolute bottom-20 ${isRTL ? 'left-0' : 'right-0'} bg-white dark:bg-gray-800 w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-10rem)] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-nutty-orange to-nutty-blue p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                   <Bot className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight">{isRTL ? "مساعد نتي" : "Nutty Assistant"}</h3>
                <p className="text-xs text-white/80 font-bold">{isRTL ? "متصل الآن" : "Online now"}</p>
              </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50 scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-bold shadow-md transition-all ${
                  msg.sender === 'user' 
                    ? 'bg-nutty-blue text-white rounded-br-none border border-blue-600/20' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                }`}>
                  {/* Parse basic markdown links [text](url) */}
                  {msg.text.split(/(\[.*?\]\(.*?\))/g).map((part, i) => {
                    const match = part.match(/\[(.*?)\]\((.*?)\)/);
                    if (match) {
                      return (
                        <a 
                          key={i} 
                          href={match[2]} 
                          className="text-nutty-blue dark:text-nutty-cyan underline hover:no-underline"
                        >
                          {match[1]}
                        </a>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
                  
                  {msg.showSupportButton && (
                    <button
                      onClick={handleWhatsAppChat}
                      className="mt-3 w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black flex items-center justify-center gap-2 transition-all text-xs shadow-sm active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {isArabicText(msg.text) ? "التحدث مع خدمة العملاء" : "Talk to Support"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input & Suggestions Tray */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            {/* Suggestions */}
            <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex-shrink-0">
                {isRTL ? "أسئلة مقترحة:" : "Suggested:"}
              </p>
              <div className="flex gap-2">
                {questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionClick(q)}
                    className="px-3 py-1 bg-gray-50 dark:bg-gray-700/50 hover:bg-nutty-blue hover:text-white transition-all rounded-xl text-[10px] font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 whitespace-nowrap"
                  >
                    {isRTL ? q.question_ar : q.question_en}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input */}
            <form onSubmit={handleTextSend} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRTL ? "اكتب رسالة..." : "Type a message..."}
                className="flex-1 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-nutty-blue transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-2xl bg-nutty-blue text-white flex items-center justify-center disabled:opacity-50 active:scale-90 transition-all shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            
            {/* WhatsApp CTA - Only show during working hours */}
            {(() => {
              const now = new Date();
              const currentHour = now.getHours();
              const isWorkingNow = currentHour >= workingHours.start && currentHour < workingHours.end;
              
              if (!isWorkingNow) return null;

              return (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={handleWhatsAppChat}
                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    {isRTL ? "التحدث مع خدمة العملاء" : "Chat with Customer Service"}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-16 h-16 bg-nutty-orange text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all z-50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-nutty-orange to-nutty-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? (
          <X className="w-8 h-8 relative z-10" />
        ) : (
          <MessageCircle className="w-8 h-8 relative z-10" />
        )}
      </button>

      {/* Pulsing decoration when closed */}
      {!isOpen && (
        <div className="absolute inset-0 w-16 h-16 bg-nutty-orange rounded-full animate-ping opacity-20 pointer-events-none"></div>
      )}
    </div>
  );
}
