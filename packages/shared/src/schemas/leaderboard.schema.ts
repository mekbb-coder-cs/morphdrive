import { z } from "zod";

export const TelemetryNodeSchema = z.object({
  t: z.number(), // timestamp relative to start (ms)
  p: z.tuple([z.number(), z.number(), z.number()]), // [x, y, z]
  q: z.tuple([z.number(), z.number(), z.number(), z.number()]), // [qx, qy, qz, qw]
  s: z.number(), // speed in km/h
  m: z.number().min(0).max(1), // morph transition weight
});
export type TelemetryNode = z.infer<typeof TelemetryNodeSchema>;

export const SubmitLapTimeSchema = z.object({
  trackId: z.string(),
  vehicleLoadoutId: z.string().uuid().optional(),
  vehicleBaseId: z.string(),
  timeMs: z.number().positive(),
  ghostTelemetry: z.array(TelemetryNodeSchema).max(5000).optional(),
});
export type SubmitLapTimeInput = z.infer<typeof SubmitLapTimeSchema>;

export const LeaderboardEntrySchema = z.object({
  id: z.string().uuid(),
  rank: z.number().int().positive(),
  username: z.string(),
  trackId: z.string(),
  vehicleName: z.string(),
  timeMs: z.number(),
  achievedAt: z.string().or(z.date()),
  hasGhost: z.boolean(),
});
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
