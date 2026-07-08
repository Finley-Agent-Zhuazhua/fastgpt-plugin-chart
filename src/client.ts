import type { ChartFormat, GenerateChartInput } from "./schemas";

export const QUICKCHART_BASE_URL = "https://quickchart.io";

type ChartJsVersion = "2" | "3" | "4";

export type NormalizedChartRequest = {
  chartConfig: Record<string, unknown>;
  width: number;
  height: number;
  format: ChartFormat;
  chartJsVersion: ChartJsVersion;
  backgroundColor?: string;
  devicePixelRatio?: number;
};

export type RenderedChartImage = {
  bytes: Uint8Array;
  contentType: string;
};

const DEFAULT_CONTENT_TYPES: Record<ChartFormat, string> = {
  png: "image/png",
  webp: "image/webp",
  svg: "image/svg+xml",
  pdf: "application/pdf",
};

export function normalizeChartRequest(input: GenerateChartInput): NormalizedChartRequest {
  const request: NormalizedChartRequest = {
    chartConfig: input.chartConfig,
    width: input.width ?? 800,
    height: input.height ?? 400,
    format: input.format ?? "png",
    chartJsVersion: input.chartJsVersion ?? "4",
  };

  if (input.backgroundColor) {
    request.backgroundColor = input.backgroundColor;
  }
  if (typeof input.devicePixelRatio === "number") {
    request.devicePixelRatio = input.devicePixelRatio;
  }

  return request;
}

export function buildRenderUrl(request: NormalizedChartRequest): string {
  const url = new URL("/chart", QUICKCHART_BASE_URL);
  url.searchParams.set("c", JSON.stringify(request.chartConfig));
  url.searchParams.set("w", String(request.width));
  url.searchParams.set("h", String(request.height));
  url.searchParams.set("f", request.format);
  url.searchParams.set("v", request.chartJsVersion);

  if (request.backgroundColor) {
    url.searchParams.set("bkg", request.backgroundColor);
  }
  if (typeof request.devicePixelRatio === "number") {
    url.searchParams.set("devicePixelRatio", String(request.devicePixelRatio));
  }

  return url.toString();
}

export function createQuickChartPayload(request: NormalizedChartRequest): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    chart: request.chartConfig,
    width: request.width,
    height: request.height,
    format: request.format,
    version: request.chartJsVersion,
  };

  if (request.backgroundColor) {
    payload.backgroundColor = request.backgroundColor;
  }
  if (typeof request.devicePixelRatio === "number") {
    payload.devicePixelRatio = request.devicePixelRatio;
  }

  return payload;
}

export async function renderChartImage(request: NormalizedChartRequest): Promise<RenderedChartImage> {
  const response = await fetch(`${QUICKCHART_BASE_URL}/chart`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(createQuickChartPayload(request)),
  });

  if (!response.ok) {
    throw new Error(`QuickChart render failed (${response.status} ${response.statusText}): ${await readErrorBody(response)}`);
  }

  const contentType = response.headers.get("content-type") ?? DEFAULT_CONTENT_TYPES[request.format] ?? "application/octet-stream";
  return {
    bytes: new Uint8Array(await response.arrayBuffer()),
    contentType,
  };
}

export async function createShortUrl(request: NormalizedChartRequest): Promise<string> {
  const response = await fetch(`${QUICKCHART_BASE_URL}/chart/create`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(createQuickChartPayload(request)),
  });

  if (!response.ok) {
    throw new Error(`QuickChart short URL creation failed (${response.status} ${response.statusText}): ${await readErrorBody(response)}`);
  }

  const body = await response.json() as { url?: unknown; shortUrl?: unknown };
  const url = typeof body.url === "string" ? body.url : body.shortUrl;
  if (typeof url !== "string" || url.length === 0) {
    throw new Error("QuickChart short URL response did not include a URL.");
  }

  return url;
}

async function readErrorBody(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text.slice(0, 500);
  } catch {
    return "Unable to read response body";
  }
}
