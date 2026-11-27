import { create } from "zustand";
import {
  TUTORIALS_DATA,
  QUIZ_QUESTIONS,
  COMPONENT_CARDS,
  GLOSSARY_TERMS,
  MAINTENANCE_PROCEDURES,
  MachineTutorial,
  QuizQuestion,
  ComponentFunctionCard,
  GlossaryTerm,
  MaintenanceProcedure,
} from "../data/learningData";
import { getMachineById } from "../data/machinesData";

export type LearningTab =
  | "tutorials"
  | "quizzes"
  | "cards"
  | "glossary"
  | "maintenance"
  | "assistant";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: number;
  referencedParts?: string[];
}

interface LearningState {
  // Navigation & View
  currentMachineId: string;
  activeTab: LearningTab;

  // Tutorial State
  activeTutorialStep: number;
  completedTutorialSteps: number[];

  // Quiz State
  activeQuizIndex: number;
  selectedOptionIndex: number | null;
  quizSubmitted: boolean;
  score: number;
  streak: number;
  quizCompleted: boolean;
  userAnswers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];

  // Component Cards & Glossary Filters
  selectedCardId: string | null;
  isCardFlipped: boolean;
  glossarySearchQuery: string;
  glossarySelectedCategory: string | null;

  // Aircraft Maintenance Procedures
  activeProcedureId: string;
  completedProcedureSteps: number[];

  // AI Assistant State
  messages: ChatMessage[];
  isAssistantThinking: boolean;
  customApiKey: string;
  aiProvider: "gemini" | "anthropic" | "builtin";

  // Actions
  setMachineId: (id: string) => void;
  setActiveTab: (tab: LearningTab) => void;

  // Tutorial Actions
  nextTutorialStep: () => void;
  prevTutorialStep: () => void;
  setTutorialStep: (step: number) => void;

  // Quiz Actions
  selectQuizOption: (index: number) => void;
  submitQuizAnswer: () => void;
  nextQuizQuestion: () => void;
  resetQuiz: () => void;

  // Card & Glossary Actions
  selectCard: (id: string | null) => void;
  toggleCardFlip: () => void;
  setGlossarySearch: (query: string) => void;
  setGlossaryCategory: (cat: string | null) => void;

  // Maintenance Actions
  setActiveProcedure: (id: string) => void;
  toggleProcedureStep: (stepNumber: number) => void;

  // AI Assistant Actions
  sendMessage: (prompt: string) => Promise<void>;
  setCustomApiKey: (key: string) => void;
  setAiProvider: (provider: "gemini" | "anthropic" | "builtin") => void;
  clearChat: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-msg",
    sender: "assistant",
    text: "Welcome to the MorphDrive Aero-Mechanical Learning Laboratory! I am your Senior Propulsion & Airframe Systems Engineering Assistant. Ask me anything regarding mechanical tolerances, metallurgy, oleo hydraulics, gas turbine thermodynamics, or FAA/EASA maintenance procedures.",
    timestamp: Date.now(),
  },
];

