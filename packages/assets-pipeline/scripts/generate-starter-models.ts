import { Document, NodeIO } from "@gltf-transform/core";
import fs from "fs";
import path from "path";

// Geometry primitive generators
interface MeshData {
  positions: Float32Array;
  normals: Float32Array;
  indices: Uint16Array;
}

function createBox(w: number, h: number, d: number): MeshData {
  const hw = w / 2, hh = h / 2, hd = d / 2;
  const positions = new Float32Array([
    // Front
    -hw, -hh,  hd,   hw, -hh,  hd,   hw,  hh,  hd,  -hw,  hh,  hd,
    // Back
     hw, -hh, -hd,  -hw, -hh, -hd,  -hw,  hh, -hd,   hw,  hh, -hd,
    // Top
    -hw,  hh,  hd,   hw,  hh,  hd,   hw,  hh, -hd,  -hw,  hh, -hd,
    // Bottom
    -hw, -hh, -hd,   hw, -hh, -hd,   hw, -hh,  hd,  -hw, -hh,  hd,
    // Right
     hw, -hh,  hd,   hw, -hh, -hd,   hw,  hh, -hd,   hw,  hh,  hd,
    // Left
    -hw, -hh, -hd,  -hw, -hh,  hd,  -hw,  hh,  hd,  -hw,  hh, -hd,
  ]);

  const normals = new Float32Array([
     0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1,
     0,  0, -1,   0,  0, -1,   0,  0, -1,   0,  0, -1,
     0,  1,  0,   0,  1,  0,   0,  1,  0,   0,  1,  0,
     0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0,
     1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0,
    -1,  0,  0,  -1,  0,  0,  -1,  0,  0,  -1,  0,  0,
  ]);

  const indices = new Uint16Array([
     0,  1,  2,   0,  2,  3,
     4,  5,  6,   4,  6,  7,
     8,  9, 10,   8, 10, 11,
    12, 13, 14,  12, 14, 15,
    16, 17, 18,  16, 18, 19,
    20, 21, 22,  20, 22, 23,
  ]);

  return { positions, normals, indices };
}

function createCylinder(rTop: number, rBottom: number, height: number, segments = 24): MeshData {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  const halfH = height / 2;

  // Side vertices
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const sin = Math.sin(theta);
    const cos = Math.cos(theta);

    // Top vertex
    positions.push(cos * rTop, halfH, sin * rTop);
    normals.push(cos, 0, sin);

    // Bottom vertex
    positions.push(cos * rBottom, -halfH, sin * rBottom);
    normals.push(cos, 0, sin);
  }

  for (let i = 0; i < segments; i++) {
    const p1 = i * 2;
    const p2 = p1 + 1;
    const p3 = p1 + 2;
    const p4 = p1 + 3;

    indices.push(p1, p2, p3);
    indices.push(p2, p4, p3);
  }

  // Top cap center
  const topCenterIdx = positions.length / 3;
  positions.push(0, halfH, 0);
  normals.push(0, 1, 0);

  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    positions.push(Math.cos(theta) * rTop, halfH, Math.sin(theta) * rTop);
    normals.push(0, 1, 0);
  }

  for (let i = 0; i < segments; i++) {
    const curr = topCenterIdx + 1 + i;
    const next = topCenterIdx + 1 + ((i + 1) % segments);
    indices.push(topCenterIdx, curr, next);
  }

  // Bottom cap center
  const botCenterIdx = positions.length / 3;
  positions.push(0, -halfH, 0);
  normals.push(0, -1, 0);

  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    positions.push(Math.cos(theta) * rBottom, -halfH, Math.sin(theta) * rBottom);
    normals.push(0, -1, 0);
  }

  for (let i = 0; i < segments; i++) {
    const curr = botCenterIdx + 1 + i;
    const next = botCenterIdx + 1 + ((i + 1) % segments);
    indices.push(botCenterIdx, next, curr);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
  };
}

function createGear(radius: number, innerRadius: number, thickness: number, teeth = 16): MeshData {
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  const halfH = thickness / 2;
  const segments = teeth * 2;

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const isTooth = i % 2 === 1;
    const r = isTooth ? radius * 1.15 : radius;

    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    positions.push(cos * r, halfH, sin * r);
    normals.push(cos, 0, sin);

    positions.push(cos * r, -halfH, sin * r);
    normals.push(cos, 0, sin);
  }

  for (let i = 0; i < segments; i++) {
    const p1 = i * 2;
    const p2 = p1 + 1;
    const p3 = p1 + 2;
    const p4 = p1 + 3;
    indices.push(p1, p2, p3);
    indices.push(p2, p4, p3);
  }

  // Bore cylinder
  const cyl = createCylinder(innerRadius, innerRadius, thickness, 16);
  return {
    positions: new Float32Array([...positions, ...Array.from(cyl.positions)]),
    normals: new Float32Array([...normals, ...Array.from(cyl.normals)]),
    indices: new Uint16Array([...indices, ...Array.from(cyl.indices).map(idx => idx + positions.length / 3)]),
  };
}

