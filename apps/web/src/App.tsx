import React from "react";
import { GarageCanvas } from "./components/3d/GarageCanvas";
import { GarageUI } from "./components/garage/GarageUI";
import { useGameStore } from "./stores/useGameStore";
import { ArrowLeft } from "lucide-react";

export const App: React.FC = () => {
  const { currentView, setView } = useGameStore();

  return (
    <div className="w-screen h-screen relative bg-[#0a0b0e] overflow-hidden select-none">
      {/* 3D Scene View */}
      <GarageCanvas />

      {/* View UI Switcher */}
      {currentView === "GARAGE" && <GarageUI />}

      {currentView === "DRIVING" && (
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
          <div className="pointer-events-auto flex items-center justify-between">
            <button
              onClick={() => setView("GARAGE")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[#12141a]/90 backdrop-blur-md border border-white/10 text-white hover:bg-white/15 transition-all shadow-xl"
            >
              <ArrowLeft size={16} />
              <span>Return to Garage</span>
            </button>
            <div className="bg-[#12141a]/90 backdrop-blur-md px-4 py-2 rounded-lg border border-cyan-400/40 text-cyan-300 font-mono text-xs shadow-lg shadow-cyan-500/20">
              Proving Ground Track • Interactive Sandbox
            </div>
          </div>

          <div className="self-center bg-[#12141a]/90 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 text-center space-y-1">
            <div className="text-sm font-semibold text-white">Driving Mechanics Controller Active</div>
            <div className="text-xs text-gray-400">
              W / A / S / D to Drive & Steer • Shift to Cycle Morph States • Space for Handbrake
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
