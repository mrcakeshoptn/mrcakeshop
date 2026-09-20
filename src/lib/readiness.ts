import { ReadinessRules } from '@/types/settings';

// Asia/Kolkata is UTC+5:30 year-round (India has no daylight saving time), so
// the offset is safe to hardcode rather than pulling in a timezone library
// just for this one business's local clock.
const IST_OFFSET_MINUTES = 5.5 * 60;

function toIST(date: Date) {
  const ist = new Date(date.getTime() + IST_OFFSET_MINUTES * 60000);
  return {
    hour: ist.getUTCHours(),
    y: ist.getUTCFullYear(),
    m: ist.getUTCMonth(),
    d: ist.getUTCDate(),
  };
}

function fromIST(y: number, m: number, d: number, hour: number): Date {
  return new Date(Date.UTC(y, m, d, hour, 0, 0) - IST_OFFSET_MINUTES * 60000);
}

export type ReadinessBand = 'closed' | 'morning' | 'afternoon' | 'evening';

export interface ReadinessResult {
  expectedReadyAt: Date;
  band: ReadinessBand;
  /** True if this was confirmed during closed hours — a sign it maybe shouldn't have been. */
  isDuringClosedHours: boolean;
}

/**
 * Given when an order was confirmed and which cake category it's for, works
 * out an expected ready-for-pickup time using the admin's configured rules
 * (Admin → Settings → Order Readiness). All the actual hour/duration numbers
 * live in that config, not here — this just applies them.
 */
export function computeExpectedReadyTime(
  confirmedAt: Date,
  category: string,
  rules: ReadinessRules
): ReadinessResult {
  const { hour, y, m, d } = toIST(confirmedAt);
  const isSpecial = rules.specialCategories.includes(category);
  const isDuringClosedHours = hour >= rules.closedStartHour && hour < rules.closedEndHour;

  if (isDuringClosedHours) {
    const readyHours = isSpecial ? rules.morningSpecialHours : rules.morningNormalHours;
    const reopenedAt = fromIST(y, m, d, rules.closedEndHour);
    return {
      expectedReadyAt: new Date(reopenedAt.getTime() + readyHours * 3600000),
      band: 'closed',
      isDuringClosedHours: true,
    };
  }

  if (hour < rules.morningEndHour) {
    const readyHours = isSpecial ? rules.morningSpecialHours : rules.morningNormalHours;
    return {
      expectedReadyAt: new Date(confirmedAt.getTime() + readyHours * 3600000),
      band: 'morning',
      isDuringClosedHours: false,
    };
  }

  if (hour < rules.afternoonEndHour) {
    return {
      expectedReadyAt: new Date(confirmedAt.getTime() + rules.afternoonHours * 3600000),
      band: 'afternoon',
      isDuringClosedHours: false,
    };
  }

  // Confirmed in the evening: ready by a fixed hour the next morning.
  const nextDay = fromIST(y, m, d + 1, rules.eveningReadyHour);
  return { expectedReadyAt: nextDay, band: 'evening', isDuringClosedHours: false };
}

export function formatReadyTime(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
