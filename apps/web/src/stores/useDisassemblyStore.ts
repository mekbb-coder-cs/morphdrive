import { create } from "zustand";
import {
  MACHINE_DAGS,
  checkDisassemblyRule,
  getRemovableParts,
  DisassemblyRule,
} from "../data/dependencyGraph";

interface DisassemblyState {
  currentMachineId: string;
  disassembledParts: string[]; // List of removed mesh names in order of disassembly
  undoStack: string[];
  redoStack: string[];
  selectedPartMesh: string | null;
  activeTransformMesh: string | null;
  hintMesh: string | null;
  hintMessage: string | null;
  errorNotice: { partName: string; blockers: string[]; message: string } | null;
  score: number;
  errorCount: number;
  startTime: number;
  isComplete: boolean;

  // Actions
  setMachineId: (machineId: string) => void;
  selectPart: (meshName: string | null) => void;
  attemptDisassemblePart: (meshName: string) => boolean;
  animateNextStep: () => boolean;
  undo: () => void;
  redo: () => void;
  showNextStepHint: () => void;
  clearHint: () => void;
  clearErrorNotice: () => void;
  resetDisassembly: () => void;
  setActiveTransformMesh: (meshName: string | null) => void;
}

export const useDisassemblyStore = create<DisassemblyState>((set, get) => ({
  currentMachineId: "single-cylinder-engine",
  disassembledParts: [],
  undoStack: [],
  redoStack: [],
  selectedPartMesh: null,
  activeTransformMesh: null,
  hintMesh: null,
  hintMessage: null,
  errorNotice: null,
  score: 0,
  errorCount: 0,
  startTime: Date.now(),
  isComplete: false,

  setMachineId: (machineId: string) => {
    set({
      currentMachineId: machineId,
      disassembledParts: [],
      undoStack: [],
      redoStack: [],
      selectedPartMesh: null,
      activeTransformMesh: null,
      hintMesh: null,
      hintMessage: null,
      errorNotice: null,
      score: 0,
      errorCount: 0,
      startTime: Date.now(),
      isComplete: false,
    });
  },

  selectPart: (meshName: string | null) => {
    set({ selectedPartMesh: meshName, activeTransformMesh: meshName });
  },

  setActiveTransformMesh: (meshName: string | null) => {
    set({ activeTransformMesh: meshName });
  },

  attemptDisassemblePart: (meshName: string): boolean => {
    const { currentMachineId, disassembledParts, undoStack, score, errorCount } = get();

    if (disassembledParts.includes(meshName)) {
      return false;
    }

    const { allowed, unresolvedBlockers, rule } = checkDisassemblyRule(
      currentMachineId,
      meshName,
      disassembledParts
    );

    if (!allowed) {
      // Violation of DAG constraint!
      const dag = MACHINE_DAGS[currentMachineId];
      const blockerNames = unresolvedBlockers
        .map((b) => dag?.rules[b]?.displayName || b)
        .join(", ");

      set({
        errorNotice: {
          partName: rule?.displayName || meshName,
          blockers: unresolvedBlockers,
          message: `Cannot extract ${rule?.displayName || meshName}! Blocked by: ${blockerNames}. Remove blockers first.`,
        },
        errorCount: errorCount + 1,
        score: Math.max(0, score - 20),
      });
      return false;
    }

    // Success: DAG rule passed!
    const nextDisassembled = [...disassembledParts, meshName];
    const dag = MACHINE_DAGS[currentMachineId];
    const totalParts = Object.keys(dag?.rules || {}).length;
    const isComplete = nextDisassembled.length >= totalParts;

    set({
      disassembledParts: nextDisassembled,
      undoStack: [...undoStack, meshName],
      redoStack: [],
      errorNotice: null,
      score: score + 100,
      selectedPartMesh: null,
      activeTransformMesh: null,
      hintMesh: null,
      hintMessage: null,
      isComplete,
    });

    return true;
  },

  animateNextStep: (): boolean => {
    const { currentMachineId, disassembledParts } = get();
    const dag = MACHINE_DAGS[currentMachineId];
    if (!dag) return false;

    // Find the next un-disassembled part in optimalSequence that has its blockers resolved
    const nextCandidate = dag.optimalSequence.find((meshName) => {
      if (disassembledParts.includes(meshName)) return false;
      const { allowed } = checkDisassemblyRule(currentMachineId, meshName, disassembledParts);
      return allowed;
    });

    if (nextCandidate) {
      return get().attemptDisassemblePart(nextCandidate);
    }
    return false;
  },

  undo: () => {
    const { undoStack, disassembledParts, redoStack } = get();
    if (undoStack.length === 0) return;

    const lastRemoved = undoStack[undoStack.length - 1];
    set({
      undoStack: undoStack.slice(0, -1),
      disassembledParts: disassembledParts.filter((p) => p !== lastRemoved),
      redoStack: [...redoStack, lastRemoved],
      errorNotice: null,
      isComplete: false,
    });
  },

  redo: () => {
    const { redoStack, undoStack, disassembledParts } = get();
    if (redoStack.length === 0) return;

    const partToReapply = redoStack[redoStack.length - 1];
    set({
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, partToReapply],
      disassembledParts: [...disassembledParts, partToReapply],
      errorNotice: null,
    });
  },

  showNextStepHint: () => {
    const { currentMachineId, disassembledParts } = get();
    const dag = MACHINE_DAGS[currentMachineId];
    if (!dag) return;

    const nextCandidate = dag.optimalSequence.find((meshName) => {
      if (disassembledParts.includes(meshName)) return false;
      const { allowed } = checkDisassemblyRule(currentMachineId, meshName, disassembledParts);
      return allowed;
    });

    if (nextCandidate) {
      const rule = dag.rules[nextCandidate];
      set({
        hintMesh: nextCandidate,
        selectedPartMesh: nextCandidate,
        activeTransformMesh: nextCandidate,
        hintMessage: `RECOMMENDED STEP: ${rule.displayName}. Tool: ${rule.toolRequired}. ${rule.hint}`,
      });
    }
  },

  clearHint: () => {
    set({ hintMesh: null, hintMessage: null });
  },

  clearErrorNotice: () => {
    set({ errorNotice: null });
  },

  resetDisassembly: () => {
    set({
      disassembledParts: [],
      undoStack: [],
      redoStack: [],
      selectedPartMesh: null,
      activeTransformMesh: null,
      hintMesh: null,
      hintMessage: null,
      errorNotice: null,
      score: 0,
      errorCount: 0,
      startTime: Date.now(),
      isComplete: false,
    });
  },
}));
