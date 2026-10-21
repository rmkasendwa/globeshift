import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import type { GlobeMethods } from 'react-globe.gl';
import { cities } from '@globeshift/core';

const EARTH_TEXTURE = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const NIGHT_TEXTURE = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';
const BUMP_TEXTURE = 'https://unpkg.com/three-globe/example/img/earth-topology.png';

type Props = { selectedIds: string[]; focusedCityId?: string };
export function SpinningEarth({ selectedIds, focusedCityId }: Props) {
  const ref = useRef<GlobeMethods | undefined>(undefined);
  const holder = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(700);
  const [supported, setSupported] = useState(true);
  const [paused, setPaused] = useState(false);
  const [night, setNight] = useState(false);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      setSupported(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')));
    } catch { setSupported(false); }
  }, []);
  useEffect(() => {
    if (!holder.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(260, Math.floor(entry.contentRect.width))));
    observer.observe(holder.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    const controls = ref.current.controls();
    controls.autoRotate = !paused;
    controls.autoRotateSpeed = 0.35;
    controls.enableDamping = true;
    ref.current.pointOfView({ lat: 10, lng: 20, altitude: 2.25 }, 0);
  }, [supported, paused]);
  useEffect(() => {
    const city = cities.find(item => item.id === focusedCityId);
    if (city && ref.current) ref.current.pointOfView({ lat: city.latitude, lng: city.longitude, altitude: 1.75 }, 1100);
  }, [focusedCityId]);
  const markers = cities.filter(city => selectedIds.includes(city.id));
  return <section className="earth-panel" aria-label="Interactive rotating Earth">
    <div className="earth-heading"><div><h2>Our planet, in motion</h2><p>Drag to rotate · Scroll to zoom · Select a city to focus</p></div>
      <div className="earth-actions"><button onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? 'Resume rotation' : 'Pause rotation'}</button><button onClick={() => setNight(value => !value)} aria-pressed={night}>{night ? 'Day view' : 'Night view'}</button></div></div>
    <div className="earth-canvas" ref={holder}>
      {supported ? <Globe ref={ref} width={width} height={Math.min(580, Math.max(340, width * 0.64))}
        backgroundColor="rgba(0,0,0,0)" globeImageUrl={night ? NIGHT_TEXTURE : EARTH_TEXTURE}
        bumpImageUrl={BUMP_TEXTURE} showAtmosphere atmosphereColor="#4b9cfa" atmosphereAltitude={0.17}
        pointsData={markers} pointLat="latitude" pointLng="longitude" pointAltitude={0.015} pointRadius={0.5}
        pointColor={() => '#7dd3fc'} pointLabel={item => {
          const city = item as (typeof cities)[number];
          return `${city.name} · ${city.country}`;
        }} labelsData={markers} labelLat="latitude" labelLng="longitude" labelText="name"
        labelColor={() => '#ffffff'} labelSize={1.15} labelDotRadius={0.32}
        onGlobeReady={() => { if (ref.current) { const controls = ref.current.controls(); controls.autoRotate = !paused; controls.autoRotateSpeed = 0.35; controls.enableDamping = true; } }}
      /> : <div className="earth-fallback">3D graphics are unavailable on this device. World clocks remain fully functional.</div>}
    </div>
    <p className="earth-credit">Earth imagery provided by the three-globe example assets. Requires an internet connection until textures are bundled locally. Day/night is a manual view toggle, not yet an astronomical terminator.</p>
  </section>;
}
