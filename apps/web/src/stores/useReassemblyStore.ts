import { create } from "zustand";
import { MACHINE_DAGS, DisassemblyRule } from "../data/dependencyGraph";
import { getMachineById } from "../data/machinesData";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type ReassemblyMode = "practice" | "guided" | "test";

export interface AssemblyAttempt {
  mode: ReassemblyMode;
  machineId: string;
  startTime: number;
  endTime: number | null;
  durationMs: number | null;
  partsAssembled: string[];         // In the order the user assembled them
  wrongOrderPenalties: number;      // Wrong-order attempts
  hintPenalties: number;            // Hints used
  score: number;
  accuracy: number;                 // 0-100 %
}

interface ReassemblyState {
  // Setup
  currentMachineId: string;
  mode: ReassemblyMode;

  // The parts currently still in the tray (not yet reinstalled)
  trayParts: string[];          // All parts start here (from full disassembly)

  // The reverse-DAG sequence: parts that ARE currently allowed to be installed
  // A part is installable when every part that depends on it in the original
  // DAG has not yet been installed (i.e. still in the tray).
  assembledParts: string[];     // Parts successfully reinstalled, in order

  // Selection & hint
  selectedPartMesh: string | null;
  snapTargetMesh: string | null;    // Part mesh currently near its snap target
  hintMesh: string | null;
  hintMessage: string | null;

  // Feedback
  errorNotice: { partName: string; message: string; expectedFirst?: string[] } | null;

  // Scoring
  score: number;
  wrongOrderCount: number;
  hintsUsed: number;
  startTime: number;
  isComplete: boolean;
  finalAttempt: AssemblyAttempt | null;

