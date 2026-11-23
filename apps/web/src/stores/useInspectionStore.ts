import { create } from "zustand";
import { MACHINES_DATA, MachineMetadata, getMachineById } from "../data/machinesData";

export type RenderMode = "SHADED" | "WIREFRAME" | "XRAY";

interface InspectionState {
  currentMachineId: string;
  selectedPartMesh: string | null;
  hoveredPartMesh: string | null;
  hiddenParts: string[];
  isolatedPart: string | null;
  renderMode: RenderMode;
  explodedProgress: number;
  measurementActive: boolean;
  measurementPoints: [number, number, number][];
  cameraResetSeq: number;
  sidebarOpen: boolean;

  // Actions
  setMachineId: (id: string) => void;
  selectPart: (meshName: string | null) => void;
  hoverPart: (meshName: string | null) => void;
  togglePartVisibility: (meshName: string) => void;
  showAllParts: () => void;
  setIsolatedPart: (meshName: string | null) => void;
  setRenderMode: (mode: RenderMode) => void;
  setExplodedProgress: (progress: number) => void;
  setMeasurementActive: (active: boolean) => void;
  addMeasurementPoint: (pt: [number, number, number]) => void;
  clearMeasurement: () => void;
  resetCamera: () => void;
  toggleSidebar: () => void;
  resetAllInspection: () => void;
}

export const useInspectionStore = create<InspectionState>((set, get) => ({
  currentMachineId: "single-cylinder-engine",
  selectedPartMesh: null,
  hoveredPartMesh: null,
  hiddenParts: [],
  isolatedPart: null,
  renderMode: "SHADED",
  explodedProgress: 0,
  measurementActive: false,
  measurementPoints: [],
  cameraResetSeq: 0,
  sidebarOpen: true,

  setMachineId: (id: string) => {
    if (MACHINES_DATA[id]) {
      set({
        currentMachineId: id,
        selectedPartMesh: null,
        hoveredPartMesh: null,
        hiddenParts: [],
        isolatedPart: null,
        explodedProgress: 0,
        measurementPoints: [],
        cameraResetSeq: get().cameraResetSeq + 1,
      });
    }
  },

  selectPart: (meshName: string | null) => {
    set({ selectedPartMesh: meshName });
  },

  hoverPart: (meshName: string | null) => {
    set({ hoveredPartMesh: meshName });
  },

  togglePartVisibility: (meshName: string) => {
    const { hiddenParts } = get();
    if (hiddenParts.includes(meshName)) {
      set({ hiddenParts: hiddenParts.filter((p) => p !== meshName) });
    } else {
      set({ hiddenParts: [...hiddenParts, meshName] });
    }
  },

  showAllParts: () => {
    set({ hiddenParts: [], isolatedPart: null });
  },

  setIsolatedPart: (meshName: string | null) => {
    set({ isolatedPart: meshName });
  },

  setRenderMode: (mode: RenderMode) => {
    set({ renderMode: mode });
  },

  setExplodedProgress: (progress: number) => {
    set({ explodedProgress: Math.max(0, Math.min(1, progress)) });
  },

  setMeasurementActive: (active: boolean) => {
    set({
      measurementActive: active,
      measurementPoints: active ? get().measurementPoints : [],
    });
  },

  addMeasurementPoint: (pt: [number, number, number]) => {
    const current = get().measurementPoints;
    if (current.length >= 2) {
      set({ measurementPoints: [pt] });
    } else {
      set({ measurementPoints: [...current, pt] });
    }
  },

  clearMeasurement: () => {
    set({ measurementPoints: [] });
  },

  resetCamera: () => {
    set((state) => ({ cameraResetSeq: state.cameraResetSeq + 1 }));
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  resetAllInspection: () => {
    set({
      selectedPartMesh: null,
      hoveredPartMesh: null,
      hiddenParts: [],
      isolatedPart: null,
      renderMode: "SHADED",
      explodedProgress: 0,
      measurementActive: false,
      measurementPoints: [],
      cameraResetSeq: get().cameraResetSeq + 1,
    });
  },
}));
