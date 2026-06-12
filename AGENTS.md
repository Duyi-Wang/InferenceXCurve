# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + TypeScript single-page app for recreating the InferenceX throughput/interactivity chart at `https://inferencex.semianalysis.com/inference`.

- `src/main.ts`: application state, filters, editable data panels, CSV/GitHub Actions import, InferenceX sync state, and UI event wiring.
- `src/inferenceXSync.ts`: public InferenceX API client, availability parsing, benchmark filtering, fingerprints, and sync line generation.
- `src/inferenceCurveChart.ts`: reusable D3 chart rendering, roofline calculation, labels, colors, tooltips, and export logic.
- `src/exampleData.ts`: offline fallback benchmark line data.
- `src/styles.css`: global theme, chart layout, legend, and data editor styling.
- `vite.config.ts`: Vite base path and `/inferencex-api` dev proxy.
- `docs/import-csv.md`: public CSV/TSV import contract for external integrations and agent-generated files.
- `index.html`: Vite entry HTML.
- `dist/`: generated production output; do not edit by hand.

There is currently no dedicated `tests/` directory or asset folder.

## Build, Test, and Development Commands

Run these from the repository root:

```bash
npm install
```

Installs dependencies from `package-lock.json`.

```bash
npm run dev
```

Starts the Vite development server on `0.0.0.0`; open the printed localhost URL. In dev, `vite.config.ts` proxies `/inferencex-api` to `https://inferencex.semianalysis.com/api` so public InferenceX API requests avoid browser CORS failures.

```bash
npm run build
```

Runs `tsc` type checking and builds the production bundle with Vite. Use this as the main validation step before submitting changes.

```bash
npm run preview
```

Serves the built `dist/` output locally for production checks.

## Coding Style & Naming Conventions

Use TypeScript with ES modules. Follow the existing style: two-space indentation, single quotes, semicolons, explicit interfaces for shared data shapes, and descriptive camelCase names for functions and variables. UI constants use upper snake case when globally shared, for example `DEFAULT_LINE_STYLE`.

Keep chart-specific logic in `src/inferenceCurveChart.ts` and app/editor behavior in `src/main.ts`. Avoid unrelated refactors when changing data import, filters, or rendering behavior.

## Testing Guidelines

No automated test framework is configured yet. Validate changes with:

```bash
npm run build
```

For UI changes, also run `npm run dev` and manually verify the default filters, chart labels, legend controls, data editor collapse/expand behavior, CSV export, and GitHub Actions import if touched.

## Commit & Pull Request Guidelines

This workspace does not expose project Git history, so use concise imperative commit messages, for example `Add GitHub Actions artifact import` or `Fix split GPU point labels`.

Pull requests should include a short summary, verification steps, screenshots for visible UI changes, and notes about data compatibility or migration behavior. Link related issues when available. Do not commit generated `dist/` output unless the project explicitly requires release artifacts.

## Security & Configuration Tips

GitHub tokens entered in the import panel are used only for browser requests. By default they are not stored; if the user ticks "Remember token in this browser", the token is saved to `localStorage` under the `inferencex-curve:github-token:v1` key (separate from the app data key, so it is never included in exported data and does not sync across machines). InferenceX sync configs, fingerprints, and timestamps are saved with the normal browser data under `inferencex-curve:user-data:v1`; they must not include GitHub tokens. Do not hard-code tokens, benchmark credentials, or private artifact URLs in source files. Keep large benchmark snapshots in `src/exampleData.ts` only when they are useful as offline fallback data.

### Importing GitHub Actions artifacts: token scope

Downloading run artifacts (the `archive_download_url` / `.../artifacts/{id}/zip` endpoint) always requires a token, even for public repos. Choose the token type by who owns the repo:

- **Repo you own, or an org you can configure:** a **fine-grained PAT** with only the **Actions: Read-only** repository permission (Settings → Developer settings → Personal access tokens → Fine-grained tokens), granted to that specific repository.
- **Private repo owned by another personal account (you are only a collaborator/admin):** a fine-grained PAT cannot reach it — fine-grained tokens are scoped to a single resource owner. Use a **classic PAT with the `repo` scope** (classic tokens have no standalone actions-read scope; `repo` covers artifact download).
- **Org-owned private repo:** the org must enable fine-grained token access; otherwise fall back to a classic PAT with `repo` scope.

Suggest a long expiry stored in a password manager so the token is available when viewing from a different machine, since the "Remember token" option only covers the same browser.

Artifact zip downloads redirect from `api.github.com` to signed GitHub blob storage. Keep archive download request headers minimal; extra custom headers can trigger a browser CORS preflight on the redirected blob URL and surface as a bare `Failed to fetch`. If browser import still fails, users can download the artifact `.zip` from GitHub and load it with `Import File`.

## Agent Notes: Generating Importable CSV

Use `docs/import-csv.md` as the source of truth when generating CSV/TSV for `Import File` or when helping another project integrate with this app. Prefer the editor CSV format from that document, not raw benchmark CSV, unless the user explicitly asks for benchmark-style rows. `Import File` also accepts GitHub Actions artifact `.zip` files containing supported CSV/TSV/JSON payloads.

