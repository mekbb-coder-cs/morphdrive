import { create } from "zustand";
import { MACHINES_LIST, MachineMetadata, getMachineById } from "../data/machinesData";

export type DashboardRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export interface StudentProgressItem {
  machineId: string;
  name: string;
  category: string;
  masteryPercent: number;
  disassemblyCompleted: boolean;
  reassemblyCompleted: boolean;
  bestDisassemblySeconds: number;
  bestReassemblySeconds: number;
  quizScorePercent: number;
  lastAttemptDate: string;
}

export interface StudentBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: "DISASSEMBLY" | "INSPECTION" | "SAFETY" | "MASTERY";
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StepMistakeStat {
  machineId: string;
  stepNumber: number;
  stepTitle: string;
  targetPart: string;
  failureRatePercent: number;
  totalAttempts: number;
  failureCount: number;
  primaryMistakeReason: string;
  hazardRisk: "HIGH" | "MEDIUM" | "LOW";
}

export interface ClassStudentRow {
  id: string;
  name: string;
  email: string;
  enrolledDate: string;
  machinesCompleted: number;
  avgScorePercent: number;
  fastestDisassemblySec: number;
  totalErrorsCommitted: number;
  status: "EXCELLING" | "ON_TRACK" | "NEEDS_HELP";
  lastActive: string;
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: DashboardRole;
  status: "ACTIVE" | "INACTIVE";
  registeredAt: string;
  lastLogin: string;
}

export interface EditablePart {
  id: string;
  meshName: string;
  displayName: string;
  material: string;
  function: string;
  massKg: number;
  kinematicType: "RIGID" | "ROTATIONAL" | "TRANSLATIONAL" | "PLANAR";
}

export interface EditableStep {
  order: number;
  partId: string;
  meshName: string;
  action: string;
  tolerance: number;
  hint: string;
  safetyWarning: string;
  toolRequired: string;
}

interface DashboardState {
  // Active viewing role
  activeRole: DashboardRole;
  setActiveRole: (role: DashboardRole) => void;

  // Student Dashboard State
  studentUser: {
    id: string;
    name: string;
    email: string;
    program: string;
    institution: string;
    avatarUrl: string;
  };
  studentProgress: StudentProgressItem[];
  studentBadges: StudentBadge[];
  bestLapTimeMs: number;

  // Instructor Dashboard State
  classStats: {
    totalEnrolled: number;
    activeThisWeek: number;
    avgCompletionRate: number;
    avgAssessmentScore: number;
    totalDisassemblyRuns: number;
    mostChallengingMachine: string;
  };
  stepMistakes: StepMistakeStat[];
  classRoster: ClassStudentRow[];
  exportClassCsv: () => void;

  // Admin Dashboard State
  adminUsers: AdminUserRow[];
  selectedAdminMachineId: string;
  editableParts: Record<string, EditablePart[]>;
  editableSteps: Record<string, EditableStep[]>;

  // Admin Actions
  setSelectedAdminMachine: (machineId: string) => void;
  updateUserRole: (userId: string, role: DashboardRole) => void;
  toggleUserStatus: (userId: string) => void;
  addUser: (name: string, email: string, role: DashboardRole) => void;
  updatePart: (machineId: string, partId: string, updates: Partial<EditablePart>) => void;
  updateStep: (machineId: string, order: number, updates: Partial<EditableStep>) => void;
  uploadNewModel: (modelData: {
    name: string;
    category: string;
    difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    description: string;
    fileName: string;
  }) => void;
}

