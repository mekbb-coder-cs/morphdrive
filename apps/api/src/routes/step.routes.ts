import { Router } from "express";
import { StepController } from "../controllers/step.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import { Role } from "@prisma/client";

export const stepRouter: Router = Router({ mergeParams: true });

// Read Assembly Steps
stepRouter.get("/:machineId/assembly-steps", StepController.listByMachine);

// Mutate Assembly Steps (Instructor / Admin)
stepRouter.post("/:machineId/assembly-steps", authenticate, requireRole(Role.INSTRUCTOR, Role.ADMIN), StepController.create);
stepRouter.put("/steps/:id", authenticate, requireRole(Role.INSTRUCTOR, Role.ADMIN), StepController.update);
stepRouter.delete("/steps/:id", authenticate, requireRole(Role.ADMIN), StepController.delete);
