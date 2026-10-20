import axios, { AxiosError } from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './config';
import type { AskResult, Member, MemberSummary } from './types';

export type ApiErrorKind = 'timeout' | 'network' | 'server' | 'client';

export class ApiError extends Error {
  constructor(public kind: ApiErrorKind, message: string, public status?: number) {
    super(message);
  }
}

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

function toApiError(e: unknown): ApiError {
  const err = e as AxiosError<{ detail?: unknown }>;
  if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
    return new ApiError('timeout', 'The server took too long to answer.');
  }
  if (!err.response) return new ApiError('network', 'The server could not be reached.');
  const status = err.response.status;
  if (status >= 500) return new ApiError('server', 'The server is unavailable right now.', status);
  return new ApiError('client', status === 404 ? 'Not found.' : 'The question was not accepted.', status);
}

async function call<T>(fn: () => Promise<{ data: T }>): Promise<T> {
  try {
    return (await fn()).data;
  } catch (e) {
    throw toApiError(e);
  }
}

export const api = {
  health: () => call<{ status: string; version: string; group_code: string; model_version: string }>(() => client.get('/health')),
  members: () => call<MemberSummary[]>(() => client.get('/members')),
  member: (id: string) => call<Member>(() => client.get(`/members/${encodeURIComponent(id)}`)),
  modelInfo: () => call<{ model_version: string; vectorizer: string; threshold: number; dataset_fingerprint_sha256: string; build_commit: string; limitations: string[] }>(() => client.get('/model-info')),
  ask: (query: string) => call<Omit<AskResult, 'source'>>(() => client.post('/ask', { query })),
};
