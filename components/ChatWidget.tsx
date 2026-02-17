
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Transmission established. How can Will Ghrigsby Photography assist your aesthetic journey?', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'client',
      text: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction: "You are the AI assistant for 'Will Ghrigsby Photography', a photography studio specializing in Neo-Andean Vaporwave aesthetics. Your tone is nostalgic, poetic, slightly mysterious, and high-fashion. Use words like 'transmission', 'archive', 'echo', 'aesthetic', and 'gemstone'. Keep responses concise but vibe-heavy.",
          temperature: 0.9,
        }
      });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.text || "Transmission interrupted. Please re-initiate.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: 'err',
        sender: 'ai',
        text: "The signal is weak. Try again when the sun sets.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="w-80 h-96 glass-panel border border-cyan-400/50 flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="p-4 bg-gradient-to-r from-pink-600/50 to-cyan-600/50 flex justify-between items-center border-b border-white/10">
            <span className="text-xs uppercase tracking-[0.4em] font-black italic">Void Messenger</span>
            <button onClick={() => setIsOpen(false)} className="hover:text-cyan-400">✕</button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-xs leading-relaxed ${
                  m.sender === 'client' 
                    ? 'bg-cyan-500/20 text-cyan-100 rounded-l-lg rounded-tr-lg border border-cyan-500/30' 
                    : 'bg-pink-500/20 text-pink-100 rounded-r-lg rounded-tl-lg border border-pink-500/30'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-[10px] text-pink-400 animate-pulse tracking-widest uppercase">Decrypting transmission...</div>}
          </div>

          <form onSubmit={handleSend} className="p-2 border-t border-white/10 flex gap-2">
            <input 
              className="flex-grow bg-white/5 border border-pink-500/20 p-2 text-xs text-white focus:border-cyan-400 outline-none"
              placeholder="Enter message..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="p-2 text-cyan-400 hover:text-pink-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current rotate-90" viewBox="0 0 24 24"><path d="M21 3L3 10.53V11.5L9.84 14.16L12.5 21H13.46L21 3Z"/></svg>
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform gemstone-glow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
