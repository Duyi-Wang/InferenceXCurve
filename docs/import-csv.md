# CSV Import Format

This document is the integration contract for projects that generate CSV/TSV
files for InferenceX Curve's `Import File` workflow.

For the independent Plot Tool workspace and its generic `Line ID` / `X` / `Y`
format, use [`import-plot-tool-csv.md`](import-plot-tool-csv.md) instead. The two
CSV contracts are not interchangeable.

The app accepts `.csv`, `.tsv`, `.json`, `.jsonl`, `.ndjson`, and `.zip`
archives containing those files. For external CSV/TSV integrations, prefer the
**editor CSV** format below. It is the same shape produced by `Download CSV`,
round-trips through the app, and is more deterministic than raw benchmark CSV.

## Recommended Editor CSV

Use this header order for generated CSV:

```csv
Line ID,Line Name,Title,Model,Scenario,Precision,MTP,HW Key,Color Mode,Resolved Color,Line Type,Line Marker,Layer,Included in Chart,Active Line,Point Index,Roofline Point,Point Marker,Interactivity (tok/s/user),Throughput/GPU (tok/s/gpu),TTFT (s),End-to-end (s),P90 Normalized E2E @ 400 output tokens (s),Session Time (min),P90 Prefill TPS/user,Prefill GPUs,Decode GPUs,Total GPUs,Prefill TP,Prefill EP,Prefill DPA,Prefill Workers,Decode TP,Decode EP,Decode DPA,Decode Workers,DPA,Disagg,Multi-node,KV Offload,Concurrency,Strategy,Note
```

The importer uses the editor parser when at least one row has a non-empty
`Line ID` / `series_id` / `line_id`. Repeat the same line fields for every point
row in the same curve.

### Required Fields

These fields should always be present and non-empty in generated editor CSV:

- `Line ID`: stable id for grouping rows into one curve.
- `Line Name`: legend label.
- `Model`: filter value, for example `DeepSeek-R1-0528`.
- `Scenario`: sequence/scenario value, for example `ISL 8192 / OSL 1024`, `ISL 1024 / OSL 1024`, or `Agentic Traces`. The UI classifies numeric ISL/OSL values under `Fixed Sequence Length` and agentic labels under `Agentic Traces`.
- `Precision`: filter value, for example `fp4` or `fp8`.
- `Throughput/GPU (tok/s/gpu)`: numeric Y value.

Each point row with data must also include at least one numeric X-axis metric:

- `Interactivity (tok/s/user)`
- `TTFT (s)`
- `End-to-end (s)`
- `P90 Normalized E2E @ 400 output tokens (s)`
- `Session Time (min)`
- `P90 Prefill TPS/user`

Avoid relying on the app's internal fallbacks for empty `Line ID`, `Line Name`,
`Model`, `Scenario`, or `Precision`; those defaults depend on current app state
and are not suitable for generated CSV. `MTP` is technically optional, but
generated integrations should prefer explicit `MTP` or `Non-MTP`.

### Fields That May Be Empty

These fields are optional in editor CSV:

- `Title`: optional tooltip/title metadata.
- `MTP`: empty values are inferred from `Line ID`, `Line Name`, and `Title`; if
  no `mtp` token is found, the line becomes `Non-MTP`.
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
- `Interactivity (tok/s/user)`, `TTFT (s)`, `End-to-end (s)`,
  `P90 Normalized E2E @ 400 output tokens (s)`, `Session Time (min)`, and
  `P90 Prefill TPS/user`: optional numeric X-axis metrics, as long as at least
  one is present for the row. `Session Time (min)` stores the official
  mean-normalized session time in minutes; `_s` and `(s)` aliases are converted
  to minutes during file import.
- `Prefill GPUs`, `Decode GPUs`, `Prefill TP`, `Prefill EP`,
  `Prefill Workers`, `Decode TP`, `Decode EP`, `Decode Workers`, and
  `Concurrency`: numeric when present.
- `Prefill DPA`, `Decode DPA`, `DPA`, `Disagg`, and `Multi-node`: boolean when
  present. Accepted values are `true`, `false`, `1`, `0`, `yes`, `no`, `y`,
  and `n`.
- `Strategy`: optional display/tooltip text. If empty, the app derives a
  strategy label from decode TP/EP when possible.
- `KV Offload`: optional point metadata such as `KV offload off` or
  `KV offload DRAM via LMCache`. It is not a line grouping dimension, but it is
  preserved for tooltips/export and is included in Copy and split by config.
