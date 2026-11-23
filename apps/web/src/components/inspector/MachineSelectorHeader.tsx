import React from "react";
import { useInspectionStore } from "../../stores/useInspectionStore";
import { useDisassemblyStore } from "../../stores/useDisassemblyStore";
import { MACHINES_LIST, MachineMetadata } from "../../data/machinesData";
import { useGameStore } from "../../stores/useGameStore";
import {
  Cpu,
  Layers,
  BookOpen,
  ExternalLink,
  Car,
  ChevronDown,
  Sparkles,
  Wrench,
} from "lucide-react";

interface Props {
  metadata: MachineMetadata;
}

export const MachineSelectorHeader: React.FC<Props> = ({ metadata }) => {
  const { currentMachineId, setMachineId } = useInspectionStore();
  const { setView } = useGameStore();

  return (
    <header className="absolute top-0 left-0 right-0 h-16 bg-[#0a0c12]/90 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between z-30 select-none text-white">
      {/* Brand & Mode */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-500/10">
            <Cpu size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
                MORPHDRIVE
              </span>
              <span className="text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded font-bold">
                INSPECT 3D
              </span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium">
              Interactive 3D Mechanism Laboratory
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10 hidden md:block" />

        {/* Machine Tabs */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#12151f] p-1 rounded-xl border border-white/5">
          {MACHINES_LIST.map((m) => {
            const isActive = m.machineId === currentMachineId;
            return (
              <button
                key={m.machineId}
                onClick={() => setMachineId(m.machineId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-cyan-500/20 border border-cyan-400/60 text-white shadow-md shadow-cyan-500/15"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <span>{m.name.split(" ")[0]}</span>
                <span className="text-[10px] opacity-60 font-mono hidden xl:inline">
                  ({m.parts.length})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile / Small screen Machine Dropdown */}
      <div className="lg:hidden flex-1 max-w-[200px] mx-2">
        <select
          value={currentMachineId}
          onChange={(e) => setMachineId(e.target.value)}
          className="w-full bg-[#12151f] border border-white/10 text-xs rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-400 font-mono"
        >
          {MACHINES_LIST.map((m) => (
            <option key={m.machineId} value={m.machineId}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right Navigation Controls */}
      <div className="flex items-center gap-2.5">
        {/* Switch to Disassembly Lab */}
        <button
          onClick={() => {
            useDisassemblyStore.getState().setMachineId(currentMachineId);
            setView("DISASSEMBLE");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 transition-all shadow-sm"
          title="Switch to Interactive Disassembly Mode"
        >
          <Wrench size={14} />
          <span className="hidden sm:inline">Disassembly Lab</span>
        </button>

        {/* Switch to Vehicle Garage Mode */}
        <button
          onClick={() => setView("GARAGE")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#12151f] border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          title="Switch to Morphing Vehicle Garage"
        >
          <Car size={14} className="text-cyan-400" />
          <span className="hidden sm:inline">Vehicle Garage</span>
        </button>

        {/* Prototype Link */}
        <a
          href="/prototype.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#12151f] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-white transition-all shadow-sm"
          title="Open Clickable Educational Prototype"
        >
          <Layers size={14} />
          <span className="hidden md:inline">Prototype</span>
          <ExternalLink size={11} className="opacity-70" />
        </a>

        {/* Swagger API Link */}
        <a
          href="http://localhost:4000/api-docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#12151f] border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white transition-all shadow-sm"
          title="Open Swagger REST API Docs"
        >
          <BookOpen size={14} />
          <span className="hidden md:inline">API</span>
          <ExternalLink size={11} className="opacity-70" />
        </a>
      </div>
    </header>
  );
};
