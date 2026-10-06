/**
 * EcoTwin AI – Grid / EBT Service
 *
 * Saat ini: simulasi profil harian Indonesia.
 * Nanti: integrasi API PLN, REC, atau commercial Energy API.
 */

import { analyzeCarbon } from '../core/carbonAnalyzer.js';
import { CONFIG } from '../core/config.js';

let simMinutes = 12 * 60 + 20; // mulai ~12:20

/**
 * Majukan jam simulasi
 */
export function tickSimulation() {
  simMinutes += CONFIG.simulation.minutesPerTick;
  return getCurrentGridState();
}

/**
 * State grid saat ini
 */
export function getCurrentGridState() {
  const hour = (simMinutes / 60) % 24;
  const analysis = analyzeCarbon(hour);

  const hh = Math.floor(hour);
  const mm = Math.floor(simMinutes % 60);

  return {
    simMinutes,
    hour,
    clock: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
    isDaytime: hour >= 6 && hour < 18,
    carbonKg: analysis.carbonKg,
    ebtPercent: analysis.ebtPercent,
    breakdown: analysis.breakdown,
    timestamp: analysis.timestamp,
  };
}

/**
 * Set waktu simulasi manual (menit dari tengah malam)
 */
export function setSimMinutes(m) {
  simMinutes = m;
  return getCurrentGridState();
}

/**
 * Placeholder: fetch data real (belum diimplementasi)
 * Ganti body dengan fetch ke Energy API / PLN partnership
 */
export async function fetchRealGridData(/* region */) {
  // TODO: integrasi real
  // const res = await fetch('https://energy-api.example/v2/renewable/production?region=JAMALI');
  // return res.json();
  console.warn('[gridService] Real grid API belum terhubung — pakai simulasi');
  return getCurrentGridState();
}

export default {
  tickSimulation,
  getCurrentGridState,
  setSimMinutes,
  fetchRealGridData,
};
