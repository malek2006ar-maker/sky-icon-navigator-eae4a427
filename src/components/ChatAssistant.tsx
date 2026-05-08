import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/site-assistant`;

const greetings = {
  ar: 'مرحبًا! أنا مساعد سكاي أيكون. كيف يمكنني إرشادك حول خدماتنا؟',
  en: "Hi! I'm the Sky Icon assistant. How can I help you with our services?",
  fr: "Bonjour! Je suis l'assistant Sky Icon. Comment puis-je vous aider?",
};

const labels = {
  ar: { title: 'مساعد سكاي أيكون', placeholder: 'اكتب سؤالك...', send: 'إرسال', open: 'فتح المحادثة', error: 'تعذر الاتصال، حاول لاحقًا.' },
  en: { title: 'Sky Icon Assistant', placeholder: 'Type your question...', send: 'Send', open: 'Open chat', error: 'Connection failed, try again.' },
  fr: { title: 'Assistant Sky Icon', placeholder: 'Tapez votre question...', send: 'Envoyer', open: 'Ouvrir le chat', error: 'Échec de connexion, réessayez.' },
};

export const ChatAssistant = () => {
  const { language, isRTL } = useLanguage();
  const t = labels[language];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: greetings[language] },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error('request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistant = '';
      setMessages((m) => [...m, { role: 'assistant', content: '' }]);
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: 'assistant', content: assistant };
                return copy;
              });
            }
          } catch {
            // ignore
          }
        }
      }
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: t.error }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
        onClick={() => setOpen((o) => !o)}
        aria-label={t.open}
        className={`fixed bottom-24 ${isRTL ? 'left-6' : 'right-6'} z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-elevated hover:scale-110 transition-transform flex items-center justify-center`}
      >
        {open ? <X size={26} /> : <Bot size={28} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed z-50 bg-background border border-border rounded-2xl shadow-elevated overflow-hidden flex flex-col
              bottom-24 ${isRTL ? 'left-6' : 'right-6'}
              w-[calc(100vw-3rem)] sm:w-[380px] h-[70vh] sm:h-[520px] max-h-[600px]`}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-semibold text-sm">{t.title}</span>
              </div>
              <button onClick={() => setOpen(false)} className="hover:opacity-80" aria-label="close">
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-card text-card-foreground border border-border rounded-bl-sm'
                    }`}
                  >
                    {m.content || (loading && i === messages.length - 1 ? '...' : '')}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3 py-2">
                    <Loader2 className="animate-spin" size={16} />
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-3 border-t border-border bg-background flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;