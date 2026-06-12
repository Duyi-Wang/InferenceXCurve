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

Line and point edits are auto-rendered after a short debounce, so the chart
updates without pressing `Render Chart`. The button remains available for an
immediate redraw.

## Filters and View Controls

The top controls filter by `Model`, `ISL/OSL`, `Precision`, and `MTP`. Defaults
select the first available value rather than showing all values.

The legend panel includes:

- line visibility search and toggles
- per-filter active-line memory for each `Model` / `ISL/OSL` / `Precision` /
  `MTP` view
- hover-only `Only` actions for quickly isolating one line
- hover-only locate actions for jumping from a legend line to its Line Project
- `Show all lines` below the line list to reactivate every line in the current
  filtered view
- `Log Scale`
- `Optimal Only`
- `Hide Labels`
- `High Contrast`
- `Parallelism Labels`
- `Gradient Labels`
- `Line Labels`

By default, `Optimal Only` is enabled and `Gradient Labels` / `Line Labels` are
disabled.

Newly added, copied, or imported lines are activated automatically in the
current view.

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

Artifact zip downloads redirect from `api.github.com` to signed GitHub blob
storage. If the browser reports `Failed to fetch` while downloading artifacts,
check the token first. If you are using a CORS-unblocking browser extension, make
sure it also covers GitHub artifact blob URLs, not only the InferenceX API. As a
fallback, download the artifact `.zip` from GitHub and load it with `Import File`.

Imported artifacts are staged in a review panel before they are added. You can
edit line fields, change `MTP` or `Marker`, select/deselect lines, discard the
preview, or append selected lines to the current data.

The importer normalizes common InferenceX artifact fields:

- model prefixes and paths such as `dsr1` or `deepseek-ai/DeepSeek-R1-0528` map
  to `DeepSeek-R1-0528`
- `spec_method` / `spec_decoding` map to `MTP` or `Non-MTP`
- `hw` values such as `mi355x-amds` normalize to the chart hardware key

## InferenceX Public API Sync

The `InferenceX Sync` panel can keep chart data aligned with the public
InferenceX API without editing `src/exampleData.ts`.

On first open, if no browser data exists, the app tries to load the default
InferenceX sync configuration from the API. If the request fails or no matching
rows are returned, it falls back to the bundled `exampleSeries`. On later opens,
the app checks for updates once and stages the result, but it does not overwrite
the current chart until you click `Update`.

The panel actions are:

- `Check Updates`: fetch enabled sync configs and stage any new or changed lines.
- `Update`: apply staged API data to the chart. User-created, CSV-imported, and
  GitHub-imported lines are kept unless they share the stable InferenceX sync
  line id.
- `Manage Configs`: enable, disable, remove, reset, or add sync configs.

Config management uses live `availability` data from the API. The Add Config
form defaults `ISL/OSL`, `Precision`, `Framework`, and `MTP` to `All`; clicking
`Add Config` expands those selections into only the real combinations returned
by availability, then automatically runs `Check Updates`. The user still needs
to click `Update` before the new data is applied to the chart.

Sync configs, fingerprints, timestamps, and staged status metadata are saved in
the normal browser data payload under `localStorage` key
`inferencex-curve:user-data:v1`. The GitHub token remains separate under
`inferencex-curve:github-token:v1`.

### CORS and the deployed site

The InferenceX API serves the official site from the same origin
(`inferencex.semianalysis.com`), so it never needs CORS headers and does not send
an `Access-Control-Allow-Origin` header. This app is different:

- **Local `npm run dev`** works because the Vite dev server proxies
  `/inferencex-api` to the API (see `vite.config.ts`), so the browser only makes
  same-origin requests.
- **The deployed GitHub Pages site** (`duyi-wang.github.io`) is a static site on a
  different origin. Its browser requests to the API are cross-origin, and because
  the API sends no `Access-Control-Allow-Origin` header, the browser blocks the
  response. This is a browser security mechanism: the missing header is a
  *response* header controlled by the API server, so the frontend cannot add or
  fake it, and the `Origin` request header cannot be overridden from JavaScript.

When this happens, the Sync panel reports an explicit **CORS** error (rather than a
generic "Failed to fetch") with these workarounds:

- **Temporary, no infrastructure:** install and enable a CORS-unblocking browser
  extension (e.g. "Allow CORS" / "CORS Unblock"), then retry. This relaxes the
  check in your own browser only; it does not change anything for other visitors.
- **Permanent:** route requests through a proxy you control. Server-to-server
  requests are not subject to CORS, so a proxy (e.g. a free Cloudflare Worker that
  forwards to the API and adds CORS headers) makes Sync work for everyone. A build
  /CI snapshot approach (fetch the API in GitHub Actions and ship the JSON
  same-origin with the site) is an alternative when live, on-click freshness is
  not required.

## Import Data File

`Import File` (next to `Import Action Data`) loads a local `.csv`, `.tsv`,
`.json`, `.jsonl`, `.ndjson`, or artifact `.zip` file through the same review panel. This round-
trips a file produced by `Download CSV`: line fields, point `Interactivity` /
`Throughput/GPU`, markers, custom colors (from the `Color Mode` / `Resolved
Color` columns), concurrency, parallelism, and notes are restored. Derived
columns (`Total GPUs`, `Included in Chart`, `Active Line`, `Point Index`,
`Roofline Point`) are ignored on import. The same parser also accepts raw
benchmark JSON/CSV exports.

For external integrations or agent-generated files, use
[`docs/import-csv.md`](docs/import-csv.md) as the CSV/TSV import contract. It
lists the recommended headers, required fields, optional empty fields, aliases,
and raw benchmark fallback format.

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

- `src/main.ts`: UI, data editor, CSV handling, GitHub Actions import, and
  InferenceX sync state wiring.
- `src/inferenceXSync.ts`: public InferenceX API client, availability parsing,
  benchmark filtering, fingerprints, and sync line generation.
- `src/inferenceCurveChart.ts`: D3 chart rendering and curve logic.
- `src/exampleData.ts`: offline fallback DeepSeek R1 0528 example series.
- `src/styles.css`: application and chart styling.
- `vite.config.ts`: Vite base path and dev proxy for `/inferencex-api`.
- `docs/import-csv.md`: CSV/TSV import contract for external integrations.
- `AGENTS.md`: contributor guidance for coding agents.