// Add Part Helper
function addPartToScene(
  doc: Document,
  scene: any,
  buffer: any,
  meshName: string,
  nodeName: string,
  data: MeshData,
  translation: [number, number, number],
  rotation: [number, number, number, number] = [0, 0, 0, 1],
  color: [number, number, number] = [0.8, 0.8, 0.85],
  metallic = 0.8,
  roughness = 0.25
) {
  const pos = doc.createAccessor().setType("VEC3").setArray(data.positions).setBuffer(buffer);
  const norm = doc.createAccessor().setType("VEC3").setArray(data.normals).setBuffer(buffer);
  const idx = doc.createAccessor().setType("SCALAR").setArray(data.indices).setBuffer(buffer);

  const mat = doc.createMaterial(meshName + "_Material")
    .setBaseColorFactor([...color, 1])
    .setMetallicFactor(metallic)
    .setRoughnessFactor(roughness);

  const prim = doc.createPrimitive()
    .setAttribute("POSITION", pos)
    .setAttribute("NORMAL", norm)
    .setIndices(idx)
    .setMaterial(mat);

  const mesh = doc.createMesh(meshName).addPrimitive(prim);
  const node = doc.createNode(nodeName)
    .setMesh(mesh)
    .setTranslation(translation)
    .setRotation(rotation);

  scene.addChild(node);
  return data.indices.length / 3;
}

