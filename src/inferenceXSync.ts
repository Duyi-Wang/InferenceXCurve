import type { InferenceCurveSeries } from './inferenceCurveChart';

export interface InferenceXSyncConfig {
  id: string;
  model: string;
  scenario?: string;
  isl: number;
  osl: number;
  precision: string;
  hardware: string;
  framework: string;
  specMethod: string;
  disagg: boolean;
  enabled: boolean;
}

export interface InferenceXAvailabilityRow {
  model: string;
  modelDisplay: string;
  scenario: string;
  isl: number;
  osl: number;
  precision: string;
  hardware: string;
  framework: string;
  specMethod: string;
  disagg: boolean;
  date: string;
}

export interface InferenceXSyncSummaryItem {
  configId: string;
  lineId: string;
  name: string;
  model: string;
  hardware: string;
  framework: string;
  precision: string;
  scenario: string;
  isl: number;
  osl: number;
  specMethod: string;
  disagg: boolean;
  pointCount: number;
  latestDate: string;
}

export interface InferenceXSyncResult {
  checkedAt: string;
  series: InferenceCurveSeries[];
  fingerprints: Record<string, string>;
  lineIdsByConfigKey: Record<string, string>;
  matchedCounts: Record<string, number>;
  missingConfigIds: string[];
  summary: InferenceXSyncSummaryItem[];
}

const INFERENCEX_REMOTE_API_BASE = 'https://inferencex.semianalysis.com/api/v1';
const INFERENCEX_DEV_PROXY_API_BASE = '/inferencex-api/v1';
const VITE_DEV_PORTS = new Set(['5173', '5174']);
const INFERENCEX_API_BASE =
  typeof window !== 'undefined' &&
  (VITE_DEV_PORTS.has(window.location.port) ||
    ['localhost', '127.0.0.1'].includes(window.location.hostname))
    ? INFERENCEX_DEV_PROXY_API_BASE
    : INFERENCEX_REMOTE_API_BASE;
// When the app talks to the remote API directly (i.e. not through the Vite dev
// proxy), every request is cross-origin. The InferenceX API does not send an
// Access-Control-Allow-Origin header, so the browser blocks the response and
// fetch() rejects with an opaque TypeError ("Failed to fetch"). We use this
// flag to surface a clear CORS message with workarounds instead.
const INFERENCEX_API_IS_CROSS_ORIGIN = INFERENCEX_API_BASE === INFERENCEX_REMOTE_API_BASE;
const INFERENCEX_CORS_HELP =
  'InferenceX sync is blocked by CORS: the browser could not reach ' +
  'https://inferencex.semianalysis.com directly because that API does not send an ' +
  'Access-Control-Allow-Origin header for cross-origin requests. To work around it for now, ' +
  'enable a CORS-unblocking browser extension (e.g. "Allow CORS" / "CORS Unblock") and retry, ' +
  'or route the request through a CORS proxy. (Running the app locally with `npm run dev` is ' +
  'unaffected because it uses the Vite dev proxy.)';
const NON_MTP_SPEC = 'none';
const MTP_SPEC = 'mtp';
const FIXED_SEQUENCE_SCENARIOS = new Set(['fixed', 'fixed-length', 'fixed length', 'isl/osl']);

const INTERACTIVITY_METRIC_KEYS = [
  'median_intvty',
  'median_interactivity',
  'interactivity',
  'p90_intvty',
  'p90_interactivity'
] as const;
const INTERACTIVITY_P90_METRIC_KEYS = [
  'p90_intvty',
  'p90_interactivity',
  'median_intvty',
  'median_interactivity',
  'interactivity'
] as const;
const THROUGHPUT_METRIC_KEYS = [
  'tput_per_gpu',
  'throughput_per_gpu',
  'token_throughput_per_gpu',
  'throughput'
] as const;
const TTFT_METRIC_KEYS = ['median_ttft', 'ttft', 'p90_ttft'] as const;
const TTFT_P90_METRIC_KEYS = ['p90_ttft', 'median_ttft', 'ttft'] as const;
const E2E_METRIC_KEYS = [
  'median_e2el',
  'e2el',
  'end_to_end',
  'endToEnd',
  'p90_e2el',
  'p90_end_to_end'
] as const;
const E2E_P90_METRIC_KEYS = [
  'p90_e2el',
  'p90_end_to_end',
  'median_e2el',
  'e2el',
  'end_to_end',
  'endToEnd'
] as const;
const NORMALIZED_E2E_METRIC_KEYS = [
  'p90_normalized_e2e_400_s',
  'p75_normalized_e2e_400_s',
  'normalized_e2e_400_s',
  'normalized_e2e',
  'normalized_e2el',
  'normalized_end_to_end',
  'p90_normalized_e2e',
  'p90_normalized_e2el'
] as const;
const SESSION_TIME_MINUTE_METRIC_KEYS = [
  'session_time',
  'normalized_session_time',
  'mean_normalized_session_time',
  'stime'
] as const;
const SESSION_TIME_SECOND_METRIC_KEYS = [
  'session_time_s',
  'normalized_session_time_s',
  'mean_normalized_session_time_s',
  'stime_s'
] as const;
const SESSION_TIME_METRIC_KEYS = [
  ...SESSION_TIME_MINUTE_METRIC_KEYS,
  ...SESSION_TIME_SECOND_METRIC_KEYS
] as const;
const PREFILL_TPS_PER_USER_METRIC_KEYS = [
  'prefill_tps_per_user',
  'prefill_tps_user',
  'p90_prefill_tps_per_user'
] as const;
const X_METRIC_KEYS = [
  INTERACTIVITY_METRIC_KEYS,
  TTFT_METRIC_KEYS,
  E2E_METRIC_KEYS,
  NORMALIZED_E2E_METRIC_KEYS,
  SESSION_TIME_METRIC_KEYS,
  PREFILL_TPS_PER_USER_METRIC_KEYS
] as const;

