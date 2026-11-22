import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export class MachineController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const machines = await prisma.machine.findMany({
        where: category ? { category } : undefined,
        include: {
          _count: {
            select: { parts: true, assemblySteps: true },
          },
        },
        orderBy: { name: "asc" },
      });
      return res.json({ machines });
    } catch (err) {
      return next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const machine = await prisma.machine.findFirst({
        where: { OR: [{ id }, { slug: id }] },
        include: {
          parts: true,
          assemblySteps: {
            orderBy: { stepOrder: "asc" },
            include: { part: true },
          },
        },
      });

      if (!machine) return res.status(404).json({ error: "Machine not found" });
      return res.json({ machine });
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, slug, name, category, description, glbModelUrl, difficulty, baseStats } = req.body;

      const machine = await prisma.machine.create({
        data: {
          id: id || slug,
          slug,
          name,
          category,
          description,
          glbModelUrl,
          difficulty: difficulty || "INTERMEDIATE",
          baseStats: baseStats || {},
        },
      });

      return res.status(201).json({ machine });
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { name, category, description, glbModelUrl, difficulty, baseStats } = req.body;

      const machine = await prisma.machine.update({
        where: { id },
        data: {
          ...(name ? { name } : {}),
          ...(category ? { category } : {}),
          ...(description ? { description } : {}),
          ...(glbModelUrl ? { glbModelUrl } : {}),
          ...(difficulty ? { difficulty } : {}),
          ...(baseStats ? { baseStats } : {}),
        },
      });

      return res.json({ machine });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await prisma.machine.delete({ where: { id } });
      return res.json({ message: "Machine deleted successfully" });
    } catch (err) {
      return next(err);
    }
  }
}
