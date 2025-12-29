
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/gemini';
import { Message } from '../types';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Elite Claims Assistant online. How can I help you navigate your current project, code dispute, or policy interpretation?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const gemini = GeminiService.getInstance();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await gemini.chat(input, useThinking);
      const modelMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: response || 'No response received.', timestamp: new Date(), isThinking: useThinking };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: 'Error communicating with AI. Please try again.', timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const speak = async (text: string) => {
    const audioBase64 = await gemini.speakText(text);
    if (audioBase64) {
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      audio.play();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">🤖</div>
          <div>
            <h3 className="font-bold text-slate-800">Intelligence Engine</h3>
            <p className="text-xs text-slate-500">Gemini 3 Pro + Thinking Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <input 
              type="checkbox" 
              checked={useThinking} 
              onChange={(e) => setUseThinking(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-semibold text-slate-700">Thinking Mode</span>
          </label>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
            }`}>
              {msg.isThinking && (
                <div className="text-[10px] font-bold text-blue-600 mb-2 bg-blue-50 inline-block px-1.5 py-0.5 rounded">THINKING MODE USED</div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              <div className="mt-3 flex items-center justify-between opacity-50 text-[10px]">
                <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {msg.role === 'model' && (
                  <button onClick={() => speak(msg.text)} className="hover:text-blue-600 flex items-center gap-1">
                    🔊 Listen
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl flex items-center gap-2 border border-slate-200">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                {useThinking ? 'AI is reasoning...' : 'Generating...'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-slate-50">
        <div className="flex gap-3 bg-white p-1 rounded-2xl border border-slate-200 focus-within:border-blue-500 transition-all shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe a claim scenario or code dispute..."
            className="flex-1 px-4 py-3 outline-none text-slate-700 placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-400 transition-all flex items-center gap-2"
          >
            {isLoading ? 'Sending...' : 'Analyze'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
