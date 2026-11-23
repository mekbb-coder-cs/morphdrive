import React from "react";
import { useDisassemblyStore } from "../../stores/useDisassemblyStore";
import { useInspectionStore } from "../../stores/useInspectionStore";
import { getMachineById, MACHINES_LIST } from "../../data/machinesData";
import { useGameStore } from "../../stores/useGameStore";
import { DisassemblyCanvas } from "./DisassemblyCanvas";
import { DisassemblyWorkbench } from "./DisassemblyWorkbench";
import {
  Wrench,
  Cpu,
  Layers,
  BookOpen,
  ExternalLink,
  Car,
  Eye,
} from "lucide-react";

export const DisassemblyPage: React.FC = () => {
  const { currentMachineId, setMachineId } = useDisassemblyStore();
  const { setView } = useGameStore();
  const metadata = getMachineById(currentMachineId);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#08090d] text-white flex flex-col select-none">
      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 h-16 bg-[#0a0c12]/90 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between z-30 select-none text-white">
        {/* Brand & Mode */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 text-emerald-300 shadow-lg shadow-emerald-500/10">
              <Wrench size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  MORPHDRIVE
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                  DISASSEMBLY LAB
                </span>
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                DAG Dependency Validation & Extraction
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
                      ? "bg-emerald-500/20 border border-emerald-400/60 text-white shadow-md shadow-emerald-500/15"
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

        {/* Small Screen Dropdown */}
        <div className="lg:hidden flex-1 max-w-[180px] mx-2">
          <select
            value={currentMachineId}
            onChange={(e) => setMachineId(e.target.value)}
            className="w-full bg-[#12151f] border border-white/10 text-xs rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-400 font-mono"
          >
            {MACHINES_LIST.map((m) => (
              <option key={m.machineId} value={m.machineId}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2">
          {/* Switch to Inspect Mode */}
          <button
            onClick={() => {
              useInspectionStore.getState().setMachineId(currentMachineId);
              setView("INSPECT");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#12151f] border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-white transition-all shadow-sm"
            title="Switch to 3D Inspection Mode"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Inspect Mode</span>
          </button>

          {/* Switch to Vehicle Garage */}
          <button
            onClick={() => setView("GARAGE")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#12151f] border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            title="Switch to Vehicle Garage"
          >
            <Car size={14} />
            <span className="hidden sm:inline">Garage</span>
          </button>

          {/* Prototype Link */}
          <a
            href="/prototype.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#12151f] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-white transition-all"
            title="Open Clickable Prototype"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#12151f] border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white transition-all"
            title="Open Swagger API"
          >
            <BookOpen size={14} />
            <span className="hidden md:inline">API</span>
            <ExternalLink size={11} className="opacity-70" />
          </a>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="relative flex-1 pt-16 overflow-hidden">
        <DisassemblyCanvas metadata={metadata} />
        <DisassemblyWorkbench metadata={metadata} />
      </div>
    </div>
  );
};
