import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export class VehicleController {
  static async listBases(req: Request, res: Response, next: NextFunction) {
    try {
      const bases = await prisma.vehicleBase.findMany({
        orderBy: { name: "asc" },
      });
      return res.json({ vehicles: bases });
    } catch (err) {
      return next(err);
    }
  }

  static async getBaseById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const base = await prisma.vehicleBase.findUnique({
        where: { id },
      });
      if (!base) return res.status(404).json({ error: "Vehicle base not found" });
      return res.json({ vehicle: base });
    } catch (err) {
      return next(err);
    }
  }
}
