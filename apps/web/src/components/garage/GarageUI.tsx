import React from "react";
import { useVehicleStore, GarageTab } from "../../stores/useVehicleStore";
import { useGameStore } from "../../stores/useGameStore";
import { STARTER_VEHICLES } from "@morphdrive/shared";
import { MorphControls } from "./MorphControls";
import { InspectionControls } from "./InspectionControls";
import { ColorPicker } from "./ColorPicker";
import { VehicleStatsMeter } from "./VehicleStatsMeter";
import { Play, RotateCcw, Save, Sliders, Split, Palette, Gauge, ExternalLink, Layers, BookOpen, Cpu, Wrench } from "lucide-react";

export const GarageUI: React.FC = () => {
  const { currentVehicle, selectVehicle, resetCustomization, activeTab, setActiveTab } = useVehicleStore();
  const { setView } = useGameStore();

  const tabs: { id: GarageTab; label: string; icon: React.ReactNode }[] = [
    { id: "MORPH", label: "Kinematics", icon: <Sliders size={14} /> },
    { id: "INSPECT", label: "Inspect & Explode", icon: <Split size={14} /> },
    { id: "PAINT", label: "Materials", icon: <Palette size={14} /> },
    { id: "SPECS", label: "Telemetry", icon: <Gauge size={14} /> },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      {/* Top Header */}
      <div className="pointer-events-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col bg-[#12141a]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent">
                MORPHDRIVE
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-1.5 py-0.5 rounded border border-cyan-500/30">
                EDU-LAB
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              3D Mechanism Kinematics & Morphing Platform
            </span>
          </div>

          {/* Machine Archetype Switcher */}
          <div className="flex gap-2">
            {STARTER_VEHICLES.map((v) => (
              <button
                key={v.id}
                onClick={() => selectVehicle(v.id)}
                className={`flex flex-col text-left px-3 py-1.5 rounded-lg border transition-all ${currentVehicle.id === v.id
                  ? "bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-[#12141a]/80 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
              >
                <span className="text-xs font-bold leading-tight">{v.name}</span>
                <span className="text-[10px] text-cyan-300/80 font-mono">{v.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Switch to Inspect 3D Mechanism View */}
          <button
            onClick={() => setView("INSPECT")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/50 text-cyan-300 hover:brightness-125 transition-all shadow-md shadow-cyan-500/20"
            title="Open Interactive 3D Machine Inspection Lab"
          >
            <Cpu size={14} />
            <span>Inspect Machines</span>
          </button>

          {/* Switch to Disassembly Lab */}
          <button
            onClick={() => setView("DISASSEMBLE")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 text-emerald-300 hover:brightness-125 transition-all shadow-md shadow-emerald-500/20"
            title="Open Interactive Disassembly Lab"
          >
            <Wrench size={14} />
            <span>Disassembly Lab</span>
          </button>

          {/* External Navigation Shortcuts */}
          <a
            href="/prototype.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#12141a]/90 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-white transition-all shadow-md"
            title="Open Interactive Clickable UI Prototype"
          >
            <Layers size={14} />
            <span>Interactive Prototype</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>

          <a
            href="http://localhost:4000/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#12141a]/90 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white transition-all shadow-md"
            title="Open Swagger OpenAPI Documentation"
          >
            <BookOpen size={14} />
            <span>Swagger API</span>
            <ExternalLink size={12} className="opacity-70" />
          </a>

          <button
            onClick={resetCustomization}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#12141a]/80 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset Assembly</span>
          </button>

          <button
            onClick={() => alert(`Preset ${currentVehicle.name} saved to local session!`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-600/50 transition-colors"
          >
            <Save size={14} />
            <span>Save State</span>
          </button>

          <button
            onClick={() => setView("DRIVING")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-400 to-teal-400 text-black shadow-lg shadow-cyan-400/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Play size={15} fill="currentColor" />
            <span>Dynamic Test Track</span>
          </button>
        </div>
      </div>

      {/* Floating Side Panel: Customization Trays */}
      <div className="pointer-events-auto self-end w-88 max-w-sm space-y-3 max-h-[82vh] flex flex-col justify-end">
        {/* Machine Principle Callout Card */}
        <div className="bg-[#12141a]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-lg">
          <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold mb-0.5">
            Mechanism Focus
          </div>
          <div className="text-xs font-semibold text-white">
            {currentVehicle.mechanismPrinciple}
          </div>
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {currentVehicle.description}
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#12141a]/90 backdrop-blur-md border border-white/10 rounded-xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-semibold transition-all ${activeTab === t.id
                ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <div className="mb-0.5">{t.icon}</div>
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div className="overflow-y-auto max-h-[50vh] pr-1">
          {activeTab === "MORPH" && <MorphControls />}
          {activeTab === "INSPECT" && <InspectionControls />}
          {activeTab === "PAINT" && <ColorPicker />}
          {activeTab === "SPECS" && <VehicleStatsMeter />}
        </div>
      </div>

      {/* Bottom Educational Hint Bar */}
      <div className="pointer-events-auto flex items-center justify-between text-xs text-gray-400 bg-[#12141a]/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/5 w-fit">
        <span>Orbit: Left-click + drag • Pan: Right-click + drag • Zoom: Scroll wheel</span>
      </div>
    </div>
  );
};
