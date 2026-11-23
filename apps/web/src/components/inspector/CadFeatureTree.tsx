import React, { useState } from "react";
import { MachineMetadata, MachinePart } from "../../data/machinesData";
import { useInspectionStore } from "../../stores/useInspectionStore";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Focus,
  Box,
  Layers,
  Search,
  RotateCcw,
} from "lucide-react";

interface Props {
  metadata: MachineMetadata;
}

export const CadFeatureTree: React.FC<Props> = ({ metadata }) => {
  const {
    selectedPartMesh,
    hoveredPartMesh,
    hiddenParts,
    isolatedPart,
    selectPart,
    hoverPart,
    togglePartVisibility,
    showAllParts,
    setIsolatedPart,
  } = useInspectionStore();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredParts = metadata.parts.filter((p) =>
    p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.meshName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0d1017]/95 backdrop-blur-xl border-r border-white/10 text-white select-none w-80 min-w-[320px]">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-[#12151f]/80">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-cyan-400" />
            <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
              CAD Feature Tree
            </span>
          </div>
          <span className="text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded">
            {metadata.parts.length} Components
          </span>
        </div>
        <div className="text-[11px] text-gray-400 font-mono">
          Assembly Hierarchy & Kinematics
        </div>

        {/* Search Bar */}
        <div className="relative mt-3">
          <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Filter components or materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#171b26] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 transition-all font-mono"
          />
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#090b10] border-b border-white/5 text-[11px] text-gray-400">
        <span>Components List</span>
        <div className="flex items-center gap-2">
          {(hiddenParts.length > 0 || isolatedPart !== null) && (
            <button
              onClick={showAllParts}
              className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              title="Reset all parts visibility and clear isolation"
            >
              <RotateCcw size={10} />
              <span>Show All</span>
            </button>
          )}
        </div>
      </div>

      {/* Parts List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filteredParts.map((part) => {
          const isSelected = selectedPartMesh === part.meshName;
          const isHovered = hoveredPartMesh === part.meshName;
          const isHidden = hiddenParts.includes(part.meshName);
          const isIsolated = isolatedPart === part.meshName;

          return (
            <div
              key={part.id}
              onMouseEnter={() => hoverPart(part.meshName)}
              onMouseLeave={() => hoverPart(null)}
              onClick={() => selectPart(isSelected ? null : part.meshName)}
              className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer border transition-all ${
                isSelected
                  ? "bg-amber-500/15 border-amber-400/60 text-amber-200 shadow-md shadow-amber-500/10"
                  : isHovered
                  ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-200"
                  : "bg-white/[0.02] border-white/5 text-gray-300 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                <Box
                  size={14}
                  className={
                    isSelected
                      ? "text-amber-400 flex-shrink-0"
                      : isHovered
                      ? "text-cyan-400 flex-shrink-0"
                      : "text-gray-500 flex-shrink-0"
                  }
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-[11px] truncate leading-tight">
                    {part.displayName}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400 truncate">
                    {part.meshName}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Hide & Isolate */}
              <div
                className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Isolate Button */}
                <button
                  onClick={() => setIsolatedPart(isIsolated ? null : part.meshName)}
                  title={isIsolated ? "Clear isolation" : "Isolate component"}
                  className={`p-1 rounded hover:bg-white/10 transition-colors ${
                    isIsolated ? "text-cyan-400 bg-cyan-500/20" : "text-gray-400"
                  }`}
                >
                  <Focus size={13} />
                </button>

                {/* Visibility Toggle Button */}
                <button
                  onClick={() => togglePartVisibility(part.meshName)}
                  title={isHidden ? "Show component" : "Hide component"}
                  className={`p-1 rounded hover:bg-white/10 transition-colors ${
                    isHidden ? "text-red-400 bg-red-500/20" : "text-gray-400"
                  }`}
                >
                  {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
          );
        })}

        {filteredParts.length === 0 && (
          <div className="p-4 text-center text-xs text-gray-500 font-mono">
            No components match "{searchQuery}"
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-[#090b10] border-t border-white/5 text-[10px] text-gray-400 flex items-center justify-between font-mono">
        <span>Triangles: {metadata.totalTriangles.toLocaleString()}</span>
        <span className="text-cyan-300">{metadata.difficulty}</span>
      </div>
    </div>
  );
};
