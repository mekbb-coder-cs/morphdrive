# Phase 9: Dashboards and Analytics (Weeks 16-18)
## Role-Based Dashboards & Pedagogical Analytics Suite

**Document Identifier**: `DOC-PHASE-9-DASHBOARDS-ANALYTICS-V1.0`  
**Status**: Formal Baseline / Production Ready  
**Date**: November 2026  
**Scope**: Student Performance Dashboard, Instructor Class Analytics with Failure Diagnostics ("Which Step Fails Most"), Exportable CSV Gradebook, and System Administration Console for 3D Model Uploads, Part/Step Authoring, and User RBAC.

---

## 1. Executive Summary

Phase 9 completes the educational lifecycle of the **MorphDrive** platform by providing a unified, role-based dashboard and analytics layer. The platform serves three distinct user classes:
1. **Students & Cadets**: Real-time progress monitoring, completed machine tracking, personal best time trials, and aviation achievement badges.
2. **Instructors & Teaching Faculty**: High-level class analytics, step failure frequency diagnostics ("which step fails most"), student roster grading, and RFC 4180 compliant CSV gradebook exporting.
3. **Institutional Administrators**: Direct upload and registration of binary glTF (`.glb`) machine assemblies, full CAD part hierarchy and assembly step editors, and role-based access control (RBAC) user management.

---

## 2. Architecture & File Structure

```
apps/
├── web/src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx       # Master layout with role switcher toolbar
│   │   │   ├── StudentDashboard.tsx    # Student KPIs, completed machines, times & badges
│   │   │   ├── InstructorDashboard.tsx # Class stats, step failure diagnostics, roster, CSV export
│   │   │   └── AdminPanel.tsx          # 3D glTF model upload, part/step editor, user RBAC
│   │   ├── garage/GarageUI.tsx         # Direct "Dashboards" navigation link
│   │   ├── inspector/MachineSelectorHeader.tsx # Inspector header navigation link
│   │   ├── disassembly/DisassemblyPage.tsx     # Disassembly header navigation link
│   │   ├── reassembly/ReassemblyPage.tsx       # Reassembly header navigation link
│   │   └── learning/LearningPage.tsx           # Learning lab header navigation link
│   ├── stores/
│   │   ├── useGameStore.ts             # Added "DASHBOARD" view state
│   │   └── useDashboardStore.ts        # Zustand store managing roles, progress, mistakes & admin state
│   └── App.tsx                         # View routing for "DASHBOARD"
└── api/src/
    ├── controllers/
    │   ├── analytics.controller.ts     # Student/instructor metrics & CSV streaming
    │   └── admin.controller.ts         # User listing, role updates & deletion
    ├── routes/
    │   ├── analytics.routes.ts         # /api/analytics endpoints
    │   └── admin.routes.ts             # /api/admin endpoints with requireRole(Role.ADMIN)
    └── server.ts                       # Mounted analytics & admin routers
```

---

## 3. Role-Based Feature Specifications

### 3.1 Student Dashboard (`StudentDashboard.tsx`)
- **Overall Performance Metrics**:
  - Curriculum Mastery: Average percentage completion across all 4 core machines.
  - Completed Machines Count: Dynamic tracking of machines with $\ge 90\%$ mastery.
  - Time Trial PBs: Personal record for full disassembly and reassembly runs.
  - Proving Ground Lap Records: Dynamic test track best lap time.
- **Completed Machines Catalog**:
  - Status for each machine (*Aircraft Oleo-Pneumatic Strut, HP Gas Turbine Stage, Single-Cylinder Engine, Synchromesh Gearbox*).
  - Individual mastery score bars, disassembly/reassembly completion checks, fastest run times, and quiz accuracy.
  - One-click launch shortcuts into **Inspect 3D**, **Disassembly Lab**, **Reassembly Lab**, and **Learning Lab**.
- **Aviation & Mechanical Badges**:
  - Category-based achievement system (*INSPECTION, DISASSEMBLY, SAFETY, MASTERY*).
  - Real-time unlocked statuses with criteria (*Sub-Minute Teardown, Zero-Defect Reassembly, Turbine Specialist, Airworthiness Ace, Scissor Link Ace, Kinematic Sorcerer, Master Aerospace Tech*).

### 3.2 Instructor Dashboard (`InstructorDashboard.tsx`)
- **Class Overview Metrics**:
  - Enrolled Cadets (64 total, 58 active this week with 90.6% engagement).
  - Curriculum Completion Rate ($78.4\%$ average).
  - Class Assessment Mastery ($86.2\%$ average score, Grade B+).
  - Total Disassembly Practice Runs (412 total).
