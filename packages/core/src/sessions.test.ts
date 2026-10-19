import { describe, expect, it } from 'vitest';
import { FOREX_SESSIONS, sessionStatus } from './sessions';
describe('forex session windows', () => {
  const london = FOREX_SESSIONS.find(session => session.id === 'london')!;
  it('shifts with British summer time', () => {
    expect(sessionStatus(london, new Date('2026-01-12T08:30:00Z')).open).toBe(true);
    expect(sessionStatus(london, new Date('2026-07-13T07:30:00Z')).open).toBe(true);
  });
  it('does not mark London open on a Saturday', () => {
    expect(sessionStatus(london, new Date('2026-07-11T12:00:00Z')).open).toBe(false);
  });
  it('reports next opening after a closed window', () => {
    expect(sessionStatus(london, new Date('2026-01-12T20:00:00Z')).nextOpen.toISOString()).toBe('2026-01-13T08:00:00.000Z');
  });
});
