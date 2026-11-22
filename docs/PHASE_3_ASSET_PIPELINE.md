# Phase 3: 3D Asset Pipeline Deliverable

**Project**: MorphDrive — Interactive 3D Educational Inspection & Morphing Mechanism Platform  
**Milestone**: Phase 3 (3D Asset Pipeline, Weeks 4–6)  

---

## 1. Generated 3D Models (.glb)

All 4 starter models are stored in `apps/web/public/models/`:
1. `single_cylinder_engine.glb` (23.0 KB, 484 tris)
2. `gearbox.glb` (26.3 KB, 616 tris)
3. `landing_gear_strut.glb` (23.8 KB, 536 tris)
4. `turbine_stage.glb` (26.3 KB, 688 tris)

---

## 2. Machine Assembly Metadata JSONs

Stored in `apps/web/public/models/` and `packages/shared/src/data/`:
1. `single_cylinder_engine.json` (9 parts, 6 assembly steps, exploded vectors)
2. `gearbox.json` (8 parts, 3 assembly steps, exploded vectors)
3. `landing_gear_strut.json` (8 parts, 3 assembly steps, exploded vectors)
4. `turbine_stage.json` (6 parts, 3 assembly steps, exploded vectors)

---

## 3. Pipeline Generator Script

The automated asset generation script is available at:
`packages/assets-pipeline/scripts/generate-starter-models.ts`

Run via:
```bash
npx.cmd tsx packages/assets-pipeline/scripts/generate-starter-models.ts
```
