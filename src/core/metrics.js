/**
 * EcoTwin AI – Metrics Engine
 *
 * PUE  = Total Facility Energy / IT Equipment Energy
 * WUE  = Water Used (L) / IT Energy (kWh)
 * CUE  = Total CO2 Emissions (kg) / IT Energy (kWh)
 *
 * Di prototype: nilai disimulasikan.
 * Di production: dihitung dari sensor power, water meter, dan carbon intensity.
 */

import { CONFIG } from './config.js';

/**
 * Hitung / simulasi metrik efisiensi
 *
 * @param {object} input
 * @param {number} input.carbonKg - grid carbon intensity
 * @param {number} [input.itPowerKw] - daya IT
 * @param {number} [input.totalPowerKw] - daya total fasilitas
 * @returns {object} metrik + klasifikasi (good/warn/bad)
 */
export function computeMetrics(input = {}) {
  const carbonKg = input.carbonKg ?? 0.7;
  const itPower = input.itPowerKw ?? 55 + Math.random() * 15;
  const totalPower = input.totalPowerKw ?? itPower * (1.18 + Math.random() * 0.2);

  // PUE
  const pue = totalPower / Math.max(itPower, 0.1);

  // WUE – simulasi (L/kWh); data center efisien ~1.0–1.8
  const wue = 1.25 + Math.random() * 0.55;

  // CUE ≈ carbon intensity × (sedikit overhead facility)
  const cue = carbonKg * (0.9 + Math.random() * 0.18);

  const powerKw = totalPower;

  return {
    pue: round(pue, 2),
    wue: round(wue, 1),
    cue: round(cue, 2),
    powerKw: round(powerKw, 0),
    itPowerKw: round(itPower, 1),
    classification: {
      pue: classify(pue, CONFIG.thresholds.pue),
      wue: classify(wue, CONFIG.thresholds.wue),
      cue: classify(cue, CONFIG.thresholds.cue),
      carbon: classify(carbonKg, CONFIG.thresholds.carbon),
    },
    timestamp: Date.now(),
  };
}

function classify(value, { good, warn }) {
  if (value < good) return 'good';
  if (value < warn) return 'warn';
  return 'bad';
}

function round(n, d) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

/**
 * Format untuk dashboard
 */
export function formatMetrics(m) {
  return {
    pue: { value: m.pue, unit: '', class: m.classification.pue },
    wue: { value: m.wue, unit: 'L/kWh', class: m.classification.wue },
    cue: { value: m.cue, unit: '', class: m.classification.cue },
    power: { value: m.powerKw, unit: 'kW', class: m.powerKw < 85 ? 'good' : m.powerKw < 100 ? 'warn' : 'bad' },
  };
}

export default { computeMetrics, formatMetrics };
