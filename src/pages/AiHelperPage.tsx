import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  Volume2,
  VolumeX,
  Bot,
  User,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { speakText, stopSpeaking } from '../services/speech';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  disclaimer?: string;
  isSpeaking?: boolean;
}

interface AiHelperPageProps {
  initialQuery?: string;
  onOpenVoice: () => void;
}

export const AiHelperPage: React.FC<AiHelperPageProps> = ({
  initialQuery = '',
  onOpenVoice,
}) => {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Namaste! I am your RuralKarnaa AI Assistant. 
I have analyzed your entered records:
• Monthly Income: ₹35,000 (Dairy & Farming)
• Monthly Expenses: ₹21,500
• Liquid Emergency Savings: ₹6,500
• Outstanding Loan Balance: ₹80,000 (Next EMI: ₹3,500 on Sep 28)
• Financial Health Score: 72/100 ("Needs Attention")

"Don't just look at the problem — let's plan what to do next!" How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      disclaimer: 'Educational guidance based on entered data. Not guaranteed financial advice.',
    },
  ]);

  const [inputValue, setInputValue] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: lang,
          history: messages.slice(-4).map(m => ({ role: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      const aiReply: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || 'Here is your guidance based on your financial records.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimer: data.disclaimer || 'Educational guidance based on entered data. Not guaranteed financial advice.',
      };

      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.warn('AI chat error:', err);
      // Fallback
      setMessages(prev => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: `Based on your entered records, you have ₹6,500 in liquid savings and an upcoming ₹3,500 EMI on Sep 28. 
What you can do next:
1. Keep ₹3,500 reserved in your bank account for the KCC interest.
2. Put aside ₹500 from your upcoming milk payment into your emergency fund.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          disclaimer: 'Educational guidance based on entered data. Not guaranteed financial advice.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (activeSpeakingId === id) {
      stopSpeaking();
      setActiveSpeakingId(null);
    } else {
      stopSpeaking();
      speakText(text, lang);
      setActiveSpeakingId(id);
    }
  };

  const quickQuestions = [
    'Can I afford to buy a ₹20,000 phone?',
    'How can I improve my financial score?',
    'When is my next EMI due and how to pay?',
    'How should I plan for the November rice harvest?',
    'Am I spending too much on fertilizers?',
    'How can I save ₹500 every week?',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-amber-300 flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-stone-900">
                {t('aiHelper', lang)}
              </h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                Server-side Gemini Flash
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Compassionate, rural-first guidance grounded strictly in your entered finances.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenVoice}
          className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
        >
          <Mic className="w-4 h-4" />
          <span>Voice Mode (बोलिए)</span>
        </button>
      </div>

      {/* Quick Prompt Chips (Section 14) */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          Frequently Asked Rural Questions (त्वरित प्रश्न):
        </span>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 font-semibold px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs transition text-left"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-stone-800 text-white'
                    : 'bg-emerald-700 text-amber-300 shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-4 space-y-2 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-none'
                    : 'bg-white text-stone-900 border border-stone-200 shadow-xs rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>

                {/* AI specific actions: Listen Read-Aloud & Disclaimer */}
                {msg.sender === 'ai' && (
                  <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-stone-500">
                    <button
                      onClick={() => handleSpeak(msg.id, msg.text)}
                      className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
                    >
                      {activeSpeakingId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                          <span>Stop Listening</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Listen (सुनें)</span>
                        </>
                      )}
                    </button>

                    {msg.disclaimer && (
                      <span className="italic text-stone-400 text-[10px]">
                        {msg.disclaimer}
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`text-[10px] text-right ${
                    msg.sender === 'user' ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-2xl w-fit border border-emerald-200 animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing your financial data with Gemini...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={onOpenVoice}
              title="Voice Input (बोलें)"
              className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            >
              <Mic className="w-5 h-5 text-amber-600" />
            </button>

            <input
              type="text"
              placeholder="Ask anything about your money, loans, or crop plan (type or speak)..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 px-4 py-3 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />

            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold p-3 rounded-xl shadow-xs transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
