import type { InferenceCurveSeries } from './inferenceCurveChart';

// Generated from the public InferenceX benchmark and derived Agentic metrics APIs on 2026-09-20.
// DeepSeek-V4-Pro / Agentic Traces / FP4 / MI355X / MoRI SGLang, curve snapshot 2026-09-17.
export const exampleSeries: InferenceCurveSeries[] = [
  {
    id: 'deepseek-v4-pro-agentic-traces-fp4-mi355x-mori-sglang',
    name: 'MI355X (MoRI SGLang)',
    hwKey: 'mi355x_mori-sglang',
    model: 'DeepSeek-V4-Pro',
    islOsl: 'Agentic Traces',
    precision: 'fp4',
    title: 'DeepSeek-V4-Pro Agentic Traces FP4 MI355X (MoRI SGLang)',
    points: [
      {
        throughput: 47924.43453,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 16,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 256,
        label: 'date 2026-09-17; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/35166686551/attempts/3; KV offload DRAM via UMBP LINKER',
        interactivity: 44.62293618920125,
        interactivityPercentiles: {
          p50: 52.938062466913706,
          p75: 47.34848484848485,
          p90: 44.62293618920125,
          p95: 43.29004329004329
        },
        ttft: 23.04924,
        ttftPercentiles: {
          p50: 6.53558,
          p75: 11.82221,
          p90: 23.04924,
          p95: 31.97782
        },
        endToEnd: 65.16591,
        endToEndPercentiles: {
          p50: 17.74548,
          p75: 33.57161,
          p90: 65.16591,
          p95: 99.14725
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 16.74821276820019,
          p90: 8.773550094812244
        },
        prefill_tp: 8,
        prefill_ep: 1,
        prefill_dcp_size: 1,
        decode_tp: 8,
        decode_ep: 1,
        decode_dcp_size: 1,
        num_prefill_gpu: 8,
        num_decode_gpu: 8,
        prefill_dp_attention: true,
        decode_dp_attention: true,
        dp_attention: true,
        kv_offload: 'KV offload DRAM via UMBP LINKER',
        server_gpu_cache_hit_rate: 0.9314512596736743,
        server_external_cache_hit_rate: 0.00641,
        server_cpu_cache_hit_rate: 0.006194854856120786,
        theoretical_cache_hit_rate: 0.96736,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 44799.05439,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 16,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 192,
        label: 'date 2026-09-17; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/35166686551/attempts/3; KV offload DRAM via UMBP LINKER',
        interactivity: 53.561863952865565,
        interactivityPercentiles: {
          p50: 62.11180124223603,
          p75: 56.94760820045558,
          p90: 53.561863952865565,
          p95: 51.57297576070139
        },
        ttft: 13.61851,
        ttftPercentiles: {
          p50: 4.66442,
          p75: 6.99433,
          p90: 13.61851,
          p95: 20.45365
        },
        endToEnd: 49.60834,
        endToEndPercentiles: {
          p50: 13.14156,
          p75: 25.01516,
          p90: 49.60834,
          p95: 79.32168
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 23.760490039890524,
          p90: 13.93344526961208
        },
        prefill_tp: 8,
        prefill_ep: 1,
        prefill_dcp_size: 1,
        decode_tp: 8,
        decode_ep: 1,
        decode_dcp_size: 1,
        num_prefill_gpu: 8,
        num_decode_gpu: 8,
        prefill_dp_attention: true,
        decode_dp_attention: true,
        dp_attention: true,
        kv_offload: 'KV offload DRAM via UMBP LINKER',
        server_gpu_cache_hit_rate: 0.9439648067635614,
        server_external_cache_hit_rate: 0.00523,
        server_cpu_cache_hit_rate: 0.005003975768959658,
        theoretical_cache_hit_rate: 0.96849,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 31797.52392,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 16,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 128,
        label: 'date 2026-09-17; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/35166686551/attempts/3; KV offload DRAM via UMBP LINKER',
        interactivity: 62.853551225644246,
        interactivityPercentiles: {
          p50: 73.85524372230428,
          p75: 67.47638326585695,
          p90: 62.853551225644246,
          p95: 60.06006006006005
        },
        ttft: 7.56227,
        ttftPercentiles: {
          p50: 3.29734,
          p75: 4.75832,
          p90: 7.56227,
          p95: 11.62464
        },
        endToEnd: 38.76685,
        endToEndPercentiles: {
          p50: 10.43318,
          p75: 20.18408,
          p90: 38.76685,
          p95: 61.88653
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 33.510803530830614,
          p90: 21.03755207570204
        },
        prefill_tp: 8,
        prefill_ep: 1,
        prefill_dcp_size: 1,
        decode_tp: 8,
        decode_ep: 1,
        decode_dcp_size: 1,
        num_prefill_gpu: 8,
        num_decode_gpu: 8,
        prefill_dp_attention: true,
        decode_dp_attention: true,
        dp_attention: true,
        kv_offload: 'KV offload DRAM via UMBP LINKER',
        server_gpu_cache_hit_rate: 0.9375265583115847,
        server_external_cache_hit_rate: 0.00491,
        server_cpu_cache_hit_rate: 0.005234813616435615,
        theoretical_cache_hit_rate: 0.96652,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 16656.75171,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 16,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 48,
        label: 'date 2026-09-17; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/35166686551/attempts/3; KV offload DRAM via HICACHE',
        interactivity: 95.23809523809523,
        interactivityPercentiles: {
          p50: 113.76564277588169,
          p75: 103.19917440660474,
          p90: 95.23809523809523,
          p95: 89.92805755395683
        },
        ttft: 3.28382,
        ttftPercentiles: {
          p50: 0.83227,
          p75: 1.71349,
          p90: 3.28382,
          p95: 5.00995
        },
        endToEnd: 23.28125,
        endToEndPercentiles: {
          p50: 5.28274,
          p75: 11.18004,
          p90: 23.28125,
          p95: 37.66681
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 69.84672785029414,
          p90: 43.25018496508166
        },
        prefill_tp: 8,
        prefill_ep: 1,
        prefill_dcp_size: 1,
        decode_tp: 8,
        decode_ep: 1,
        decode_dcp_size: 1,
        num_prefill_gpu: 8,
        num_decode_gpu: 8,
        prefill_dp_attention: false,
        decode_dp_attention: false,
        dp_attention: false,
        kv_offload: 'KV offload DRAM via HICACHE',
        server_gpu_cache_hit_rate: 0.9582890536420801,
        server_external_cache_hit_rate: 0.00207,
        server_cpu_cache_hit_rate: 0.0018512211640852227,
        theoretical_cache_hit_rate: 0.9751,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 11987.65247,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 16,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 32,
        label: 'date 2026-09-17; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/35166686551/attempts/3; KV offload DRAM via HICACHE',
        interactivity: 114.81056257175659,
        interactivityPercentiles: {
          p50: 144.0922190201729,
          p75: 129.87012987012986,
          p90: 114.81056257175659,
          p95: 107.64262648008612
        },
        ttft: 2.80133,
        ttftPercentiles: {
          p50: 0.90893,
          p75: 1.63762,
          p90: 2.80133,
          p95: 4.23103
        },
        endToEnd: 20.75896,
        endToEndPercentiles: {
          p50: 4.36216,
          p75: 9.87106,
          p90: 20.75896,
          p95: 32.27382
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 75.81187083950024,
          p90: 47.882868058730836
        },
        prefill_tp: 8,
        prefill_ep: 1,
        prefill_dcp_size: 1,
        decode_tp: 8,
        decode_ep: 1,
        decode_dcp_size: 1,
        num_prefill_gpu: 8,
        num_decode_gpu: 8,
        prefill_dp_attention: false,
        decode_dp_attention: false,
        dp_attention: false,
        kv_offload: 'KV offload DRAM via HICACHE',
        server_gpu_cache_hit_rate: 0.9638915216484829,
        server_external_cache_hit_rate: 0.00056,
        server_cpu_cache_hit_rate: 0.0005840314897016772,
        theoretical_cache_hit_rate: 0.97871,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 6049.63977,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 16,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 16,
        label: 'date 2026-09-17; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/35166686551/attempts/3; KV offload off',
        interactivity: 146.19883040935673,
        interactivityPercentiles: {
          p50: 165.8374792703151,
          p75: 155.52099533437013,
          p90: 146.19883040935673,
          p95: 140.4494382022472
        },
        ttft: 2.18793,
        ttftPercentiles: {
          p50: 0.63856,
          p75: 1.21609,
          p90: 2.18793,
          p95: 2.92534
        },
        endToEnd: 15.61148,
        endToEndPercentiles: {
          p50: 3.16633,
          p75: 6.49824,
          p90: 15.61148,
          p95: 26.78585
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 94.24700449025285,
          p90: 62.39708459863074
        },
        prefill_tp: 8,
        prefill_ep: 1,
        prefill_dcp_size: 1,
        decode_tp: 8,
        decode_ep: 1,
        decode_dcp_size: 1,
        num_prefill_gpu: 8,
        num_decode_gpu: 8,
        prefill_dp_attention: false,
        decode_dp_attention: false,
        dp_attention: false,
        kv_offload: 'KV offload off',
        server_gpu_cache_hit_rate: 0.9577351509047981,
        theoretical_cache_hit_rate: 0.97444,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 3037.25425,
        precision: 'fp4',
        strategy: 'TP4/EP1',
        tp: 8,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 4,
        label: 'date 2026-09-17; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/35166686551/attempts/3; KV offload off',
        interactivity: 156.98587127158555,
        interactivityPercentiles: {
          p50: 177.61989342806396,
          p75: 169.2047377326565,
          p90: 156.98587127158555,
          p95: 149.2537313432836
        },
        ttft: 2.1519,
        ttftPercentiles: {
          p50: 0.91778,
          p75: 1.56209,
          p90: 2.1519,
          p95: 2.77615
        },
        endToEnd: 23.90213,
        endToEndPercentiles: {
          p50: 3.31949,
          p75: 9.86343,
          p90: 23.90213,
          p95: 32.74387
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 85.62915112903465,
          p90: 55.70317035907303
        },
        prefill_tp: 4,
        prefill_ep: 1,
        prefill_dcp_size: 1,
        decode_tp: 4,
        decode_ep: 1,
        decode_dcp_size: 1,
        num_prefill_gpu: 4,
        num_decode_gpu: 4,
        prefill_dp_attention: false,
        decode_dp_attention: false,
        dp_attention: false,
        kv_offload: 'KV offload off',
        server_gpu_cache_hit_rate: 0.9545977120056928,
        theoretical_cache_hit_rate: 0.9762,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      }
    ]
  }
];
