# MorphDrive — Phase 6: Guided Disassembly Mode & DAG Dependency Validation

## 1. Executive Summary

Phase 6 implements the **Guided Disassembly & Assembly Mechanics Engine** for **MorphDrive**, transforming the platform from passive 3D inspection into an active, validated mechanical engineering laboratory. Physical constraints, mechanical fastening order, and clearance validation are enforced using a formal **Directed Acyclic Graph (DAG)** dependency engine powered by **GSAP** two-stage extraction animation and an **undo/redo** history stack.

---

## 2. Build Status

| Check | Result |
|:------|:-------|
| TypeScript (`tsc --noEmit`) | ✅ **0 errors** |
| Vite production build | ✅ **2,199 modules**, exit 0 |
| Phase 5 inspection mode | ✅ **Unchanged, still passing** |

---

## 3. Core Functional Implementations

### 3.1. Directed Acyclic Graph (DAG) Dependency Rules Engine

Every machine assembly is modelled as a mathematical DAG:

$$G = (V, E)$$

where vertices $V$ represent physical sub-assemblies and directed edges $E = \{(u, v)\}$ represent structural blocking constraints — part $u$ physically blocks part $v$ from extraction.

**Rule formula:**
$$\text{Removable}(v) \iff \forall u \in \text{Blockers}(v),\quad u \in \text{Disassembled}$$

Attempting to remove a part while its blockers remain mounted:
- Intercepts the action and prevents extraction
- Displays an alert listing every exact blocking component
- Records an error penalty (`-20 pts`)
- GSAP elastic snap-back animates the part to its origin (`elastic.out(1, 0.4)`)

### 3.2. Interactive 3D Manipulation & TransformControls

- **Raycasting Selection** — Hover and pointer raycasting identifies candidate components in 3D space
- **TransformControls gizmo** — Attaches 3D translation handles to the active component
- **Displacement Threshold** — Dragging `> 0.35 m` past the extraction origin triggers release (if unblocked) or elastic snap-back (if blocked)

### 3.3. GSAP Two-Stage Extraction Animation

Extracted components animate to the **Parts Staging Tray** (`x ≈ 2.5` world units) in a smooth two-stage GSAP timeline:

| Stage | Duration | Easing | Description |
|:------|:---------|:-------|:------------|
| **Lift** | 0.35 s | `power2.out` | Part rises along its `extractionVector` |
| **Travel** | 0.55 s | `power2.inOut` | Part glides laterally to the staging tray |

**Undo animation:** Part returns to `basePosition` in 0.5 s (`power2.inOut`).  
**Blocked snap-back:** `elastic.out(1, 0.4)` for a satisfying bouncy feedback.

> [!NOTE]
> GSAP tweens operate directly on `mesh.position` inside `useEffect`. The `useFrame` loop is reserved exclusively for real-time emissive pulsing — there is no position lerp in `useFrame`, preventing conflicts.

### 3.4. Undo & Redo History Stack

Full bidirectional history via the Zustand `useDisassemblyStore`:

- **`undo()`** — Pops the most recent disassembly, re-animates the part back to its assembled pose, restores all blocking rules
- **`redo()`** — Re-executes the disassembly in forward order
- Keyboard: `Ctrl+Z` / `Ctrl+Y`

### 3.5. Guided "Next Step" Auto-Disassembly

`animateNextStep()` picks the highest-priority candidate from `optimalSequence` and:
1. Flashes the hint highlight for **300 ms** (pulsing emerald glow)
2. Commits the GSAP extraction via `attemptDisassemblePart()` after the flash
3. Increments `autoStepsUsed` counter (affects accuracy % in completion banner)

Keyboard: `N`

### 3.6. Pulsing Emerald Hint Glow

Parts that are **ready** (all blockers satisfied) pulse with a `#00ff88` rim glow driven by `useFrame`:

```
emissive intensity = 0.5 + 0.5 × sin(clock.elapsedTime × 3)
```

The `hintMesh` (selected for next-step highlight) pulses at double intensity.

### 3.7. Disassembly Workbench HUD

**Top Bar:**
- Machine selector (dropdown, 4 machines)
- Ready parts count badge
- Global error counter

**Left Panel — DAG Status Drawer (collapsible):**
- Lists every part as `REMOVED ✓`, `READY →`, or `LOCKED 🔒`
- Locked parts show: `Blocked by: [Part A], [Part B]`
- Step number badges from `optimalSequence`

**Right Panel — Step History Log (collapsible):**
- Chronological removal log with timestamps
- Redo queue entries shown in muted style

**Selected Part Card:**
- Component name, required engineering tool, extraction vector display
- **"Disassemble & Move to Tray"** one-click button

**Bottom:**
- Error toast (auto-dismiss after **3.5 s**) for blocked attempts
- Completion banner with accuracy % computed as:
  $$\text{Accuracy} = \frac{\text{totalParts} - \text{errors} - \text{autoStepsUsed}}{\text{totalParts}} \times 100$$

### 3.8. Keyboard Shortcuts

| Key | Action |
|:----|:-------|
| `Space` | Disassemble selected part |
| `Ctrl+Z` | Undo last disassembly |
| `Ctrl+Y` | Redo |
| `H` | Show hint (highlight next recommended part) |
| `N` | Auto-step (animate next optimal part) |
| `R` | Reset / reassemble all parts |
| `Esc` | Deselect current part |
| `?` | Toggle keyboard shortcuts modal |

---

## 4. Machine Dependency DAG Specifications

All mesh names are reconciled to the actual GLB mesh names in the JSON machine data files.

