/**
 * EcoTwin AI – Sensor Service (mock)
 *
 * Menyediakan data suhu, load, power per rak.
 * Di production: ganti dengan MQTT / Modbus / IPMI / Redfish / BMS API.
 */

import { CONFIG } from '../core/config.js';

/**
 * Buat state awal semua rak
 */
export function createRacks(rows = CONFIG.twin.rackRows, cols = CONFIG.twin.rackCols) {
  const racks = [];
  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      racks.push({
        id,
        row: String.fromCharCode(65 + r),
        col: c + 1,
        label: `${String.fromCharCode(65 + r)}${c + 1}`,
        temp: 24 + Math.random() * 5,
        load: 0.28 + Math.random() * 0.48,
        powerKw: 3.3 + Math.random() * 3,
        workload: ['Inference', 'Batch', 'Mixed'][id % 3],
        status: 'Online',
      });
      id++;
    }
  }
  return racks;
}

/**
 * Update suhu & load (simulasi drift)
 */
export function updateRacks(racks, ambientHint = 24) {
  return racks.map((rack) => {
    let temp = rack.temp;
    temp += (rack.load * 2.8 - 1) * 0.09 + (Math.random() - 0.5) * 0.28;
    temp = Math.max(23, Math.min(35, temp * 0.97 + ambientHint * 0.03));

    // Load sedikit berubah
    let load = rack.load + (Math.random() - 0.5) * 0.03;
    load = Math.max(0.15, Math.min(0.95, load));

    const powerKw = 2.5 + load * 4.5 + (Math.random() - 0.5) * 0.3;

    return {
      ...rack,
      temp: Math.round(temp * 10) / 10,
      load: Math.round(load * 100) / 100,
      powerKw: Math.round(powerKw * 10) / 10,
    };
  });
}

/**
 * Klasifikasi suhu rak
 */
export function tempClass(temp) {
  const { normal, warm } = CONFIG.thresholds.rackTemp;
  if (temp < normal) return 'normal';
  if (temp < warm) return 'warm';
  return 'hot';
}

/**
 * Warna LED untuk visual twin
 */
export function tempColor(temp) {
  const c = tempClass(temp);
  if (c === 'normal') return 0x22c55e;
  if (c === 'warm') return 0xeab308;
  return 0xef4444;
}

/**
 * Placeholder baca sensor nyata
 */
export async function fetchRealSensors(/* rackIds */) {
  console.warn('[sensorService] Sensor API belum terhubung — pakai mock');
  return null;
}

export default {
  createRacks,
  updateRacks,
  tempClass,
  tempColor,
  fetchRealSensors,
};