const INITIAL_PROGRESS: StudentProgressItem[] = [
  {
    machineId: "landing-gear-strut",
    name: "Aircraft Oleo-Pneumatic Strut",
    category: "Aerospace Kinematics",
    masteryPercent: 100,
    disassemblyCompleted: true,
    reassemblyCompleted: true,
    bestDisassemblySeconds: 48,
    bestReassemblySeconds: 54,
    quizScorePercent: 96,
    lastAttemptDate: "Nov 25, 2026",
  },
  {
    machineId: "turbine-stage",
    name: "HP Gas Turbine Stage",
    category: "Propulsion & Hot Sections",
    masteryPercent: 88,
    disassemblyCompleted: true,
    reassemblyCompleted: true,
    bestDisassemblySeconds: 72,
    bestReassemblySeconds: 86,
    quizScorePercent: 90,
    lastAttemptDate: "Nov 24, 2026",
  },
  {
    machineId: "single-cylinder-engine",
    name: "Internal Combustion Engine",
    category: "Reciprocating Machines",
    masteryPercent: 100,
    disassemblyCompleted: true,
    reassemblyCompleted: true,
    bestDisassemblySeconds: 36,
    bestReassemblySeconds: 42,
    quizScorePercent: 94,
    lastAttemptDate: "Nov 23, 2026",
  },
  {
    machineId: "gearbox",
    name: "Synchromesh Manual Transmission",
    category: "Geared Drivetrains",
    masteryPercent: 74,
    disassemblyCompleted: true,
    reassemblyCompleted: false,
    bestDisassemblySeconds: 58,
    bestReassemblySeconds: 64,
    quizScorePercent: 82,
    lastAttemptDate: "Nov 22, 2026",
  },
];

const INITIAL_BADGES: StudentBadge[] = [
  {
    id: "b-first-spark",
    title: "First Inspection",
    description: "Completed first interactive 3D mechanism inspection and caliper measurement.",
    iconName: "Eye",
    category: "INSPECTION",
    unlocked: true,
    unlockedAt: "Nov 20, 2026",
  },
  {
    id: "b-sub-minute",
    title: "Sub-Minute Teardown",
    description: "Disassembled an assembly with 100% DAG adherence in under 60 seconds.",
    iconName: "Zap",
    category: "DISASSEMBLY",
    unlocked: true,
    unlockedAt: "Nov 22, 2026",
  },
  {
    id: "b-zero-defect",
    title: "Zero-Defect Reassembly",
    description: "Successfully reassembled a multi-component machine with zero snap misalignments.",
    iconName: "CheckCircle",
    category: "DISASSEMBLY",
    unlocked: true,
    unlockedAt: "Nov 24, 2026",
  },
  {
    id: "b-turbine-master",
    title: "Turbine Specialist",
    description: "Scored 90%+ on single-crystal blade and fir-tree root hot-section assessment.",
    iconName: "Flame",
    category: "MASTERY",
    unlocked: true,
    unlockedAt: "Nov 25, 2026",
  },
  {
    id: "b-airworthiness-ace",
    title: "Airworthiness Ace",
    description: "Signed off all 5 FAA/EASA Aircraft Maintenance Manual procedures without errors.",
    iconName: "ShieldCheck",
    category: "SAFETY",
    unlocked: true,
    unlockedAt: "Nov 25, 2026",
  },
  {
    id: "b-scissor-ace",
    title: "Scissor Link Ace",
    description: "Mastered 1-DOF planar torque scissor apex disconnection & bushing tolerance check.",
    iconName: "Wrench",
    category: "DISASSEMBLY",
    unlocked: true,
    unlockedAt: "Nov 23, 2026",
  },
  {
    id: "b-morph-pioneer",
    title: "Kinematic Sorcerer",
    description: "Iterated dynamic morph states across Street, Off-Road, and Aero operating regimes.",
    iconName: "Sliders",
    category: "MASTERY",
    unlocked: true,
    unlockedAt: "Nov 21, 2026",
  },
  {
    id: "b-master-cert",
    title: "Master Aerospace Tech",
    description: "Achieve 90%+ mastery across all curriculum machines (3 of 4 completed).",
    iconName: "Award",
    category: "MASTERY",
    unlocked: false,
  },
];

