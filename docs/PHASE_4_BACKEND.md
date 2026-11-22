# Phase 4: Project Setup & Backend Foundation

**Project**: MorphDrive — Interactive 3D Educational Inspection & Morphing Mechanism Platform  
**Milestone**: Phase 4 (Weeks 6–8)  
**Deliverable**: Working, Documented REST API with Role-Based Access Control, Model Uploads, and Seeded Educational Database  

---

## 1. Quickstart & Verification

```bash
# 1. Run migrations & seed database
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 2. Run backend integration test suite
pnpm --filter @morphdrive/api test

# 3. Start API server
pnpm dev:api
```

Visit the interactive Swagger UI at:
👉 **`http://localhost:4000/api-docs`**

---

## 2. Default Seeded Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `student@morphdrive.io` | `password123` | Read machines, parts, steps, submit attempts/quizzes. |
| **Instructor** | `instructor@morphdrive.io` | `password123` | Create & update machines, parts, assembly steps, upload models. |
| **Admin** | `admin@morphdrive.io` | `password123` | Full administrative control including delete mutations. |

---

## 3. Endpoints Implemented

- `/health` — Health check
- `/api-docs` — Swagger UI documentation
- `/api/auth/*` — Register, login, refresh, me, logout
- `/api/machines/*` — Machine catalog CRUD
- `/api/machines/:machineId/parts` — Sub-assembly parts CRUD
- `/api/machines/:machineId/assembly-steps` — Sequential disassembly steps CRUD
- `/api/upload/model` — Binary `.glb` upload with magic-byte validation
