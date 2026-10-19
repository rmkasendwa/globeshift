import { useEffect, useState } from "react";
import { cities, dateInZone, timeInZone } from "@globeshift/core";

export function App() {
  const [now, setNow] = useState(() => new Date());
  const [selected, setSelected] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("globeshift:cities") || '["kampala","london","new-york","tokyo"]'); }
    catch { return ["kampala", "london", "new-york", "tokyo"]; }
  });
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => { localStorage.setItem("globeshift:cities", JSON.stringify(selected)); }, [selected]);
  return <main className="shell">
    <header><div className="brand">◉ <strong>Globe Shift</strong></div><span>World clocks · Trading sessions</span></header>
    <section className="hero"><p className="eyebrow">YOUR WORLD AT A GLANCE</p><h1>Time moves differently everywhere.</h1><p>Stay in sync with people and markets around the globe.</p></section>
    <section className="panel"><div className="panel-heading"><h2>World clocks</h2><label>Add city <select value="" onChange={e => { if (e.target.value) setSelected(old => [...new Set([...old,e.target.value])]); }}><option value="">Choose a city</option>{cities.filter(c=>!selected.includes(c.id)).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>
      <div className="clock-grid">{selected.map(id=>{ const city=cities.find(c=>c.id===id); if(!city)return null;return <article className="clock-card" key={id}><button aria-label={`Remove ${city.name}`} onClick={()=>setSelected(old=>old.filter(v=>v!==id))}>×</button><h3>{city.name}</h3><p>{city.country}</p><div className="clock">{timeInZone(now,city.timezone)}</div><small>{dateInZone(now,city.timezone)}</small></article>; })}</div>
    </section><footer>Trading sessions and the interactive globe are coming next.</footer>
  </main>;
}