const INITIAL_MISTAKES: StepMistakeStat[] = [
  {
    machineId: "landing-gear-strut",
    stepNumber: 4,
    stepTitle: "Torque Scissor Linkage Apex Disconnection",
    targetPart: "LowerTorqueLink",
    failureRatePercent: 44.2,
    totalAttempts: 182,
    failureCount: 80,
    primaryMistakeReason: "Attempted removing scissor arms before extracting the central apex hinge bolt.",
    hazardRisk: "HIGH",
  },
  {
    machineId: "landing-gear-strut",
    stepNumber: 2,
    stepTitle: "Dual Main Wheel Assembly Demounting",
    targetPart: "Tire_Left",
    failureRatePercent: 38.6,
    totalAttempts: 195,
    failureCount: 75,
    primaryMistakeReason: "Attempted loosening 45mm axle nut before completing nitrogen pressure bleed.",
    hazardRisk: "HIGH",
  },
  {
    machineId: "landing-gear-strut",
    stepNumber: 1,
    stepTitle: "Retract Actuator Depressurization",
    targetPart: "RetractActuator",
    failureRatePercent: 31.0,
    totalAttempts: 210,
    failureCount: 65,
    primaryMistakeReason: "Disconnected pivot trunnion pin before verifying 0.0 PSI on bleeder gauge.",
    hazardRisk: "HIGH",
  },
  {
    machineId: "turbine-stage",
    stepNumber: 2,
    stepTitle: "Annular Containment Casing Split",
    targetPart: "TurbineCasing",
    failureRatePercent: 26.5,
    totalAttempts: 147,
    failureCount: 39,
    primaryMistakeReason: "Failed to release circumferential flange fasteners in cross-spiral order.",
    hazardRisk: "MEDIUM",
  },
  {
    machineId: "gearbox",
    stepNumber: 2,
    stepTitle: "Synchromesh Baulk Ring Extraction",
    targetPart: "SynchromeshRing",
    failureRatePercent: 22.8,
    totalAttempts: 136,
    failureCount: 31,
    primaryMistakeReason: "Prying brass cone without covering spring-loaded detent hub balls.",
    hazardRisk: "MEDIUM",
  },
  {
    machineId: "single-cylinder-engine",
    stepNumber: 2,
    stepTitle: "Cylinder Head Stud Release",
    targetPart: "CylinderHead",
    failureRatePercent: 18.4,
    totalAttempts: 168,
    failureCount: 31,
    primaryMistakeReason: "Loosening head bolts diagonally without following reverse torque spiral.",
    hazardRisk: "LOW",
  },
];

const INITIAL_CLASS_ROSTER: ClassStudentRow[] = [
  {
    id: "std-001",
    name: "Alex Chen",
    email: "a.chen@university.edu",
    enrolledDate: "Sep 2026",
    machinesCompleted: 3,
    avgScorePercent: 94.2,
    fastestDisassemblySec: 36,
    totalErrorsCommitted: 4,
    status: "EXCELLING",
    lastActive: "Today at 11:42 AM",
  },
  {
    id: "std-002",
    name: "Beatriz Rossi",
    email: "b.rossi@university.edu",
    enrolledDate: "Sep 2026",
    machinesCompleted: 4,
    avgScorePercent: 96.8,
    fastestDisassemblySec: 32,
    totalErrorsCommitted: 2,
    status: "EXCELLING",
    lastActive: "Today at 09:15 AM",
  },
  {
    id: "std-003",
    name: "Marcus Vance Jr.",
    email: "m.vance@university.edu",
    enrolledDate: "Sep 2026",
    machinesCompleted: 2,
    avgScorePercent: 78.5,
    fastestDisassemblySec: 54,
    totalErrorsCommitted: 14,
    status: "ON_TRACK",
    lastActive: "Yesterday",
  },
  {
    id: "std-004",
    name: "Priya Patel",
    email: "p.patel@university.edu",
    enrolledDate: "Sep 2026",
    machinesCompleted: 3,
    avgScorePercent: 88.0,
    fastestDisassemblySec: 44,
    totalErrorsCommitted: 7,
    status: "ON_TRACK",
    lastActive: "Nov 24, 2026",
  },
  {
    id: "std-005",
    name: "David Kim",
    email: "d.kim@university.edu",
    enrolledDate: "Sep 2026",
    machinesCompleted: 1,
    avgScorePercent: 62.4,
    fastestDisassemblySec: 89,
    totalErrorsCommitted: 23,
    status: "NEEDS_HELP",
    lastActive: "Nov 21, 2026",
  },
  {
    id: "std-006",
    name: "Elena Rostova",
    email: "e.rostova@university.edu",
    enrolledDate: "Sep 2026",
    machinesCompleted: 4,
    avgScorePercent: 98.2,
    fastestDisassemblySec: 29,
    totalErrorsCommitted: 1,
    status: "EXCELLING",
    lastActive: "Today at 01:20 PM",
  },
  {
    id: "std-007",
    name: "Liam O'Connor",
    email: "l.oconnor@university.edu",
    enrolledDate: "Sep 2026",
    machinesCompleted: 2,
    avgScorePercent: 74.0,
    fastestDisassemblySec: 62,
    totalErrorsCommitted: 18,
    status: "ON_TRACK",
    lastActive: "Nov 23, 2026",
  },
  {
    id: "std-008",
    name: "Sofia Mendez",
    email: "s.mendez@university.edu",
    enrolledDate: "Sep 2026",
    machinesCompleted: 1,
    avgScorePercent: 58.0,
    fastestDisassemblySec: 104,
    totalErrorsCommitted: 29,
    status: "NEEDS_HELP",
    lastActive: "Nov 19, 2026",
  },
];

