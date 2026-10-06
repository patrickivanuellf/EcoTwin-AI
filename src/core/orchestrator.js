/**
 * EcoTwin AI – Workload Orchestrator
 *
 * Memisahkan Inference (real-time, tidak boleh ditunda)
 * dari Batch Training (boleh digeser ke jam EBT tinggi / carbon rendah).
 */

import { CONFIG } from './config.js';
import { isHighCarbon } from './carbonAnalyzer.js';

/** Tipe workload */
export const WorkloadType = {
  INFERENCE: 'Inference',
  BATCH: 'Batch',
  MIXED: 'Mixed',
};

/** Status eksekusi */
export const JobStatus = {
  RUNNING: 'RUNNING',
  DEFERRED: 'DEFERRED',
  QUEUED: 'QUEUED',
  COMPLETED: 'COMPLETED',
};

/**
 * State orchestrator
 */
export function createOrchestratorState() {
  return {
    jobs: [
      { id: 'inf-01', name: 'Inference (Realtime)', type: WorkloadType.INFERENCE, status: JobStatus.RUNNING },
      { id: 'batch-a', name: 'Batch Training A', type: WorkloadType.BATCH, status: JobStatus.RUNNING },
      { id: 'batch-b', name: 'Batch Training B', type: WorkloadType.BATCH, status: JobStatus.RUNNING },
    ],
    lastDecision: null,
    carbonAwareEnabled: true,
  };
}

/**
 * Ambil keputusan orchestration berdasarkan carbon intensity
 *
 * @param {object} state - state orchestrator
 * @param {number} carbonKg - intensitas karbon saat ini
 * @returns {object} state baru + ringkasan keputusan
 */
export function decide(state, carbonKg) {
  const high = isHighCarbon(carbonKg);
  const protectInference = CONFIG.orchestration.protectInference;

  const jobs = state.jobs.map((job) => {
    if (job.type === WorkloadType.INFERENCE && protectInference) {
      return { ...job, status: JobStatus.RUNNING };
    }
    if (job.type === WorkloadType.BATCH) {
      if (!state.carbonAwareEnabled) {
        return { ...job, status: JobStatus.RUNNING };
      }
      return {
        ...job,
        status: high ? JobStatus.DEFERRED : JobStatus.RUNNING,
      };
    }
    // Mixed: treat as runnable unless extreme
    return {
      ...job,
      status: high && job.type === WorkloadType.BATCH ? JobStatus.DEFERRED : JobStatus.RUNNING,
    };
  });

  const decision = {
    timestamp: Date.now(),
    carbonKg,
    highCarbon: high,
    deferredCount: jobs.filter((j) => j.status === JobStatus.DEFERRED).length,
    runningCount: jobs.filter((j) => j.status === JobStatus.RUNNING).length,
    message: high
      ? 'Carbon tinggi — Batch ditunda'
      : 'Carbon-Aware aktif — Batch berjalan',
  };

  return {
    ...state,
    jobs,
    lastDecision: decision,
  };
}

/**
 * Ringkasan status untuk UI
 */
export function getStatusSummary(state) {
  const d = state.lastDecision;
  if (!d) {
    return { active: true, text: 'Carbon-Aware standby', high: false };
  }
  return {
    active: state.carbonAwareEnabled,
    text: d.message,
    high: d.highCarbon,
    deferredCount: d.deferredCount,
    runningCount: d.runningCount,
  };
}

export default {
  WorkloadType,
  JobStatus,
  createOrchestratorState,
  decide,
  getStatusSummary,
};
