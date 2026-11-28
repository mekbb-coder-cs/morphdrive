export interface TutorialStep {
  stepNumber: number;
  title: string;
  targetMeshName: string;
  partDisplayName: string;
  summary: string;
  mechanicalPrinciples: string;
  inspectionCriteria: string[];
  toolsRequired: string[];
  safetyWarnings: string[];
  calloutBadge: string;
}

export interface MachineTutorial {
  machineId: string;
  title: string;
  overview: string;
  estimatedMinutes: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  steps: TutorialStep[];
}

export interface QuizQuestion {
  id: string;
  machineId: string;
  type: "IDENTIFICATION" | "FUNCTION" | "MATERIAL" | "MAINTENANCE";
  targetMeshName: string;
  partDisplayName: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  referenceStandard?: string;
}

export interface ComponentFunctionCard {
  id: string;
  machineId: string;
  meshName: string;
  displayName: string;
  category: "Structural" | "Kinematic" | "Hydraulic" | "Thermal" | "Fastening";
  primaryFunction: string;
  material: string;
  massKg: number;
  yieldStrengthMpa: number;
  operatingTempRange: string;
  commonFailureModes: string[];
  inspectionIntervalHours: number;
  inspectionMethod: string;
  lubricationSpec: string;
}

export interface GlossaryTerm {
  term: string;
  category: "Aerospace" | "Hydraulics" | "Thermodynamics" | "Kinematics" | "Materials" | "Maintenance" | "Fasteners";
  definition: string;
  applicationExample: string;
  relatedParts: string[];
}

