import { defineTool } from "@lovable.dev/mcp-js";
import { REPO, features, stats } from "../../project-info";

export default defineTool({
  name: "get_project_overview",
  title: "Get project overview",
  description: "Describe Endfield FineWine: what it does, its key features, performance figures and repository link.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const text = [
      "Endfield FineWine: patched CrossOver Wine, scripts and docs to run Arknights: Endfield on Apple Silicon Macs.",
      "",
      "Features:",
      ...features.map((f) => `- ${f.t}: ${f.d}`),
      "",
      "Performance:",
      ...stats.map((s) => `- ${s.k}${s.u ? " " + s.u : ""} — ${s.l}`),
      "",
      `Repository: ${REPO}`,
    ].join("\n");
    return {
      content: [{ type: "text", text }],
      structuredContent: {
        repository: REPO,
        features: features.map((f) => ({ title: f.t, description: f.d })),
        stats: stats.map((s) => ({ value: s.k, unit: s.u, label: s.l })),
      },
    };
  },
});