async function buildSingleCylinderEngine(outputDir: string) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("SingleCylinderEngine");

  let triangles = 0;

  // 1. Engine Block Crankcase
  triangles += addPartToScene(doc, scene, buffer, "EngineBlock_Crankcase", "EngineBlock_Crankcase",
    createBox(1.2, 1.4, 1.0), [0, 0, 0], [0, 0, 0, 1], [0.25, 0.28, 0.35], 0.6, 0.5);

  // 2. Cylinder Head
  triangles += addPartToScene(doc, scene, buffer, "CylinderHead", "CylinderHead",
    createBox(1.1, 0.5, 0.95), [0, 0.95, 0], [0, 0, 0, 1], [0.3, 0.32, 0.4], 0.7, 0.4);

  // 3. Crankshaft
  triangles += addPartToScene(doc, scene, buffer, "Crankshaft", "Crankshaft",
    createCylinder(0.18, 0.18, 1.2, 24), [0, -0.4, 0], [0.7071, 0, 0, 0.7071], [0.85, 0.85, 0.9], 0.95, 0.15);

  // 4. Connecting Rod
  triangles += addPartToScene(doc, scene, buffer, "ConnectingRod", "ConnectingRod",
    createBox(0.15, 0.75, 0.08), [0, 0.05, 0], [0, 0, 0, 1], [0.7, 0.6, 0.2], 0.9, 0.2);

  // 5. Piston
  triangles += addPartToScene(doc, scene, buffer, "Piston", "Piston",
    createCylinder(0.38, 0.38, 0.5, 24), [0, 0.55, 0], [0, 0, 0, 1], [0.9, 0.92, 0.95], 0.85, 0.2);

  // 6. Wrist Pin
  triangles += addPartToScene(doc, scene, buffer, "WristPin", "WristPin",
    createCylinder(0.08, 0.08, 0.7, 16), [0, 0.5, 0], [0.7071, 0, 0, 0.7071], [0.95, 0.95, 0.98], 0.98, 0.1);

  // 7. Spark Plug
  triangles += addPartToScene(doc, scene, buffer, "SparkPlug", "SparkPlug",
    createCylinder(0.06, 0.06, 0.45, 16), [0, 1.35, 0], [0, 0, 0, 1], [0.98, 0.98, 1.0], 0.2, 0.1);

  // 8. Intake Valve
  triangles += addPartToScene(doc, scene, buffer, "IntakeValve", "IntakeValve",
    createCylinder(0.04, 0.16, 0.5, 16), [-0.25, 0.95, 0], [0, 0, 0, 1], [0.2, 0.8, 1.0], 0.9, 0.2);

  // 9. Exhaust Valve
  triangles += addPartToScene(doc, scene, buffer, "ExhaustValve", "ExhaustValve",
    createCylinder(0.04, 0.16, 0.5, 16), [0.25, 0.95, 0], [0, 0, 0, 1], [1.0, 0.4, 0.2], 0.9, 0.2);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  fs.writeFileSync(path.join(outputDir, "single_cylinder_engine.glb"), Buffer.from(glb));

  // Metadata JSON
  const metadata = {
    machineId: "single-cylinder-engine",
    name: "Single-Cylinder 4-Stroke Engine",
    category: "Internal Combustion & Thermodynamics",
    difficulty: "BEGINNER",
    totalTriangles: triangles,
    glbAssetUrl: "/models/single_cylinder_engine.glb",
    description: "Educational 4-stroke reciprocating internal combustion engine demonstrating crankshaft rotation, connecting rod articulation, and piston wrist pin clearance.",
    parts: [
      { id: "engine-block", meshName: "EngineBlock_Crankcase", displayName: "Engine Block Crankcase", material: "Cast Grey Iron (Class 35)", function: "Main structural containment supporting crankshaft main bearings and cylinder bore.", massKg: 18.5, pivotOrigin: [0, 0, 0], kinematicType: "RIGID" },
      { id: "cylinder-head", meshName: "CylinderHead", displayName: "Cylinder Head", material: "A356 Aluminum Alloy", function: "Seals top combustion chamber; houses intake and exhaust poppet valves and spark plug.", massKg: 6.2, pivotOrigin: [0, 0.95, 0], kinematicType: "RIGID" },
      { id: "crankshaft", meshName: "Crankshaft", displayName: "Balanced Crankshaft", material: "4340 Forged Steel", function: "Converts reciprocating linear piston motion into continuous rotational torque output.", massKg: 5.4, pivotOrigin: [0, -0.4, 0], kinematicType: "ROTATIONAL" },
      { id: "connecting-rod", meshName: "ConnectingRod", displayName: "I-Beam Connecting Rod", material: "Forged Titanium Ti-6Al-4V", function: "Transmits explosive gas combustion forces from piston crown to crankshaft throw journal.", massKg: 0.65, pivotOrigin: [0, 0.05, 0], kinematicType: "PLANAR" },
      { id: "piston", meshName: "Piston", displayName: "Crown Piston", material: "Hypereutectic Al-Si Alloy", function: "Gas-tight reciprocating element transferring expanding combustion pressure into kinetic energy.", massKg: 0.42, pivotOrigin: [0, 0.55, 0], kinematicType: "TRANSLATIONAL" },
      { id: "wrist-pin", meshName: "WristPin", displayName: "Hardened Gudgeon Pin", material: "Case-Hardened 8620 Alloy Steel", function: "High-shear cross pin articulately joining connecting rod small-end to piston inner pin bosses.", massKg: 0.09, pivotOrigin: [0, 0.5, 0], kinematicType: "TRANSLATIONAL" },
      { id: "spark-plug", meshName: "SparkPlug", displayName: "High-Energy Spark Plug", material: "High-Alumina Ceramic & Nickel Alloy", function: "Delivers electrical high-voltage spark to ignite compressed air-fuel stoichiometric charge.", massKg: 0.06, pivotOrigin: [0, 1.35, 0], kinematicType: "RIGID" },
      { id: "intake-valve", meshName: "IntakeValve", displayName: "Intake Poppet Valve", material: "Silchrome 1 Stainless Steel", function: "Opens synchronously during intake stroke to admit atmospheric fresh air-fuel mixture.", massKg: 0.08, pivotOrigin: [-0.25, 0.95, 0], kinematicType: "TRANSLATIONAL" },
      { id: "exhaust-valve", meshName: "ExhaustValve", displayName: "Exhaust Poppet Valve", material: "Inconel 751 Superalloy", function: "Exposes exhaust port at exhaust stroke to evacuate high-temperature burnt gas.", massKg: 0.08, pivotOrigin: [0.25, 0.95, 0], kinematicType: "TRANSLATIONAL" },
    ],
    hierarchy: {
      root: "EngineBlock_Crankcase",
      children: [
        { node: "CylinderHead", children: ["SparkPlug", "IntakeValve", "ExhaustValve"] },
        { node: "Crankshaft", children: [
          { node: "ConnectingRod", children: [
            { node: "Piston", children: ["WristPin"] }
          ]}
        ]}
      ]
    },
    explodedView: {
      EngineBlock_Crankcase: [0, 0, 0],
      CylinderHead: [0, 0.8, 0],
      Crankshaft: [0, -0.7, 0],
      ConnectingRod: [0, 0.2, 0.6],
      Piston: [0, 0.9, 0],
      WristPin: [0.7, 0.9, 0],
      SparkPlug: [0, 1.4, 0],
      IntakeValve: [-0.6, 1.2, 0],
      ExhaustValve: [0.6, 1.2, 0]
    },
    assemblySteps: [
      { stepOrder: 1, partId: "spark-plug", meshName: "SparkPlug", action: "DISASSEMBLE", startTransform: { position: [0, 1.35, 0], rotation: [0, 0, 0, 1] }, endTransform: { position: [0, 2.75, 0], rotation: [0, 0, 0, 1] }, tolerance: 0.05, hint: "Unscrew and vertically extract spark plug from cylinder head socket.", safetyWarning: "Ensure engine is cold before handling threaded plug." },
      { stepOrder: 2, partId: "cylinder-head", meshName: "CylinderHead", action: "DISASSEMBLE", startTransform: { position: [0, 0.95, 0], rotation: [0, 0, 0, 1] }, endTransform: { position: [0, 1.8, 0], rotation: [0, 0, 0, 1] }, tolerance: 0.05, hint: "Loosen head bolts in criss-cross pattern and lift head off the engine block.", safetyWarning: "Avoid scratching head gasket mating face." },
      { stepOrder: 3, partId: "wrist-pin", meshName: "WristPin", action: "DISASSEMBLE", startTransform: { position: [0, 0.5, 0], rotation: [0.7071, 0, 0, 0.7071] }, endTransform: { position: [0.8, 0.5, 0], rotation: [0.7071, 0, 0, 0.7071] }, tolerance: 0.03, hint: "Extract circlips and slide wrist pin horizontally along lateral X axis.", safetyWarning: "Support piston so it does not drop into the crankcase." },
      { stepOrder: 4, partId: "piston", meshName: "Piston", action: "DISASSEMBLE", startTransform: { position: [0, 0.55, 0], rotation: [0, 0, 0, 1] }, endTransform: { position: [0, 1.5, 0], rotation: [0, 0, 0, 1] }, tolerance: 0.05, hint: "Carefully extract piston crown through the top of the cylinder bore.", safetyWarning: "Inspect piston skirts for friction scuffing." },
      { stepOrder: 5, partId: "connecting-rod", meshName: "ConnectingRod", action: "DISASSEMBLE", startTransform: { position: [0, 0.05, 0], rotation: [0, 0, 0, 1] }, endTransform: { position: [0, 0.05, 0.8], rotation: [0, 0, 0, 1] }, tolerance: 0.05, hint: "Unbolt big-end rod journal cap and lift connecting rod free.", safetyWarning: "Protect crank journal surface from rod bolt gouging." },
      { stepOrder: 6, partId: "crankshaft", meshName: "Crankshaft", action: "DISASSEMBLE", startTransform: { position: [0, -0.4, 0], rotation: [0.7071, 0, 0, 0.7071] }, endTransform: { position: [0, -1.2, 0], rotation: [0.7071, 0, 0, 0.7071] }, tolerance: 0.05, hint: "Remove main bearing caps and lower crankshaft assembly downwards.", safetyWarning: "Heavy component. Support counterweights evenly." }
    ]
  };

  fs.writeFileSync(path.join(outputDir, "single_cylinder_engine.json"), JSON.stringify(metadata, null, 2));
  console.log(`✓ Built single_cylinder_engine.glb (${glb.byteLength} bytes, ${triangles} tris)`);
}

