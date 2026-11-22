import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export class PartController {
  static async listByMachine(req: Request, res: Response, next: NextFunction) {
    try {
      const machineId = req.params.machineId as string;
      const parts = await prisma.part.findMany({
        where: { machineId },
        orderBy: { name: "asc" },
      });
      return res.json({ parts });
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const machineId = req.params.machineId as string;
      const { meshName, name, material, description, function: partFunction, massKg, kinematicType, boundingVolume } = req.body;

      const part = await prisma.part.create({
        data: {
          machineId,
          meshName,
          name,
          material,
          description: description || partFunction,
          function: partFunction,
          massKg: massKg || 1.0,
          kinematicType: kinematicType || "RIGID",
          boundingVolume: boundingVolume || {},
        },
      });

      return res.status(201).json({ part });
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { name, material, description, function: partFunction, massKg, kinematicType, boundingVolume } = req.body;

      const part = await prisma.part.update({
        where: { id },
        data: {
          ...(name ? { name } : {}),
          ...(material ? { material } : {}),
          ...(description ? { description } : {}),
          ...(partFunction ? { function: partFunction } : {}),
          ...(massKg !== undefined ? { massKg } : {}),
          ...(kinematicType ? { kinematicType } : {}),
          ...(boundingVolume ? { boundingVolume } : {}),
        },
      });

      return res.json({ part });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await prisma.part.delete({ where: { id } });
      return res.json({ message: "Part deleted successfully" });
    } catch (err) {
      return next(err);
    }
  }
}
