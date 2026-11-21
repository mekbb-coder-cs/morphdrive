import { create } from "zustand";
import {
  STARTER_VEHICLES,
  VehicleBasePreset,
  MorphSettings,
  MaterialColors,
  MorphMode,
  TuningStats,
} from "@morphdrive/shared";

interface VehicleState {
  currentVehicle: VehicleBasePreset;
  activeMode: MorphMode;
  morphSettings: MorphSettings;
  materialColors: MaterialColors;
  tuningStats: TuningStats;
  isCustomized: boolean;

  // Actions
  selectVehicle: (vehicleId: string) => void;
  setMode: (mode: MorphMode) => void;
  updateMorph: (key: keyof MorphSettings, value: number) => void;
  updateColor: (key: keyof MaterialColors, value: string | number) => void;
  resetCustomization: () => void;
}

const defaultVehicle = STARTER_VEHICLES[0];

export const useVehicleStore = create<VehicleState>((set, get) => ({
  currentVehicle: defaultVehicle,
  activeMode: "STREET",
  morphSettings: { ...defaultVehicle.defaultMorphSettings },
  materialColors: { ...defaultVehicle.defaultColors },
  tuningStats: { ...defaultVehicle.baseTuning },
  isCustomized: false,

  selectVehicle: (vehicleId: string) => {
    const found = STARTER_VEHICLES.find((v) => v.id === vehicleId);
    if (!found) return;
    set({
      currentVehicle: found,
      morphSettings: { ...found.defaultMorphSettings },
      materialColors: { ...found.defaultColors },
      tuningStats: { ...found.baseTuning },
      isCustomized: false,
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

  resetCustomization: () => {
    const v = get().currentVehicle;
    set({
      morphSettings: { ...v.defaultMorphSettings },
      materialColors: { ...v.defaultColors },
      tuningStats: { ...v.baseTuning },
      isCustomized: false,
    });
  },
}));
