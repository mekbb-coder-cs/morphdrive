import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useInspectionStore } from "../../stores/useInspectionStore";
import { MachineMetadata, MachinePart } from "../../data/machinesData";

interface Props {
  metadata: MachineMetadata;
}

export const MachineModelRenderer: React.FC<Props> = ({ metadata }) => {
  const {
    selectedPartMesh,
    hoveredPartMesh,
    hiddenParts,
    isolatedPart,
    renderMode,
    explodedProgress,
    measurementActive,
    selectPart,
    hoverPart,
    addMeasurementPoint,
  } = useInspectionStore();

  const { scene } = useGLTF(metadata.glbAssetUrl);

  // Clone scene so each machine change has clean isolated node instances
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    return clone;
  }, [scene]);

  // Keep map of mesh original base positions and base materials
  const initialPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  // Build reference map and save base positions
  useEffect(() => {
    initialPositions.current.clear();
    meshesRef.current.clear();

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Ensure materials are independent cloned instances
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }

        const name = mesh.name || mesh.parent?.name || "";
        if (name) {
          meshesRef.current.set(name, mesh);
          initialPositions.current.set(name, mesh.position.clone());
        }
      }
    });
  }, [clonedScene]);

  // Animate exploded positions in useFrame with smooth lerping
  useFrame((_, delta) => {
    const factor = explodedProgress;

    meshesRef.current.forEach((mesh, name) => {
      const basePos = initialPositions.current.get(name);
      if (!basePos) return;

      const offset = metadata.explodedView[name] || [0, 0, 0];
      const targetX = basePos.x + offset[0] * factor;
      const targetY = basePos.y + offset[1] * factor;
      const targetZ = basePos.z + offset[2] * factor;

      // Smooth damped lerp
      mesh.position.x = THREE.MathUtils.damp(mesh.position.x, targetX, 14, delta);
      mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetY, 14, delta);
      mesh.position.z = THREE.MathUtils.damp(mesh.position.z, targetZ, 14, delta);
    });
  });

  // Apply materials, visibility, X-ray, and highlights
  useEffect(() => {
    meshesRef.current.forEach((mesh, name) => {
      const isSelected = selectedPartMesh === name;
      const isHovered = hoveredPartMesh === name;
      const isHidden = hiddenParts.includes(name);
      const isIsolated = isolatedPart !== null && isolatedPart === name;
      const isOtherWhenIsolated = isolatedPart !== null && isolatedPart !== name;

      // Visibility logic
      if (isHidden) {
        mesh.visible = false;
        return;
      }

      if (isOtherWhenIsolated) {
        // Ghost non-isolated parts
        mesh.visible = true;
        const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
        if (mat) {
          mat.transparent = true;
          mat.opacity = 0.08;
          mat.depthWrite = false;
          mat.wireframe = false;
        }
        return;
      }

      mesh.visible = true;
      const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
      if (!mat) return;

      // Handle render modes
      if (renderMode === "WIREFRAME") {
        mat.wireframe = true;
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.depthWrite = true;
      } else if (renderMode === "XRAY") {
        mat.wireframe = false;
        mat.transparent = true;
        mat.opacity = isSelected || isHovered ? 0.65 : 0.22;
        mat.depthWrite = false;
      } else {
        // SHADED normal
        mat.wireframe = false;
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.depthWrite = true;
      }

      // Handle emissive highlighting
      if (isSelected) {
        mat.emissive = new THREE.Color(0xf5a623); // Golden amber
        mat.emissiveIntensity = 0.7;
      } else if (isHovered) {
        mat.emissive = new THREE.Color(0x00f0ff); // Cyan
        mat.emissiveIntensity = 0.5;
      } else {
        mat.emissive = new THREE.Color(0x000000);
        mat.emissiveIntensity = 0;
      }
    });
  }, [selectedPartMesh, hoveredPartMesh, hiddenParts, isolatedPart, renderMode]);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    const name = mesh.name || mesh.parent?.name || "";
    if (name) {
      document.body.style.cursor = measurementActive ? "crosshair" : "pointer";
      hoverPart(name);
    }
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "default";
    hoverPart(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    const name = mesh.name || mesh.parent?.name || "";

    if (measurementActive) {
      addMeasurementPoint([e.point.x, e.point.y, e.point.z]);
    } else {
      if (name) {
        selectPart(selectedPartMesh === name ? null : name);
      }
    }
  };

  return (
    <primitive
      object={clonedScene}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
};

// Preload all machine assets
useGLTF.preload("/models/single_cylinder_engine.glb");
useGLTF.preload("/models/gearbox.glb");
useGLTF.preload("/models/landing_gear_strut.glb");
useGLTF.preload("/models/turbine_stage.glb");