const MODEL_DISPLAY_NAMES: Record<string, string> = {
  dsr1: 'DeepSeek-R1-0528',
  gptoss120b: 'gpt-oss-120b',
  llama70b: 'Llama-3.3-70B-Instruct-FP8',
  'qwen3.5': 'Qwen-3.5-397B-A17B',
  'kimik2.5': 'Kimi-K2.5',
  'kimik2.6': 'Kimi-K2.5',
  'minimaxm2.5': 'MiniMax-M2.5',
  'minimaxm2.7': 'MiniMax-M2.5',
  glm5: 'GLM-5',
  'glm5.1': 'GLM-5',
  minimaxm3: 'MiniMax-M3',
  dsv4: 'DeepSeek-V4-Pro'
};

const MODEL_API_PARAMS: Record<string, string> = {
  // Some benchmark endpoints reject the internal availability key.
  minimaxm3: 'MiniMax-M3'
};

const DEFAULT_SYNC_MATRIX = {
  model: 'DeepSeek-R1-0528',
  shapes: [
    { isl: 1024, osl: 1024 },
    { isl: 8192, osl: 1024 }
  ],
  precisions: ['fp4', 'fp8'],
  targets: [
    { hardware: 'mi355x', framework: 'mori-sglang' },
    { hardware: 'b200', framework: 'dynamo-trt' },
    { hardware: 'b200', framework: 'dynamo-sglang' }
  ],
  specMethods: [NON_MTP_SPEC, MTP_SPEC]
} as const;

type InferenceXBenchmarkRecord = Record<string, unknown>;

export function createDefaultInferenceXSyncConfigs(): InferenceXSyncConfig[] {
  const configs: InferenceXSyncConfig[] = [];
  DEFAULT_SYNC_MATRIX.shapes.forEach((shape) => {
    DEFAULT_SYNC_MATRIX.precisions.forEach((precision) => {
      DEFAULT_SYNC_MATRIX.targets.forEach((target) => {
        DEFAULT_SYNC_MATRIX.specMethods.forEach((specMethod) => {
          const config = normalizeInferenceXSyncConfig({
            model: DEFAULT_SYNC_MATRIX.model,
            isl: shape.isl,
            osl: shape.osl,
            precision,
            hardware: target.hardware,
            framework: target.framework,
            specMethod,
            disagg: true,
            enabled: true
          });
          configs.push(config);
        });
      });
    });
  });
  return configs;
}

export function normalizeInferenceXSyncConfigs(value: unknown): InferenceXSyncConfig[] {
  if (!Array.isArray(value)) return createDefaultInferenceXSyncConfigs();
  const configs = Array.from(new Map(value
    .filter(isRecord)
    .map((item) => normalizeInferenceXSyncConfig(item))
    .filter((config) => config.model && config.precision && config.hardware && config.framework)
    .map((config) => [config.id, config])).values());
  return configs.length > 0 ? configs : createDefaultInferenceXSyncConfigs();
}

