import { allSessionStatuses, activeOverlaps } from '@globeshift/core/sessions';
function countdown(to: Date, from: Date) {
  if (!Number.isFinite(to.getTime())) return 'Unavailable';
  const total = Math.max(0, Math.floor((to.getTime() - from.getTime()) / 60000));
  return `${Math.floor(total / 60)}h ${String(total % 60).padStart(2, '0')}m`;
}
export function Sessions({ now }: { now: Date }) {
  const statuses = allSessionStatuses(now);
  const overlapping = activeOverlaps(now);
  return <section className="panel sessions" aria-label="Forex market sessions">
    <div className="panel-heading"><h2>Forex trading sessions</h2><span className="sessions-note">Indicative local business-hour windows</span></div>
    <div className="session-grid">{statuses.map(status => <article key={status.session.id} className="session-card">
      <div className="session-name">{status.session.name}<span className={status.open ? 'status-open' : 'status-closed'}>{status.open ? '● Open' : '○ Closed'}</span></div>
      <p>{status.open ? `Closes in ${countdown(status.nextClose!, now)}` : `Opens in ${countdown(status.nextOpen, now)}`}</p>
      <small>{status.session.openHour}:00–{status.session.closeHour}:00 local time</small>
    </article>)}</div>
    <p className="overlap">{overlapping.length > 1 ? `Currently overlapping: ${overlapping.join(' + ')}` : overlapping.length === 1 ? `Active session: ${overlapping[0]}` : 'No tracked sessions currently active'}</p>
    <p className="disclaimer">Indicative forex trading sessions, not official exchange calendars or investment advice. Holidays and early closures are not yet modeled.</p>
  </section>;
}
