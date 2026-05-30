# InferenceX Curve

This Vite + TypeScript app recreates the InferenceX `Token Throughput per GPU vs.
Interactivity` chart with editable custom data. It focuses on matching the
reference chart behavior while letting users paste table data, import benchmark
artifacts, and tune line/point styling.

## Run Locally

```bash
npm install
npm run dev
```

Open the printed localhost URL. For a production build:

```bash
npm run build
npm run preview
```

## Data Model

Each curve is edited as a **Line Project**. Line-level fields are shared by all
points in that curve:

- `Line ID`: unique curve id.
- `Name`: legend label.
- `Model`: model filter value, for example `DeepSeek-R1-0528`.
- `ISL/OSL`: sequence length filter value, for example `ISL 8192 / OSL 1024`.
- `Precision`: precision filter value, for example `fp4` or `fp8`.
- `MTP`: `MTP` or `Non-MTP`; also drives filtering and vendor color grouping.
- `Title`: longer tooltip/title metadata.
- `Marker`: default point marker for the line. `Precision` follows the
  precision-based default shape.
- `Line Type`: solid, dashed, dotted, dash-dot, long dash, or custom dasharray.
- `Color`: automatic vendor color, color picker, or a vibrant standard-color
  preset swatch.

Point rows are edited in each line's table and support Excel/Google Sheets
paste. Required point columns:

- `Interactivity`: X axis, tokens per second per user.
- `Throughput/GPU`: Y axis, tokens per second per GPU.

Optional point columns:

- `Marker`: per-point marker override. `Default` inherits the line marker.
- `Prefill GPUs`, `Decode GPUs`: used for split GPU labels.
- `Prefill TP`, `Prefill EP`, `Prefill DPA`
- `Decode TP`, `Decode EP`, `Decode DPA`
- `Concurrency`: shown in tooltip and used for point identity.
- `Note`: tooltip/source metadata.

Example TSV:

```tsv
Marker	Interactivity	Throughput/GPU	Prefill GPUs	Decode GPUs	Prefill TP	Prefill EP	Prefill DPA	Decode TP	Decode EP	Decode DPA	Concurrency	Note
Default	11.75	7397.06	4	8	4	4	true	8	8	true	4096	date 2026-05-07
Star	15.51	4893.40	4	8	4	4	true	8	8	true	2048	highlighted point
```

## Filters and View Controls

The top controls filter by `Model`, `ISL/OSL`, `Precision`, and `MTP`. Defaults
select the first available value rather than showing all values.

The legend panel includes:

- line visibility search and toggles
- `Log Scale`
- `Optimal Only`
- `Hide Labels`
- `High Contrast`
- `Parallelism Labels`
- `Gradient Labels`
- `Line Labels`

By default, `Optimal Only` is enabled and `Gradient Labels` / `Line Labels` are
disabled.

## GitHub Actions Import

The data panel can import benchmark output from a GitHub Actions run URL. Paste a
run URL such as:

```text
https://github.com/owner/repo/actions/runs/123456789
```

Downloading run artifacts always requires a GitHub token, even for public repos.
Pick the token type by who owns the repo:

- Repo you own, or an org you can configure: a fine-grained PAT with only the
  `Actions: Read-only` permission, granted to that repository.
- Private repo owned by another account (you are a collaborator/admin): a classic
  PAT with the `repo` scope. Fine-grained tokens are scoped to a single resource
  owner and cannot reach it.

Tick `Remember token in this browser` to save the token to `localStorage` under
the `inferencex-curve:github-token:v1` key (this browser only, stored in plain
text, and never included in exported data). A progress bar shows artifact
download status while importing.

Imported artifacts are staged in a review panel before they are added. You can
edit line fields, change `MTP` or `Marker`, select/deselect lines, discard the
preview, or append selected lines to the current data.

The importer normalizes common InferenceX artifact fields:

- model prefixes and paths such as `dsr1` or `deepseek-ai/DeepSeek-R1-0528` map
  to `DeepSeek-R1-0528`
- `spec_method` / `spec_decoding` map to `MTP` or `Non-MTP`
- `hw` values such as `mi355x-amds` normalize to the chart hardware key

## Chart Logic

Reusable chart logic lives in `src/inferenceCurveChart.ts`.

- Points are filtered to finite `interactivity` and `throughput` values.
- The upper-left Pareto roofline keeps optimal points only.
- Rooflines use `d3.curveMonotoneX`.
- Line colors are automatically grouped by vendor: NVIDIA green family, AMD red
  family, with MTP variants treated separately.
- Point labels use split prefill/decode GPU counts when available.
- Marker rendering supports circle, square, triangle, diamond, star, plus, and
  cross.
- Zoom, pan, reset zoom, PNG export, and CSV export are available.

The InferenceX Bus/Race Car and Donkey/Elytra overlays are intentionally not
included.

## Project Structure

- `src/main.ts`: UI, data editor, CSV handling, GitHub Actions import.
- `src/inferenceCurveChart.ts`: D3 chart rendering and curve logic.
- `src/exampleData.ts`: default DeepSeek R1 0528 example series.
- `src/styles.css`: application and chart styling.
- `AGENTS.md`: contributor guidance for coding agents.
