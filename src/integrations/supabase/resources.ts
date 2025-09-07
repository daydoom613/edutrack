import { supabase } from './client';
import type { DifficultyTag, Resource, ResourceRecord, SubjectTag, User } from '@/types';

export const SUBJECTS: SubjectTag[] = [
  'Mathematics',
  'Science',
  'History',
  'English',
  'Computer Science',
  'Geography',
  'Biology',
  'Chemistry',
  'Physics',
];

export const DIFFICULTIES: DifficultyTag[] = ['Easy', 'Medium', 'Hard'];

export interface ListResourcesParams {
  query?: string;
  subject?: SubjectTag | 'All';
  difficulty?: DifficultyTag | 'All';
}

export interface UploadMetadata {
  title: string;
  description: string;
  subject: SubjectTag;
  difficulty: DifficultyTag;
  tags?: string[];
}

const toResource = (r: ResourceRecord): Resource => ({
  id: r.id,
  title: r.title,
  description: r.description,
  type: r.file_type?.includes('pdf')
    ? 'pdf'
    : r.file_type?.includes('presentation') || r.file_type?.includes('ppt')
    ? 'pptx'
    : r.file_type?.includes('word') || r.file_type?.includes('doc')
    ? 'docx'
    : r.file_type?.startsWith('image/')
    ? 'image'
    : 'link',
  subject: r.subject,
  difficulty: r.difficulty,
  tags: r.tags ?? [],
  uploaderId: r.uploader_id,
  uploaderName: r.uploader_name,
  filePath: r.file_path ?? undefined,
  fileType: r.file_type ?? undefined,
  createdAt: new Date(r.created_at),
});

export async function listResources(params: ListResourcesParams = {}): Promise<Resource[]> {
  const { query, subject, difficulty } = params;
  let q = supabase.from('resources').select('*').order('created_at', { ascending: false });

  if (subject && subject !== 'All') {
    q = q.eq('subject', subject);
  }
  if (difficulty && difficulty !== 'All') {
    q = q.eq('difficulty', difficulty);
  }
  if (query && query.trim().length > 0) {
    // Use ilike for case-insensitive match in Postgres
    q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data as ResourceRecord[]).map(toResource);
}

export async function uploadResource(
  file: File,
  metadata: UploadMetadata,
  uploader: Pick<User, 'id' | 'name'>
): Promise<Resource> {
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('File exceeds 20MB limit');
  }

  // 1) Upload to storage bucket "resources"
  const fileExt = file.name.split('.').pop();
  const storagePath = `${uploader.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('resources')
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });
  if (uploadError) throw uploadError;

  const filePath = uploadData?.path ?? storagePath;

  // 2) Insert DB row
  const insertPayload = {
    title: metadata.title,
    description: metadata.description,
    subject: metadata.subject,
    difficulty: metadata.difficulty,
    tags: metadata.tags ?? [],
    uploader_id: uploader.id,
    uploader_name: uploader.name,
    file_path: filePath,
    file_type: file.type,
  };

  const { data, error } = await supabase
    .from('resources')
    .insert(insertPayload)
    .select('*')
    .single();
  if (error) throw error;

  return toResource(data as ResourceRecord);
}

export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage.from('resources').getPublicUrl(filePath);
  return data.publicUrl;
}


