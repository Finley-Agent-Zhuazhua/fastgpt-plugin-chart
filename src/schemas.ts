import type { InputSchemaMetaType, OutputSchemaMetaType } from "@fastgpt-plugin/sdk-factory";
import z from "zod";

const chartConfigSchema = z.record(z.string(), z.unknown()).superRefine((value, ctx) => {
  if (typeof value.type !== "string" || value.type.trim().length === 0) {
    ctx.addIssue({
      code: "custom",
      message: "chartConfig.type is required and must be a non-empty string.",
      path: ["type"],
    });
  }
  if (!value.data || typeof value.data !== "object" || Array.isArray(value.data)) {
    ctx.addIssue({
      code: "custom",
      message: "chartConfig.data is required and must be an object.",
      path: ["data"],
    });
  }
});

export const generateChartInputSchema = z.object({
  chartConfig: chartConfigSchema.meta({
    title: "Chart.js config",
    description: "Chart.js configuration object. It must include at least type and data.",
    toolDescription: "Chart.js config object for the chart to render.",
  } satisfies InputSchemaMetaType),
  width: z.number().int().min(1).max(4000).optional().nullable().meta({
    title: "Width",
    description: "Output image width in pixels. Defaults to 800.",
    toolDescription: "Chart image width in pixels.",
  } satisfies InputSchemaMetaType),
  height: z.number().int().min(1).max(4000).optional().nullable().meta({
    title: "Height",
    description: "Output image height in pixels. Defaults to 400.",
    toolDescription: "Chart image height in pixels.",
  } satisfies InputSchemaMetaType),
  format: z.enum(["png", "webp", "svg", "pdf"]).optional().nullable().meta({
    title: "Format",
    description: "Rendered output format. Defaults to png.",
    toolDescription: "Chart output format.",
  } satisfies InputSchemaMetaType),
  backgroundColor: z.string().min(1).max(128).optional().nullable().meta({
    title: "Background color",
    description: "Optional CSS color or hex background color for the chart image.",
    toolDescription: "Optional background color.",
  } satisfies InputSchemaMetaType),
  chartJsVersion: z.enum(["2", "3", "4"]).optional().nullable().meta({
    title: "Chart.js version",
    description: "QuickChart Chart.js renderer version. Defaults to 4.",
    toolDescription: "Chart.js version to use: 2, 3, or 4.",
  } satisfies InputSchemaMetaType),
  devicePixelRatio: z.number().min(1).max(4).optional().nullable().meta({
    title: "Device pixel ratio",
    description: "Optional render scale from 1 to 4.",
    toolDescription: "Optional output scaling ratio.",
  } satisfies InputSchemaMetaType),
  returnShortUrl: z.boolean().optional().nullable().meta({
    title: "Return short URL",
    description: "When true, call QuickChart /chart/create and return a short URL.",
    toolDescription: "Create and return a short QuickChart URL.",
  } satisfies InputSchemaMetaType),
  returnImage: z.boolean().optional().nullable().meta({
    title: "Return image",
    description: "When true, call QuickChart /chart and return base64 image content.",
    toolDescription: "Render and return chart image as base64.",
  } satisfies InputSchemaMetaType),
});

export const generateChartOutputSchema = z.object({
  success: z.literal(true).meta({ title: "Success" } satisfies OutputSchemaMetaType),
  renderUrl: z.string().meta({ title: "Render URL" } satisfies OutputSchemaMetaType),
  shortUrl: z.string().optional().meta({ title: "Short URL" } satisfies OutputSchemaMetaType),
  width: z.number().int().meta({ title: "Width" } satisfies OutputSchemaMetaType),
  height: z.number().int().meta({ title: "Height" } satisfies OutputSchemaMetaType),
  format: z.enum(["png", "webp", "svg", "pdf"]).meta({ title: "Format" } satisfies OutputSchemaMetaType),
  contentType: z.string().optional().meta({ title: "Content type" } satisfies OutputSchemaMetaType),
  sizeBytes: z.number().int().nonnegative().optional().meta({ title: "Size bytes" } satisfies OutputSchemaMetaType),
  imageBase64: z.string().optional().meta({ title: "Image base64" } satisfies OutputSchemaMetaType),
});

export type GenerateChartInput = z.output<typeof generateChartInputSchema>;
export type GenerateChartOutput = z.output<typeof generateChartOutputSchema>;
export type ChartFormat = GenerateChartOutput["format"];