export function normalizeInferenceXSyncConfig(value: Partial<InferenceXSyncConfig>): InferenceXSyncConfig {
  const model = normalizeText(value.model) || DEFAULT_SYNC_MATRIX.model;
  const scenario = normalizeScenario(value.scenario);
  const isl = normalizeSequenceInteger(value.isl, scenario ? 0 : 1024);
  const osl = normalizeSequenceInteger(value.osl, scenario ? 0 : 1024);
  const precision = normalizeText(value.precision).toLowerCase() || 'fp4';
  const hardware = normalizeText(value.hardware).toLowerCase() || 'mi355x';
  const framework = normalizeText(value.framework).toLowerCase() || 'mori-sglang';
  const specMethod = normalizeSpecMethod(value.specMethod);
  const disagg = typeof value.disagg === 'boolean' ? value.disagg : true;
  const enabled = typeof value.enabled === 'boolean' ? value.enabled : true;
  const normalized = {
    model,
    scenario,
    isl,
    osl,
    precision,
    hardware,
    framework,
    specMethod,
    disagg,
    enabled
  };
  return {
    ...normalized,
    id: normalizeText(value.id) || makeInferenceXSyncConfigId(normalized)
  };
}

export function makeInferenceXSyncConfigId(
  config: Omit<InferenceXSyncConfig, 'id' | 'enabled'>
): string {
  return `cfg-${makeInferenceXSyncLineId(config)}`;
}

export function makeInferenceXSyncLineId(
  config: Omit<InferenceXSyncConfig, 'id' | 'enabled'>
): string {
  const scenario = normalizeScenario(config.scenario);
  return [
    getInferenceXDisplayModel(config.model),
    scenario || `isl-${config.isl}`,
    scenario ? '' : `osl-${config.osl}`,
    config.precision,
    config.hardware,
    config.framework,
    normalizeSpecMethod(config.specMethod) === MTP_SPEC ? MTP_SPEC : '',
    config.disagg ? '' : 'agg'
  ]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '');
}

export async function fetchInferenceXAvailability(signal?: AbortSignal): Promise<InferenceXAvailabilityRow[]> {
  const value = await fetchInferenceXJson(`${INFERENCEX_API_BASE}/availability`, signal);
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map(readAvailabilityRow).filter(isAvailabilityRow);
}

export async function fetchInferenceXSyncSeries(
  configs: InferenceXSyncConfig[],
  signal?: AbortSignal
): Promise<InferenceXSyncResult> {
  const enabledConfigs = configs.filter((config) => config.enabled);
  const checkedAt = new Date().toISOString();
  if (enabledConfigs.length === 0) {
    return {
      checkedAt,
      series: [],
      fingerprints: {},
      lineIdsByConfigKey: {},
      matchedCounts: {},
      missingConfigIds: [],
      summary: []
    };
  }

  const recordsByModel = await fetchBenchmarkRecordsByModel(enabledConfigs, signal);
  const series: InferenceCurveSeries[] = [];
  const fingerprints: Record<string, string> = {};
  const lineIdsByConfigKey: Record<string, string> = {};
  const matchedCounts: Record<string, number> = {};
  const missingConfigIds: string[] = [];
  const summary: InferenceXSyncSummaryItem[] = [];

  enabledConfigs.forEach((config) => {
    const normalized = normalizeInferenceXSyncConfig(config);
    const records = recordsByModel.get(resolveModelKey(normalized.model)) ?? [];
    const matched = records.filter((record) => benchmarkRecordMatchesConfig(record, normalized));
    const latestMatched = filterLatestBenchmarkRecords(matched);
    const lineId = makeInferenceXSyncLineId(normalized);
    lineIdsByConfigKey[normalized.id] = lineId;
    matchedCounts[normalized.id] = latestMatched.length;

    if (latestMatched.length === 0) {
      missingConfigIds.push(normalized.id);
      return;
    }

    const line = benchmarkRecordsToSeries(normalized, latestMatched);
    if (!line) {
      missingConfigIds.push(normalized.id);
      return;
    }

    const fingerprint = fingerprintInferenceCurveSeries(line);
    series.push(line);
    fingerprints[normalized.id] = fingerprint;
    summary.push(makeSummaryItem(normalized, line));
  });

  return { checkedAt, series, fingerprints, lineIdsByConfigKey, matchedCounts, missingConfigIds, summary };
}

export function fingerprintInferenceCurveSeries(line: InferenceCurveSeries): string {
  const payload = JSON.stringify({
    id: line.id,
    model: line.model ?? '',
    islOsl: line.islOsl ?? '',
    precision: line.precision ?? '',
    mtp: line.mtp ?? '',
    points: line.points.map((point) => ({
      interactivity: point.interactivity,
      throughput: point.throughput,
      ttft: point.ttft ?? '',
      endToEnd: point.endToEnd ?? '',
      normalizedEndToEnd: point.normalizedEndToEnd ?? '',
      sessionTime: point.sessionTime ?? '',
      prefillTpsPerUser: point.prefillTpsPerUser ?? '',
      strategy: point.strategy ?? '',
      precision: point.precision ?? '',
      tp: point.tp ?? '',
      ep: point.ep ?? '',
      dp_attention: point.dp_attention ?? '',
      num_prefill_gpu: point.num_prefill_gpu ?? '',
      num_decode_gpu: point.num_decode_gpu ?? '',
      prefill_tp: point.prefill_tp ?? '',
      prefill_ep: point.prefill_ep ?? '',
      prefill_dp_attention: point.prefill_dp_attention ?? '',
      prefill_num_workers: point.prefill_num_workers ?? '',
      decode_tp: point.decode_tp ?? '',
      decode_ep: point.decode_ep ?? '',
      decode_dp_attention: point.decode_dp_attention ?? '',
      decode_num_workers: point.decode_num_workers ?? '',
      disagg: point.disagg ?? '',
      is_multinode: point.is_multinode ?? '',
      kv_offload: point.kv_offload ?? '',
      concurrency: point.concurrency ?? '',
      label: point.label ?? ''
    }))
  });
  return `${line.points.length}:${hashString(payload)}`;
}

