import React from "react";
import { useVehicleStore } from "../../stores/useVehicleStore";
import { useGameStore } from "../../stores/useGameStore";
import { STARTER_VEHICLES } from "@morphdrive/shared";
import { MorphControls } from "./MorphControls";
import { ColorPicker } from "./ColorPicker";
import { VehicleStatsMeter } from "./VehicleStatsMeter";
import { Play, RotateCcw, Save } from "lucide-react";

export const GarageUI: React.FC = () => {
  const { currentVehicle, selectVehicle, resetCustomization } = useVehicleStore();
  const { setView } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      {/* Top Header */}
      <div className="pointer-events-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#12141a]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <span className="font-black text-xl tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent">
              MORPHDRIVE
            </span>
            <span className="text-xs bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-500/30">
              v1.0-alpha
            </span>
          </div>

          {/* Vehicle Switcher */}
          <div className="flex gap-2">
            {STARTER_VEHICLES.map((v) => (
              <button
                key={v.id}
                onClick={() => selectVehicle(v.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                  currentVehicle.id === v.id
                    ? "bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-[#12141a]/80 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetCustomization}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#12141a]/80 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            onClick={() => alert("Vehicle loadout saved to local garage!")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-600/50 transition-colors"
          >
            <Save size={14} />
            <span>Save Build</span>
          </button>

          <button
            onClick={() => setView("DRIVING")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-cyan-400 to-teal-400 text-black shadow-lg shadow-cyan-400/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Play size={16} fill="currentColor" />
            <span>Enter Proving Ground</span>
          </button>
        </div>
      </div>

      {/* Floating Side Panel: Customization Trays */}
      <div className="pointer-events-auto self-end w-80 space-y-4 max-h-[82vh] overflow-y-auto pr-1">
        <MorphControls />
        <ColorPicker />
        <VehicleStatsMeter />
      </div>

      {/* Bottom Hint Bar */}
      <div className="pointer-events-auto flex items-center justify-between text-xs text-gray-400 bg-[#12141a]/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/5 w-fit">
        <span>Left-click + drag to rotate • Scroll to zoom • Right-click to pan</span>
      </div>
    </div>
  );
};
