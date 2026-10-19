/** Calendar-only ISO dates; UTC noon avoids daylight-saving and year 0–99 traps. */
export function parseDay(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return undefined;
  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
    ? date
    : undefined;
}
export function formatDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}
function boundedDay(date: Date): string {
  return date.getUTCFullYear() < 1
    ? '0001-01-01'
    : date.getUTCFullYear() > 9999
      ? '9999-12-31'
      : formatDay(date);
}
export function addDays(value: string, amount: number): string {
  const date = parseDay(value);
  if (!date) throw new Error(`Invalid calendar date: ${value}`);
  date.setUTCDate(date.getUTCDate() + amount);
  return boundedDay(date);
}
export function addMonths(value: string, amount: number): string {
  const date = parseDay(value);
  if (!date) throw new Error(`Invalid calendar date: ${value}`);
  const day = date.getUTCDate();
  date.setUTCMonth(date.getUTCMonth() + amount, 1);
  const end = new Date(date);
  end.setUTCMonth(end.getUTCMonth() + 1, 0);
  date.setUTCDate(Math.min(day, end.getUTCDate()));
  return boundedDay(date);
}
export function firstOfMonth(value: string): string {
  if (!parseDay(value)) throw new Error(`Invalid calendar date: ${value}`);
  return `${value.slice(0, 7)}-01`;
}
export function calendarDays(month: string, weekStartsOn: 0 | 1 = 1): (string | null)[] {
  const first = firstOfMonth(month);
  const weekday = parseDay(first)!.getUTCDay();
  const start = parseDay(first)!;
  start.setUTCDate(start.getUTCDate() - ((weekday - weekStartsOn + 7) % 7));
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + index);
    return date.getUTCFullYear() < 1 || date.getUTCFullYear() > 9999 ? null : formatDay(date);
  });
}
export function calendarKey(
  value: string,
  key: string,
  shift = false,
  weekStartsOn: 0 | 1 = 1,
): string | undefined {
  const date = parseDay(value);
  if (!date) return undefined;
  const weekday = (date.getUTCDay() - weekStartsOn + 7) % 7;
  switch (key) {
    case 'ArrowLeft':
      return addDays(value, -1);
    case 'ArrowRight':
      return addDays(value, 1);
    case 'ArrowUp':
      return addDays(value, -7);
    case 'ArrowDown':
      return addDays(value, 7);
    case 'Home':
      return addDays(value, -weekday);
    case 'End':
      return addDays(value, 6 - weekday);
    case 'PageUp':
      return addMonths(value, shift ? -12 : -1);
    case 'PageDown':
      return addMonths(value, shift ? 12 : 1);
    default:
      return undefined;
  }
}
export function clampDay(value: string, min?: string, max?: string): string {
  return min && value < min ? min : max && value > max ? max : value;
}
export function normalizeRange(start: string, end: string): { start: string; end: string } {
  return start <= end ? { start, end } : { start: end, end: start };
}
