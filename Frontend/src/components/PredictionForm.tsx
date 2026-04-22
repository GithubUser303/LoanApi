import { useState } from "react";
import { Loader2, Sparkles, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type PredictionInput = {
  age: number;
  campaign: number;
  pdays: number;
  previous: number;
  emp_var_rate: number;
  cons_price_idx: number;
  cons_conf_idx: number;
  euribor3m: number;
  nr_employed: number;
};

const FIELDS: {
  key: keyof PredictionInput;
  label: string;
  helper?: string;
  placeholder: string;
  step?: string;
  min?: string;
  group: "Customer" | "Campaign" | "Macroeconomic";
}[] = [
  { key: "age", label: "Customer Age", placeholder: "e.g. 41", min: "18", group: "Customer" },
  { key: "campaign", label: "Contact Frequency", helper: "Number of contacts during this campaign", placeholder: "e.g. 2", min: "0", group: "Campaign" },
  { key: "pdays", label: "Days Since Last Contact", helper: "Enter 999 if never contacted before", placeholder: "e.g. 999", min: "0", group: "Campaign" },
  { key: "previous", label: "Previous Campaign History", helper: "Prior contacts before this campaign", placeholder: "e.g. 0", min: "0", group: "Campaign" },
  { key: "emp_var_rate", label: "Employment Variation Rate", helper: "Quarterly indicator", placeholder: "e.g. 1.1", step: "0.01", group: "Macroeconomic" },
  { key: "cons_price_idx", label: "Consumer Price Index", helper: "Monthly indicator", placeholder: "e.g. 93.994", step: "0.001", group: "Macroeconomic" },
  { key: "cons_conf_idx", label: "Consumer Confidence Index", helper: "Monthly indicator", placeholder: "e.g. -36.4", step: "0.1", group: "Macroeconomic" },
  { key: "euribor3m", label: "3-Month Interest Rate", helper: "Euribor 3-month rate", placeholder: "e.g. 4.857", step: "0.001", group: "Macroeconomic" },
  { key: "nr_employed", label: "Regional Employment Figure", helper: "Number of employees (thousands)", placeholder: "e.g. 5191", step: "0.1", group: "Macroeconomic" },
];

const GROUPS: PredictionInput["age"] extends never ? never : ("Customer" | "Campaign" | "Macroeconomic")[] = [
  "Customer",
  "Campaign",
  "Macroeconomic",
];

interface Props {
  onSubmit: (data: PredictionInput) => void;
  loading: boolean;
}

export const PredictionForm = ({ onSubmit, loading }: Props) => {
  const [values, setValues] = useState<Record<keyof PredictionInput, string>>({
    age: "",
    campaign: "",
    pdays: "",
    previous: "",
    emp_var_rate: "",
    cons_price_idx: "",
    cons_conf_idx: "",
    euribor3m: "",
    nr_employed: "",
  });

  const handleChange = (key: keyof PredictionInput, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, parseFloat(v) || 0])
    ) as unknown as PredictionInput;
    onSubmit(parsed);
  };

  const fillSample = () => {
    setValues({
      age: "41",
      campaign: "2",
      pdays: "999",
      previous: "0",
      emp_var_rate: "1.1",
      cons_price_idx: "93.994",
      cons_conf_idx: "-36.4",
      euribor3m: "4.857",
      nr_employed: "5191",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {GROUPS.map((group, gi) => (
        <section key={group} className="animate-fade-up" style={{ animationDelay: `${gi * 80}ms` }}>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-action">
              0{gi + 1}
            </span>
            <h3 className="text-sm font-semibold text-navy">{group} Signals</h3>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FIELDS.filter((f) => f.group === group).map((field) => (
              <div key={field.key} className="group">
                <div className="flex items-center gap-1.5 mb-2">
                  <Label
                    htmlFor={field.key}
                    className="text-xs font-medium text-slate"
                  >
                    {field.label}
                  </Label>
                  {field.helper && (
                    <Tooltip>
                      <TooltipTrigger type="button" className="text-muted-foreground hover:text-action transition-colors">
                        <Info className="w-3.5 h-3.5" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        {field.helper}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <Input
                  id={field.key}
                  type="number"
                  step={field.step ?? "1"}
                  min={field.min}
                  required
                  placeholder={field.placeholder}
                  value={values[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="h-11 bg-secondary/50 border-border/60 focus-visible:ring-action focus-visible:ring-2 focus-visible:border-action transition-all rounded-xl text-navy placeholder:text-muted-foreground/60"
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border/60">
        <Button
          type="button"
          variant="ghost"
          onClick={fillSample}
          disabled={loading}
          className="text-slate hover:text-action hover:bg-action/5"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Use sample data
        </Button>
        <div className="flex-1" />
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="gradient-action text-action-foreground hover:opacity-95 hover:shadow-glow transition-all duration-300 rounded-xl h-12 px-8 font-semibold shadow-card group disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              Predict Outcome
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