export const useLearningStore = create<LearningState>((set, get) => ({
  currentMachineId: "landing-gear-strut",
  activeTab: "tutorials",

  activeTutorialStep: 0,
  completedTutorialSteps: [],

  activeQuizIndex: 0,
  selectedOptionIndex: null,
  quizSubmitted: false,
  score: 0,
  streak: 0,
  quizCompleted: false,
  userAnswers: [],

  selectedCardId: null,
  isCardFlipped: false,
  glossarySearchQuery: "",
  glossarySelectedCategory: null,

  activeProcedureId: "amm-32-11-00",
  completedProcedureSteps: [],

  messages: INITIAL_MESSAGES,
  isAssistantThinking: false,
  customApiKey: typeof window !== "undefined" ? localStorage.getItem("morphdrive_ai_key") || "" : "",
  aiProvider: "builtin",

  setMachineId: (id: string) => {
    set({
      currentMachineId: id,
      activeTutorialStep: 0,
      activeQuizIndex: 0,
      selectedOptionIndex: null,
      quizSubmitted: false,
      score: 0,
      streak: 0,
      quizCompleted: false,
      userAnswers: [],
      selectedCardId: null,
      isCardFlipped: false,
    });
  },

  setActiveTab: (tab: LearningTab) => set({ activeTab: tab }),

  nextTutorialStep: () => {
    const { activeTutorialStep, currentMachineId, completedTutorialSteps } = get();
    const tutorial = TUTORIALS_DATA[currentMachineId];
    if (!tutorial) return;

    const next = Math.min(activeTutorialStep + 1, tutorial.steps.length - 1);
    const updated = completedTutorialSteps.includes(activeTutorialStep)
      ? completedTutorialSteps
      : [...completedTutorialSteps, activeTutorialStep];

    set({ activeTutorialStep: next, completedTutorialSteps: updated });
  },

  prevTutorialStep: () => {
    const { activeTutorialStep } = get();
    set({ activeTutorialStep: Math.max(0, activeTutorialStep - 1) });
  },

  setTutorialStep: (step: number) => set({ activeTutorialStep: step }),

  selectQuizOption: (index: number) => {
    if (get().quizSubmitted) return;
    set({ selectedOptionIndex: index });
  },

  submitQuizAnswer: () => {
    const {
      currentMachineId,
      activeQuizIndex,
      selectedOptionIndex,
      score,
      streak,
      userAnswers,
    } = get();

    if (selectedOptionIndex === null || get().quizSubmitted) return;

    const questions = QUIZ_QUESTIONS[currentMachineId] || [];
    const question = questions[activeQuizIndex];
    if (!question) return;

    const isCorrect = selectedOptionIndex === question.correctOptionIndex;
    const newScore = isCorrect ? score + 100 + streak * 10 : Math.max(0, score - 20);
    const newStreak = isCorrect ? streak + 1 : 0;

    set({
      quizSubmitted: true,
      score: newScore,
      streak: newStreak,
      userAnswers: [
        ...userAnswers,
        { questionId: question.id, selectedIndex: selectedOptionIndex, isCorrect },
      ],
    });
  },

  nextQuizQuestion: () => {
    const { currentMachineId, activeQuizIndex } = get();
    const questions = QUIZ_QUESTIONS[currentMachineId] || [];

    if (activeQuizIndex + 1 >= questions.length) {
      set({ quizCompleted: true });
    } else {
      set({
        activeQuizIndex: activeQuizIndex + 1,
        selectedOptionIndex: null,
        quizSubmitted: false,
      });
    }
  },

  resetQuiz: () => {
    set({
      activeQuizIndex: 0,
      selectedOptionIndex: null,
      quizSubmitted: false,
      score: 0,
      streak: 0,
      quizCompleted: false,
      userAnswers: [],
    });
  },

  selectCard: (id: string | null) => set({ selectedCardId: id, isCardFlipped: false }),
  toggleCardFlip: () => set((s) => ({ isCardFlipped: !s.isCardFlipped })),
  setGlossarySearch: (query: string) => set({ glossarySearchQuery: query }),
  setGlossaryCategory: (cat: string | null) => set({ glossarySelectedCategory: cat }),

  setActiveProcedure: (id: string) => set({ activeProcedureId: id, completedProcedureSteps: [] }),
  toggleProcedureStep: (stepNumber: number) => {
    const { completedProcedureSteps } = get();
    if (completedProcedureSteps.includes(stepNumber)) {
      set({ completedProcedureSteps: completedProcedureSteps.filter((s) => s !== stepNumber) });
    } else {
      set({ completedProcedureSteps: [...completedProcedureSteps, stepNumber] });
    }
  },

  setCustomApiKey: (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("morphdrive_ai_key", key);
    }
    set({ customApiKey: key });
  },

  setAiProvider: (provider: "gemini" | "anthropic" | "builtin") => set({ aiProvider: provider }),

  clearChat: () => set({ messages: INITIAL_MESSAGES }),

  sendMessage: async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: Date.now(),
    };

    set((s) => ({
      messages: [...s.messages, userMsg],
      isAssistantThinking: true,
    }));

    const { currentMachineId, customApiKey, aiProvider } = get();
    const machine = getMachineById(currentMachineId);

    // Call external API if Gemini / Anthropic key is supplied, else use built-in engine
    try {
      let replyText = "";

      if (aiProvider === "gemini" && customApiKey) {
        // Direct call to Gemini 1.5 Flash endpoint
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
          customApiKey
        )}`;

        const systemPrompt = `You are MorphDrive AeroMentor, a Senior Aerospace and Mechanical Engineering Chief Mechanic. You have direct access to the 3D model metadata for '${machine.name}' (${machine.category}).
Parts: ${machine.parts.map((p) => `${p.displayName} (${p.material})`).join(", ")}.
Answer the user's question with precise engineering formulas, metallurgy reasoning, torque specifications, and FAA/EASA maintenance guidelines. Be concise, structured, and technically rigorous.`;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }],
              },
            ],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          replyText =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Unable to parse response from Gemini API.";
        } else {
          throw new Error(`Gemini API error: ${res.statusText}`);
        }
      } else if (aiProvider === "anthropic" && customApiKey) {
        // Direct call to Anthropic Claude 3.5 Sonnet Messages API
        const systemPrompt = `You are MorphDrive AeroMentor, a Senior Aerospace and Mechanical Engineering Chief Mechanic. You have direct access to the 3D model metadata for '${machine.name}' (${machine.category}).
Parts: ${machine.parts.map((p) => `${p.displayName} (${p.material})`).join(", ")}.
Answer the user's question with precise engineering formulas, metallurgy reasoning, torque specifications, and FAA/EASA maintenance guidelines. Be concise, structured, and technically rigorous.`;

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": customApiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          replyText =
            data.content?.[0]?.text ||
            "Unable to parse response from Anthropic Claude API.";
        } else {
          throw new Error(`Anthropic API error: ${res.statusText}`);
        }
      } else {
        // Built-in intelligent aerospace & mechanical knowledge engine
        await new Promise((r) => setTimeout(r, 650)); // simulate cognitive synthesis
        replyText = generateContextualEngineeringResponse(prompt, machine);
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: replyText,
        timestamp: Date.now(),
      };

      set((s) => ({
        messages: [...s.messages, assistantMsg],
        isAssistantThinking: false,
      }));
    } catch (err: any) {
      // Graceful fallback to built-in expert engine on network or key errors
      const fallbackText = generateContextualEngineeringResponse(prompt, machine);
      const assistantMsg: ChatMessage = {
        id: `assistant-fallback-${Date.now()}`,
        sender: "assistant",
        text: `${fallbackText}\n\n*(Note: Generated via MorphDrive Built-in Mechanical Intelligence Engine due to API configuration status)*`,
        timestamp: Date.now(),
      };

      set((s) => ({
        messages: [...s.messages, assistantMsg],
        isAssistantThinking: false,
      }));
    }
  },
}));

