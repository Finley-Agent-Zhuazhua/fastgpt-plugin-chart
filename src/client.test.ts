import { describe, expect, it } from "vitest";
import { buildRenderUrl, createQuickChartPayload, normalizeChartRequest, QUICKCHART_BASE_URL } from "./client";

const chartConfig = {
  type: "bar",
  data: {
    labels: ["Jan", "Feb"],
    datasets: [{ label: "Revenue", data: [10, 20] }],
  },
};

describe("QuickChart client helpers", () => {
  it("normalizes defaults and builds a fixed QuickChart render URL", () => {
    const request = normalizeChartRequest({ chartConfig });

    expect(request).toMatchObject({
      chartConfig,
      width: 800,
      height: 400,
      format: "png",
      chartJsVersion: "4",
    });

    const url = new URL(buildRenderUrl(request));
    expect(`${url.origin}`).toBe(QUICKCHART_BASE_URL);
    expect(url.pathname).toBe("/chart");
    expect(JSON.parse(url.searchParams.get("c") ?? "{}")).toEqual(chartConfig);
    expect(url.searchParams.get("w")).toBe("800");
    expect(url.searchParams.get("h")).toBe("400");
    expect(url.searchParams.get("f")).toBe("png");
    expect(url.searchParams.get("v")).toBe("4");
  });

  it("includes optional render settings in payloads", () => {
    const request = normalizeChartRequest({
      chartConfig,
      width: 1200,
      height: 600,
      format: "svg",
      backgroundColor: "white",
      chartJsVersion: "3",
      devicePixelRatio: 2,
    });

    expect(createQuickChartPayload(request)).toEqual({
      chart: chartConfig,
      width: 1200,
      height: 600,
      format: "svg",
      version: "3",
      backgroundColor: "white",
      devicePixelRatio: 2,
    });
  });
});
