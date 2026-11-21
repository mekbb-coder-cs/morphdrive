import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useVehicleStore } from "../../stores/useVehicleStore";

export const VehiclePreview: React.FC = () => {
  const { morphSettings, materialColors, activeMode } = useVehicleStore();

  const chassisRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const thrusterRef = useRef<THREE.Mesh>(null);
  const wheelsRef = useRef<THREE.Group>(null);

  // Smooth frame interpolation (lerp) for morphing
  useFrame((_, delta) => {
    const lerpSpeed = Math.min(delta * 8, 1);

    // 1. Suspension ride height interpolation
    if (chassisRef.current) {
      const targetY = 0.35 + morphSettings.suspensionHeight * 0.45;
      chassisRef.current.position.y = THREE.MathUtils.lerp(
        chassisRef.current.position.y,
        targetY,
        lerpSpeed
      );
    }

    // 2. Wings deployment interpolation
    if (leftWingRef.current && rightWingRef.current) {
      const targetWingZ = morphSettings.aerodynamicWings * 0.9;
      const targetWingAngle = morphSettings.aerodynamicWings * (Math.PI / 8);

      leftWingRef.current.position.x = THREE.MathUtils.lerp(
        leftWingRef.current.position.x,
        -1.1 - targetWingZ,
        lerpSpeed
      );
      leftWingRef.current.rotation.z = THREE.MathUtils.lerp(
        leftWingRef.current.rotation.z,
        -targetWingAngle,
        lerpSpeed
      );

      rightWingRef.current.position.x = THREE.MathUtils.lerp(
        rightWingRef.current.position.x,
        1.1 + targetWingZ,
        lerpSpeed
      );
      rightWingRef.current.rotation.z = THREE.MathUtils.lerp(
        rightWingRef.current.rotation.z,
        targetWingAngle,
        lerpSpeed
      );
    }

    // 3. Thruster nozzle extension
    if (thrusterRef.current) {
      const targetThrusterZ = -2.2 - morphSettings.thrusterExtend * 0.4;
      thrusterRef.current.position.z = THREE.MathUtils.lerp(
        thrusterRef.current.position.z,
        targetThrusterZ,
        lerpSpeed
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dynamic Chassis Group */}
      <group ref={chassisRef} position={[0, 0.45, 0]}>
        {/* Main Body Hull */}
        <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
          <boxGeometry args={[1.9, 0.45, 4.2]} />
          <meshStandardMaterial
            color={materialColors.primaryPaint}
            metalness={materialColors.metallic}
            roughness={materialColors.roughness}
          />
        </mesh>

        {/* Cockpit Canopy */}
        <mesh castShadow position={[0, 0.65, -0.2]}>
          <boxGeometry args={[1.3, 0.4, 2.0]} />
          <meshStandardMaterial
            color="#08080c"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={materialColors.windowTint}
          />
        </mesh>

        {/* Hood Aerodynamic Scoop */}
        <mesh castShadow position={[0, 0.48, 1.2]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[1.5, 0.15, 1.4]} />
          <meshStandardMaterial
            color={materialColors.secondaryPaint}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Front Splitter */}
        <mesh castShadow position={[0, 0.05, 2.15]}>
          <boxGeometry args={[2.0 + morphSettings.widebodyFlare * 0.3, 0.08, 0.5]} />
          <meshStandardMaterial color="#111116" metalness={0.5} roughness={0.7} />
        </mesh>

        {/* Rear Wing / Spoiler */}
        <mesh castShadow position={[0, 0.85, -1.9]}>
          <boxGeometry args={[2.1, 0.08, 0.45]} />
          <meshStandardMaterial
            color={materialColors.secondaryPaint}
            metalness={materialColors.metallic}
            roughness={materialColors.roughness}
          />
        </mesh>

        {/* Dynamic Flight Wing: Left */}
        <mesh ref={leftWingRef} castShadow position={[-1.1, 0.3, -0.4]}>
          <boxGeometry args={[0.9, 0.05, 1.6]} />
          <meshStandardMaterial
            color={materialColors.secondaryPaint}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Dynamic Flight Wing: Right */}
        <mesh ref={rightWingRef} castShadow position={[1.1, 0.3, -0.4]}>
          <boxGeometry args={[0.9, 0.05, 1.6]} />
          <meshStandardMaterial
            color={materialColors.secondaryPaint}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Dynamic Rear Thruster */}
        <mesh ref={thrusterRef} castShadow position={[0, 0.3, -2.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.4, 16]} />
          <meshStandardMaterial
            color={materialColors.neonGlow}
            emissive={materialColors.neonGlow}
            emissiveIntensity={activeMode === "FLIGHT" ? 3.0 : 0.8}
          />
        </mesh>

        {/* Neon Underglow light */}
        <pointLight
          position={[0, -0.2, 0]}
          color={materialColors.neonGlow}
          intensity={2.5}
          distance={4}
        />
      </group>

      {/* Wheels Base */}
      <group ref={wheelsRef}>
        {[
          { x: -1.05, z: 1.4 },
          { x: 1.05, z: 1.4 },
          { x: -1.05, z: -1.4 },
          { x: 1.05, z: -1.4 },
        ].map((wheelPos, i) => (
          <group
            key={i}
            position={[
              wheelPos.x + (wheelPos.x > 0 ? 1 : -1) * morphSettings.widebodyFlare * 0.15,
              0.35,
              wheelPos.z,
            ]}
          >
            {/* Rubber Tire */}
            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.35, 0.35, 0.32, 24]} />
              <meshStandardMaterial color="#1a1a1c" roughness={0.8} metalness={0.1} />
            </mesh>
            {/* Rim */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.22, 0.22, 0.34, 16]} />
              <meshStandardMaterial
                color={materialColors.rimColor}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
