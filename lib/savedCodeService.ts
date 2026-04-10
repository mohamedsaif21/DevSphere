import { SavedCode } from '@/types/savedCode';

const STORAGE_KEY = 'devsphere_saved_codes_v1';

function readAll(): SavedCode[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: SavedCode[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export async function saveCode(
  userId: string,
  codeData: Omit<SavedCode, 'user_id' | 'id' | 'created_at' | 'updated_at'>
) {
  try {
    const all = readAll();
    const now = new Date().toISOString();
    const row: SavedCode = {
      id: newId(),
      user_id: userId,
      title: codeData.title,
      language: codeData.language,
      code: codeData.code,
      description: codeData.description,
      created_at: now,
      updated_at: now,
    };
    all.push(row);
    writeAll(all);
    return { success: true as const, data: [row] };
  } catch (error: any) {
    return { success: false as const, error: error?.message || 'Failed to save code' };
  }
}

export async function getUserSavedCodes(userId: string) {
  try {
    const all = readAll();
    const data = all
      .filter((c) => c.user_id === userId)
      .sort((a, b) => {
        const ta = new Date(a.created_at || 0).getTime();
        const tb = new Date(b.created_at || 0).getTime();
        return tb - ta;
      });
    return { success: true as const, data };
  } catch (error: any) {
    return { success: false as const, error: error?.message || 'Failed to fetch saved codes' };
  }
}

export async function deleteCode(codeId: string) {
  try {
    const all = readAll();
    const next = all.filter((c) => c.id !== codeId);
    writeAll(next);
    return { success: true as const };
  } catch (error: any) {
    return { success: false as const, error: error?.message || 'Failed to delete code' };
  }
}

export async function updateCode(codeId: string, updates: Partial<SavedCode>) {
  try {
    const all = readAll();
    const idx = all.findIndex((c) => c.id === codeId);
    if (idx === -1) {
      return { success: false as const, error: 'Code not found' };
    }
    const updated = {
      ...all[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    all[idx] = updated;
    writeAll(all);
    return { success: true as const, data: updated };
  } catch (error: any) {
    return { success: false as const, error: error?.message || 'Failed to update code' };
  }
}
