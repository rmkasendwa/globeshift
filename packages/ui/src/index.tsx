import { useEffect, useMemo, useState } from 'react';
import { cities, dateInZone, offsetLabel, offsetMinutes, searchCities, timeInZone } from '@globeshift/core';
import { SpinningEarth } from '@globeshift/globe';

const DEFAULT_CITIES = ['kampala', 'london', 'new-york', 'tokyo'];
function storedCities(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem('globeshift:cities') || JSON.stringify(DEFAULT_CITIES));
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string' && cities.some(c => c.id === id)) : DEFAULT_CITIES;
  } catch { return DEFAULT_CITIES; }
}
export function App() {
  const [now, setNow] = useState(() => new Date());
  const [selected, setSelected] = useState<string[]>(storedCities);
  const [query, setQuery] = useState('');
  const [minutesAhead, setMinutesAhead] = useState(0);
  const [home, setHome] = useState(() => localStorage.getItem('globeshift:home') || 'kampala');
  const [focused, setFocused] = useState<string | undefined>(undefined);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => { localStorage.setItem('globeshift:cities', JSON.stringify(selected)); }, [selected]);
  useEffect(() => { localStorage.setItem('globeshift:home', home); }, [home]);
  const displayedAt = useMemo(() => new Date(now.getTime() + minutesAhead * 60000), [now, minutesAhead]);
  const homeCity = cities.find(city => city.id === home) || cities[0];
  const suggestions = searchCities(query).filter(city => !selected.includes(city.id)).slice(0, 8);
  return <main className="shell">
    <header><div className="brand">◉ <strong>Globe Shift</strong></div><span>World clocks · Trading sessions</span></header>
    <section className="hero"><p className="eyebrow">YOUR WORLD AT A GLANCE</p><h1>Time moves differently everywhere.</h1><p>Stay in sync with people and markets around the globe.</p></section>
    <SpinningEarth selectedIds={selected} focusedCityId={focused} />
    <section className="panel">
      <div className="panel-heading"><h2>World clocks</h2><label>Home city <select aria-label="Home city" value={home} onChange={event => setHome(event.target.value)}>{cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}</select></label></div>
      <div className="toolbar"><label>Find a city <input aria-label="Search cities" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search cities or countries" /></label>
        {query && <div className="suggestions" role="listbox" aria-label="City search results">{suggestions.map(city => <button key={city.id} onClick={() => { setSelected(old => [...old, city.id]); setFocused(city.id); setQuery(''); }}>{city.name}, {city.country}</button>)}{suggestions.length === 0 && <p>No matching cities available.</p>}</div>}
      </div>
      <div className="time-travel"><label htmlFor="time-offset">Compare times: {minutesAhead === 0 ? 'Now' : `${minutesAhead > 0 ? '+' : ''}${Math.round(minutesAhead / 60)} hours`}</label><input id="time-offset" type="range" min="-720" max="1440" step="30" value={minutesAhead} onChange={event => setMinutesAhead(Number(event.target.value))}/><button onClick={() => setMinutesAhead(0)}>Reset</button></div>
      <div className="clock-grid">{selected.map(id => { const city = cities.find(c => c.id === id); if (!city) return null; const diff = (offsetMinutes(displayedAt, city.timezone) - offsetMinutes(displayedAt, homeCity.timezone)) / 60; return <article className="clock-card" key={id}><button aria-label={`Remove ${city.name}`} onClick={() => setSelected(old => old.filter(value => value !== id))}>×</button><button className="focus" onClick={() => setFocused(city.id)} aria-label={`Focus globe on ${city.name}`}>◎ Focus</button><h3>{city.name}</h3><p>{city.country}</p><div className="clock">{timeInZone(displayedAt, city.timezone)}</div><small>{dateInZone(displayedAt, city.timezone)} · {offsetLabel(offsetMinutes(displayedAt, city.timezone))}</small><p className="difference">{diff === 0 ? 'Same time as home' : `${diff > 0 ? '+' : ''}${diff}h from ${homeCity.name}`}</p></article>; })}</div>
    </section><footer>All times use IANA time zones and account for daylight saving.</footer>
  </main>;
}
