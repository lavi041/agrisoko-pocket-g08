import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AskResult, Member, MemberSummary } from './types';

const K = { dir: 'agrisoko:directory', last: 'agrisoko:lastResult', member: (id: string) => `agrisoko:member:${id}` };

async function read<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
async function write(key: string, value: unknown) {
  try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch { /* cache is best effort */ }
}

export const cache = {
  saveDirectory: (m: MemberSummary[]) => write(K.dir, m),
  loadDirectory: () => read<MemberSummary[]>(K.dir),
  saveLastResult: (r: AskResult) => write(K.last, r),
  loadLastResult: () => read<AskResult>(K.last),
  saveMember: (m: Member) => write(K.member(m.id), m),
  loadMember: (id: string) => read<Member>(K.member(id)),
};
