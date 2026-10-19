export type City = { id: string; name: string; country: string; timezone: string };
export const cities: City[] = [
  { id: "kampala", name: "Kampala", country: "Uganda", timezone: "Africa/Kampala" },
  { id: "london", name: "London", country: "United Kingdom", timezone: "Europe/London" },
  { id: "new-york", name: "New York", country: "United States", timezone: "America/New_York" },
  { id: "tokyo", name: "Tokyo", country: "Japan", timezone: "Asia/Tokyo" },
  { id: "sydney", name: "Sydney", country: "Australia", timezone: "Australia/Sydney" },
];
export function timeInZone(date: Date, zone: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(date);
}
export function dateInZone(date: Date, zone: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: zone, weekday: "short", day: "numeric", month: "short" }).format(date);
}
