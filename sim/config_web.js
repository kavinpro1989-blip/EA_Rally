/**
 * Browser loader for the /config/*.json bundle (Three.js apps).
 *   const cfg = await loadConfigUrl('/config');
 */
export async function loadConfigUrl(baseUrl, fetchImpl = globalThis.fetch) {
  const get = async (f) => {
    const res = await fetchImpl(`${baseUrl.replace(/\/$/, '')}/${f}`);
    if (!res.ok) throw new Error(`failed to load ${f}: HTTP ${res.status}`);
    return res.json();
  };
  const [engine, drivetrain, chassis, tires, surfaces, damage, simulation, gpsStageSchema] = await Promise.all([
    'engine.json', 'drivetrain.json', 'chassis.json', 'tires.json', 'surfaces.json', 'damage.json', 'simulation.json', 'gps_stage_schema.json',
  ].map(get));
  return { engine, drivetrain, chassis, tires, surfaces, damage, simulation, gpsStageSchema };
}

export async function loadStageUrl(url, fetchImpl = globalThis.fetch) {
  const res = await fetchImpl(url);
  if (!res.ok) throw new Error(`failed to load stage ${url}: HTTP ${res.status}`);
  return res.json();
}