const INITIAL_ADMIN_USERS: AdminUserRow[] = [
  {
    id: "usr-01",
    name: "Dr. Marcus Vance",
    email: "instructor@morphdrive.io",
    role: "INSTRUCTOR",
    status: "ACTIVE",
    registeredAt: "Sep 01, 2026",
    lastLogin: "Today at 12:04 PM",
  },
  {
    id: "usr-02",
    name: "Sarah Jenkins (System Admin)",
    email: "admin@morphdrive.io",
    role: "ADMIN",
    status: "ACTIVE",
    registeredAt: "Aug 15, 2026",
    lastLogin: "Today at 11:30 AM",
  },
  {
    id: "usr-03",
    name: "Alex Chen",
    email: "student@morphdrive.io",
    role: "STUDENT",
    status: "ACTIVE",
    registeredAt: "Sep 04, 2026",
    lastLogin: "Today at 12:20 PM",
  },
  {
    id: "usr-04",
    name: "Beatriz Rossi",
    email: "b.rossi@university.edu",
    role: "STUDENT",
    status: "ACTIVE",
    registeredAt: "Sep 05, 2026",
    lastLogin: "Today at 09:15 AM",
  },
  {
    id: "usr-05",
    name: "Visiting Guest Scholar",
    email: "guest@university.edu",
    role: "STUDENT",
    status: "INACTIVE",
    registeredAt: "Oct 10, 2026",
    lastLogin: "Oct 15, 2026",
  },
];

// Seed initial editable parts & steps from static machines metadata
const getInitialEditableParts = (): Record<string, EditablePart[]> => {
  const result: Record<string, EditablePart[]> = {};
  for (const m of MACHINES_LIST) {
    result[m.machineId] = m.parts.map((p) => ({
      id: p.id,
      meshName: p.meshName,
      displayName: p.displayName,
      material: p.material,
      function: p.function,
      massKg: p.massKg,
      kinematicType: p.kinematicType,
    }));
  }
  return result;
};