export function formatInferenceXConfigLabel(config: InferenceXSyncConfig): string {
  return [
    getInferenceXDisplayModel(config.model),
    formatSequenceLabel(config),
    config.precision.toUpperCase(),
    `${formatHardwareLabel(config.hardware)} / ${formatFrameworkLabel(config.framework)}`,
    normalizeSpecMethod(config.specMethod) === MTP_SPEC ? 'MTP' : 'Non-MTP',
    config.disagg ? 'disagg' : 'aggregated'
  ].filter(Boolean).join(' • ');
}

export function inferenceXAvailabilityRowMatchesConfig(
  row: InferenceXAvailabilityRow,
  config: InferenceXSyncConfig
): boolean {
  return (
    resolveModelKey(row.model) === resolveModelKey(config.model) &&
    sequenceMatches(row, config) &&
    row.precision.toLowerCase() === config.precision.toLowerCase() &&
    hardwareMatches(row.hardware, config.hardware) &&
    row.framework.toLowerCase() === config.framework.toLowerCase() &&
    normalizeSpecMethod(row.specMethod) === normalizeSpecMethod(config.specMethod) &&
    row.disagg === config.disagg
  );
}

export function getInferenceXDisplayModel(model: string): string {
  const key = resolveModelKey(model);
  return MODEL_DISPLAY_NAMES[key] ?? normalizeText(model) ?? key;
}

function readAvailabilityRow(record: Record<string, unknown>): InferenceXAvailabilityRow | null {
  const model = readString(record, 'model');
  const scenario = readRecordScenario(record);
  const isl = readNumber(record, 'isl') ?? 0;
  const osl = readNumber(record, 'osl') ?? 0;
  const precision = readString(record, 'precision').toLowerCase();
  const hardware = readString(record, 'hardware').toLowerCase();
  const framework = readString(record, 'framework').toLowerCase();
  if (!model || (!scenario && (isl <= 0 || osl <= 0)) || !precision || !hardware || !framework) return null;
  return {
    model,
    modelDisplay: getInferenceXDisplayModel(model),
    scenario,
    isl,
    osl,
    precision,
    hardware,
    framework,
    specMethod: normalizeSpecMethod(readString(record, 'spec_method')),
    disagg: readBoolean(record, 'disagg') ?? false,
    date: readString(record, 'date')
  };
}

function isAvailabilityRow(value: InferenceXAvailabilityRow | null): value is InferenceXAvailabilityRow {
  return value !== null;
}

async function fetchBenchmarkRecordsByModel(
  configs: InferenceXSyncConfig[],
  signal?: AbortSignal
): Promise<Map<string, InferenceXBenchmarkRecord[]>> {
  const models = Array.from(new Set(configs.map((config) => resolveModelKey(config.model))));
  const entries = await Promise.all(
    models.map(async (modelKey) => {
      const modelParam = modelKeyToApiParam(modelKey);
      const url = `${INFERENCEX_API_BASE}/benchmarks?model=${encodeURIComponent(modelParam)}`;
      const value = await fetchInferenceXJson(url, signal);
      const records = Array.isArray(value) ? value.filter(isRecord) : [];
      return [modelKey, records] as const;
    })
  );
  return new Map(entries);
}

async function fetchInferenceXJson(url: string, signal?: AbortSignal): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    // A blocked CORS request and a genuine network failure both surface as a
    // TypeError here; distinguish only when we know the call is cross-origin.
    if (INFERENCEX_API_IS_CROSS_ORIGIN && isLikelyCorsError(error)) {
      throw new InferenceXCorsError(INFERENCEX_CORS_HELP, { cause: error });
    }
    throw error;
  }
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`${response.status} ${response.statusText}${text ? `: ${text.slice(0, 220)}` : ''}`);
  }
  return response.json() as Promise<unknown>;
}

export class InferenceXCorsError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'InferenceXCorsError';
  }
}

