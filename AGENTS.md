# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + TypeScript single-page app for recreating the InferenceX throughput/interactivity chart at `https://inferencex.semianalysis.com/inference`.

- `src/main.ts`: application state, filters, editable data panels, CSV/GitHub Actions import, and UI event wiring.
- `src/inferenceCurveChart.ts`: reusable D3 chart rendering, roofline calculation, labels, colors, tooltips, and export logic.
- `src/exampleData.ts`: default benchmark line data loaded at startup.
- `src/styles.css`: global theme, chart layout, legend, and data editor styling.
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

Starts the Vite development server on `0.0.0.0`; open the printed localhost URL.

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

GitHub tokens entered in the import panel are used only for browser requests. By default they are not stored; if the user ticks "Remember token in this browser", the token is saved to `localStorage` under the `inferencex-curve:github-token:v1` key (separate from the app data key, so it is never included in exported data and does not sync across machines). Do not hard-code tokens, benchmark credentials, or private artifact URLs in source files. Keep large benchmark snapshots in `src/exampleData.ts` only when they are useful as default demo data.

### Importing GitHub Actions artifacts: token scope

Downloading run artifacts (the `archive_download_url` / `.../artifacts/{id}/zip` endpoint) always requires a token, even for public repos. Recommend the user create a **fine-grained personal access token** with only the **Actions: Read-only** repository permission (Settings → Developer settings → Personal access tokens → Fine-grained tokens). For private repos, the token must also be granted access to that specific repository. Suggest a long expiry stored in a password manager so the token is available when viewing from a different machine, since the "Remember token" option only covers the same browser.

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
