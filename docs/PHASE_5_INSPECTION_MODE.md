# MorphDrive — Phase 5: 3D Viewer & Interactive Inspection Mode

## 1. Executive Summary

Phase 5 delivers the production **Interactive 3D Machine Inspection Mode** for **MorphDrive**, an educational mechanism exploration and kinematics platform. Built on **React 19**, **React Three Fiber (R3F v9)**, **Three.js (v0.173)**, **@react-three/drei (v10)**, and **Tailwind CSS**, this interface provides engineering students and instructors with a professional CAD-grade inspection environment for complex kinematic assemblies.

---

## 2. Core Functional Capabilities

### 2.1. Dynamic GLB Model Loading & Draco Decompression
- Direct procedural loading of compressed `.glb` mechanical assemblies:
  - `single_cylinder_engine.glb` (484 tris, 9 distinct sub-assemblies)
  - `gearbox.glb` (616 tris, 7 distinct sub-assemblies)
  - `landing_gear_strut.glb` (536 tris, 8 distinct sub-assemblies)
  - `turbine_stage.glb` (688 tris, 6 distinct sub-assemblies)
- Clean scene cloning per machine instance (`clonedScene.clone(true)`) preventing cross-scene state contamination.
- Preloading (`useGLTF.preload`) for instantaneous sub-second machine switching.
- Draco decompression loading screen with dynamic progress bar (`useProgress`), spinner, and machine metadata tags.

### 2.2. Camera Orbit, Pan, and Zoom Controls
- High-precision `OrbitControls` with configurable inertia damping (`dampingFactor: 0.06`).
- Min/Max distance constraints (`0.4m` to `12.0m`) preventing clipping and model loss.
- Polar angle limits (`maxPolarAngle: PI/2 + 0.15`) maintaining floor elevation.
- Instant Camera Re-centering trigger via `useInspectionStore.cameraResetSeq`.

### 2.3. Realistic PBR Studio Lighting & Staging
- ACES Filmic tone mapping with WebGL2 antialiasing.
- 3-point key/fill/rim lighting:
  - Primary directional sunlight (intensity 1.6, soft shadow frustum, 2048x2048 map).
  - Cool blue ambient fill light (intensity 0.55).
  - Warm rim back-light (intensity 0.3).
  - Ambient and hemisphere lighting.
- High-dynamic-range environment map via `<Environment preset="city" />`.
- Floor contact shadows (`<ContactShadows opacity={0.7} blur={2.4} />`) and high-tech engineering grid (`<gridHelper />`).

### 2.4. Bi-Directional Part Selection & Emissive Highlighting
- **Hover Highlighting**: Pointing over any 3D mesh triggers a vibrant cyan emissive rim glow (`#00f0ff`, intensity 0.5) and displays a floating HUD pill with the component name and motion classification (`ROTATIONAL`, `TRANSLATIONAL`, `PLANAR`, `RIGID`).
- **Click Selection**: Clicking any mesh locks a golden amber emissive glow (`#f5a623`, intensity 0.7) and slides open the detailed **Part Info Panel**.
- 100% bi-directionally synchronized with the **CAD Feature Tree Sidebar**.

### 2.5. Comprehensive Part Information Panel
When a component is selected, the floating info panel displays:
- Component display name and CAD mesh identifier.
- **Engineering Material Specification** (e.g. *Silchrome 1 Stainless Steel*, *Inconel 751 Superalloy*, *CMSX-4 Single-Crystal Superalloy*).
- **Kinematic Function** explaining mechanical purpose and load transfer.
- **Physical Specifications**: Mass (kg), Pivot Origin coordinates $[x, y, z]$, and Kinematic Motion Type.
- **Exploded View Displacement Vector** $[\Delta x, \Delta y, \Delta z]$.
- Instant action buttons: *Isolate Component*, *Hide Part*, and *Measure*.

### 2.6. CAD Feature Tree Sidebar
- Collapsible left drawer modeled after industrial CAD platforms (Siemens NX / CATIA / SolidWorks).
- Real-time search filter matching names, meshes, and materials.
- Per-part action toggles:
  - **Eye Icon**: Instant show/hide toggle (`hiddenParts` array).
  - **Target Icon**: Isolate component (`isolatedPart` mode).
- Global "Show All" action to instantly restore all hidden or isolated components.

### 2.7. Advanced Render Modes: Shaded, Wireframe & X-Ray
- **Shaded**: PBR metallic-roughness material with reflections.
- **Wireframe**: Direct topological edge wireframe rendering (`material.wireframe = true`).
- **X-Ray Ghosting**: Semi-transparent holographic mode (`opacity: 0.22`, `depthWrite: false`) allowing students to inspect internal mechanical elements (crankshafts, connecting rods, wrist pins, countershaft cluster gears, and hydraulic damper metering pins) inside structural casings.

### 2.8. 3D Measurement Caliper Tool
- Point-to-point Euclidean distance ruler directly in the WebGL scene.
- Interactive point picking: Click Point A and Point B on any mesh surface.
- Visual pins with color-coded markers.
- 3D dashed dimension line connecting the two points.
- Midpoint floating measurement badge reporting:
  - Distance in **millimeters** ($mm$).
  - Distance in **centimeters** ($cm$) and **inches** ($in$).
  - Delta coordinate components ($\Delta X$, $\Delta Y$, $\Delta Z$).

### 2.9. Dynamic Exploded View Disassembly
- Smooth slider from $0\%$ (fully assembled) to $100\%$ (fully exploded).
- Linear vector offset positioning based on machine metadata JSON:
  $$\mathbf{P}_{\text{part}}(t) = \mathbf{P}_{\text{base}} + t \cdot \mathbf{V}_{\text{offset}}$$
- 60 FPS damped lerp animation in `useFrame` via `THREE.MathUtils.damp`.

---

## 3. Machine Catalog Overview

| Machine ID | Display Name | Sub-Assemblies | Triangles | Key Kinematic Feature |
| :--- | :--- | :---: | :---: | :--- |
| `single-cylinder-engine` | Single-Cylinder 4-Stroke Engine | 9 parts | 484 | Slider-crank mechanism & valve train |
| `gearbox` | 2-Speed Manual Transmission | 7 parts | 616 | Countershaft cluster & dog clutch |
| `landing-gear-strut` | Oleo-Pneumatic Landing Gear | 8 parts | 536 | Hydraulic damping & torque scissors |
| `turbine-stage` | Axial Flow Gas Turbine Stage | 6 parts | 688 | Stator nozzle vanes & blisk rotor |

---

## 4. Verification & Testing

- Production build verification (`pnpm --filter @morphdrive/web build`):
  - Modules transformed: 2,190
  - Zero TypeScript compiler errors.
  - Clean production bundles generated in `dist/`.
- Frontend server running live on `http://localhost:5173/`.
- Backend API running live on `http://localhost:4000/`.
