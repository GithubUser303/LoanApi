import { CheckCircle2, AlertCircle, RotateCcw, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  prediction: 0 | 1;
  onReset: () => void;
}

export const ResultCard = ({ prediction, onReset }: Props) => {
  const success = prediction === 1;

  return (
    <div className="animate-scale-in">
      <div
        className={`relative overflow-hidden rounded-3xl shadow-elevated border ${
          success
            ? "bg-gradient-to-br from-success-soft via-card to-card border-success/20"
            : "bg-gradient-to-br from-decline-soft via-card to-card border-decline/20"
        }`}
      >
        {/* Decorative orb */}
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 ${
            success ? "bg-success" : "bg-decline"
          }`}
        />

        <div className="relative p-8 sm:p-12">
          <div className="flex items-start justify-between mb-8">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                success
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-decline/10 text-decline border border-decline/20"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${success ? "bg-success" : "bg-decline"} animate-pulse`} />
              Prediction Complete
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-slate hover:text-navy hover:bg-secondary"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              New
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
            <div
              className={`relative w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                success ? "gradient-success" : "bg-gradient-to-br from-decline to-decline/70"
              } shadow-elevated`}
            >
              {success ? (
                <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.2} />
              ) : (
                <AlertCircle className="w-10 h-10 text-white" strokeWidth={2.2} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-1.5 text-balance">
                {success ? "High Probability of Approval" : "Review Required"}
              </h2>
              <p className="text-sm text-slate leading-relaxed">
                {success
                  ? "The model indicates strong signals favoring a successful loan outcome based on the provided inputs."
                  : "The model suggests this profile requires additional manual review before a final decision."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border/60">
            <div className="rounded-2xl bg-secondary/40 p-4">
              <div className="flex items-center gap-2 text-xs text-slate mb-1">
                {success ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                Outcome
              </div>
              <div className={`text-lg font-bold ${success ? "text-success" : "text-decline"}`}>
                {success ? "Approve" : "Manual Review"}
              </div>
            </div>
            <div className="rounded-2xl bg-secondary/40 p-4">
              <div className="text-xs text-slate mb-1">Model Output</div>
              <div className="text-lg font-bold text-navy font-mono">
                {prediction}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
