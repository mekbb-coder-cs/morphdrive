# MorphDrive — Phase 6: Guided Disassembly Mode & DAG Dependency Validation

## 1. Executive Summary

Phase 6 implements the **Guided Disassembly & Assembly Mechanics Engine** for **MorphDrive**. Transforming the platform from passive 3D inspection into an active, validated mechanical engineering laboratory, Phase 6 enforces physical constraints, mechanical fastening order, and clearance validation using a formal **Directed Acyclic Graph (DAG)** dependency engine.

---

## 2. Core Functional Implementations

### 2.1. Directed Acyclic Graph (DAG) Dependency Rules Engine
- **Formal Dependency Graph Architecture**:
  Every machine assembly is modeled as a mathematical DAG:
  $$G = (V, E)$$
  where vertices $V$ represent physical sub-assemblies (e.g., *Spark Plug*, *Cylinder Head*, *Piston*, *Wrist Pin*), and directed edges $E = \{(u, v)\}$ represent structural blocking constraints indicating that part $u$ physically blocks part $v$ from extraction.
- **Rule Verification**:
  $$\text{Removable}(v) \iff \forall u \in \text{Blockers}(v), \quad u \in \text{Disassembled}$$
- **Mechanical Constraint Violation Detection**:
  If a student attempts to remove a part (such as extracting the *Piston* or *Connecting Rod* while the *Cylinder Head* or *Wrist Pin* remains mounted), the engine intercepts the action, prevents extraction, displays an alert detailing the exact blocking components, and records an error penalty.

### 2.2. Interactive 3D Manipulation & TransformControls
- **Raycasting Selection**: Hover and pointer raycasting identifies candidate components in 3D space.
- **Interactive TransformControls**: Attaches 3D translation gizmos to the active component, allowing students to drag the component along its extraction axis.
- **Displacement Threshold Validation**: When dragged past the clearance threshold ($>0.35\text{ m}$), the component releases into the disassembly tray if all blockers are satisfied. If blocked, it automatically snaps back to its origin.

### 2.3. Smooth Extraction Animation & Staging Bench
- **Dynamic Lerp Animation**: Extracted components smoothly animate to an organized **Parts Staging Bench** positioned adjacent to the machine.
- 60 FPS damped lerping using `THREE.MathUtils.damp` guarantees fluid performance without frame drops.

### 2.4. Undo & Redo History Stack
- Full bidirectional history state:
  - `undo()`: Pops the most recently disassembled part, re-animates it back into its exact assembled pose, and restores blocking rules.
  - `redo()`: Re-executes the disassembly sequence.

### 2.5. Intelligent Hint & "Next Step" Highlighting
- **Pulsing Emerald Glow**: Unblocked candidate parts ready for extraction pulse with an energetic green rim glow (`#00ff88`).
- **Hint Engine**: "Hint" button identifies the optimal next step, highlights the component, and reveals the required engineering tool (e.g., *16mm Deep Magnetic Spark Plug Socket*, *Valve Spring Compressor*, *Roll Pin Punch*) and technical extraction procedure.

### 2.6. Disassembly Workbench HUD
- **Real-Time Progress & Score Tracking**:
  - Parts Disassembled: $X / Y$ ($Z\%$).
  - Scoring: $+100\text{ pts}$ per valid removal, $-20\text{ pts}$ penalty for constraint violations.
  - Real-time error counter.
- **DAG Dependency Status Drawer**:
  - Collapsible drawer listing all assembly parts categorized as `REMOVED`, `READY`, or `LOCKED`.
  - For locked parts, displays explicit text: `Blocked by: [Part A, Part B]`.
- **Selected Component Target Card**:
  - Displays component name, required engineering tool, and extraction procedure.
  - One-click "Disassemble & Move to Tray" execution button.

---

## 3. Machine Dependency DAG Specifications

| Machine | Optimal Removal Order | Key Mechanical Constraint |
| :--- | :--- | :--- |
| **Single-Cylinder Engine** | Spark Plug $\rightarrow$ Valves $\rightarrow$ Head $\rightarrow$ Gudgeon Pin $\rightarrow$ Piston $\rightarrow$ Rod $\rightarrow$ Crankshaft | Cylinder Head blocks Piston extraction; Wrist pin blocks connecting rod small-end. |
| **Manual Transmission** | Case $\rightarrow$ Shift Fork $\rightarrow$ Shift Collar $\rightarrow$ 2nd Gear $\rightarrow$ Countershaft $\rightarrow$ Input/Output Shafts | Outer case must be lifted before shift rails; dog collar locks speed gear. |
| **Landing Gear Strut** | Axle $\rightarrow$ Lower Scissor $\rightarrow$ Upper Scissor $\rightarrow$ Oleo Piston $\rightarrow$ Main Cylinder | Scissor links and axle retention nut prevent telescoping piston release. |
| **Turbine Stage** | Casing $\rightarrow$ Stator Vane Ring $\rightarrow$ Blades $\rightarrow$ Rotor Disk $\rightarrow$ Drive Shaft | Annular casing blocks aerofoil blades; fir-tree roots require circumferential slide. |

---

## 4. Verification & Testing

- Production build passed 100% (`pnpm --filter @morphdrive/web build`):
  - 2,196 modules transformed.
  - Zero TypeScript compiler errors.
- Active servers running live on:
  - Web Application: `http://localhost:5173/`
  - Swagger REST API: `http://localhost:4000/api-docs`