### 4.1. Single-Cylinder Engine (9 parts)

| Step | Mesh Name | Display Name | Blockers |
|:-----|:----------|:-------------|:---------|
| 1 | `SparkPlug` | High-Energy Spark Plug | — |
| 2 | `IntakeValve` | Intake Poppet Valve | — |
| 3 | `ExhaustValve` | Exhaust Poppet Valve | — |
| 4 | `CylinderHead` | Cylinder Head | SparkPlug, IntakeValve, ExhaustValve |
| 5 | `WristPin` | Hardened Gudgeon Pin | CylinderHead |
| 6 | `Piston` | Crown Piston | CylinderHead, WristPin |
| 7 | `ConnectingRod` | I-Beam Connecting Rod | CylinderHead, Piston, WristPin |
| 8 | `Crankshaft` | Balanced Crankshaft | ConnectingRod, CylinderHead |
| 9 | `EngineBlock_Crankcase` | Engine Block Crankcase | Crankshaft, CylinderHead, ConnectingRod, Piston |

### 4.2. Manual Gearbox (8 parts)

| Step | Mesh Name | Display Name | Blockers |
|:-----|:----------|:-------------|:---------|
| 1 | `TransmissionCase` | Transmission Housing Casing | — |
| 2 | `ShiftFork` | Selector Shift Fork | TransmissionCase |
| 3 | `SynchromeshRing` | Synchromesh Baulk Ring | TransmissionCase, ShiftFork |
| 4 | `DriveGear_2nd` | 2nd Speed Driven Gear | TransmissionCase, SynchromeshRing |
| 5 | `DriveGear_1st` | 1st Speed Driven Gear | TransmissionCase, DriveGear_2nd |
| 6 | `Countershaft` | Laygear Countershaft | TransmissionCase, DriveGear_1st |
| 7 | `InputShaft` | Primary Input Shaft | TransmissionCase, Countershaft |
| 8 | `OutputShaft` | Main Output Shaft | TransmissionCase, DriveGear_1st, DriveGear_2nd, Countershaft |

### 4.3. Landing Gear Strut (8 parts)

| Step | Mesh Name | Display Name | Blockers |
|:-----|:----------|:-------------|:---------|
| 1 | `RetractActuator` | Hydraulic Retract Actuator | — |
| 2 | `Tire_Left` | Left Main Wheel & Tire | RetractActuator |
| 3 | `Tire_Right` | Right Main Wheel & Tire | RetractActuator |
| 4 | `WheelAxle` | Bogie Wheel Axle Spindle | Tire_Left, Tire_Right |
| 5 | `LowerTorqueLink` | Lower Torque Scissor Link | WheelAxle |
| 6 | `UpperTorqueLink` | Upper Torque Scissor Link | LowerTorqueLink |
| 7 | `OleoPiston` | Hard-Chromed Oleo Piston | WheelAxle, LowerTorqueLink, UpperTorqueLink |
| 8 | `MainCylinder` | Outer Shock Cylinder | OleoPiston, UpperTorqueLink, RetractActuator |

### 4.4. Turbine Stage (6 parts)

| Step | Mesh Name | Display Name | Blockers |
|:-----|:----------|:-------------|:---------|
| 1 | `CombustorLiner` | Annular Combustor Liner | — |
| 2 | `TurbineCasing` | Annular Containment Casing | CombustorLiner |
| 3 | `StatorVaneRing` | Nozzle Guide Vane Stator Ring | TurbineCasing |
| 4 | `RotorBlades` | Aerofoil Turbine Blades Set | TurbineCasing |
| 5 | `RotorDisk` | Blisk Turbine Rotor Disk | TurbineCasing, RotorBlades |
| 6 | `ShaftSpindle` | Central Turbine Drive Spindle | TurbineCasing, RotorDisk, StatorVaneRing |

---

## 5. File Structure

```
apps/web/src/
├── data/
│   └── dependencyGraph.ts          # DAG rules, optimalSequence, checkDisassemblyRule()
├── stores/
│   └── useDisassemblyStore.ts      # Zustand: disassembledParts, errors, undo/redo stack,
│                                   #   animateNextStep(), attemptDisassemblePart()
└── components/
    └── disassembly/
        ├── DisassemblyPage.tsx       # Route wrapper
        ├── DisassemblyCanvas.tsx     # R3F Canvas + staging tray
        ├── DisassemblyModelRenderer.tsx  # Mesh loading, GSAP animation, TransformControls
        └── DisassemblyWorkbench.tsx  # Full HUD: DAG panel, history log, shortcuts
```

---

## 6. Tech Notes

| Concern | Decision |
|:--------|:---------|
| Animation | **GSAP** (`gsap` v3) — two-stage timeline on `mesh.position` in `useEffect` |
| State | **Zustand v5** — `useDisassemblyStore` |
| Drag raycasting | R3F `onPointerDown` / `onPointerUp` + Three.js `TransformControls` |
| Emissive pulsing | `useFrame` with `Math.sin(clock.elapsedTime)` — does NOT touch `mesh.position` |
| GSAP + R3F coexistence | GSAP tweens `mesh.position`; `useFrame` reads it. No conflict because position is not in React state |
| Pnpm build command | `pnpm.cmd --dir f:\morphdrive --filter @morphdrive/web build` (`.cmd` extension required on Windows due to PS execution policy) |

> [!WARNING]
> Do **not** add `useFrame` lerp on `mesh.position` for disassembled parts. GSAP already owns those positions. Dual animation produces jitter and undoes GSAP keyframes.
