import { offsetMinutes } from './index';

export type MarketSession = { id: string; name: string; timezone: string; openHour: number; closeHour: number };
export const FOREX_SESSIONS: MarketSession[] = [
  { id: 'sydney', name: 'Sydney', timezone: 'Australia/Sydney', openHour: 8, closeHour: 17 },
  { id: 'tokyo', name: 'Tokyo', timezone: 'Asia/Tokyo', openHour: 9, closeHour: 18 },
  { id: 'london', name: 'London', timezone: 'Europe/London', openHour: 8, closeHour: 17 },
  { id: 'new-york', name: 'New York', timezone: 'America/New_York', openHour: 8, closeHour: 17 },
];
function localParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find(part => part.type === type)?.value || '';
  return { year: Number(get('year')), month: Number(get('month')), day: Number(get('day')), weekday: get('weekday'), hour: Number(get('hour')), minute: Number(get('minute')) };
}
function localToUTC(year: number, month: number, day: number, hour: number, timezone: string): Date {
  const wall = Date.UTC(year, month - 1, day, hour);
  let instant = wall - offsetMinutes(new Date(wall), timezone) * 60000;
  instant = wall - offsetMinutes(new Date(instant), timezone) * 60000;
  return new Date(instant);
}
export type SessionStatus = { session: MarketSession; open: boolean; nextOpen: Date; nextClose: Date | null };
export function sessionStatus(session: MarketSession, now: Date): SessionStatus {
  const local = localParts(now, session.timezone);
  const startOfToday = Date.UTC(local.year, local.month - 1, local.day);
  const candidates: { open: Date; close: Date }[] = [];
  for (let day = -2; day <= 8; day++) {
    const d = new Date(startOfToday + day * 86400000);
    const weekday = d.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    const open = localToUTC(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), session.openHour, session.timezone);
    const close = localToUTC(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), session.closeHour, session.timezone);
    candidates.push({ open, close });
  }
  const current = candidates.find(candidate => candidate.open <= now && now < candidate.close);
  const next = candidates.find(candidate => candidate.open > now);
  return { session, open: Boolean(current), nextOpen: next?.open || new Date(NaN), nextClose: current?.close || null };
}
export function allSessionStatuses(now: Date): SessionStatus[] {
  return FOREX_SESSIONS.map(session => sessionStatus(session, now));
}
export function activeOverlaps(now: Date): string[] {
  return allSessionStatuses(now).filter(status => status.open).map(status => status.session.name);
}
