export type City = { id: string; name: string; country: string; timezone: string; latitude: number; longitude: number };
export const cities: City[] = [
  { id: 'kampala', name: 'Kampala', country: 'Uganda', timezone: 'Africa/Kampala', latitude: 0.3476, longitude: 32.5825 },
  { id: 'london', name: 'London', country: 'United Kingdom', timezone: 'Europe/London', latitude: 51.5072, longitude: -0.1276 },
  { id: 'new-york', name: 'New York', country: 'United States', timezone: 'America/New_York', latitude: 40.7128, longitude: -74.006 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', latitude: -33.8688, longitude: 151.2093 },
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', latitude: 34.0522, longitude: -118.2437 },
  { id: 'denver', name: 'Denver', country: 'United States', timezone: 'America/Denver', latitude: 39.7392, longitude: -104.9903 },
  { id: 'paris', name: 'Paris', country: 'France', timezone: 'Europe/Paris', latitude: 48.8566, longitude: 2.3522 },
  { id: 'berlin', name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', latitude: 52.52, longitude: 13.405 },
  { id: 'copenhagen', name: 'Copenhagen', country: 'Denmark', timezone: 'Europe/Copenhagen', latitude: 55.6761, longitude: 12.5683 },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', latitude: 25.2048, longitude: 55.2708 },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', latitude: 1.3521, longitude: 103.8198 },
  { id: 'hong-kong', name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', latitude: 22.3193, longitude: 114.1694 },
  { id: 'mumbai', name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', latitude: 19.076, longitude: 72.8777 },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', latitude: -26.2041, longitude: 28.0473 },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', latitude: -23.5505, longitude: -46.6333 },
  { id: 'toronto', name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', latitude: 43.6532, longitude: -79.3832 },
  { id: 'chicago', name: 'Chicago', country: 'United States', timezone: 'America/Chicago', latitude: 41.8781, longitude: -87.6298 },
];
export function timeInZone(date: Date, zone: string): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(date);
}
export function dateInZone(date: Date, zone: string): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: zone, weekday: 'short', day: 'numeric', month: 'short' }).format(date);
}
export function searchCities(query: string): City[] {
  const normalized = query.trim().toLocaleLowerCase();
  return cities.filter(city => `${city.name} ${city.country} ${city.timezone}`.toLocaleLowerCase().includes(normalized));
}
export function offsetMinutes(date: Date, zone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'longOffset' }).formatToParts(date);
  const raw = parts.find(part => part.type === 'timeZoneName')?.value ?? 'GMT';
  const match = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(raw);
  if (!match) return 0;
  return (match[1] === '+' ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}
export function offsetLabel(minutes: number): string {
  const sign = minutes >= 0 ? '+' : '-';
  const abs = Math.abs(minutes);
  return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}
