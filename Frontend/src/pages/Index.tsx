import { useState } from "react";
import { ShieldCheck, Zap, Lock, Sparkles } from "lucide-react";
import { PredictionForm, type PredictionInput } from "@/components/PredictionForm";
import { AnalyzingOverlay } from "@/components/AnalyzingOverlay";
import { ResultCard } from "@/components/ResultCard";
import { toast } from "sonner";

const API_URL = "https://loanapi-8vm3.onrender.com/api/predict";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<0 | 1 | null>(null);

  const handlePredict = async (data: PredictionInput) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [data] }),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const json = await res.json();
      // Try common response shapes
      const raw =
        json?.prediction ??
        json?.predictions?.[0] ??
        json?.data?.[0] ??
        json?.result ??
        json;
      const value = Array.isArray(raw) ? raw[0] : raw;
      const prediction = (Number(value) === 1 ? 1 : 0) as 0 | 1;
      setResult(prediction);
      // smooth scroll to results
      setTimeout(() => {
        document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (err) {
      console.error(err);
      toast.error("Unable to reach prediction service. Showing demo result.");
      // Demo fallback so the UI is testable without a backend
      const demo = (Math.random() > 0.5 ? 1 : 0) as 0 | 1;
      setResult(demo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[500px] gradient-hero opacity-[0.97] pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-action flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-action-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Lumen<span className="text-action-glow">.</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> SOC 2</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Encrypted</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white/90 text-xs font-medium mb-6 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5 text-action-glow" />
          AI-powered loan intelligence
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance mb-5 animate-fade-up" style={{ animationDelay: "80ms" }}>
          Loan Success
          <br />
          <span className="bg-gradient-to-r from-white via-action-glow to-white bg-clip-text text-transparent">
            Prediction Engine
          </span>
        </h1>
        <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed animate-fade-up text-balance" style={{ animationDelay: "160ms" }}>
          Enter customer and market signals to instantly forecast loan outcomes
          with institutional-grade accuracy.
        </p>
      </section>

      {/* Form Card */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="glass rounded-3xl shadow-elevated p-6 sm:p-10 lg:p-12 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <PredictionForm onSubmit={handlePredict} loading={loading} />
        </div>

        {result !== null && (
          <div id="result" className="mt-8">
            <ResultCard prediction={result} onReset={() => setResult(null)} />
          </div>
        )}

        {/* Trust bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          {[
            { icon: Zap, title: "Real-time", desc: "Sub-second predictions" },
            { icon: ShieldCheck, title: "Trusted", desc: "Bank-grade security" },
            { icon: Lock, title: "Private", desc: "Your data stays yours" },
          ].map((item) => (
            <div key={item.title} className="glass rounded-2xl p-5 flex items-start gap-3 hover:shadow-card transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-action/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-action" />
              </div>
              <div>
                <div className="font-semibold text-navy text-sm">{item.title}</div>
                <div className="text-xs text-slate mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-border/60 py-8 text-center text-xs text-slate">
        © {new Date().getFullYear()} Lumen Prediction Engine · For demonstration purposes
      </footer>

      {loading && <AnalyzingOverlay />}
    </div>
  );
};

export default Index;
