import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { listResources, SUBJECTS, DIFFICULTIES, getPublicUrl } from '@/integrations/supabase/resources';
import type { DifficultyTag, Resource, SubjectTag } from '@/types';
import { Loader2, FileText, Search } from 'lucide-react';

export default function StudentMaterials() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [q, setQ] = useState<string>('');
  const [subject, setSubject] = useState<SubjectTag | 'All'>('All');
  const [difficulty, setDifficulty] = useState<DifficultyTag | 'All'>('All');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listResources({ query: q, subject, difficulty });
      setResources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load materials');
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Study Materials</h1>
          <p className="text-muted-foreground">Access your learning resources</p>
        </div>
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
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading materials...
        </div>
      ) : resources.length === 0 ? (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>No materials found</CardTitle>
            <CardDescription>Try adjusting filters or search terms</CardDescription>
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
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{res.subject}</Badge>
                  <Badge variant="outline">{res.difficulty}</Badge>
                  {res.tags?.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="bg-muted">{t}</Badge>
                  ))}
                </div>
                {res.filePath && (
                  <div className="pt-1">
                    <Button variant="outline" size="sm" asChild>
                      <a href={getPublicUrl(res.filePath)} target="_blank" rel="noreferrer">
                        View / Download
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


