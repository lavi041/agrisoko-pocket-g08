import bundle from './data/members.bundle.json';
import { GROUP_CODE } from './config';
import type { AskResult, Member } from './types';

export const BUNDLED_MEMBERS = bundle as Member[];

export const normalize = (t: string) =>
  t.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Exact name, nickname, GitHub username or role lookup on the bundled approved directory. */
export function localLookup(query: string, members: Member[] = BUNDLED_MEMBERS): AskResult | null {
  const q = ` ${normalize(query)} `;
  if (q.trim() === '') return null;
  const hits = members.filter((m) => {
    const phrases = [m.fullName, m.githubUsername, m.role, ...m.aliases, ...m.fullName.split(' ').filter((p) => p.length >= 3)]
      .map(normalize).filter(Boolean);
    return phrases.some((p) => q.includes(` ${p} `));
  });
  if (hits.length !== 1) return null; // none or ambiguous: do not guess offline
  const m = hits[0];
  return {
    query, matched: true, confidence: 1, threshold: 1,
    reason: 'Exact name, nickname or role found in the bundled directory (offline match).',
    matched_terms: [], member: { id: m.id, fullName: m.fullName, aliases: m.aliases, role: m.role, feature: m.feature },
    introduction: m.introduction ?? m.introductionDraft, evidence_links: m.evidenceLinks,
    suggestions: [], model_version: 'offline-exact-lookup', group_code: GROUP_CODE, source: 'offline',
  };
}

export const offlineSuggestions = (members: Member[] = BUNDLED_MEMBERS) =>
  members.map((m) => `${m.fullName} (${m.role})`);
