import React from "react";
import { Html, useProgress } from "@react-three/drei";
import { Cpu } from "lucide-react";

export const MachineLoadingScreen: React.FC = () => {
  const { progress, active, errors } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-[#0d1017]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10 min-w-[280px] pointer-events-none text-white select-none">
        <div className="relative flex items-center justify-center w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <Cpu className="text-cyan-400 animate-pulse" size={26} />
        </div>

        <div className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent mb-1">
          MorphDrive Core
        </div>
        <div className="text-[11px] font-mono text-gray-400 mb-3">
          Loading 3D Machine Assembly...
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800/80 rounded-full h-1.5 overflow-hidden border border-white/10">
          <div
            className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>

        <div className="flex justify-between w-full mt-2 text-[10px] font-mono text-cyan-300/80">
          <span>Draco Decompression</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </Html>
  );
};