Agent-specific rules:

- Always include deterministic non-empty `Line ID`, `Line Name`, `Model`, `ISL/OSL`, and `Precision` values in generated editor CSV. Do not rely on app fallback defaults.
- Always include numeric `Interactivity (tok/s/user)` and `Throughput/GPU (tok/s/gpu)` for every point row with data.
- Prefer explicit `MTP` or `Non-MTP`; do not rely on name inference unless intentionally testing inference.
- Optional style/metadata/parallelism columns may be empty as documented in `docs/import-csv.md`.
- Keep generated CSV canonical: use the documented headers even though the importer accepts aliases.

## Agent Notes: InferenceX Data Sync

The app now treats the public InferenceX API as the primary source for default benchmark data, with `src/exampleData.ts` as offline fallback. Sync implementation lives in `src/inferenceXSync.ts`; UI state and local persistence live in `src/main.ts`.

- App startup with no saved browser data should fetch default sync configs and render the API result; if that fails, keep the bundled `exampleSeries`.
- App startup with saved browser data should check for updates only once and should not overwrite chart data until the user clicks `Update`.
- `Check Updates` fetches enabled configs and stages changed series; `Update` applies staged series.
- `Add Config` only creates sync configs, then automatically runs a staged update check. It must not apply chart data directly.
- The Add Config UI defaults `ISL/OSL`, `Precision`, `Framework`, and `MTP` to `All`. These are UI-only selections: never persist `__all__` in an `InferenceXSyncConfig`. Expand All selections from availability rows into concrete `isl`, `osl`, `precision`, `hardware`, `framework`, `specMethod`, and `disagg` configs.
- Sync-generated line ids are stable and derived from model, ISL/OSL, precision, hardware, framework, MTP, and disagg. Updating a sync line should replace data/source fields while preserving user style fields such as `color`, `lineStyle`, `marker`, `renderOrder`, and `collapsed`.
- Match hardware strictly. Do not alias `b200` to `gb200` or vice versa.

### CORS: dev works, deployed GitHub Pages does not

The InferenceX API does **not** send an `Access-Control-Allow-Origin` header (the official site is a same-origin Next.js app on Vercel, so it never needs one). Consequences for this app:

- **`npm run dev` works** only because `vite.config.ts` proxies `/inferencex-api` → the API, keeping browser requests same-origin. `INFERENCEX_API_BASE` in `src/inferenceXSync.ts` selects this dev proxy on `localhost`/`127.0.0.1` and the Vite ports.
- **The deployed site (`duyi-wang.github.io`) is cross-origin and will be blocked by the browser.** This is not a fixable client bug: the missing header is a *response* header owned by the API server; the frontend cannot add/fake it, and `Origin` is a forbidden request header. A pure static site directly hitting that API is architecturally impossible to make work in the browser.
- The fix requires a server-side hop the app controls: a proxy (e.g. a free Cloudflare Worker that forwards to the API and adds CORS headers — set as the production `INFERENCEX_API_BASE`), or a CI/build snapshot (fetch the API in GitHub Actions, ship JSON same-origin). Server-to-server requests are not subject to CORS. None of these are deployed yet.
- **Current handling:** when a cross-origin request fails, `fetchInferenceXJson` raises `InferenceXCorsError` (only when `INFERENCEX_API_IS_CROSS_ORIGIN` and the failure is a `TypeError`, i.e. a blocked fetch) carrying an explicit CORS message plus the browser-extension/proxy workarounds, instead of surfacing a bare "Failed to fetch". A blocked CORS request and a real network failure are indistinguishable from JS, so the message hedges with "blocked by CORS". Do not "fix" the deployed Sync by widening this to a generic error — keep the CORS guidance until a real proxy/snapshot is in place.

## Agent Notes: Refreshing InferenceX Example Data

When updating `src/exampleData.ts`, query the public InferenceX API rather than scraping the rendered page:

```bash
curl -L 'https://inferencex.semianalysis.com/api/v1/availability'
curl -L 'https://inferencex.semianalysis.com/api/v1/benchmarks?model=DeepSeek-R1-0528'
curl -L 'https://inferencex.semianalysis.com/api/v1/benchmarks?model=DeepSeek-R1-0528&date=2026-05-27&exact=true'
curl -L 'https://inferencex.semianalysis.com/api/v1/workflow-info?date=2026-05-27'
```

Use the display model name in the benchmark URL (`DeepSeek-R1-0528`), then filter returned rows by `model === "dsr1"`. The current example set keeps `1024/1024` and `8192/1024`, `fp4` and `fp8`, `disagg === true`, and these hardware/framework/spec combinations: `mi355x/mori-sglang`, `b200/dynamo-trt`, and `b200/dynamo-sglang`, with both `none` and `mtp`.

Map InferenceX rows to this app as follows: `metrics.median_intvty` -> `interactivity`, `metrics.tput_per_gpu` -> `throughput`, `conc` -> `concurrency`, `spec_method === "mtp"` -> line `MTP`, otherwise `Non-MTP`, `hardware_framework[_mtp]` -> `hwKey`, and `date` plus `run_url` -> point `Note`.
