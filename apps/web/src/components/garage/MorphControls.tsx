import React from "react";
import { useVehicleStore } from "../../stores/useVehicleStore";
import { Sliders, Shield, Zap, Wind } from "lucide-react";
import { MorphMode } from "@morphdrive/shared";

export const MorphControls: React.FC = () => {
  const { activeMode, morphSettings, setMode, updateMorph } = useVehicleStore();

  const modes: { mode: MorphMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      mode: "STREET",
      label: "Street Mode",
      icon: <Zap size={16} />,
      desc: "Low ground clearance, max aero downforce",
    },
    {
      mode: "OFFROAD",
      label: "Off-Road Mode",
      icon: <Shield size={16} />,
      desc: "High suspension lift, wide stance",
    },
    {
      mode: "FLIGHT",
      label: "Flight Mode",
      icon: <Wind size={16} />,
      desc: "Deploys glider wings & jet thrusters",
    },
  ];

  return (
    <div className="bg-[#12141a]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-3 text-cyan-400 font-semibold text-sm tracking-wider uppercase">
        <Sliders size={16} />
        <span>Morph State Machine</span>
      </div>

      {/* Mode Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {modes.map((m) => (
          <button
            key={m.mode}
            onClick={() => setMode(m.mode)}
            className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-medium transition-all ${
              activeMode === m.mode
                ? "bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-[1.02]"
                : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <div className="mb-1 text-cyan-400">{m.icon}</div>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Fine-Tuning Sliders */}
      <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
        <div>
          <div className="flex justify-between text-gray-400 mb-1">
            <span>Suspension Ride Height</span>
            <span className="text-cyan-400 font-mono">{(morphSettings.suspensionHeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={morphSettings.suspensionHeight}
            onChange={(e) => updateMorph("suspensionHeight", parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
          />
        </div>

        <div>
          <div className="flex justify-between text-gray-400 mb-1">
            <span>Aero Wing Deployment</span>
            <span className="text-cyan-400 font-mono">{(morphSettings.aerodynamicWings * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={morphSettings.aerodynamicWings}
            onChange={(e) => updateMorph("aerodynamicWings", parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
          />
        </div>

        <div>
          <div className="flex justify-between text-gray-400 mb-1">
            <span>Widebody Stance</span>
            <span className="text-cyan-400 font-mono">{(morphSettings.widebodyFlare * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={morphSettings.widebodyFlare}
            onChange={(e) => updateMorph("widebodyFlare", parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
          />
        </div>

        <div>
          <div className="flex justify-between text-gray-400 mb-1">
            <span>Jet Thruster Extension</span>
            <span className="text-cyan-400 font-mono">{(morphSettings.thrusterExtend * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={morphSettings.thrusterExtend}
            onChange={(e) => updateMorph("thrusterExtend", parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