const getInitialEditableSteps = (): Record<string, EditableStep[]> => {
  const result: Record<string, EditableStep[]> = {};
  for (const m of MACHINES_LIST) {
    result[m.machineId] = m.assemblySteps.map((s) => ({
      order: s.order,
      partId: s.partId,
      meshName: s.meshName,
      action: s.action,
      tolerance: s.tolerance,
      hint: s.hint,
      safetyWarning: "Verify lockouts prior to tool engagement",
      toolRequired: s.toolRequired,
    }));
  }
  return result;
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  activeRole: "STUDENT",
  setActiveRole: (role) => set({ activeRole: role }),

  studentUser: {
    id: "std-001",
    name: "Alex Chen",
    email: "student@morphdrive.io",
    program: "B.S. Aerospace & Mechanical Engineering",
    institution: "Aeronautics Institute of Technology",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  studentProgress: INITIAL_PROGRESS,
  studentBadges: INITIAL_BADGES,
  bestLapTimeMs: 74280, // 1:14.280

  classStats: {
    totalEnrolled: 64,
    activeThisWeek: 58,
    avgCompletionRate: 78.4,
    avgAssessmentScore: 86.2,
    totalDisassemblyRuns: 412,
    mostChallengingMachine: "Aircraft Oleo-Pneumatic Strut",
  },
  stepMistakes: INITIAL_MISTAKES,
  classRoster: INITIAL_CLASS_ROSTER,

  exportClassCsv: () => {
    const { classRoster, stepMistakes } = get();

    let csvContent = "data:text/csv;charset=utf-8,";
    // Section 1: Student Roster
    csvContent += "=== STUDENT PERFORMANCE ROSTER ===\r\n";
    csvContent += "Student ID,Student Name,Email,Enrollment,Machines Completed,Average Score (%),Fastest Disassembly (s),Total Errors,Status,Last Active\r\n";

    classRoster.forEach((r) => {
      csvContent += `${r.id},"${r.name}",${r.email},${r.enrolledDate},${r.machinesCompleted},${r.avgScorePercent}%,${r.fastestDisassemblySec}s,${r.totalErrorsCommitted},${r.status},"${r.lastActive}"\r\n`;
    });

    // Section 2: Step Failure Frequency
    csvContent += "\r\n=== MOST FREQUENT STEP FAILURES & MISTAKES ===\r\n";
    csvContent += "Machine,Step Number,Step Title,Target Part,Failure Rate (%),Attempts,Failures,Primary Mistake Reason,Hazard Risk\r\n";

    stepMistakes.forEach((m) => {
      csvContent += `"${m.machineId}",${m.stepNumber},"${m.stepTitle}","${m.targetPart}",${m.failureRatePercent}%,${m.totalAttempts},${m.failureCount},"${m.primaryMistakeReason}",${m.hazardRisk}\r\n`;
    });

    // Trigger browser download
    if (typeof window !== "undefined") {
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `morphdrive_class_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  adminUsers: INITIAL_ADMIN_USERS,
  selectedAdminMachineId: "landing-gear-strut",
  editableParts: getInitialEditableParts(),
  editableSteps: getInitialEditableSteps(),

  setSelectedAdminMachine: (id) => set({ selectedAdminMachineId: id }),

  updateUserRole: (userId, newRole) => {
    set((s) => ({
      adminUsers: s.adminUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    }));
  },

  toggleUserStatus: (userId) => {
    set((s) => ({
      adminUsers: s.adminUsers.map((u) =>
        u.id === userId ? { ...u, status: u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : u
      ),
    }));
  },

  addUser: (name, email, role) => {
    const newUser: AdminUserRow = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name,
      email,
      role,
      status: "ACTIVE",
      registeredAt: "Just now",
      lastLogin: "Never",
    };
    set((s) => ({ adminUsers: [newUser, ...s.adminUsers] }));
  },

  updatePart: (machineId, partId, updates) => {
    set((s) => {
      const machineParts = s.editableParts[machineId] || [];
      const updated = machineParts.map((p) => (p.id === partId ? { ...p, ...updates } : p));
      return {
        editableParts: {
          ...s.editableParts,
          [machineId]: updated,
        },
      };
    });
  },

  updateStep: (machineId, order, updates) => {
    set((s) => {
      const machineSteps = s.editableSteps[machineId] || [];
      const updated = machineSteps.map((st) => (st.order === order ? { ...st, ...updates } : st));
      return {
        editableSteps: {
          ...s.editableSteps,
          [machineId]: updated,
        },
      };
    });
  },

  uploadNewModel: (data) => {
    // Generate new mock machine for catalog and editable state
    const newMachineId = data.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newParts: EditablePart[] = [
      {
        id: `p-${Date.now()}-1`,
        meshName: "PrimaryHousing",
        displayName: "Main Structural Housing",
        material: "Titanium Ti-6Al-4V",
        function: "Structural chassis containment and mounting datum",
        massKg: 12.5,
        kinematicType: "RIGID",
      },
      {
        id: `p-${Date.now()}-2`,
        meshName: "ActuatorCylinder",
        displayName: "Linear Kinetic Actuator",
        material: "300M Alloy Steel",
        function: "Extends and retracts variable geometry kinematic linkages",
        massKg: 4.8,
        kinematicType: "TRANSLATIONAL",
      },
    ];

    const newSteps: EditableStep[] = [
      {
        order: 1,
        partId: `p-${Date.now()}-2`,
        meshName: "ActuatorCylinder",
        action: "DISASSEMBLE",
        tolerance: 0.05,
        hint: "Depressurize hydraulic fittings before pin release",
        safetyWarning: "High-pressure hydraulic fluid hazard",
        toolRequired: "Hydraulic Line Spanner",
      },
    ];

    set((s) => ({
      editableParts: {
        ...s.editableParts,
        [newMachineId]: newParts,
      },
      editableSteps: {
        ...s.editableSteps,
        [newMachineId]: newSteps,
      },
      selectedAdminMachineId: newMachineId,
    }));
  },
}));
