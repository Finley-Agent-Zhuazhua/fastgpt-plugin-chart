import { Buffer } from "node:buffer";
import { buildRenderUrl, createShortUrl, normalizeChartRequest, renderChartImage } from "./client";
import type { GenerateChartInput, GenerateChartOutput } from "./schemas";

export async function generateChart(input: GenerateChartInput): Promise<GenerateChartOutput> {
  const request = normalizeChartRequest(input);
  const output: GenerateChartOutput = {
    success: true,
    renderUrl: buildRenderUrl(request),
    width: request.width,
    height: request.height,
    format: request.format,
  };

  if (input.returnShortUrl === true) {
    output.shortUrl = await createShortUrl(request);
  }

  if (input.returnImage === true) {
    const image = await renderChartImage(request);
    output.contentType = image.contentType;
    output.sizeBytes = image.bytes.byteLength;
    output.imageBase64 = Buffer.from(image.bytes).toString("base64");
  }

  return output;
}