- **Common Mistakes & Failure Diagnostics ("Which Step Fails Most")**:
  - Highlights exact procedural bottlenecks across the curriculum:
    1. **Landing Gear Strut Step 4** (*Torque Scissor Apex Disconnection*): **44.2% failure rate** (80 fails / 182 runs) — primary error: attempting to remove scissor arms before extracting central apex hinge bolt. Hazard: **HIGH**.
    2. **Landing Gear Strut Step 2** (*Dual Main Wheel Demounting*): **38.6% failure rate** (75 fails / 195 runs) — primary error: loosening 45mm axle nut before completing nitrogen pressure bleed. Hazard: **HIGH**.
    3. **Landing Gear Strut Step 1** (*Retract Actuator Depressurization*): **31.0% failure rate** (65 fails / 210 runs) — primary error: disconnecting trunnion pin before verifying 0.0 PSI on gauge. Hazard: **HIGH**.
    4. **Turbine Stage Step 2** (*Containment Casing Split*): **26.5% failure rate** (39 fails / 147 runs) — primary error: releasing flange fasteners without following cross-spiral sequence. Hazard: **MEDIUM**.
    5. **Gearbox Step 2** (*Synchromesh Baulk Ring Extraction*): **22.8% failure rate** (31 fails / 136 runs) — primary error: prying brass cone without covering spring detent hub. Hazard: **MEDIUM**.
    6. **Engine Step 2** (*Cylinder Head Stud Release*): **18.4% failure rate** (31 fails / 168 runs) — primary error: uneven diagonal loosening causing deck warpage. Hazard: **LOW**.
- **Student Performance Roster Table**:
  - Real-time search by name or email.
  - Filter pills: `ALL`, `EXCELLING`, `ON_TRACK`, `NEEDS_HELP`.
  - Displays: Student Name, Email, Machines Mastered, Average Score (%), Fastest Disassembly Time, Total Errors Committed, Status Badge, Last Active.
- **Exportable CSV System**:
  - Client-side and server-side RFC 4180 CSV export generating gradebook files with dual sections:
    1. Student Performance Roster (ID, Name, Email, Enrollment, Completed, Avg Score, Fastest Run, Errors, Status, Last Active)
    2. Step Failure Analytics (Machine, Step Number, Title, Target Part, Failure Rate %, Attempts, Failures, Primary Mistake Reason, Hazard Risk).

### 3.3 Admin Panel (`AdminPanel.tsx`)
- **3D glTF Model Ingestion (`uploadNewModel`)**:
  - Binary glTF (`.glb`) drag & drop / file picker with client validation (up to 50MB, magic header `0x46546C67`).
  - Metadata form: Name, Category, Pedagogical Difficulty (*BEGINNER, INTERMEDIATE, ADVANCED*), Description.
  - Server endpoint integration: `POST /api/upload/model`.
- **Parts & Steps Catalog Editor**:
  - Target machine switcher.
  - **Component Editor**: View and modify mesh name, display name, material, mass (kg), kinematic type, and engineering function.
  - **Step Editor**: Modify operational steps, actions (*DISASSEMBLE, ASSEMBLE, INSPECT*), positional tolerances, hints, tool requirements, and safety warnings.
- **Institutional User Management (RBAC)**:
  - User search & filter.
  - Modal to invite/add new institutional users.
  - Direct Role Switcher dropdown per user (`STUDENT`, `INSTRUCTOR`, `ADMIN`) wired to `updateUserRole`.
  - Active/Inactive status toggle.

---

## 4. Verification and Validation Results

| Test / Check | Scope | Result | Details |
| :--- | :--- | :--- | :--- |
| **Vite Bundle Build** | `@morphdrive/web` | **PASS** | `tsc && vite build` built cleanly in 18s |
| **Backend Unit Tests** | `@morphdrive/api` | **PASS** | 7/7 Vitest test cases passing |
| **Role Switcher Navigation** | Web Frontend | **PASS** | Instant switching between Student, Instructor, and Admin modes |
| **Global View Navigation** | All 5 Modes | **PASS** | Direct access from Garage, Inspector, Disassembly, Reassembly, and Learning Lab |
| **CSV Export Functionality** | Browser Download | **PASS** | Generates valid RFC 4180 CSV gradebook file |

---

## 5. Conclusion

Phase 9 satisfies all requirements for role-based dashboards and analytics, establishing an institutional learning and assessment platform for aerospace and mechanical engineering.
