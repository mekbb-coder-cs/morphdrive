import { create } from "zustand";

export type GameView = "GARAGE" | "DRIVING" | "LEADERBOARDS" | "INSPECT" | "DISASSEMBLE" | "REASSEMBLE" | "LEARN" | "DASHBOARD";

interface GameState {
  currentView: GameView;
  currentSpeedKmh: number;
  currentRpm: number;
  lapTimeMs: number;
  bestLapTimeMs: number | null;
  isDriving: boolean;

  setView: (view: GameView) => void;
  updateTelemetry: (speed: number, rpm: number) => void;
  setLapTime: (timeMs: number) => void;
  setBestLapTime: (timeMs: number) => void;
  setIsDriving: (active: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentView: "INSPECT",
  currentSpeedKmh: 0,
  currentRpm: 1000,
  lapTimeMs: 0,
  bestLapTimeMs: null,
  isDriving: false,

  setView: (view) => set({ currentView: view }),
  updateTelemetry: (speed, rpm) => set({ currentSpeedKmh: speed, currentRpm: rpm }),
  setLapTime: (timeMs) => set({ lapTimeMs: timeMs }),
  setBestLapTime: (timeMs) => set({ bestLapTimeMs: timeMs }),
  setIsDriving: (active) => set({ isDriving: active }),
}));