function isLikelyCorsError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return false;
  // Browsers report a blocked cross-origin fetch as a TypeError ("Failed to
  // fetch" / "Load failed"), with no way to inspect the real cause from JS.
  return error instanceof TypeError;
}

function benchmarkRecordMatchesConfig(
  record: InferenceXBenchmarkRecord,
  config: InferenceXSyncConfig
): boolean {
  const model = readString(record, 'model');
  const scenario = readRecordScenario(record);
  const isl = readNumber(record, 'isl') ?? 0;
  const osl = readNumber(record, 'osl') ?? 0;
  const precision = readString(record, 'precision').toLowerCase();
  const hardware = readString(record, 'hardware').toLowerCase();
  const framework = readString(record, 'framework').toLowerCase();
  const specMethod = normalizeSpecMethod(readString(record, 'spec_method'));
  const disagg = readBoolean(record, 'disagg') ?? false;
  const metrics = readMetrics(record);
  const throughput = readMetricNumber(metrics, THROUGHPUT_METRIC_KEYS);
  const hasXMetric = X_METRIC_KEYS.some((keys) => readMetricNumber(metrics, keys) !== null);

  return (
    resolveModelKey(model) === resolveModelKey(config.model) &&
    sequenceValuesMatch({ scenario, isl, osl }, config) &&
    precision === config.precision.toLowerCase() &&
    hardwareMatches(hardware, config.hardware) &&
    framework === config.framework.toLowerCase() &&
    specMethod === normalizeSpecMethod(config.specMethod) &&
    disagg === config.disagg &&
    throughput !== null &&
    hasXMetric
  );
}

function filterLatestBenchmarkRecords(records: InferenceXBenchmarkRecord[]): InferenceXBenchmarkRecord[] {
  if (records.length <= 1) return records;
  const latestDate = records
    .map((record) => readBenchmarkDate(record))
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a))[0];
  if (!latestDate) return records;
  return records.filter((record) => readBenchmarkDate(record) === latestDate);
}

function readBenchmarkDate(record: InferenceXBenchmarkRecord): string {
  const value = readString(record, 'date');
  const match = value.match(/\d{4}-\d{2}-\d{2}/u);
  return match?.[0] ?? '';
}

function benchmarkRecordsToSeries(
  config: InferenceXSyncConfig,
  records: InferenceXBenchmarkRecord[]
): InferenceCurveSeries | null {
  const points = records
    .map((record) => benchmarkRecordToPoint(config, record))
    .filter((point): point is InferenceCurveSeries['points'][number] => point !== null)
    .sort(
      (a, b) =>
        compareOptionalNumbers(a.interactivity, b.interactivity) ||
        compareOptionalNumbers(a.endToEnd, b.endToEnd) ||
        compareOptionalNumbers(a.ttft, b.ttft) ||
        compareOptionalNumbers(a.normalizedEndToEnd, b.normalizedEndToEnd) ||
        compareOptionalNumbers(a.sessionTime, b.sessionTime) ||
        compareOptionalNumbers(a.prefillTpsPerUser, b.prefillTpsPerUser) ||
        b.throughput - a.throughput ||
        Number(a.concurrency ?? 0) - Number(b.concurrency ?? 0)
    );
  if (points.length === 0) return null;

  const lineName = formatInferenceXLineName(config.hardware, config.framework, config.specMethod);
  const islOsl = formatSequenceLabel(config);
  const model = getInferenceXDisplayModel(config.model);
  const precision = config.precision.toLowerCase();
  const mtp = normalizeSpecMethod(config.specMethod) === MTP_SPEC ? 'mtp' : 'non-mtp';
  return {
    id: makeInferenceXSyncLineId(config),
    name: lineName,
    hwKey: makeHwKey(config),
    model,
    islOsl,
    precision,
    mtp,
    title: `${model} ${islOsl} ${precision.toUpperCase()} ${lineName}`,
    points
  };
}

