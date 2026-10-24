import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import server from "../server";

describe("Google Site Verification", () => {
  it("serves the verification file correctly from the server fetch handler", async () => {
    const request = new Request("https://endfield.example.com/googlee61b17e27d59fee7.html");
    const response = await server.fetch(request, {}, {});

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    const text = await response.text();
    expect(text.trim()).toBe("google-site-verification: googlee61b17e27d59fee7.html");
  });

  it("has the static verification file in public directory", () => {
    const filePath = path.resolve(__dirname, "../../public/googlee61b17e27d59fee7.html");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content.trim()).toBe("google-site-verification: googlee61b17e27d59fee7.html");
  });
});