- `Note`: optional tooltip/source text.

Rows where all point columns are empty are skipped. A row with any point data
must have numeric `Throughput/GPU` and at least one numeric X-axis metric,
otherwise import fails.

### Ignored Export Columns

The app's `Download CSV` output contains derived columns. They are safe to keep
when round-tripping, but they are ignored on import:

- `HW Key`
- `Included in Chart`
- `Active Line`
- `Point Index`
- `Roofline Point`
- `Total GPUs`

### Header Aliases

Header matching is case-insensitive and mostly punctuation-insensitive.
Generated integrations should still use the canonical headers above.

Accepted editor CSV aliases include:

- Line id/name: `series_id`, `line_id`, `Line ID`; `series_name`, `Line Name`,
  `name`
- Line fields: `model`, `islOsl`, `Scenario`, `ISL/OSL`, `precision`, `mtp`, `title`,
  `lineStyle`, `Line Type`, `line_marker`, `Line Marker`, `renderOrder`,
  `Layer`
- Interactivity: `Interactivity`, `Interactivity (tok/s/user)`,
  `P90 Interactivity`, `P90 Interactivity (tok/s/user)`, `median_intvty`,
  `p90_intvty`, `p90_interactivity`, `metrics.median_intvty`,
  `metrics.p90_intvty`, `metrics.p90_interactivity`, `tok/s/user`
- Throughput: `Throughput/GPU`, `Throughput/GPU (tok/s/gpu)`,
  `throughput`, `tok/s/gpu`
- TTFT: `TTFT`, `TTFT (s)`, `Time To First Token`,
  `Time To First Token (s)`, `P90 TTFT`, `P90 Time To First Token`,
  `median_ttft`, `p90_ttft`, `metrics.median_ttft`, `metrics.p90_ttft`
- End-to-end: `End-to-end`, `End-to-end (s)`, `End-to-end Latency`,
  `End-to-end Latency (s)`, `endToEnd`, `end_to_end`, `E2E`, `E2E Latency`,
  `e2el`, `median_e2el`, `p90_e2el`, `p90_end_to_end`,
  `P90 End-to-end Latency`, `metrics.median_e2el`, `metrics.p90_e2el`
- Normalized E2E: `Normalized E2E`, `Normalized E2E (s)`,
  `Normalized E2E @ 400 output tokens`,
  `Normalized E2E @ 400 output tokens (s)`, `P90 Normalized E2E`,
  `P90 Normalized E2E @ 400 output tokens`,
  `P90 Normalized E2E @ 400 output tokens (s)`,
  `P75 Normalized E2E @ 400 output tokens`,
  `P75 Normalized E2E @ 400 output tokens (s)`, `normalizedEndToEnd`,
  `normalized_end_to_end`, `normalized_e2e`, `normalized_e2e_400_s`,
  `normalized_e2el`, `p90_normalized_e2e_400_s`,
  `p75_normalized_e2e_400_s`, `p90_normalized_e2e`,
  `p90_normalized_e2el`, `metrics.normalized_e2e`,
  `metrics.normalized_e2e_400_s`, `metrics.normalized_e2el`,
  `metrics.p90_normalized_e2e_400_s`,
  `metrics.p75_normalized_e2e_400_s`, `metrics.p90_normalized_e2e`,
  `metrics.p90_normalized_e2el`
- Session time: `Session Time`, `Session Time (min)`,
  `Normalized Session Time`, `Normalized Session Time (min)`,
  `Mean Normalized Session Time`, `Mean Normalized Session Time (min)`,
  `sessionTime`, `session_time`, `session_time_min`,
  `normalized_session_time`, `normalized_session_time_min`,
  `mean_normalized_session_time`, `mean_normalized_session_time_min`,
  `stime`, `metrics.session_time`, `metrics.session_time_min`,
  `metrics.normalized_session_time`, `metrics.normalized_session_time_min`,
  `metrics.mean_normalized_session_time`,
  `metrics.mean_normalized_session_time_min`. Second-based aliases such as
  `Session Time (s)`, `normalized_session_time_s`, and
  `metrics.normalized_session_time_s` are accepted and converted to minutes.