/**
 * High-fidelity contextual mechanical engineering inference engine
 */
function generateContextualEngineeringResponse(prompt: string, machine: any): string {
  const p = prompt.toLowerCase();

  if (p.includes("oleo") || p.includes("landing gear") || p.includes("nitrogen") || p.includes("shock")) {
    return `### Oleo-Pneumatic Strut Damping & Thermodynamics

The **Aircraft Oleo-Pneumatic Shock Absorber** employs a dual-stage kinetic dissipation principle:
1. **Hydraulic Damping**: On touchdown, kinetic velocity forces MIL-PRF-5606 fluid through a calibrated orifice governed by a tapered **metering pin**. Viscous head loss converts the kinetic energy of sink rates ($E_k = \\frac{1}{2} M v_z^2$) directly into thermal fluid dissipation ($E = \\int \\Delta P \\cdot Q \\, dt$).
2. **Nitrogen Gas Spring**: Compressing the upper dry nitrogen gas chamber acts as a progressive pneumatic spring ($P V^\\gamma = C$, where $\\gamma \\approx 1.4$), providing roll compliance and rebound damping.
3. **Metallurgy**: Fabricated from **300M ultra-high-strength steel** (UTS > 1,930 MPa) with hard chromium plating to resist severe dynamic chevron seal friction and gravel impingement.`;
  }

  if (p.includes("turbine") || p.includes("blade") || p.includes("inconel") || p.includes("heat") || p.includes("tbc")) {
    return `### Gas Turbine Hot-Section Engineering

The **High-Pressure Gas Turbine Stage** operates in extreme aerothermal environments:
- **Centrifugal Acceleration**: Rotating blades experience over **25,000 g's** at 15,000 RPM, exerting tens of kilonewtons of tensile pull on each blade root.
- **Fir-Tree Root Lobes**: Multi-serrated fir-tree geometries distribute concentrated hoop stresses across 3-4 interlocking lobes in the **Inconel 718** rotor disk.
- **Thermal Barrier Coating (TBC)**: **CMSX-4 single-crystal superalloys** are shielded with 150-250 μm of Yttria-Stabilized Zirconia (YSZ) and internal serpentine cooling circuits, lowering base metal temperature by 120-150°C below the 1,400°C combustion gas stream.`;
  }

  if (p.includes("material") || p.includes("steel") || p.includes("aluminum") || p.includes("titanium")) {
    return `### Materials & Metallurgy Selection for ${machine.name}

Components in **${machine.name}** are specified according to stringent aerospace and automotive duty cycles:
- **High-Strength Alloys**: 300M steel and Inconel 718 provide high yield thresholds under thermal and cyclic fatigue.
- **Lightweight Kinematics**: 7075-T73 aluminum forgings provide high stress-corrosion resistance for torque scissor links.
- **High-Hardness Wear Pairs**: Carburized steels and bronze bushings prevent galling under high-contact pressures.`;
  }

  if (p.includes("maintenance") || p.includes("safety") || p.includes("inspection") || p.includes("amm")) {
    return `### Standard Airworthiness & Inspection Protocols

Referencing **FAA AC 43.13-1B** and **ATA Chapter 32 / 72** specifications:
1. **Zero-Pressure Verification**: Never open nitrogen charging ports or hydraulic lines without calibrated gauge verification at 0.0 PSI.
2. **NDT Procedures**: Non-magnetic superalloys require **Type I Fluorescent Liquid Penetrant (FPI)** or high-frequency Eddy Current (ET) to detect sub-millimeter fatigue cracks.
3. **Torque Standards**: All critical fasteners require calibrated criss-cross or diagonal torque sequences to prevent deck warping and flange distortion.`;
  }

  return `### Engineering Analysis for ${machine.name}

Regarding your query on **${machine.name}**:
- **System Architecture**: Comprises ${machine.parts.length} key components designed for **${machine.difficulty}** operational duty.
- **Kinematic Hierarchy**: ${machine.description}
- **Operating Advice**: For hands-on disassembly and clearance validation, consult the **Interactive Disassembly Lab** or inspect the **Component Flashcards** tab for exact material properties and wear limits.`;
}