async function buildGearbox(outputDir: string) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("Gearbox");

  let triangles = 0;

  // 1. Transmission Case
  triangles += addPartToScene(doc, scene, buffer, "TransmissionCase", "TransmissionCase",
    createBox(1.6, 1.2, 1.4), [0, 0, 0], [0, 0, 0, 1], [0.35, 0.38, 0.45], 0.5, 0.5);

  // 2. Input Shaft
  triangles += addPartToScene(doc, scene, buffer, "InputShaft", "InputShaft",
    createCylinder(0.12, 0.12, 1.8, 20), [0, 0.25, 0], [0.7071, 0, 0, 0.7071], [0.85, 0.85, 0.9], 0.95, 0.15);

  // 3. Countershaft
  triangles += addPartToScene(doc, scene, buffer, "Countershaft", "Countershaft",
    createCylinder(0.12, 0.12, 1.5, 20), [0, -0.3, 0], [0.7071, 0, 0, 0.7071], [0.8, 0.82, 0.88], 0.95, 0.15);

  // 4. Output Shaft
  triangles += addPartToScene(doc, scene, buffer, "OutputShaft", "OutputShaft",
    createCylinder(0.13, 0.13, 1.7, 20), [0.45, 0.25, 0], [0.7071, 0, 0, 0.7071], [0.88, 0.88, 0.92], 0.95, 0.12);

  // 5. 1st Gear
  triangles += addPartToScene(doc, scene, buffer, "DriveGear_1st", "DriveGear_1st",
    createGear(0.38, 0.13, 0.18, 18), [0.45, 0.25, -0.3], [0.7071, 0, 0, 0.7071], [0.95, 0.75, 0.2], 0.9, 0.2);

  // 6. 2nd Gear
  triangles += addPartToScene(doc, scene, buffer, "DriveGear_2nd", "DriveGear_2nd",
    createGear(0.28, 0.13, 0.18, 14), [0.45, 0.25, 0.3], [0.7071, 0, 0, 0.7071], [0.2, 0.85, 0.95], 0.9, 0.2);

  // 7. Synchromesh Ring
  triangles += addPartToScene(doc, scene, buffer, "SynchromeshRing", "SynchromeshRing",
    createCylinder(0.22, 0.22, 0.08, 24), [0.45, 0.25, 0.0], [0.7071, 0, 0, 0.7071], [0.95, 0.85, 0.3], 0.9, 0.3);

  // 8. Shift Fork
  triangles += addPartToScene(doc, scene, buffer, "ShiftFork", "ShiftFork",
    createBox(0.4, 0.15, 0.35), [0.45, 0.5, 0.0], [0, 0, 0, 1], [0.7, 0.72, 0.78], 0.8, 0.3);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  fs.writeFileSync(path.join(outputDir, "gearbox.glb"), Buffer.from(glb));

  const metadata = {
    machineId: "gearbox",
    name: "2-Speed Manual Transmission Gearbox",
    category: "Mechanical Power Transmission",
    difficulty: "INTERMEDIATE",
    totalTriangles: triangles,
    glbAssetUrl: "/models/gearbox.glb",
    description: "Automotive countershaft manual gearbox illustrating torque gear multiplication, dog teeth engagement, and synchromesh friction cone alignment.",
    parts: [
      { id: "trans-case", meshName: "TransmissionCase", displayName: "Transmission Housing Casing", material: "A380 Die-Cast Aluminum", function: "Rigid oil-sealed enclosure sustaining gear separation reaction forces.", massKg: 14.2, pivotOrigin: [0, 0, 0], kinematicType: "RIGID" },
      { id: "input-shaft", meshName: "InputShaft", displayName: "Primary Input Shaft", material: "8620 Alloy Steel", function: "Direct engine clutch input driving countershaft gear cluster.", massKg: 4.8, pivotOrigin: [0, 0.25, 0], kinematicType: "ROTATIONAL" },
      { id: "countershaft", meshName: "Countershaft", displayName: "Laygear Countershaft", material: "8620 Alloy Steel", function: "Intermediate cluster shaft distributing gear reduction ratios.", massKg: 5.6, pivotOrigin: [0, -0.3, 0], kinematicType: "ROTATIONAL" },
      { id: "output-shaft", meshName: "OutputShaft", displayName: "Main Output Shaft", material: "4340 Nickel-Chromium Steel", function: "Carries freewheeling drive gears and sends finalized torque to driveline.", massKg: 5.1, pivotOrigin: [0.45, 0.25, 0], kinematicType: "ROTATIONAL" },
      { id: "gear-1st", meshName: "DriveGear_1st", displayName: "1st Speed Driven Gear", material: "Case-Hardened 20MnCr5", function: "Provides maximum low-speed mechanical gear reduction torque (3.5:1 ratio).", massKg: 2.3, pivotOrigin: [0.45, 0.25, -0.3], kinematicType: "ROTATIONAL" },
      { id: "gear-2nd", meshName: "DriveGear_2nd", displayName: "2nd Speed Driven Gear", material: "Case-Hardened 20MnCr5", function: "Provides intermediate cruising speed gear reduction (1.9:1 ratio).", massKg: 1.8, pivotOrigin: [0.45, 0.25, 0.3], kinematicType: "ROTATIONAL" },
      { id: "synchro-ring", meshName: "SynchromeshRing", displayName: "Brass Synchronizer Baulk Ring", material: "High-Tensile Brass / Carbon Lining", function: "Matches shaft rotational speeds via conical friction before positive dog engagement.", massKg: 0.35, pivotOrigin: [0.45, 0.25, 0.0], kinematicType: "ROTATIONAL" },
      { id: "shift-fork", meshName: "ShiftFork", displayName: "Gear Selector Shift Fork", material: "Cast Manganese Bronze", function: "Axially shifts the synchronizer sleeve to lock selected gear to the output shaft.", massKg: 0.85, pivotOrigin: [0.45, 0.5, 0.0], kinematicType: "TRANSLATIONAL" }
    ],
    hierarchy: {
      root: "TransmissionCase",
      children: [
        { node: "InputShaft", children: [] },
        { node: "Countershaft", children: [] },
        { node: "OutputShaft", children: ["DriveGear_1st", "DriveGear_2nd", "SynchromeshRing", "ShiftFork"] }
      ]
    },
    explodedView: {
      TransmissionCase: [0, 0, 0],
      InputShaft: [0, 0, -1.2],
      Countershaft: [0, -0.8, 0],
      OutputShaft: [0, 0, 1.2],
      DriveGear_1st: [0.8, 0, -0.3],
      DriveGear_2nd: [0.8, 0, 0.3],
      SynchromeshRing: [0.8, 0, 0],
      ShiftFork: [0, 0.9, 0]
    },
    assemblySteps: [
      { stepOrder: 1, partId: "shift-fork", meshName: "ShiftFork", action: "DISASSEMBLE", startTransform: { position: [0.45, 0.5, 0], rotation: [0, 0, 0, 1] }, endTransform: { position: [0.45, 1.4, 0], rotation: [0, 0, 0, 1] }, tolerance: 0.05, hint: "Disconnect shift rail detent pin and pull shift fork vertically upwards.", safetyWarning: "Keep selector detent balls captured so springs do not eject." },
      { stepOrder: 2, partId: "synchro-ring", meshName: "SynchromeshRing", action: "DISASSEMBLE", startTransform: { position: [0.45, 0.25, 0], rotation: [0.7071, 0, 0, 0.7071] }, endTransform: { position: [1.2, 0.25, 0], rotation: [0.7071, 0, 0, 0.7071] }, tolerance: 0.03, hint: "Slide brass baulk ring off output shaft cone hub.", safetyWarning: "Inspect inner friction cone ridges for glazing." },
      { stepOrder: 3, partId: "output-shaft", meshName: "OutputShaft", action: "DISASSEMBLE", startTransform: { position: [0.45, 0.25, 0], rotation: [0.7071, 0, 0, 0.7071] }, endTransform: { position: [0.45, 0.25, 1.5], rotation: [0.7071, 0, 0, 0.7071] }, tolerance: 0.05, hint: "Extract output shaft rear bearing snap ring and pull shaft longitudinally.", safetyWarning: "Do not drop needle roller bearings seated under loose gears." }
    ]
  };

  fs.writeFileSync(path.join(outputDir, "gearbox.json"), JSON.stringify(metadata, null, 2));
  console.log(`✓ Built gearbox.glb (${glb.byteLength} bytes, ${triangles} tris)`);
}

