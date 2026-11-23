import React from "react";
import { useDisassemblyStore } from "../../stores/useDisassemblyStore";
import { MachineMetadata } from "../../data/machinesData";
import {
  MACHINE_DAGS,
  checkDisassemblyRule,
  getRemovableParts,
} from "../../data/dependencyGraph";
import {
  Undo2,
  Redo2,
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
} from "lucide-react";

interface Props {
  metadata: MachineMetadata;
}

export const DisassemblyWorkbench: React.FC<Props> = ({ metadata }) => {
  const {
    currentMachineId,
    disassembledParts,
    undoStack,
    redoStack,
    selectedPartMesh,
    hintMessage,
    errorNotice,
    score,
    errorCount,
    isComplete,
    attemptDisassemblePart,
    animateNextStep,
    undo,
    redo,
    showNextStepHint,
    clearHint,
    clearErrorNotice,
    resetDisassembly,
    selectPart,
  } = useDisassemblyStore();

  const dag = MACHINE_DAGS[currentMachineId];
  const totalParts = Object.keys(dag?.rules || {}).length;
  const progressPercent = Math.round((disassembledParts.length / (totalParts || 1)) * 100);

  const selectedRule = selectedPartMesh ? dag?.rules[selectedPartMesh] : null;
  const selectedStatus = selectedPartMesh
    ? checkDisassemblyRule(currentMachineId, selectedPartMesh, disassembledParts)
    : null;

  return (
    <>
      {/* Top Floating Control Bar */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2.5 rounded-2xl bg-[#0d1017]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-20 text-white select-none">
        {/* Progress Pill */}
        <div className="flex items-center gap-3 px-3 py-1 bg-[#141824] rounded-xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-mono">Disassembly</span>
            <span className="text-xs font-bold text-cyan-300 font-mono">
              {disassembledParts.length} / {totalParts} ({progressPercent}%)
            </span>
          </div>
          <div className="w-20 bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Score & Accuracy */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#141824] rounded-xl border border-white/5">
          <Trophy size={14} className="text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-mono">Score</span>
            <span className="text-xs font-bold text-amber-300 font-mono">
              {score} pts
            </span>
          </div>
          {errorCount > 0 && (
            <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
              {errorCount} err
            </span>
          )}
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Undo */}
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-all"
            title="Undo Last Disassembly Step"
          >
            <Undo2 size={16} />
          </button>

          {/* Redo */}
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-all"
            title="Redo Step"
          >
            <Redo2 size={16} />
          </button>

          {/* Hint */}
          <button
            onClick={showNextStepHint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30 transition-all shadow-sm"
            title="Highlight Next Unblocked Part"
          >
            <Lightbulb size={14} />
            <span className="hidden sm:inline">Hint</span>
          </button>

          {/* Auto Next Step */}
          <button
            onClick={animateNextStep}
            disabled={isComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30 disabled:opacity-40 transition-all shadow-sm"
            title="Automatically Disassemble Next Step"
          >
            <Play size={14} />
            <span className="hidden sm:inline">Animate Step</span>
          </button>

          {/* Reset */}
          <button
            onClick={resetDisassembly}
            className="p-2 rounded-xl text-gray-400 hover:text-cyan-300 bg-white/5 hover:bg-white/10 transition-colors"
            title="Reassemble Machine"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* DAG Dependency Status Sidebar (Left) */}
      <div className="absolute left-6 top-24 bottom-6 w-76 max-w-xs bg-[#0d1017]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col z-20 text-white select-none">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-cyan-400" />
            <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
              DAG Dependency Rules
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-400">
            {disassembledParts.length}/{totalParts} Done
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          {dag?.optimalSequence.map((meshName) => {
            const rule = dag.rules[meshName];
            const isDisassembled = disassembledParts.includes(meshName);
            const { allowed, unresolvedBlockers } = checkDisassemblyRule(
              currentMachineId,
              meshName,
              disassembledParts
            );
            const isSelected = selectedPartMesh === meshName;

            return (
              <div
                key={meshName}
                onClick={() => selectPart(isSelected ? null : meshName)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isDisassembled
                    ? "bg-white/[0.02] border-white/5 text-gray-500"
                    : isSelected
                    ? "bg-amber-500/15 border-amber-400/60 text-amber-200 shadow-md shadow-amber-500/10"
                    : allowed
                    ? "bg-emerald-500/10 border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/20"
                    : "bg-white/[0.03] border-white/5 text-gray-400 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-semibold truncate flex-1 mr-2">
                    {isDisassembled ? (
                      <CheckCircle2 size={13} className="text-gray-500 flex-shrink-0" />
                    ) : allowed ? (
                      <Unlock size={13} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Lock size={13} className="text-amber-500 flex-shrink-0" />
                    )}
                    <span className="truncate">{rule?.displayName || meshName}</span>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isDisassembled
                        ? "bg-gray-800 text-gray-500"
                        : allowed
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {isDisassembled ? "REMOVED" : allowed ? "READY" : "LOCKED"}
                  </span>
                </div>

                {!isDisassembled && !allowed && unresolvedBlockers.length > 0 && (
                  <div className="text-[10px] font-mono text-amber-400/90 bg-amber-950/40 px-2 py-1 rounded border border-amber-500/20 mt-1.5">
                    Blocked by: {unresolvedBlockers.map((b) => dag.rules[b]?.displayName || b).join(", ")}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Complete Banner */}
        {isComplete && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 text-center space-y-1">
            <div className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
              <Sparkles size={14} />
              <span>Full Disassembly Complete!</span>
            </div>
            <div className="text-[10px] text-gray-300 font-mono">
              Final Score: {score} pts • Errors: {errorCount}
            </div>
          </div>
        )}
      </div>

      {/* Selected Part Extraction Card (Right) */}
      {selectedRule && !disassembledParts.includes(selectedRule.meshName) && (
        <div className="absolute right-6 top-24 w-84 max-w-sm bg-[#0d1017]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-4 shadow-2xl text-white z-20 animate-in fade-in slide-in-from-right-6 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                Target Component
              </div>
              <h3 className="text-sm font-bold text-white">{selectedRule.displayName}</h3>
            </div>
            <button
              onClick={() => selectPart(null)}
              className="p-1 rounded text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2 text-xs my-3">
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 space-y-0.5">
              <span className="text-[10px] text-gray-400 font-mono">Required Tool</span>
              <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <Wrench size={13} />
                <span>{selectedRule.toolRequired}</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 space-y-0.5">
              <span className="text-[10px] text-gray-400 font-mono">Extraction Procedure</span>
              <p className="text-[11px] text-gray-300 leading-snug">{selectedRule.hint}</p>
            </div>

            {selectedStatus?.allowed ? (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[11px] flex items-center gap-1.5 font-semibold">
                <Unlock size={14} />
                <span>All blockers cleared. Ready for extraction!</span>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Lock size={14} />
                  <span>Cannot extract component yet!</span>
                </div>
                <div className="text-[10px] text-amber-200/80 font-mono">
                  Must first remove: {selectedStatus?.unresolvedBlockers.map((b) => dag?.rules[b]?.displayName || b).join(", ")}
                </div>
              </div>
            )}
          </div>

          {/* Action button */}
          <button
            onClick={() => attemptDisassemblePart(selectedRule.meshName)}
            disabled={!selectedStatus?.allowed}
            className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedStatus?.allowed
                ? "bg-gradient-to-r from-cyan-400 to-teal-400 text-black shadow-lg shadow-cyan-400/20 hover:brightness-110 active:scale-95"
                : "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
            }`}
          >
            <Play size={14} fill={selectedStatus?.allowed ? "currentColor" : "none"} />
            <span>Disassemble & Move to Tray</span>
          </button>
        </div>
      )}

      {/* DAG Violation Toast */}
      {errorNotice && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 max-w-md bg-red-950/90 border border-red-500/70 rounded-2xl p-4 shadow-2xl text-white z-30 flex items-start gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-bold text-red-200 uppercase tracking-wider mb-0.5">
              Mechanical Constraint Violation
            </div>
            <div className="text-xs text-red-100/90 leading-relaxed font-sans">
              {errorNotice.message}
            </div>
          </div>
          <button
            onClick={clearErrorNotice}
            className="p-1 text-red-300 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Next Step Hint Banner */}
      {hintMessage && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-lg bg-emerald-950/90 border border-emerald-400/60 rounded-2xl p-3.5 shadow-2xl text-white z-30 flex items-center justify-between gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5">
            <Lightbulb size={18} className="text-emerald-400 flex-shrink-0" />
            <div className="text-xs text-emerald-100 font-sans leading-snug">
              {hintMessage}
            </div>
          </div>
          <button
            onClick={clearHint}
            className="p-1 text-emerald-300 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
};
