import { createFileRoute } from "@tanstack/react-router";
import { Download, Github, Cpu, Shield, Gauge, ChevronRight, Terminal, Globe2 } from "lucide-react";
import { useWebMCP } from "use-webmcp-tool";
import hero from "@/assets/hero.jpg";
import { REPO, stats, steps, features as baseFeatures } from "@/lib/project-info";
import { runWebMCPTool } from "@/lib/webmcp-telemetry";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Endfield FineWine — Arknights: Endfield on Apple Silicon" },
      { name: "description", content: "Patched CrossOver Wine that runs Arknights: Endfield on Apple Silicon Macs at up to 120 FPS." },
      { property: "og:title", content: "Endfield FineWine — Endfield on Apple Silicon" },
      { property: "og:description", content: "Patches, scripts and docs to run Arknights: Endfield on M-series Macs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const icons = [Shield, Cpu, Gauge];
const features = baseFeatures.map((f, i) => ({ ...f, icon: icons[i] ?? Shield }));

const sections = { features: "features", install: "install", specs: "specs" } as const;

function Index() {
  useWebMCP({
    name: "get_page_info",
    description: "Read the project summary, features, performance stats and install steps shown on this page.",
    annotations: { readOnlyHint: true },
    execute: () =>
      runWebMCPTool("get_page_info", () =>
        [
          "Endfield FineWine — Arknights: Endfield on Apple Silicon.",
          ...stats.map((s) => `Stat: ${s.k}${s.u ? " " + s.u : ""} — ${s.l}`),
          ...baseFeatures.map((f) => `Feature: ${f.t} — ${f.d}`),
          ...steps.map(([c, l], i) => `Step ${i + 1}: ./${c} — ${l}`),
          `Repository: ${REPO}`,
        ].join("\n"),
      ),
  });

  useWebMCP({
    name: "scroll_to_section",
    description: "Scroll the page to a section: features, install, or specs.",
    inputSchema: {
      type: "object",
      properties: {
        section: { type: "string", enum: ["features", "install", "specs"], description: "Section to show." },
      },
      required: ["section"],
    },
    execute: ({ section }: { section: keyof typeof sections }) =>
      runWebMCPTool("scroll_to_section", () => {
        if (typeof section !== "string" || !(section in sections)) throw new Error("Unknown section.");
        const el = document.getElementById(sections[section]);
        if (!el) throw new Error("Section not found.");
        el.scrollIntoView({ behavior: "smooth" });
        return `Scrolled to ${section}.`;
      }),
  });

  return (
    <div className="page-enter min-h-screen bg-background font-sans text-foreground">
      <header className="page-header-enter fixed inset-x-0 top-0 z-20 border-b border-border bg-white shadow-sm transition-shadow duration-300">
        <div className="mx-auto flex h-[66px] max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="font-sans text-base font-bold tracking-tight text-foreground">FineWine</span>
            <span className="hidden font-symbol text-sm text-muted-foreground sm:inline">Endfield tools</span>
          </div>
          <nav className="hidden h-full items-center gap-8 font-sans text-sm text-muted-foreground md:flex">
            <a href="#features" className="nav-link flex h-full items-center hover:text-foreground">Features</a>
            <a href="#install" className="nav-link flex h-full items-center hover:text-foreground">Install</a>
            <a href="#specs" className="nav-link flex h-full items-center hover:text-foreground">Specs</a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground sm:flex">
              <Globe2 className="h-4 w-4" /> English
            </div>
            <a href={REPO} className="flex items-center gap-2 rounded-full border-2 border-foreground bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[2px_2px_0_var(--ink)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--ink)] active:translate-y-0 active:shadow-[1px_1px_0_var(--ink)]">
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-screen items-center overflow-hidden bg-ink text-ink-foreground">
        <img src={hero} alt="Angled silver tower with crossed blades over a cyan glow" width={1376} height={768} className="hero-image-enter absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 hero-fade" />
        <div className="hero-content-enter relative mx-auto w-full max-w-7xl px-6 pt-24">
          <div className="tag-bar mb-8 inline-flex items-center gap-3 bg-black/80 py-1 pl-3 pr-8 font-display text-sm font-bold uppercase text-primary">
            Arknights: Endfield <span>//</span>
          </div>
          <h1 className="font-sans text-5xl font-bold uppercase leading-[0.95] md:text-7xl">
            Endfield on<br /><span className="text-primary">Apple Silicon</span>
          </h1>
          <div className="mt-4 font-symbol text-2xl tracking-wider opacity-60">apple silicon</div>
          <div className="mt-5 flex items-center gap-2 font-mono text-xs opacity-70">
            //▲ <span className="flex gap-1">{Array.from({ length: 6 }).map((_, i) => <span key={i} className="h-3 w-3 rounded-full border border-current" />)}</span>
          </div>
          <div className="mt-3 h-1 w-28 tri-stripe" />
          <p className="mt-6 max-w-xl text-lg font-light opacity-80">
            A custom-patched CrossOver Wine, scripts and documentation that bring Arknights: Endfield to a near-native macOS experience — the first known working setup.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={`${REPO}/releases`} className="group flex w-60 items-center justify-between rounded-[4px] bg-primary px-5 py-4 font-medium text-primary-foreground transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_8px_0_rgb(24_28_32_/_18%)] active:translate-y-0 active:shadow-none">
              <Download className="h-5 w-5" /> Get Patcher <ChevronRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-1" />
            </a>
            <a href="#install" className="group flex w-60 items-center justify-between rounded-[4px] bg-secondary px-5 py-4 font-medium text-secondary-foreground transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_8px_0_rgb(24_28_32_/_18%)] active:translate-y-0 active:shadow-none">
              <Terminal className="h-5 w-5" /> Build Manually <ChevronRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      <section id="specs" className="hatch border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl md:grid-cols-3">
          {stats.map((s) => (
            <div key={s.l} className="border-border px-8 py-10 md:border-r last:border-r-0">
              <div className="font-display text-5xl font-extrabold">{s.k}<span className="ml-1 text-xl text-muted-foreground">{s.u}</span></div>
              <div className="mt-3 h-1 w-10 bg-primary" />
              <div className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="contour-bg relative overflow-hidden py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="bracket-thin font-display text-4xl font-extrabold uppercase md:text-5xl">Under the Hood</h2>
            <div className="mt-2 font-symbol text-xl text-muted-foreground">under the hood</div>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <div key={f.t} className="group relative rounded-sm border border-border bg-white p-8 shadow-[0_8px_24px_rgb(24_28_32_/_6%)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-[0_14px_28px_rgb(24_28_32_/_10%)]">
                <div className="absolute right-4 top-4 font-mono text-xs text-muted-foreground">0{i + 1}</div>
                <div className="flex h-12 w-12 items-center justify-center bg-primary">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-6 font-display text-lg font-bold uppercase">{f.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
                <div className="absolute bottom-0 left-0 h-1 w-0 tri-stripe transition-all group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="install" className="contour-bg relative overflow-hidden py-28">
        <div className="cyan-wash absolute inset-x-0 bottom-0 h-2/3" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
          <div className="pl-8">
            <div className="tag-bar inline-flex bg-ink py-1 pl-3 pr-8 font-mono text-xs uppercase tracking-widest text-ink-foreground">
              Manual build · ~10 min on M4
            </div>
            <h2 className="bracket mt-10 inline-block font-display text-5xl font-extrabold uppercase leading-none md:text-6xl">
              Build<br />FineWine
            </h2>
            <div className="mt-6 font-symbol text-xl text-muted-foreground">build finewine</div>
            <p className="mt-6 max-w-md text-muted-foreground">Requires an M-series Mac, macOS 15+, Rosetta 2, a licensed CrossOver 26.3 and Xcode CLT. MacBook Air is not supported — active cooling required.</p>
          </div>
          <ol className="space-y-3">
            {steps.map(([cmd, label], i) => (
                <li key={cmd} className="flex items-stretch rounded-sm border border-border bg-white shadow-[0_6px_18px_rgb(24_28_32_/_6%)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgb(24_28_32_/_10%)]">
                <span className="flex w-14 items-center justify-center bg-primary font-display text-xl font-extrabold text-primary-foreground">{i + 1}</span>
                <div className="px-5 py-4">
                  <code className="font-mono text-sm font-semibold">./{cmd}</code>
                  <div className="mt-1 text-sm text-muted-foreground">{label}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="bg-card">
        <div className="flex h-1.5">
          <div className="w-1/4 bg-ink" />
          <div className="w-16 bg-magenta" />
          <div className="w-16 bg-primary" />
          <div className="w-16 bg-accent" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-10 text-xs text-muted-foreground">
          * Endfield FineWine is an unofficial compatibility project, not affiliated with Gryphline, Hypergryph, Tencent, CodeWeavers or Apple. Use at your own risk.
        </div>
      </footer>
    </div>
  );
}
