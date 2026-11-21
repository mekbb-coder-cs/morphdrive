import { z } from "zod";

export const MorphModeEnum = z.enum(["STREET", "OFFROAD", "FLIGHT"]);
export type MorphMode = z.infer<typeof MorphModeEnum>;

// Morph weights (0.0 to 1.0)
export const MorphSettingsSchema = z.object({
  suspensionHeight: z.number().min(0).max(1).default(0.2),
  aerodynamicWings: z.number().min(0).max(1).default(0.0),
  widebodyFlare: z.number().min(0).max(1).default(0.0),
  chassisAggression: z.number().min(0).max(1).default(0.5),
  thrusterExtend: z.number().min(0).max(1).default(0.0),
});
export type MorphSettings = z.infer<typeof MorphSettingsSchema>;

// Material & paint customization
export const MaterialColorsSchema = z.object({
  primaryPaint: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default("#00f0ff"),
  secondaryPaint: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default("#1a1a24"),
  rimColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default("#d4af37"),
  neonGlow: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default("#00ff66"),
  windowTint: z.number().min(0).max(1).default(0.8),
  metallic: z.number().min(0).max(1).default(0.9),
  roughness: z.number().min(0).max(1).default(0.2),
});
export type MaterialColors = z.infer<typeof MaterialColorsSchema>;

// Vehicle physics tuning
export const TuningStatsSchema = z.object({
  topSpeedKmh: z.number().min(80).max(400).default(240),
  acceleration: z.number().min(1).max(10).default(7.5),
  handling: z.number().min(1).max(10).default(8.0),
  offroadTraction: z.number().min(1).max(10).default(3.0),
  downforce: z.number().min(1).max(10).default(6.0),
});
export type TuningStats = z.infer<typeof TuningStatsSchema>;

// Vehicle loadout creation and persistence
export const CreateVehicleLoadoutSchema = z.object({
  name: z.string().min(2).max(40),
  vehicleBaseId: z.string(),
  activeMode: MorphModeEnum.default("STREET"),
  morphSettings: MorphSettingsSchema,
  materialColors: MaterialColorsSchema,
  tuningStats: TuningStatsSchema.optional(),
  isFavorite: z.boolean().default(false),
});
export type CreateVehicleLoadoutInput = z.infer<typeof CreateVehicleLoadoutSchema>;

export const UpdateVehicleLoadoutSchema = CreateVehicleLoadoutSchema.partial();
export type UpdateVehicleLoadoutInput = z.infer<typeof UpdateVehicleLoadoutSchema>;
