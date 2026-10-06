/**
 * EcoTwin AI – System Engine
 *
 * Menghubungkan semua modul:
 * Grid → Carbon Analyzer → Orchestrator → Metrics → Compliance → (UI / Twin)
 */

import { CONFIG } from './config.js';
import { createOrchestratorState, decide, getStatusSummary } from './orchestrator.js';
import { computeMetrics, formatMetrics } from './metrics.js';
import * as gridService from '../services/gridService.js';
import * as sensorService from '../services/sensorService.js';
import * as compliance from '../services/complianceLogger.js';

/**
 * Buat instance sistem EcoTwin
 */
export function createEcoTwinSystem() {
  let orchestrator = createOrchestratorState();
  let racks = sensorService.createRacks();
  let lastGrid = gridService.getCurrentGridState();
  let lastMetrics = computeMetrics({ carbonKg: lastGrid.carbonKg });
  const listeners = new Set();

  function notify(event, payload) {
    listeners.forEach((fn) => {
      try {
        fn(event, payload);
      } catch (e) {
        console.error('[EcoTwin] listener error', e);
      }
    });
  }

  /**
   * Satu siklus sistem (dipanggil oleh timer atau tick manual)
   */
  function tick() {
    lastGrid = gridService.tickSimulation();
    orchestrator = decide(orchestrator, lastGrid.carbonKg);
    lastMetrics = computeMetrics({ carbonKg: lastGrid.carbonKg });

    const ambient = 24 + Math.sin(lastGrid.hour / 24 * Math.PI * 2) * 1.2;
    racks = sensorService.updateRacks(racks, ambient);

    compliance.logSnapshot({
      grid: lastGrid,
      metrics: lastMetrics,
      orchestration: orchestrator,
    });

    const snapshot = getSnapshot();
    notify('tick', snapshot);
    return snapshot;
  }

  function getSnapshot() {
    return {
      app: { name: CONFIG.appName, version: CONFIG.version },
      grid: lastGrid,
      metrics: lastMetrics,
      metricsFormatted: formatMetrics(lastMetrics),
      orchestration: orchestrator,
      status: getStatusSummary(orchestrator),
      racks: racks.map((r) => ({
        ...r,
        tempClass: sensorService.tempClass(r.temp),
        tempColor: sensorService.tempColor(r.temp),
      })),
      complianceRecent: compliance.getRecentLogs(5),
    };
  }

  function setCarbonAware(enabled) {
    orchestrator = { ...orchestrator, carbonAwareEnabled: enabled };
    orchestrator = decide(orchestrator, lastGrid.carbonKg);
    notify('policy', getSnapshot());
  }

  function on(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function start(intervalMs = CONFIG.simulation.tickIntervalMs) {
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }

  return {
    tick,
    start,
    getSnapshot,
    setCarbonAware,
    on,
    // expose sub-services for advanced use
    services: { gridService, sensorService, compliance },
    config: CONFIG,
  };
}

export default createEcoTwinSystem;
