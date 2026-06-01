interface MobilePriceSummaryProps {
  label: string;
  value: string;
  visible?: boolean;
  onReveal?: () => void;
}

export function MobilePriceSummary({ label, value, visible = true, onReveal }: MobilePriceSummaryProps) {
  if (!visible && onReveal) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden border-t border-primary/30 bg-card/80 backdrop-blur-lg px-4 py-3">
        <div className="mx-auto max-w-5xl flex justify-end">
          <button onClick={onReveal} className="font-mono text-[11px] font-semibold text-primary uppercase tracking-[0.14em]">
            Investimento
          </button>
        </div>
      </div>
    );
  }
  if (!visible) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden border-t border-primary/30 bg-card/80 backdrop-blur-lg px-4 py-3">
      <div className="mx-auto max-w-5xl flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-primary">{label}</span>
        <span className="text-lg font-bold text-primary tabular-nums">{value}</span>
      </div>
    </div>
  );
}
