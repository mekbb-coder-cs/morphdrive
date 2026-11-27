# Phase 8: Learning Layer (Weeks 14-16)
## MorphDrive Educational & Pedagogical Inspection Suite

**Identifier**: `DOC-PHASE-8-LEARNING-LAYER-V1.0`  
**Status**: Formal Baseline / Production Ready  
**Date**: November 2026  
**Scope**: Guided Lessons, Mechanical Tutorials with Part Callouts, 3D Component Quizzes, Specification Cards, Engineering Glossary, Aircraft Maintenance Manual (AMM) Protocols, and Contextual AI Mentor.

---

## 1. Executive Summary

Phase 8 introduces the **Learning Layer** to the MorphDrive platform, transitioning it from a pure CAD visualization and disassembly sandbox into an authoritative pedagogical learning suite. The system provides structured learning modules for aerospace and mechanical engineering students, aircraft maintenance technicians (AMT/A&P), and university instructors.

### Core Modules Delivered:
1. **Interactive Step-by-Step Tutorials**:
   - Guided procedural workflows with mechanical principles, required instrumentation, airworthiness inspection criteria, and safety hazards.
   - Integrated **Interactive CAD/Aero Blueprint & X-Ray Schematics** (`StepVisualSchematic.tsx`) with animated part callout pins, coordinate crosshairs, leader lines, and dynamic feature highlights.
   - Seamless one-click transition to the 3D Inspection Lab focused on the active component.
2. **Interactive 3D Part Quizzes** (`PartQuizEngine.tsx`):
   - Comprehensive question engine covering four pedagogical domains: **IDENTIFICATION**, **FUNCTION**, **MATERIAL & METALLURGY**, and **MAINTENANCE**.
   - Directly tied to 3D components with an integrated **"Locate in 3D Lab"** action.
   - Real-time scoring, consecutive streak tracking, immediate explanation cards with regulatory standards citations (FAA AC 43.13-1B, AMT Handbooks), and an assessment report card with letter grading.
3. **Component-Function Specification Cards** (`ComponentCardsViewer.tsx`):
   - High-fidelity 3D flip cards with dual-sided layout:
     - **Front**: Component classification, primary mechanical function, material alloy, yield strength (MPa), mass (kg), and operating temperature ranges.
     - **Back**: Common failure modes (fretting, spallation, LCF, cavitation), scheduled inspection intervals (flight hours), NDT inspection methods (FPI, ET, MPI, ultrasonic), and lubrication specifications.
   - Comprehensive coverage across all 4 machine assemblies.
4. **Authoritative Aerospace & Mechanical Glossary** (`GlossaryViewer.tsx`):
   - Fast, searchable lexicon with 8 category filters (*Aerospace, Hydraulics, Thermodynamics, Kinematics, Materials, Maintenance, Fasteners*).
   - Authoritative definitions, mathematical equations, real-world aviation applications, and links to related 3D parts.
5. **Aircraft Maintenance Manual (AMM) & Safety Protocols** (`AircraftMaintenanceManual.tsx`):
   - Structured around standard **ATA Chapters** (ATA 32-11-00 Shock Struts, ATA 32-40-00 Wheels & Brakes, ATA 72-51-00 Turbine Rotors, ATA 72-00-10 Combustor Overhaul, ATA 24-00-00 Grounding & Lockout/Tagout).
   - Lists mandatory PPE, special certified tools, safety precautions, and an interactive step checklist with acceptance tolerances and critical technician sign-offs.
6. **Context-Aware AI Mentor** (`AIAssistantChat.tsx` & `useLearningStore.ts`):
   - **MorphDrive AeroMentor** specialized in aerospace kinematics, propulsion, metallurgy, and FAA/EASA airworthiness.
   - **Multi-Provider Support**:
     - **Google Gemini API** (`gemini-1.5-flash` endpoint with full JSON payload)
     - **Anthropic Claude API** (`claude-3-5-sonnet-20241022` via Messages API)
     - **Built-in Offline Intelligence Engine** providing instant, zero-latency technical analysis without requiring external API keys.
   - Injects active 3D machine metadata (part hierarchies, materials, operating envelopes) directly into the model context.

---

## 2. Architecture & File Structure

```
apps/web/src/
├── components/
│   ├── garage/
│   │   └── GarageUI.tsx                    # Embedded "Learning Lab" navigation
│   ├── inspector/
│   │   └── MachineSelectorHeader.tsx       # Inspector header navigation to Learning Lab
│   ├── disassembly/
│   │   └── DisassemblyPage.tsx             # Disassembly header navigation to Learning Lab
│   ├── reassembly/
│   │   └── ReassemblyPage.tsx              # Reassembly header navigation to Learning Lab
│   └── learning/
│       ├── LearningPage.tsx                # Master container with responsive tab switching
│       ├── TutorialViewer.tsx              # Step-by-step tutorial viewer
│       ├── StepVisualSchematic.tsx         # CAD blueprint & X-ray schematic with part callouts
│       ├── PartQuizEngine.tsx              # Assessment engine with 3D part locator
│       ├── ComponentCardsViewer.tsx        # 3D interactive flip specification cards
│       ├── GlossaryViewer.tsx              # Filterable and searchable engineering glossary
│       ├── AircraftMaintenanceManual.tsx   # ATA airworthiness checklist & safety manual
│       └── AIAssistantChat.tsx             # AeroMentor chat with Gemini & Anthropic integration
├── data/
│   └── learningData.ts                     # Single source of truth for tutorials, quizzes, cards, AMM
└── stores/
    ├── useGameStore.ts                     # Added "LEARN" view state
    └── useLearningStore.ts                 # Zustand store for learning progression & AI inference
```

