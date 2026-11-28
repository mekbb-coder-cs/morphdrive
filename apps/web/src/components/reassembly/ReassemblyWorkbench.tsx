import React, { useEffect, useRef, useState } from "react";
import {
  useReassemblyStore,
  getInstallableParts,
  reverseSequence,
  ReassemblyMode,
} from "../../stores/useReassemblyStore";
import { MachineMetadata } from "../../data/machinesData";
import { MACHINE_DAGS } from "../../data/dependencyGraph";
import {
  Lightbulb,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Wrench,
  X,
  Sparkles,
  Trophy,
  ChevronDown,
  ChevronRight,
  Keyboard,
  Network,
  Clock,
  Target,
  BookOpen,
  FlaskConical,
  GraduationCap,
  PackagePlus,
  Timer,
} from "lucide-react";

interface Props {
  metadata: MachineMetadata;
}

const MODE_CONFIG: Record<
  ReassemblyMode,
  { label: string; icon: React.ReactNode; color: string; border: string; desc: string }
> = {
  practice: {
    label: "Practice",
    icon: <BookOpen size={14} />,
    color: "text-sky-300",
    border: "border-sky-400/50",
    desc: "Hints & auto-step available. No penalties.",
  },
  guided: {
    label: "Guided",
    icon: <FlaskConical size={14} />,
    color: "text-emerald-300",
    border: "border-emerald-400/50",
    desc: "Hints available. Wrong-order feedback. Score tracked.",
  },
  test: {
    label: "Test",
    icon: <GraduationCap size={14} />,
    color: "text-amber-300",
    border: "border-amber-400/50",
    desc: "No hints. Strict scoring. Time-limited.",
  },
};

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export const ReassemblyWorkbench: React.FC<Props> = ({ metadata }) => {
  const {
    currentMachineId,
    mode,
    setMode,
    trayParts,
    assembledParts,
    selectedPartMesh,
    snapTargetMesh,
    hintMessage,
    errorNotice,
    score,
    wrongOrderCount,
    hintsUsed,
    startTime,
    isComplete,
    finalAttempt,
    attemptInstallPart,
    animateNextStep,
    showNextStepHint,
    clearHint,
    clearErrorNotice,
    resetReassembly,
    selectPart,
    startSession,
  } = useReassemblyStore();

  const [dagOpen, setDagOpen] = useState(true);
  const [showHotkeys, setShowHotkeys] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dag = MACHINE_DAGS[currentMachineId];
  const totalParts = Object.keys(dag?.rules || {}).length;
  const progressPercent = Math.round((assembledParts.length / (totalParts || 1)) * 100);
  const installable = getInstallableParts(currentMachineId, assembledParts);
  const revSeq = reverseSequence(currentMachineId);

  const selectedRule = selectedPartMesh ? dag?.rules[selectedPartMesh] : null;
  const isSelectedInstalled = selectedPartMesh ? assembledParts.includes(selectedPartMesh) : false;
  const isSelectedInstallable = selectedPartMesh ? installable.includes(selectedPartMesh) : false;

  // Live timer
  useEffect(() => {
    if (isComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTime, isComplete]);

  // Auto-dismiss error toast after 3.5 s
  useEffect(() => {
    if (errorNotice) {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => clearErrorNotice(), 3500);
    }
    return () => { if (errorTimerRef.current) clearTimeout(errorTimerRef.current); };
  }, [errorNotice, clearErrorNotice]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case "h": case "H": if (mode !== "test") showNextStepHint(); break;
        case "n": case "N": if (mode !== "test") animateNextStep(); break;
        case "r": case "R": resetReassembly(); break;
        case "Escape": selectPart(null); clearHint(); clearErrorNotice(); setShowHotkeys(false); break;
        case "?": setShowHotkeys(p => !p); break;
        case " ":
          e.preventDefault();
          if (selectedPartMesh && !isSelectedInstalled && isSelectedInstallable) {
            attemptInstallPart(selectedPartMesh);
          }
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    mode,
    selectedPartMesh,
    isSelectedInstalled,
    isSelectedInstallable,
    showNextStepHint,
    animateNextStep,
    resetReassembly,
    selectPart,
    clearHint,
    clearErrorNotice,
    attemptInstallPart,
  ]);

  return (
    <>
      {/* ── Top Control Bar ── */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#0d1017]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-20 text-white select-none">

        {/* Progress */}
        <div className="flex items-center gap-3 px-3 py-1 bg-[#141824] rounded-xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-mono">Progress</span>
            <span className="text-xs font-bold text-emerald-300 font-mono">
              {assembledParts.length}/{totalParts} ({progressPercent}%)
            </span>
          </div>
          <div className="w-20 bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#141824] rounded-xl border border-white/5">
          <Trophy size={14} className="text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-mono">Score</span>
            <span className="text-xs font-bold text-amber-300 font-mono">{score} pts</span>
          </div>
          {wrongOrderCount > 0 && (
            <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
              {wrongOrderCount} err
            </span>
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#141824] rounded-xl border border-white/5">
          <Timer size={12} className="text-purple-400" />
          <span className="text-xs font-mono text-purple-300">{formatTime(elapsed)}</span>
        </div>

        {/* Installable badge */}
        {installable.length > 0 && !isComplete && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-400/40 rounded-xl">
            <PackagePlus size={12} className="text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-300">{installable.length} ready</span>
          </div>
        )}

        {/* Snap indicator */}
        {snapTargetMesh && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/15 border border-cyan-400/60 rounded-xl animate-pulse">
            <Target size={12} className="text-cyan-300" />
            <span className="text-[11px] font-bold text-cyan-200">SNAP READY</span>
          </div>
        )}

        <div className="w-px h-6 bg-white/10" />

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {mode !== "test" && (
            <button
              onClick={showNextStepHint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30 transition-all"
              title="Show Hint (H)"
            >
              <Lightbulb size={14} />
              <span className="hidden sm:inline">Hint</span>
              {hintsUsed > 0 && (
                <span className="text-[9px] opacity-60">({hintsUsed})</span>
              )}
            </button>
          )}

          {mode !== "test" && (
            <button
              onClick={animateNextStep}
              disabled={isComplete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/20 border border-sky-400/50 text-sky-300 hover:bg-sky-500/30 disabled:opacity-40 transition-all"
              title="Auto Install Next (N)"
            >
              <Play size={14} />
              <span className="hidden sm:inline">Auto Step</span>
            </button>
          )}

          <button
            onClick={resetReassembly}
            className="p-2 rounded-xl text-gray-400 hover:text-emerald-300 bg-white/5 hover:bg-white/10 transition-colors"
            title="Reset Assembly (R)"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={() => setShowHotkeys(p => !p)}
            className={`p-2 rounded-xl transition-colors ${showHotkeys ? "text-cyan-300 bg-cyan-500/15 border border-cyan-400/40" : "text-gray-400 hover:text-white bg-white/5"}`}
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard size={16} />
          </button>
        </div>
      </div>

      {/* ── Left Sidebar: Mode Selector + Assembly Sequence ── */}
      <div className="absolute left-4 top-24 bottom-6 w-72 flex flex-col gap-2 z-20 select-none">

        {/* Mode Selector Card */}
        <div className="bg-[#0d1017]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white overflow-hidden">
          <div className="px-3.5 py-3 border-b border-white/10 bg-[#0a0c12]/60">
            <span className="text-xs font-black uppercase tracking-wider text-white/70">
              Reassembly Mode
            </span>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {(Object.entries(MODE_CONFIG) as [ReassemblyMode, typeof MODE_CONFIG[ReassemblyMode]][]).map(
              ([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => { setMode(key); startSession(); }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-left transition-all border ${
                    mode === key
                      ? `bg-white/[0.07] ${cfg.border} ${cfg.color} font-semibold`
                      : "border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                  }`}
                >
                  <span className={mode === key ? cfg.color : "text-gray-500"}>{cfg.icon}</span>
                  <div>
                    <div className="font-bold">{cfg.label}</div>
                    <div className="text-[9px] opacity-60 font-normal mt-0.5">{cfg.desc}</div>
                  </div>
                  {mode === key && (
                    <span className="ml-auto text-[8px] font-mono bg-white/10 px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        </div>

        {/* Assembly Sequence Panel */}
        <div className="flex flex-col bg-[#0d1017]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white overflow-hidden flex-1 min-h-0">
          <button
            onClick={() => setDagOpen(p => !p)}
            className="flex items-center justify-between p-3.5 border-b border-white/10 bg-[#0a0c12]/60 hover:bg-white/5 transition-colors w-full"
          >
            <div className="flex items-center gap-2">
              <Network size={15} className="text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">Assembly Order</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400">{assembledParts.length}/{totalParts}</span>
              {dagOpen ? <ChevronDown size={13} className="text-gray-400" /> : <ChevronRight size={13} className="text-gray-400" />}
            </div>
          </button>

          {dagOpen && (
            <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
              {revSeq.map((meshName, idx) => {
                const rule = dag?.rules[meshName];
                const isInstalled = assembledParts.includes(meshName);
                const isInstallableNow = installable.includes(meshName);
                const isSelected = selectedPartMesh === meshName;
                const isInTray = trayParts.includes(meshName);

                return (
                  <div
                    key={meshName}
                    onClick={() => !isInstalled && selectPart(isSelected ? null : meshName)}
                    className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isInstalled
                        ? "bg-emerald-500/8 border-emerald-500/20 text-emerald-500"
                        : isSelected
                        ? "bg-amber-500/15 border-amber-400/60 text-amber-200 shadow-md"
                        : isInstallableNow
                        ? "bg-emerald-500/10 border-emerald-400/35 text-emerald-200 hover:bg-emerald-500/20"
                        : "bg-white/[0.03] border-white/5 text-gray-500 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold truncate flex-1 mr-2">
                        <span className="text-[9px] font-mono text-gray-500 w-4 flex-shrink-0">{idx + 1}.</span>
                        {isInstalled ? (
                          <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
                        ) : isInstallableNow ? (
                          <Unlock size={12} className="text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Lock size={12} className="text-gray-600 flex-shrink-0" />
                        )}
                        <span className="truncate text-[11px]">{rule?.displayName || meshName}</span>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold flex-shrink-0 ${
                        isInstalled
                          ? "bg-emerald-800/50 text-emerald-400"
                          : isInstallableNow
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-gray-800/50 text-gray-500"
                      }`}>
                        {isInstalled ? "✓ DONE" : isInstallableNow ? "READY" : isInTray ? "TRAY" : "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Completion Banner */}
          {isComplete && finalAttempt && (
            <div className="m-2 p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 text-center space-y-2">
              <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                <Sparkles size={14} />
                <span>Reassembly Complete!</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                <div className="bg-white/5 rounded-lg py-1.5 px-2">
                  <div className="text-gray-400">Score</div>
                  <div className="text-amber-300 font-bold text-sm">{finalAttempt.score}</div>
                </div>
                <div className="bg-white/5 rounded-lg py-1.5 px-2">
                  <div className="text-gray-400">Accuracy</div>
                  <div className="text-emerald-300 font-bold text-sm">{finalAttempt.accuracy}%</div>
                </div>
                <div className="bg-white/5 rounded-lg py-1.5 px-2">
                  <div className="text-gray-400">Time</div>
                  <div className="text-sky-300 font-bold">{formatTime(finalAttempt.durationMs ?? 0)}</div>
                </div>
                <div className="bg-white/5 rounded-lg py-1.5 px-2">
                  <div className="text-gray-400">Errors</div>
                  <div className="text-red-300 font-bold">{finalAttempt.wrongOrderPenalties}</div>
                </div>
              </div>
              {finalAttempt.hintPenalties > 0 && (
                <div className="text-[10px] text-yellow-400/80 font-mono">
                  Hints used: {finalAttempt.hintPenalties} (−{finalAttempt.hintPenalties * 15} pts)
                </div>
              )}
              <button
                onClick={resetReassembly}
                className="mt-1 w-full py-1.5 px-3 rounded-lg text-[11px] font-bold bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/40 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="px-3 py-2 border-t border-white/5 text-[10px] font-mono text-gray-500 bg-[#090b10]">
            {metadata.totalTriangles.toLocaleString()} tris · {metadata.difficulty}
          </div>
        </div>
      </div>

      {/* ── Right: Selected Part Install Card ── */}
      {selectedRule && !isSelectedInstalled && (
        <div className="absolute right-4 top-24 w-80 bg-[#0d1017]/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-4 shadow-2xl text-white z-20 animate-in fade-in slide-in-from-right-6 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
            <div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Install Component
              </div>
              <h3 className="text-sm font-bold text-white leading-tight">{selectedRule.displayName}</h3>
              <div className="text-[10px] font-mono text-gray-500">{selectedRule.meshName}</div>
            </div>
            <button onClick={() => selectPart(null)} className="p-1 rounded text-gray-400 hover:text-white">
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2 text-xs mb-3">
            {/* Tool */}
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="text-[10px] text-gray-400 font-mono mb-0.5">Required Tool</div>
              <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                <Wrench size={12} />
                <span>{selectedRule.toolRequired}</span>
              </div>
            </div>

            {/* Installation hint (only in practice/guided) */}
            {mode !== "test" && (
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-gray-400 font-mono mb-0.5">Installation Procedure</div>
                <p className="text-[11px] text-gray-300 leading-snug">{selectedRule.hint}</p>
              </div>
            )}

            {/* Status */}
            {isSelectedInstallable ? (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[11px] flex items-center gap-1.5 font-semibold">
                <Unlock size={13} />
                <span>Drag near target slot or click Install</span>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1.5">
                <Lock size={13} />
                <span>Install earlier parts first</span>
              </div>
            )}
          </div>

          {/* Install button */}
          <button
            onClick={() => attemptInstallPart(selectedRule.meshName)}
            disabled={!isSelectedInstallable}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              isSelectedInstallable
                ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-lg shadow-emerald-400/20 hover:brightness-110 active:scale-95"
                : "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
            }`}
          >
            <PackagePlus size={13} />
            <span>Install Component</span>
            {isSelectedInstallable && (
              <span className="text-[10px] opacity-70 ml-1">[Space]</span>
            )}
          </button>
        </div>
      )}

      {/* ── Wrong-Order Error Toast ── */}
      {errorNotice && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 max-w-md w-full bg-red-950/95 border border-red-500/70 rounded-2xl p-4 shadow-2xl text-white z-40 flex items-start gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <div className="text-xs font-bold text-red-200 uppercase tracking-wider mb-0.5">
              ⚠ Wrong Assembly Order
            </div>
            <div className="text-xs text-red-100/90 leading-relaxed">{errorNotice.message}</div>
            {mode !== "test" && errorNotice.expectedFirst && errorNotice.expectedFirst.length > 0 && (
              <div className="text-[10px] text-red-300/70 font-mono mt-1">
                Install first: {errorNotice.expectedFirst.map(p => dag?.rules[p]?.displayName || p).join(" → ")}
              </div>
            )}
            {mode !== "practice" && (
              <div className="text-[10px] text-red-300/70 font-mono mt-1">-25 pts penalty</div>
            )}
          </div>
          <button onClick={clearErrorNotice} className="p-1 text-red-300 hover:text-white transition-colors flex-shrink-0">
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── Next-Step Hint Banner ── */}
      {hintMessage && mode !== "test" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-lg w-full bg-emerald-950/95 border border-emerald-400/60 rounded-2xl p-3.5 shadow-2xl text-white z-30 flex items-center justify-between gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5">
            <Lightbulb size={18} className="text-emerald-400 flex-shrink-0 animate-pulse" />
            <div className="text-xs text-emerald-100 leading-snug">{hintMessage}</div>
          </div>
          <button onClick={clearHint} className="p-1 text-emerald-300 hover:text-white transition-colors flex-shrink-0">
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── Keyboard Shortcut Modal ── */}
      {showHotkeys && (
        <div className="absolute bottom-20 right-4 w-72 bg-[#0d1017]/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-4 shadow-2xl z-40 text-white animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Keyboard size={14} className="text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Hotkeys</span>
            </div>
            <button onClick={() => setShowHotkeys(false)} className="p-1 text-gray-400 hover:text-white rounded">
              <X size={13} />
            </button>
          </div>
          <div className="space-y-2 text-xs font-mono">
            {[
              ["Space", "Install selected part"],
              ["H", mode !== "test" ? "Show hint" : "Hints disabled in Test"],
              ["N", mode !== "test" ? "Auto install next" : "Auto-step disabled"],
              ["R", "Reset reassembly"],
              ["Esc", "Deselect / close"],
              ["?", "Toggle this panel"],
            ].map(([key, desc]) => (
              <div key={key} className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">{key}</span>
                <span className="text-gray-300 font-sans">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Bottom: Mode indicator bar ── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0a0c12]/80 backdrop-blur-xl border border-white/5 z-10 text-[10px] font-mono text-gray-400">
        <span className={MODE_CONFIG[mode].color}>{MODE_CONFIG[mode].icon}</span>
        <span className={`font-bold ${MODE_CONFIG[mode].color}`}>{MODE_CONFIG[mode].label} Mode</span>
        <span className="opacity-50">·</span>
        <Clock size={10} />
        <span>{formatTime(elapsed)}</span>
        <span className="opacity-50">·</span>
        <span>{trayParts.length} in tray</span>
      </div>
    </>
  );
};
