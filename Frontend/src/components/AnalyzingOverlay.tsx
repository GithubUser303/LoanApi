import { useEffect, useState } from "react";
import { Activity, BarChart3, Cpu, ShieldCheck } from "lucide-react";

const STAGES = [
  { icon: Activity, label: "Scanning customer signals" },
  { icon: BarChart3, label: "Analyzing market indicators" },
  { icon: Cpu, label: "Running prediction model" },
  { icon: ShieldCheck, label: "Validating outcome" },
];

export const AnalyzingOverlay = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/70 backdrop-blur-md animate-scale-in">
      <div className="glass rounded-3xl shadow-elevated p-10 max-w-md w-[90%] mx-auto text-center relative overflow-hidden">
        {/* Scanning beam */}
        <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-action/40 to-transparent animate-scan" />
        </div>

        <div className="relative">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full bg-action/30 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full bg-action/20 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
            <div className="relative w-20 h-20 rounded-full gradient-action flex items-center justify-center shadow-glow">
              <Cpu className="w-9 h-9 text-action-foreground" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-navy mb-1">Analyzing Markets</h3>
          <p className="text-sm text-slate mb-8">
            Our model is processing your data in real time
          </p>

          <ul className="space-y-3 text-left">
            {STAGES.map((s, i) => {
              const Icon = s.icon;
              const active = i === stage;
              const done = i < stage;
              return (
                <li
                  key={s.label}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    active
                      ? "bg-action/10 border border-action/20"
                      : done
                      ? "opacity-50"
                      : "opacity-40"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      active ? "text-action" : "text-slate"
                    }`}
                  />
                  <span className={`text-sm font-medium ${active ? "text-navy" : "text-slate"}`}>
                    {s.label}
                  </span>
                  {active && (
                    <span className="ml-auto flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-action animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1 h-1 rounded-full bg-action animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1 h-1 rounded-full bg-action animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
