import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const originalFetch = globalThis.fetch;
try {
  const sync = await server.ssrLoadModule('/src/inferenceXSync.ts');
  const chart = await server.ssrLoadModule('/src/inferenceCurveChart.ts');
  const config = sync.normalizeInferenceXSyncConfig({
    model: 'Kimi-K3', scenario: 'agentic-traces', isl: 0, osl: 0,
    hardware: 'gb200', framework: 'dynamo-vllm', precision: 'fp4', enabled: true
  });
  // Kimi K3 uses both common DCP and independent phase fields. Keep all
  // configurations on the same curve, including aggregated/disaggregated rows.
  const cases = [
    { metrics: { prefill_dcp_size: 16, decode_dcp_size: 1 }, expected: [16, 1] },
    { metrics: { prefill_dcp_size: 8, decode_dcp_size: 1 }, expected: [8, 1] },
    { metrics: { dcp_size: 8 }, expected: [8, 8] },
    { metrics: { dcp_size: 8, decode_dcp_size: 1 }, expected: [8, 1] },
    { metrics: { prefill_dcp_size: 8 }, expected: [8, undefined] },
    { metrics: { decode_dcp_size: 8 }, expected: [undefined, 8] },
    { metrics: { prefill_dcp_size: 1, decode_dcp_size: 1 }, expected: [1, 1] },
    { metrics: {}, expected: [undefined, undefined] },
    { metrics: { prefill_dcp_size: 8, decode_dcp_size: 1 }, disagg: true, expected: [8, 1] }
  ];
  const records = cases.map((item, index) => ({
    model: 'kimik3', benchmark_type: 'agentic_traces', precision: 'fp4',
    hardware: 'gb200', framework: 'dynamo-vllm', spec_method: 'mtp',
    date: '2026-09-19', curve_date: '2026-09-19', conc: index + 1,
    prefill_tp: 16, decode_tp: 16, prefill_ep: 1, decode_ep: 1,
    num_prefill_gpu: 16, num_decode_gpu: 16, disagg: item.disagg ?? false,
    metrics: { p90_intvty: 10 + index, tput_per_gpu: 100 - index, ...item.metrics }
  }));
  globalThis.fetch = async (url) => Response.json(
    String(url).includes('/benchmarks?') ? records : []
  );
  const result = await sync.fetchInferenceXSyncSeries([config]);
  assert.equal(result.series.length, 1, 'DCP and disagg do not split sync line IDs');
  const line = result.series[0];
  assert.equal(line.points.length, cases.length);
  for (const [index, item] of cases.entries()) {
    const point = line.points.find((point) => point.concurrency === index + 1);
    assert.deepEqual([point.prefill_dcp_size, point.decode_dcp_size], item.expected);
  }
  const source = structuredClone(result.series);
  const prepared = chart.prepareInferenceCurveSeries(result.series)[0];
  const label = (concurrency) => prepared.points.find((point) => point.concurrency === concurrency).strategyLabel;
  assert.equal(label(1), 'TP16/EP1/DCP(P=16,D=1)');
  assert.equal(label(2), 'TP16/EP1/DCP(P=8,D=1)');
  assert.notEqual(label(1), label(2), 'Strategies differing only in Prefill DCP remain distinct');
  assert.equal(label(3), 'TP16/EP1/DCP8');
  assert.equal(label(4), label(2), 'Phase fields override common DCP');
  assert.equal(label(5), 'TP16/EP1/DCP(P=8,D=?)');
  assert.equal(label(6), 'TP16/EP1/DCP(P=?,D=8)');
  assert.equal(label(7), 'TP16/EP1');
  assert.equal(label(8), 'TP16/EP1');
  assert.deepEqual(result.series, source, 'Rendering does not rewrite persisted strategy/source fields');
  const changed = structuredClone(line);
  changed.points[0].prefill_dcp_size = 4;
  assert.notEqual(sync.fingerprintInferenceCurveSeries(line), sync.fingerprintInferenceCurveSeries(changed));

  const legacy = { throughput: 100, interactivity: 30, strategy: 'TP8/EP1/DCP8' };
  assert.deepEqual(chart.getInferenceCurvePointDcp(legacy), { prefill: undefined, decode: 8 });
  assert.deepEqual(chart.getInferenceCurvePointDcp({ ...legacy, label: 'prefill DCP:16' }),
    { prefill: 16, decode: 8 });
  assert.deepEqual(chart.getInferenceCurvePointDcp({ ...legacy, prefill_dcp_size: 4 }),
    { prefill: 4, decode: undefined }, 'A stale strategy must not fill in an unknown phase');
  const custom = { ...legacy, strategy: 'Custom scheduling', prefill_dcp_size: 16, decode_dcp_size: 1 };
  assert.equal(chart.prepareInferenceCurveSeries([{ ...line, points: [custom] }])[0].points[0].strategyLabel,
    'Custom scheduling/DCP(P=16,D=1)');
  console.log('DCP sync mapping, phase precedence, strategy grouping, legacy data, and fingerprints passed.');
} finally {
  globalThis.fetch = originalFetch;
  await server.close();
}