---

## 3. Detailed Component Capabilities

### 3.1 Step-by-Step Tutorials with Technical Schematics
Each tutorial step includes:
- **Title & Callout Badge**: Direct nomenclature of the active component and target assembly.
- **Procedure Summary**: Clear, succinct operational objective.
- **Interactive Technical Schematic (`StepVisualSchematic.tsx`)**:
  - Vector CAD blueprint with 28px coordinate grid and center crosshairs.
  - Interactive callout pins with pulsating rings color-coded by severity (*CRITICAL, FASTENER, MEASURE, INSPECT*).
  - Mode switch between **Blueprint Wireframe** and **X-Ray Cutaway Hatching**.
  - Detail drawer displaying operational limits, clearance tolerances, and safety instructions upon pin selection.
- **Mechanical Principles & Physics**: Mathematical equations ($E = \int \Delta P \cdot Q \, dt$, $F = \mu N / \sin \alpha$), flow dynamics, and metallurgy rationale.
- **Airworthiness & Inspection Criteria**: Bulleted inspection guidelines (e.g. runout $< 0.002$ in, spallation limits, chrome flaking checks).
- **Tools & Safety Precautions**: Special wrenches, micrometers, and hazard alerts (hydraulic fluid injection, lethal nitrogen pressure).

### 3.2 Part Quiz Engine
The quiz engine assesses spatial recognition and functional understanding:
- **Identification Questions**: *"Identify the telescoping cylindrical component that slides inside the outer shock cylinder on touchdown"* $\rightarrow$ Oleo Piston.
- **Function Questions**: *"What is the primary mechanical function of the upper and lower torque scissor links?"* $\rightarrow$ Prevents rotation while accommodating stroke.
- **3D Part Locator**: Every question provides a *"Locate in 3D Lab"* action that loads the 3D model with the target mesh isolated and camera centered.
- **Instant Pedagogical Feedback**: Color-coded option states (green for correct, red for incorrect), detailed explanation cards, score increments, and reference standard citations (FAA-H-8083-31A, FAA AC 43.13-1B).
- **Report Card**: Generates an accuracy percentage and academic grade ($A+, A, B, C$) with retake option.

### 3.3 Component-Function Cards
Interactive 3D flip cards rendered with perspective transforms:
- Front: Category badge, mass, yield strength, operational temperature limits, and function.
- Back: Common failure modes, overhaul intervals, NDT inspection method, and lubrication specification.
- Direct *"Inspect in 3D"* link to view the component in real-time WebGL canvas.

### 3.4 Aircraft Maintenance Manual (AMM)
Adheres strictly to aviation regulatory standards:
- Classified by **ATA 100 Chapter**:
  - **ATA 32-11-00**: Main Landing Gear Shock Strut Servicing (Nitrogen & Hydraulic Fluid)
  - **ATA 32-40-00**: Main Wheels, Bearings & Multi-Disc Carbon Brake Overhaul
  - **ATA 72-51-00**: High-Pressure Turbine Rotor Borescopy & Blade Inspection
  - **ATA 72-00-10**: Turbine Combustor Section Flame Tube Effusion Hole Decoking
  - **ATA 24-00-00**: Aircraft Electrical Grounding, Static Bonding & Lockout/Tagout
- Real-time progress bar tracking step completions.
- Warning banners highlighting fatal hazards (e.g., diesel explosion risk from using compressed shop air instead of pure nitrogen).

### 3.5 AI Mentor (Gemini & Anthropic Integration)
- **Model Ingestion**: Feeds complete machine metadata into the system prompt:
  ```ts
  `You are MorphDrive AeroMentor, a Senior Aerospace and Mechanical Engineering Chief Mechanic. You have direct access to the 3D model metadata for '${machine.name}' (${machine.category}).
  Parts: ${machine.parts.map((p) => `${p.displayName} (${p.material})`).join(", ")}.
  Answer the user's question with precise engineering formulas, metallurgy reasoning, torque specifications, and FAA/EASA maintenance guidelines. Be concise, structured, and technically rigorous.`
  ```
- **Provider Switching**: Users can select between:
  1. **Google Gemini API** (`gemini-1.5-flash`) via direct REST endpoint.
  2. **Anthropic Claude API** (`claude-3-5-sonnet-20241022`) via direct Messages endpoint.
  3. **Built-in Offline Engine** with domain rules for instantaneous local inference.
- API keys are persisted securely in local client storage (`localStorage.getItem("morphdrive_ai_key")`).

---

## 4. Verification and Validation

| Test Suite / Step | Target Scope | Status | Notes |
| :--- | :--- | :--- | :--- |
| **TypeScript Typecheck** | `@morphdrive/web` | **PASS** | Zero type errors (`tsc --noEmit`) |
| **Vite Production Bundle** | `@morphdrive/web` | **PASS** | Built cleanly into `dist/assets` |
| **API Test Suite** | `@morphdrive/api` | **PASS** | 7/7 Vitest backend test cases passing |
| **Data Integrity Check** | `learningData.ts` | **PASS** | 4/4 tutorials, 4/4 quizzes, 16 component cards, 23 glossary entries, 5 AMM protocols |
| **Navigation Wiring** | Web UI | **PASS** | Garage, Inspector, Disassembly, Reassembly all navigate to Learning Lab |

---

## 5. Conclusion

Phase 8 fulfills all user specifications for the Learning Layer, equipping MorphDrive with an industry-grade educational foundation tailored for aerospace engineering and maintenance instruction.
