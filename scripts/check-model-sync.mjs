import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const originalFetch = globalThis.fetch;
try {
  const sync = await server.ssrLoadModule('/src/inferenceXSync.ts');
  const base = {
    isl: 1024, osl: 1024, precision: 'fp4', hardware: 'mi355x',
    framework: 'sglang', specMethod: 'none', enabled: true
  };
  // Official model groups, including aliases not yet present in availability.
  for (const [model, display, keys] of [
  [
    "DeepSeek-R1-0528",
    "DeepSeek-R1-0528",
    [
      "dsr1"
    ]
  ],
  [
    "gpt-oss-120b",
    "gpt-oss-120b",
    [
      "gptoss120b"
    ]
  ],
  [
    "Llama-3.3-70B-Instruct-FP8",
    "Llama-3.3-70B-Instruct-FP8",
    [
      "llama70b"
    ]
  ],
  [
    "Qwen-3.5-397B-A17B",
    "Qwen-3.5-397B-A17B",
    [
      "qwen3.5"
    ]
  ],
  [
    "Qwen3.8-Flash-Next",
    "Qwen3.8-Flash-Next",
    [
      "qwen3.8next"
    ]
  ],
  [
    "Qwen3.8-27B",
    "Qwen3.8-27B",
    [
      "qwen3.827b"
    ]
  ],
  [
    "Qwen3.8-27B-Eager",
    "Qwen3.8-27B-Eager",
    [
      "qwen3.827beager"
    ]
  ],
  [
    "Kimi-K2.5",
    "Kimi-K2.5",
    [
      "kimik2.5",
      "kimik2.6",
      "kimik2.7-code"
    ]
  ],
  [
    "Kimi-K3",
    "Kimi-K3",
    [
      "kimik3"
    ]
  ],
  [
    "MiniMax-M2.5",
    "MiniMax-M2.5",
    [
      "minimaxm2.5",
      "minimaxm2.7"
    ]
  ],
  [
    "MiniMax-M3",
    "MiniMax-M3",
    [
      "minimaxm3"
    ]
  ],
  [
    "MiniMax-M3.1-Flash",
    "MiniMax-M3.1-Flash",
    [
      "minimaxm31flash"
    ]
  ],
  [
    "GLM-5",
    "GLM-5",
    [
      "glm5",
      "glm5.1"
    ]
  ],
  [
    "GLM-5.2",
    "GLM-5.2",
    [
      "glm5.2",
      "glm5.3"
    ]
  ],
  [
    "GLM-5.3-Flash",
    "GLM-5.3-Flash",
    [
      "glm5.3flash"
    ]
  ],
  [
    "DeepSeek-V4-Pro",
    "DeepSeek-V4-Pro",
    [
      "dsv4"
    ]
  ],
  [
    "DeepSeek-V4.1-Flash",
    "DeepSeek-V4.1-Flash",
    [
      "dsv41flash"
    ]
  ],
  [
    "Muse-Spark-Open",
    "Muse-Spark-Open",
    [
      "musespark"
    ]
  ]
]) {
    const config = { ...base, model };
    const canonicalId = sync.makeInferenceXSyncLineId({ ...base, model: display });
    for (const alias of [model, display, ...keys]) {
      assert.equal(sync.getInferenceXDisplayModel(alias), display);
      assert.equal(sync.makeInferenceXSyncLineId({ ...base, model: alias }), canonicalId);
    }
    globalThis.fetch = async (url) => {
      assert.equal(new URL(url).searchParams.get('model'), display);
      return Response.json(keys.map((key, index) => ({
        ...base, model: key, date: '2026-11-02', spec_method: 'none', conc: index + 1,
        metrics: { median_intvty: 40 + index, tput_per_gpu: 100 + index }
      })));
    };
    const result = await sync.fetchInferenceXSyncSeries([config]);
    assert.equal(result.series.length, 1);
    assert.equal(result.series[0].model, display);
    assert.equal(result.series[0].points.length, keys.length);
    assert.equal(result.series[0].id, canonicalId);
  }
  console.log('All official model aliases, API parameters, and merged curve points passed.');
} finally {
  globalThis.fetch = originalFetch;
  await server.close();
}
