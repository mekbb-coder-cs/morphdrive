import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, ContactShadows, Environment, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { MachineMetadata } from "../../data/machinesData";
import { DisassemblyModelRenderer } from "./DisassemblyModelRenderer";
import { MachineLoadingScreen } from "../inspector/MachineLoadingScreen";

interface Props {
  metadata: MachineMetadata;
}

export const DisassemblyCanvas: React.FC<Props> = ({ metadata }) => {
  const orbitControlsRef = useRef<any>(null);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-radial from-[#12151f] to-[#08090d]">
      <Canvas
        shadows
        camera={{ position: [3.2, 2.2, 3.8], fov: 46 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <OrbitControls
          ref={orbitControlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={0.5}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />

        {/* Lighting Setup */}
        <ambientLight intensity={0.65} />
        <hemisphereLight args={["#cceeff", "#223344", 0.45]} />
        <directionalLight
          position={[6, 9, 6]}
          intensity={1.7}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#66bbee" />
        <directionalLight position={[0, -4, -4]} intensity={0.3} color="#ffaa55" />

        <Suspense fallback={<MachineLoadingScreen />}>
          <Environment preset="city" />

          {/* Assembly Rig Area (Left/Center) */}
          <group position={[-0.5, 0, 0]}>
            <DisassemblyModelRenderer
              metadata={metadata}
              orbitControlsRef={orbitControlsRef}
            />
          </group>

          {/* Workbench Tray Base (Right) */}
          <group position={[2.0, -1.18, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[1.6, 0.04, 2.6]} />
              <meshStandardMaterial
                color="#141822"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>

            {/* Tray Perimeter Lip */}
            <mesh position={[0, 0.04, 1.3]}>
              <boxGeometry args={[1.64, 0.06, 0.04]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.04, -1.3]}>
              <boxGeometry args={[1.64, 0.06, 0.04]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.8, 0.04, 0]}>
              <boxGeometry args={[0.04, 0.06, 2.64]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[-0.8, 0.04, 0]}>
              <boxGeometry args={[0.04, 0.06, 2.64]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.2} />
            </mesh>

            {/* 3D Label */}
            <Html position={[0, 0.06, 1.15]} center transform rotation={[-Math.PI / 2, 0, 0]}>
              <div className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/40 whitespace-nowrap">
                PARTS STAGING BENCH
              </div>
            </Html>
          </group>

          {/* Contact Shadows on Floor */}
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.7}
            scale={12}
            blur={2.5}
            far={4}
            color="#000000"
          />
        </Suspense>

        {/* Engineering Floor Grid */}
        <gridHelper args={[14, 28, "#00f0ff", "#182030"]} position={[0, -1.201, 0]} />
      </Canvas>
    </div>
  );
};
