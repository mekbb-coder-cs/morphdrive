import { create } from "zustand";
import {
  STARTER_VEHICLES,
  VehicleBasePreset,
  MorphSettings,
  MaterialColors,
  MorphMode,
  TuningStats,
} from "@morphdrive/shared";

export type GarageTab = "MORPH" | "INSPECT" | "PAINT" | "SPECS";
export type ClippingAxis = "X" | "Y" | "Z";

interface VehicleState {
  currentVehicle: VehicleBasePreset;
  activeMode: MorphMode;
  activeTab: GarageTab;
  morphSettings: MorphSettings;
  materialColors: MaterialColors;
  tuningStats: TuningStats;
  isCustomized: boolean;

  // FR-05 Exploded View Disassembly
  explodedProgress: number; // 0.0 (assembled) to 1.0 (fully exploded)

  // FR-08 Cross-Sectional Planar Slicing
  crossSectionEnabled: boolean;
  crossSectionAxis: ClippingAxis;
  crossSectionOffset: number; // translation in meters

  // Component Hierarchy Isolation
  isolatedComponent: string | null;

  // Actions
  setActiveTab: (tab: GarageTab) => void;
  selectVehicle: (vehicleId: string) => void;
  setMode: (mode: MorphMode) => void;
  updateMorph: (key: keyof MorphSettings, value: number) => void;
  updateColor: (key: keyof MaterialColors, value: string | number) => void;
  setExplodedProgress: (progress: number) => void;
  setCrossSectionEnabled: (enabled: boolean) => void;
  setCrossSectionAxis: (axis: ClippingAxis) => void;
  setCrossSectionOffset: (offset: number) => void;
  setIsolatedComponent: (componentId: string | null) => void;
  resetCustomization: () => void;
}

const defaultVehicle = STARTER_VEHICLES[0];

export const useVehicleStore = create<VehicleState>((set, get) => ({
  currentVehicle: defaultVehicle,
  activeMode: "STREET",
  activeTab: "MORPH",
  morphSettings: { ...defaultVehicle.defaultMorphSettings },
  materialColors: { ...defaultVehicle.defaultColors },
  tuningStats: { ...defaultVehicle.baseTuning },
  isCustomized: false,

  // Inspection states
  explodedProgress: 0.0,
  crossSectionEnabled: false,
  crossSectionAxis: "Y",
  crossSectionOffset: 0.5,
  isolatedComponent: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  selectVehicle: (vehicleId: string) => {
    const found = STARTER_VEHICLES.find((v) => v.id === vehicleId);
    if (!found) return;
    set({
      currentVehicle: found,
      morphSettings: { ...found.defaultMorphSettings },
      materialColors: { ...found.defaultColors },
      tuningStats: { ...found.baseTuning },
      isCustomized: false,
      explodedProgress: 0.0,
      isolatedComponent: null,
    });
  },

  setMode: (mode: MorphMode) => {
    const current = get().morphSettings;
    let targetMorph: MorphSettings = { ...current };

    if (mode === "STREET") {
      targetMorph = {
        suspensionHeight: 0.15,
        aerodynamicWings: 0.0,
        widebodyFlare: 0.4,
        chassisAggression: 0.8,
        thrusterExtend: 0.0,
      };
    } else if (mode === "OFFROAD") {
      targetMorph = {
        suspensionHeight: 0.85,
        aerodynamicWings: 0.0,
        widebodyFlare: 0.8,
        chassisAggression: 0.3,
        thrusterExtend: 0.0,
      };
    } else if (mode === "FLIGHT") {
      targetMorph = {
        suspensionHeight: 0.35,
        aerodynamicWings: 1.0,
        widebodyFlare: 0.2,
        chassisAggression: 0.9,
        thrusterExtend: 1.0,
      };
    }

    set({ activeMode: mode, morphSettings: targetMorph });
  },

  updateMorph: (key, value) => {
    set((state) => ({
      morphSettings: { ...state.morphSettings, [key]: value },
      isCustomized: true,
    }));
  },

  updateColor: (key, value) => {
    set((state) => ({
      materialColors: { ...state.materialColors, [key]: value },
      isCustomized: true,
    }));
  },

  setExplodedProgress: (progress) => set({ explodedProgress: Math.max(0, Math.min(1, progress)) }),
  setCrossSectionEnabled: (enabled) => set({ crossSectionEnabled: enabled }),
  setCrossSectionAxis: (axis) => set({ crossSectionAxis: axis }),
  setCrossSectionOffset: (offset) => set({ crossSectionOffset: offset }),
  setIsolatedComponent: (comp) => set({ isolatedComponent: comp }),

  resetCustomization: () => {
    const v = get().currentVehicle;
    set({
      morphSettings: { ...v.defaultMorphSettings },
      materialColors: { ...v.defaultColors },
      tuningStats: { ...v.baseTuning },
      explodedProgress: 0.0,
      crossSectionEnabled: false,
      isolatedComponent: null,
      isCustomized: false,
    });
  },
}));
