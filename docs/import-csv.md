# CSV Import Format

This document is the integration contract for projects that generate CSV/TSV
files for InferenceX Curve's `Import File` workflow.

The app accepts `.csv`, `.tsv`, `.json`, `.jsonl`, `.ndjson`, and `.zip`
archives containing those files. For external CSV/TSV integrations, prefer the
**editor CSV** format below. It is the same shape produced by `Download CSV`,
round-trips through the app, and is more deterministic than raw benchmark CSV.

## Recommended Editor CSV

Use this header order for generated CSV:

```csv
Line ID,Line Name,Title,Model,ISL/OSL,Precision,MTP,Color Mode,Resolved Color,Line Type,Line Marker,Layer,Point Marker,Interactivity (tok/s/user),Throughput/GPU (tok/s/gpu),TTFT (s),End-to-end (s),Prefill GPUs,Decode GPUs,Prefill TP,Prefill EP,Prefill DPA,Decode TP,Decode EP,Decode DPA,Concurrency,Strategy,Note
```

The importer uses the editor parser when at least one row has a non-empty
`Line ID` / `series_id` / `line_id`. Repeat the same line fields for every point
row in the same curve.

### Required Fields

These fields should always be present and non-empty in generated editor CSV:

- `Line ID`: stable id for grouping rows into one curve.
- `Line Name`: legend label.
- `Model`: filter value, for example `DeepSeek-R1-0528`.
- `ISL/OSL`: filter value, for example `ISL 8192 / OSL 1024`.
- `Precision`: filter value, for example `fp4` or `fp8`.
- `Interactivity (tok/s/user)`: numeric X value.
- `Throughput/GPU (tok/s/gpu)`: numeric Y value.

Avoid relying on the app's internal fallbacks for empty `Line ID`, `Line Name`,
`Model`, `ISL/OSL`, or `Precision`; those defaults depend on current app state
and are not suitable for generated CSV.

### Fields That May Be Empty

These fields are optional in editor CSV:

- `Title`: optional tooltip/title metadata.
- `MTP`: optional, but explicit `MTP` or `Non-MTP` is preferred. Empty values are
  inferred from `Line ID`, `Line Name`, and `Title`; if no `mtp` token is found,
  the line becomes `Non-MTP`.
- `Color Mode`: use `Custom` only when `Resolved Color` should be imported.
  Empty or `Auto` means automatic color.
- `Resolved Color`: CSS color such as `#22c55e`; ignored unless `Color Mode` is
  `Custom`.
- `Line Type`: empty defaults to `solid`. Supported named values are `solid`,
  `dashed`, `dotted`, `dashdot`, and `long-dash`; custom dash arrays are also
  accepted after import.
- `Line Marker`: empty, `default`, `auto`, or `precision` means use the
  precision/default marker. Supported explicit markers are `circle`, `square`,
  `triangle`, `diamond`, `star`, `plus`, and `cross`.
- `Layer`: empty falls back to row order.
- `Point Marker`: same marker values as `Line Marker`; empty inherits the line
  marker.
- `TTFT (s)`: optional numeric time-to-first-token latency in seconds.
- `End-to-end (s)`: optional numeric end-to-end latency in seconds.
- `Prefill GPUs`, `Decode GPUs`, `Prefill TP`, `Prefill EP`, `Decode TP`,
  `Decode EP`, `Concurrency`: numeric when present.
- `Prefill DPA`, `Decode DPA`: boolean when present. Accepted values are
  `true`, `false`, `1`, `0`, `yes`, `no`, `y`, and `n`.
- `Strategy`: optional display/tooltip text. If empty, the app derives a
  strategy label from decode TP/EP when possible.
- `Note`: optional tooltip/source text.

Rows where all point columns are empty are skipped. A row with any point data
must have numeric `Interactivity` and `Throughput/GPU`, otherwise import fails.

### Ignored Export Columns

The app's `Download CSV` output contains derived columns. They are safe to keep
when round-tripping, but they are ignored on import:

- `HW Key`
- `Included in Chart`
- `Active Line`
- `Point Index`
- `Roofline Point`
- `Total GPUs`
- `Prefill Workers`
- `Decode Workers`
- `DPA`
- `Disagg`
- `Multi-node`

### Header Aliases

Header matching is case-insensitive and mostly punctuation-insensitive.
Generated integrations should still use the canonical headers above.

Accepted editor CSV aliases include:

