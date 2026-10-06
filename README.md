# EcoTwin AI

Platform Digital Twin + Carbon-Aware Orchestration + Compliance untuk Data Center AI di Indonesia.

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                      EcoTwin AI                         │
├──────────────┬──────────────┬──────────────┬────────────┤
│   Sensors &  │   Carbon     │  Workload    │  3D Twin   │
│   Grid Data  │   Analyzer   │  Orchestrator│  + UI      │
├──────────────┴──────────────┴──────────────┴────────────┤
│              Compliance / AMDAL Logger                  │
└─────────────────────────────────────────────────────────┘
```

## Modul

| Modul | File | Fungsi |
|-------|------|--------|
| Config | `src/core/config.js` | Konstanta & profil Indonesia |
| Carbon Analyzer | `src/core/carbonAnalyzer.js` | Hitung intensitas karbon dari EBT |
| Orchestrator | `src/core/orchestrator.js` | Inference vs Batch decision |
| Metrics | `src/core/metrics.js` | PUE, WUE, CUE |
| Grid Service | `src/services/gridService.js` | Mock / data EBT lokal |
| Sensor Service | `src/services/sensorService.js` | Mock suhu, load, power rak |
| Compliance | `src/services/complianceLogger.js` | Log siap AMDAL |
| Digital Twin | `src/twin/` | 3D scene (Three.js) |
| UI | `src/ui/` | Dashboard overlay |

## Cara menjalankan prototype visual

Buka file standalone:
```
public/ecotwin-prototype.html
```
atau salin dari `../ecotwin-ai-v7.html`

## Status

- ✅ Konsep & arsitektur
- ✅ Prototype 3D Digital Twin (browser)
- ✅ Simulasi carbon-aware + metrik
- ⏳ Integrasi sensor nyata
- ⏳ API PLN / data EBT real-time
- ⏳ Backend production

## Lisensi

Prototype internal — EcoTwin AI
