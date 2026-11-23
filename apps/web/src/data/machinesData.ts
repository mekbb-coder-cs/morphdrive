import engineData from "./machines/single_cylinder_engine.json";
import gearboxData from "./machines/gearbox.json";
import landingGearData from "./machines/landing_gear_strut.json";
import turbineData from "./machines/turbine_stage.json";

export interface MachinePart {
  id: string;
  meshName: string;
  displayName: string;
  material: string;
  function: string;
  massKg: number;
  pivotOrigin: [number, number, number];
  kinematicType: "RIGID" | "ROTATIONAL" | "TRANSLATIONAL" | "PLANAR";
}

export interface HierarchyNode {
  node?: string;
  root?: string;
  children?: (HierarchyNode | string)[];
}

export interface AssemblyStep {
  order: number;
  partId: string;
  meshName: string;
  action: string;
  targetPosition: [number, number, number];
  targetRotationEuler: [number, number, number];
  tolerance: number;
  hint: string;
  toolRequired: string;
}

export interface MachineMetadata {
  machineId: string;
  name: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  totalTriangles: number;
  glbAssetUrl: string;
  description: string;
  parts: MachinePart[];
  hierarchy: HierarchyNode;
  explodedView: Record<string, [number, number, number]>;
  assemblySteps: AssemblyStep[];
}

export const MACHINES_DATA: Record<string, MachineMetadata> = {
  "single-cylinder-engine": engineData as unknown as MachineMetadata,
  "gearbox": gearboxData as unknown as MachineMetadata,
  "landing-gear-strut": landingGearData as unknown as MachineMetadata,
  "turbine-stage": turbineData as unknown as MachineMetadata,
};

export const MACHINES_LIST: MachineMetadata[] = Object.values(MACHINES_DATA);

export function getMachineById(id: string): MachineMetadata {
  return MACHINES_DATA[id] || MACHINES_DATA["single-cylinder-engine"];
}