async function buildLandingGearStrut(outputDir: string) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("LandingGearStrut");

  let triangles = 0;

  // 1. Main Outer Cylinder
  triangles += addPartToScene(doc, scene, buffer, "MainCylinder", "MainCylinder",
    createCylinder(0.24, 0.24, 1.8, 24), [0, 0.6, 0], [0, 0, 0, 1], [0.35, 0.38, 0.42], 0.7, 0.3);

  // 2. Oleo Inner Piston Tube
  triangles += addPartToScene(doc, scene, buffer, "OleoPiston", "OleoPiston",
    createCylinder(0.18, 0.18, 1.6, 24), [0, -0.4, 0], [0, 0, 0, 1], [0.95, 0.95, 0.98], 0.98, 0.08);

  // 3. Upper Torque Scissor Link
  triangles += addPartToScene(doc, scene, buffer, "UpperTorqueLink", "UpperTorqueLink",
    createBox(0.12, 0.6, 0.08), [0.32, 0.3, 0], [0, 0, 0.25, 0.968], [0.7, 0.75, 0.8], 0.8, 0.2);

  // 4. Lower Torque Scissor Link
  triangles += addPartToScene(doc, scene, buffer, "LowerTorqueLink", "LowerTorqueLink",
    createBox(0.12, 0.6, 0.08), [0.32, -0.2, 0], [0, 0, -0.25, 0.968], [0.7, 0.75, 0.8], 0.8, 0.2);

  // 5. Wheel Axle
  triangles += addPartToScene(doc, scene, buffer, "WheelAxle", "WheelAxle",
    createCylinder(0.1, 0.1, 1.4, 16), [0, -1.1, 0], [0.7071, 0, 0, 0.7071], [0.85, 0.85, 0.9], 0.95, 0.15);

  // 6. Left Wheel Tire
  triangles += addPartToScene(doc, scene, buffer, "Tire_Left", "Tire_Left",
    createCylinder(0.45, 0.45, 0.3, 24), [-0.55, -1.1, 0], [0.7071, 0, 0, 0.7071], [0.12, 0.12, 0.15], 0.1, 0.85);

  // 7. Right Wheel Tire
  triangles += addPartToScene(doc, scene, buffer, "Tire_Right", "Tire_Right",
    createCylinder(0.45, 0.45, 0.3, 24), [0.55, -1.1, 0], [0.7071, 0, 0, 0.7071], [0.12, 0.12, 0.15], 0.1, 0.85);

  // 8. Retract Actuator
  triangles += addPartToScene(doc, scene, buffer, "RetractActuator", "RetractActuator",
    createCylinder(0.12, 0.12, 1.1, 16), [-0.4, 1.1, 0], [0, 0, 0.38, 0.92], [0.95, 0.6, 0.1], 0.9, 0.2);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  fs.writeFileSync(path.join(outputDir, "landing_gear_strut.glb"), Buffer.from(glb));

  const metadata = {
    machineId: "landing-gear-strut",
    name: "Aircraft Oleo-Pneumatic Landing Gear Strut",
    category: "Aerospace Structural & Hydraulic Mechanisms",
    difficulty: "INTERMEDIATE",
    totalTriangles: triangles,
    glbAssetUrl: "/models/landing_gear_strut.glb",
    description: "Aircraft main shock absorber strut illustrating oleo-pneumatic nitrogen/oil kinetic energy dissipation and scissor torque link alignment.",
    parts: [
      { id: "main-cyl", meshName: "MainCylinder", displayName: "Outer Shock Cylinder", material: "300M Ultra-High-Strength Steel", function: "Airframe attachment trunnion holding high-pressure hydraulic fluid and nitrogen precharge.", massKg: 32.5, pivotOrigin: [0, 0.6, 0], kinematicType: "RIGID" },
      { id: "oleo-piston", meshName: "OleoPiston", displayName: "Hard-Chromed Oleo Piston", material: "Chromium-Plated 300M Steel", function: "Telescoping piston tube forcing hydraulic oil through dampening metering pin orifice.", massKg: 19.8, pivotOrigin: [0, -0.4, 0], kinematicType: "TRANSLATIONAL" },
      { id: "torque-upper", meshName: "UpperTorqueLink", displayName: "Upper Torque Scissor Link", material: "7075-T73 Aluminum Forging", function: "Transmits landing torsional and steering moments while allowing free vertical stroke.", massKg: 3.4, pivotOrigin: [0.32, 0.3, 0], kinematicType: "ROTATIONAL" },
      { id: "torque-lower", meshName: "LowerTorqueLink", displayName: "Lower Torque Scissor Link", material: "7075-T73 Aluminum Forging", function: "Pairs with upper scissor to prevent piston rotation inside cylinder during rollout.", massKg: 3.4, pivotOrigin: [0.32, -0.2, 0], kinematicType: "ROTATIONAL" },
      { id: "wheel-axle", meshName: "WheelAxle", displayName: "Dual Wheel Axle Sleeve", material: "Titanium Ti-10V-2Fe-3Al", function: "Supports precision tapered roller bearings for high-speed dual aircraft landing wheels.", massKg: 8.2, pivotOrigin: [0, -1.1, 0], kinematicType: "RIGID" },
      { id: "tire-left", meshName: "Tire_Left", displayName: "Left Main Wheel Assembly", material: "Reinforced Rubber & Beryllium-Copper Rim", function: "Provides runway touchdown friction and absorbs initial high-frequency bump impacts.", massKg: 24.0, pivotOrigin: [-0.55, -1.1, 0], kinematicType: "ROTATIONAL" },
      { id: "tire-right", meshName: "Tire_Right", displayName: "Right Main Wheel Assembly", material: "Reinforced Rubber & Beryllium-Copper Rim", function: "Co-axial landing gear tire maintaining dynamic directional tracking on touchdown.", massKg: 24.0, pivotOrigin: [0.55, -1.1, 0], kinematicType: "ROTATIONAL" },
      { id: "retract-act", meshName: "RetractActuator", displayName: "Hydraulic Retraction Actuator", material: "High-Pressure Hydraulic Steel", function: "Pivots entire landing gear strut into wing well cavity post-takeoff.", massKg: 7.6, pivotOrigin: [-0.4, 1.1, 0], kinematicType: "ROTATIONAL" }
    ],
    hierarchy: {
      root: "MainCylinder",
      children: [
        { node: "RetractActuator", children: [] },
        { node: "UpperTorqueLink", children: ["LowerTorqueLink"] },
        { node: "OleoPiston", children: [
          { node: "WheelAxle", children: ["Tire_Left", "Tire_Right"] }
        ]}
      ]
    },
    explodedView: {
      MainCylinder: [0, 0.5, 0],
      OleoPiston: [0, -0.8, 0],
      UpperTorqueLink: [0.8, 0.3, 0],
      LowerTorqueLink: [0.8, -0.2, 0],
      WheelAxle: [0, -1.2, 0],
      Tire_Left: [-1.1, -1.1, 0],
      Tire_Right: [1.1, -1.1, 0],
      RetractActuator: [-0.9, 1.1, 0]
    },
    assemblySteps: [
      { stepOrder: 1, partId: "torque-upper", meshName: "UpperTorqueLink", action: "DISASSEMBLE", startTransform: { position: [0.32, 0.3, 0], rotation: [0, 0, 0.25, 0.968] }, endTransform: { position: [1.1, 0.3, 0], rotation: [0, 0, 0, 1] }, tolerance: 0.05, hint: "Remove cotter pin and unthread center apex hinge bolt connecting torque scissors.", safetyWarning: "Release hydraulic pressure before servicing scissor linkages." },
      { stepOrder: 2, partId: "tire-left", meshName: "Tire_Left", action: "DISASSEMBLE", startTransform: { position: [-0.55, -1.1, 0], rotation: [0.7071, 0, 0, 0.7071] }, endTransform: { position: [-1.4, -1.1, 0], rotation: [0.7071, 0, 0, 0.7071] }, tolerance: 0.05, hint: "Loosen wheel axle retaining nut and slide left tire outward along lateral axis.", safetyWarning: "Ensure gear is placed on jacks and safety blocks." },
      { stepOrder: 3, partId: "oleo-piston", meshName: "OleoPiston", action: "DISASSEMBLE", startTransform: { position: [0, -0.4, 0], rotation: [0, 0, 0, 1] }, endTransform: { position: [0, -1.6, 0], rotation: [0, 0, 0, 1] }, tolerance: 0.04, hint: "Depressurize nitrogen charge valve and slide lower piston assembly out of cylinder.", safetyWarning: "HIGH PRESSURE HAZARD. Verify gauge reads 0 PSI before unthreading gland seal." }
    ]
  };

  fs.writeFileSync(path.join(outputDir, "landing_gear_strut.json"), JSON.stringify(metadata, null, 2));
  console.log(`✓ Built landing_gear_strut.glb (${glb.byteLength} bytes, ${triangles} tris)`);
}