  // ── Actions ──
  setMachineId: (machineId: string) => void;
  setMode: (mode: ReassemblyMode) => void;
  startSession: () => void;             // Fully disassemble → fill tray → start timer
  selectPart: (meshName: string | null) => void;
  attemptInstallPart: (meshName: string) => boolean;
  animateNextStep: () => boolean;
  showNextStepHint: () => void;
  clearHint: () => void;
  clearErrorNotice: () => void;
  resetReassembly: () => void;
  setSnapTargetMesh: (meshName: string | null) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reverse-DAG helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the REVERSE optimal sequence: last-disassembled first reinstalled.
 * This is `optimalSequence` reversed.
 */
function reverseSequence(machineId: string): string[] {
  const dag = MACHINE_DAGS[machineId];
  if (!dag) return [];
  return [...dag.optimalSequence].reverse();
}

/**
 * A part is installable during reassembly when all parts that BLOCK it in the
 * original DAG (its "dependants") have already been installed.
 *
 * Put differently: in the reverse graph we build from the disassembly DAG,
 * part B is installable before part A if A depended on B being removed first
 * (i.e. A lists B as a blocker). That means in reassembly, A is installed first,
 * then B goes back in.
 *
 * Concretely: `meshName` can be installed when every part X in the DAG
 * whose `blockers` list contains `meshName` has already been assembled.
 */
function getInstallableParts(machineId: string, assembledParts: string[]): string[] {
  const dag = MACHINE_DAGS[machineId];
  if (!dag) return [];

  return Object.keys(dag.rules).filter((meshName) => {
    if (assembledParts.includes(meshName)) return false;
    // Find every part X that lists meshName as a blocker (X depends on meshName)
    // For meshName to be installable, every such X must already be assembled.
    const dependants = Object.entries(dag.rules)
      .filter(([, rule]) => rule.blockers.includes(meshName))
      .map(([name]) => name);

    return dependants.every((d) => assembledParts.includes(d));
  });
}

/**
 * Check if installing `meshName` now is a valid step given the reverse DAG.
 * Returns { allowed, wrongParts } where wrongParts are parts that should come
 * first before meshName (dependants not yet installed).
 */
function checkInstallRule(
  machineId: string,
  meshName: string,
  assembledParts: string[]
): { allowed: boolean; wrongParts: string[] } {
  const dag = MACHINE_DAGS[machineId];
  if (!dag) return { allowed: true, wrongParts: [] };
  if (!dag.rules[meshName]) return { allowed: true, wrongParts: [] };

  const dependants = Object.entries(dag.rules)
    .filter(([, rule]) => rule.blockers.includes(meshName))
    .map(([name]) => name);

  const wrongParts = dependants.filter((d) => !assembledParts.includes(d));
  return { allowed: wrongParts.length === 0, wrongParts };
}

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────
const buildInitialTray = (machineId: string): string[] => {
  const dag = MACHINE_DAGS[machineId];
  if (!dag) return [];
  return [...dag.optimalSequence]; // all parts in tray initially
};

export const useReassemblyStore = create<ReassemblyState>((set, get) => ({
  currentMachineId: "single-cylinder-engine",
  mode: "guided",

  trayParts: buildInitialTray("single-cylinder-engine"),
  assembledParts: [],

  selectedPartMesh: null,
  snapTargetMesh: null,
  hintMesh: null,
  hintMessage: null,

  errorNotice: null,
  score: 0,
  wrongOrderCount: 0,
  hintsUsed: 0,
  startTime: Date.now(),
  isComplete: false,
  finalAttempt: null,

  setMachineId: (machineId: string) => {
    set({
      currentMachineId: machineId,
      trayParts: buildInitialTray(machineId),
      assembledParts: [],
      selectedPartMesh: null,
      snapTargetMesh: null,
      hintMesh: null,
      hintMessage: null,
      errorNotice: null,
      score: 0,
      wrongOrderCount: 0,
      hintsUsed: 0,
      startTime: Date.now(),
      isComplete: false,
      finalAttempt: null,
    });
  },

  setMode: (mode: ReassemblyMode) => {
    set({ mode });
  },

  startSession: () => {
    const { currentMachineId } = get();
    set({
      trayParts: buildInitialTray(currentMachineId),
      assembledParts: [],
      selectedPartMesh: null,
      snapTargetMesh: null,
      hintMesh: null,
      hintMessage: null,
      errorNotice: null,
      score: 0,
      wrongOrderCount: 0,
      hintsUsed: 0,
      startTime: Date.now(),
      isComplete: false,
      finalAttempt: null,
    });
  },

  selectPart: (meshName: string | null) => {
    set({ selectedPartMesh: meshName, hintMesh: null });
  },

  attemptInstallPart: (meshName: string): boolean => {
    const {
      currentMachineId,
      assembledParts,
      trayParts,
      score,
      wrongOrderCount,
      mode,
    } = get();

    if (assembledParts.includes(meshName)) return false;
    if (!trayParts.includes(meshName)) return false;

    const dag = MACHINE_DAGS[currentMachineId];
    const rule: DisassemblyRule | undefined = dag?.rules[meshName];

    const { allowed, wrongParts } = checkInstallRule(currentMachineId, meshName, assembledParts);

    if (!allowed) {
      const wrongNames = wrongParts
        .map((p) => dag?.rules[p]?.displayName || p)
        .join(", ");

      // In "test" mode (no hints), error message is briefer
      const message =
        mode === "test"
          ? `Cannot install ${rule?.displayName || meshName} yet. Install other parts first.`
          : `Install the ${wrongNames} before the ${rule?.displayName || meshName}.`;

      set({
        errorNotice: {
          partName: rule?.displayName || meshName,
          message,
          expectedFirst: wrongParts,
        },
        wrongOrderCount: wrongOrderCount + 1,
        score: Math.max(0, score - 25),
        hintMesh: mode !== "test" ? wrongParts[0] ?? null : null,
      });
      return false;
    }

    // ✅ Valid install
    const newAssembled = [...assembledParts, meshName];
    const newTray = trayParts.filter((p) => p !== meshName);
    const totalParts = Object.keys(dag?.rules || {}).length;
    const isComplete = newAssembled.length >= totalParts;

    let finalAttempt: AssemblyAttempt | null = null;
    if (isComplete) {
      const endTime = Date.now();
      const durationMs = endTime - get().startTime;
      const { hintsUsed, wrongOrderCount: woc } = get();
      const rawScore = newAssembled.length * 100 - woc * 25 - hintsUsed * 15;
      const computedScore = Math.max(0, rawScore);
      const accuracy = Math.round(
        (totalParts / (totalParts + woc + hintsUsed)) * 100
      );
      finalAttempt = {
        mode: get().mode,
        machineId: currentMachineId,
        startTime: get().startTime,
        endTime,
        durationMs,
        partsAssembled: newAssembled,
        wrongOrderPenalties: woc,
        hintPenalties: hintsUsed,
        score: computedScore,
        accuracy,
      };
    }

    set({
      assembledParts: newAssembled,
      trayParts: newTray,
      errorNotice: null,
      hintMesh: null,
      hintMessage: null,
      selectedPartMesh: null,
      snapTargetMesh: null,
      score: score + 100,
      isComplete,
      finalAttempt,
    });

    return true;
  },

  animateNextStep: (): boolean => {
    const { currentMachineId, assembledParts, mode } = get();
    if (mode === "test") return false; // Auto-step disabled in test mode

    const revSeq = reverseSequence(currentMachineId);
    const nextCandidate = revSeq.find((meshName) => {
      if (assembledParts.includes(meshName)) return false;
      const { allowed } = checkInstallRule(currentMachineId, meshName, assembledParts);
      return allowed;
    });

    if (nextCandidate) {
      const dag = MACHINE_DAGS[currentMachineId];
      const rule = dag?.rules[nextCandidate];
      set({
        hintMesh: nextCandidate,
        selectedPartMesh: nextCandidate,
        hintMessage: `AUTO-STEP: ${rule?.displayName ?? nextCandidate}. ${rule?.hint ?? ""}`,
        hintsUsed: get().hintsUsed + 1,
      });
      setTimeout(() => {
        get().attemptInstallPart(nextCandidate);
      }, 350);
      return true;
    }
    return false;
  },

  showNextStepHint: () => {
    const { currentMachineId, assembledParts, mode } = get();
    if (mode === "test") return; // No hints in test mode

    const revSeq = reverseSequence(currentMachineId);
    const nextCandidate = revSeq.find((meshName) => {
      if (assembledParts.includes(meshName)) return false;
      const { allowed } = checkInstallRule(currentMachineId, meshName, assembledParts);
      return allowed;
    });

    if (nextCandidate) {
      const dag = MACHINE_DAGS[currentMachineId];
      const rule = dag?.rules[nextCandidate];
      set({
        hintMesh: nextCandidate,
        selectedPartMesh: nextCandidate,
        hintMessage: `NEXT: ${rule?.displayName}. Tool: ${rule?.toolRequired}. ${rule?.hint}`,
        hintsUsed: get().hintsUsed + 1,
      });
    }
  },

  clearHint: () => set({ hintMesh: null, hintMessage: null }),
  clearErrorNotice: () => set({ errorNotice: null }),
  setSnapTargetMesh: (meshName: string | null) => set({ snapTargetMesh: meshName }),

  resetReassembly: () => {
    const { currentMachineId } = get();
    set({
      trayParts: buildInitialTray(currentMachineId),
      assembledParts: [],
      selectedPartMesh: null,
      snapTargetMesh: null,
      hintMesh: null,
      hintMessage: null,
      errorNotice: null,
      score: 0,
      wrongOrderCount: 0,
      hintsUsed: 0,
      startTime: Date.now(),
      isComplete: false,
      finalAttempt: null,
    });
  },
}));

// Export reverse helpers for use in components
export { getInstallableParts, reverseSequence, checkInstallRule };
