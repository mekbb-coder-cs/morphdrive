import { MorphSettings, MaterialColors, TuningStats } from "../schemas/vehicle.schema.js";

export interface VehicleBasePreset {
  id: string;
  name: string;
  category: string;
  mechanismPrinciple: string;
  description: string;
  glbAssetUrl: string;
  defaultMorphSettings: MorphSettings;
  defaultColors: MaterialColors;
  baseTuning: TuningStats;
}

export const STARTER_VEHICLES: VehicleBasePreset[] = [
  {
    id: "spectre-rs",
    name: "Spectre V-Sweep UAV",
    category: "Aerospace Kinematics",
    mechanismPrinciple: "Variable-Sweep Wing & Camber Morphing",
    description: "High-speed aerospace research UAV demonstrating pivot spar articulation, variable sweep angles, and deployable glider surfaces.",
    glbAssetUrl: "/models/spectre_rs.glb",
    defaultMorphSettings: {
      suspensionHeight: 0.15,
      aerodynamicWings: 0.0,
      widebodyFlare: 0.4,
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
    name: "Apex Nomad Rover",
    category: "Terramechanics",
    mechanismPrinciple: "Multi-Link Adaptive Suspension Lift",
    description: "Planetary exploration rover equipped with hydraulic rocker-bogie linkages, variable stance width, and active clearance control.",
    glbAssetUrl: "/models/apex_nomad.glb",
    defaultMorphSettings: {
      suspensionHeight: 0.85,
      aerodynamicWings: 0.0,
      widebodyFlare: 0.9,
      chassisAggression: 0.3,
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
    name: "Valkyrie Vector Hybrid",
    category: "Propulsion & V/STOL",
    mechanismPrinciple: "Variable-Area Iris Nozzle & Tilt Actuation",
    description: "Supersonic propulsion testbed with synchronized iris petal convergent-divergent nozzle expansion and variable thrust vectoring.",
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