function benchmarkRecordToPoint(
  config: InferenceXSyncConfig,
  record: InferenceXBenchmarkRecord
): InferenceCurveSeries['points'][number] | null {
  const metrics = readMetrics(record);
  const preferP90Metrics = shouldPreferP90Metrics(record, config);
  const interactivity = readMetricNumber(
    metrics,
    preferP90Metrics ? INTERACTIVITY_P90_METRIC_KEYS : INTERACTIVITY_METRIC_KEYS
  );
  const throughput = readMetricNumber(metrics, THROUGHPUT_METRIC_KEYS);
  const ttft = readMetricNumber(
    metrics,
    preferP90Metrics ? TTFT_P90_METRIC_KEYS : TTFT_METRIC_KEYS
  );
  const endToEnd = readMetricNumber(
    metrics,
    preferP90Metrics ? E2E_P90_METRIC_KEYS : E2E_METRIC_KEYS
  );
  const normalizedEndToEnd = readMetricNumber(metrics, NORMALIZED_E2E_METRIC_KEYS);
  const sessionTime = readSessionTimeMetric(metrics);
  const prefillTpsPerUser = readMetricNumber(metrics, PREFILL_TPS_PER_USER_METRIC_KEYS);
  if (
    throughput === null ||
    (
      interactivity === null &&
      ttft === null &&
      endToEnd === null &&
      normalizedEndToEnd === null &&
      sessionTime === null &&
      prefillTpsPerUser === null
    )
  ) {
    return null;
  }

  const prefillTp = readNumber(record, 'prefill_tp');
  const prefillEp = readNumber(record, 'prefill_ep');
  const decodeTp = readNumber(record, 'decode_tp');
  const decodeEp = readNumber(record, 'decode_ep');
  const numPrefillGpu = readNumber(record, 'num_prefill_gpu');
  const numDecodeGpu = readNumber(record, 'num_decode_gpu');
  const prefillDpa = readBoolean(record, 'prefill_dp_attention');
  const decodeDpa = readBoolean(record, 'decode_dp_attention');
  const totalGpu = numPrefillGpu !== null && numDecodeGpu !== null ? numPrefillGpu + numDecodeGpu : null;
  const offload = readRecordOffloadConfig(record);

  const point: InferenceCurveSeries['points'][number] = {
    throughput,
    precision: config.precision.toLowerCase(),
    strategy: makeStrategyLabel(decodeTp, decodeEp),
    tp: totalGpu ?? decodeTp ?? undefined,
    concurrency: readNumber(record, 'conc') ?? undefined,
    label: makePointLabel(readString(record, 'date'), readString(record, 'run_url'), offload.label)
  };

  if (interactivity !== null) point.interactivity = interactivity;
  if (ttft !== null) point.ttft = ttft;
  if (endToEnd !== null) point.endToEnd = endToEnd;
  if (normalizedEndToEnd !== null) point.normalizedEndToEnd = normalizedEndToEnd;
  if (sessionTime !== null) point.sessionTime = sessionTime;
  if (prefillTpsPerUser !== null) point.prefillTpsPerUser = prefillTpsPerUser;
  if (prefillTp !== null) point.prefill_tp = prefillTp;
  if (prefillEp !== null) point.prefill_ep = prefillEp;
  if (decodeTp !== null) point.decode_tp = decodeTp;
  if (decodeEp !== null) point.decode_ep = decodeEp;
  if (numPrefillGpu !== null) point.num_prefill_gpu = numPrefillGpu;
  if (numDecodeGpu !== null) point.num_decode_gpu = numDecodeGpu;
  if (prefillDpa !== undefined) point.prefill_dp_attention = prefillDpa;
  if (decodeDpa !== undefined) point.decode_dp_attention = decodeDpa;
  if (prefillDpa !== undefined && prefillDpa === decodeDpa) point.dp_attention = prefillDpa;
  if (offload.label) point.kv_offload = offload.label;
  point.prefill_num_workers = readNumber(record, 'prefill_num_workers') ?? undefined;
  point.decode_num_workers = readNumber(record, 'decode_num_workers') ?? undefined;
  point.disagg = config.disagg;
  point.is_multinode = readBoolean(record, 'is_multinode') ?? undefined;

  return point;
}

function makeSummaryItem(
  config: InferenceXSyncConfig,
  line: InferenceCurveSeries
): InferenceXSyncSummaryItem {
  return {
    configId: config.id,
    lineId: line.id,
    name: line.name,
    model: getInferenceXDisplayModel(config.model),
    hardware: config.hardware,
    framework: config.framework,
    precision: config.precision,
    scenario: normalizeScenario(config.scenario),
    isl: config.isl,
    osl: config.osl,
    specMethod: normalizeSpecMethod(config.specMethod),
    disagg: config.disagg,
    pointCount: line.points.length,
    latestDate: latestPointDate(line)
  };
}

function latestPointDate(line: InferenceCurveSeries): string {
  return line.points
    .map((point) => String(point.label ?? '').match(/\bdate\s+(\d{4}-\d{2}-\d{2})\b/u)?.[1] ?? '')
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a))[0] ?? '';
}

function normalizeSpecMethod(value: string | undefined): string {
  const normalized = normalizeText(value).toLowerCase();
  if (!normalized || ['none', 'off', 'false', 'no', 'n', '0'].includes(normalized)) return NON_MTP_SPEC;
  if (['mtp', 'on', 'true', 'yes', 'y', '1'].includes(normalized)) return MTP_SPEC;
  return normalized;
}

