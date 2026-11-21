import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useVehicleStore } from "../../stores/useVehicleStore";

export const VehiclePreview: React.FC = () => {
  const {
    morphSettings,
    materialColors,
    activeMode,
    explodedProgress,
    crossSectionEnabled,
    crossSectionAxis,
    crossSectionOffset,
    isolatedComponent,
  } = useVehicleStore();

  const chassisRef = useRef<THREE.Group>(null);
  const canopyRef = useRef<THREE.Mesh>(null);
  const splitterRef = useRef<THREE.Mesh>(null);
  const rearWingRef = useRef<THREE.Mesh>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const thrusterRef = useRef<THREE.Mesh>(null);
  const wheelsRef = useRef<THREE.Group>(null);

  // FR-08 Dynamic Planar Clipping Plane
  const clippingPlane = useMemo(() => {
    if (!crossSectionEnabled) return null;
    let normal = new THREE.Vector3(0, -1, 0);
    if (crossSectionAxis === "X") normal = new THREE.Vector3(-1, 0, 0);
    if (crossSectionAxis === "Y") normal = new THREE.Vector3(0, -1, 0);
    if (crossSectionAxis === "Z") normal = new THREE.Vector3(0, 0, -1);
    return new THREE.Plane(normal, crossSectionOffset);
  }, [crossSectionEnabled, crossSectionAxis, crossSectionOffset]);

  const planes = useMemo(() => (clippingPlane ? [clippingPlane] : []), [clippingPlane]);

  // Component visibility helper based on isolatedComponent
  const getComponentOpacity = (id: string, baseOpacity = 1.0) => {
    if (!isolatedComponent || isolatedComponent === id) return baseOpacity;
    return 0.15; // dimmed ghost mode
  };

  const isVisible = (id: string) => {
    return !isolatedComponent || isolatedComponent === id;
  };

  // Smooth frame interpolation (lerp) for morphing & exploded view
  useFrame((_, delta) => {
    const lerpSpeed = Math.min(delta * 8, 1);

    // 1. Suspension height (Chassis Anchor)
    if (chassisRef.current) {
      const targetY = 0.35 + morphSettings.suspensionHeight * 0.45;
      chassisRef.current.position.y = THREE.MathUtils.lerp(
        chassisRef.current.position.y,
        targetY,
        lerpSpeed
      );
    }

    // 2. FR-05 Exploded View Displacements
    // Canopy shifts UP
    if (canopyRef.current) {
      const targetY = 0.65 + explodedProgress * 0.9;
      canopyRef.current.position.y = THREE.MathUtils.lerp(canopyRef.current.position.y, targetY, lerpSpeed);
    }

    // Front Splitter shifts FORWARD (+Z)
    if (splitterRef.current) {
      const targetZ = 2.15 + explodedProgress * 1.1;
      splitterRef.current.position.z = THREE.MathUtils.lerp(splitterRef.current.position.z, targetZ, lerpSpeed);
    }

    // Rear Spoiler shifts BACKWARD (-Z) and UP
    if (rearWingRef.current) {
      const targetZ = -1.9 - explodedProgress * 1.0;
      const targetY = 0.85 + explodedProgress * 0.4;
      rearWingRef.current.position.z = THREE.MathUtils.lerp(rearWingRef.current.position.z, targetZ, lerpSpeed);
      rearWingRef.current.position.y = THREE.MathUtils.lerp(rearWingRef.current.position.y, targetY, lerpSpeed);
    }

    // Dynamic Wings: Combined Morph + Explode outward
    if (leftWingRef.current && rightWingRef.current) {
      const morphZ = morphSettings.aerodynamicWings * 0.9;
      const targetWingAngle = morphSettings.aerodynamicWings * (Math.PI / 8);

      const targetLeftX = -1.1 - morphZ - explodedProgress * 1.3;
      const targetRightX = 1.1 + morphZ + explodedProgress * 1.3;

      leftWingRef.current.position.x = THREE.MathUtils.lerp(leftWingRef.current.position.x, targetLeftX, lerpSpeed);
      leftWingRef.current.rotation.z = THREE.MathUtils.lerp(leftWingRef.current.rotation.z, -targetWingAngle, lerpSpeed);

      rightWingRef.current.position.x = THREE.MathUtils.lerp(rightWingRef.current.position.x, targetRightX, lerpSpeed);
      rightWingRef.current.rotation.z = THREE.MathUtils.lerp(rightWingRef.current.rotation.z, targetWingAngle, lerpSpeed);
    }

    // Thruster Extension: Combined Morph + Explode backward
    if (thrusterRef.current) {
      const targetThrusterZ = -2.2 - morphSettings.thrusterExtend * 0.4 - explodedProgress * 1.2;
      thrusterRef.current.position.z = THREE.MathUtils.lerp(thrusterRef.current.position.z, targetThrusterZ, lerpSpeed);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dynamic Chassis Group */}
      <group ref={chassisRef} position={[0, 0.45, 0]}>
        {/* Main Body Hull */}
        {isVisible("chassis") && (
          <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
            <boxGeometry args={[1.9, 0.45, 4.2]} />
            <meshStandardMaterial
              color={materialColors.primaryPaint}
              metalness={materialColors.metallic}
              roughness={materialColors.roughness}
              clippingPlanes={planes}
              clipShadows={true}
              transparent={Boolean(isolatedComponent && isolatedComponent !== "chassis")}
              opacity={getComponentOpacity("chassis")}
            />
          </mesh>
        )}

        {/* Cockpit Canopy */}
        {isVisible("canopy") && (
          <mesh ref={canopyRef} castShadow position={[0, 0.65, -0.2]}>
            <boxGeometry args={[1.3, 0.4, 2.0]} />
            <meshStandardMaterial
              color="#08080c"
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={materialColors.windowTint * getComponentOpacity("canopy")}
              clippingPlanes={planes}
              clipShadows={true}
            />
          </mesh>
        )}

        {/* Hood Aerodynamic Scoop */}
        {isVisible("chassis") && (
          <mesh castShadow position={[0, 0.48, 1.2]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[1.5, 0.15, 1.4]} />
            <meshStandardMaterial
              color={materialColors.secondaryPaint}
              metalness={0.8}
              roughness={0.3}
              clippingPlanes={planes}
              clipShadows={true}
              transparent={Boolean(isolatedComponent && isolatedComponent !== "chassis")}
              opacity={getComponentOpacity("chassis")}
            />
          </mesh>
        )}

        {/* Front Splitter (Explodes Forward) */}
        {isVisible("chassis") && (
          <mesh ref={splitterRef} castShadow position={[0, 0.05, 2.15]}>
            <boxGeometry args={[2.0 + morphSettings.widebodyFlare * 0.3, 0.08, 0.5]} />
            <meshStandardMaterial
              color="#111116"
              metalness={0.5}
              roughness={0.7}
              clippingPlanes={planes}
              clipShadows={true}
              transparent={Boolean(isolatedComponent && isolatedComponent !== "chassis")}
              opacity={getComponentOpacity("chassis")}
            />
          </mesh>
        )}

        {/* Rear Wing / Spoiler (Explodes Backward) */}
        {isVisible("chassis") && (
          <mesh ref={rearWingRef} castShadow position={[0, 0.85, -1.9]}>
            <boxGeometry args={[2.1, 0.08, 0.45]} />
            <meshStandardMaterial
              color={materialColors.secondaryPaint}
              metalness={materialColors.metallic}
              roughness={materialColors.roughness}
              clippingPlanes={planes}
              clipShadows={true}
              transparent={Boolean(isolatedComponent && isolatedComponent !== "chassis")}
              opacity={getComponentOpacity("chassis")}
            />
          </mesh>
        )}

        {/* Dynamic Flight Glider Wing: Left */}
        {isVisible("wings") && (
          <mesh ref={leftWingRef} castShadow position={[-1.1, 0.3, -0.4]}>
            <boxGeometry args={[0.9, 0.05, 1.6]} />
            <meshStandardMaterial
              color={materialColors.secondaryPaint}
              metalness={0.9}
              roughness={0.2}
              clippingPlanes={planes}
              clipShadows={true}
              transparent={Boolean(isolatedComponent && isolatedComponent !== "wings")}
              opacity={getComponentOpacity("wings")}
            />
          </mesh>
        )}

        {/* Dynamic Flight Glider Wing: Right */}
        {isVisible("wings") && (
          <mesh ref={rightWingRef} castShadow position={[1.1, 0.3, -0.4]}>
            <boxGeometry args={[0.9, 0.05, 1.6]} />
            <meshStandardMaterial
              color={materialColors.secondaryPaint}
              metalness={0.9}
              roughness={0.2}
              clippingPlanes={planes}
              clipShadows={true}
              transparent={Boolean(isolatedComponent && isolatedComponent !== "wings")}
              opacity={getComponentOpacity("wings")}
            />
          </mesh>
        )}

        {/* Dynamic Jet Thruster / Iris Vector Nozzle */}
        {isVisible("thruster") && (
          <mesh ref={thrusterRef} castShadow position={[0, 0.3, -2.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.28, 0.4, 16]} />
            <meshStandardMaterial
              color={materialColors.neonGlow}
              emissive={materialColors.neonGlow}
              emissiveIntensity={activeMode === "FLIGHT" ? 3.0 : 0.8}
              clippingPlanes={planes}
              clipShadows={true}
              transparent={Boolean(isolatedComponent && isolatedComponent !== "thruster")}
              opacity={getComponentOpacity("thruster")}
            />
          </mesh>
        )}

        {/* Neon Underglow light */}
        <pointLight
          position={[0, -0.2, 0]}
          color={materialColors.neonGlow}
          intensity={2.5}
          distance={4}
        />
      </group>

      {/* Wheels & Actuators Base */}
      {isVisible("wheels") && (
        <group ref={wheelsRef}>
          {[
            { x: -1.05, z: 1.4, dx: -1, dz: 1 },
            { x: 1.05, z: 1.4, dx: 1, dz: 1 },
            { x: -1.05, z: -1.4, dx: -1, dz: -1 },
            { x: 1.05, z: -1.4, dx: 1, dz: -1 },
          ].map((w, i) => {
            // Wheels displace radially outward during exploded view
            const explodeX = w.dx * explodedProgress * 0.9;
            const explodeZ = w.dz * explodedProgress * 0.4;
            const stanceX = (w.x > 0 ? 1 : -1) * morphSettings.widebodyFlare * 0.15;

            return (
              <group
                key={i}
                position={[
                  w.x + stanceX + explodeX,
                  0.35,
                  w.z + explodeZ,
                ]}
              >
                {/* Rubber Tire */}
                <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.35, 0.35, 0.32, 24]} />
                  <meshStandardMaterial
                    color="#1a1a1c"
                    roughness={0.8}
                    metalness={0.1}
                    clippingPlanes={planes}
                    clipShadows={true}
                    transparent={Boolean(isolatedComponent && isolatedComponent !== "wheels")}
                    opacity={getComponentOpacity("wheels")}
                  />
                </mesh>
                {/* Rim */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.22, 0.22, 0.34, 16]} />
                  <meshStandardMaterial
                    color={materialColors.rimColor}
                    metalness={0.9}
                    roughness={0.2}
                    clippingPlanes={planes}
                    clipShadows={true}
                    transparent={Boolean(isolatedComponent && isolatedComponent !== "wheels")}
                    opacity={getComponentOpacity("wheels")}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};