- Line id/name: `series_id`, `line_id`, `Line ID`; `series_name`, `Line Name`,
  `name`
- Line fields: `model`, `islOsl`, `ISL/OSL`, `precision`, `mtp`, `title`,
  `lineStyle`, `Line Type`, `line_marker`, `Line Marker`, `renderOrder`,
  `Layer`
- Point fields: `Interactivity`, `Interactivity (tok/s/user)`, `tok/s/user`;
  `Throughput/GPU`, `Throughput/GPU (tok/s/gpu)`, `tok/s/gpu`; `TTFT`,
  `TTFT (s)`, `median_ttft`, `metrics.median_ttft`; `End-to-end`,
  `End-to-end (s)`, `endToEnd`, `end_to_end`, `E2E`, `e2el`, `median_e2el`,
  `metrics.median_e2el`; `shape`, `Marker`, `Point Marker`; snake_case point
  keys such as `num_prefill_gpu`, `decode_tp`, and `prefill_dp_attention`;
  display labels such as `Prefill GPUs`, `Decode TP`, and `Prefill DPA`

## Example

```csv
Line ID,Line Name,Title,Model,ISL/OSL,Precision,MTP,Color Mode,Resolved Color,Line Type,Line Marker,Layer,Point Marker,Interactivity (tok/s/user),Throughput/GPU (tok/s/gpu),TTFT (s),End-to-end (s),Prefill GPUs,Decode GPUs,Prefill TP,Prefill EP,Prefill DPA,Decode TP,Decode EP,Decode DPA,Concurrency,Strategy,Note
dsr1-8192-fp8-b200-trt,B200 TRT,DeepSeek R1 B200 TRT,DeepSeek-R1-0528,ISL 8192 / OSL 1024,fp8,Non-MTP,Auto,,solid,precision,1,,8.42,5220.5,0.12,9.04,4,8,4,4,true,8,8,true,1024,,run 123
dsr1-8192-fp8-b200-trt,B200 TRT,DeepSeek R1 B200 TRT,DeepSeek-R1-0528,ISL 8192 / OSL 1024,fp8,Non-MTP,Auto,,solid,precision,1,star,12.37,4188.1,,,4,8,4,4,true,8,8,true,2048,,highlighted point
```

## Raw Benchmark CSV Fallback

Raw benchmark CSV is supported only as a fallback. If no row has `Line ID`,
the importer groups rows by parsed model, ISL/OSL, precision, MTP/spec,
hardware, and framework.

Each raw benchmark row must have a numeric interactivity column and throughput
column. Accepted aliases include:

- Interactivity: `metrics.median_intvty`, `metrics.interactivity`,
  `median_intvty`, `median_interactivity`, `interactivity`, `tok/s/user`, `x`
- Throughput: `metrics.tput_per_gpu`, `tput_per_gpu`, `throughput_per_gpu`,
  `token throughput per gpu`, `throughput`, `tok/s/gpu`, `y`
- TTFT: `metrics.median_ttft`, `median_ttft`, `ttft`, `TTFT`, `TTFT (s)`
- End-to-end: `metrics.median_e2el`, `median_e2el`, `endToEnd`,
  `end_to_end`, `end-to-end`, `End-to-end (s)`, `E2E`, `e2el`

Optional raw benchmark aliases include:

- Model: `infmax_model_prefix`, `model_prefix`, `model_key`, `db_model`,
  `model`, `model_name`
- Hardware: `hardware`, `hw_key`, `hwKey`, `hw`, `gpu`, `accelerator`
- Framework: `framework`, `backend`, `runtime`
- MTP/spec: `mtp`, `spec_method`, `spec_decoding`, `speculation`
- Precision: `precision`, `dtype`, `quantization`
- Lengths: `isl`, `input_len`, `input_length`, `input_tokens`; `osl`,
  `output_len`, `output_length`, `output_tokens`
- Parallelism/source: `num_prefill_gpu`, `num_decode_gpu`, `prefill_tp`,
  `prefill_ep`, `decode_tp`, `decode_ep`, `dp_attention`,
  `prefill_dp_attention`, `decode_dp_attention`, `conc`, `concurrency`, `date`

In raw benchmark CSV, optional metadata may be empty. Missing
hardware/framework becomes `unknown`, missing precision becomes `default`,
missing ISL/OSL becomes `Default ISL/OSL`, and missing spec/MTP becomes
`Non-MTP`.
