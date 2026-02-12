import { DAILY_API_LIMIT, RESERVED_CALLS } from '../../shared/defaults';
import { RateLimitStatus } from '../../shared/types';

let dailyCount = 0;
let resetDate = getTodayString();

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function checkReset(): void {
  const today = getTodayString();
  if (today !== resetDate) {
    dailyCount = 0;
    resetDate = today;
  }
}

export function canMakeRequest(isAutoRefresh = false): boolean {
  checkReset();
  const limit = isAutoRefresh ? DAILY_API_LIMIT - RESERVED_CALLS : DAILY_API_LIMIT;
  return dailyCount < limit;
}

export function recordRequest(): void {
  checkReset();
  dailyCount++;
}

export function getStatus(): RateLimitStatus {
  checkReset();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return {
    remaining: DAILY_API_LIMIT - dailyCount,
    total: DAILY_API_LIMIT,
    resetsAt: tomorrow.toISOString(),
  };
}
