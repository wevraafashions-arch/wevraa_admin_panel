import { supabase, isSupabaseConfigured } from '../supabaseClient';

/** Bucket for category thumbnail images */
const CATEGORIES_BUCKET = 'categories';

/**
 * Upload a category thumbnail image to Supabase Storage and return its public URL.
 * Uses bucket "categories" and path "thumbnails/{timestamp}-{sanitized filename}".
 * Requires the bucket to exist and be public in your Supabase project.
 */
export async function uploadCategoryImage(file: File): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 80);
  const path = `thumbnails/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage.from(CATEGORIES_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || `image/${ext}`,
  });

  if (error) {
    throw new Error(error.message || 'Failed to upload image to Supabase');
  }

  const { data: urlData } = supabase.storage.from(CATEGORIES_BUCKET).getPublicUrl(data.path);
  return urlData.publicUrl;
}
