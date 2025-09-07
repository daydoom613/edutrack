import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { generateContentWithContext } from '@/integrations/ai/gemini';
import { FileText, ListChecks, Sparkles } from 'lucide-react';

type ToolKey = 'quiz' | 'summarize' | 'enhance';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

const TOOL_META: Record<ToolKey, { title: string; desc: string; icon: any; presetPrompt: string }> = {
  quiz: {
    title: 'Quiz Generator',
    desc: 'Create 5 single-correct MCQs with answers from content.',
    icon: ListChecks,
    presetPrompt:
      'Generate 5 multiple-choice questions based on the provided content. Format each question as follows:\n\n* Question text here?\nA) Option A\nB) Option B\nC) Option C\nD) Option D\nCorrect Answer: X\n\nMake sure each question is separated by a blank line and starts with an asterisk (*).',
  },
  summarize: {
    title: 'Content Summarizer',
    desc: 'Summarize content concisely with key points.',
    icon: FileText,
    presetPrompt: 'Summarize the content using clear bullet points. Start with a brief overview, then list key points using bullet points (•). Make it easy to read and well-structured.',
  },
  enhance: {
    title: 'Content Enhancer',
    desc: 'Improve clarity, grammar, and structure.',
    icon: Sparkles,
    presetPrompt: 'Enhance the content for clarity and engagement. Use bullet points (•) for key improvements and maintain a clear structure. Focus on:\n• Grammar and clarity\n• Better organization\n• Improved readability\n• Enhanced engagement',
  },
};

export default function TeacherAITools() {
  const [activeTool, setActiveTool] = useState<ToolKey | null>(null);
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const onUseTool = (tool: ToolKey) => {
    setActiveTool(tool);
    setMessages([]);
    setInputText('');
    setFile(null);
    setFileText('');
  };

  const tryExtractText = async (file: File): Promise<string> => {
    // Simple extraction for txt only; others instruct user to paste text for now
    if (file.type === 'text/plain') {
      return await file.text();
    }
    return `File provided: ${file.name} (${file.type}). If extraction fails, paste relevant text in the input.`;
  };

  const formatAIResponse = (text: string, tool: ToolKey) => {
    if (tool === 'quiz') {
      // Format quiz questions with proper structure
      return text
        .split(/\*\s*/)
        .filter(question => question.trim())
        .map((question, index) => {
          // Clean up the question and format it properly
          const cleanQuestion = question.trim();
          if (!cleanQuestion) return null;
          
          // Split by "Correct Answer:" to separate question from answer
          const parts = cleanQuestion.split(/Correct Answer:\s*([A-D])/i);
          const questionPart = parts[0].trim();
          const correctAnswer = parts[1]?.trim();
          
          return {
            number: index + 1,
            question: questionPart,
            correctAnswer: correctAnswer
          };
        })
        .filter(Boolean);
    }
    return text;
  };

  const renderFormattedResponse = (text: string, tool: ToolKey) => {
    if (tool === 'quiz') {
      const formatted = formatAIResponse(text, tool);
      if (Array.isArray(formatted)) {
        return (
          <div className="space-y-4">
            {formatted.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg bg-card">
                <div className="font-semibold text-sm mb-2">
                  Question {item.number}:
                </div>
                <div className="text-sm mb-3 whitespace-pre-line">
                  {item.question}
                </div>
                {item.correctAnswer && (
                  <div className="text-xs text-green-600 font-medium">
                    ✓ Correct Answer: {item.correctAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }
    }
    
    // For other tools, format as bullet points
    if (tool === 'summarize' || tool === 'enhance') {
      const lines = text.split('\n').filter(line => line.trim());
      return (
        <div className="space-y-2">
          {lines.map((line, index) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
              return (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-education-blue mt-1">•</span>
                  <span className="text-sm">{trimmed.substring(1).trim()}</span>
                </div>
              );
            }
            return (
              <div key={index} className="text-sm whitespace-pre-line">
                {trimmed}
              </div>
            );
          })}
        </div>
      );
    }
    
    // Default formatting
    return (
      <div className="text-sm whitespace-pre-line">
        {text}
      </div>
    );
  };

  const send = async () => {
    if (!activeTool) return;
    const prompt = inputText.trim();
    if (!prompt && !file) return;
    setError('');
    const meta = TOOL_META[activeTool];
    const composed = `${meta.presetPrompt}\n\nTeacher request:\n${prompt || 'Use the provided content to perform the task.'}`;
    if (prompt) {
      const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: prompt, timestamp: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
      setInputText('');
    }
    setLoading(true);
    try {
      const context = fileText || (file ? await tryExtractText(file) : undefined) || '';
      const reply = await generateContentWithContext({ prompt: composed, role: 'teacher', extraContext: context });
      const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', text: reply || 'No response', timestamp: Date.now() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Tools</h1>
        <p className="text-muted-foreground">Generate quizzes, summarize, and enhance content</p>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.entries(TOOL_META) as Array<[ToolKey, any]>).map(([key, meta]) => (
          <Card key={key} className="card-elevated">
            <CardHeader>
              <div className="flex items-center gap-2">
                <meta.icon className="w-5 h-5" />
                <CardTitle className="text-lg">{meta.title}</CardTitle>
              </div>
              <CardDescription className="line-clamp-1">{meta.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="btn-hero" onClick={() => onUseTool(key)}>Use tool</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inline panel */}
      {activeTool && (
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = TOOL_META[activeTool].icon;
                  return <Icon className="w-5 h-5" />;
                })()}
                <CardTitle className="text-lg">{TOOL_META[activeTool].title}</CardTitle>
                <Badge variant="secondary">Teacher tool</Badge>
              </div>
              <Button variant="outline" onClick={() => setActiveTool(null)}>Close</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <Textarea
                  placeholder="Paste or type content/instructions here"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex items-center gap-2">
                  <Input type="file" accept=".txt,.pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  <Button onClick={send} disabled={loading || (!inputText.trim() && !file)} className="btn-hero">
                    {loading ? 'Working...' : 'Send'}
                  </Button>
                </div>
                {error && <div className="text-destructive text-sm">{error}</div>}
              </div>
              <div className="space-y-2 md:max-h-[50vh] md:overflow-auto p-2 rounded-lg border bg-background">
                {messages.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Results will appear here</div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`p-3 rounded-lg ${m.role === 'user' ? 'bg-accent' : 'bg-card border'}`}>
                      {m.role === 'user' ? (
                        <div className="text-sm">{m.text}</div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground mb-2">AI Response:</div>
                          {renderFormattedResponse(m.text, activeTool!)}
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground mt-2">
                        {new Date(m.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
                <div ref={endRef} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