function normalizeScenario(value: unknown): string {
  const normalized = normalizeText(String(value ?? '')).toLowerCase().replace(/[_\s]+/gu, '-');
  if (!normalized || FIXED_SEQUENCE_SCENARIOS.has(normalized) || FIXED_SEQUENCE_SCENARIOS.has(normalized.replace(/-/gu, ' '))) {
    return '';
  }
  return normalized;
}

function shouldPreferP90Metrics(
  record: InferenceXBenchmarkRecord,
  config: InferenceXSyncConfig
): boolean {
  return isAgenticScenario(readRecordScenario(record) || config.scenario);
}

function isAgenticScenario(value: string | undefined): boolean {
  const normalized = normalizeScenario(value);
  return normalized === 'agentic' ||
    normalized.startsWith('agentic-') ||
    (normalized.includes('agentic') && normalized.includes('trace'));
}

function normalizeOffloadKey(value: string | undefined): string {
  return normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/gu, '-').replace(/^-|-$/gu, '');
}

function formatOffloadLabelFromKey(key: string): string {
  const normalized = normalizeOffloadKey(key);
  if (!normalized) return '';
  if (normalized === 'offload-off') return 'KV offload off';
  const parts = normalized.replace(/^offload-?/u, '').split('-').filter(Boolean);
  const target = parts[0] ?? 'on';
  const backend = parts.slice(1).join('-');
  return [
    'KV offload',
    target === 'on' ? 'on' : target.toUpperCase(),
    backend ? `via ${formatFrameworkLabel(backend)}` : ''
  ].filter(Boolean).join(' ');
}

function readRecordOffloadConfig(record: Record<string, unknown>): { key: string; label: string } {
  const metrics = readMetrics(record);
  const mode = readStringFromKeys(record, ['offload_mode', 'offload mode']) ||
    readStringFromKeys(metrics, ['offload_mode', 'offload mode']);
  const kvOffloading = readStringFromKeys(record, ['kv_offloading', 'kv offloading']) ||
    readStringFromKeys(metrics, ['kv_offloading', 'kv offloading']);
  const backend = readStringFromKeys(record, ['kv_offload_backend', 'kv offload backend']) ||
    readStringFromKeys(metrics, ['kv_offload_backend', 'kv offload backend']);
  if (!mode && !kvOffloading && !backend) return { key: '', label: '' };

  const modeEnabled = normalizeOffloadFlag(mode);
  const kvEnabled = kvOffloading ? normalizeOffloadFlag(kvOffloading) : null;
  const enabled = modeEnabled ?? kvEnabled ?? Boolean(backend);
  if (!enabled) return { key: 'offload-off', label: 'KV offload off' };

  const target = normalizeOffloadKey(kvOffloading) || normalizeOffloadKey(mode) || 'on';
  const backendKey = normalizeOffloadKey(backend);
  const key = ['offload', target, backendKey].filter(Boolean).join('-');
  return { key, label: formatOffloadLabelFromKey(key) };
}

function normalizeOffloadFlag(value: string): boolean | null {
  const normalized = normalizeOffloadKey(value);
  if (!normalized) return null;
  if (['off', 'none', 'false', 'no', 'n', '0', 'disabled', 'disable'].includes(normalized)) return false;
  if (['on', 'true', 'yes', 'y', '1', 'enabled', 'enable'].includes(normalized)) return true;
  return true;
}

function formatSequenceLabel(config: Pick<InferenceXSyncConfig, 'scenario' | 'isl' | 'osl'>): string {
  const scenario = normalizeScenario(config.scenario);
  return scenario ? formatScenarioLabel(scenario) : `ISL ${config.isl} / OSL ${config.osl}`;
}

function formatScenarioLabel(value: string): string {
  return value
    .split(/[-_\s]+/u)
    .filter(Boolean)
    .map((part) => {
      if (part.toLowerCase() === 'ai') return 'AI';
      return part[0] ? `${part[0].toUpperCase()}${part.slice(1)}` : part;
    })
    .join(' ');
}

function sequenceMatches(row: InferenceXAvailabilityRow, config: InferenceXSyncConfig): boolean {
  return sequenceValuesMatch(row, config);
}

function sequenceValuesMatch(
  row: Pick<InferenceXAvailabilityRow, 'scenario' | 'isl' | 'osl'>,
  config: Pick<InferenceXSyncConfig, 'scenario' | 'isl' | 'osl'>
): boolean {
  const configScenario = normalizeScenario(config.scenario);
  const rowScenario = normalizeScenario(row.scenario);
  if (configScenario || rowScenario) return configScenario === rowScenario;
  return row.isl === config.isl && row.osl === config.osl;
}

function compareOptionalNumbers(a: number | undefined, b: number | undefined): number {
  if (a === undefined && b === undefined) return 0;
  if (a === undefined) return 1;
  if (b === undefined) return -1;
  return a - b;
}

