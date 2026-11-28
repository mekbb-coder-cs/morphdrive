export interface DisassemblyRule {
  meshName: string;
  displayName: string;
  blockers: string[]; // Mesh names that must be disassembled BEFORE this part
  extractionVector: [number, number, number]; // Direction and distance for disassembly
  toolRequired: string;
  hint: string;
  orderPriority: number; // Optimal step order for guided mode
}

export interface MachineDisassemblyDAG {
  machineId: string;
  rules: Record<string, DisassemblyRule>;
  optimalSequence: string[]; // Array of meshNames in recommended removal order
}

export const MACHINE_DAGS: Record<string, MachineDisassemblyDAG> = {
  "single-cylinder-engine": {
    machineId: "single-cylinder-engine",
    optimalSequence: [
      "SparkPlug",
      "IntakeValve",
      "ExhaustValve",
      "CylinderHead",
      "WristPin",
      "Piston",
      "ConnectingRod",
      "Crankshaft",
      "EngineBlock_Crankcase",
    ],
    rules: {
      "SparkPlug": {
        meshName: "SparkPlug",
        displayName: "High-Energy Spark Plug",
        blockers: [],
        extractionVector: [0, 1.8, 0],
        toolRequired: "16mm Deep Magnetic Spark Plug Socket",
        hint: "Thread out the spark plug vertically from the top cylinder head chamber.",
        orderPriority: 1,
      },
      "IntakeValve": {
        meshName: "IntakeValve",
        displayName: "Intake Poppet Valve",
        blockers: [],
        extractionVector: [-0.4, 1.5, 0],
        toolRequired: "Valve Spring Compressor",
        hint: "Compress the valve spring to release keeper collets and slide the intake valve out.",
        orderPriority: 2,
      },
      "ExhaustValve": {
        meshName: "ExhaustValve",
        displayName: "Exhaust Poppet Valve",
        blockers: [],
        extractionVector: [0.4, 1.5, 0],
        toolRequired: "Valve Spring Compressor",
        hint: "Compress the exhaust valve spring and extract the Inconel valve stem.",
        orderPriority: 3,
      },
      "CylinderHead": {
        meshName: "CylinderHead",
        displayName: "Cylinder Head",
        blockers: ["SparkPlug", "IntakeValve", "ExhaustValve"],
        extractionVector: [0, 1.2, 0],
        toolRequired: "Torque Wrench (12mm Hex Bit)",
        hint: "Unbolt the cylinder head studs in a cross-pattern after clearing the valves and plug.",
        orderPriority: 4,
      },
      "WristPin": {
        meshName: "WristPin",
        displayName: "Hardened Gudgeon Pin",
        blockers: ["CylinderHead"],
        extractionVector: [1.2, 0, 0],
        toolRequired: "Wrist Pin Extractor Drift",
        hint: "Remove the circlips and press the wrist pin laterally through the piston skirt.",
        orderPriority: 5,
      },
      "Piston": {
        meshName: "Piston",
        displayName: "Crown Piston",
        blockers: ["CylinderHead", "WristPin"],
        extractionVector: [0, 1.4, 0],
        toolRequired: "Non-Marring Brass Drift",
        hint: "Slide the piston crown upward out of the cylinder bore.",
        orderPriority: 6,
      },
      "ConnectingRod": {
        meshName: "ConnectingRod",
        displayName: "I-Beam Connecting Rod",
        blockers: ["CylinderHead", "Piston", "WristPin"],
        extractionVector: [0, 0.4, 1.2],
        toolRequired: "12-Point 10mm Rod Bolt Socket",
        hint: "Unbolt the rod big-end cap from the crank journal and slide the rod out.",
        orderPriority: 7,
      },
      "Crankshaft": {
        meshName: "Crankshaft",
        displayName: "Balanced Crankshaft",
        blockers: ["ConnectingRod", "CylinderHead"],
        extractionVector: [0, -1.0, 0],
        toolRequired: "Main Bearing Puller",
        hint: "Release main journal bearing caps and drop the counterbalanced crankshaft.",
        orderPriority: 8,
      },
      "EngineBlock_Crankcase": {
        meshName: "EngineBlock_Crankcase",
        displayName: "Engine Block Crankcase",
        blockers: ["Crankshaft", "CylinderHead", "ConnectingRod", "Piston"],
        extractionVector: [0, 0, 0],
        toolRequired: "Engine Stand Mount",
        hint: "Bare structural crankcase remaining on engine stand.",
        orderPriority: 9,
      },
    },
  },

  "gearbox": {
    machineId: "gearbox",
    optimalSequence: [
      "TransmissionCase",
      "ShiftFork",
      "SynchromeshRing",
      "DriveGear_2nd",
      "DriveGear_1st",
      "Countershaft",
      "InputShaft",
      "OutputShaft",
    ],
    rules: {
      "TransmissionCase": {
        meshName: "TransmissionCase",
        displayName: "Transmission Housing Casing",
        blockers: [],
        extractionVector: [0, 1.4, 0],
        toolRequired: "Pneumatic Impact Driver (13mm Socket)",
        hint: "Remove perimeter casing bolts and lift off the upper transmission housing.",
        orderPriority: 1,
      },
      "ShiftFork": {
        meshName: "ShiftFork",
        displayName: "Selector Shift Fork",
        blockers: ["TransmissionCase"],
        extractionVector: [0, 0.8, -0.6],
        toolRequired: "Roll Pin Punch (4mm)",
        hint: "Drive out the selector rail roll pin and pull the shift fork off the collar.",
        orderPriority: 2,
      },
      "SynchromeshRing": {
        meshName: "SynchromeshRing",
        displayName: "Synchromesh Baulk Ring",
        blockers: ["TransmissionCase", "ShiftFork"],
        extractionVector: [0, 0, 1.0],
        toolRequired: "Snap Ring Pliers",
        hint: "Slide the splined dog clutch engagement ring axially along the main shaft.",
        orderPriority: 3,
      },
      "DriveGear_2nd": {
        meshName: "DriveGear_2nd",
        displayName: "2nd Speed Driven Gear",
        blockers: ["TransmissionCase", "SynchromeshRing"],
        extractionVector: [0, 0.9, 0],
        toolRequired: "Bearing & Gear Splitter Puller",
        hint: "Extract the cruising speed gear and its needle roller cage.",
        orderPriority: 4,
      },
      "DriveGear_1st": {
        meshName: "DriveGear_1st",
        displayName: "1st Speed Driven Gear",
        blockers: ["TransmissionCase", "DriveGear_2nd"],
        extractionVector: [0, 0.9, -0.3],
        toolRequired: "Mechanical 3-Jaw Gear Puller",
        hint: "Pull the high-reduction 1st gear off the main output shaft.",
        orderPriority: 5,
      },
      "Countershaft": {
        meshName: "Countershaft",
        displayName: "Laygear Countershaft",
        blockers: ["TransmissionCase", "DriveGear_1st"],
        extractionVector: [0, -0.9, 0],
        toolRequired: "Hydraulic Press Adapter",
        hint: "Drop the countershaft cluster gear assembly from its tapered roller bearing seats.",
        orderPriority: 6,
      },
      "InputShaft": {
        meshName: "InputShaft",
        displayName: "Primary Input Shaft",
        blockers: ["TransmissionCase", "Countershaft"],
        extractionVector: [0, 0, -1.2],
        toolRequired: "Internal Slide Hammer Puller",
        hint: "Slide the primary input shaft forward through the bellhousing bore.",
        orderPriority: 7,
      },
      "OutputShaft": {
        meshName: "OutputShaft",
        displayName: "Main Output Shaft",
        blockers: ["TransmissionCase", "DriveGear_1st", "DriveGear_2nd", "Countershaft"],
        extractionVector: [0, 0, 1.2],
        toolRequired: "Mainshaft Retaining Ring Spanner",
        hint: "Withdraw the main splined transmission output shaft.",
        orderPriority: 8,
      },
    },
  },

  "landing-gear-strut": {
    machineId: "landing-gear-strut",
    optimalSequence: [
      "RetractActuator",
      "Tire_Left",
      "Tire_Right",
      "WheelAxle",
      "LowerTorqueLink",
      "UpperTorqueLink",
      "OleoPiston",
      "MainCylinder",
    ],
    rules: {
      "RetractActuator": {
        meshName: "RetractActuator",
        displayName: "Hydraulic Retract Actuator",
        blockers: [],
        extractionVector: [-0.6, 0.6, 0],
        toolRequired: "Hydraulic Line Flare Wrench & Pin Punch",
        hint: "Disconnect hydraulic pressure lines and remove the upper trunnion pivot pin.",
        orderPriority: 1,
      },
      "Tire_Left": {
        meshName: "Tire_Left",
        displayName: "Left Main Wheel & Tire",
        blockers: ["RetractActuator"],
        extractionVector: [-1.2, 0, 0],
        toolRequired: "Wheel Hub Locknut Socket (45mm)",
        hint: "Remove wheel hub lock wire and pull the left tire off the axle spindle.",
        orderPriority: 2,
      },
      "Tire_Right": {
        meshName: "Tire_Right",
        displayName: "Right Main Wheel & Tire",
        blockers: ["RetractActuator"],
        extractionVector: [1.2, 0, 0],
        toolRequired: "Wheel Hub Locknut Socket (45mm)",
        hint: "Remove wheel hub lock wire and slide the right wheel off the axle.",
        orderPriority: 3,
      },
      "WheelAxle": {
        meshName: "WheelAxle",
        displayName: "Bogie Wheel Axle Spindle",
        blockers: ["Tire_Left", "Tire_Right"],
        extractionVector: [1.0, 0, 0],
        toolRequired: "Axle Retaining Clamp Spanner",
        hint: "Release bogie clamp bolts and slide the high-strength steel axle out.",
        orderPriority: 4,
      },
      "LowerTorqueLink": {
        meshName: "LowerTorqueLink",
        displayName: "Lower Torque Scissor Link",
        blockers: ["WheelAxle"],
        extractionVector: [0.8, -0.4, 0],
        toolRequired: "Torque Link Bushing Extractor",
        hint: "Press out the scissor apex joint bolt and dismount the lower torque arm.",
        orderPriority: 5,
      },
      "UpperTorqueLink": {
        meshName: "UpperTorqueLink",
        displayName: "Upper Torque Scissor Link",
        blockers: ["LowerTorqueLink"],
        extractionVector: [0.8, 0.4, 0],
        toolRequired: "Trunnion Pin Drift",
        hint: "Release the upper cylinder lug hinge pin to detach the scissor link.",
        orderPriority: 6,
      },
      "OleoPiston": {
        meshName: "OleoPiston",
        displayName: "Hard-Chromed Oleo Piston",
        blockers: ["WheelAxle", "LowerTorqueLink", "UpperTorqueLink"],
        extractionVector: [0, -1.5, 0],
        toolRequired: "Cylinder Gland Nut Spanner",
        hint: "Depressurize nitrogen chamber, unscrew gland nut, and withdraw oleo piston.",
        orderPriority: 7,
      },
      "MainCylinder": {
        meshName: "MainCylinder",
        displayName: "Outer Shock Cylinder",
        blockers: ["OleoPiston", "UpperTorqueLink", "RetractActuator"],
        extractionVector: [0, 0, 0],
        toolRequired: "Airframe Hoist Sling",
        hint: "Outer trunnion containment cylinder remaining in maintenance cradle.",
        orderPriority: 8,
      },
    },
  },

  "turbine-stage": {
    machineId: "turbine-stage",
    optimalSequence: [
      "CombustorLiner",
      "TurbineCasing",
      "StatorVaneRing",
      "RotorBlades",
      "RotorDisk",
      "ShaftSpindle",
    ],
    rules: {
      "CombustorLiner": {
        meshName: "CombustorLiner",
        displayName: "Annular Combustor Liner",
        blockers: [],
        extractionVector: [0, 0, -1.4],
        toolRequired: "Diffuser Clamp Release Spanner",
        hint: "Disconnect thermal sensor fittings and withdraw combustor flame tube axially forward.",
        orderPriority: 1,
      },
      "TurbineCasing": {
        meshName: "TurbineCasing",
        displayName: "Annular Containment Casing",
        blockers: ["CombustorLiner"],
        extractionVector: [0, 1.4, 0],
        toolRequired: "Hydraulic Flange Splitter & Crane Rig",
        hint: "Unbolt the circumferential split flange bolts and hoist the containment shroud.",
        orderPriority: 2,
      },
      "StatorVaneRing": {
        meshName: "StatorVaneRing",
        displayName: "Nozzle Guide Vane Stator Ring",
        blockers: ["TurbineCasing"],
        extractionVector: [0, 0, -1.2],
        toolRequired: "Stator Guide Rail Alignment Tool",
        hint: "Slide the segmented nozzle guide vane ring axially along the casing guides.",
        orderPriority: 3,
      },
      "RotorBlades": {
        meshName: "RotorBlades",
        displayName: "Aerofoil Turbine Blades Set",
        blockers: ["TurbineCasing"],
        extractionVector: [0, 0, 1.2],
        toolRequired: "Fir-Tree Root Sliding Drift",
        hint: "Release blade retaining lock plates and slide aerofoil blades from fir-tree roots.",
        orderPriority: 4,
      },
      "RotorDisk": {
        meshName: "RotorDisk",
        displayName: "Blisk Turbine Rotor Disk",
        blockers: ["TurbineCasing", "RotorBlades"],
        extractionVector: [0, 0, 1.0],
        toolRequired: "Turbine Rotor Hub Hydraulic Puller",
        hint: "Unscrew the central tie shaft locknut and slide the rotor disk off spline.",
        orderPriority: 5,
      },
      "ShaftSpindle": {
        meshName: "ShaftSpindle",
        displayName: "Central Turbine Drive Spindle",
        blockers: ["TurbineCasing", "RotorDisk", "StatorVaneRing"],
        extractionVector: [0, 0, 0],
        toolRequired: "Bearing Support Cradle",
        hint: "Central drive shaft supported on journal bearings.",
        orderPriority: 6,
      },
    },
  },
};

