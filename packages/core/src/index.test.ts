import { describe, expect, it } from 'vitest';
import { dateInZone, offsetMinutes, searchCities, timeInZone } from './index';
describe('world clock', () => {
  it('respects daylight saving in New York', () => {
    expect(offsetMinutes(new Date('2026-01-15T12:00:00Z'), 'America/New_York')).toBe(-300);
    expect(offsetMinutes(new Date('2026-07-15T12:00:00Z'), 'America/New_York')).toBe(-240);
  });
  it('handles midnight across the date line', () => {
    expect(timeInZone(new Date('2026-01-01T00:00:00Z'), 'Asia/Tokyo')).toBe('09:00:00');
    expect(dateInZone(new Date('2026-01-01T00:00:00Z'), 'America/Los_Angeles')).toContain('31 Dec');
  });
  it('searches by city and country', () => {
    expect(searchCities('Uganda').map(city => city.id)).toContain('kampala');
  });
});
