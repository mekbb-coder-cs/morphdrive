# System Design Document — MorphDrive

**Document Code**: `SDD-MORPHDRIVE-V1.0`  
**Milestone**: Phase 2 System Design & Engineering Architecture (Weeks 3–4)  

---

## 1. System Architecture
MorphDrive is engineered as a zero-install, 60 FPS WebGL2 educational platform with:
- **Frontend**: React 19, Three.js, React Three Fiber, Rapier 3D WebAssembly physics, Zustand, Tailwind CSS.
- **Backend API**: Express 4, Node.js 22, Prisma ORM 6, Zod, Argon2id, JWT HttpOnly authentication.
- **Database**: PostgreSQL 16 relational data store.
- **Storage**: Cloudflare R2 / AWS S3 Draco/Meshopt-compressed `.glb` models.

---

## 2. Relational Database Models
Implemented in `apps/api/prisma/schema.prisma`:
- `User` & `Role` (`STUDENT`, `INSTRUCTOR`, `ADMIN`)
- `Machine` (`spectre-v-sweep-uav`, `apex-nomad-rover`, `valkyrie-vector-hybrid`)
- `Part` (`meshName`, `material`, `function`, `kinematicType`, `massKg`)
- `AssemblyStep` (`stepOrder`, `action`, `targetPosition`, `tolerance`, `hint`)
- `Attempt` (`userId`, `machineId`, `mode`, `timeSeconds`, `errorsCount`, `score`)
- `Quiz`, `Question`, `QuizAttempt`
- `Progress` (`masteryScore`, `lastStepCompleted`, `quizzesPassed`)

---

## 3. OpenAPI 3.1 Contract
The full specification is available in `docs/openapi.yaml`. Key endpoints:
- `GET /api/machines`: List educational machines
- `GET /api/machines/{id}`: Full machine details with parts tree
- `GET /api/machines/{id}/assembly-steps`: Sequential disassembly steps
- `POST /api/attempts`: Log guided disassembly attempts
- `GET /api/quizzes/machine/{machineId}`: 3D spatial assessment
- `POST /api/quizzes/{id}/submit`: Grade quiz submission

---

## 4. Prototype & Wireframes
- Interactive Clickable Prototype: `docs/prototype/index.html`
- Phase 2 Design Specification Artifact: Located in the conversation brain artifact directory.
