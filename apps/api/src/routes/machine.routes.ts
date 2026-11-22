import { Router } from "express";
import { MachineController } from "../controllers/machine.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import { Role } from "@prisma/client";

export const machineRouter: Router = Router();

// Public Read Endpoints
machineRouter.get("/", MachineController.list);
machineRouter.get("/:id", MachineController.getById);

// Instructor / Admin Protected Endpoints
machineRouter.post("/", authenticate, requireRole(Role.INSTRUCTOR, Role.ADMIN), MachineController.create);
machineRouter.put("/:id", authenticate, requireRole(Role.INSTRUCTOR, Role.ADMIN), MachineController.update);
machineRouter.delete("/:id", authenticate, requireRole(Role.ADMIN), MachineController.delete);
