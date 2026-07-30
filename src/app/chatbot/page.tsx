// FitLife AI - Interactive AI Chatbot Coach
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Trash2, HelpCircle, ShieldAlert, Sparkles, MessageCircle 
} from 'lucide-react';
import { generateAIResponse, ChatMessage } from '@/lib/ai-service';
import GlassCard from '@/components/GlassCard';

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome greeting
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hi there! I'm your FitLife AI Coach. 🏋️‍♂️

I can help answer your questions about:
- **Exercise Form**: E.g. "How do I perform a Romanian Deadlift?"
- **Pain Modifications**: E.g. "I have knee pain, what can I swap for squats?"
- **Nutrition**: E.g. "Give me diet tips for muscle gain"
- **PED Warnings**: E.g. "What are the health risks of anabolic steroids?"

*Remember: Always consult a primary doctor before starting any intense physical protocols.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const responseContent = await generateAIResponse(textToSend, messages);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear entire conversation history?')) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Chat history cleared. How can I help you check your routines or calories today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const suggestionPrompts = [
    { label: 'Knee Pain Squat Swap', prompt: 'I feel knee pain, what should I swap for squats?' },
    { label: 'Allergy Meal Guidance', prompt: 'Suggest a meal plan without milk or gluten' },
    { label: 'Sleep & Muscle Recovery', prompt: 'Why is sleep important for muscle recovery?' },
    { label: 'Steroid Cycle Health Risks', prompt: 'Are anabolic steroids safe for bodybuilding?' }
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 py-2 max-w-4xl mx-auto w-full h-[calc(100vh-140px)]">
      {/* Header Info Panel */}
      <div className="flex items-center justify-between border-b border-border-color pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-emerald/10 text-brand-emerald">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-1.5">
              <span>AI Fitness Coach</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald font-mono uppercase">Interactive</span>
            </h1>
            <p className="text-[10px] text-foreground/50">Ask workout, calorie, or safety questions</p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2 rounded-lg hover:bg-rose-500/10 text-foreground/60 hover:text-rose-500 transition-colors cursor-pointer"
          title="Clear Chat Logs"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Main Chat Area */}
      <GlassCard className="flex-1 overflow-hidden p-0 border-brand-emerald/10 flex flex-col relative min-h-[300px]">
        {/* Medical disclaimer header */}
        <div className="bg-amber-500/5 border-b border-amber-500/15 p-3 flex items-start gap-2.5 text-[10px] text-foreground/75 leading-relaxed shrink-0">
          <ShieldAlert className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
          <p>
            <strong>Medical Notice:</strong> Information supplied here is simulated and educational. Always check with a certified physical therapist or doctor for injuries, heart conditions, or allergies.
          </p>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser ? 'bg-indigo-500 text-white' : 'bg-brand-emerald text-white'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className="space-y-1">
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser 
                      ? 'bg-indigo-500 text-white rounded-tr-none' 
                      : 'bg-gray-500/5 text-foreground border border-border-color rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <div className={`text-[8px] text-foreground/40 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-brand-emerald text-white shrink-0 flex items-center justify-center text-xs font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-500/5 border border-border-color rounded-tl-none flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald animate-bounce delay-100" />
                <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald animate-bounce delay-200" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion prompt links */}
        <div className="p-3 border-t border-border-color bg-gray-500/5 flex flex-wrap gap-2 shrink-0">
          <span className="text-[9px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1 w-full mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need Inspiration? Tap a Suggestion:</span>
          </span>
          {suggestionPrompts.map((sg) => (
            <button
              key={sg.label}
              onClick={() => handleSend(sg.prompt)}
              className="text-[10px] font-semibold px-3 py-1.5 rounded-xl border border-border-color bg-background hover:border-brand-emerald/40 transition-colors cursor-pointer"
            >
              {sg.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border-color shrink-0">
          <div className="flex gap-2 relative">
            <input
              type="text"
              placeholder="Ask anything about fitness/nutrition..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              className="flex-1 pl-4 pr-12 py-3 rounded-2xl border border-border-color bg-background/50 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-xs outline-none transition-all"
            />
            <button
              onClick={() => handleSend(inputValue)}
              className="absolute right-1.5 top-1.5 p-2 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white transition-colors cursor-pointer"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
