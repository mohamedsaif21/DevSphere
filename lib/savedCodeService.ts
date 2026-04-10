import { supabase } from './supabase';
import { SavedCode } from '@/types/savedCode';

export async function saveCode(userId: string, codeData: Omit<SavedCode, 'user_id' | 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase.from('saved_codes').insert([
      {
        user_id: userId,
        title: codeData.title,
        language: codeData.language,
        code: codeData.code,
        description: codeData.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to save code' };
  }
}

export async function getUserSavedCodes(userId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_codes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to fetch saved codes' };
  }
}

export async function deleteCode(codeId: string) {
  try {
    const { error } = await supabase.from('saved_codes').delete().eq('id', codeId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to delete code' };
  }
}

export async function updateCode(codeId: string, updates: Partial<SavedCode>) {
  try {
    const { data, error } = await supabase
      .from('saved_codes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', codeId);

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update code' };
  }
}
