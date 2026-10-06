/**
 * EcoTwin AI – Konfigurasi sistem
 * Disesuaikan untuk konteks data center AI Indonesia
 */

export const CONFIG = {
  // Nama & versi
  appName: 'EcoTwin AI',
  version: '0.7.0-prototype',

  // Ambang batas efisiensi (target / warning)
  thresholds: {
    pue:  { good: 1.28, warn: 1.40 },
    wue:  { good: 1.50, warn: 2.00 },  // L/kWh
    cue:  { good: 0.60, warn: 0.90 },  // kgCO2/kWh IT
    carbon: { good: 0.55, warn: 0.68 }, // kgCO2/kWh grid
    rackTemp: { normal: 28, warm: 32 }, // °C
  },

  // Carbon-aware policy
  orchestration: {
    // Jika carbon intensity di atas ini → defer batch jobs
    deferBatchAboveKg: 0.67,
    // Inference selalu prioritas (tidak di-defer)
    protectInference: true,
  },

  // Profil EBT Indonesia (aproksimasi JAMALI-like)
  // Dipakai saat data real-time belum tersedia
  indonesiaEbtProfile: {
    geothermalBase: 0.14,   // porsi relatif stabil
    hydroBase: 0.07,
    solarPeakFactor: 0.44,  // kontribusi solar puncak siang
    solarPeakHour: 12.5,
    solarWidthHours: 3.5,
  },

  // Grid emission factor fallback (kgCO2/kWh)
  // Indonesia masih tinggi karena coal-dominant
  gridCarbonFallback: {
    min: 0.36,
    max: 0.88,
    nightBase: 0.82,
  },

  // Simulasi waktu (detik nyata → menit simulasi)
  simulation: {
    minutesPerTick: 2.2,
    tickIntervalMs: 1600,
  },

  // Layout default digital twin
  twin: {
    rackRows: 3,
    rackCols: 6,
    roomWidth: 34,
    roomDepth: 26,
    roomHeight: 5.8,
  },
};

export default CONFIG;