- Prefill TPS/user: `Prefill TPS/user`, `Prefill TPS / user`,
  `Prefill TPS per user`, `Prefill TPS per user (tok/s/user)`,
  `Prefill TPS per user (tok/s)`, `P90 Prefill TPS / user`,
  `P90 Prefill TPS per user`, `P90 Prefill TPS per user (tok/s)`,
  `prefillTpsPerUser`, `prefill_tps_per_user`, `prefill_tps_user`,
  `p90_prefill_tps_per_user`, `metrics.prefill_tps_per_user`,
  `metrics.p90_prefill_tps_per_user`
- Point metadata: `shape`, `Marker`, `Point Marker`; snake_case point keys such
  as `num_prefill_gpu`, `decode_tp`, and `prefill_dp_attention`; display labels
  such as `Prefill GPUs`, `Decode TP`, `Prefill Workers`, `DPA`, `Disagg`,
  `Multi-node`, and `KV Offload`

## Example

```csv
Line ID,Line Name,Title,Model,Scenario,Precision,MTP,HW Key,Color Mode,Resolved Color,Line Type,Line Marker,Layer,Included in Chart,Active Line,Point Index,Roofline Point,Point Marker,Interactivity (tok/s/user),Throughput/GPU (tok/s/gpu),TTFT (s),End-to-end (s),P90 Normalized E2E @ 400 output tokens (s),Session Time (min),P90 Prefill TPS/user,Prefill GPUs,Decode GPUs,Total GPUs,Prefill TP,Prefill EP,Prefill DPA,Prefill Workers,Decode TP,Decode EP,Decode DPA,Decode Workers,DPA,Disagg,Multi-node,KV Offload,Concurrency,Strategy,Note
dsr1-8192-fp8-b200-trt,B200 TRT,DeepSeek R1 B200 TRT,DeepSeek-R1-0528,ISL 8192 / OSL 1024,fp8,Non-MTP,,Auto,,solid,precision,1,,,,,,8.42,5220.5,0.12,9.04,,,,4,8,,4,4,true,,8,8,true,,true,true,false,,1024,,run 123
dsr1-agentic-fp8-b200-trt,B200 TRT Agentic,DeepSeek R1 B200 TRT agentic traces,DeepSeek-R1-0528,Agentic Traces,fp8,Non-MTP,,Auto,,solid,precision,2,,,,,,,4830.2,0.18,37.4,31.073,74.2,168.5,4,8,,4,4,true,,8,8,true,,true,true,false,KV offload off,64,,agentic preview
```

## Raw Benchmark CSV Fallback

Raw benchmark CSV is supported only as a fallback. If no row has `Line ID`,
the importer groups rows by parsed model, scenario, precision,
MTP/spec, hardware, and framework. KV/offload mode is kept as `KV Offload`
point metadata; it does not split rows into separate lines.

Each raw benchmark row must have a numeric throughput column and at least one
numeric X-axis metric column. Accepted aliases include:

- Interactivity: `metrics.median_intvty`, `metrics.interactivity`,
  `metrics.p90_intvty`, `metrics.p90_interactivity`, `median_intvty`,
  `median_interactivity`, `p90_intvty`, `p90_interactivity`,
  `interactivity`, `P90 Interactivity`, `tok/s/user`, `x`
- Nested agentic interactivity: `request_metrics.latency.intvty.p90` for
  agentic rows, with `request_metrics.latency.intvty.p50` as the median
  fallback when the row is not identified as agentic
- Throughput: `metrics.tput_per_gpu`, `tput_per_gpu`, `throughput_per_gpu`,
  `token throughput per gpu`, `token throughput per gpu (tok/s/gpu)`,
  `throughput`, `Throughput/GPU`, `Throughput/GPU (tok/s/gpu)`, `tok/s/gpu`,
  `y`, `request_metrics.throughput.per_gpu.total_tput_tps`
- TTFT: `metrics.median_ttft`, `metrics.p90_ttft`, `median_ttft`,
  `p90_ttft`, `ttft`, `TTFT`, `TTFT (s)`, `Time To First Token`,
  `Time To First Token (s)`, `P90 TTFT`, `P90 Time To First Token`,
  `request_metrics.latency.ttft.p50`, `request_metrics.latency.ttft.p90`
- End-to-end: `metrics.median_e2el`, `metrics.p90_e2el`,
  `metrics.p90_end_to_end`, `median_e2el`, `p90_e2el`, `p90_end_to_end`,
  `endToEnd`, `end_to_end`, `end-to-end`, `End-to-end (s)`,
  `End-to-end Latency`, `E2E`, `E2E Latency`, `e2el`,
  `P90 End-to-end Latency`, `request_metrics.latency.e2el.p50`,
  `request_metrics.latency.e2el.p90`