export interface MaintenanceProcedure {
  id: string;
  machineId: string;
  title: string;
  ataChapter: string;
  applicableAircraft: string;
  intervalRequirement: string;
  requiredPersonnel: string;
  ppeRequired: string[];
  specialTools: string[];
  safetyPrecautions: string[];
  steps: {
    step: number;
    action: string;
    acceptanceTolerance: string;
    criticalNotes?: string;
  }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Step-by-Step Tutorials
// ─────────────────────────────────────────────────────────────────────────────
export const TUTORIALS_DATA: Record<string, MachineTutorial> = {
  "landing-gear-strut": {
    machineId: "landing-gear-strut",
    title: "Aircraft Oleo-Pneumatic Strut Inspection & Teardown Protocol",
    overview:
      "Master the kinematics and hydraulic damping mechanics of aerospace shock struts. Understand how dry nitrogen and MIL-PRF-5606 fluid dissipate touchdown energy while torque links resist yaw moments during rollout.",
    estimatedMinutes: 20,
    difficulty: "INTERMEDIATE",
    steps: [
      {
        stepNumber: 1,
        title: "Retract Actuator Depressurization & Trunnion Pin Extraction",
        targetMeshName: "RetractActuator",
        partDisplayName: "Hydraulic Retract Actuator",
        summary:
          "Safely isolate and mechanically decouple the primary hydraulic retraction ram from the airframe trunnion attachment.",
        mechanicalPrinciples:
          "The retract actuator is a double-acting hydraulic piston operating at 3,000 PSI (20.7 MPa). Decoupling requires zero hydraulic pressure in both extend and retract lines before pivot pin removal.",
        inspectionCriteria: [
          "Check cylinder chrome plating for pitting, scoring, or hydraulic weeping.",
          "Inspect trunnion spherical bearings for radial play > 0.005 in (0.127 mm).",
          "Ensure secondary mechanical locking uplatch engages freely without binding.",
        ],
        toolsRequired: [
          "Hydraulic Line Flare Wrench (7/16 in)",
          "Trunnion Pin Brass Drift & Dead-Blow Mallet",
          "Pressure Relief Bleeder Hose",
        ],
        safetyWarnings: [
          "HIGH PRESSURE HYDRAULIC FLUID: Never disconnect fittings under pressure. Fluid injection through skin causes severe toxic necrosis.",
          "Install gear ground lock downlock pins before touching actuator linkages.",
        ],
        calloutBadge: "Actuator Lug Pin",
      },
      {
        stepNumber: 2,
        title: "Dual Main Wheel Assembly Demounting & Hub Lock Inspection",
        targetMeshName: "Tire_Left",
        partDisplayName: "Left & Right Main Wheels & Tires",
        summary:
          "Deflate aircraft tires, cut safety lockwire, back off the 45mm axle nut, and withdraw wheel assemblies from the high-strength axle spindle.",
        mechanicalPrinciples:
          "Aircraft tires carry nitrogen at 180-220 PSI. Radial touchdown velocities impose instantaneous spin-up torque from 0 to 160 knots, requiring tapered roller bearings packed with synthetic grease (MIL-PRF-81322).",
        inspectionCriteria: [
          "Confirm zero tire nitrogen pressure before loosening axle retaining locknut.",
          "Inspect tire tread for FOD cuts, uneven shoulder wear, and thermal flat spots.",
          "Examine fusible plug thermal release cores for signs of brake overheat.",
        ],
        toolsRequired: [
          "Deflation Cap & Nitrogen Valve Core Tool",
          "45mm Axle Locknut Hex Socket & Torque Multiplier",
          "Wheel Dolly / Cradle",
        ],
        safetyWarnings: [
          "EXPLOSION HAZARD: Always verify complete tire deflation before loosening axle nuts. A cracked wheel rim under pressure can cause lethal shrapnel.",
        ],
        calloutBadge: "Wheel Spindle Hub",
      },
      {
        stepNumber: 3,
        title: "Axle Spindle Extraction & Non-Destructive Flaw Verification",
        targetMeshName: "WheelAxle",
        partDisplayName: "Bogie Wheel Axle Spindle",
        summary:
          "Release the axle clamping bolts on the lower oleo piston fork and laterally slide the titanium alloy axle sleeve out.",
        mechanicalPrinciples:
          "The axle undergoes severe cyclic reverse bending moments on every takeoff/landing cycle. Ti-10V-2Fe-3Al titanium alloy provides high fracture toughness and zero galvanic corrosion potential against aluminum wheels.",
        inspectionCriteria: [
          "Perform Eddy Current (ET) inspection along the inner radius fillet transitions.",
          "Verify axle straightness within 0.002 in (0.05 mm) runout on V-blocks.",
          "Check bearing landing surfaces for fretting corrosion or micro-galling.",
        ],
        toolsRequired: [
          "Axle Pinch Bolt Socket (9/16 in)",
          "Slide Hammer with Internal Expanding Collet",
          "Dial Test Indicator (DTI) & V-Block Set",
        ],
        safetyWarnings: [
          "Support the axle evenly to prevent cocking and binding in the piston fork bores.",
        ],
        calloutBadge: "Axle Bore Bearing Seats",
      },
      {
        stepNumber: 4,
        title: "Torque Scissor Linkage Apex Disconnection & Bushing Tolerance",
        targetMeshName: "LowerTorqueLink",
        partDisplayName: "Lower & Upper Torque Scissor Links",
        summary:
          "Disassemble the center scissor hinge apex bolt and examine the aluminum-bronze bushings for radial backlash.",
        mechanicalPrinciples:
          "Torque links form a planar 1-DOF scissor mechanism that permits vertical oleo piston translation while transmitting steering torque and preventing wheel shimmy vibrations.",
        inspectionCriteria: [
          "Measure apex bushing radial clearance: replace if diametrical play exceeds 0.004 in.",
          "Inspect link forgings for stress corrosion cracking (SCC) around grease zerk ports.",
          "Check shimmy damper attachment brackets for crack initiation.",
        ],
        toolsRequired: [
          "Torque Link Bushing Extractor / Press",
          "Internal Telescoping Micrometer & 0-1 in Outside Micrometer",
          "Safety Cable Pliers",
        ],
        safetyWarnings: [
          "Pinch hazard between scissor arms. Keep hands clear of scissor pinch zone during movement.",
        ],
        calloutBadge: "Scissor Apex Hinge",
      },
      {
        stepNumber: 5,
        title: "Oleo Piston Gland Nut Removal & Hydraulic Metering Pin Inspection",
        targetMeshName: "OleoPiston",
        partDisplayName: "Hard-Chromed Oleo Piston & Metering Pin",
        summary:
          "Depressurize the nitrogen chamber through the Schrader valve, unscrew the gland retaining nut, and extract the telescoping piston.",
        mechanicalPrinciples:
          "During compression, hydraulic oil is forced through an annular orifice constricted by a tapered metering pin. Dissipated kinetic energy equals the integral of orifice pressure drop multiplied by volumetric flow rate: E = ∫ ΔP · Q dt.",
        inspectionCriteria: [
          "Examine hard chromium plating along 300M steel piston tube for micro-cracks or flaking.",
          "Inspect dynamic chevron seal stack and PTFE backup rings for extrusion damage.",
          "Check tapered metering pin orifice contour for cavitation erosion.",
        ],
        toolsRequired: [
          "Strut Nitrogen Bleed Charging Kit",
          "Gland Nut C-Spanner Wrench",
          "Optical Boroscope with 90° Prism Probe",
        ],
        safetyWarnings: [
          "LETHAL PRESSURE: Verify 0 PSI chamber pressure using certified gauge before loosening gland nut. Residual nitrogen can project the piston like a cannon.",
        ],
        calloutBadge: "Metering Orifice Gland",
      },
    ],
  },
  "turbine-stage": {
    machineId: "turbine-stage",
    title: "High-Pressure Gas Turbine Stage Hot-Section Overhaul",
    overview:
      "Investigate aerothermal energy conversion in aviation gas turbines. Study Inconel-718 turbine disks, single-crystal fir-tree aerofoils, and thermal barrier ceramic coatings operating above metal melting points.",
    estimatedMinutes: 25,
    difficulty: "ADVANCED",
    steps: [
      {
        stepNumber: 1,
        title: "Combustor Liner Axial Extraction & Thermal Coating Evaluation",
        targetMeshName: "CombustorLiner",
        partDisplayName: "Annular Combustor Flame Tube",
        summary:
          "Release fuel nozzle clamps, withdraw igniter plugs, and slide the thermal barrier coated combustor liner axially forward.",
        mechanicalPrinciples:
          "Combustor gas temperatures reach 1,800°C (3,270°F). Yttria-stabilized zirconia (YSZ) thermal barrier coatings (TBC) reduce base nickel alloy metal temperatures by up to 150°C via effusion cooling film holes.",
        inspectionCriteria: [
          "Map TBC spallation: areas exceeding 0.25 sq in require liner replacement.",
          "Inspect dilution air swirlers for carbon deposition and thermal warping.",
          "Check liner seam weld zones for thermal fatigue micro-cracking.",
        ],
        toolsRequired: [
          "Igniter Plug Deep Socket (1 in)",
          "Borescope Video Inspection Kit",
          "Eddy Current Surface Probe",
        ],
        safetyWarnings: [
          "Allow turbine hot section minimum 3 hours cooldown before handling components.",
          "Ceramic dust hazard: wear FFP3 respirator when inspecting spalled coatings.",
        ],
        calloutBadge: "Effusion Cooling Swirler",
      },
      {
        stepNumber: 2,
        title: "Annular Containment Casing Split & Shroud Clearance Check",
        targetMeshName: "TurbineCasing",
        partDisplayName: "Containment Shroud Casing",
        summary:
          "Unbolt the circumferential split-line fasteners and hoist the forged containment casing off the turbine stage.",
        mechanicalPrinciples:
          "The containment casing must contain a released blade at 15,000 RPM (blade containment FAA 14 CFR § 33.19). Aramid/Kevlar or thick-wall Inconel 718 dissipates the 40 kJ impact energy.",
        inspectionCriteria: [
          "Measure radial tip clearance between blade aerofoils and abradable honeycomb shroud.",
          "Inspect casing bolt holes for thread shear or oblong deformation.",
          "Verify containment ring freedom from oxidation scaling.",
        ],
        toolsRequired: [
          "Hydraulic Torque Wrench (1/2 in drive)",
          "Overhead Engine Hoist & 4-Point Rigging Sling",
          "Feeler Gauge Blade Set (0.010 - 0.080 in)",
        ],
        safetyWarnings: [
          "Heavy overhead load: always stay clear of suspended turbine casing sections.",
        ],
        calloutBadge: "Abradable Shroud Ring",
      },
      {
        stepNumber: 3,
        title: "Nozzle Guide Vane Stator Segment Removal & Throat Area Verification",
        targetMeshName: "StatorVaneRing",
        partDisplayName: "Nozzle Guide Vane (NGV) Stator Ring",
        summary:
          "Slide segmented stator vanes from casing guide rails and inspect trailing edge cooling air holes.",
        mechanicalPrinciples:
          "NGVs accelerate hot combustion gas and turn flow to the optimal attack angle before rotor blade entry. Convergent passages convert thermal/pressure energy into kinetic energy: V_gas = √(2 · Cp · ΔT).",
        inspectionCriteria: [
          "Measure stator throat area using calibrated ball gauges.",
          "Check vane trailing edge cooling slots for blockage from molten volcanic ash or sand.",
          "Inspect leading edge for erosion from solid particles.",
        ],
        toolsRequired: [
          "Stator Segment Sliding Rail Drift",
          "Ball Gauge Throat Measurement Kit",
          "Airflow Pressure Drop Flow Bench",
        ],
        safetyWarnings: [
          "Sharp trailing edges on vanes. Wear cut-resistant nitrile gloves.",
        ],
        calloutBadge: "NGV Trailing Cooling Slot",
      },
      {
        stepNumber: 4,
        title: "Aerofoil Rotor Blade Fir-Tree Root Disassembly & FPI Flaw Testing",
        targetMeshName: "RotorBlades",
        partDisplayName: "Single-Crystal Turbine Aerofoils",
        summary:
          "Bend back retaining locktabs and slide individual turbine blades circumferentially out of their fir-tree root disk slots.",
        mechanicalPrinciples:
          "At operating speed, centrifugal acceleration on each blade exceeds 25,000 g's (pull force > 40 kN per blade). Multi-serration fir-tree geometry distributes hoop stress across 3-4 load-bearing lobes.",
        inspectionCriteria: [
          "Perform Fluorescent Penetrant Inspection (FPI Type I, Method D) on fir-tree root lobes.",
          "Check internal serpentine cooling passages for obstruction via radiography.",
          "Inspect squealer tip caps for creep-induced rubbing wear.",
        ],
        toolsRequired: [
          "Locktab Chisel & Brass Sliding Drift",
          "Blacklight (UV-A 365 nm) Inspection Lamp",
          "Digital Optical Comparators",
        ],
        safetyWarnings: [
          "Handle single-crystal alloy blades with extreme care; surface nicks become stress risers leading to rapid high-cycle fatigue (HCF) failure.",
        ],
        calloutBadge: "Fir-Tree Root Lobes",
      },
    ],
  },
  "single-cylinder-engine": {
    machineId: "single-cylinder-engine",
    title: "Internal Combustion Engine Top-End Overhaul & Valve Timing",
    overview:
      "Deep dive into reciprocating thermodynamics, crank-slider kinematics, and valve actuation timing in 4-stroke spark-ignition engines.",
    estimatedMinutes: 18,
    difficulty: "BEGINNER",
    steps: [
      {
        stepNumber: 1,
        title: "Spark Plug & Combustion Chamber Deposit Analysis",
        targetMeshName: "SparkPlug",
        partDisplayName: "High-Energy Spark Plug",
        summary:
          "Extract the spark plug to evaluate combustion efficiency from electrode deposit color and electrode gap.",
        mechanicalPrinciples:
          "Spark plug electrode coloration reveals air-fuel ratio: light tan indicates stoichiometric combustion (λ ≈ 1.0), black soot indicates rich mixture, and glazed blistering indicates dangerous pre-ignition.",
        inspectionCriteria: [
          "Measure electrode gap with wire gauge (specification: 0.85 ± 0.05 mm).",
          "Check porcelain insulator for thermal glazing or dielectric flashover tracks.",
          "Ensure sealing copper crush washer is replaced on reassembly.",
        ],
        toolsRequired: [
          "16mm Deep Magnetic Spark Plug Socket",
          "Wire Feeler Spark Gap Gauge",
          "Torque Wrench (25 Nm setting)",
        ],
        safetyWarnings: [
          "Ensure ignition switch is locked out before removing spark plug.",
        ],
        calloutBadge: "Ground Electrode Gap",
      },
      {
        stepNumber: 2,
        title: "Cylinder Head Stud Release & Flatness Warpage Verification",
        targetMeshName: "CylinderHead",
        partDisplayName: "Die-Cast Aluminum Cylinder Head",
        summary:
          "Follow reverse torque spiral sequence to unbolt cylinder head studs and evaluate mating deck warpage.",
        mechanicalPrinciples:
          "Cylinder head studs maintain clamping pressure exceeding peak combustion pressure (80-100 bar). Loosening in reverse torque order prevents thermal warping of the aluminum casting.",
        inspectionCriteria: [
          "Check mating deck with precision straightedge and feeler gauge (limit: < 0.05 mm warpage).",
          "Inspect valve guide bronze bushings for oil leakage.",
          "Examine coolant passages for cavitation or galvanic corrosion.",
        ],
        toolsRequired: [
          "Precision Ground Steel Straightedge (500 mm)",
          "12mm Hex Bit Socket & Torque Wrench",
          "Dial Bore Gauge",
        ],
        safetyWarnings: [
          "Never pry between aluminum deck surfaces with a screwdriver; scratches destroy the head gasket seal.",
        ],
        calloutBadge: "Combustion Roof Dome",
      },
      {
        stepNumber: 3,
        title: "Piston Crown Carbon Decoke & Gudgeon Pin Clearance",
        targetMeshName: "Piston",
        partDisplayName: "Forged Crown Piston & Rings",
        summary:
          "Extract the piston through top of cylinder bore, remove compression rings, and measure ring end gap.",
        mechanicalPrinciples:
          "Thermal expansion requires piston skirts to be elliptical and tapered: smaller diameter at the hot crown and wider at the oil-cooled lower skirt to achieve roundness at 220°C.",
        inspectionCriteria: [
          "Measure top ring end gap inside cylinder bore (spec: 0.25 - 0.40 mm).",
          "Check piston skirt thrust face for scuffing or ring land micro-welding.",
          "Verify wrist pin free floating clearance within 0.008 mm.",
        ],
        toolsRequired: [
          "Piston Ring Expander Pliers",
          "Piston Ring Groove Cleaning Tool",
          "Outside Micrometer (75-100 mm)",
        ],
        safetyWarnings: [
          "Piston ring edges are razor sharp. Wear protective leather or nitrile gloves.",
        ],
        calloutBadge: "Compression Ring Lands",
      },
    ],
  },
  "gearbox": {
    machineId: "gearbox",
    title: "Synchromesh Manual Transmission Disassembly & Gear Tooth Contact",
    overview:
      "Explore spur and helical gear train kinetics, baulk-ring synchromesh cone synchronization, and selector rail fork interlocking.",
    estimatedMinutes: 20,
    difficulty: "INTERMEDIATE",
    steps: [
      {
        stepNumber: 1,
        title: "Split-Casing Dismantling & Bearing Preload Inspection",
        targetMeshName: "TransmissionCase",
        partDisplayName: "Aluminum Transmission Housing Casing",
        summary:
          "Remove perimeter perimeter bolts, break anaerobic sealant bond, and lift off transmission upper case.",
        mechanicalPrinciples:
          "Helical gears generate axial thrust forces that push shafts apart. The rigid ribbed casing maintains parallel center-distance under high tooth-separation forces: F_sep = F_tangential · tan(pressure angle).",
        inspectionCriteria: [
          "Check tapered roller bearing outer races for spalling or brinelling.",
          "Verify casing split flange faces are free from gouges.",
          "Examine magnetic drain plug for excessive metallic debris.",
        ],
        toolsRequired: [
          "Pneumatic Impact Driver (13mm Socket)",
          "Non-Marring Rubber Mallet",
          "Bearing Race Puller",
        ],
        safetyWarnings: [
          "Drain all 75W-90 gear lubricant before breaking casing seal.",
        ],
        calloutBadge: "Bearing Retainer Web",
      },
      {
        stepNumber: 2,
        title: "Synchromesh Baulk Ring Cone Angle & Friction Tooth Wear",
        targetMeshName: "SynchromeshRing",
        partDisplayName: "Brass Synchromesh Baulk Ring",
        summary:
          "Inspect the internal friction cone threads and dog-teeth chamfers of the synchromesh baulk ring.",
        mechanicalPrinciples:
          "The synchromesh acts as an instantaneous cone clutch: it synchronizes shaft speeds before the dog clutch sleeve can engage, eliminating gear clashing through friction torque: T_f = (μ · F_axial · r) / sin(α).",
        inspectionCriteria: [
          "Measure clearance gap between baulk ring and gear dog face with feeler gauge (min: 0.8 mm).",
          "Inspect cone internal micro-grooves for oil shearing ability.",
          "Check chamfered locking teeth for rounding or chipping.",
        ],
        toolsRequired: [
          "Feeler Gauge Set",
          "Dial Caliper (0.01 mm)",
          "Snap Ring Pliers",
        ],
        safetyWarnings: [
          "Spring-loaded detent balls in shift hub can shoot out upon collar release. Cover hub with rag.",
        ],
        calloutBadge: "Friction Cone Threads",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Comprehensive Quizzes
// ─────────────────────────────────────────────────────────────────────────────
export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  "landing-gear-strut": [
    {
      id: "lg-q1",
      machineId: "landing-gear-strut",
      type: "IDENTIFICATION",
      targetMeshName: "OleoPiston",
      partDisplayName: "Hard-Chromed Oleo Piston",
      prompt: "Identify the telescoping cylindrical component that slides inside the outer shock cylinder on aircraft touchdown:",
      options: [
        "Hard-Chromed Oleo Piston",
        "Retract Trunnion Spindle",
        "Upper Scissor Torque Link",
        "Axle Clamping Collar",
      ],
      correctOptionIndex: 0,
      explanation:
        "The Oleo Piston is the polished, hard-chrome plated cylinder that telescopes vertically inside the outer cylinder, forcing hydraulic fluid through dampening orifices.",
      referenceStandard: "FAA-H-8083-31A (AMT Airframe Handbook Ch. 13)",
    },
    {
      id: "lg-q2",
      machineId: "landing-gear-strut",
      type: "FUNCTION",
      targetMeshName: "UpperTorqueLink",
      partDisplayName: "Torque Scissor Linkage",
      prompt: "What is the primary mechanical function of the upper and lower torque scissor links?",
      options: [
        "Absorbs vertical touchdown energy through rubber elastomeric buffers",
        "Prevents rotation of the oleo piston inside the cylinder while permitting vertical stroke",
        "Locks the landing gear in the retracted position during high-speed cruise",
        "Directly actuates the disc brake calipers on wheel rollout",
      ],
      correctOptionIndex: 1,
      explanation:
        "Torque scissor links allow unrestricted 1-DOF vertical telescoping motion of the oleo strut while structurally counteracting steering and yaw torque, keeping wheels aligned with the aircraft centerline.",
      referenceStandard: "FAR § 25.721 (General Landing Gear Requirements)",
    },
    {
      id: "lg-q3",
      machineId: "landing-gear-strut",
      type: "MATERIAL",
      targetMeshName: "MainCylinder",
      partDisplayName: "Outer Shock Cylinder",
      prompt: "Why is 300M ultra-high-strength alloy steel (UTS > 1,900 MPa) selected for the outer cylinder?",
      options: [
        "It provides low electrical conductivity to prevent lightning strikes",
        "Superior fracture toughness and extreme yield strength under cyclic landing shock loads",
        "It has a lower density than titanium alloy Ti-6Al-4V",
        "It allows translucent visual fluid level inspection through the wall",
      ],
      correctOptionIndex: 1,
      explanation:
        "300M steel is a modified 4340 vacuum-arc-remelted steel containing silicon and vanadium. It achieves tensile strength of 1,930-2,100 MPa with exceptional fracture toughness (K_IC), resisting catastrophic fatigue failure during heavy landings.",
      referenceStandard: "MIL-HDBK-5J / MMPDS-01",
    },
    {
      id: "lg-q4",
      machineId: "landing-gear-strut",
      type: "MAINTENANCE",
      targetMeshName: "OleoPiston",
      partDisplayName: "Strut Servicing Protocol",
      prompt: "When servicing an oleo strut that is bottomed out, which fluid and gas combination is mandatory?",
      options: [
        "Engine oil (5W-30) and compressed shop air",
        "Aviation kerosene (Jet-A) and carbon dioxide",
        "MIL-PRF-5606 / MIL-PRF-83282 hydraulic fluid and dry nitrogen (N2)",
        "Distilled water and oxygen",
      ],
      correctOptionIndex: 2,
      explanation:
        "Never use compressed shop air or oxygen because diesel ignition (explosive combustion) can occur under rapid compression. Only dry, oil-free nitrogen gas and approved aviation hydraulic fluid (MIL-PRF-5606 or fire-resistant MIL-PRF-83282) may be used.",
      referenceStandard: "AMM 32-11-00 / FAA AC 43.13-1B § 9-38",
    },
    {
      id: "lg-q5",
      machineId: "landing-gear-strut",
      type: "FUNCTION",
      targetMeshName: "WheelAxle",
      partDisplayName: "Bogie Wheel Axle",
      prompt: "What mechanical advantage does the titanium alloy axle spindle provide over aluminum alloy?",
      options: [
        "Eliminates galvanic corrosion against aluminum rims and resists severe reverse bending fatigue",
        "It is 50% lighter than magnesium while having zero thermal expansion",
        "Permits magnetic testing with standard permanent magnets",
        "Melts during brake fires to allow wheel ejection",
      ],
      correctOptionIndex: 0,
      explanation:
        "Titanium alloys (e.g. Ti-10V-2Fe-3Al) offer high specific strength, excellent corrosion resistance, and galvanic compatibility with adjacent aluminum bearing races, preventing axle fretting and seizure.",
      referenceStandard: "SAE AMS 4983",
    },
  ],

  "turbine-stage": [
    {
      id: "tb-q1",
      machineId: "turbine-stage",
      type: "IDENTIFICATION",
      targetMeshName: "RotorBlades",
      partDisplayName: "Single-Crystal Aerofoil Blades",
      prompt: "Identify the high-speed rotating aerofoils featuring internal serpentine cooling channels and fir-tree mounting roots:",
      options: [
        "Single-Crystal Aerofoil Blades",
        "Nozzle Guide Vane Stator Segments",
        "Combustor Flame Diffuser",
        "Central Spindle Labyrinth Seal",
      ],
      correctOptionIndex: 0,
      explanation:
        "The Rotor Blades extract kinetic and thermal energy from 1,400°C gases, spinning at up to 15,000 RPM. They feature fir-tree root attachments to distribute high centrifugal stresses into the rotor disk.",
      referenceStandard: "FAA-H-8083-32A (Powerplant Handbook Ch. 3)",
    },
    {
      id: "tb-q2",
      machineId: "turbine-stage",
      type: "MATERIAL",
      targetMeshName: "RotorDisk",
      partDisplayName: "Inconel 718 Turbine Rotor Disk",
      prompt: "Why are turbine disks forged from nickel-iron superalloys like Inconel 718 rather than titanium?",
      options: [
        "Inconel maintains high yield strength and creep-rupture resistance up to 650°C, where titanium burns",
        "Inconel is much cheaper and easier to machine than stainless steel",
        "Inconel has zero thermal expansion across all temperatures",
        "Inconel absorbs combustion carbon to harden its surface over time",
      ],
      correctOptionIndex: 0,
      explanation:
        "Above ~400°C, titanium alloys suffer rapid creep and titanium fire risks in compressed oxygen-rich air. Inconel 718 retains high yield strength (> 1,100 MPa) and resists creep deformation up to 650°C.",
      referenceStandard: "AMS 5663 / Rolls-Royce Material Spec MSRR 7118",
    },
    {
      id: "tb-q3",
      machineId: "turbine-stage",
      type: "FUNCTION",
      targetMeshName: "StatorVaneRing",
      partDisplayName: "Nozzle Guide Vanes",
      prompt: "What is the primary thermodynamic purpose of the stationary Nozzle Guide Vane (NGV) ring?",
      options: [
        "Mixes fresh compressor bleed air into the exhaust nozzle",
        "Accelerates gas flow and turns it to the optimal impingement angle against the rotor blades",
        "Acts as a mechanical friction brake to stop shaft rotation on shutdown",
        "Shields the aircraft cabin from turbine electromagnetic interference",
      ],
      correctOptionIndex: 1,
      explanation:
        "NGVs form convergent nozzles that convert pressure and temperature energy into gas velocity, directing flow at ~70° attack angle onto rotor blades for maximum tangential momentum transfer.",
      referenceStandard: "NASA SP-290 (Turbine Aerodynamic Design)",
    },
    {
      id: "tb-q4",
      machineId: "turbine-stage",
      type: "MAINTENANCE",
      targetMeshName: "RotorBlades",
      partDisplayName: "Fir-Tree Root NDT Inspection",
      prompt: "Which non-destructive testing (NDT) method is standard for detecting micro-cracks in fir-tree root serrations?",
      options: [
        "Magnetic Particle Testing (MT)",
        "Type I Fluorescent Liquid Penetrant Inspection (FPI) or High-Frequency Eddy Current",
        "Visual inspection with standard magnifying glass only",
        "Brinell hardness ball indentation test",
      ],
      correctOptionIndex: 1,
      explanation:
        "Because nickel-based superalloys like Inconel and CMSX-4 are non-ferromagnetic, Magnetic Particle Testing cannot be used. High-sensitivity Fluorescent Penetrant (FPI Type I Level 4) or Eddy Current (ET) is mandatory to find root serration fatigue cracks.",
      referenceStandard: "ASTM E1417 / AMM 72-51-00",
    },
  ],

  "single-cylinder-engine": [
    {
      id: "sc-q1",
      machineId: "single-cylinder-engine",
      type: "IDENTIFICATION",
      targetMeshName: "WristPin",
      partDisplayName: "Hardened Gudgeon / Wrist Pin",
      prompt: "Identify the hardened steel pin that connects the piston crown to the connecting rod small end:",
      options: [
        "Wrist Pin (Gudgeon Pin)",
        "Crankshaft Main Journal",
        "Valve Lifter Tappet",
        "Spark Plug Terminal Post",
      ],
      correctOptionIndex: 0,
      explanation:
        "The Wrist Pin (or Gudgeon Pin) transfers combustion forces from the piston crown to the connecting rod small end bearing while allowing rocking motion during the stroke.",
    },
    {
      id: "sc-q2",
      machineId: "single-cylinder-engine",
      type: "FUNCTION",
      targetMeshName: "CylinderHead",
      partDisplayName: "Cylinder Head",
      prompt: "What is the function of the cross-pattern tightening sequence for cylinder head bolts?",
      options: [
        "Guarantees the spark plug threads remain parallel to the ground",
        "Evenly compresses the head gasket to prevent thermal warpage and compression leaks",
        "Increases the compression ratio by 15%",
        "Reduces valve spring bounce at high RPM",
      ],
      correctOptionIndex: 1,
      explanation:
        "A criss-cross / spiral torque sequence distributes clamping forces evenly across the combustion deck and head gasket, preventing localized pinching and permanent cylinder head warpage.",
    },
    {
      id: "sc-q3",
      machineId: "single-cylinder-engine",
      type: "MATERIAL",
      targetMeshName: "ConnectingRod",
      partDisplayName: "Connecting Rod",
      prompt: "Why is forged 4340 chromoly steel favored for high-performance connecting rods?",
      options: [
        "Extreme fatigue limit under cyclic tension-compression cycles and high strength-to-weight ratio",
        "Low melting point allows easy field repairs with a soldering iron",
        "High porosity absorbs oil to eliminate the need for rod bearings",
        "It is completely immune to thermal expansion",
      ],
      correctOptionIndex: 0,
      explanation:
        "During every four-stroke cycle, the connecting rod alternates rapidly between intense compressive loading (combustion pressure) and tensile loading (exhaust stroke inertia). Forged 4340 steel offers high fatigue endurance strength.",
    },
  ],

  "gearbox": [
    {
      id: "gb-q1",
      machineId: "gearbox",
      type: "FUNCTION",
      targetMeshName: "SynchromeshRing",
      partDisplayName: "Synchromesh Baulk Ring",
      prompt: "How does a brass baulk ring eliminate gear crunching during gear shifts?",
      options: [
        "Frictional contact on the gear cone synchronizes rotational speeds before dog teeth can mesh",
        "It disconnects engine electrical power for 200 milliseconds",
        "It pumps high-pressure oil into the gear teeth to cushion impact",
        "It locks all gears simultaneously to stop the driveshaft",
      ],
      correctOptionIndex: 0,
      explanation:
        "The conical inside surface of the brass baulk ring acts as a mini-clutch. As the shift fork pushes the sleeve, friction synchronizes the speeds of the gear and shaft; only when speeds match can the sleeve slide over the teeth.",
    },
    {
      id: "gb-q2",
      machineId: "gearbox",
      type: "IDENTIFICATION",
      targetMeshName: "Countershaft",
      partDisplayName: "Laygear Countershaft",
      prompt: "Identify the parallel cluster shaft that carries driven gears and transmits torque from the input shaft:",
      options: [
        "Laygear Countershaft",
        "Clutch Release Fork",
        "Differential Ring Gear",
        "Reverse Idler Pivot",
      ],
      correctOptionIndex: 0,
      explanation:
        "The Countershaft (or laygear) contains a cluster of gears driven by the input shaft, stepping speed up or down before driving the main output shaft gears.",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Component Function Cards
// ─────────────────────────────────────────────────────────────────────────────
export const COMPONENT_CARDS: ComponentFunctionCard[] = [
  // Landing Gear Strut
  {
    id: "card-oleo-piston",
    machineId: "landing-gear-strut",
    meshName: "OleoPiston",
    displayName: "Hard-Chromed Oleo Piston",
    category: "Hydraulic",
    primaryFunction:
      "Telescoping dynamic piston compressing hydraulic fluid through calibrated metering pin orifices to dissipate touchdown kinetic energy.",
    material: "Chromium-Plated 300M Ultra-High-Strength Steel",
    massKg: 19.8,
    yieldStrengthMpa: 1650,
    operatingTempRange: "-54°C to +85°C (-65°F to +185°F)",
    commonFailureModes: [
      "Hard chrome flaking from runway stone debris",
      "Dynamic chevron seal leakage",
      "Lateral scoring from contaminated fluid",
    ],
    inspectionIntervalHours: 500,
    inspectionMethod: "Visual inspection with 10x loupe & dial indicator runout check",
    lubricationSpec: "MIL-PRF-5606 or MIL-PRF-83282 Synthetic Hydrocarbon Fluid",
  },
  {
    id: "card-main-cylinder",
    machineId: "landing-gear-strut",
    meshName: "MainCylinder",
    displayName: "Outer Shock Cylinder",
    category: "Structural",
    primaryFunction:
      "Primary airframe structural attachment trunnion holding 1,500 PSI dry nitrogen gas precharge and dynamic hydraulic fluid reservoir.",
    material: "Forged 300M Steel (AMS 6417)",
    massKg: 32.5,
    yieldStrengthMpa: 1720,
    operatingTempRange: "-54°C to +95°C",
    commonFailureModes: [
      "Stress corrosion cracking around grease fittings",
      "Gland retaining thread galling",
      "Internal barrel ovality",
    ],
    inspectionIntervalHours: 1200,
    inspectionMethod: "Ultrasonic Testing (UT) & Fluorescent Magnetic Particle (MPI)",
    lubricationSpec: "BMS 3-33 Grease on outer trunnion bearings",
  },
  {
    id: "card-torque-links",
    machineId: "landing-gear-strut",
    meshName: "UpperTorqueLink",
    displayName: "Upper Torque Scissor Link",
    category: "Kinematic",
    primaryFunction:
      "Transmits landing yaw moments and ground steering torque to wheels while accommodating up to 14 inches of oleo telescoping stroke.",
    material: "7075-T73 Aluminum Die Forging",
    massKg: 3.4,
    yieldStrengthMpa: 435,
    operatingTempRange: "-55°C to +80°C",
    commonFailureModes: [
      "Bushing pin bore elongation",
      "Apex bolt shear fatigue",
      "Fretting corrosion on lug faces",
    ],
    inspectionIntervalHours: 250,
    inspectionMethod: "Eddy Current (ET) around fastener holes & feeler gauge play check",
    lubricationSpec: "Aeroshell Grease 22 (MIL-PRF-81322)",
  },
  {
    id: "card-wheel-axle",
    machineId: "landing-gear-strut",
    meshName: "WheelAxle",
    displayName: "Dual Wheel Axle Sleeve",
    category: "Structural",
    primaryFunction:
      "High-toughness cantilevered spindle supporting dual tapered roller wheel bearings against 3.5g impact landing loads.",
    material: "Titanium Alloy Ti-10V-2Fe-3Al",
    massKg: 8.2,
    yieldStrengthMpa: 1100,
    operatingTempRange: "-60°C to +150°C",
    commonFailureModes: [
      "Bearing seat fretting wear",
      "Nut thread galling",
      "Fatigue crack at fillet radius",
    ],
    inspectionIntervalHours: 600,
    inspectionMethod: "High-frequency surface Eddy Current & optical profilometry",
    lubricationSpec: "Anti-seize compound MIL-PRF-907 on axle sleeve",
  },
  {
    id: "card-retract-actuator",
    machineId: "landing-gear-strut",
    meshName: "RetractActuator",
    displayName: "Hydraulic Retract Actuator",
    category: "Hydraulic",
    primaryFunction:
      "Double-acting 3,000 PSI hydraulic actuator that raises the gear into the wing wheel well and holds downlock overcenter.",
    material: "Anodized 7075-T6 Aluminum Barrel & 15-5PH Stainless Rod",
    massKg: 6.8,
    yieldStrengthMpa: 965,
    operatingTempRange: "-54°C to +105°C",
    commonFailureModes: [
      "Rod wiper seal extrusion",
      "Internal piston seal bypass",
      "Hydraulic fitting O-ring blow-by",
    ],
    inspectionIntervalHours: 800,
    inspectionMethod: "Hydraulic leak rate proof pressure testing at 4,500 PSI",
    lubricationSpec: "Internal hydraulic fluid lubricated (MIL-PRF-83282)",
  },

  // Turbine Stage
  {
    id: "card-rotor-blades",
    machineId: "turbine-stage",
    meshName: "RotorBlades",
    displayName: "Single-Crystal Turbine Aerofoils",
    category: "Thermal",
    primaryFunction:
      "Extracts kinetic power from supersonic combustion gas flow; withstands 25,000g centrifugal acceleration at 1,150°C metal temperature.",
    material: "CMSX-4 Nickel-Base Single Crystal Superalloy + YSZ TBC",
    massKg: 4.2,
    yieldStrengthMpa: 880,
    operatingTempRange: "Up to 1150°C (gas temp 1400°C)",
    commonFailureModes: [
      "Thermal barrier coating spallation",
      "Fir-tree root low-cycle fatigue (LCF)",
      "Creep elongation at squealer tip",
    ],
    inspectionIntervalHours: 400,
    inspectionMethod: "Fluorescent Penetrant Inspection (FPI Type I) & Video Borescope",
    lubricationSpec: "Dry-film molybdenum disulfide anti-fret coating on fir-tree root",
  },
  {
    id: "card-rotor-disk",
    machineId: "turbine-stage",
    meshName: "RotorDisk",
    displayName: "Blisk Turbine Rotor Disk",
    category: "Structural",
    primaryFunction:
      "Rotates at 15,000 RPM, holding the set of aerofoil blades via broached fir-tree root slots while transmitting shaft torque.",
    material: "Forged Inconel 718 (AMS 5663)",
    massKg: 14.5,
    yieldStrengthMpa: 1110,
    operatingTempRange: "-50°C to +650°C",
    commonFailureModes: [
      "Bore low-cycle fatigue micro-cracks",
      "Fir-tree slot corner fretting",
      "Bolt hole ovalization",
    ],
    inspectionIntervalHours: 1000,
    inspectionMethod: "Eddy Current Bolt Hole Probe & Ultrasonic C-Scan",
    lubricationSpec: "Non-lubricated (hot gas section environment)",
  },
  {
    id: "card-stator-vanes",
    machineId: "turbine-stage",
    meshName: "StatorVaneRing",
    displayName: "Nozzle Guide Vane Stator Ring",
    category: "Thermal",
    primaryFunction:
      "Stationary aerodynamic nozzles accelerating hot gases to near-sonic velocity and directing flow into rotor blades at optimum 70° angle.",
    material: "Cobalt-Base Superalloy Mar-M-509 + Al-Cr Diffusion Coating",
    massKg: 9.8,
    yieldStrengthMpa: 620,
    operatingTempRange: "Up to 1100°C",
    commonFailureModes: [
      "Trailing edge thermal fatigue cracking",
      "Cooling air hole blockage",
      "Leading edge sand/ash erosion",
    ],
    inspectionIntervalHours: 350,
    inspectionMethod: "Airflow calibrated flow bench testing & optical borescopy",
    lubricationSpec: "Static mounting (no lubricant)",
  },
  {
    id: "card-combustor-liner",
    machineId: "turbine-stage",
    meshName: "CombustorLiner",
    displayName: "Annular Combustor Flame Tube",
    category: "Thermal",
    primaryFunction:
      "Contains primary combustion flame envelope (1,800°C); creates film cooling blanket along inner wall via thousands of laser-drilled effusion holes.",
    material: "Hastelloy X / Haynes 230 Sheet Superalloy + YSZ TBC",
    massKg: 8.5,
    yieldStrengthMpa: 390,
    operatingTempRange: "Gas core 1800°C / Wall 950°C",
    commonFailureModes: [
      "Thermal stress distortion/buckling",
      "Laser hole oxidation burnout",
      "Swirler carbon coking",
    ],
    inspectionIntervalHours: 300,
    inspectionMethod: "Borescope measurement of burn-through area (FAA AC 33-2B)",
    lubricationSpec: "High temperature ceramic seal paste",
  },
  // Single-Cylinder Engine
  {
    id: "card-engine-block",
    machineId: "single-cylinder-engine",
    meshName: "EngineBlock",
    displayName: "Cast Iron Engine Block & Cylinder Liner",
    category: "Structural",
    primaryFunction:
      "Houses the reciprocating piston and crankshaft, containing combustion pressure (up to 90 bar) while providing coolant and oil circulation passages.",
    material: "Compacted Graphite Iron (CGI) / Cast Iron Grade 30",
    massKg: 16.2,
    yieldStrengthMpa: 420,
    operatingTempRange: "-30°C to +180°C",
    commonFailureModes: [
      "Bore glazing or scoring from particulate contamination",
      "Cylinder deck warpage from severe overheating",
      "Freeze plug corrosion blowout",
    ],
    inspectionIntervalHours: 500,
    inspectionMethod: "Dial bore gauge cross-pattern taper and out-of-round measurement",
    lubricationSpec: "SAE 5W-40 Full Synthetic Motor Oil (API SN/CF)",
  },
  {
    id: "card-piston",
    machineId: "single-cylinder-engine",
    meshName: "Piston",
    displayName: "Forged Aluminum Crown Piston",
    category: "Kinematic",
    primaryFunction:
      "Converts expanding combustion gas energy into linear mechanical motion and drives the connecting rod during the power stroke.",
    material: "Forged 4032-T6 High-Silicon Aluminum Alloy",
    massKg: 0.65,
    yieldStrengthMpa: 310,
    operatingTempRange: "Crown 280°C / Skirt 150°C",
    commonFailureModes: [
      "Ring land micro-welding and collapse",
      "Skirt thrust face scuffing and galling",
      "Crown detonation erosion and hole puncture",
    ],
    inspectionIntervalHours: 250,
    inspectionMethod: "Micrometer skirt diameter measurement & dye penetrant flaw check",
    lubricationSpec: "Pressurized oil jet cooling directed at piston undercrown",
  },
  {
    id: "card-crankshaft",
    machineId: "single-cylinder-engine",
    meshName: "Crankshaft",
    displayName: "Counterweighted Forged Crankshaft",
    category: "Kinematic",
    primaryFunction:
      "Translates linear reciprocating piston motion into continuous rotational torque output while counterbalancing first-order inertial vibrations.",
    material: "Forged 4140 Chromoly Steel (Quenched & Tempered)",
    massKg: 6.4,
    yieldStrengthMpa: 850,
    operatingTempRange: "-20°C to +130°C",
    commonFailureModes: [
      "Main bearing journal micro-grooving and ovality",
      "Fillet radius torsional fatigue cracking",
      "Oil hole sludge blockage causing bearing seizure",
    ],
    inspectionIntervalHours: 600,
    inspectionMethod: "Magnetic Particle Inspection (MPI) & dial indicator runout check",
    lubricationSpec: "Pressurized hydrodynamic oil film (40-60 PSI)",
  },
  {
    id: "card-connecting-rod",
    machineId: "single-cylinder-engine",
    meshName: "ConnectingRod",
    displayName: "H-Beam Forged Connecting Rod",
    category: "Kinematic",
    primaryFunction:
      "Transfers instantaneous reciprocating force between piston wrist pin and crankshaft rod journal, enduring alternating tension and compression.",
    material: "Forged 4340 Aircraft-Grade Alloy Steel",
    massKg: 0.72,
    yieldStrengthMpa: 980,
    operatingTempRange: "-20°C to +140°C",
    commonFailureModes: [
      "Rod bolt fatigue stretch and separation",
      "Big-end bore out-of-round deformation",
      "Wrist pin bronze bushing galling",
    ],
    inspectionIntervalHours: 350,
    inspectionMethod: "Ultrasonic bolt stretch measurement & precision inside bore gauge",
    lubricationSpec: "Hydrodynamic bearing shell lubrication",
  },
  // Manual Gearbox
  {
    id: "card-transmission-case",
    machineId: "gearbox",
    meshName: "TransmissionCase",
    displayName: "Ribbed Aluminum Transmission Casing",
    category: "Structural",
    primaryFunction:
      "Provides a rigid, oil-tight enclosure maintaining parallel shaft center-distances against high separating and thrust forces generated by helical gears.",
    material: "High-Pressure Die-Cast A380 Aluminum",
    massKg: 12.8,
    yieldStrengthMpa: 160,
    operatingTempRange: "-40°C to +120°C",
    commonFailureModes: [
      "Split flange mating face oil leakage",
      "Bearing retainer bore ovalization under shock loads",
      "Thread stripping in drain and fill plug bungs",
    ],
    inspectionIntervalHours: 1000,
    inspectionMethod: "Precision straightedge flatness check & dye penetrant seam check",
    lubricationSpec: "Fully sealed enclosure with anaerobic liquid gasket compound",
  },
  {
    id: "card-synchromesh-ring",
    machineId: "gearbox",
    meshName: "SynchromeshRing",
    displayName: "Manganese Bronze Synchromesh Baulk Ring",
    category: "Kinematic",
    primaryFunction:
      "Acts as a high-friction conical clutch to rapidly match gear and shaft rotational velocities, preventing dog-teeth clashing during manual gear shifts.",
    material: "High-Tensile Forged Manganese Bronze (SAE 430B)",
    massKg: 0.18,
    yieldStrengthMpa: 380,
    operatingTempRange: "-20°C to +130°C",
    commonFailureModes: [
      "Internal friction thread groove wear causing gear grinding",
      "Chamfered dog-teeth corner rounding and chipping",
      "Thermal glazing from inadequate oil shearing",
    ],
    inspectionIntervalHours: 500,
    inspectionMethod: "Feeler gauge measurement of baulk-ring-to-gear-face clearance",
    lubricationSpec: "SAE 75W-90 GL-4 Hypoid Gear Oil (non-corrosive to yellow metals)",
  },
  {
    id: "card-input-shaft",
    machineId: "gearbox",
    meshName: "InputShaft",
    displayName: "Case-Hardened Input Spline Shaft",
    category: "Kinematic",
    primaryFunction:
      "Receives torque directly from the engine clutch disc via involute splines and drives the countershaft drive gear cluster.",
    material: "Carburized & Case-Hardened SAE 8620 Alloy Steel (60-62 HRC)",
    massKg: 3.2,
    yieldStrengthMpa: 920,
    operatingTempRange: "-30°C to +130°C",
    commonFailureModes: [
      "Spline tooth fretting corrosion and backlash",
      "Pilot bearing journal spalling",
      "Torsional fatigue fracture at diameter transition",
    ],
    inspectionIntervalHours: 800,
    inspectionMethod: "Magnetic particle flaw detection & spline gauge backlash test",
    lubricationSpec: "Splash lubrication from rotating gear counter-immersion",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. Aerospace & Mechanical Glossary
// ─────────────────────────────────────────────────────────────────────────────
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Oleo-Pneumatic",
    category: "Hydraulics",
    definition:
      "A dual-medium shock absorption design combining hydraulic oil (viscous damping dissipation) and compressed nitrogen gas (spring stiffness and energy storage).",
    applicationExample:
      "Used in commercial airliner main landing gear to dissipate up to 10 ft/s (3 m/s) vertical sink rate energy on touchdown without bouncing.",
    relatedParts: ["OleoPiston", "MainCylinder"],
  },
  {
    term: "Fir-Tree Root",
    category: "Aerospace",
    definition:
      "A multi-serrated dovetail geometric slot design with interlocking lobes that distributes intense centrifugal blade pull into the rotor disk.",
    applicationExample:
      "High-pressure turbine blades use 3-lobe or 4-lobe fir-tree roots to prevent root shearing under 25,000g centrifugal loads at 15,000 RPM.",
    relatedParts: ["RotorBlades", "RotorDisk"],
  },
  {
    term: "Thermal Barrier Coating (TBC)",
    category: "Materials",
    definition:
      "An advanced ceramic insulating layer (typically Yttria-Stabilized Zirconia, YSZ) applied by electron-beam physical vapor deposition to protect hot-section superalloys.",
    applicationExample:
      "A 200-micron TBC layer produces a 100-150°C temperature drop across the coating, allowing gas temperatures to exceed the base metal melting point.",
    relatedParts: ["CombustorLiner", "RotorBlades", "StatorVaneRing"],
  },
  {
    term: "Torque Scissor Links",
    category: "Kinematics",
    definition:
      "A two-bar planar hinge linkage connecting the inner oleo piston to the outer cylinder to prevent piston rotation while accommodating vertical telescoping stroke.",
    applicationExample:
      "Without torque links, aircraft wheels would rotate freely around the vertical strut axis, resulting in uncontrolled runway departure on touchdown.",
    relatedParts: ["UpperTorqueLink", "LowerTorqueLink"],
  },
  {
    term: "Synchromesh Baulk Ring",
    category: "Kinematics",
    definition:
      "A brass or carbon-faced conical friction ring that synchronizes the rotational speed of a free-spinning gear with the shaft before dog-teeth can engage.",
    applicationExample:
      "Automotive manual transmissions use synchromesh rings on each forward speed gear to eliminate tooth grinding without requiring double-clutching.",
    relatedParts: ["SynchromeshRing", "DriveGear_1st", "DriveGear_2nd"],
  },
  {
    term: "Fluorescent Penetrant Inspection (FPI)",
    category: "Maintenance",
    definition:
      "A non-destructive testing (NDT) method where a fluorescent liquid dye is drawn into surface-breaking defects by capillary action and viewed under 365 nm UV-A light.",
    applicationExample:
      "Mandatory overhaul inspection protocol for non-magnetic turbine blades and titanium axles to detect micro-fatigue cracks down to 0.001 inches.",
    relatedParts: ["RotorBlades", "WheelAxle"],
  },
  {
    term: "Single-Crystal Superalloy",
    category: "Materials",
    definition:
      "A nickel-base alloy solidified without grain boundaries through directional solidification with a helical grain selector, eliminating creep void formation.",
    applicationExample:
      "CMSX-4 and René N5 single-crystal blades operate at temperatures where conventional polycrystalline alloys would rapidly fail from grain boundary sliding.",
    relatedParts: ["RotorBlades"],
  },
  {
    term: "Metering Pin",
    category: "Hydraulics",
    definition:
      "A contoured, variable-diameter steel rod positioned inside an oleo strut orifice that dynamically changes flow area as the strut compresses.",
    applicationExample:
      "Tailors hydraulic resistance throughout the landing stroke, keeping deceleration forces virtually constant rather than peaking sharply.",
    relatedParts: ["OleoPiston"],
  },
  {
    term: "Cavitation",
    category: "Hydraulics",
    definition:
      "The rapid formation and implosive collapse of vapor bubbles in a liquid subjected to rapid pressure changes, causing pitting erosion on metallic surfaces.",
    applicationExample:
      "Can erode oleo metering orifices or high-speed gear lubrication galleries if fluid aeration occurs.",
    relatedParts: ["OleoPiston", "DriveGear_1st"],
  },
  {
    term: "300M Alloy Steel",
    category: "Materials",
    definition:
      "A vacuum-arc remelted low-alloy steel modified with silicon, offering ultra-high tensile strength (1,930 MPa) and high fracture toughness.",
    applicationExample:
      "Standard material for commercial aircraft landing gear outer cylinders, pistons, and bogie beams (Boeing 737, 777, Airbus A320).",
    relatedParts: ["MainCylinder", "OleoPiston"],
  },
  {
    term: "Inconel 718",
    category: "Materials",
    definition:
      "A precipitation-hardenable nickel-chromium superalloy that maintains high yield strength and oxidation resistance up to 650°C (1,200°F).",
    applicationExample:
      "Used for high-pressure gas turbine rotor disks, casing bolts, and exhaust valves in race engines.",
    relatedParts: ["RotorDisk", "ExhaustValve"],
  },
  {
    term: "Gudgeon Pin (Wrist Pin)",
    category: "Fasteners",
    definition:
      "A case-hardened hollow steel cylindrical pin pivotally connecting the piston crown to the small end of the connecting rod.",
    applicationExample:
      "Full-floating wrist pins are retained by circular wire circlips and lubricated by oil splash from the crankcase.",
    relatedParts: ["WristPin", "Piston", "ConnectingRod"],
  },
  {
    term: "Eddy Current Testing (ET)",
    category: "Maintenance",
    definition:
      "An electromagnetic non-destructive testing (NDT) technique inducing circulating eddy currents in conductive parts to detect subsurface micro-cracks without paint stripping.",
    applicationExample:
      "Standard protocol for inspecting aircraft wheel bead seats and landing gear axle fillet transitions for fatigue cracks.",
    relatedParts: ["WheelAxle", "Tire_Left", "Tire_Right"],
  },
  {
    term: "Fusible Plug (Thermal Relief)",
    category: "Aerospace",
    definition:
      "A threaded brass plug with a eutectic alloy core that melts at a precise threshold (typically 177°C / 350°F) to release tire nitrogen safely before rim explosion.",
    applicationExample:
      "Fitted to aircraft wheel rims to safely vent tire pressure during maximum-effort rejected takeoff (RTO) brake heat soaking.",
    relatedParts: ["Tire_Left", "Tire_Right"],
  },
  {
    term: "Safety Lockwire (MS20995C)",
    category: "Fasteners",
    definition:
      "Positive mechanical locking method using twisted stainless steel (or Inconel) wire installed in a direction that tightens the bolt should it attempt to vibrate loose.",
    applicationExample:
      "Mandatory on all aircraft landing gear trunnion bolts, brake caliper bolts, and turbine casing split-line fasteners (FAA AC 43.13-1B).",
    relatedParts: ["RetractActuator", "WheelAxle", "TurbineCasing"],
  },
  {
    term: "Shimmy Damper",
    category: "Kinematics",
    definition:
      "A hydraulic or elastomeric damping unit connected across landing gear steering linkages to suppress high-frequency castering flutter and resonant wheel vibrations during high-speed rollout.",
    applicationExample:
      "Prevents destructive lateral oscillation modes that can overload torque scissor links at 120-160 knots landing speeds.",
    relatedParts: ["UpperTorqueLink", "LowerTorqueLink"],
  },
  {
    term: "Creep Rupture",
    category: "Materials",
    definition:
      "Time-dependent, progressive plastic deformation of metallic components subjected to sustained mechanical stress at elevated temperatures exceeding 40% of their absolute melting point.",
    applicationExample:
      "Turbine blade squealer tips experience creep elongation over hundreds of hours, monitored through borescope tip rub checks.",
    relatedParts: ["TurbineBlade_01", "RotorDisk"],
  },
  {
    term: "Low-Cycle Fatigue (LCF)",
    category: "Materials",
    definition:
      "Fatigue failure occurring at under 100,000 cycles where cyclic mechanical strains cause localized macroscopic plastic deformation during each engine start/stop or takeoff/landing cycle.",
    applicationExample:
      "Turbine rotor disk bores and blade fir-tree root serrations have life-limited cycle counts strictly tracked in aircraft logbooks.",
    relatedParts: ["RotorDisk", "OleoPiston"],
  },
  {
    term: "Skydrol Phosphate Ester Fluid",
    category: "Hydraulics",
    definition:
      "A fire-resistant synthetic phosphate ester hydraulic fluid (Type IV/V) engineered for commercial aviation operating up to 3,000-5,000 PSI across -54°C to +107°C.",
    applicationExample:
      "Requires butyl rubber or EPDM dynamic seals; highly aggressive toward paints, wiring insulation, and human skin/eyes.",
    relatedParts: ["RetractActuator", "OleoPiston"],
  },
  {
    term: "ATA 100 / iSpec 2200",
    category: "Maintenance",
    definition:
      "The international aerospace industry standard numbering system classifying aircraft systems into standardized two-digit numerical chapters (e.g., ATA 32 for Landing Gear, ATA 72 for Engine Turbine).",
    applicationExample:
      "Ensures that all maintenance documentation, parts catalogs, and troubleshooting manuals share a universally consistent index.",
    relatedParts: ["MainCylinder", "TurbineCasing"],
  },
  {
    term: "CMSX-4 Superalloy",
    category: "Materials",
    definition:
      "A second-generation single-crystal nickel-base superalloy containing 3% rhenium, offering extreme creep strength and oxidation resistance in high-pressure turbine stages.",
    applicationExample:
      "Allows modern turbofan engines to achieve turbine entry temperatures (TET) exceeding 1,600°C when paired with thermal barrier coatings.",
    relatedParts: ["TurbineBlade_01", "TurbineBlade_02"],
  },
  {
    term: "Dynamic Chevron Seal",
    category: "Hydraulics",
    definition:
      "A stack of V-shaped elastomeric rings and PTFE backup rings that expand outward under hydraulic pressure to create an oil-tight seal against a sliding cylindrical piston rod.",
    applicationExample:
      "Seals the high-pressure oil/nitrogen interface inside the oleo strut lower gland nut at up to 3,000 PSI during landing impact.",
    relatedParts: ["OleoPiston"],
  },
  {
    term: "Torque-to-Yield (TTY)",
    category: "Fasteners",
    definition:
      "Bolting method where fasteners are torqued past their elastic limit into slight plastic deformation, ensuring maximum, uniform clamping load regardless of thread friction.",
    applicationExample:
      "Used on modern engine cylinder head studs and connecting rod bolts; requires discarding bolts after single use.",
    relatedParts: ["CylinderHead", "ConnectingRod"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. Aircraft Maintenance Manual (AMM) Procedures
// ─────────────────────────────────────────────────────────────────────────────
export const MAINTENANCE_PROCEDURES: MaintenanceProcedure[] = [
  {
    id: "amm-32-11-00",
    machineId: "landing-gear-strut",
    title: "Main Landing Gear Shock Strut Nitrogen & Fluid Servicing",
    ataChapter: "ATA 32-11-00",
    applicableAircraft: "Transport Category Aircraft / General Aviation Turboprops",
    intervalRequirement: "500 Flight Hours or A-Check Inspection",
    requiredPersonnel: "Licensed A&P Mechanic (Airframe Rating)",
    ppeRequired: [
      "Full Face Impact Shield",
      "Butyl Rubber Chemical Apron & Heavy Gloves (Skydrol resistant)",
      "Safety Glasses with Side Shields",
      "Steel-Toe Ground Safety Footwear",
    ],
    specialTools: [
      "Strut High-Pressure Charging Kit (0-3000 PSI) with Pressure Regulator",
      "Certified Dry Nitrogen Cylinder (MIL-PRF-27401 Grade B, 99.99% pure)",
      "Hydraulic Service Cart (MIL-PRF-83282 / Skydrol LD-4)",
      "Calibrated Strut Extension Scale (0-15.00 in)",
    ],
    safetyPrecautions: [
      "DANGER: NEVER USE OXYGEN OR SHOP AIR FOR STRUT SERVICING. High pressure oxygen mixed with hydraulic oil will cause an explosive diesel ignition.",
      "Install landing gear ground lock downlock pins and chock all wheels prior to work.",
      "Stand clear of the vertical extension trajectory of the strut during pressurization.",
      "Hydraulic fluid (Skydrol) causes severe chemical corneal burns. Have eyewash station within 10 seconds access.",
    ],
    steps: [
      {
        step: 1,
        action:
          "Inspect gear ground locks, verify aircraft parking brake is released, and record current strut chrome extension dimension 'H' in inches.",
        acceptanceTolerance: "Normal extension: 3.50 in to 4.50 in with aircraft at operating empty weight.",
        criticalNotes: "Measure on clean, level tarmac with zero fuel imbalance.",
      },
      {
        step: 2,
        action:
          "If extension is low, install certified bleed adapter to the top charging Schrader valve and slowly vent all residual nitrogen pressure to 0 PSI.",
        acceptanceTolerance: "Pressure gauge must read 0.0 ± 0.5 PSI before loosening valve housing.",
        criticalNotes: "Verify complete depressurization by depressing the valve core pin with a brass drift.",
      },
      {
        step: 3,
        action:
          "Connect hydraulic service cart to the fluid servicing port and pump approved fluid until bubble-free oil emerges from the bleed valve.",
        acceptanceTolerance: "Fluid must be free of metallic discoloration, aerated foam, and water condensation.",
        criticalNotes: "Exercise the gear through full stroke 3 times to bleed trapped air pockets from upper chambers.",
      },
      {
        step: 4,
        action:
          "Close fluid bleed port and connect the high-pressure dry nitrogen charging manifold with bottle regulator preset to 1,800 PSI.",
        acceptanceTolerance: "Pressurize until chrome extension reaches exactly 4.25 in (108 mm) at 20°C ambient.",
        criticalNotes: "Refer to the AMM temperature-pressure compensation curve (ambient temp correction factor).",
      },
      {
        step: 5,
        action:
          "Apply leak-detection fluid (Snoop) across Schrader valve body threads, core seal, and lower gland nut.",
        acceptanceTolerance: "Zero bubble generation over a 5-minute dwell observation period.",
        criticalNotes: "Install metal safety sealing cap with safety lockwire (0.032 in stainless steel wire).",
      },
    ],
  },
  {
    id: "amm-72-51-00",
    machineId: "turbine-stage",
    title: "High-Pressure Turbine Hot Section Borescope & Blade Inspection",
    ataChapter: "ATA 72-51-00",
    applicableAircraft: "High-Bypass Turbofans & Turbojets",
    intervalRequirement: "300 Flight Cycles or Post-Bird-Strike / Over-Temp Event",
    requiredPersonnel: "Certified Powerplant Inspector with NDT Level II Borescope Endorsement",
    ppeRequired: [
      "Heat-Resistant Gloves",
      "FFP3 Dust Respirator (for ceramic TBC particulates)",
      "High-Contrast Optical Protection Glasses",
    ],
    specialTools: [
      "High-Definition Video Borescope System with 3D Phase Measurement Probe (4.0 mm, 90° and 0° tips)",
      "Engine High-Pressure Rotor Turning Tool (Manual Ratchet or Pneumatic Slow-Roll Drive)",
      "Optical Defect Calibration Target Scale",
    ],
    safetyPrecautions: [
      "Ensure engine Master Ignition Switch is tagged out and starter valve is mechanically locked closed.",
      "Allow engine minimum 3.0 hours cooling down below 50°C (122°F) to avoid borescope prism thermal cracking.",
      "Do not rotate HP rotor while borescope probe tip is extended inside blade inter-stage spaces.",
    ],
    steps: [
      {
        step: 1,
        action:
          "Remove access plugs at combustor casing port #4 and turbine nozzle guide vane inspection port #7.",
        acceptanceTolerance: "Verify anti-seize coating integrity on plug threads upon removal.",
      },
      {
        step: 2,
        action:
          "Insert 90° articulating borescope probe into hot gas path and systematically inspect all 56 turbine rotor blade aerofoils while slowly rotating the shaft 360°.",
        acceptanceTolerance: "Blade tip rub: max 0.040 in abradable loss. Zero cracked or bent blades permitted.",
        criticalNotes: "Record digital video and high-resolution still images of any observed anomalies.",
      },
      {
        step: 3,
        action:
          "Evaluate Thermal Barrier Coating (TBC) spallation on blade leading edges and convex suction sides using 3D phase measurement.",
        acceptanceTolerance: "Individual spalled area must not exceed 0.25 sq inches (160 mm²); total cumulative spalled area < 10% of aerofoil surface.",
        criticalNotes: "Bare alloy exposure in primary gas path requires engine removal within 50 cycles.",
      },
      {
        step: 4,
        action:
          "Inspect blade trailing edge cooling air discharge slots for carbon blockage, molten dirt glaze, or burning.",
        acceptanceTolerance: "No more than 2 adjacent cooling holes blocked on any single blade.",
      },
      {
        step: 5,
        action:
          "Reinstall borescope access port plugs using new C-ring metal seals and torque to 220 in-lbs (25 Nm). Safety wire plugs.",
        acceptanceTolerance: "Zero gas leakage during post-maintenance ground idle leak check.",
      },
    ],
  },
  {
    id: "amm-32-40-00",
    machineId: "landing-gear-strut",
    title: "Aircraft Main Wheels, Tapered Bearings & Multi-Disc Carbon Brake Overhaul",
    ataChapter: "ATA 32-40-00",
    applicableAircraft: "Transport Category Aircraft / Commercial Jetliners",
    intervalRequirement: "Wheel Tire Change / 250 Flight Cycles",
    requiredPersonnel: "A&P Mechanic with Tire & Brake Certification",
    ppeRequired: [
      "Safety Goggles & Hearing Protection",
      "Heavy Leather Work Gloves",
      "Steel-Toe Ground Safety Footwear",
      "Respirator (for carbon brake particulate dust)",
    ],
    specialTools: [
      "Wheel Dolly & Hydraulic Jack with Mechanical Lock Collar",
      "45mm Axle Nut Deep Impact Socket & Calibrated Torque Wrench (0-600 Nm)",
      "High-Frequency Eddy Current (ET) Bead Seat Probe",
      "Tapered Roller Bearing Greaser Press (MIL-PRF-81322 synthetic grease)",
    ],
    safetyPrecautions: [
      "EXPLOSION HAZARD: Always verify complete tire deflation via Schrader valve core removal before loosening axle tie bolts or spindle nut.",
      "Carbon brake dust contains airborne particulates; avoid blowing with compressed air. Use approved HEPA vacuum or solvent wipe.",
      "Never touch wheel or brake components within 45 minutes of landing rollout; temperatures can exceed 500°C.",
    ],
    steps: [
      {
        step: 1,
        action:
          "Install axle jack, raise wheel clear of ground, install jack safety lock collar, and deflate tire through certified deflator cap.",
        acceptanceTolerance: "Tire internal pressure must read 0.0 PSI; confirm core pin is completely depressed.",
        criticalNotes: "Verify chocks on opposite main gear and nose gear.",
      },
      {
        step: 2,
        action:
          "Cut safety lockwire, remove 45mm axle nut and outer thrust washer, and slide wheel assembly onto wheel dolly.",
        acceptanceTolerance: "Inspect axle spindle journals for fretting corrosion or micro-scoring (< 0.001 in allowable).",
        criticalNotes: "Support wheel weight to prevent cocking and damaging spindle threads.",
      },
      {
        step: 3,
        action:
          "Perform High-Frequency Eddy Current (ET) inspection around the forged aluminum wheel tubeless bead seat radius.",
        acceptanceTolerance: "Zero crack indications permitted. Reject rim if conductivity shift exceeds 2% IACS.",
        criticalNotes: "Pay special attention to the bead seat radius adjacent to the brake heat shield.",
      },
      {
        step: 4,
        action:
          "Degrease, clean, and inspect inner and outer tapered roller bearings and cone assemblies. Repack with fresh MIL-PRF-81322 grease.",
        acceptanceTolerance: "Bearings must rotate smoothly with zero brinelling, spalling, or thermal discoloration.",
        criticalNotes: "Ensure grease 100% fills the spaces between all tapered rollers.",
      },
      {
        step: 5,
        action:
          "Reinstall wheel assembly onto axle spindle, torque axle nut to initial seating torque of 400 Nm while rotating wheel, back off 1/4 turn, and retorque to final running spec of 220 Nm. Install cotter pin lock.",
        acceptanceTolerance: "Wheel must spin freely for minimum 3 revolutions with zero measurable axial end play.",
        criticalNotes: "Install new MS24665 stainless steel cotter pin with legs bent securely over nut flats.",
      },
    ],
  },
  {
    id: "amm-72-00-10",
    machineId: "turbine-stage",
    title: "Annular Combustor Flame Tube Effusion Hole Decoking & Fuel Nozzle Flow Check",
    ataChapter: "ATA 72-00-10",
    applicableAircraft: "High-Bypass Turbofans & Turbojets",
    intervalRequirement: "800 Flight Hours / Heavy C-Check",
    requiredPersonnel: "Powerplant Technician & NDT Specialist",
    ppeRequired: [
      "Nitrile Gloves & Chemical Splash Goggles",
      "FFP3 Dust Respirator",
      "Safety Shoes",
    ],
    specialTools: [
      "High-Pressure Fuel Nozzle Test Stand (MIL-PRF-7024 calibration fluid)",
      "Boroscope Optical Caliper Probe",
      "Ultrasonic Solvent Cleaning Bath",
    ],
    safetyPrecautions: [
      "Ensure engine fuel shutoff valve (HP shutoff) is mechanically locked closed and tagged out.",
      "Calibrating fluid is flammable: conduct nozzle testing in intrinsically safe, ventilated spray booth.",
      "Never use metallic wire to clean laser-drilled effusion holes; scratches alter cooling flow boundary layer.",
    ],
    steps: [
      {
        step: 1,
        action:
          "Disconnect high-pressure fuel manifold lines, tag all 18 duplex fuel nozzles by engine sector position, and extract nozzles from casing ports.",
        acceptanceTolerance: "Inspect nozzle O-rings and backup rings for thermal hardening.",
        criticalNotes: "Cap all fuel line ports immediately to prevent particulate contamination.",
      },
      {
        step: 2,
        action:
          "Mount nozzles in automated spray pattern test stand; measure atomization spray angle and volumetric flow at 150 PSI and 450 PSI.",
        acceptanceTolerance: "Spray cone angle within 85° ± 3°; flow rate variation among nozzles < 2.0%.",
        criticalNotes: "Streaking or asymmetric fuel spray causes localized combustor hot spots and turbine blade burning.",
      },
      {
        step: 3,
        action:
          "Inspect combustor liner dilution air ports and laser effusion cooling holes for carbon coking and blockage.",
        acceptanceTolerance: "Total effusion hole blockage must not exceed 5% across any single combustion quadrant.",
        criticalNotes: "Clean carbon deposits using approved oxygenated solvent and non-abrasive nylon brushes.",
      },
      {
        step: 4,
        action:
          "Reinstall fuel nozzles with new silver-plated metal C-seals, torque mounting flange bolts to 120 in-lbs (13.5 Nm), and lockwire.",
        acceptanceTolerance: "Perform post-installation fuel pressure leak check at 600 PSI for 3 minutes without pressure drop.",
        criticalNotes: "Ensure zero fuel weeping into combustor drain mast.",
      },
    ],
  },
  {
    id: "amm-24-00-00",
    machineId: "landing-gear-strut",
    title: "Aircraft Maintenance Electrical Grounding, Static Bonding & Lockout/Tagout Safety",
    ataChapter: "ATA 24-00-00",
    applicableAircraft: "All Commercial & Military Aircraft Types",
    intervalRequirement: "Mandatory Prior to All Maintenance Actions",
    requiredPersonnel: "All Line Maintenance Technicians & Crew Chiefs",
    ppeRequired: [
      "Safety Eyewear (ANSI Z87.1)",
      "High-Visibility Safety Vest",
      "ESD Anti-Static Grounding Wristband",
      "Steel-Toe Non-Sparking Work Boots",
    ],
    specialTools: [
      "Calibrated Milli-Ohmmeter (Bonding Meter, 0-100 mΩ)",
      "Heavy-Duty Bronze Static Grounding Clamps & Flexible Braided Copper Cables",
      "Lockout/Tagout Safety Padlocks & High-Visibility Danger Tags",
    ],
    safetyPrecautions: [
      "CRITICAL: Static electricity discharge can ignite fuel vapors during fuel draining, nozzle testing, or fluid servicing.",
      "Attach aircraft ground cable to certified ramp grounding point BEFORE connecting ground power or commencing mechanical disassembly.",
      "Verify zero electrical potential between airframe and ground receptacle before touching fueling or hydraulic equipment.",
    ],
    steps: [
      {
        step: 1,
        action:
          "Attach approved copper ground clamp to aircraft main gear dedicated grounding lug and connect other end to ramp earth ground receptacle.",
        acceptanceTolerance: "Ground cable must be securely clamped to bare metal; zero paint interference.",
        criticalNotes: "Never clamp onto chromed shock strut piston or brake hydraulic lines.",
      },
      {
        step: 2,
        action:
          "Measure electrical bonding resistance across landing gear shock strut scissor links and wheel axle bonding jumpers using calibrated milli-ohmmeter.",
        acceptanceTolerance: "Maximum electrical bonding resistance across any mechanical joint: ≤ 0.05 ohms (50 milli-ohms).",
        criticalNotes: "Scissor link bonding straps dissipate static charges generated by high-speed tire friction on runway rollout.",
      },
      {
        step: 3,
        action:
          "Install red 'REMOVE BEFORE FLIGHT' safety downlock pins in all landing gear retract actuators and scissor lock links.",
        acceptanceTolerance: "Verify lock pin ball-detents are fully engaged and through-hole flags are clearly visible.",
        criticalNotes: "Prevents accidental gear retraction during hydraulic system pressurization.",
      },
      {
        step: 4,
        action:
          "Open cockpit circuit breakers for landing gear hydraulic pump, radar altimeter, and ignition exciters; install lockout collars and tags.",
        acceptanceTolerance: "Tags must record technician name, license number, date, and maintenance release authorization.",
        criticalNotes: "Collar locks prevent accidental breaker reset during maintenance.",
      },
    ],
  },
];
