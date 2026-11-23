import React from "react";
import { useInspectionStore } from "../../stores/useInspectionStore";
import { MachineMetadata } from "../../data/machinesData";
import {
  X,
  Focus,
  EyeOff,
  Ruler,
  Info,
  Layers,
  Scale,
  Compass,
  Zap,
  Cpu,
} from "lucide-react";

interface Props {
  metadata: MachineMetadata;
}

export const PartInfoPanel: React.FC<Props> = ({ metadata }) => {
  const {
    selectedPartMesh,
    isolatedPart,
    selectPart,
    setIsolatedPart,
    togglePartVisibility,
    setMeasurementActive,
  } = useInspectionStore();

  if (!selectedPartMesh) return null;

  const part = metadata.parts.find(
    (p) => p.meshName === selectedPartMesh || p.id === selectedPartMesh
  );

  if (!part) return null;

  const isIsolated = isolatedPart === part.meshName;
  const offset = metadata.explodedView[part.meshName] || [0, 0, 0];

  return (
    <div className="absolute right-6 top-20 w-88 max-w-sm bg-[#0d1017]/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-5 shadow-2xl text-white select-none z-20 animate-in fade-in slide-in-from-right-6 duration-200">
      {/* Top Header */}
      <div className="flex items-start justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Cpu size={18} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-amber-400/90 uppercase tracking-wider font-semibold">
              Selected Component
            </div>
            <h3 className="text-sm font-bold text-white leading-tight">
              {part.displayName}
            </h3>
            <span className="text-[10px] font-mono text-gray-400">
              {part.meshName}
            </span>
          </div>
        </div>

        <button
          onClick={() => selectPart(null)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Deselect component"
        >
          <X size={16} />
        </button>
      </div>

      {/* Engineering Specs */}
      <div className="my-4 space-y-3">
        {/* Function Description */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            <Info size={12} />
            <span>Kinematic Function</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            {part.function}
          </p>
        </div>

        {/* Spec Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
              <Layers size={11} className="text-purple-400" />
              <span>Material</span>
            </div>
            <div className="font-semibold text-white text-[11px] leading-tight">
              {part.material}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
              <Scale size={11} className="text-emerald-400" />
              <span>Component Mass</span>
            </div>
            <div className="font-semibold text-white text-[11px] leading-tight">
              {part.massKg} kg
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
              <Zap size={11} className="text-amber-400" />
              <span>Motion Type</span>
            </div>
            <div className="font-semibold text-amber-300 text-[11px] leading-tight font-mono">
              {part.kinematicType}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
              <Compass size={11} className="text-cyan-400" />
              <span>Pivot Origin</span>
            </div>
            <div className="font-mono text-cyan-300 text-[10px] leading-tight">
              [{part.pivotOrigin.join(", ")}]
            </div>
          </div>
        </div>

        {/* Exploded Offset */}
        <div className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs font-mono">
          <span className="text-[10px] text-gray-400">Displacement Offset</span>
          <span className="text-cyan-400 text-[11px]">
            [{offset[0]}, {offset[1]}, {offset[2]}] m
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-2">
        <button
          onClick={() => setIsolatedPart(isIsolated ? null : part.meshName)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-bold border transition-all ${
            isIsolated
              ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20"
              : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Focus size={15} className="mb-1" />
          <span>{isIsolated ? "Isolated" : "Isolate"}</span>
        </button>

        <button
          onClick={() => {
            togglePartVisibility(part.meshName);
            selectPart(null);
          }}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-bold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-red-300 transition-all"
        >
          <EyeOff size={15} className="mb-1" />
          <span>Hide Part</span>
        </button>

        <button
          onClick={() => setMeasurementActive(true)}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-bold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-cyan-300 transition-all"
        >
          <Ruler size={15} className="mb-1" />
          <span>Measure</span>
        </button>
      </div>
    </div>
  );
};
