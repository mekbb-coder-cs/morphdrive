import { MorphSettings, MaterialColors, TuningStats } from "../schemas/vehicle.schema.js";

export interface VehicleBasePreset {
  id: string;
  name: string;
  description: string;
  glbAssetUrl: string;
  defaultMorphSettings: MorphSettings;
  defaultColors: MaterialColors;
  baseTuning: TuningStats;
}

export const STARTER_VEHICLES: VehicleBasePreset[] = [
  {
    id: "spectre-rs",
    name: "Spectre RS",
    description: "High-downforce cyber roadster with adaptive aerodynamic splitters and flight gliders.",
    glbAssetUrl: "/models/spectre_rs.glb",
    defaultMorphSettings: {
      suspensionHeight: 0.15,
      aerodynamicWings: 0.0,
      widebodyFlare: 0.5,
      chassisAggression: 0.8,
      thrusterExtend: 0.0,
    },
    defaultColors: {
      primaryPaint: "#00f0ff",
      secondaryPaint: "#0a0a14",
      rimColor: "#ffd700",
      neonGlow: "#00ffcc",
      windowTint: 0.85,
      metallic: 0.95,
      roughness: 0.15,
    },
    baseTuning: {
      topSpeedKmh: 310,
      acceleration: 8.8,
      handling: 9.2,
      offroadTraction: 2.5,
      downforce: 8.5,
    },
  },
  {
    id: "apex-nomad",
    name: "Apex Nomad",
    description: "Rugged all-terrain dune climber with hydraulic suspension lift and heavy-duty chassis guards.",
    glbAssetUrl: "/models/apex_nomad.glb",
    defaultMorphSettings: {
      suspensionHeight: 0.85,
      aerodynamicWings: 0.0,
      widebodyFlare: 0.9,
      chassisAggression: 0.4,
      thrusterExtend: 0.0,
    },
    defaultColors: {
      primaryPaint: "#ff5500",
      secondaryPaint: "#222222",
      rimColor: "#333333",
      neonGlow: "#ff9900",
      windowTint: 0.6,
      metallic: 0.4,
      roughness: 0.6,
    },
    baseTuning: {
      topSpeedKmh: 210,
      acceleration: 7.2,
      handling: 6.8,
      offroadTraction: 9.8,
      downforce: 4.0,
    },
  },
  {
    id: "valkyrie-aero",
    name: "Valkyrie Aero",
    description: "Experimental VTOL hybrid built for extreme aerial glide velocity and supersonic canyon runs.",
    glbAssetUrl: "/models/valkyrie_aero.glb",
    defaultMorphSettings: {
      suspensionHeight: 0.3,
      aerodynamicWings: 1.0,
      widebodyFlare: 0.2,
      chassisAggression: 0.9,
      thrusterExtend: 1.0,
    },
    defaultColors: {
      primaryPaint: "#9900ff",
      secondaryPaint: "#ffffff",
      rimColor: "#00f0ff",
      neonGlow: "#bf00ff",
      windowTint: 0.9,
      metallic: 0.8,
      roughness: 0.25,
    },
    baseTuning: {
      topSpeedKmh: 360,
      acceleration: 9.6,
      handling: 7.9,
      offroadTraction: 1.5,
      downforce: 9.5,
    },
  },
];
