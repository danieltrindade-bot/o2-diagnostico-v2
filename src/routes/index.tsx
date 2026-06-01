import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <section className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 animate-[kenburns_20s_ease-in-out_infinite_alternate]"
          style={{
            backgroundImage: "url(/o2-office.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 pointer-events-none opacity-40"
             style={{ background: "radial-gradient(600px circle at 50% 30%, var(--accent-soft), transparent 60%)" }} />
        <div className="relative max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-sm px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-muted-foreground mb-8 animate-[fadeSlideUp_0.8s_ease-out_0.2s_both]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            A maior assessoria de CFO as a Service do Brasil
          </div>
          <h1 className="font-display font-bold uppercase leading-[0.96] tracking-[0.005em] animate-[fadeSlideUp_0.8s_ease-out_0.4s_both]" style={{ fontSize: "clamp(44px, 9vw, 132px)" }}>
            Inteligência financeira que transforma{" "}
            <span className="text-primary">gestão em resultado</span>
          </h1>
          <p className="mt-7 text-muted-foreground max-w-2xl mx-auto animate-[fadeSlideUp_0.8s_ease-out_0.6s_both]" style={{ fontSize: "clamp(16px, 2.1vw, 18px)", lineHeight: 1.5 }}>
            Há 9 anos ajudando empresários a tomarem decisões mais técnicas, unindo especialistas financeiros, metodologia proprietária e plataforma de inteligência.
          </p>
          <div className="mt-10 flex items-center justify-center animate-[fadeSlideUp_0.8s_ease-out_0.8s_both]">
            <Link to="/diagnostico">
              <Button size="lg" className="text-base px-8 h-12">
                Fazer Diagnóstico <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
