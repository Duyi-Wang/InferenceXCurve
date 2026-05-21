import type { InferenceCurveSeries } from './inferenceCurveChart';

// Example snapshot generated from the InferenceX current benchmark API on 2026-05-20.
export const exampleSeries: InferenceCurveSeries[] = [
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp4-mi355x-mori-sglang',
    name: 'MI355X (MoRI SGLang)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP4 MI355X (MoRI SGLang)',
    points: [
      {
        interactivity: 11.750194,
        throughput: 7397.057144,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 4096,
        label: 'date 2026-05-07; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 15.508027,
        throughput: 4893.401868,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-05-07; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 17.027693,
        throughput: 2717.849652,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-05-07; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 35.571531,
        throughput: 1423.624685,
        strategy: 'TP1/EP8',
        precision: 'fp4',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 35.694695,
        throughput: 1387.783842,
        strategy: 'TP1/EP8',
        precision: 'fp4',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 42.951509,
        throughput: 845.073611,
        strategy: 'TP1/EP8',
        precision: 'fp4',
        tp: 1,
        concurrency: 256,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 52.578061,
        throughput: 521.543503,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 57.474969,
        throughput: 1314.504012,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 58.221779,
        throughput: 1104.656888,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 66.019601,
        throughput: 325.383261,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 71.740059,
        throughput: 699.479768,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 72.114209,
        throughput: 64.427255,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 75.525407,
        throughput: 189.210008,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 87.042138,
        throughput: 486.331302,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 87.160489,
        throughput: 401.171482,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 105.502944,
        throughput: 255.932475,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 116.953561,
        throughput: 146.395901,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 118.675692,
        throughput: 111.250992,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 131.54755,
        throughput: 81.156893,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 137.279792,
        throughput: 64.764849,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 139.848803,
        throughput: 45.247947,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 146.344007,
        throughput: 22.303022,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 146.410382,
        throughput: 35.034992,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 158.361973,
        throughput: 18.648834,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp4-mi355x-mori-sglang-mtp',
    name: 'MI355X (MoRI SGLang MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP4 MI355X (MoRI SGLang MTP)',
    points: [
      {
        interactivity: 13.439235,
        throughput: 8100.947375,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 4096,
        label: 'date 2026-05-07; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 19.826513,
        throughput: 5898.510234,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-05-07; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 25.839971,
        throughput: 3755.069627,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-05-07; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 44.312296,
        throughput: 1474.915103,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp4',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 45.185609,
        throughput: 1444.3209,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp4',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 64.544405,
        throughput: 1192.974066,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp4',
        tp: 1,
        concurrency: 256,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 77.374162,
        throughput: 1770.152277,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 82.66002,
        throughput: 778.811204,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 90.339933,
        throughput: 108.918916,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 91.583514,
        throughput: 912.623731,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 91.623184,
        throughput: 1071.640852,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 100.143205,
        throughput: 468.7972,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 115.796456,
        throughput: 675.729789,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 119.388072,
        throughput: 283.262055,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 126.035711,
        throughput: 560.795453,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 138.75459,
        throughput: 345.671997,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 163.821619,
        throughput: 210.618969,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 168.12669,
        throughput: 158.381314,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 190.95169,
        throughput: 119.641197,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 198.420249,
        throughput: 97.727576,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 212.211453,
        throughput: 51.066223,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 218.123246,
        throughput: 70.17507,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 231.243365,
        throughput: 34.877008,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 242.682737,
        throughput: 28.30639,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp4-b200-dynamo-trt',
    name: 'B200 (Dynamo TRT)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP4 B200 (Dynamo TRT)',
    points: [
      {
        interactivity: 21.61574,
        throughput: 13067.325965,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 4096,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 41.635739,
        throughput: 7736.744783,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 2192,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 16; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 50.916099,
        throughput: 2718.195948,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 1365,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 71.847656,
        throughput: 1008.829478,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 450,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 48; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 90.590691,
        throughput: 625.213283,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 180,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 103.713284,
        throughput: 399.149107,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 90,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 126.85065,
        throughput: 242.715641,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 45,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 139.539589,
        throughput: 148.517615,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 25,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 152.893078,
        throughput: 97.671615,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 15,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 164.306993,
        throughput: 69.367008,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 10,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 182.375851,
        throughput: 30.291443,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 6,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp4-b200-dynamo-trt-mtp',
    name: 'B200 (Dynamo TRT MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP4 B200 (Dynamo TRT MTP)',
    points: [
      {
        interactivity: 21.338126,
        throughput: 12515.699367,
        strategy: 'TP4/EP4 MTP',
        precision: 'fp4',
        tp: 4,
        concurrency: 10860,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 20; prefill GPUs 12; DPA true'
      },
      {
        interactivity: 56.353027,
        throughput: 9660.650202,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 4968,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 32; prefill GPUs 12; DPA true'
      },
      {
        interactivity: 74.040493,
        throughput: 7111.391086,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 1214,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 16; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 101.785998,
        throughput: 2832.91764,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 875,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 126.416238,
        throughput: 897.940704,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 180,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 150.563708,
        throughput: 577.294438,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 90,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 191.179411,
        throughput: 369.940325,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 45,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 224.586421,
        throughput: 242.428767,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 25,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 261.091476,
        throughput: 168.905729,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 15,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 277.385985,
        throughput: 118.747502,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 10,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 309.169949,
        throughput: 49.275708,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 6,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp4-b200-dynamo-sglang',
    name: 'B200 (Dynamo SGLang)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP4 B200 (Dynamo SGLang)',
    points: [
      {
        interactivity: 40.382725,
        throughput: 2478.048204,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 45.712129,
        throughput: 1645.148886,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 16; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 84.294079,
        throughput: 502.209855,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 48; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 92.533388,
        throughput: 344.184164,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 112.48234,
        throughput: 176.295903,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 48; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 126.964608,
        throughput: 107.348564,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 48; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 140.674417,
        throughput: 69.752413,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp4-b200-dynamo-sglang-mtp',
    name: 'B200 (Dynamo SGLang MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP4 B200 (Dynamo SGLang MTP)',
    points: [
      {
        interactivity: 30.568611,
        throughput: 4934.254571,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 48.19106,
        throughput: 3813.831135,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 61.821746,
        throughput: 2830.133691,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 16; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 72.465978,
        throughput: 1516.809289,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 79.187942,
        throughput: 1387.847864,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 48; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 103.720232,
        throughput: 914.926516,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 48; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 156.03368,
        throughput: 346.661502,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 48; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 190.032838,
        throughput: 213.216918,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 48; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 213.375274,
        throughput: 142.96843,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp8-mi355x-mori-sglang',
    name: 'MI355X (MoRI SGLang)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP8 MI355X (MoRI SGLang)',
    points: [
      {
        interactivity: 20.658407,
        throughput: 2069.123067,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 1536,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 20.68341,
        throughput: 1550.379156,
        strategy: 'TP1/EP16',
        precision: 'fp8',
        tp: 1,
        concurrency: 2048,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 21.371723,
        throughput: 1445.186216,
        strategy: 'TP1/EP16',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 21.553038,
        throughput: 2319.529563,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 1536,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 21.706797,
        throughput: 2319.545292,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 1536,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 22.36549,
        throughput: 1811.176997,
        strategy: 'TP1/EP16',
        precision: 'fp8',
        tp: 1,
        concurrency: 2048,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 22.422845,
        throughput: 1694.139193,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 22.919135,
        throughput: 1813.493783,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 24.483575,
        throughput: 1823.168902,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 24.541633,
        throughput: 1677.369938,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 24.891977,
        throughput: 1855.92224,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 26.276571,
        throughput: 1695.502095,
        strategy: 'TP1/EP16',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 29.728312,
        throughput: 1174.376323,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 30.113413,
        throughput: 1168.677464,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 31.405722,
        throughput: 1186.858584,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 34.872229,
        throughput: 691.745323,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 256,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 35.084595,
        throughput: 695.204981,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 256,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 41.342132,
        throughput: 736.503531,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 46.110792,
        throughput: 432.482212,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-06; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 49.596704,
        throughput: 493.246162,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 52.880852,
        throughput: 474.884652,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 54.82043,
        throughput: 261.215867,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-06; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 60.885422,
        throughput: 135.950131,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-06; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 61.722243,
        throughput: 307.48214,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 62.298578,
        throughput: 314.205988,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 74.509997,
        throughput: 184.193409,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 82.36985,
        throughput: 208.284346,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 94.480208,
        throughput: 118.456334,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 104.179124,
        throughput: 129.911825,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 111.617601,
        throughput: 70.558691,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 113.185429,
        throughput: 51.255962,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 114.695791,
        throughput: 72.027381,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 124.374542,
        throughput: 29.995094,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 126.121104,
        throughput: 39.567446,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 128.054449,
        throughput: 40.866874,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 136.71634,
        throughput: 21.394839,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 136.989439,
        throughput: 16.677653,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 142.788038,
        throughput: 23.078682,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp8-mi355x-mori-sglang-mtp',
    name: 'MI355X (MoRI SGLang MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP8 MI355X (MoRI SGLang MTP)',
    points: [
      {
        interactivity: 19.157878,
        throughput: 2000.694182,
        strategy: 'TP1/EP16 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 2048,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 22.646133,
        throughput: 2242.596744,
        strategy: 'TP1/EP16 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 2048,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 24.068514,
        throughput: 2074.005296,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 1536,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 24.113134,
        throughput: 1558.547269,
        strategy: 'TP1/EP16 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 24.178703,
        throughput: 2436.972611,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 1536,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 24.608778,
        throughput: 2379.817381,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1536,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 26.009097,
        throughput: 1840.081885,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 26.555579,
        throughput: 1861.50093,
        strategy: 'TP1/EP16 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 26.894738,
        throughput: 1875.270039,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 27.837623,
        throughput: 2070.505234,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 31.0024,
        throughput: 2214.639853,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 31.049553,
        throughput: 2184.882096,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 39.299979,
        throughput: 1398.546319,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 41.243319,
        throughput: 1475.334431,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 43.699584,
        throughput: 1540.707898,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 44.76105,
        throughput: 417.509495,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-06; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 47.886669,
        throughput: 826.610372,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 51.14114,
        throughput: 896.781404,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 256,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 51.333805,
        throughput: 981.664961,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 256,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 55.360513,
        throughput: 1007.925657,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 60.999455,
        throughput: 595.526349,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 62.813405,
        throughput: 577.013799,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 64.806121,
        throughput: 302.226206,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-06; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 77.469935,
        throughput: 175.96035,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-06; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 78.294121,
        throughput: 386.406932,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 78.69623,
        throughput: 397.037362,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 99.43264,
        throughput: 245.3699,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 100.240298,
        throughput: 249.682639,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 112.374484,
        throughput: 137.357041,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 115.538479,
        throughput: 143.290024,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 145.903821,
        throughput: 89.024579,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 147.903532,
        throughput: 66.916978,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 153.862158,
        throughput: 100.190493,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 177.98536,
        throughput: 41.402446,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 178.757045,
        throughput: 53.121501,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 185.549505,
        throughput: 28.452916,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 187.57795,
        throughput: 58.244909,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 196.667435,
        throughput: 23.85056,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 216.597665,
        throughput: 35.029044,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp8-b200-dynamo-trt',
    name: 'B200 (Dynamo TRT)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP8 B200 (Dynamo TRT)',
    points: [
      {
        interactivity: 13.338867,
        throughput: 6258.563142,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 4096,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 26.425941,
        throughput: 4231.307931,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 5152,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 40; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 31.031852,
        throughput: 2211.551993,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 1920,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 40; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 55.812236,
        throughput: 422.792604,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 90.541303,
        throughput: 171.166467,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 142.570878,
        throughput: 25.909554,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp8-b200-dynamo-trt-mtp',
    name: 'B200 (Dynamo TRT MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP8 B200 (Dynamo TRT MTP)',
    points: [
      {
        interactivity: 41.554981,
        throughput: 4837.939666,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1600,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 52.220983,
        throughput: 3403.088447,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1184,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 59.28191,
        throughput: 2665.542225,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 32; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 66.338901,
        throughput: 1619.263624,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 896,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 56; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 92.466779,
        throughput: 603.346399,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 64; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 151.081203,
        throughput: 244.776843,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 64; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 188.099497,
        throughput: 150.280363,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 64; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 273.682115,
        throughput: 55.664891,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-23; prefill TP8 EP8; decode GPUs 64; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp8-b200-dynamo-sglang',
    name: 'B200 (Dynamo SGLang)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP8 B200 (Dynamo SGLang)',
    points: [
      {
        interactivity: 27.016253,
        throughput: 1666.726588,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 40; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 33.295525,
        throughput: 1053.410516,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 40; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 41.318044,
        throughput: 613.693193,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 50.924122,
        throughput: 381.643405,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 63.361985,
        throughput: 236.15506,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 77.199357,
        throughput: 143.957157,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 88.617536,
        throughput: 85.164445,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 101.746566,
        throughput: 48.646685,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-1024-osl-1024-fp8-b200-dynamo-sglang-mtp',
    name: 'B200 (Dynamo SGLang MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 1024 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 1024 / OSL 1024 FP8 B200 (Dynamo SGLang MTP)',
    points: [
      {
        interactivity: 32.486404,
        throughput: 2216.469271,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 33.713286,
        throughput: 2134.203925,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 37.327456,
        throughput: 1896.023649,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4096,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 40; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 37.809687,
        throughput: 1835.283074,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 40; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 41.209227,
        throughput: 1502.260601,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 44.969019,
        throughput: 1394.537203,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 40; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 54.498294,
        throughput: 1129.692992,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4096,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 40; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 58.104168,
        throughput: 952.90936,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 40; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 67.396414,
        throughput: 509.874005,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 76.228512,
        throughput: 568.817384,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 123.434672,
        throughput: 221.914856,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 148.634875,
        throughput: 141.148025,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 184.106574,
        throughput: 83.074178,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 184.647326,
        throughput: 84.042298,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 217.223868,
        throughput: 49.445574,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-18; prefill TP8 EP8; decode GPUs 24; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp4-mi355x-mori-sglang',
    name: 'MI355X (MoRI SGLang)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP4 MI355X (MoRI SGLang)',
    points: [
      {
        interactivity: 6.464637,
        throughput: 3209.129167,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 4096,
        label: 'date 2026-03-13; prefill TP4 EP4; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 9.549575,
        throughput: 10124.988553,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 4096,
        label: 'date 2026-05-07; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 11.669932,
        throughput: 3834.917664,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-03-13; prefill TP4 EP4; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 11.720324,
        throughput: 2853.356154,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-05-07; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 11.893262,
        throughput: 4003.398018,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-13; prefill TP4 EP4; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 12.575319,
        throughput: 4424.050579,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-05-07; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 47.603612,
        throughput: 1745.516118,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 47.636951,
        throughput: 1787.360198,
        strategy: 'TP1/EP8',
        precision: 'fp4',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 47.971166,
        throughput: 1745.534708,
        strategy: 'TP1/EP8',
        precision: 'fp4',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 48.032586,
        throughput: 1725.347892,
        strategy: 'TP1/EP8',
        precision: 'fp4',
        tp: 1,
        concurrency: 256,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 57.434131,
        throughput: 2463.763286,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 57.636279,
        throughput: 1183.517692,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 57.857741,
        throughput: 2327.617817,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 68.823742,
        throughput: 710.802769,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 71.062667,
        throughput: 2041.245777,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 71.962661,
        throughput: 1976.807337,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 73.387061,
        throughput: 1524.465295,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 75.240129,
        throughput: 1695.293644,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 92.480085,
        throughput: 966.775269,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 109.917307,
        throughput: 592.797968,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 111.081836,
        throughput: 456.815469,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 122.454734,
        throughput: 342.093111,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 129.90635,
        throughput: 271.517705,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 137.84693,
        throughput: 190.243623,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 138.772625,
        throughput: 146.852562,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 148.235528,
        throughput: 99.179818,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 148.982597,
        throughput: 76.931246,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp4-mi355x-mori-sglang-mtp',
    name: 'MI355X (MoRI SGLang MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP4 MI355X (MoRI SGLang MTP)',
    points: [
      {
        interactivity: 7.453547,
        throughput: 3616.993163,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 4096,
        label: 'date 2026-03-13; prefill TP4 EP4; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 7.510369,
        throughput: 9618.731545,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 4096,
        label: 'date 2026-05-07; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 9.247144,
        throughput: 4222.804026,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-03-13; prefill TP4 EP4; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 10.072087,
        throughput: 3632.029851,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-13; prefill TP4 EP4; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 12.50361,
        throughput: 7863.894985,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-05-07; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 15.830787,
        throughput: 4889.080814,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-05-07; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 61.235169,
        throughput: 1749.522817,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 61.998359,
        throughput: 1563.931511,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp4',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 63.979642,
        throughput: 1545.531447,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp4',
        tp: 1,
        concurrency: 256,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 64.336163,
        throughput: 1521.798996,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp4',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-13; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 78.811617,
        throughput: 1376.429926,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 109.503062,
        throughput: 1055.341502,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 121.352722,
        throughput: 2039.604853,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 121.977936,
        throughput: 455.131843,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 123.399863,
        throughput: 1993.582344,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 126.738184,
        throughput: 2412.833403,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 130.277245,
        throughput: 1853.09928,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-05-07; prefill TP4 EP1; decode GPUs 16; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 140.444265,
        throughput: 2209.810626,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 175.054441,
        throughput: 909.076037,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 176.805211,
        throughput: 1461.580812,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 218.896296,
        throughput: 724.648001,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 232.737247,
        throughput: 120.951413,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 257.180281,
        throughput: 167.975536,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 258.918217,
        throughput: 461.553852,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 263.952632,
        throughput: 567.923807,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 295.114768,
        throughput: 352.083603,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 344.729704,
        throughput: 271.218461,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-05-07; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp4-b200-dynamo-trt',
    name: 'B200 (Dynamo TRT)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP4 B200 (Dynamo TRT)',
    points: [
      {
        interactivity: 25.560278,
        throughput: 12950.61457,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 1606,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 31.69887,
        throughput: 12147.238005,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 2222,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 16; prefill GPUs 28; DPA true'
      },
      {
        interactivity: 47.314144,
        throughput: 7452.051744,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 837,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 24; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 63.644315,
        throughput: 2725.569656,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 370,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 101.511336,
        throughput: 1489.611429,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 100,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 116.57212,
        throughput: 982.977797,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 50,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 129.792851,
        throughput: 565.967429,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 25,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 142.986373,
        throughput: 379.141889,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 15,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 151.123524,
        throughput: 268.03084,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 10,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 169.123595,
        throughput: 133.412385,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 6,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp4-b200-dynamo-trt-mtp',
    name: 'B200 (Dynamo TRT MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP4 B200 (Dynamo TRT MTP)',
    points: [
      {
        interactivity: 29.850688,
        throughput: 13429.68396,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 1691,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 8; prefill GPUs 20; DPA true'
      },
      {
        interactivity: 35.650554,
        throughput: 11348.705958,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 1096,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 8; prefill GPUs 20; DPA true'
      },
      {
        interactivity: 54.286765,
        throughput: 11144.764778,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 548,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 8; prefill GPUs 12; DPA true'
      },
      {
        interactivity: 75.677155,
        throughput: 9510.73162,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 658,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 16; prefill GPUs 20; DPA true'
      },
      {
        interactivity: 106.300569,
        throughput: 5081.302519,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 90,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA true'
      },
      {
        interactivity: 151.384971,
        throughput: 2121.202817,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 66,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 24; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 196.612028,
        throughput: 1430.398181,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 60,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 223.218174,
        throughput: 1060.609628,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 30,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 254.86361,
        throughput: 622.453171,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 15,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 280.93561,
        throughput: 463.860702,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 10,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 288.733196,
        throughput: 206.703902,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 6,
        label: 'date 2026-01-29; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp4-b200-dynamo-sglang',
    name: 'B200 (Dynamo SGLang)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP4 B200 (Dynamo SGLang)',
    points: [
      {
        interactivity: 25.132841,
        throughput: 8185.601621,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 16; prefill GPUs 28; DPA true'
      },
      {
        interactivity: 33.348947,
        throughput: 5971.057961,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 16; prefill GPUs 28; DPA true'
      },
      {
        interactivity: 45.518533,
        throughput: 3554.688845,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 57.650761,
        throughput: 2507.66953,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-11; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 58.364696,
        throughput: 2413.343985,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 81.677656,
        throughput: 1529.584819,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 40; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 100.741481,
        throughput: 1097.105458,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-02-11; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 125.557978,
        throughput: 688.587945,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-02-11; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 138.712348,
        throughput: 200.707472,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 144.02998,
        throughput: 400.737992,
        strategy: 'TP8/EP1',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-11; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 155.046688,
        throughput: 99.102967,
        strategy: 'TP8/EP8',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 40; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp4-b200-dynamo-sglang-mtp',
    name: 'B200 (Dynamo SGLang MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp4',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP4 B200 (Dynamo SGLang MTP)',
    points: [
      {
        interactivity: 64.676906,
        throughput: 3890.889833,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 68.313652,
        throughput: 2916.974364,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-11; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 75.913571,
        throughput: 2959.03736,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 131.904951,
        throughput: 1837.736484,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 40; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 132.145523,
        throughput: 1467.864631,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-02-11; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 172.293031,
        throughput: 949.001892,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-02-11; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 220.761951,
        throughput: 607.013064,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-11; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 247.416141,
        throughput: 324.241735,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 40; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 258.039799,
        throughput: 148.06853,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp4',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-11; prefill TP4 EP4; decode GPUs 40; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp8-mi355x-mori-sglang',
    name: 'MI355X (MoRI SGLang)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP8 MI355X (MoRI SGLang)',
    points: [
      {
        interactivity: 17.372126,
        throughput: 3815.33462,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 2048,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 17.544902,
        throughput: 3752.184576,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-03-03; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 17.915048,
        throughput: 3070.907063,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 18.362924,
        throughput: 3178.629821,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-03; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 19.506961,
        throughput: 2960.808768,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 20.388497,
        throughput: 2537.350899,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 23.743531,
        throughput: 2021.680059,
        strategy: 'TP1/EP16',
        precision: 'fp8',
        tp: 1,
        concurrency: 2048,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 23.99482,
        throughput: 1766.461851,
        strategy: 'TP1/EP16',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 24.985474,
        throughput: 2027.077566,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 25.31615,
        throughput: 1899.333855,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 25.343635,
        throughput: 1825.296278,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 1536,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 26.203427,
        throughput: 1554.165461,
        strategy: 'TP1/EP8',
        precision: 'fp8',
        tp: 1,
        concurrency: 256,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 43.85784,
        throughput: 1476.775825,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-16; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 45.542971,
        throughput: 1309.898452,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-02-16; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 46.675361,
        throughput: 1521.212385,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 49.303403,
        throughput: 1439.664982,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 51.871598,
        throughput: 1289.545997,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 52.043597,
        throughput: 1023.538565,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-16; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 52.27457,
        throughput: 997.821241,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-11; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 52.611537,
        throughput: 918.171049,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-11; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 55.213503,
        throughput: 1059.29972,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 55.278637,
        throughput: 1064.518026,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 63.54403,
        throughput: 665.687197,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-16; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 69.488893,
        throughput: 526.777818,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-11; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 71.834778,
        throughput: 694.939056,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 74.61643,
        throughput: 776.438204,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 75.99528,
        throughput: 413.156337,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-02-16; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 81.608742,
        throughput: 224.603028,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-02-16; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 88.869263,
        throughput: 137.694603,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-16; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 90.353821,
        throughput: 490.959359,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 94.482995,
        throughput: 479.544114,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 104.372166,
        throughput: 287.151031,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 104.747321,
        throughput: 281.702737,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 106.367718,
        throughput: 177.968119,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 116.189188,
        throughput: 157.923853,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 118.41977,
        throughput: 165.006633,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 118.456924,
        throughput: 117.336783,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 119.564362,
        throughput: 86.97373,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 130.07513,
        throughput: 69.633869,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 130.498484,
        throughput: 91.508934,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp8-mi355x-mori-sglang-mtp',
    name: 'MI355X (MoRI SGLang MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP8 MI355X (MoRI SGLang MTP)',
    points: [
      {
        interactivity: 25.685141,
        throughput: 3143.217722,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-03; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 27.786185,
        throughput: 3407.88804,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 2048,
        label: 'date 2026-03-03; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 27.814343,
        throughput: 2530.726384,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 28.79679,
        throughput: 2986.53634,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 28.950574,
        throughput: 3120.635115,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 30.281439,
        throughput: 3584.458758,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 2048,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 40.514976,
        throughput: 2037.132486,
        strategy: 'TP1/EP16 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 2048,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 42.300619,
        throughput: 1736.179013,
        strategy: 'TP1/EP16 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 42.815138,
        throughput: 1916.939513,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 512,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 42.828617,
        throughput: 2048.0684,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 1024,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 43.709295,
        throughput: 1839.351536,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 1536,
        label: 'date 2026-02-23; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 43.987759,
        throughput: 1703.864108,
        strategy: 'TP1/EP8 MTP',
        precision: 'fp8',
        tp: 1,
        concurrency: 256,
        label: 'date 2026-02-12; prefill TP1 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 67.044954,
        throughput: 1017.974147,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-11; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 70.34231,
        throughput: 888.258684,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-11; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 70.56627,
        throughput: 1587.166819,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 77.490368,
        throughput: 1447.771321,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 78.168504,
        throughput: 1288.416877,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 78.309354,
        throughput: 687.204324,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-11; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 80.566982,
        throughput: 1366.617305,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 80.772277,
        throughput: 1313.745682,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 94.202783,
        throughput: 453.406329,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-02-11; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 95.461571,
        throughput: 977.470888,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 98.930367,
        throughput: 892.801315,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 104.978068,
        throughput: 580.995926,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 111.39697,
        throughput: 282.779704,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-02-11; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 113.085838,
        throughput: 590.435527,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 119.968387,
        throughput: 160.110737,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-11; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 146.677184,
        throughput: 370.197974,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 155.953491,
        throughput: 420.599679,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 160.016664,
        throughput: 264.135223,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 169.489205,
        throughput: 182.946251,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 176.496,
        throughput: 232.305779,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 176.728369,
        throughput: 98.092497,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-02-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 179.884002,
        throughput: 250.063422,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 186.618261,
        throughput: 131.022974,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-03-03; prefill TP4 EP1; decode GPUs 8; prefill GPUs 4; DPA false'
      },
      {
        interactivity: 204.702174,
        throughput: 141.371951,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 2,
        label: 'date 2026-03-03; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp8-b200-dynamo-trt',
    name: 'B200 (Dynamo TRT)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP8 B200 (Dynamo TRT)',
    points: [
      {
        interactivity: 23.079247,
        throughput: 4914.464634,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 640,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 23.18057,
        throughput: 4926.312393,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 640,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 29.500305,
        throughput: 3667.580089,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 29.592004,
        throughput: 3675.707585,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 31.877087,
        throughput: 2084.930378,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 32.494418,
        throughput: 2122.725539,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 40.834448,
        throughput: 1633.414147,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 40.931834,
        throughput: 1724.761743,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 60.793305,
        throughput: 1424.858762,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 32; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 61.045552,
        throughput: 1428.808526,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 32; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 78.305737,
        throughput: 964.375627,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 96,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 78.734169,
        throughput: 969.758896,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 96,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 97.148557,
        throughput: 578.968202,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 32; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 97.150199,
        throughput: 577.394384,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 32; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 136.560038,
        throughput: 72.536728,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 137.203303,
        throughput: 72.793148,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 1,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp8-b200-dynamo-trt-mtp',
    name: 'B200 (Dynamo TRT MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP8 B200 (Dynamo TRT MTP)',
    points: [
      {
        interactivity: 27.11082,
        throughput: 5856.941046,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1088,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 32; DPA true'
      },
      {
        interactivity: 27.16246,
        throughput: 5846.331108,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1088,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 8; prefill GPUs 32; DPA true'
      },
      {
        interactivity: 51.388186,
        throughput: 4718.677328,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 288,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 51.434578,
        throughput: 4724.062026,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 288,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 70.423697,
        throughput: 2857.439974,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 224,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 24; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 70.433212,
        throughput: 2871.723379,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 224,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 24; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 110.23429,
        throughput: 1263.473423,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 32; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 111.190051,
        throughput: 1258.389342,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 32; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 149.059212,
        throughput: 864.370168,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 48,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 151.034196,
        throughput: 866.693193,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 48,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 189.625518,
        throughput: 473.414786,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 193.590886,
        throughput: 477.450006,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 260.712057,
        throughput: 229.730569,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-02-12; prefill TP8 EP8; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 260.821211,
        throughput: 231.162039,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-23; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp8-b200-dynamo-sglang',
    name: 'B200 (Dynamo SGLang)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP8 B200 (Dynamo SGLang)',
    points: [
      {
        interactivity: 18.364199,
        throughput: 4230.648157,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 8; prefill GPUs 24; DPA true'
      },
      {
        interactivity: 25.68434,
        throughput: 3706.272767,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 29.895174,
        throughput: 2036.73452,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-02-07; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 32.133484,
        throughput: 2964.25713,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 288,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 33.905583,
        throughput: 2514.421613,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 160,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 35.510947,
        throughput: 1554.835426,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-07; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 37.74672,
        throughput: 1935.266832,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 288,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 42.342505,
        throughput: 1284.680256,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-07; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 54.38191,
        throughput: 853.332433,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-07; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 59.730658,
        throughput: 1345.496957,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 67.952761,
        throughput: 1098.379783,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 32; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 76.318151,
        throughput: 589.173761,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-07; prefill TP8 EP8; decode GPUs 32; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 89.320552,
        throughput: 203.417089,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 91.121581,
        throughput: 342.149932,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-07; prefill TP8 EP8; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 93.29579,
        throughput: 668.704716,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 97.49214,
        throughput: 201.947532,
        strategy: 'TP8/EP8',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-07; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 106.1563,
        throughput: 436.069673,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 121.81122,
        throughput: 248.594306,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 131.920413,
        throughput: 143.978106,
        strategy: 'TP8/EP1',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
    ]
  },
  {
    id: 'deepseek-r1-0528-isl-8192-osl-1024-fp8-b200-dynamo-sglang-mtp',
    name: 'B200 (Dynamo SGLang MTP)',
    model: 'DeepSeek-R1-0528',
    islOsl: 'ISL 8192 / OSL 1024',
    precision: 'fp8',
    title: 'DeepSeek-R1-0528 ISL 8192 / OSL 1024 FP8 B200 (Dynamo SGLang MTP)',
    points: [
      {
        interactivity: 19.08069,
        throughput: 4241.972116,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 1024,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 8; prefill GPUs 24; DPA true'
      },
      {
        interactivity: 38.218751,
        throughput: 3859.613461,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 50.241347,
        throughput: 2236.509653,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 512,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 54.149565,
        throughput: 2938.394806,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 288,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 55.555207,
        throughput: 1845.527452,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 8; prefill GPUs 16; DPA true'
      },
      {
        interactivity: 56.542206,
        throughput: 2777.47444,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 160,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 8; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 62.909646,
        throughput: 1674.632811,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 64.874916,
        throughput: 1994.058223,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 288,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 16; prefill GPUs 8; DPA true'
      },
      {
        interactivity: 67.229951,
        throughput: 1469.885835,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 76.369421,
        throughput: 1121.378972,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 97.681715,
        throughput: 785.026191,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 8; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 99.641878,
        throughput: 1408.347391,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 24; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 118.85103,
        throughput: 1122.806343,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 32; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 138.242597,
        throughput: 617.884171,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 32; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 147.061368,
        throughput: 838.707264,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 128,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 153.274357,
        throughput: 759.656029,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 64,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 154.487771,
        throughput: 442.065437,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 256,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 160.284126,
        throughput: 314.113088,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 169.677112,
        throughput: 545.095404,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 32,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 170.700312,
        throughput: 251.908401,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 32; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 177.796734,
        throughput: 177.406869,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 189.241942,
        throughput: 366.160854,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 16,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 190.952413,
        throughput: 100.295,
        strategy: 'TP8/EP8 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 4,
        label: 'date 2026-02-13; prefill TP8 EP8; decode GPUs 48; prefill GPUs 8; DPA false'
      },
      {
        interactivity: 217.278612,
        throughput: 208.811231,
        strategy: 'TP8/EP1 MTP',
        precision: 'fp8',
        tp: 8,
        concurrency: 8,
        label: 'date 2026-03-18; prefill TP8 EP1; decode GPUs 48; prefill GPUs 8; DPA false'
      },
    ]
  },
];
