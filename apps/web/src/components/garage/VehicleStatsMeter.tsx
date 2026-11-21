import React from "react";
import { useVehicleStore } from "../../stores/useVehicleStore";
import { Gauge } from "lucide-react";

export const VehicleStatsMeter: React.FC = () => {
  const { currentVehicle, morphSettings, activeMode } = useVehicleStore();

  // Dynamic stat derivation based on active morph weights
  const speedBonus = morphSettings.aerodynamicWings * 20 - morphSettings.suspensionHeight * 30;
  const computedTopSpeed = Math.round(currentVehicle.baseTuning.topSpeedKmh + speedBonus);

  const handlingScore = Math.min(
    10,
    Math.max(
      2,
      currentVehicle.baseTuning.handling + (activeMode === "STREET" ? 1.5 : -1.0)
    )
  );

  const offroadScore = Math.min(
    10,
    Math.max(
      1,
      currentVehicle.baseTuning.offroadTraction + morphSettings.suspensionHeight * 5.0
    )
  );

  const aeroScore = Math.min(
    10,
    Math.max(
      1,
      currentVehicle.baseTuning.downforce + morphSettings.aerodynamicWings * 4.0
    )
  );

  const stats = [
    { label: "Top Velocity", val: `${computedTopSpeed} km/h`, percent: (computedTopSpeed / 400) * 100 },
    { label: "Handling Agility", val: `${handlingScore.toFixed(1)} / 10`, percent: handlingScore * 10 },
    { label: "Off-Road Traction", val: `${offroadScore.toFixed(1)} / 10`, percent: offroadScore * 10 },
    { label: "Aerodynamic Glide", val: `${aeroScore.toFixed(1)} / 10`, percent: aeroScore * 10 },
  ];

  return (
    <div className="bg-[#12141a]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-3 text-cyan-400 font-semibold text-sm tracking-wider uppercase">
        <Gauge size={16} />
        <span>Telemetry Tuning Specs</span>
      </div>

      <div className="space-y-2.5">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">{s.label}</span>
              <span className="text-white font-mono font-medium">{s.val}</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${s.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
