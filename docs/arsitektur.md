# Arsitektur EcoTwin AI

## Alur data (end-to-end)

```
1. Sensor Service          →  suhu, load, power per rak
2. Grid Service            →  EBT + carbon intensity (simulasi / API)
3. Carbon Analyzer         →  analisis residual carbon
4. Orchestrator            →  keputusan Inference vs Batch
5. Metrics Engine          →  PUE, WUE, CUE
6. Compliance Logger       →  snapshot untuk AMDAL / audit
7. Digital Twin + UI       →  visual 3D + dashboard
```

## Prinsip desain

1. **Modular** – setiap modul bisa diganti (mis. ganti mock sensor dengan MQTT).
2. **Indonesia-first** – profil EBT & ambang carbon disetel ke konteks lokal.
3. **Compliance-aware** – setiap tick bisa dilog untuk laporan lingkungan.
4. **Prototype → production** – fungsi `fetchReal*` sengaja dikosongkan sebagai titik integrasi.

## Integrasi berikutnya

| Komponen | Saat ini | Target |
|----------|----------|--------|
| Grid data | Simulasi profil harian | Energy API / PLN partnership / REC |
| Sensor rak | Mock drift | Redfish, IPMI, BMS, MQTT |
| Orchestrator | Rule-based | Hook ke Kubernetes / Slurm / job queue |
| Digital Twin | Three.js single HTML | React + R3F, multi-lantai |
| Auth & multi-tenant | Belum | Operator per data center |

## Menjalankan logika sistem (Node / browser module)

```js
import { createEcoTwinSystem } from './src/core/system.js';

const eco = createEcoTwinSystem();

eco.on((event, snapshot) => {
  console.log(event, snapshot.grid.clock, snapshot.status.text);
});

const stop = eco.start(); // tick otomatis
// stop() untuk menghentikan
```
