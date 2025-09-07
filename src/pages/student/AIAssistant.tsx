import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { generateContent } from '@/integrations/ai/gemini';
import { Loader2, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

const PRESET_TAGS: Array<{ label: string; prompt: string }> = [
  { label: 'Study tips', prompt: 'Give me study tips for exams.' },
  { label: 'Explain concept', prompt: 'Explain the Pythagorean theorem simply.' },
  { label: 'Practice questions', prompt: 'Give 5 practice questions on linear equations.' },
  { label: 'Summarize notes', prompt: 'Summarize the key points of World War II.' },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem('ai-chat');
      return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('ai-chat', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;
    setError('');
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: prompt, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const replyText = await generateContent(prompt);
      const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', text: replyText || 'No response', timestamp: Date.now() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  const onTagClick = (prompt: string) => {
    setInput(prompt);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground">Ask questions, get explanations and tips</p>
        </div>
      </div>

      <Card className="card-elevated">
        <CardContent className="p-0">
          <div className="h-[60vh] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-auto p-4 space-y-3 bg-gradient-subtle">
              {messages.length === 0 ? (
                <div className="text-sm text-muted-foreground">Start by asking a question or pick a tag below.</div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-xl px-3 py-2 text-sm shadow-sm ${
                        m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>
                      <div className={`mt-1 text-[10px] ${m.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {new Date(m.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating response...
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input area */}
            <div className="border-t p-3 space-y-3">
              {error && <div className="text-destructive text-xs">{error}</div>}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                />
                <Button onClick={send} disabled={loading || !input.trim()} className="btn-hero">
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Send
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {PRESET_TAGS.map((t) => (
                  <Badge key={t.label} variant="secondary" className="cursor-pointer" onClick={() => onTagClick(t.prompt)}>
                    {t.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


