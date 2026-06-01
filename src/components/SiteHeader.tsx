import { Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border backdrop-blur-xl" style={{ background: "color-mix(in srgb, var(--color-background) 90%, transparent)" }}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-12">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo-o2-white.png" alt="O2 Inc" className="h-8" />
          <span className="hidden sm:block w-px h-5 bg-muted-foreground/30" />
          <span className="hidden sm:block font-mono text-[11px] tracking-[0.1em] uppercase text-muted-foreground">Diagnóstico</span>
        </Link>
      </div>
    </header>
  );
}

export function ScrollToTop() {
  const loc = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [loc.pathname]);
  return null;
}