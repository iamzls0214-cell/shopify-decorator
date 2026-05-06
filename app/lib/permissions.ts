'use client';

const STORAGE_KEYS = {
  isPaid: 'stylie_is_paid',
  dailyCount: 'stylie_daily_count',
  lastDate: 'stylie_last_date',
  trialUsed: 'stylie_trial_used',
} as const;

const DAILY_LIMIT = 3;

export interface PermissionState {
  isPaid: boolean;
  dailyCount: number;
  dailyLimit: number;
  lastDate: string;
  trialUsed: boolean;
  canGenerate: boolean;
  canViewResults: boolean;
  needsUserApiKey: boolean;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function read(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

function write(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}

export function getPermissionState(): PermissionState {
  const today = getToday();
  const isPaid = read(STORAGE_KEYS.isPaid) === 'true';
  const lastDate = read(STORAGE_KEYS.lastDate) || today;
  const trialUsed = read(STORAGE_KEYS.trialUsed) === 'true';

  // Reset daily count if date changed
  if (lastDate !== today) {
    write(STORAGE_KEYS.dailyCount, '0');
    write(STORAGE_KEYS.lastDate, today);
  }

  const dailyCount = parseInt(read(STORAGE_KEYS.dailyCount) || '0', 10);

  return {
    isPaid,
    dailyCount,
    dailyLimit: DAILY_LIMIT,
    lastDate: today,
    trialUsed,
    canGenerate: isPaid ? true : dailyCount < DAILY_LIMIT,
    canViewResults: isPaid,
    needsUserApiKey: isPaid && trialUsed,
  };
}

export function incrementDailyCount(): void {
  const state = getPermissionState();
  write(STORAGE_KEYS.dailyCount, String(state.dailyCount + 1));
  write(STORAGE_KEYS.lastDate, getToday());
}

export function markTrialUsed(): void {
  write(STORAGE_KEYS.trialUsed, 'true');
}

export function activatePaid(): void {
  write(STORAGE_KEYS.isPaid, 'true');
}

export function deactivatePaid(): void {
  write(STORAGE_KEYS.isPaid, 'false');
  write(STORAGE_KEYS.trialUsed, 'false');
}

export function resetForTest(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
