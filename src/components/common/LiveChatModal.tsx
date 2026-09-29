import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { X, Send, Bot, User, Sparkles, PhoneCall } from 'lucide-react';

export const LiveChatModal: React.FC = () => {
  const { isLiveChatOpen, setIsLiveChatOpen, cmsData } = useCMS();
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: `مرحباً بك في مستشار أوريكس الفوري للحلول الذكية! 👋 كيف يمكننا مساعدتك اليوم في تطوير منشأتك؟`,
      time: 'الآن',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isLiveChatOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: inputText,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = inputText;
    setInputText('');

    // Simulate smart support bot response
    setTimeout(() => {
      let replyText = `أهلاً بك! نسعد برغبتك في الاستفسار عن: "${currentQuery}". يمكنك حجز جلسة استشارية مباشرة مع مستشارينا عبر الواتساب المباشر أو تعبئة نموذج التواصل.`;
      if (currentQuery.includes('سعر') || currentQuery.includes('تكلفة') || currentQuery.includes('عرض')) {
        replyText = `عروضنا مخصصة وفقاً لحجم المنشأة. لدينا حالياً حزمة التحول الرقمي بخصم 30%. يسرنا تزويدك بالعرض التفصيلي عبر البريد أو الواتساب المباشر: ${cmsData.contact.whatsappNumber}`;
      } else if (currentQuery.includes('مكان') || currentQuery.includes('فرع') || currentQuery.includes('عنوان')) {
        replyText = `مقرنا الرئيسي في ${cmsData.contact.address}. ويسعدنا استقبالك أو تنظيم اجتماع زوم مرئي في الوقت المناسب لك.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-amber-950/80 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900"></span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>مساعد أوريكس الذكي</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h4>
            <span className="text-[10px] text-emerald-400 font-medium">متصل الآن • رد فوري</span>
          </div>
        </div>
        <button
          onClick={() => setIsLiveChatOpen(false)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60 custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="اكتب استفسارك هنا..."
          className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
