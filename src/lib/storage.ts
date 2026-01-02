import { supabaseAdmin } from './supabase';

/**
 * Extracts the filename from a Supabase public URL.
 * Example: https://xyz.supabase.co/storage/v1/object/public/uploads/hero-123.png -> hero-123.png
 */
export const getFilenameFromUrl = (url: string): string | null => {
  if (!url || !url.includes('/storage/v1/object/public/uploads/')) return null;
  return url.split('/storage/v1/object/public/uploads/').pop() || null;
};

/**
 * Deletes a file from the 'uploads' bucket in Supabase.
 * @param fileIdentifier - Either the full public URL or the filename.
 */
export const deleteFileFromStorage = async (fileIdentifier: string) => {
  if (!fileIdentifier) return;

  const filename = fileIdentifier.includes('http') 
    ? getFilenameFromUrl(fileIdentifier) 
    : fileIdentifier;

  if (!filename) return;

  try {
    const { error } = await supabaseAdmin.storage
      .from('uploads')
      .remove([filename]);

    if (error) {
      console.error(`Error deleting file ${filename} from storage:`, error);
    } else {
      console.log(`Successfully deleted file ${filename} from storage.`);
    }
  } catch (err) {
    console.error(`Unexpected error deleting file ${filename}:`, err);
  }
};