- Normalized E2E: `metrics.normalized_e2e`, `metrics.normalized_e2el`,
  `metrics.p90_normalized_e2e`, `metrics.p90_normalized_e2el`,
  `normalizedEndToEnd`, `normalized_end_to_end`, `normalized_e2e`,
  `normalized_e2el`, `p90_normalized_e2e`, `p90_normalized_e2el`,
  `Normalized E2E`, `Normalized E2E (s)`,
  `Normalized E2E @ 400 output tokens`,
  `P90 Normalized E2E @ 400 output tokens`,
  `metrics.p90_normalized_e2e_400_s`,
  `metrics.p75_normalized_e2e_400_s`, `p90_normalized_e2e_400_s`,
  `p75_normalized_e2e_400_s`
- Session time: `metrics.session_time`, `metrics.normalized_session_time`,
  `metrics.mean_normalized_session_time`, `sessionTime`, `session_time`,
  `normalized_session_time`, `mean_normalized_session_time`, `Session Time`,
  `Normalized Session Time`, `Mean Normalized Session Time`, `stime`.
  Second-based raw aliases such as `metrics.normalized_session_time_s`,
  `normalized_session_time_s`, `metrics.session_time_s`, and
  `Session Time (s)` are accepted and converted to minutes.
- Prefill TPS/user: `metrics.prefill_tps_per_user`,
  `metrics.p90_prefill_tps_per_user`, `prefillTpsPerUser`,
  `prefill_tps_per_user`, `prefill_tps_user`, `p90_prefill_tps_per_user`,
  `Prefill TPS/user`, `Prefill TPS / user`, `Prefill TPS per user`,
  `P90 Prefill TPS / user`, `P90 Prefill TPS per user`,
  `P90 Prefill TPS per user (tok/s)`

Optional raw benchmark aliases include:

- Model: `infmax_model_prefix`, `model_prefix`, `model_key`, `db_model`,
  `model`, `model_name`
- Hardware: `hardware`, `hw_key`, `hwKey`, `hw`, `gpu`, `accelerator`
- Framework: `framework`, `backend`, `runtime`
- MTP/spec: `mtp`, `spec_method`, `spec_decoding`, `speculation`
- Precision: `precision`, `dtype`, `quantization`
- Lengths: `isl`, `input_len`, `input_length`, `input sequence length`,
  `input_tokens`; `osl`, `output_len`, `output_length`,
  `output sequence length`, `output_tokens`
- Scenario/workload: `scenario`, `benchmark_scenario`, `benchmark scenario`,
  `benchmark type`, `benchmark_type`, `workload`, `workload_type`,
  `workload type`, `trace`, `trace_type`, `trace type`, `dataset`, `task`
- Offload: `offload_mode`, `kv_offloading`, and `kv_offload_backend`
  (top-level or under `metrics`). For example, agentic traces may import
  `benchmark_type=agentic_traces`, `offload_mode=on`, `kv_offloading=dram`,
  and `kv_offload_backend=lmcache`; the importer keeps that label on the
  point's `KV Offload` metadata while merging it into the same line as
  non-offload rows. Object-shaped backends such as
  `kv_offload_backend.name=hicache` are also supported.
- Parallelism/source: `num_prefill_gpu`, `num_decode_gpu`, `prefill_tp`,
  `prefill_ep`, `prefill_num_workers`, `decode_tp`, `decode_ep`,
  `decode_num_workers`, `dp_attention`, `prefill_dp_attention`,
  `decode_dp_attention`, `disagg`, `is_multinode`, `multi_node`, `multinode`,
  `conc`, `concurrency`, `batch_size`, `date`, `created_at`, `run_date`,
  `timestamp`

In raw benchmark CSV, optional metadata may be empty. Agentic scenario/workload
values such as `agentic_traces` become `Agentic Traces`. Fixed-run values such
as `single_turn` do not replace sequence lengths: `isl` and `osl` are used when
available, preserving `ISL 8192 / OSL 1024` and `ISL 1024 / OSL 1024`. Missing
hardware/framework becomes `unknown`, missing precision becomes `default`,
missing scenario becomes `Default Scenario`, and missing spec/MTP becomes
`Non-MTP`.
