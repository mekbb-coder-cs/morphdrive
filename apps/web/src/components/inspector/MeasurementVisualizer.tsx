import React from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useInspectionStore } from "../../stores/useInspectionStore";
import { Ruler, X } from "lucide-react";

export const MeasurementVisualizer: React.FC = () => {
  const { measurementPoints, clearMeasurement, measurementActive } = useInspectionStore();

  if (!measurementActive && measurementPoints.length === 0) return null;

  const p1 = measurementPoints[0];
  const p2 = measurementPoints[1];

  let distanceMeters = 0;
  let midpoint: [number, number, number] = [0, 0, 0];
  let delta: [number, number, number] = [0, 0, 0];

  if (p1 && p2) {
    const v1 = new THREE.Vector3(...p1);
    const v2 = new THREE.Vector3(...p2);
    distanceMeters = v1.distanceTo(v2);
    midpoint = [
      (p1[0] + p2[0]) / 2,
      (p1[1] + p2[1]) / 2,
      (p1[2] + p2[2]) / 2,
    ];
    delta = [
      Math.abs(p2[0] - p1[0]),
      Math.abs(p2[1] - p1[1]),
      Math.abs(p2[2] - p1[2]),
    ];
  }

  return (
    <group>
      {/* Point A */}
      {p1 && (
        <group position={p1}>
          <mesh>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          <Html distanceFactor={10} position={[0, 0.05, 0]} center>
            <div className="bg-[#0b0e14]/90 border border-cyan-400 text-cyan-300 text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
              Point A
            </div>
          </Html>
        </group>
      )}

      {/* Point B */}
      {p2 && (
        <group position={p2}>
          <mesh>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color="#f5a623" />
          </mesh>
          <Html distanceFactor={10} position={[0, 0.05, 0]} center>
            <div className="bg-[#0b0e14]/90 border border-amber-400 text-amber-300 text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
              Point B
            </div>
          </Html>
        </group>
      )}

      {/* Connecting Dimension Line */}
      {p1 && p2 && (
        <>
          {/* 3D Line geometry using primitive line */}
          <primitive
            object={
              new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(...p1),
                  new THREE.Vector3(...p2),
                ]),
                new THREE.LineDashedMaterial({
                  color: 0x00f0ff,
                  dashSize: 0.05,
                  gapSize: 0.025,
                  linewidth: 2,
                })
              )
            }
          />

          {/* Floating Measurement Badge */}
          <Html position={midpoint} center distanceFactor={10}>
            <div className="bg-[#0d1017]/95 backdrop-blur-md border border-cyan-400/60 rounded-lg p-2 shadow-2xl text-white font-mono min-w-[150px] pointer-events-auto">
              <div className="flex items-center justify-between pb-1 border-b border-white/10 mb-1">
                <span className="flex items-center gap-1 text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                  <Ruler size={11} />
                  <span>Caliper</span>
                </span>
                <button
                  onClick={clearMeasurement}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="text-sm font-bold text-cyan-400 leading-tight">
                {(distanceMeters * 1000).toFixed(1)} mm
              </div>
              <div className="text-[10px] text-gray-400">
                {(distanceMeters * 100).toFixed(2)} cm • {(distanceMeters * 39.37).toFixed(2)} in
              </div>

              <div className="mt-1 pt-1 border-t border-white/5 text-[9px] text-gray-400 grid grid-cols-3 gap-1">
                <span>ΔX: {(delta[0] * 1000).toFixed(0)}</span>
                <span>ΔY: {(delta[1] * 1000).toFixed(0)}</span>
                <span>ΔZ: {(delta[2] * 1000).toFixed(0)}</span>
              </div>
            </div>
          </Html>
        </>
      )}
    </group>
  );
};
