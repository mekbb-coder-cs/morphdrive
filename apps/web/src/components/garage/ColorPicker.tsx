import React from "react";
import { useVehicleStore } from "../../stores/useVehicleStore";
import { Palette } from "lucide-react";

const PRESET_COLORS = [
  "#00f0ff", // Cyber Cyan
  "#ff007f", // Neon Magenta
  "#ff5500", // Apex Blaze
  "#ffd700", // Gold Alloy
  "#00ff66", // Toxic Green
  "#9900ff", // Royal Violet
  "#ffffff", // Hyper White
  "#141419", // Stealth Black
];

export const ColorPicker: React.FC = () => {
  const { materialColors, updateColor } = useVehicleStore();

  return (
    <div className="bg-[#12141a]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-3 text-cyan-400 font-semibold text-sm tracking-wider uppercase">
        <Palette size={16} />
        <span>Custom Finish & Paint</span>
      </div>

      <div className="space-y-3">
        {/* Primary Paint */}
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Primary Body Color</label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => updateColor("primaryPaint", c)}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  materialColors.primaryPaint.toLowerCase() === c.toLowerCase()
                    ? "border-white scale-110 shadow-lg shadow-cyan-500/30"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Secondary Accents */}
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Secondary Accents & Wings</label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => updateColor("secondaryPaint", c)}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  materialColors.secondaryPaint.toLowerCase() === c.toLowerCase()
                    ? "border-white scale-110 shadow-lg shadow-purple-500/30"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Neon Underglow */}
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Neon Underglow & Thruster</label>
          <div className="flex items-center gap-2 flex-wrap">
            {["#00f0ff", "#ff007f", "#00ff66", "#f5a623", "#9900ff"].map((c) => (
              <button
                key={c}
                onClick={() => updateColor("neonGlow", c)}
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  materialColors.neonGlow.toLowerCase() === c.toLowerCase()
                    ? "border-white scale-110 shadow-lg shadow-green-500/30"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
