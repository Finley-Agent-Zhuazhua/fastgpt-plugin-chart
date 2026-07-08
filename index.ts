import { createToolHandler, defineTool } from "@fastgpt-plugin/sdk-factory";
import { generateChart } from "./src/operations";
import { generateChartInputSchema, generateChartOutputSchema } from "./src/schemas";

const handler = createToolHandler({
  inputSchema: generateChartInputSchema,
  outputSchema: generateChartOutputSchema,
  handler: async (input) => generateChart(input),
});

const tool = defineTool({
  manifest: {
    pluginId: "chart",
    name: {
      en: "Chart Generator",
      "zh-CN": "图表生成",
    },
    description: {
      en: "Generate Chart.js-compatible chart image URLs and base64 images with QuickChart.",
      "zh-CN": "使用 QuickChart 生成兼容 Chart.js 的图表图片链接和 base64 图片。",
    },
    version: "0.1.0",
    versionDescription: {
      en: "Initial version with render URL generation, optional short URLs, and optional image download.",
      "zh-CN": "初始版本，支持生成渲染链接、可选短链接和可选图片下载。",
    },
    toolDescription:
      "Generate Chart.js-compatible bar, line, pie, doughnut, radar, scatter, and other chart images through fixed QuickChart endpoints. Returns a render URL and can optionally return a short URL or base64 image content.",
    tutorialUrl: "https://quickchart.io/documentation/",
    tags: ["tools", "productivity"],
    permission: [],
  },
  handler,
});

export default tool;
