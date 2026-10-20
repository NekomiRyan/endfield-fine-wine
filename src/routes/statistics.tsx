import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type StatisticsSummary = {
  generatedAt?: string;
  totals?: Record<string, number>;
  versions?: Array<{ version: string; launches: number; patches: number }>;
};

export const Route = createFileRoute("/statistics")({ component: StatisticsPage });

function StatisticsPage() {
  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    fetch("/api/statistics/summary", { headers: { accept: "application/json" } })
      .then((response) =>
        response.ok ? response.json() : Promise.reject(new Error("Statistics are not published.")),
      )
      .then((data: StatisticsSummary) => {
        setSummary(data);
        setState("ready");
      })
      .catch(() => setState("unavailable"));
  }, []);

  const totals = summary?.totals ?? {};
  const cards = [
    ["Installations", totals.installations ?? 0],
    ["App launches", totals.launches ?? 0],
    ["Patches started", totals.patches_started ?? 0],
    ["Patches completed", totals.patches_succeeded ?? 0],
    ["Patches failed", totals.patches_failed ?? 0],
    ["Mod-chain actions", totals.mod_chain_actions ?? 0],
  ];

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          FineWine / internal
        </p>
        <h1 className="mt-4 font-display text-5xl font-extrabold uppercase">Statistics</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Anonymous usage totals reported by the FineWine Patcher. No paths, account data, or
          personal identifiers are included.
        </p>

        {state === "loading" && <p className="mt-12 text-muted-foreground">Loading statistics…</p>}
        {state === "unavailable" && (
          <div className="mt-12 border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold uppercase">
              Statistics are not published
            </h2>
            <p className="mt-2 text-muted-foreground">
              The dashboard is installed but its data source is disabled until it is needed.
            </p>
          </div>
        )}
        {state === "ready" && (
          <>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map(([label, value]) => (
                <div key={label} className="border border-border bg-card p-6">
                  <div className="font-display text-4xl font-extrabold">{value}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
            {summary?.versions && summary.versions.length > 0 && (
              <div className="mt-10 border border-border bg-card p-6">
                <h2 className="font-display text-xl font-bold uppercase">By patcher version</h2>
                <div className="mt-4 divide-y divide-border">
                  {summary.versions.map((version) => (
                    <div key={version.version} className="flex justify-between gap-4 py-3 text-sm">
                      <span>{version.version}</span>
                      <span className="text-muted-foreground">
                        {version.launches} launches · {version.patches} patches
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {summary?.generatedAt && (
              <p className="mt-6 text-xs text-muted-foreground">Updated {summary.generatedAt}</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
