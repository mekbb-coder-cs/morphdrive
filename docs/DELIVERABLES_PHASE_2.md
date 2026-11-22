# MorphDrive — Phase 2 Deliverables Package
## System Design Document, ERD, API Specification & Figma Prototype

**Project**: MorphDrive — Interactive 3D Educational Inspection & Morphing Mechanism Platform  
**Phase**: Phase 2 System Design (Weeks 3–4)  
**Standard Compliance**: IEEE 1016-2009 (Software Design Description) & OpenAPI 3.1.0  
**Version**: 1.0.0 (Master Deliverable Release)  
**Date**: November 2026  

---

## Deliverables Index & Navigation

| Deliverable | Description | Location |
| :--- | :--- | :--- |
| **1. Design Document** | Full System Architecture, UML Use Cases, Sequence Diagrams, and Component Interaction. | [Section 1](#1-system-design-document-sdd) • `docs/SYSTEM_DESIGN.md` |
| **2. ERD & Schema** | Complete Entity-Relationship Diagram and relational data dictionary. | [Section 2](#2-entity-relationship-diagram-erd--data-dictionary) • `apps/api/prisma/schema.prisma` |
| **3. API Specification** | OpenAPI 3.1.0 REST API Contract (endpoints, schemas, responses, JWT auth). | [Section 3](#3-rest-api-specification-openapi-310) • `docs/openapi.yaml` |
| **4. Figma Prototype** | Desktop/tablet wireframes, design system tokens, screen flows, and interactive prototype. | [Section 4](#4-figma-prototype--wireframe-specifications) • `docs/prototype/index.html` |

---

## 1. System Design Document (SDD)

### 1.1 Architecture Diagram
MorphDrive uses a distributed monorepo architecture:
- **Client**: React 19, TypeScript, Three.js, React Three Fiber, Rapier 3D WebAssembly physics, Zustand, Tailwind CSS.
- **Edge CDN**: Vercel (SPA static hosting) + Cloudflare R2 / AWS S3 (.glb Draco meshes).
- **API Tier**: Node.js 22, Express 4, Zod schema validation, Argon2id, JWT HttpOnly auth, Prisma ORM 6.
- **Database**: PostgreSQL 16 relational data store.

### 1.2 Sequence Diagrams
- **Sequence 1: Student Disassembles a Part**: Coordinate validation, spatial tolerance calculation (±0.05m), audio ratchet feedback, error logging, and score persistence.
- **Sequence 2: Student Takes Machine Spatial Quiz**: Dynamic camera fly-to targeting, 3D part focus, spatial reasoning questions, instant grading, and mastery calculation.

---

## 2. Entity-Relationship Diagram (ERD) & Data Dictionary

Comprehensive relational models in `apps/api/prisma/schema.prisma`:
- `Role` (`STUDENT`, `INSTRUCTOR`, `ADMIN`)
- `User` (email, username, passwordHash, roleId, timestamps)
- `Machine` (slug, name, category, glbModelUrl, difficulty, baseStats)
- `Part` (machineId, meshName, name, material, function, massKg, kinematicType)
- `AssemblyStep` (machineId, partId, stepOrder, action, targetPosition, tolerance, hint)
- `Attempt` (userId, machineId, mode, timeSeconds, errorsCount, score, completed)
- `Quiz`, `Question`, `QuizAttempt` (spatial assessments, answers, grades)
- `Progress` (userId, machineId, masteryScore, lastStepCompleted, quizzesPassed)

---

## 3. REST API Specification (OpenAPI 3.1.0)

Full YAML contract in `docs/openapi.yaml`:
- `GET /health`
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/machines`, `GET /api/machines/{id}`
- `GET /api/machines/{id}/assembly-steps`
- `POST /api/attempts`
- `GET /api/quizzes/machine/{machineId}`, `POST /api/quizzes/{id}/submit`
- `GET /api/progress/{machineId}`

---

## 4. Figma Prototype & Wireframe Specifications

- Interactive Prototype File: `docs/prototype/index.html` (run locally in browser).
- Screen Flows: Machine Selection Catalog → 3D Kinematics Stage → Exploded Disassembly → Planar Cross-Section Slicing → Guided Assembly Challenge → Spatial Assessment Quiz.
- Design System: Dark laboratory palette (`#08090c`, `#00f0ff`, `#9900ff`, `#f5a623`, `#00ff66`), Inter + JetBrains Mono typography.
