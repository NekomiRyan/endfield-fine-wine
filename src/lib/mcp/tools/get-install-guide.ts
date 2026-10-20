import { defineTool } from "@lovable.dev/mcp-js";
import { REPO, requirements, steps } from "../../project-info";

export default defineTool({
  name: "get_install_guide",
  title: "Get install guide",
  description: "Return the requirements and step-by-step manual build commands for Endfield FineWine.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const text = [
      "Requirements:",
      ...requirements.map((r) => `- ${r}`),
      "",
      "Steps:",
      ...steps.map(([cmd, label], i) => `${i + 1}. ./${cmd} — ${label}`),
      "",
      `Prebuilt patcher: ${REPO}/releases`,
    ].join("\n");
    return {
      content: [{ type: "text", text }],
      structuredContent: {
        requirements,
        steps: steps.map(([command, label]) => ({ command: `./${command}`, label })),
        releases: `${REPO}/releases`,
      },
    };
  },
});
