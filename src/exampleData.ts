import type { InferenceCurveSeries } from './inferenceCurveChart';

// Generated from the public InferenceX benchmark and derived Agentic metrics APIs on 2026-10-26 (Asia/Shanghai).
// DeepSeek-V4-Pro / Agentic Traces / FP4: MI355X / MoRI SGLang and B200 / Dynamo SGLang.
// Both curves use the 2026-10-21 snapshot selected by the live sync client.
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
        throughput: 83684.23504,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 16,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 512,
        label: 'date 2026-10-21; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/39588593657/attempts/1; KV offload DRAM via UMBP LINKER',
        interactivity: 51.78663904712584,
        interactivityPercentiles: {
          p50: 61.919504643962846,
          p75: 55.12679162072767,
          p90: 51.78663904712584,
          p95: 50.607287449392715
        },
        ttft: 56.33497,
        ttftPercentiles: {
          p50: 13.859,
          p75: 29.70088,
          p90: 56.33497,
          p95: 81.10357
        },
        endToEnd: 91.34777,
        endToEndPercentiles: {
          p50: 27.55531,
          p75: 50.34274,
          p90: 91.34777,
          p95: 123.99945
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 9.60868976950387,
          p90: 4.008385698039321
        },
        prefill_tp: 8,
        prefill_ep: 8,
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
        server_gpu_cache_hit_rate: 0.9324369430343117,
        server_external_cache_hit_rate: 0.00914,
        server_cpu_cache_hit_rate: 0.00895653473222096,
        theoretical_cache_hit_rate: 0.96577,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 77546.66844,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 16,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 384,
        label: 'date 2026-10-21; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/39588593657/attempts/1; KV offload DRAM via UMBP LINKER',
        interactivity: 58.892815076560666,
        interactivityPercentiles: {
          p50: 69.44444444444444,
          p75: 62.38303181534623,
          p90: 58.892815076560666,
          p95: 57.37234652897303
        },
        ttft: 30.64768,
        ttftPercentiles: {
          p50: 8.21491,
          p75: 17.24203,
          p90: 30.64768,
          p95: 42.85929
        },
        endToEnd: 62.25521,
        endToEndPercentiles: {
          p50: 19.08176,
          p75: 35.10955,
          p90: 62.25521,
          p95: 88.65847
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 15.478894427074666,
          p90: 7.005425323635716
        },
        prefill_tp: 8,
        prefill_ep: 8,
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
        server_gpu_cache_hit_rate: 0.9401787276562512,
        server_external_cache_hit_rate: 0.0062,
        server_cpu_cache_hit_rate: 0.006461054351445491,
        theoretical_cache_hit_rate: 0.96663,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 64871.43419,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 16,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 256,
        label: 'date 2026-10-21; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/39588593657/attempts/1; KV offload DRAM via UMBP LINKER',
        interactivity: 70.62146892655367,
        interactivityPercentiles: {
          p50: 84.53085376162299,
          p75: 74.73841554559044,
          p90: 70.62146892655367,
          p95: 69.15629322268326
        },
        ttft: 14.83275,
        ttftPercentiles: {
          p50: 4.49067,
          p75: 7.33729,
          p90: 14.83275,
          p95: 21.06639
        },
        endToEnd: 42.86789,
        endToEndPercentiles: {
          p50: 11.74893,
          p75: 22.21505,
          p90: 42.86789,
          p95: 64.82099
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 25.46770474610618,
          p90: 14.150107419471812
        },
        prefill_tp: 8,
        prefill_ep: 8,
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
        server_gpu_cache_hit_rate: 0.9461555955101013,
        server_external_cache_hit_rate: 0.00521,
        server_cpu_cache_hit_rate: 0.005632596882997708,
        theoretical_cache_hit_rate: 0.96964,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 52085.26629,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 16,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 192,
        label: 'date 2026-10-21; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/39588593657/attempts/1; KV offload DRAM via UMBP LINKER',
        interactivity: 80.25682182985554,
        interactivityPercentiles: {
          p50: 94.6969696969697,
          p75: 84.31703204047217,
          p90: 80.25682182985554,
          p95: 78.36990595611285
        },
        ttft: 10.48633,
        ttftPercentiles: {
          p50: 3.92407,
          p75: 5.50451,
          p90: 10.48633,
          p95: 15.60484
        },
        endToEnd: 37.80455,
        endToEndPercentiles: {
          p50: 9.86806,
          p75: 18.8347,
          p90: 37.80455,
          p95: 59.08538
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 31.174473999708404,
          p90: 19.114748899747344
        },
        prefill_tp: 8,
        prefill_ep: 8,
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
        server_gpu_cache_hit_rate: 0.946642035573578,
        server_external_cache_hit_rate: 0.00498,
        server_cpu_cache_hit_rate: 0.005291792038796316,
        theoretical_cache_hit_rate: 0.96938,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 22620.31493,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 12,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 48,
        label: 'date 2026-10-21; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/39588593657/attempts/1; KV offload DRAM via UMBP LINKER',
        interactivity: 114.5475372279496,
        interactivityPercentiles: {
          p50: 135.13513513513513,
          p75: 122.85012285012286,
          p90: 114.5475372279496,
          p95: 109.64912280701755
        },
        ttft: 5.52428,
        ttftPercentiles: {
          p50: 1.30973,
          p75: 2.62989,
          p90: 5.52428,
          p95: 8.3898
        },
        endToEnd: 23.0218,
        endToEndPercentiles: {
          p50: 5.4824,
          p75: 11.10813,
          p90: 23.0218,
          p95: 34.03053
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 64.79321491265952,
          p90: 35.70962456661281
        },
        prefill_tp: 4,
        prefill_ep: 1,
        prefill_dcp_size: 1,
        decode_tp: 8,
        decode_ep: 1,
        decode_dcp_size: 1,
        num_prefill_gpu: 4,
        num_decode_gpu: 8,
        prefill_dp_attention: false,
        decode_dp_attention: false,
        dp_attention: false,
        kv_offload: 'KV offload DRAM via UMBP LINKER',
        server_gpu_cache_hit_rate: 0.30822418689305436,
        server_external_cache_hit_rate: 0.63145,
        server_cpu_cache_hit_rate: 0.6516305343223924,
        theoretical_cache_hit_rate: 0.97514,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 16967.12396,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 12,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 32,
        label: 'date 2026-10-21; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/39588593657/attempts/1; KV offload DRAM via UMBP LINKER',
        interactivity: 144.0922190201729,
        interactivityPercentiles: {
          p50: 180.50541516245488,
          p75: 161.55088852988692,
          p90: 144.0922190201729,
          p95: 132.1003963011889
        },
        ttft: 5.07656,
        ttftPercentiles: {
          p50: 1.64151,
          p75: 3.2381,
          p90: 5.07656,
          p95: 7.37483
        },
        endToEnd: 18.76277,
        endToEndPercentiles: {
          p50: 4.86208,
          p75: 9.54044,
          p90: 18.76277,
          p95: 28.17393
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 63.774095145748866,
          p90: 34.17685584135359
        },
        prefill_tp: 4,
        prefill_ep: 1,
        prefill_dcp_size: 1,
        decode_tp: 8,
        decode_ep: 1,
        decode_dcp_size: 1,
        num_prefill_gpu: 4,
        num_decode_gpu: 8,
        prefill_dp_attention: false,
        decode_dp_attention: false,
        dp_attention: false,
        kv_offload: 'KV offload DRAM via UMBP LINKER',
        server_gpu_cache_hit_rate: 0.36684496242373515,
        server_external_cache_hit_rate: 0.57677,
        server_cpu_cache_hit_rate: 0.5973320569413685,
        theoretical_cache_hit_rate: 0.97886,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 8772.89118,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 12,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 16,
        label: 'date 2026-10-21; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/39588593657/attempts/1; KV offload DRAM via UMBP LINKER',
        interactivity: 175.43859649122805,
        interactivityPercentiles: {
          p50: 211.41649048625794,
          p75: 191.20458891013382,
          p90: 175.43859649122805,
          p95: 166.66666666666666
        },
        ttft: 2.37294,
        ttftPercentiles: {
          p50: 0.75816,
          p75: 1.40016,
          p90: 2.37294,
          p95: 3.39358
        },
        endToEnd: 13.32456,
        endToEndPercentiles: {
          p50: 2.90646,
          p75: 5.78501,
          p90: 13.32456,
          p95: 21.20387
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 99.15330122619109,
          p90: 61.701271048525484
        },
        prefill_tp: 4,
        prefill_ep: 1,
        prefill_dcp_size: 1,
        decode_tp: 8,
        decode_ep: 1,
        decode_dcp_size: 1,
        num_prefill_gpu: 4,
        num_decode_gpu: 8,
        prefill_dp_attention: false,
        decode_dp_attention: false,
        dp_attention: false,
        kv_offload: 'KV offload DRAM via UMBP LINKER',
        server_gpu_cache_hit_rate: 0.8596485310938641,
        server_external_cache_hit_rate: 0.06488,
        server_cpu_cache_hit_rate: 0.10079491919020074,
        theoretical_cache_hit_rate: 0.97597,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 2045.81198,
        precision: 'fp4',
        strategy: 'TP4/EP1',
        tp: 8,
        disagg: true,
        spec_decoding: 'draft_model',
        concurrency: 1,
        label: 'date 2026-10-21; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/39588593657/attempts/1; KV offload DRAM via UMBP LINKER',
        interactivity: 220.7505518763797,
        interactivityPercentiles: {
          p50: 238.6634844868735,
          p75: 235.2941176470588,
          p90: 220.7505518763797,
          p95: 214.59227467811158
        },
        ttft: 2.31443,
        ttftPercentiles: {
          p50: 1.1536,
          p75: 1.53107,
          p90: 2.31443,
          p95: 2.76916
        },
        endToEnd: 21.77204,
        endToEndPercentiles: {
          p50: 4.53037,
          p75: 12.42968,
          p90: 21.77204,
          p95: 29.82404
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 121.96284765753882,
          p90: 63.0320185402806
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
        kv_offload: 'KV offload DRAM via UMBP LINKER',
        server_gpu_cache_hit_rate: 0.9652241475046569,
        server_external_cache_hit_rate: 0.00008,
        server_cpu_cache_hit_rate: 0.00007441560546651572,
        theoretical_cache_hit_rate: 0.97753,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      }
    ]
  },
  {
    id: 'deepseek-v4-pro-agentic-traces-fp4-b200-dynamo-sglang',
    name: 'B200 (Dynamo SGLang)',
    hwKey: 'b200_dynamo-sglang',
    model: 'DeepSeek-V4-Pro',
    islOsl: 'Agentic Traces',
    precision: 'fp4',
    title: 'DeepSeek-V4-Pro Agentic Traces FP4 B200 (Dynamo SGLang)',
    points: [
      {
        throughput: 6783.22742,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 8,
        disagg: false,
        spec_decoding: 'mtp',
        concurrency: 8,
        label: 'date 2026-10-21; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/38960572895/attempts/1; KV offload DRAM via HICACHE',
        interactivity: 169.2047377326565,
        interactivityPercentiles: {
          p50: 239.8081534772182,
          p75: 203.66598778004072,
          p90: 169.2047377326565,
          p95: 138.69625520110955
        },
        ttft: 1.22958,
        ttftPercentiles: {
          p50: 0.53817,
          p75: 0.73976,
          p90: 1.22958,
          p95: 1.97137
        },
        endToEnd: 12.94948,
        endToEndPercentiles: {
          p50: 2.74764,
          p75: 5.75072,
          p90: 12.94948,
          p95: 19.67398
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 128.6325887481712,
          p90: 93.05246734397626
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
        server_gpu_cache_hit_rate: 0.9606131614856004,
        server_external_cache_hit_rate: 0,
        server_cpu_cache_hit_rate: 0,
        theoretical_cache_hit_rate: 0.97719,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 4024.92872,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 8,
        disagg: false,
        spec_decoding: 'mtp',
        concurrency: 4,
        label: 'date 2026-10-21; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/38960572895/attempts/1; KV offload DRAM via HICACHE',
        interactivity: 229.8850574712644,
        interactivityPercentiles: {
          p50: 297.6190476190476,
          p75: 268.81720430107526,
          p90: 229.8850574712644,
          p95: 194.17475728155338
        },
        ttft: 1.73056,
        ttftPercentiles: {
          p50: 0.48075,
          p75: 0.75218,
          p90: 1.73056,
          p95: 2.36308
        },
        endToEnd: 14.0585,
        endToEndPercentiles: {
          p50: 2.34238,
          p75: 6.30822,
          p90: 14.0585,
          p95: 20.76851
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 142.874361704737,
          p90: 94.64245476364276
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
        server_gpu_cache_hit_rate: 0.9616258355820905,
        theoretical_cache_hit_rate: 0.97916,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      },
      {
        throughput: 2476.81546,
        precision: 'fp4',
        strategy: 'TP8/EP1',
        tp: 8,
        disagg: false,
        spec_decoding: 'mtp',
        concurrency: 1,
        label: 'date 2026-10-21; run_url https://github.com/SemiAnalysisAI/InferenceX/actions/runs/38960572895/attempts/1; KV offload DRAM via HICACHE',
        interactivity: 284.9002849002849,
        interactivityPercentiles: {
          p50: 316.4556962025316,
          p75: 310.5590062111801,
          p90: 284.9002849002849,
          p95: 243.30900243309003
        },
        ttft: 2.07938,
        ttftPercentiles: {
          p50: 0.68404,
          p75: 0.99093,
          p90: 2.07938,
          p95: 2.6002
        },
        endToEnd: 17.46626,
        endToEndPercentiles: {
          p50: 3.93913,
          p75: 9.57337,
          p90: 17.46626,
          p95: 22.72802
        },
        e2eNormalizedInteractivityPercentiles: {
          p75: 176.53668671277964,
          p90: 92.90582127146249
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
        server_gpu_cache_hit_rate: 0.9800281519131665,
        theoretical_cache_hit_rate: 0.98057,
        prefill_num_workers: 1,
        decode_num_workers: 1,
        is_multinode: true
      }
    ]
  }
];
