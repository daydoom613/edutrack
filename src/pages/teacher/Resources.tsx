import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { listResources, SUBJECTS, DIFFICULTIES, uploadResource, getPublicUrl } from '@/integrations/supabase/resources';
import { generateContentWithContext } from '@/integrations/ai/gemini';
import type { DifficultyTag, Resource, SubjectTag } from '@/types';
import { Loader2, FileText, Search, UploadCloud, FileDown, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function TeacherResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [q, setQ] = useState<string>('');
  const [subject, setSubject] = useState<SubjectTag | 'All'>('All');
  const [difficulty, setDifficulty] = useState<DifficultyTag | 'All'>('All');

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadSubject, setUploadSubject] = useState<SubjectTag>('Mathematics');
  const [uploadDifficulty, setUploadDifficulty] = useState<DifficultyTag>('Easy');
  const [tags, setTags] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // PDF Summary state
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryResource, setSummaryResource] = useState<Resource | null>(null);
  const [summaryText, setSummaryText] = useState<string>('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string>('');

  const { user } = useAuthStore();

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listResources({ query: q, subject, difficulty });
      setResources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subjectsForSelect = useMemo(() => ['All', ...SUBJECTS] as const, []);
  const difficultiesForSelect = useMemo(() => ['All', ...DIFFICULTIES] as const, []);

  const onUpload = async () => {
    if (!file || !user) return;
    setSubmitting(true);
    setError('');
    try {
      await uploadResource(
        file,
        {
          title,
          description,
          subject: uploadSubject,
          difficulty: uploadDifficulty,
          tags: tags
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        },
        { id: user.id, name: user.name }
      );
      setOpen(false);
      setFile(null);
      setTitle('');
      setDescription('');
      setTags('');
      await handleSearch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSummarizePDF = async (resource: Resource) => {
    console.log('Summarize button clicked for:', resource.title, 'File type:', resource.file_type);
    
    setSummaryResource(resource);
    setSummaryOpen(true);
    setSummaryText('');
    setSummaryError('');
    setSummaryLoading(true);

    try {
      // For now, we'll use a mock summary since PDF text extraction is complex
      // In a real implementation, you'd extract text from the PDF first
      const mockContent = `This is a sample content for "${resource.title}". The document covers topics related to ${resource.subject} and is designed for ${resource.difficulty} level students.`;
      
      const prompt = `Please provide a comprehensive 1-page summary of the following content. Format it with clear bullet points and key takeaways. Make it educational and easy to understand for teachers.\n\nContent: ${mockContent}`;
      
      console.log('Sending request to Gemini...');
      const summary = await generateContentWithContext({
        prompt,
        role: 'teacher',
        extraContext: resource.description
      });

      console.log('Received summary:', summary);
      setSummaryText(summary || 'Unable to generate summary');
    } catch (err) {
      console.error('Error generating summary:', err);
      setSummaryError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const formatSummaryText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    return (
      <div className="space-y-3">
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
          if (trimmed.match(/^\d+\./)) {
            return (
              <div key={index} className="flex items-start gap-2">
                <span className="text-education-blue mt-1 font-medium">{trimmed.split('.')[0]}.</span>
                <span className="text-sm">{trimmed.substring(trimmed.indexOf('.') + 1).trim()}</span>
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
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-muted-foreground">Manage and upload teaching materials</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-hero">
              <UploadCloud className="w-4 h-4 mr-2" /> Upload
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>File</Label>
                <Input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select value={uploadSubject} onValueChange={(v: SubjectTag) => setUploadSubject(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={uploadDifficulty} onValueChange={(v: DifficultyTag) => setUploadDifficulty(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., algebra, equations" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
                <Button className="btn-hero" onClick={onUpload} disabled={submitting || !file || !title}>
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Upload
                </Button>
              </div>
              {error && (
                <div className="text-destructive text-sm">{error}</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 flex items-center gap-2">
              <Input
                placeholder="Search by title or description"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Button onClick={handleSearch} className="btn-hero" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Search
              </Button>
            </div>

            <Select value={subject} onValueChange={(v: SubjectTag | 'All') => setSubject(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectsForSelect.map((s) => (
                  <SelectItem key={s} value={s as any}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={difficulty} onValueChange={(v: DifficultyTag | 'All') => setDifficulty(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultiesForSelect.map((d) => (
                  <SelectItem key={d} value={d as any}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-destructive text-sm">{error}</CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading resources...
        </div>
      ) : resources.length === 0 ? (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>No resources found</CardTitle>
            <CardDescription>Try adjusting filters or upload a new resource</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res) => (
            <Card key={res.id} className="card-elevated hover:scale-[1.01] transition-transform">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{res.title}</CardTitle>
                    <CardDescription className="line-clamp-1 mt-1">{res.description}</CardDescription>
                  </div>
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-muted-foreground">Uploaded by {res.uploaderName}</div>
                {/* Debug info - remove this later */}
                <div className="text-xs text-muted-foreground">File type: {res.file_type || 'unknown'}</div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{res.subject}</Badge>
                  <Badge variant="outline">{res.difficulty}</Badge>
                  {res.tags?.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="bg-muted">{t}</Badge>
                  ))}
                </div>
                {res.filePath && (
                  <div className="pt-1 flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={getPublicUrl(res.filePath)} target="_blank" rel="noreferrer">
                        <FileDown className="w-4 h-4 mr-1" />
                        View / Download
                      </a>
                    </Button>
                    {/* Show summarize button for all files for now, or if file_type is pdf */}
                    {(res.file_type === 'application/pdf' || !res.file_type || res.file_type.includes('pdf')) && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          console.log('Button clicked!', res);
                          handleSummarizePDF(res);
                        }}
                        className="text-education-blue border-education-blue hover:bg-education-blue hover:text-white"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Summarize
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PDF Summary Modal */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl">
                  PDF Summary: {summaryResource?.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{summaryResource?.subject}</Badge>
                  <Badge variant="outline">{summaryResource?.difficulty}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Uploaded by {summaryResource?.uploaderName}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSummaryOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="mt-4">
            {summaryLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-education-blue" />
                  <div className="text-muted-foreground">Generating summary...</div>
                </div>
              </div>
            ) : summaryError ? (
              <div className="text-center py-16">
                <div className="text-destructive mb-2">Failed to generate summary</div>
                <div className="text-sm text-muted-foreground">{summaryError}</div>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => summaryResource && handleSummarizePDF(summaryResource)}
                >
                  Try Again
                </Button>
              </div>
            ) : summaryText ? (
              <div className="prose prose-sm max-w-none">
                {formatSummaryText(summaryText)}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                No summary available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


