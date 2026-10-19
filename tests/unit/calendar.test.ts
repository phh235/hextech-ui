import { describe, expect, it } from 'vitest';
import {
  parseDay,
  addDays,
  addMonths,
  calendarDays,
  calendarKey,
  normalizeRange,
  clampDay,
} from '../../packages/react/src/lib/calendar-utils';
describe('calendar date arithmetic', () => {
  it('rejects rollover dates and accepts real leap days and ancient years', () => {
    expect(parseDay('2025-02-29')).toBeUndefined();
    expect(parseDay('2024-02-29')?.getUTCDate()).toBe(29);
    expect(parseDay('0099-01-01')?.getUTCFullYear()).toBe(99);
    expect(parseDay('0000-01-01')).toBeUndefined();
  });
  it('crosses DST boundaries by calendar days and clips month ends', () => {
    expect(addDays('2026-03-08', 1)).toBe('2026-03-09');
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29');
    expect(addMonths('2024-02-29', 12)).toBe('2025-02-28');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
  it('creates six complete weeks with a configurable week origin', () => {
    const monday = calendarDays('2026-10-17');
    expect(monday).toHaveLength(42);
    expect(monday[0]).toBe('2026-09-28');
    expect(calendarDays('2026-10-17', 0)[0]).toBe('2026-09-27');
    expect(calendarDays('0001-01-01', 0)[0]).toBeNull();
    expect(calendarDays('9999-12-01').at(-1)).toBeNull();
    expect(addDays('0001-01-01', -1)).toBe('0001-01-01');
    expect(addMonths('9999-12-31', 1)).toBe('9999-12-31');
  });
  it('implements the APG grid date-navigation keys', () => {
    expect(calendarKey('2026-10-17', 'ArrowUp')).toBe('2026-10-10');
    expect(calendarKey('2026-10-17', 'Home')).toBe('2026-10-12');
    expect(calendarKey('2026-10-17', 'End')).toBe('2026-10-18');
    expect(calendarKey('2026-10-17', 'PageDown', true)).toBe('2027-10-17');
  });
  it('normalizes reversed ranges and clamps navigation to bounds', () => {
    expect(normalizeRange('2026-10-20', '2026-10-17')).toEqual({
      start: '2026-10-17',
      end: '2026-10-20',
    });
    expect(clampDay('2026-10-01', '2026-10-05', '2026-10-30')).toBe('2026-10-05');
  });
});
