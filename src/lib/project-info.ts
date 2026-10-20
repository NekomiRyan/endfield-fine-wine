export const REPO = "https://github.com/stoicswe/Endfield_FineWine";

export const stats = [
  { k: "120", u: "FPS", l: "Max settings · M4 Pro" },
  { k: "DXMT", u: "", l: "D3D11 → Metal" },
  { k: "8–12", u: "GB", l: "Typical RAM use" },
];

export const features = [
  { t: "Anti-cheat compatible", d: "Adjusts the CrossOver environment so ACE runs uninterrupted — no bypass, no modified game logic." },
  { t: "Apple Silicon native path", d: "Built on DW-Proton work to handle VMProtect/TenProtect and rendering on macOS." },
  { t: "Tuned translation", d: "Optimised DX11/Vulkan calls via DXMT and optional GPTK4 D3DMetal." },
];

export const steps: [string, string][] = [
  ["build-wine.sh all", "Build the patched Wine"],
  ["swap-into-crossover.sh", "Deploy into a CrossOver copy"],
  ["create-bottle.sh", "Create the Endfield bottle"],
  ["open CrossOver_Endfield_Patch.app", "Launch with DirectX 11"],
];

export const requirements = [
  "Apple Silicon (M-series) Mac; Intel not supported",
  "macOS 15 (Sequoia) or newer",
  "Rosetta 2 installed",
  "Licensed CrossOver 26.3",
  "Xcode Command Line Tools and Homebrew",
  "About 5 GB disk; build ~10 min on a 10-core M4",
  "Active cooling required — MacBook Air is not supported",
];
