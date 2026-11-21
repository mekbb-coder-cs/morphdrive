import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { SubmitLapTimeInput } from "@morphdrive/shared";

export class LeaderboardController {
  static async listTracks(req: Request, res: Response, next: NextFunction) {
    try {
      const tracks = await prisma.track.findMany({
        orderBy: { name: "asc" },
      });
      return res.json({ tracks });
    } catch (err) {
      return next(err);
    }
  }

  static async getTrackLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const trackId = req.params.trackId as string;
      const limit = Math.min(Number(req.query.limit) || 50, 100);

      const entries = await prisma.lapTime.findMany({
        where: { trackId },
        include: {
          user: { select: { username: true } },
          vehicleLoadout: { select: { name: true, vehicleBaseId: true } },
        },
        orderBy: { timeMs: "asc" },
        take: limit,
      });

      const formatted = entries.map((entry, index) => ({
        id: entry.id,
        rank: index + 1,
        username: (entry as { user?: { username: string } }).user?.username ?? "Pilot",
        trackId: entry.trackId,
        vehicleName: (entry as { vehicleLoadout?: { name: string } }).vehicleLoadout?.name ?? "Stock Chassis",
        timeMs: entry.timeMs,
        achievedAt: entry.achievedAt,
        hasGhost: Boolean(entry.ghostDataUrl),
      }));

      return res.json({ leaderboard: formatted });
    } catch (err) {
      return next(err);
    }
  }

  static async submitLap(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { trackId, vehicleLoadoutId, timeMs }: SubmitLapTimeInput = req.body;

      if (timeMs < 15000) {
        return res.status(400).json({ error: "Lap time rejected by telemetry physics validator" });
      }

      const lap = await prisma.lapTime.create({
        data: {
          userId,
          trackId,
          vehicleLoadoutId,
          timeMs,
        },
      });

      return res.status(201).json({ lap });
    } catch (err) {
      return next(err);
    }
  }
}
