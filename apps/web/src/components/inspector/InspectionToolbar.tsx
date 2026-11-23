import React from "react";
import { useInspectionStore, RenderMode } from "../../stores/useInspectionStore";
import {
  Split,
  Box,
  Grid,
  Ghost,
  Ruler,
  RotateCcw,
  Camera,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const InspectionToolbar: React.FC = () => {
  const {
    renderMode,
    setRenderMode,
    explodedProgress,
    setExplodedProgress,
    measurementActive,
    setMeasurementActive,
    clearMeasurement,
    measurementPoints,
    resetCamera,
    sidebarOpen,
    toggleSidebar,
    resetAllInspection,
  } = useInspectionStore();

  const renderModes: { id: RenderMode; label: string; icon: React.ReactNode }[] = [
    { id: "SHADED", label: "Shaded", icon: <Box size={14} /> },
    { id: "WIREFRAME", label: "Wireframe", icon: <Grid size={14} /> },
    { id: "XRAY", label: "X-Ray", icon: <Ghost size={14} /> },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 rounded-2xl bg-[#0d1017]/90 backdrop-blur-xl border border-white/10 shadow-2xl z-20 text-white select-none">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
          sidebarOpen
            ? "bg-cyan-500/15 border-cyan-400 text-cyan-300"
            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
        }`}
        title="Toggle CAD Feature Tree"
      >
        <Layers size={14} />
        <span className="hidden sm:inline">CAD Tree</span>
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div className="w-px h-6 bg-white/10" />

      {/* Render Mode Switcher */}
      <div className="flex bg-[#161a25] p-1 rounded-xl border border-white/5">
        {renderModes.map((m) => (
          <button
            key={m.id}
            onClick={() => setRenderMode(m.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              renderMode === m.id
                ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {m.icon}
            <span className="hidden md:inline">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Exploded View Slider */}
      <div className="flex items-center gap-3 px-2 py-1 bg-[#161a25] rounded-xl border border-white/5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
          <Split size={15} />
          <span className="hidden md:inline">Exploded View</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={explodedProgress}
            onChange={(e) => setExplodedProgress(parseFloat(e.target.value))}
            className="w-24 sm:w-36 h-1.5 accent-cyan-400 cursor-pointer bg-gray-700 rounded-lg"
          />
          <span className="text-xs font-mono text-cyan-300 font-bold w-9 text-right">
            {(explodedProgress * 100).toFixed(0)}%
          </span>
        </div>

        {explodedProgress > 0 && (
          <button
            onClick={() => setExplodedProgress(0)}
            className="text-[10px] text-gray-400 hover:text-cyan-300 font-mono"
            title="Assemble (0%)"
          >
            Assemble
          </button>
        )}
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* 3D Measurement Caliper Tool */}
      <button
        onClick={() => {
          if (measurementActive) {
            setMeasurementActive(false);
            clearMeasurement();
          } else {
            setMeasurementActive(true);
          }
        }}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
          measurementActive
            ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10"
            : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
        }`}
        title={measurementActive ? "Caliper Active - Click 2 points on 3D meshes" : "Activate Caliper Tool"}
      >
        <Ruler size={15} />
        <span className="hidden sm:inline">Caliper</span>
        {measurementActive && (
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
        )}
      </button>

      {/* Recenter Camera */}
      <button
        onClick={resetCamera}
        className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        title="Reset Camera View to Origin"
      >
        <Camera size={16} />
      </button>

      {/* Reset All */}
      <button
        onClick={resetAllInspection}
        className="p-2 rounded-xl text-gray-400 hover:text-cyan-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        title="Reset All Inspection Settings"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
};
