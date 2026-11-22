import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { AssemblyAction } from "@prisma/client";

export class StepController {
  static async listByMachine(req: Request, res: Response, next: NextFunction) {
    try {
      const machineId = req.params.machineId as string;
      const steps = await prisma.assemblyStep.findMany({
        where: { machineId },
        include: { part: true },
        orderBy: { stepOrder: "asc" },
      });
      return res.json({ steps });
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const machineId = req.params.machineId as string;
      const { partId, stepOrder, action, targetPosition, targetRotation, tolerance, hint, safetyWarning } = req.body;

      const step = await prisma.assemblyStep.create({
        data: {
          machineId,
          partId,
          stepOrder,
          action: (action as AssemblyAction) || AssemblyAction.DISASSEMBLE,
          targetPosition,
          targetRotation: targetRotation || undefined,
          tolerance: tolerance || 0.05,
          hint,
          safetyWarning,
        },
        include: { part: true },
      });

      return res.status(201).json({ step });
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { stepOrder, action, targetPosition, targetRotation, tolerance, hint, safetyWarning } = req.body;

      const step = await prisma.assemblyStep.update({
        where: { id },
        data: {
          ...(stepOrder !== undefined ? { stepOrder } : {}),
          ...(action ? { action: action as AssemblyAction } : {}),
          ...(targetPosition ? { targetPosition } : {}),
          ...(targetRotation ? { targetRotation } : {}),
          ...(tolerance !== undefined ? { tolerance } : {}),
          ...(hint ? { hint } : {}),
          ...(safetyWarning !== undefined ? { safetyWarning } : {}),
        },
        include: { part: true },
      });

      return res.json({ step });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await prisma.assemblyStep.delete({ where: { id } });
      return res.json({ message: "Assembly step deleted successfully" });
    } catch (err) {
      return next(err);
    }
  }
}
