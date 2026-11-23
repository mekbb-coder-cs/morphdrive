import React from "react";
import { useInspectionStore } from "../../stores/useInspectionStore";
import { getMachineById } from "../../data/machinesData";
import { MachineSelectorHeader } from "./MachineSelectorHeader";
import { CadFeatureTree } from "./CadFeatureTree";
import { MachineInspectorCanvas } from "./MachineInspectorCanvas";
import { PartInfoPanel } from "./PartInfoPanel";
import { InspectionToolbar } from "./InspectionToolbar";
import { Ruler, Info } from "lucide-react";

export const MachineInspectionPage: React.FC = () => {
  const { currentMachineId, sidebarOpen, measurementActive, measurementPoints } = useInspectionStore();
  const metadata = getMachineById(currentMachineId);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#08090d] text-white flex flex-col select-none">
      {/* Top Header */}
      <MachineSelectorHeader metadata={metadata} />

      {/* Main Workspace */}
      <div className="relative flex-1 flex pt-16 overflow-hidden">
        {/* CAD Feature Tree Drawer */}
        {sidebarOpen && (
          <div className="relative z-10 h-full animate-in slide-in-from-left-6 duration-200">
            <CadFeatureTree metadata={metadata} />
          </div>
        )}

        {/* 3D Canvas Viewport */}
        <div className="relative flex-1 h-full">
          <MachineInspectorCanvas metadata={metadata} />

          {/* Measurement Caliper Guide HUD */}
          {measurementActive && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0d1017]/95 border border-amber-400/60 rounded-xl px-4 py-2 shadow-2xl flex items-center gap-2.5 z-20 pointer-events-none">
              <Ruler size={16} className="text-amber-400 animate-pulse" />
              <div className="text-xs font-mono">
                {measurementPoints.length === 0 && (
                  <span className="text-amber-300">
                    Caliper Active: Click <strong className="text-white">Point A</strong> on any component mesh.
                  </span>
                )}
                {measurementPoints.length === 1 && (
                  <span className="text-cyan-300">
                    Point A placed! Click <strong className="text-white">Point B</strong> to measure distance.
                  </span>
                )}
                {measurementPoints.length === 2 && (
                  <span className="text-emerald-300">
                    Distance measured! Click on mesh to reset origin and measure new points.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Part Detailed Info Panel (Floating on right) */}
          <PartInfoPanel metadata={metadata} />

          {/* Bottom Floating Inspection Controls */}
          <InspectionToolbar />
        </div>
      </div>
    </div>
  );
};
