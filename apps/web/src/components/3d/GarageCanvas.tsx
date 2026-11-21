import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { VehiclePreview } from "./VehiclePreview";

export const GarageCanvas: React.FC = () => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ position: [4.5, 2.2, 5.0], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#0a0b0e"]} />
        <fog attach="fog" args={["#0a0b0e", 10, 25]} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[6, 8, 4]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.6} color="#45a29e" />

        {/* HDRI Environment Preset */}
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        {/* 3D Morphable Vehicle */}
        <Suspense fallback={null}>
          <VehiclePreview />
        </Suspense>

        {/* Floor Contact Shadows */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.8}
          scale={12}
          blur={1.8}
          far={4}
          color="#000000"
        />

        {/* Circular Grid Platform */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <circleGeometry args={[6, 64]} />
          <meshStandardMaterial color="#111318" roughness={0.7} metalness={0.4} />
        </mesh>

        {/* Orbit Camera Controls */}
        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2 - 0.05}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};