/**
 * Validates whether a part can be disassembled according to DAG blockers.
 */
export function checkDisassemblyRule(
  machineId: string,
  meshName: string,
  disassembledParts: string[]
): {
  allowed: boolean;
  unresolvedBlockers: string[];
  rule: DisassemblyRule | null;
} {
  const dag = MACHINE_DAGS[machineId];
  if (!dag) return { allowed: true, unresolvedBlockers: [], rule: null };

  const rule = dag.rules[meshName];
  if (!rule) return { allowed: true, unresolvedBlockers: [], rule: null };

  const unresolvedBlockers = rule.blockers.filter(
    (b) => !disassembledParts.includes(b)
  );

  return {
    allowed: unresolvedBlockers.length === 0,
    unresolvedBlockers,
    rule,
  };
}

/**
 * Gets all parts that are currently eligible for disassembly (all blockers satisfied).
 */
export function getRemovableParts(
  machineId: string,
  disassembledParts: string[]
): string[] {
  const dag = MACHINE_DAGS[machineId];
  if (!dag) return [];

  return Object.keys(dag.rules).filter((meshName) => {
    if (disassembledParts.includes(meshName)) return false;
    const { allowed } = checkDisassemblyRule(machineId, meshName, disassembledParts);
    return allowed;
  });
}