async function buildTurbineStage(outputDir: string) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("TurbineStage");

  let triangles = 0;

  // 1. Turbine Outer Shroud Casing
  triangles += addPartToScene(doc, scene, buffer, "TurbineCasing", "TurbineCasing",
    createCylinder(0.9, 0.9, 0.8, 32), [0, 0, 0], [0.7071, 0, 0, 0.7071], [0.35, 0.38, 0.45], 0.6, 0.4);

  // 2. Stator Vane Ring
  triangles += addPartToScene(doc, scene, buffer, "StatorVaneRing", "StatorVaneRing",
    createCylinder(0.85, 0.85, 0.25, 32), [0, 0, -0.22], [0.7071, 0, 0, 0.7071], [0.2, 0.8, 0.95], 0.9, 0.2);

  // 3. Rotor Disk
  triangles += addPartToScene(doc, scene, buffer, "RotorDisk", "RotorDisk",
    createCylinder(0.48, 0.48, 0.22, 28), [0, 0, 0.18], [0.7071, 0, 0, 0.7071], [0.95, 0.75, 0.2], 0.95, 0.15);

  // 4. Rotor Blades Array
  triangles += addPartToScene(doc, scene, buffer, "RotorBlades", "RotorBlades",
    createGear(0.86, 0.48, 0.2, 16), [0, 0, 0.18], [0.7071, 0, 0, 0.7071], [0.98, 0.45, 0.1], 0.9, 0.18);

  // 5. Central Drive Shaft Spindle
  triangles += addPartToScene(doc, scene, buffer, "ShaftSpindle", "ShaftSpindle",
    createCylinder(0.14, 0.14, 1.8, 20), [0, 0, 0], [0.7071, 0, 0, 0.7071], [0.88, 0.88, 0.92], 0.95, 0.12);

  // 6. Combustor Transition Liner
  triangles += addPartToScene(doc, scene, buffer, "CombustorLiner", "CombustorLiner",
    createCylinder(0.82, 0.65, 0.4, 28), [0, 0, -0.55], [0.7071, 0, 0, 0.7071], [0.75, 0.65, 0.55], 0.4, 0.6);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  fs.writeFileSync(path.join(outputDir, "turbine_stage.glb"), Buffer.from(glb));

  const metadata = {
    machineId: "turbine-stage",
    name: "Axial Flow Gas Turbine Stage",
    category: "Aerospace Propulsion & Turbomachinery",
    difficulty: "ADVANCED",
    totalTriangles: triangles,
    glbAssetUrl: "/models/turbine_stage.glb",
    description: "High-pressure axial gas turbine stage demonstrating stationary nozzle guide vane expansion, supersonic aerofoil rotor blade deflection, and shaft work extraction.",
    parts: [
      { id: "turbine-casing", meshName: "TurbineCasing", displayName: "Annular Containment Casing", material: "Waspaloy Nickel-Base Superalloy", function: "High-temperature outer shroud maintaining critical tip clearance (0.5mm) over rotating blades.", massKg: 42.0, pivotOrigin: [0, 0, 0], kinematicType: "RIGID" },
      { id: "stator-vane", meshName: "StatorVaneRing", displayName: "Nozzle Guide Vane Stator Ring", material: "CMSX-4 Single-Crystal Superalloy", function: "Stationary aerofoils accelerating and turning hot combustor gas into the rotor at optimum angle.", massKg: 18.5, pivotOrigin: [0, 0, -0.22], kinematicType: "RIGID" },
      { id: "rotor-disk", meshName: "RotorDisk", displayName: "Blisk Turbine Rotor Disk", material: "Forged Udimet 720LI", function: "Holds turbine blades via fir-tree root slots; sustains extreme centrifugal rotational stress (15,000 RPM).", massKg: 28.0, pivotOrigin: [0, 0, 0.18], kinematicType: "ROTATIONAL" },
      { id: "rotor-blades", meshName: "RotorBlades", displayName: "Cooled Aerofoil Rotor Blades", material: "Single-Crystal Inconel 718 with Ceramic TBC", function: "Extracts enthalpy from high-speed gas stream, generating rotational shaft power.", massKg: 12.4, pivotOrigin: [0, 0, 0.18], kinematicType: "ROTATIONAL" },
      { id: "shaft-spindle", meshName: "ShaftSpindle", displayName: "Central Hollow Drive Shaft", material: "Maraging Steel 300", function: "Transmits extracted turbine shaft work forward to drive compressor stages and generator.", massKg: 14.6, pivotOrigin: [0, 0, 0], kinematicType: "ROTATIONAL" },
      { id: "combustor-liner", meshName: "CombustorLiner", displayName: "Combustor Transition Duct", material: "Hastelloy X Superalloy", function: "Channels 1,400°C primary gas from combustor burner cans directly into turbine inlet.", massKg: 9.8, pivotOrigin: [0, 0, -0.55], kinematicType: "RIGID" }
    ],
    hierarchy: {
      root: "TurbineCasing",
      children: [
        { node: "CombustorLiner", children: [] },
        { node: "StatorVaneRing", children: [] },
        { node: "ShaftSpindle", children: [
          { node: "RotorDisk", children: ["RotorBlades"] }
        ]}
      ]
    },
    explodedView: {
      TurbineCasing: [0, 0, 0],
      CombustorLiner: [0, 0, -1.3],
      StatorVaneRing: [0, 0, -0.8],
      RotorDisk: [0, 0, 0.9],
      RotorBlades: [0, 0, 1.2],
      ShaftSpindle: [0, 0, 1.8]
    },
    assemblySteps: [
      { stepOrder: 1, partId: "combustor-liner", meshName: "CombustorLiner", action: "DISASSEMBLE", startTransform: { position: [0, 0, -0.55], rotation: [0.7071, 0, 0, 0.7071] }, endTransform: { position: [0, 0, -1.6], rotation: [0.7071, 0, 0, 0.7071] }, tolerance: 0.05, hint: "Unclamp transition duct V-band clamp and slide forward.", safetyWarning: "Inspect ceramic thermal barrier coating for spallation." },
      { stepOrder: 2, partId: "stator-vane", meshName: "StatorVaneRing", action: "DISASSEMBLE", startTransform: { position: [0, 0, -0.22], rotation: [0.7071, 0, 0, 0.7071] }, endTransform: { position: [0, 0, -1.0], rotation: [0.7071, 0, 0, 0.7071] }, tolerance: 0.04, hint: "Release anti-rotation retaining dogs and extract stator vane segments.", safetyWarning: "Handle cooling air supply tubes with care." },
      { stepOrder: 3, partId: "rotor-disk", meshName: "RotorDisk", action: "DISASSEMBLE", startTransform: { position: [0, 0, 0.18], rotation: [0.7071, 0, 0, 0.7071] }, endTransform: { position: [0, 0, 1.4], rotation: [0.7071, 0, 0, 0.7071] }, tolerance: 0.03, hint: "Unthread high-torque curvic coupling locknut and pull rotor disk off shaft splines.", safetyWarning: "Protect blade tips from impacts against casing shroud." }
    ]
  };

  fs.writeFileSync(path.join(outputDir, "turbine_stage.json"), JSON.stringify(metadata, null, 2));
  console.log(`✓ Built turbine_stage.glb (${glb.byteLength} bytes, ${triangles} tris)`);
}

async function main() {
  const publicModelsDir = path.resolve("apps/web/public/models");
  if (!fs.existsSync(publicModelsDir)) {
    fs.mkdirSync(publicModelsDir, { recursive: true });
  }

  console.log("🚀 Starting Phase 3 3D Asset Pipeline Generator...");
  await buildSingleCylinderEngine(publicModelsDir);
  await buildGearbox(publicModelsDir);
  await buildLandingGearStrut(publicModelsDir);
  await buildTurbineStage(publicModelsDir);

  // Also duplicate JSONs into packages/shared/src/data/ for typed imports
  const sharedDataDir = path.resolve("packages/shared/src/data");
  if (!fs.existsSync(sharedDataDir)) {
    fs.mkdirSync(sharedDataDir, { recursive: true });
  }

  for (const file of ["single_cylinder_engine.json", "gearbox.json", "landing_gear_strut.json", "turbine_stage.json"]) {
    fs.copyFileSync(path.join(publicModelsDir, file), path.join(sharedDataDir, file));
  }
  console.log("✅ All 4 starter models & metadata JSONs successfully compiled and landed!");
}

main().catch(err => {
  console.error("Pipeline failure:", err);
  process.exit(1);
});
