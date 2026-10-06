EcoTwin AI
Digital Twin, Carbon-Aware Orchestration, and Environmental Compliance for AI Data Centers in Indonesia
EcoTwin AI is a software platform designed to help data center operators monitor facility efficiency, orchestrate AI workloads based on local renewable energy availability, and support environmental compliance reporting (including AMDAL-related metrics).

Overview
The platform integrates three capabilities that are typically delivered as separate systems:

Carbon-aware workload orchestration — prioritizes real-time inference while deferring batch training when grid carbon intensity is high
Web-based 3D digital twin — browser-accessible visualization of racks, thermal status, and operational state without enterprise license costs
Compliance-oriented metrics — continuous tracking of PUE, WUE, and CUE with audit-friendly logging

The design is tailored to Indonesian operating conditions, including local renewable energy profiles (geothermal baseload and tropical solar variability) and regulatory expectations around environmental permitting.

System Architecture
text┌─────────────────────────────────────┐
                    │             EcoTwin AI              │
                    └─────────────────────────────────────┘
                                      │
        ┌───────────────┬─────────────┼─────────────┬───────────────┐
        ▼               ▼             ▼             ▼               ▼
  Sensor / Grid    Carbon         Workload      3D Digital      Compliance
     Data         Analyzer      Orchestrator       Twin           Logger


ComponentPathDescriptionConfigurationsrc/core/config.jsSystem constants, thresholds, Indonesia EBT profileCarbon Analyzersrc/core/carbonAnalyzer.jsEstimates grid carbon intensity from renewable shareOrchestratorsrc/core/orchestrator.jsInference vs batch scheduling decisionsMetrics Enginesrc/core/metrics.jsPUE, WUE, CUE calculationSystem Enginesrc/core/system.jsIntegrates all modules into a single runtime loopGrid Servicesrc/services/gridService.jsGrid / renewable data (simulated; replaceable with live API)Sensor Servicesrc/services/sensorService.jsRack temperature, load, and power (mock sensors)Compliance Loggersrc/services/complianceLogger.jsTime-stamped snapshots for audit and reportingVisual Prototypepublic/ecotwin-prototype.htmlInteractive 3D digital twin and dashboard

Getting Started
Visual prototype
Open in a modern browser (Chrome, Edge, or Firefox):
textpublic/ecotwin-prototype.html
No build step or installation is required for the prototype.
Core system modules
JavaScriptimport { createEcoTwinSystem } from './src/core/system.js';

const system = createEcoTwinSystem();
system.on((event, snapshot) => { /* ... */ });
const stop = system.start();

Current Status


AreaStatusConcept and architectureCompleteBrowser-based 3D digital twinPrototype availableCarbon-aware orchestration (simulated)ImplementedPUE / WUE / CUE metricsImplementedCompliance event loggingImplementedLive facility sensorsNot yet integratedLive PLN / renewable energy APINot yet integratedProduction backend and multi-tenant authPlanned

License
Proprietary. All Rights Reserved.
Copyright © 2026 EcoTwin AI.

Unauthorized use, copying, modification, distribution, or commercial exploitation is prohibited without prior written permission.
See LICENSE for full terms.

Disclaimer
This repository contains prototype and simulation components. Metric values and grid data in the current build are simulated and must not be used for formal regulatory submissions until connected to verified operational data sources.
