import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useInspectionStore } from "../../stores/useInspectionStore";
import { MachineMetadata } from "../../data/machinesData";
import { MachineModelRenderer } from "./MachineModelRenderer";
import { MachineLoadingScreen } from "./MachineLoadingScreen";
import { MeasurementVisualizer } from "./MeasurementVisualizer";

interface Props {
  metadata: MachineMetadata;
}

const CameraController: React.FC = () => {
  const controlsRef = useRef<any>(null);
  const cameraResetSeq = useInspectionStore((s) => s.cameraResetSeq);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [cameraResetSeq]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      minDistance={0.4}
      maxDistance={12}
      maxPolarAngle={Math.PI / 2 + 0.15}
    />
  );
};

export const MachineInspectorCanvas: React.FC<Props> = ({ metadata }) => {
  const { hoveredPartMesh, selectedPartMesh } = useInspectionStore();

  const hoveredPart = metadata.parts.find(
    (p) => p.meshName === hoveredPartMesh || p.id === hoveredPartMesh
  );

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-radial from-[#12151e] to-[#08090d]">
      <Canvas
        shadows
        camera={{ position: [2.2, 1.8, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <CameraController />

        {/* Studio & Key Lighting */}
        <ambientLight intensity={0.65} />
        <hemisphereLight args={["#cceeff", "#223344", 0.45]} />
        <directionalLight
          position={[6, 9, 6]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
          shadow-camera-near={0.5}
          shadow-camera-far={25}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.55} color="#66bbee" />
        <directionalLight position={[0, -4, -4]} intensity={0.3} color="#ffaa55" />

        <Suspense fallback={<MachineLoadingScreen />}>
          <Environment preset="city" />

          <Center position={[0, 0, 0]}>
            <MachineModelRenderer metadata={metadata} />
            <MeasurementVisualizer />
          </Center>

          {/* Contact Shadows on Floor */}
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.7}
            scale={8}
            blur={2.4}
            far={4}
            color="#000000"
          />
        </Suspense>

        {/* Engineering Floor Grid */}
        <gridHelper args={[12, 24, "#00f0ff", "#182030"]} position={[0, -1.201, 0]} />
      </Canvas>

      {/* Hover HUD Pill Overlay */}
      {hoveredPart && !selectedPartMesh && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d1017]/90 border border-cyan-400/50 backdrop-blur-md shadow-lg shadow-cyan-500/10">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">
            {hoveredPart.displayName}
          </span>
          <span className="text-[10px] font-mono text-cyan-300/80 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
            {hoveredPart.kinematicType}
          </span>
        </div>
      )}
    </div>
  );
};
