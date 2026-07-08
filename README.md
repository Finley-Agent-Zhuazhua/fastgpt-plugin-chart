# FastGPT Chart Plugin

Generate Chart.js-compatible chart images for FastGPT workflows using fixed QuickChart API endpoints.

## Tools

- `chart` — build a render URL for a Chart.js configuration, optionally create a short QuickChart URL, and optionally download the rendered image as base64.

## Inputs

- `chartConfig`: Chart.js configuration JSON object. It must include at least `type` and `data`.
- `width` / `height`: optional image dimensions. Defaults to `800 x 400`.
- `format`: optional output format: `png`, `webp`, `svg`, or `pdf`. Defaults to `png`.
- `backgroundColor`: optional background color.
- `chartJsVersion`: optional Chart.js renderer version (`2`, `3`, or `4`). Defaults to `4`.
- `devicePixelRatio`: optional image scale, from `1` to `4`.
- `returnShortUrl`: when true, calls QuickChart's `/chart/create` endpoint and returns a shareable URL.
- `returnImage`: when true, calls QuickChart's `/chart` endpoint and returns base64 image content.

## Security

This plugin does not require secrets. It does not accept user-provided API endpoint overrides; requests are sent only to the fixed `https://quickchart.io` endpoints.

## Example

```json
{
  "chartConfig": {
    "type": "bar",
    "data": {
      "labels": ["Jan", "Feb", "Mar"],
      "datasets": [
        { "label": "Revenue", "data": [120, 180, 150] }
      ]
    }
  },
  "width": 800,
  "height": 400,
  "format": "png",
  "returnShortUrl": true
}
```

## Development

```bash
pnpm install --ignore-workspace
pnpm run type-check
pnpm test
pnpm build
pnpm check
pnpm run pack
```
