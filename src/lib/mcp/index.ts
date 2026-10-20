import { defineMcp } from "@lovable.dev/mcp-js";
import getProjectOverview from "./tools/get-project-overview";
import getInstallGuide from "./tools/get-install-guide";

export default defineMcp({
  name: "endfield-fine-wine",
  title: "Endfield Fine Wine",
  version: "0.1.0",
  instructions:
    "Public info about Endfield FineWine, a project that runs Arknights: Endfield on Apple Silicon Macs. Use the overview tool for features and performance, and the install tool for requirements and setup steps.",
  tools: [getProjectOverview, getInstallGuide],
});
