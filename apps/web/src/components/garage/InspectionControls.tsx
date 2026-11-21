import React from "react";
import { useVehicleStore, ClippingAxis } from "../../stores/useVehicleStore";
import { Split, Scissors, Eye, RotateCcw } from "lucide-react";

export const InspectionControls: React.FC = () => {
  const {
    explodedProgress,
    setExplodedProgress,
    crossSectionEnabled,
    setCrossSectionEnabled,
    crossSectionAxis,
    setCrossSectionAxis,
    crossSectionOffset,
    setCrossSectionOffset,
    isolatedComponent,
    setIsolatedComponent,
  } = useVehicleStore();

  const components = [
    { id: "all", label: "Show All" },
    { id: "chassis", label: "Chassis Hull" },
    { id: "canopy", label: "Cockpit Glass" },
    { id: "wings", label: "Morph Glider Wings" },
    { id: "thruster", label: "Vector Jet Nozzle" },
    { id: "wheels", label: "Wheel Hubs & Actuators" },
  ];

  const axes: { axis: ClippingAxis; label: string; desc: string }[] = [
    { axis: "X", label: "Sagittal (X)", desc: "Left/Right Cross-Section" },
    { axis: "Y", label: "Axial (Y)", desc: "Top/Bottom Clearance" },
    { axis: "Z", label: "Coronal (Z)", desc: "Front/Rear Longitudinal" },
  ];

  return (
    <div className="bg-[#12141a]/85 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl space-y-4">
      {/* FR-05 Exploded View Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase">
            <Split size={15} />
            <span>Exploded View Disassembly</span>
          </div>
          {explodedProgress > 0 && (
            <button
              onClick={() => setExplodedProgress(0)}
              className="text-[10px] text-gray-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <RotateCcw size={10} />
              <span>Assemble</span>
            </button>
          )}
        </div>

        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Displacement Vector</span>
          <span className="text-cyan-300 font-mono">{(explodedProgress * 100).toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={explodedProgress}
          onChange={(e) => setExplodedProgress(parseFloat(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
          <span>Assembled (0%)</span>
          <span>Full Disassembly (100%)</span>
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* FR-08 Cross-Sectional Planar Slicing */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase">
            <Scissors size={15} />
            <span>Cross-Section Slicing Plane</span>
          </div>
          <button
            onClick={() => setCrossSectionEnabled(!crossSectionEnabled)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border transition-all ${
              crossSectionEnabled
                ? "bg-red-500/20 border-red-500 text-red-300"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {crossSectionEnabled ? "ACTIVE" : "DISABLED"}
          </button>
        </div>

        {crossSectionEnabled && (
          <div className="space-y-2.5 pt-1 animate-fadeIn">
            {/* Axis Selector */}
            <div className="grid grid-cols-3 gap-1.5">
              {axes.map((a) => (
                <button
                  key={a.axis}
                  onClick={() => setCrossSectionAxis(a.axis)}
                  className={`py-1.5 px-2 rounded border text-[11px] font-medium transition-all ${
                    crossSectionAxis === a.axis
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                      : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>

            {/* Clipping Plane Depth Slider */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Cutting Plane Offset</span>
                <span className="text-cyan-300 font-mono">{crossSectionOffset.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min={-2.5}
                max={2.5}
                step={0.05}
                value={crossSectionOffset}
                onChange={(e) => setCrossSectionOffset(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-white/10" />

      {/* Component Hierarchy & Isolation */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase">
          <Eye size={15} />
          <span>Isolate Sub-Assembly</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {components.map((c) => {
            const isSelected = (c.id === "all" && !isolatedComponent) || isolatedComponent === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setIsolatedComponent(c.id === "all" ? null : c.id)}
                className={`py-1.5 px-2 rounded border text-[11px] text-left truncate transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-400 text-white font-medium"
                    : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
