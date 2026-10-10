# EcoTwin AI

**Digital Twin, Carbon-Aware Orchestration, and Environmental Compliance for AI Data Centers in Indonesia.**

EcoTwin AI is a software platform designed to help data center operators monitor facility efficiency, orchestrate AI workloads based on local renewable energy availability, and support environmental compliance reporting (including AMDAL-related metrics).

> **Status:** prototype. Metric values and grid data in the current build are simulated. See the [Disclaimer](#disclaimer).

## Overview

The platform integrates three capabilities that are typically delivered as separate systems:

1. **Carbon-aware workload orchestration:** prioritizes real-time inference while deferring batch training when grid carbon intensity is high.
2. **Web-based 3D digital twin:** browser-accessible visualization of racks, thermal status, and operational state without enterprise license costs.
3. **Compliance-oriented metrics:** continuous tracking of PUE, WUE, and CUE with audit-friendly logging.

The design is tailored to Indonesian operating conditions, including local renewable energy profiles (geothermal baseload and tropical solar variability) and regulatory expectations around environmental permitting.

## System Architecture

```
                    ┌─────────────┐
                    │ EcoTwin AI  │
                    └──────┬──────┘
     ┌─────────────┬───────┼───────────┬──────────────┐
     ▼             ▼       ▼           ▼              ▼
 Sensor / Grid   Carbon   Workload   3D Digital   Compliance
     Data       Analyzer  Orchestrator   Twin        Logger
```

### Component Directory

| Component | Path | Description |
|---|---|---|
| Configuration | `src/core/config.js` | System constants, thresholds, and Indonesia EBT (renewable energy) profile |
| Carbon Analyzer | `src/core/carbonAnalyzer.js` | Estimates grid carbon intensity based on renewable energy share |
| Orchestrator | `src/core/orchestrator.js` | Manages real-time inference vs. batch job scheduling decisions |
| Metrics Engine | `src/core/metrics.js` | Calculates PUE, WUE, and CUE efficiency metrics |
| System Engine | `src/core/system.js` | Integrates all core modules into a unified runtime loop |
| Grid Service | `src/services/gridService.js` | Grid/renewable data interface (simulated; replaceable with a live API) |
| Sensor Service | `src/services/sensorService.js` | Rack temperature, load, and power data (mock sensors) |
| Compliance Logger | `src/services/complianceLogger.js` | Time-stamped snapshots for environmental audit and reporting |
| Visual Prototype | `public/ecotwin-prototype.html` | Interactive web-based 3D digital twin and monitoring dashboard |

## Getting Started

### 1. Visual Prototype

Open the following file in any modern browser (Chrome, Edge, or Firefox):

```
public/ecotwin-prototype.html
```

No build steps or dependency installations are required for the visual prototype.

### 2. Core System Integration

To initialize and integrate the core system runtime in your project:

```javascript
import { createEcoTwinSystem } from './src/core/system.js';

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
```

## Roadmap & Status

| Area | Status |
|---|---|
| Concept and Architecture | ✅ Complete |
| Browser-based 3D Digital Twin | 🧪 Prototype available |
| Carbon-aware Orchestration (simulated) | ✅ Implemented |
| PUE / WUE / CUE Metrics Engine | ✅ Implemented |
| Compliance Event Logging | ✅ Implemented |
| Live Facility Sensors Integration | ⏳ Planned |
| Live PLN / Renewable Energy API Connection | ⏳ Planned |
| Production Backend & Multi-tenant Auth | ⏳ Planned |

## License

**Proprietary. All Rights Reserved.**

Copyright © 2026 EcoTwin AI.

Unauthorized copying, modification, distribution, or commercial exploitation is prohibited without prior written permission.

## Disclaimer

This repository contains prototype and simulation components. Metric values and grid data in the current build are simulated and **must not be used for formal regulatory submissions** until connected to verified operational data sources.
