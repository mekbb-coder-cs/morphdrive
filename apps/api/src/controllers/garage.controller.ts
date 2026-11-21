import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { CreateVehicleLoadoutInput, UpdateVehicleLoadoutInput } from "@morphdrive/shared";

export class GarageController {
  static async listLoadouts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const loadouts = await prisma.vehicleLoadout.findMany({
        where: { userId },
        include: { vehicleBase: true },
        orderBy: [{ isFavorite: "desc" }, { updatedAt: "desc" }],
      });
      return res.json({ loadouts });
    } catch (err) {
      return next(err);
    }
  }

  static async getLoadoutById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;

      const loadout = await prisma.vehicleLoadout.findFirst({
        where: { id, userId },
        include: { vehicleBase: true },
      });

      if (!loadout) return res.status(404).json({ error: "Loadout not found" });
      return res.json({ loadout });
    } catch (err) {
      return next(err);
    }
  }

  static async createLoadout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const input: CreateVehicleLoadoutInput = req.body;

      const vehicleBase = await prisma.vehicleBase.findUnique({
        where: { id: input.vehicleBaseId },
      });
      if (!vehicleBase) return res.status(400).json({ error: "Invalid vehicleBaseId" });

      const loadout = await prisma.vehicleLoadout.create({
        data: {
          userId,
          vehicleBaseId: input.vehicleBaseId,
          name: input.name,
          activeMode: input.activeMode,
          morphSettings: input.morphSettings as any,
          materialColors: input.materialColors as any,
          tuningStats: (input.tuningStats || vehicleBase.baseTuning) as any,
          isFavorite: input.isFavorite,
        },
        include: { vehicleBase: true },
      });

      return res.status(201).json({ loadout });
    } catch (err) {
      return next(err);
    }
  }

  static async updateLoadout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const input: UpdateVehicleLoadoutInput = req.body;

      const existing = await prisma.vehicleLoadout.findFirst({
        where: { id, userId },
      });
      if (!existing) return res.status(404).json({ error: "Loadout not found" });

      const updated = await prisma.vehicleLoadout.update({
        where: { id },
        data: {
          ...(input.name ? { name: input.name } : {}),
          ...(input.activeMode ? { activeMode: input.activeMode } : {}),
          ...(input.morphSettings ? { morphSettings: input.morphSettings as any } : {}),
          ...(input.materialColors ? { materialColors: input.materialColors as any } : {}),
          ...(input.tuningStats ? { tuningStats: input.tuningStats as any } : {}),
          ...(input.isFavorite !== undefined ? { isFavorite: input.isFavorite } : {}),
        },
        include: { vehicleBase: true },
      });

      return res.json({ loadout: updated });
    } catch (err) {
      return next(err);
    }
  }

  static async deleteLoadout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;

      const existing = await prisma.vehicleLoadout.findFirst({
        where: { id, userId },
      });
      if (!existing) return res.status(404).json({ error: "Loadout not found" });

      await prisma.vehicleLoadout.delete({ where: { id } });
      return res.json({ message: "Loadout deleted successfully" });
    } catch (err) {
      return next(err);
    }
  }
}
