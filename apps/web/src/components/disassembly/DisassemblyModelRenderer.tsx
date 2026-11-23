import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, TransformControls } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useDisassemblyStore } from "../../stores/useDisassemblyStore";
import { MachineMetadata } from "../../data/machinesData";
import {
  checkDisassemblyRule,
  getRemovableParts,
  MACHINE_DAGS,
} from "../../data/dependencyGraph";

interface Props {
  metadata: MachineMetadata;
  orbitControlsRef: React.RefObject<any>;
}

export const DisassemblyModelRenderer: React.FC<Props> = ({ metadata, orbitControlsRef }) => {
  const {
    currentMachineId,
    disassembledParts,
    selectedPartMesh,
    activeTransformMesh,
    hintMesh,
    selectPart,
    attemptDisassemblePart,
    setActiveTransformMesh,
  } = useDisassemblyStore();

  const { scene } = useGLTF(metadata.glbAssetUrl);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  const initialPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const initialRotations = useRef<Map<string, THREE.Euler>>(new Map());
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  const [activeMeshObj, setActiveMeshObj] = useState<THREE.Mesh | null>(null);

  // Initialize meshes and record baseline positions
  useEffect(() => {
    initialPositions.current.clear();
    initialRotations.current.clear();
    meshesRef.current.clear();

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }

        const name = mesh.name || mesh.parent?.name || "";
        if (name) {
          meshesRef.current.set(name, mesh);
          initialPositions.current.set(name, mesh.position.clone());
          initialRotations.current.set(name, mesh.rotation.clone());
        }
      }
    });
  }, [clonedScene]);

  // Update activeMeshObj when activeTransformMesh changes
  useEffect(() => {
    if (activeTransformMesh && !disassembledParts.includes(activeTransformMesh)) {
      const mesh = meshesRef.current.get(activeTransformMesh);
      setActiveMeshObj(mesh || null);
    } else {
      setActiveMeshObj(null);
    }
  }, [activeTransformMesh, disassembledParts]);

  // Animate parts to the workbench tray or back to original position
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const pulse = (Math.sin(time * 5) + 1) / 2;

    meshesRef.current.forEach((mesh, name) => {
      const basePos = initialPositions.current.get(name);
      if (!basePos) return;

      const isDisassembled = disassembledParts.includes(name);

      if (isDisassembled) {
        // Disassembled: animate to virtual workbench tray (world x = 2.0, resting on tray)
        const idx = disassembledParts.indexOf(name);
        const trayX = 2.5;
        const trayY = -0.9 + Math.floor(idx / 3) * 0.22;
        const trayZ = -0.75 + (idx % 3) * 0.75;

        mesh.position.x = THREE.MathUtils.damp(mesh.position.x, trayX, 8, delta);
        mesh.position.y = THREE.MathUtils.damp(mesh.position.y, trayY, 8, delta);
        mesh.position.z = THREE.MathUtils.damp(mesh.position.z, trayZ, 8, delta);
      } else if (activeTransformMesh !== name) {
        // In assembly: smoothly maintain or restore base position
        mesh.position.x = THREE.MathUtils.damp(mesh.position.x, basePos.x, 12, delta);
        mesh.position.y = THREE.MathUtils.damp(mesh.position.y, basePos.y, 12, delta);
        mesh.position.z = THREE.MathUtils.damp(mesh.position.z, basePos.z, 12, delta);
      }

      // Dynamic Shaders and Emissive Highlighting
      const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
      if (!mat) return;

      const isSelected = selectedPartMesh === name;
      const isHinted = hintMesh === name;
      const removableParts = getRemovableParts(currentMachineId, disassembledParts);
      const isCandidate = removableParts.includes(name) && !isDisassembled;

      if (isHinted) {
        // High-priority pulsing emerald hint
        mat.emissive = new THREE.Color(0x00ff88);
        mat.emissiveIntensity = 0.5 + pulse * 0.5;
      } else if (isSelected) {
        // Active selected: golden amber
        mat.emissive = new THREE.Color(0xf5a623);
        mat.emissiveIntensity = 0.7;
      } else if (isCandidate) {
        // Removable candidate: soft green rim indicator
        mat.emissive = new THREE.Color(0x00e5a3);
        mat.emissiveIntensity = 0.25;
      } else {
        mat.emissive = new THREE.Color(0x000000);
        mat.emissiveIntensity = 0;
      }
    });
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "grab";
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "default";
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    const name = mesh.name || mesh.parent?.name || "";
    if (name) {
      selectPart(name);
    }
  };

  const handleTransformMouseUp = () => {
    if (!activeTransformMesh) return;
    const mesh = meshesRef.current.get(activeTransformMesh);
    const basePos = initialPositions.current.get(activeTransformMesh);
    if (!mesh || !basePos) return;

    // Calculate displacement distance
    const distance = mesh.position.distanceTo(basePos);
    if (distance > 0.35) {
      // User dragged part out: validate with DAG
      const success = attemptDisassemblePart(activeTransformMesh);
      if (!success) {
        // Blocked! Mesh position will snap back in useFrame
      }
    }
  };

  return (
    <>
      <primitive
        object={clonedScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* Interactive TransformControls for dragging */}
      {activeMeshObj && (
        <TransformControls
          object={activeMeshObj}
          mode="translate"
          size={0.65}
          onMouseDown={() => {
            if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
          }}
          onMouseUp={() => {
            if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
            handleTransformMouseUp();
          }}
        />
      )}
    </>
  );
};