function resolveModelKey(model: string): string {
  const normalized = normalizeText(model).toLowerCase();
  if (!normalized) return 'dsr1';
  if (MODEL_DISPLAY_NAMES[normalized]) return normalized;
  const displayMatch = Object.entries(MODEL_DISPLAY_NAMES).find(
    ([, display]) => display.toLowerCase() === normalized
  );
  return displayMatch?.[0] ?? normalized;
}

function modelKeyToApiParam(modelKey: string): string {
  return MODEL_API_PARAMS[modelKey] ?? MODEL_DISPLAY_NAMES[modelKey] ?? modelKey;
}

function hardwareMatches(recordHardware: string, configHardware: string): boolean {
  return recordHardware.toLowerCase() === configHardware.toLowerCase();
}

function makeHwKey(config: InferenceXSyncConfig): string {
  const suffix = normalizeSpecMethod(config.specMethod) === MTP_SPEC ? '_mtp' : '';
  return `${config.hardware.toLowerCase()}_${config.framework.toLowerCase()}${suffix}`;
}

function formatInferenceXLineName(
  hardware: string,
  framework: string,
  specMethod: string
): string {
  const suffix = normalizeSpecMethod(specMethod) === MTP_SPEC ? ' MTP' : '';
  return `${formatHardwareLabel(hardware)} (${formatFrameworkLabel(framework)}${suffix})`;
}

function formatHardwareLabel(value: string): string {
  return value
    .split(/[-_\s]+/u)
    .filter(Boolean)
    .map((part) => part.toUpperCase())
    .join(' ');
}

function formatFrameworkLabel(value: string): string {
  const replacements: Record<string, string> = {
    mori: 'MoRI',
    sglang: 'SGLang',
    dynamo: 'Dynamo',
    trt: 'TRT',
    tensorrt: 'TRT',
    vllm: 'vLLM',
    lmcache: 'LMCache'
  };
  return value
    .toLowerCase()
    .split(/[-_\s]+/u)
    .filter(Boolean)
    .map((part) => replacements[part] ?? part.toUpperCase())
    .join(' ');
}

function makeStrategyLabel(tp: number | null, ep: number | null): string | undefined {
  if (tp === null && ep === null) return undefined;
  if (tp !== null && ep !== null) return `TP${tp}/EP${ep}`;
  if (tp !== null) return `TP${tp}`;
  return `EP${ep}`;
}

function makePointLabel(date: string, runUrl: string, offloadLabel = ''): string {
  return [
    date ? `date ${date}` : '',
    runUrl ? `run_url ${runUrl}` : '',
    offloadLabel ? offloadLabel : ''
  ].filter(Boolean).join('; ');
}

function readMetrics(record: InferenceXBenchmarkRecord): Record<string, unknown> {
  const metrics = record.metrics;
  return isRecord(metrics) ? metrics : {};
}

function readRecordScenario(record: Record<string, unknown>): string {
  return normalizeScenario(
    readStringFromKeys(record, [
      'scenario',
      'benchmark_scenario',
      'benchmark scenario',
      'scenario_type',
      'scenario type',
      'benchmark_type',
      'benchmark type',
      'workload',
      'workload_type',
      'workload type',
      'trace',
      'trace_type',
      'trace type',
      'dataset',
      'task'
    ])
  );
}

function readStringFromKeys(record: Record<string, unknown>, keys: readonly string[]): string {
  for (const key of keys) {
    const value = readString(record, key);
    if (value) return value;
  }
  return '';
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (value === null || value === undefined) return '';
  return normalizeText(String(value));
}

function readMetricNumber(record: Record<string, unknown>, keys: readonly string[]): number | null {
  for (const key of keys) {
    const value = readNumber(record, key);
    if (value !== null) return value;
  }
  return null;
}

function readSessionTimeMetric(record: Record<string, unknown>): number | null {
  const minutes = readMetricNumber(record, SESSION_TIME_MINUTE_METRIC_KEYS);
  if (minutes !== null) return minutes;
  const seconds = readMetricNumber(record, SESSION_TIME_SECOND_METRIC_KEYS);
  return seconds !== null ? seconds / 60 : null;
}

function readNumber(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.trim().replaceAll(',', ''));
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function readBoolean(record: Record<string, unknown>, key: string): boolean | undefined {
  const value = record[key];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
    if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  }
  return undefined;
}

function normalizeText(value: string | undefined): string {
  return (value ?? '').replace(/\u00a0/g, ' ').trim();
}

function normalizeSequenceInteger(value: unknown, fallback: number): number {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value.trim().replaceAll(',', ''))
        : NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : fallback;
}

function hashString(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
