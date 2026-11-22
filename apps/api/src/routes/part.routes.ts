import { Router } from "express";
import { PartController } from "../controllers/part.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import { Role } from "@prisma/client";

export const partRouter: Router = Router({ mergeParams: true });

// Read Parts
partRouter.get("/:machineId/parts", PartController.listByMachine);

// Mutate Parts (Instructor / Admin)
partRouter.post("/:machineId/parts", authenticate, requireRole(Role.INSTRUCTOR, Role.ADMIN), PartController.create);
partRouter.put("/parts/:id", authenticate, requireRole(Role.INSTRUCTOR, Role.ADMIN), PartController.update);
partRouter.delete("/parts/:id", authenticate, requireRole(Role.ADMIN), PartController.delete);
