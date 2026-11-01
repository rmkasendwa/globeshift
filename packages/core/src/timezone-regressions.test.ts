import { describe, expect, it } from 'vitest';
import { dateInZone, offsetLabel, offsetMinutes, timeInZone } from './index';

describe('IANA timezone regression cases', () => {
  it.each([
    ['America/New_York', '2026-03-08T06:59:59Z', -300],
    ['America/New_York', '2026-03-08T07:00:00Z', -240],
    ['America/New_York', '2026-11-01T05:59:59Z', -240],
    ['America/New_York', '2026-11-01T06:00:00Z', -300],
    ['Europe/London', '2026-03-29T00:59:59Z', 0],
    ['Europe/London', '2026-03-29T01:00:00Z', 60],
    ['Asia/Kathmandu', '2026-06-01T12:00:00Z', 345],
    ['Australia/Adelaide', '2026-07-01T12:00:00Z', 570],
    ['Pacific/Chatham', '2026-07-01T12:00:00Z', 765],
    ['Africa/Kampala', '2026-07-01T12:00:00Z', 180],
  ])('calculates %s offset at %s', (zone, instant, minutes) => {
    expect(offsetMinutes(new Date(instant), zone)).toBe(minutes);
  });

  it('skips nonexistent spring-forward wall-clock times', () => {
    const before = new Date('2026-03-08T06:59:00Z');
    const after = new Date('2026-03-08T07:00:00Z');
    expect(timeInZone(before, 'America/New_York')).toBe('01:59:00');
    expect(timeInZone(after, 'America/New_York')).toBe('03:00:00');
  });

  it('represents both occurrences of the fall-back hour with distinct offsets', () => {
    const first = new Date('2026-11-01T05:30:00Z');
    const second = new Date('2026-11-01T06:30:00Z');
    expect(timeInZone(first, 'America/New_York')).toBe('01:30:00');
    expect(timeInZone(second, 'America/New_York')).toBe('01:30:00');
    expect(offsetMinutes(first, 'America/New_York')).toBe(-240);
    expect(offsetMinutes(second, 'America/New_York')).toBe(-300);
  });

  it('crosses the international date line without shifting the instant', () => {
    const instant = new Date('2026-01-01T00:30:00Z');
    expect(dateInZone(instant, 'Pacific/Kiritimati')).toContain('1 Jan');
    expect(dateInZone(instant, 'Pacific/Honolulu')).toContain('31 Dec');
  });

  it.each([
    [345, 'UTC+05:45'],
    [-210, 'UTC-03:30'],
    [0, 'UTC+00:00'],
  ])('formats fractional-hour offset %i', (minutes, label) => {
    expect(offsetLabel(minutes)).toBe(label);
  });
});
