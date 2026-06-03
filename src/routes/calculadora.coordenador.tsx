import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Download } from "lucide-react";
import { useDiagnostic } from "@/context/DiagnosticContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { calcCoordenadorPrice, perfilFromInputs, formatBRL, type CoordPerfil, type CoordNivel } from "@/lib/pricing-shared";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Row } from "@/components/calc-row";
import { InfoTooltip } from "@/components/InfoTooltip";
import { MobilePriceSummary } from "@/components/MobilePriceSummary";
import { ProductPresentation } from "@/components/ProductPresentation";
import { exportCalculatorPDF } from "@/lib/pdf-export";

export const Route = createFileRoute("/calculadora/coordenador")({
  component: CoordenadorPage,
});

const PERFIS: { id: CoordPerfil; label: string; desc: string }[] = [
  { id: "essencial", label: "Essencial", desc: "Até 3 colab. · 1 CNPJ · só Financeiro" },
  { id: "estruturado", label: "Estruturado", desc: "4–8 colab. · 1–2 CNPJs · Financeiro + 1 departamento" },
  { id: "integrado", label: "Integrado", desc: "9+ colab. · Multi-CNPJ · Financeiro + Compras + Faturamento" },
];

const NIVEL_LABEL: Record<CoordNivel, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const INCLUDES = [
  "Coordenador financeiro dedicado",
  "Gestão de equipe financeira",
  "Processos e controles",
  "Reporte executivo",
];

const FUNC_TOOLTIP =
  "Colaboradores envolvidos na operação financeira. Junto com os CNPJs, define o perfil de valor.";
const CNPJ_TOOLTIP =
  "Quantidade de CNPJs/empresas atendidas. Junto com o nº de funcionários, define o perfil de valor.";
const NIVEL_TOOLTIP =
  "Ajuste por volume de lançamentos e nº de sistemas. Baixa é o padrão; Média soma +20% e Alta +40%.";

function CoordenadorPage() {
  const { state } = useDiagnostic();
  const [employees, setEmployees] = useState(1);
  const [cnpjCount, setCnpjCount] = useState(1);
  const [nivel, setNivel] = useState<CoordNivel>("baixa");
  const [showPrices, setShowPrices] = useState(false);

  const perfil = perfilFromInputs(employees, cnpjCount);
  const result = calcCoordenadorPrice(perfil, nivel);
  const parcela12x = result.setup / 12;
  const perfilInfo = PERFIS.find((p) => p.id === perfil)!;

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 pb-20 lg:pb-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/servicos" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar aos Serviços
        </Link>
        <Breadcrumbs items={[{ label: "Serviços", to: "/servicos" }, { label: "Coordenador as a Service" }]} />
        <div className="mb-8">
          <h1 className="font-bold tracking-[0.005em]" style={{ fontSize: "clamp(28px, 4vw, 48px)" }}>Coordenador as a Service</h1>
        </div>

        <ProductPresentation serviceKey="coordenador" title="Coordenador as a Service" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-border bg-card p-7 space-y-4">
            <h2 className="text-lg font-semibold">Parâmetros</h2>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Número de funcionários <InfoTooltip text={FUNC_TOOLTIP} />
              </Label>
              <Input
                type="number"
                min={1}
                value={employees}
                onChange={(e) => setEmployees(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Quantidade de CNPJs <InfoTooltip text={CNPJ_TOOLTIP} />
              </Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={cnpjCount}
                onChange={(e) => setCnpjCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
              />
            </div>
            <div className="rounded-xl bg-primary/10 border border-primary/40 p-3">
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-primary">Perfil de valor</p>
              <p className="text-base font-semibold mt-0.5">{perfilInfo.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{perfilInfo.desc}</p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Nível de complexidade <InfoTooltip text={NIVEL_TOOLTIP} />
              </Label>
              <Select value={nivel} onValueChange={(v) => setNivel(v as CoordNivel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa (padrão)</SelectItem>
                  <SelectItem value="media">Média (+20%)</SelectItem>
                  <SelectItem value="alta">Alta (+40%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <aside className="rounded-2xl border-2 border-primary bg-card p-7"
                 style={{ backgroundColor: "color-mix(in oklab, var(--color-primary) 6%, var(--card))" }}>
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-primary">Investimento</p>
            {showPrices ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Row label="Perfil" value={perfilInfo.label} />
                <Row label="Complexidade" value={NIVEL_LABEL[result.nivel]} />
                <Row label="Setup (valor único)" value={formatBRL(result.setup)} bold />

                <div className="mt-5 rounded-xl bg-primary/15 border border-primary p-5">
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-primary">Setup · 12x no cartão</p>
                  <p className="text-3xl md:text-4xl font-bold text-primary mt-1 tabular-nums">
                    {formatBRL(parcela12x)}<span className="text-sm font-normal text-primary/70">/mês</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valor total: {formatBRL(result.setup)}
                  </p>
                </div>

                <div className="mt-3 rounded-xl bg-card border border-border p-5">
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">Mensalidade · recorrência</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1 tabular-nums">
                    {formatBRL(result.mensal)}<span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </p>
                </div>

                <div className="mt-5">
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-2">Inclui</p>
                  <ul className="space-y-1.5">
                    {INCLUDES.map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() =>
                    exportCalculatorPDF({
                      service: "Coordenador as a Service",
                      clientName: state.companyName,
                      rows: [
                        ["Perfil", perfilInfo.label],
                        ["Funcionários", String(employees)],
                        ["CNPJs", String(cnpjCount)],
                        ["Complexidade", NIVEL_LABEL[result.nivel]],
                        ["Setup (valor único)", formatBRL(result.setup)],
                        ["Setup (12x)", formatBRL(parcela12x)],
                        ["Mensalidade", formatBRL(result.mensal)],
                      ],
                      finalLabel: "Mensalidade",
                      finalValue: formatBRL(result.mensal),
                    })
                  }
                  className="w-full mt-5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="mr-2 h-4 w-4" /> Exportar PDF
                </Button>
              </div>
            ) : (
              <div className="mt-4">
                <Row label="Perfil" value={perfilInfo.label} />
                <div className="mt-5">
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-2">Inclui</p>
                  <ul className="space-y-1.5">
                    {INCLUDES.map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => setShowPrices(true)}
                  className="w-full mt-5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Investimento
                </Button>
              </div>
            )}
          </aside>
        </div>
      </div>

      <MobilePriceSummary label="Mensalidade" value={formatBRL(result.mensal)} visible={showPrices} onReveal={() => setShowPrices(true)} />
    </div>
  );
}
