import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  apiBaseUrl?: string; groupCode?: string; githubUrl?: string; verificationCode?: string;
};

// Configurable base URL: env var (EXPO_PUBLIC_API_URL) > app.json extra > emulator default.
export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL ?? extra.apiBaseUrl ?? 'http://10.0.2.2:8000';
export const REQUEST_TIMEOUT_MS = 8000;
export const MAX_QUERY_LENGTH = 200;
export const GROUP_CODE = extra.groupCode ?? 'G08';
export const GITHUB_URL = extra.githubUrl ?? '';
export const VERIFICATION_CODE = extra.verificationCode ?? '';
export const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';
