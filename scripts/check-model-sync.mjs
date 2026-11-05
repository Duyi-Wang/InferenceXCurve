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
    "Kimi-K3.1-Pro",
    "Kimi-K3.1-Pro",
    [
      "kimik3.1"
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
  const agentic = {
    ...base, model: 'kimik3.1', scenario: 'agentic-traces', isl: 0, osl: 0
  };
  const canonicalId = sync.makeInferenceXSyncLineId(agentic);
  for (const model of ['Kimi-K3.1-Pro', 'moonshotai/Kimi-K3.1-Pro', '/models/Kimi-K3.1-Pro-MXFP4']) {
    assert.equal(sync.makeInferenceXSyncLineId({ ...agentic, model }), canonicalId);
    assert.equal(sync.getInferenceXDisplayModel(model), 'Kimi-K3.1-Pro');
  }
  assert.notEqual(sync.makeInferenceXSyncLineId({ ...agentic, model: 'Kimi-K3' }), canonicalId);
  globalThis.fetch = async (url) => {
    assert.equal(new URL(url).searchParams.get('model'), 'Kimi-K3.1-Pro');
    return Response.json([{
      ...agentic, benchmark_type: 'agentic_traces', date: '2026-11-05',
      spec_method: 'draft_model', conc: 1,
      metrics: { p90_intvty: 100, tput_per_gpu: 200,
        spec_algorithm: 'dflash', spec_draft_model: 'RadixArk/Kimi-K3.1-Dflash2-Preview' }
    }]);
  };
  const result = await sync.fetchInferenceXSyncSeries([agentic]);
  assert.equal(result.series.length, 1);
  const line = result.series[0];
  assert.equal(line.id, canonicalId);
  assert.equal(line.mtp, undefined);
  assert.equal(line.points[0].spec_decoding, 'draft_model');
  assert.equal(line.points[0].spec_algorithm, 'dflash');
  assert.equal(line.points[0].spec_draft_model, 'RadixArk/Kimi-K3.1-Dflash2-Preview');
  const changed = structuredClone(line);
  changed.points[0].spec_algorithm = 'dspark';
  assert.notEqual(sync.fingerprintInferenceCurveSeries(line), sync.fingerprintInferenceCurveSeries(changed));
  console.log('Official model aliases, API parameters, merged curves, and K3.1 Agentic metadata passed.');
} finally {
  globalThis.fetch = originalFetch;
  await server.close();
}
