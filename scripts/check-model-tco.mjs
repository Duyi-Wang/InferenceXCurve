import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const originalFetch = globalThis.fetch;
try {
  const sync = await server.ssrLoadModule('/src/inferenceXSync.ts');
  const chart = await server.ssrLoadModule('/src/inferenceCurveChart.ts');
  const tcoSync = await server.ssrLoadModule('/src/inferenceXTcoSync.ts');
  const aliases = [
    'dsv4', 'dsv4pro', 'DeepSeek V4 Pro', 'DeepSeek-V4-Pro',
    'DeepSeek-V4-Pro-0813', 'deepseek-ai/DeepSeek-V4-Pro-0813',
    '/models/DeepSeek-V4-Pro-0813-MXFP4'
  ];
  const base = {
    model: 'DeepSeek-V4-Pro', isl: 1024, osl: 1024,
    hardware: 'b200', framework: 'sglang', precision: 'fp4', specMethod: 'none'
  };
  const lineId = sync.makeInferenceXSyncLineId(base);
  for (const model of aliases) {
    assert.equal(sync.getInferenceXDisplayModel(model), 'DeepSeek-V4-Pro', model);
    assert.equal(sync.makeInferenceXSyncLineId({ ...base, model }), lineId, model);
  }
  assert.equal(sync.getInferenceXDisplayModel('DeepSeek-V4.1-Flash'), 'DeepSeek-V4.1-Flash');
  const configs = sync.normalizeInferenceXSyncConfigs([
    { ...base, enabled: false },
    { ...base, model: 'DeepSeek-V4-Pro-0813', enabled: true }
  ]);
  assert.equal(configs.length, 1);
  assert.equal(configs[0].enabled, true);
  assert.equal(configs[0].model, 'DeepSeek-V4-Pro');

  const requests = [];
  globalThis.fetch = async (url) => {
    requests.push(String(url));
    return Response.json([
      { ...base, model: 'dsv4', date: '2026-08-01', spec_method: 'none',
        metrics: { median_intvty: 40, tput_per_gpu: 100 } },
      { ...base, model: 'DeepSeek-V4-Pro-0813', date: '2026-09-19', spec_method: 'none',
        metrics: { median_intvty: 50, tput_per_gpu: 200 } },
      { ...base, hardware: 'gb200', model: 'dsv4', date: '2026-09-20', spec_method: 'none',
        metrics: { median_intvty: 60, tput_per_gpu: 300 } }
    ]);
  };
  const synced = await sync.fetchInferenceXSyncSeries(configs);
  assert.equal(requests.length, 1, 'Alias configs fetch one model history');
  assert.equal(new URL(requests[0]).searchParams.get('model'), 'DeepSeek-V4-Pro');
  assert.equal(synced.series.length, 1);
  assert.equal(synced.series[0].id, lineId);
  assert.deepEqual(synced.series[0].points.map((point) => point.throughput), [200]);

  const costs = Object.fromEntries(Object.entries(chart.INFERENCE_CURVE_TCO_COSTS)
    .map(([hardware, rates]) => [hardware, rates.hyperscaler]));
  const line = { id: 'custom', name: 'Custom', hwKey: 'b200_sglang', points: [] };
  const point = { throughput: 173, interactivity: 30, precision: 'fp4',
    disagg: true, num_prefill_gpu: 8, num_decode_gpu: 16 };
  assert.equal(chart.getInferenceCurvePointYValue(point, line, 'totalTokensPerDollar', costs), 360000);
  assert.equal(chart.getInferenceCurvePointYValue(point, line), 173, 'Raw throughput stays intact');
  assert.equal(chart.getInferenceCurvePointYValue(point, line, 'totalTokensPerDollar', { b200: 3.46 }), 180000);
  assert.equal(chart.getInferenceCurvePointYValue({ ...point, throughput: 0 }, line, 'totalTokensPerDollar', costs), 0);
  for (const cost of [0, -1, NaN, Infinity, undefined]) {
    assert.ok(Number.isNaN(chart.getInferenceCurvePointYValue(point, line, 'totalTokensPerDollar', { b200: cost })));
  }
  assert.equal(chart.getInferenceCurveTcoHardware({ ...line, hwKey: '', id: 'gb200_sglang' }), 'gb200');
  assert.equal(chart.getInferenceCurveTcoHardware({ ...line, hwKey: 'gb200-sglang' }), 'gb200');
  assert.equal(costs.tpuv7, 1.03, 'Owning preset matches upstream internal TCO basis');
  assert.equal(chart.getInferenceCurveTcoHardware({ ...line, hwKey: 'unknown', name: 'B200' }), 'unknown');
  assert.equal(chart.getInferenceCurveTcoHardware({ ...line, hwKey: '', name: 'B200 / GB200' }), 'line:custom');
  assert.notEqual(costs.b200, costs.gb200);

  const series = [{ ...line, points: [point, { ...point, throughput: 100, interactivity: 20 }] }];
  const before = structuredClone(series);
  const prepared = chart.prepareInferenceCurveSeries(series, false, 'dark', series,
    'interactivity', false, undefined, 'maximize', 'p90', 'totalTokensPerDollar', costs);
  assert.equal(prepared[0].roofline.length, 1);
  assert.equal(prepared[0].roofline[0].y, 360000);
  assert.deepEqual(series, before, 'TCO does not mutate source data');
  const missing = chart.prepareInferenceCurveSeries(series, false, 'dark', series,
    'interactivity', false, undefined, 'maximize', 'p90', 'totalTokensPerDollar', {});
  assert.equal(missing[0].points.length, 0, 'Unpriced points do not appear on the chart');

  const agentic = [{ ...line, islOsl: 'Agentic Traces', points: [
    { throughput: 173, interactivityPercentiles: { p90: 30 }, endToEndPercentiles: { p90: 10 } },
    { throughput: 100, interactivityPercentiles: { p90: 50 }, endToEndPercentiles: { p90: 20 } }
  ] }];
  const gated = chart.prepareInferenceCurveSeries(agentic, false, 'dark', agentic,
    'interactivity', true, undefined, 'maximize', 'p90', 'totalTokensPerDollar', costs);
  assert.equal(gated[0].points.length, 2);
  assert.deepEqual(gated[0].roofline.map((point) => point.pointIndex), [0], 'Agentic E2E Pareto gate is preserved');

  const registry = `export const HW_REGISTRY: Record<string, HwEntry> = {
    // Pricing metadata and comments must not affect parsing.
    b200: { vendor: 'NVIDIA', sort: -1, costh: 2, costr: 4 },
    'tpuv7': { label: 'TPU7x', costh: 1.21, /** rate */ costr: 2 },
    futuregpu: { costh: 0, costr: 0 },
  };`;
  const policy = `export const DEFAULT_TCO_BASIS: TcoBasis = 'internal';
    const internalCost = base === 'tpuv7' ? 1.03 : undefined;
    return { costh: basis === 'internal' ? (internalCost ?? entry.costh) : entry.costh,
      costr: entry.costr };`;
  const attribution = "export const TCO_SOURCE_TITLE = 'Current survey';";
  const parsed = tcoSync.parseInferenceXTcoSources(registry, policy, attribution);
  assert.deepEqual(parsed.costs.b200, { hyperscaler: 2, rental: 4 });
  assert.equal(parsed.costs.tpuv7.hyperscaler, 1.03);
  assert.equal(parsed.costs.futuregpu.hyperscaler, 0, 'Unpublished zero rates stay unpriced');
  assert.equal(tcoSync.parseInferenceXTcoSources(registry,
    policy.replace("= 'internal'", "= 'external'"), attribution).costs.tpuv7.hyperscaler, 1.21);
  assert.throws(() => tcoSync.parseInferenceXTcoSources(registry.replace('costh: 2', 'costh: calculatePrice()'), policy, attribution));
  assert.throws(() => tcoSync.parseInferenceXTcoSources(registry.replace('costh: 2', 'costh: -2'), policy, attribution));
  assert.throws(() => tcoSync.parseInferenceXTcoSources(registry, policy.replace('internalCost ?? entry.costh', 'entry.costh * 2'), attribution));
  assert.throws(() => tcoSync.parseInferenceXTcoSources(registry, policy, ''));
  const revision = 'a'.repeat(40);
  const now = Date.now();
  const snapshot = { ...parsed, revision, checkedAt: new Date(now).toISOString() };
  assert.deepEqual(tcoSync.readInferenceXTcoPriceSnapshot(snapshot), snapshot);
  assert.equal(tcoSync.readInferenceXTcoPriceSnapshot({ ...snapshot, costs: { b200: { hyperscaler: Infinity, rental: 4 } } }), null);
  assert.equal(tcoSync.readInferenceXTcoPriceSnapshot({ ...snapshot, checkedAt: 'invalid' }), null);
  assert.equal(tcoSync.shouldRefreshInferenceXTcoPrices(snapshot, now + 23 * 3600000), false);
  assert.equal(tcoSync.shouldRefreshInferenceXTcoPrices(snapshot, now + 24 * 3600000), true);
  assert.equal(tcoSync.shouldRefreshInferenceXTcoPrices(null, now), true);
  const priceRequests = [];
  globalThis.fetch = async (url, options) => {
    priceRequests.push(String(url));
    assert.equal(options.credentials, 'omit');
    if (String(url).includes('api.github.com')) return Response.json([{ sha: revision }]);
    assert.ok(String(url).includes(`/${revision}/`), 'All price files use the same commit');
    return new Response(String(url).endsWith('/gpu-keys.ts') ? registry
      : String(url).endsWith('/constants.ts') ? policy : attribution);
  };
  assert.equal((await tcoSync.fetchInferenceXTcoPrices()).costs.b200.hyperscaler, 2);
  assert.equal(priceRequests.length, 4);
  globalThis.fetch = async (url) => {
    if (String(url).includes('api.github.com')) return new Response('', { status: 403 });
    assert.ok(String(url).includes('/HEAD/'));
    return new Response(String(url).endsWith('/gpu-keys.ts') ? registry
      : String(url).endsWith('/constants.ts') ? policy : attribution);
  };
  assert.equal((await tcoSync.fetchInferenceXTcoPrices()).costs.b200.hyperscaler, 2,
    'Raw sources work when GitHub API quota is exhausted');
  globalThis.fetch = async () => new Response('', { status: 403 });
  await assert.rejects(tcoSync.fetchInferenceXTcoPrices(), /HTTP 403/);
  console.log('Model aliases, sync, TCO math, Pareto, price parsing, cache expiry, and price refresh checks passed.');
} finally {
  globalThis.fetch = originalFetch;
  await server.close();
}
