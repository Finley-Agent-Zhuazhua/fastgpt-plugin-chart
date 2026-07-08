import { afterEach, describe, expect, it, vi } from "vitest";
import { generateChart } from "./operations";
import { generateChartInputSchema } from "./schemas";

const chartConfig = {
  type: "line",
  data: {
    labels: ["Mon", "Tue"],
    datasets: [{ label: "Tickets", data: [4, 7] }],
  },
};

describe("generateChart", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a render URL without network calls by default", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateChart({ chartConfig });

    expect(result.success).toBe(true);
    expect(result.renderUrl).toContain("https://quickchart.io/chart?");
    expect(result.width).toBe(800);
    expect(result.height).toBe(400);
    expect(result.format).toBe("png");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("can request a short URL and rendered image", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ url: "https://quickchart.io/chart/render/abc" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }))
      .mockResolvedValueOnce(new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: { "content-type": "image/png" },
      }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateChart({
      chartConfig,
      returnShortUrl: true,
      returnImage: true,
    });

    expect(result.shortUrl).toBe("https://quickchart.io/chart/render/abc");
    expect(result.contentType).toBe("image/png");
    expect(result.sizeBytes).toBe(3);
    expect(result.imageBase64).toBe("AQID");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://quickchart.io/chart/create");
    expect(fetchMock.mock.calls[1]?.[0]).toBe("https://quickchart.io/chart");
  });

  it("rejects incomplete chart configs", () => {
    expect(() => generateChartInputSchema.parse({ chartConfig: { type: "bar" } })).toThrow(/data/);
    expect(() => generateChartInputSchema.parse({ chartConfig: { data: {} } })).toThrow(/type/);
  });
});
