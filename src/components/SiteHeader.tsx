import { Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm">O2</span>
          <span className="hidden sm:inline">O2 Inc</span>
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