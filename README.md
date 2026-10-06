EcoTwin AIDigital Twin, Carbon-Aware Orchestration, and Environmental Compliance for AI Data Centers in Indonesia.EcoTwin AI is a software platform designed to help data center operators monitor facility efficiency, orchestrate AI workloads based on local renewable energy availability, and support environmental compliance reporting (including AMDAL-related metrics).OverviewThe platform integrates three capabilities that are typically delivered as separate systems:Carbon-aware workload orchestration — Prioritizes real-time inference while deferring batch training when grid carbon intensity is high.Web-based 3D digital twin — Browser-accessible visualization of racks, thermal status, and operational state without enterprise license costs.Compliance-oriented metrics — Continuous tracking of PUE, WUE, and CUE with audit-friendly logging.The design is tailored to Indonesian operating conditions, including local renewable energy profiles (geothermal baseload and tropical solar variability) and regulatory expectations around environmental permitting.System Architecture┌─────────────────────────────────────┐
│             EcoTwin AI              │
└─────────────────────────────────────┘
                   │
  ┌───────────────┬┴─────────────┬─────────────┬───────────────┐
  ▼               ▼              ▼             ▼               ▼
Sensor / Grid   Carbon       Workload      3D Digital      Compliance
    Data       Analyzer    Orchestrator       Twin           Logger
Component DirectoryComponentPathDescriptionConfigurationsrc/core/config.jsSystem constants, thresholds, and Indonesia EBT (Renewable Energy) profileCarbon Analyzersrc/core/carbonAnalyzer.jsEstimates grid carbon intensity based on renewable energy shareOrchestratorsrc/core/orchestrator.jsManages real-time inference vs. batch job scheduling decisionsMetrics Enginesrc/core/metrics.jsCalculates PUE, WUE, and CUE efficiency metricsSystem Enginesrc/core/system.jsIntegrates all core modules into a unified runtime loopGrid Servicesrc/services/gridService.jsGrid/renewable data interface (simulated; replaceable with live API)Sensor Servicesrc/services/sensorService.jsRack temperature, load, and power data (mock sensors)Compliance Loggersrc/services/complianceLogger.jsTime-stamped snapshots for environmental audit and reportingVisual Prototypepublic/ecotwin-prototype.htmlInteractive web-based 3D digital twin and monitoring dashboardGetting Started1. Visual PrototypeOpen the following file in any modern browser (Chrome, Edge, or Firefox):public/ecotwin-prototype.htmlNo build steps or dependency installations are required for the visual prototype.2. Core System IntegrationTo initialize and integrate the core system runtime in your project:import { createEcoTwinSystem } from './src/core/system.js';

// Initialize system instance
const system = createEcoTwinSystem();

// Subscribe to system events and metrics updates
system.on('update', (event, snapshot) => {
  console.log('System Snapshot:', snapshot);
});

// Start the runtime loop
const stop = system.start();

// To stop execution later:
// stop();
Current Roadmap & StatusAreaStatusConcept and Architecture✅ CompleteBrowser-based 3D Digital Twin🧪 Prototype AvailableCarbon-aware Orchestration (Simulated)✅ ImplementedPUE / WUE / CUE Metrics Engine✅ ImplementedCompliance Event Logging✅ ImplementedLive Facility Sensors Integration⏳ PlannedLive PLN / Renewable Energy API Connection⏳ PlannedProduction Backend & Multi-tenant Auth⏳ PlannedLicenseProprietary. All Rights Reserved.Copyright © 2026 EcoTwin AI.Unauthorized copying, modification, distribution, or commercial exploitation is prohibited without prior written permission.DisclaimerThis repository contains prototype and simulation components. Metric values and grid data in the current build are simulated and must not be used for formal regulatory submissions until connected to verified operational data sources.
