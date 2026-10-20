import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

type StatisticsBinding = {
  writeDataPoint: (point: { blobs?: string[]; doubles?: number[] }) => void;
};

type StatisticsEnv = {
  STATISTICS_ANALYTICS_ENGINE?: StatisticsBinding;
  STATISTICS_WEBHOOK_URL?: string;
};

type StatisticsPayload = {
  app: string;
  event: string;
  count: number;
  appVersion: string;
  osMajor: number;
  metadata: Record<string, string>;
};

type WaitUntilContext = {
  waitUntil?: (promise: Promise<unknown>) => void;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

function parseStatisticsPayload(value: unknown): StatisticsPayload | undefined {
  if (!value || typeof value !== "object") return undefined;
  const data = value as Record<string, unknown>;
  if (typeof data["app"] !== "string" || data["app"] !== "endfield-finewine-patcher") return undefined;
  if (typeof data["event"] !== "string" || !/^[a-z][a-z0-9_]{1,63}$/.test(data["event"])) return undefined;
  if (data["count"] !== 1 || typeof data["appVersion"] !== "string" || typeof data["osMajor"] !== "number") return undefined;
  const rawMetadata = data["metadata"];
  const metadata: Record<string, string> = {};
  if (rawMetadata && typeof rawMetadata === "object") {
    for (const [key, item] of Object.entries(rawMetadata as Record<string, unknown>)) {
      if (/^[a-z][a-z0-9_]{0,31}$/.test(key) && typeof item === "string" && item.length <= 128) {
        metadata[key] = item;
      }
    }
  }
  return {
    app: data["app"],
    event: data["event"],
    count: 1,
    appVersion: data["appVersion"].slice(0, 64),
    osMajor: Math.max(0, Math.min(999, Math.trunc(data["osMajor"]))),
    metadata,
  };
}

async function recordStatistics(env: unknown, payload: StatisticsPayload): Promise<void> {
  const config = (env ?? {}) as StatisticsEnv;
  const jobs: Promise<unknown>[] = [];
  try {
    config.STATISTICS_ANALYTICS_ENGINE?.writeDataPoint({
      blobs: [payload.app, payload.event, payload.appVersion],
      doubles: [payload.count, payload.osMajor],
    });
  } catch {
    // Statistics must never affect the app response.
  }

  if (config.STATISTICS_WEBHOOK_URL) {
    try {
      const webhook = new URL(config.STATISTICS_WEBHOOK_URL);
      if (webhook.protocol === "https:" || webhook.protocol === "http:") {
        jobs.push(fetch(webhook, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...payload, timestamp: new Date().toISOString() }),
        }).then(() => undefined).catch(() => undefined));
      }
    } catch {
      // An invalid optional URL is equivalent to statistics being disabled.
    }
  }
  await Promise.all(jobs);
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/statistics") {
        if (request.method !== "POST") {
          return new Response(null, { status: 405, headers: { allow: "POST", "cache-control": "no-store" } });
        }
        let payload: StatisticsPayload | undefined;
        try {
          payload = parseStatisticsPayload(await request.json());
        } catch {
          payload = undefined;
        }
        if (!payload) return new Response(null, { status: 400, headers: { "cache-control": "no-store" } });
        const record = recordStatistics(env, payload);
        const waitUntil = (ctx as WaitUntilContext | null)?.waitUntil;
        if (waitUntil) waitUntil(record); else await record;
        return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
