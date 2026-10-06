/**
 * EcoTwin AI – Carbon Analyzer
 *
 * Menghitung intensitas karbon grid berdasarkan profil EBT lokal Indonesia
 * (geothermal + solar tropis + hydro).
 *
 * Di production: diganti dengan data real-time dari PLN / sensor / Energy API.
 */

import { CONFIG } from './config.js';

/**
 * Estimasi porsi EBT pada jam tertentu (0–24)
 * @param {number} hour - jam desimal (mis. 14.5 = 14:30)
 * @returns {{ solar: number, geothermal: number, hydro: number, total: number }}
 */
export function estimateEbtShare(hour) {
  const { geothermalBase, hydroBase, solarPeakFactor, solarPeakHour, solarWidthHours } =
    CONFIG.indonesiaEbtProfile;

  let solar = 0;
  if (hour >= 6 && hour <= 18) {
    const x = (hour - solarPeakHour) / solarWidthHours;
    solar = Math.exp(-(x * x)) * solarPeakFactor;
  }

  const geothermal = geothermalBase;
  const hydro = hydroBase;
  const total = Math.min(0.85, solar + geothermal + hydro);

  return { solar, geothermal, hydro, total };
}

/**
 * Hitung intensitas karbon grid (kgCO2/kWh)
 * Semakin tinggi EBT → semakin rendah carbon intensity
 *
 * @param {number} hour - jam desimal
 * @param {object} [opts]
 * @param {number} [opts.noise=0.02] - noise acak untuk simulasi
 * @returns {{ carbonKg: number, ebtPercent: number, breakdown: object }}
 */
export function analyzeCarbon(hour, opts = {}) {
  const noise = opts.noise ?? 0.02;
  const breakdown = estimateEbtShare(hour);
  const ebt = breakdown.total;

  const { min, max, nightBase } = CONFIG.gridCarbonFallback;
  // Base tinggi malam hari, dikurangi proporsional dengan EBT
  let carbonKg = nightBase - ebt * 0.56;
  carbonKg += (Math.random() - 0.5) * noise;
  carbonKg = Math.max(min, Math.min(max, carbonKg));

  return {
    carbonKg,
    ebtPercent: ebt * 100,
    breakdown,
    hour,
    timestamp: Date.now(),
  };
}

/**
 * Apakah carbon sedang tinggi (perlu defer batch)?
 */
export function isHighCarbon(carbonKg) {
  return carbonKg > CONFIG.orchestration.deferBatchAboveKg;
}

export default {
  estimateEbtShare,
  analyzeCarbon,
  isHighCarbon,
};
