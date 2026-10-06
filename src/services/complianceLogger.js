/**
 * EcoTwin AI – Compliance / AMDAL Logger
 *
 * Mencatat snapshot metrik & keputusan orchestration
 * agar siap dipakai untuk audit / laporan lingkungan.
 */

const logs = [];
const MAX_LOGS = 500;

/**
 * Catat satu entri compliance
 */
export function logSnapshot({ grid, metrics, orchestration, note }) {
  const entry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    clock: grid?.clock ?? null,
    carbonKg: grid?.carbonKg ?? null,
    ebtPercent: grid?.ebtPercent ?? null,
    pue: metrics?.pue ?? null,
    wue: metrics?.wue ?? null,
    cue: metrics?.cue ?? null,
    powerKw: metrics?.powerKw ?? null,
    highCarbon: orchestration?.lastDecision?.highCarbon ?? null,
    deferredJobs: orchestration?.lastDecision?.deferredCount ?? null,
    message: orchestration?.lastDecision?.message ?? null,
    note: note ?? null,
  };

  logs.unshift(entry);
  if (logs.length > MAX_LOGS) logs.pop();
  return entry;
}

/**
 * Ambil log terbaru
 */
export function getRecentLogs(limit = 50) {
  return logs.slice(0, limit);
}

/**
 * Ekspor ringkas untuk laporan (JSON)
 */
export function exportForReport(fromIso, toIso) {
  let items = [...logs];
  if (fromIso) items = items.filter((l) => l.timestamp >= fromIso);
  if (toIso) items = items.filter((l) => l.timestamp <= toIso);

  return {
    generatedAt: new Date().toISOString(),
    purpose: 'EcoTwin AI – Compliance snapshot (AMDAL / ESG support)',
    count: items.length,
    records: items,
    disclaimer:
      'Data prototype/simulasi. Ganti dengan pembacaan sensor & grid resmi sebelum dipakai audit formal.',
  };
}

/**
 * Ringkasan harian sederhana
 */
export function dailySummary() {
  if (logs.length === 0) return null;
  const carbons = logs.map((l) => l.carbonKg).filter((v) => v != null);
  const pues = logs.map((l) => l.pue).filter((v) => v != null);
  avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

  return {
    samples: logs.length,
    avgCarbonKg: avg(carbons),
    avgPue: avg(pues),
    maxCarbonKg: carbons.length ? Math.max(...carbons) : null,
    minCarbonKg: carbons.length ? Math.min(...carbons) : null,
  };
}

function avg(arr) {
  if (!arr.length) return null;
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 1000) / 1000;
}

export default {
  logSnapshot,
  getRecentLogs,
  exportForReport,
  dailySummary,
};
