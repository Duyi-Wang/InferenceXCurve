import './styles.css';

import { strFromU8, unzipSync } from 'fflate';

import { exampleSeries } from './exampleData';
import {
  getAvailablePrecisions,
  prepareInferenceCurveSeries,
  renderInferenceCurveChart,
  resetInferenceCurveZoom,
  resolveInferenceCurveColors,
  type InferenceCurveChartOptions,
  type InferenceCurveSeries
} from './inferenceCurveChart';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root');

type Theme = 'dark' | 'light';
type SeriesField =
  | 'id'
  | 'name'
  | 'model'
  | 'islOsl'
  | 'precision'
  | 'mtp'
  | 'marker'
  | 'title'
  | 'color'
  | 'lineStyle';
type PointRow = Record<string, string>;

interface AppState {
  theme: Theme;
  activeSeriesIds: Set<string>;
  selectedPrecisions: Set<string>;
  modelFilter: string;
  islOslFilter: string;
  mtpFilter: string;
  showNonOptimalPoints: boolean;
  hidePointLabels: boolean;
  useAdvancedLabels: boolean;
  showGradientLabels: boolean;
  showLineLabels: boolean;
  highContrast: boolean;
  logY: boolean;
  search: string;
}

interface TableColumn {
  key: string;
  label: string;
  required?: boolean;
  numeric?: boolean;
}

interface SeriesDraft {
  id: string;
  name: string;
  model: string;
  islOsl: string;
  precision: string;
  mtp: string;
  marker: string;
  title: string;
  color: string;
  lineStyle: string;
  renderOrder: number;
  collapsed: boolean;
  points: PointRow[];
}

interface PendingImportDraft {
  selected: boolean;
  draft: SeriesDraft;
}

interface PendingMergeLine {
  selected: boolean;
  main: boolean;
  draftIndex: number;
  draftId: string;
}

interface PendingMergeGroup {
  key: string;
  label: string;
  lines: PendingMergeLine[];
}

interface PersistedAppState {
  theme?: Theme;
  activeSeriesIds?: string[];
  selectedPrecisions?: string[];
  modelFilter?: string;
  islOslFilter?: string;
  mtpFilter?: string;
  showNonOptimalPoints?: boolean;
  hidePointLabels?: boolean;
  useAdvancedLabels?: boolean;
  showGradientLabels?: boolean;
  showLineLabels?: boolean;
  highContrast?: boolean;
  logY?: boolean;
  search?: string;
}

interface PersistedAppData {
  version: 1;
  savedAt: string;
  currentSeries: InferenceCurveSeries[];
  seriesDrafts: SeriesDraft[];
  state: PersistedAppState;
}

interface InitialDataState {
  currentSeries: InferenceCurveSeries[];
  seriesDrafts: SeriesDraft[];
  state: AppState;
  loadedFromStorage: boolean;
}

interface ColorPreset {
  name: string;
  value: string;
}

interface LineStyleOption {
  value: string;
  label: string;
  dasharray: string | null;
}

interface ParsedPointMetadata {
  num_prefill_gpu?: number;
  num_decode_gpu?: number;
  prefill_tp?: number;
  prefill_ep?: number;
  prefill_dp_attention?: boolean;
  decode_dp_attention?: boolean;
}

interface ParsedStrategyMetadata {
  decode_tp?: number;
  decode_ep?: number;
}

interface GitHubRunRef {
  owner: string;
  repo: string;
  runId: string;
}

interface GitHubArtifact {
  id: number;
  name: string;
  expired: boolean;
  archive_download_url: string;
}

interface GitHubArtifactsResponse {
  artifacts: GitHubArtifact[];
}

interface ImportedPointRow {
  interactivity: number;
  throughput: number;
  model: string;
  islOsl: string;
  precision: string;
  mtp: string;
  hardware: string;
  framework: string;
  specMethod: string;
  lineName: string;
  title: string;
  point: InferenceCurveSeries['points'][number];
}

const ALL_VALUE = '__all__';
const CUSTOM_VALUE = '__custom__';
const CUSTOM_LINE_STYLE = '__custom_line_style__';
const MTP_VALUE = 'mtp';
const NON_MTP_VALUE = 'non-mtp';
const DEFAULT_MODEL = 'Default Model';
const DEFAULT_ISL_OSL = 'Default ISL/OSL';
const DEFAULT_PRECISION = 'default';
const DEFAULT_LINE_STYLE = 'solid';
const LOCAL_STORAGE_KEY = 'inferencex-curve:user-data:v1';
const LOCAL_SAVE_DEBOUNCE_MS = 350;

const DB_MODEL_TO_DISPLAY: Record<string, string> = {
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
  dsv4: 'DeepSeek-V4-Pro'
};

const MODEL_PREFIX_ALIASES: Record<string, string> = {
  gptoss: 'gptoss120b',
  dsv4pro: 'dsv4'
};

const MODEL_PATH_TO_DB_KEY: Record<string, string> = {
  'nvidia/deepseek-r1-0528-fp4-v2': 'dsr1',
  'nvidia/deepseek-r1-0528-fp4': 'dsr1',
  'deepseek-ai/deepseek-r1-0528': 'dsr1',
  'deepseek-ai/deepseek-r1': 'dsr1',
  'amd/deepseek-r1-0528-mxfp4': 'dsr1',
  'amd/deepseek-r1-0528-mxfp4-preview': 'dsr1',
  '/mnt/lustre01/models/deepseek-r1-0528-fp4-v2': 'dsr1',
  '/models/deepseek-r1': 'dsr1',
  '/models/deepseek-r1-0528-mxfp4-preview': 'dsr1',
  'deepseek-r1-0528': 'dsr1',
  'deepseek-r1-0528-fp4-v2': 'dsr1',
  'deepseek-r1-0528-nvfp4-v2': 'dsr1',
  'dsr1-0528-fp8': 'dsr1',
  'dsr1-0528-nvfp4-v2': 'dsr1',
  'dsr1-fp8': 'dsr1',
  'openai/gpt-oss-120b': 'gptoss120b',
  '/mnt/lustre01/models/gpt-oss-120b': 'gptoss120b',
  'nvidia/llama-3.3-70b-instruct-fp8': 'llama70b',
  'nvidia/llama-3.3-70b-instruct-fp4': 'llama70b',
  'amd/llama-3.3-70b-instruct-fp8-kv': 'llama70b',
  'amd/llama-3.3-70b-instruct-mxfp4-preview': 'llama70b',
  'qwen/qwen3.5-397b-a17b': 'qwen3.5',
  'qwen/qwen3.5-397b-a17b-fp8': 'qwen3.5',
  'moonshotai/kimi-k2.5': 'kimik2.5',
  'minimaxai/minimax-m2.5': 'minimaxm2.5',
  'zai-org/glm-5-fp8': 'glm5',
  'amd/glm-5.1-mxfp4': 'glm5.1',
  'deepseek-ai/deepseek-v4-pro': 'dsv4'
};

const MODEL_KEY_PRECISION_SUFFIX = /-(?:fp4|fp8|mxfp4|nvfp4)(?:-.*)?$/iu;

const pointColumns: TableColumn[] = [
  { key: 'shape', label: 'Marker' },
  { key: 'interactivity', label: 'Interactivity', required: true, numeric: true },
  { key: 'throughput', label: 'Throughput/GPU', required: true, numeric: true },
  { key: 'num_prefill_gpu', label: 'Prefill GPUs', numeric: true },
  { key: 'num_decode_gpu', label: 'Decode GPUs', numeric: true },
  { key: 'prefill_tp', label: 'Prefill TP', numeric: true },
  { key: 'prefill_ep', label: 'Prefill EP', numeric: true },
  { key: 'prefill_dp_attention', label: 'Prefill DPA' },
  { key: 'decode_tp', label: 'Decode TP', numeric: true },
  { key: 'decode_ep', label: 'Decode EP', numeric: true },
  { key: 'decode_dp_attention', label: 'Decode DPA' },
  { key: 'concurrency', label: 'Concurrency', numeric: true },
  { key: 'label', label: 'Note' }
];

const hiddenPointKeys = ['strategy', 'tp', 'dp_attention'] as const;
const knownPointKeys = new Set([...pointColumns.map((column) => column.key), ...hiddenPointKeys]);

const pointShapeOptions = [
  { value: '', label: 'Default', symbol: '●' },
  { value: 'circle', label: 'Circle', symbol: '●' },
  { value: 'square', label: 'Square', symbol: '■' },
  { value: 'triangle', label: 'Triangle', symbol: '▲' },
  { value: 'diamond', label: 'Diamond', symbol: '◆' },
  { value: 'star', label: 'Star', symbol: '★' },
  { value: 'plus', label: 'Plus', symbol: '✚' },
  { value: 'cross', label: 'Cross', symbol: '✕' }
];

const seriesCsvColumns: TableColumn[] = [
  { key: 'series_id', label: 'Line ID' },
  { key: 'series_name', label: 'Line Name' },
  { key: 'model', label: 'Model' },
  { key: 'islOsl', label: 'ISL/OSL' },
  { key: 'precision', label: 'Precision' },
  { key: 'mtp', label: 'MTP' },
  { key: 'marker', label: 'Line Marker' },
  { key: 'title', label: 'Title' },
  { key: 'color', label: 'Color' },
  { key: 'lineStyle', label: 'Line Type' },
  { key: 'renderOrder', label: 'Layer' }
];

const colorPresets: ColorPreset[] = [
  { name: 'NVIDIA 1', value: 'oklch(0.780 0.15 126.3)' },
  { name: 'NVIDIA 2', value: 'oklch(0.687 0.15 138.8)' },
  { name: 'NVIDIA 3', value: 'oklch(0.593 0.15 151.3)' },
  { name: 'NVIDIA 4', value: 'oklch(0.500 0.15 163.8)' },
  { name: 'AMD 1', value: 'oklch(0.780 0.22 19.5)' },
  { name: 'AMD 2', value: 'oklch(0.500 0.22 34.5)' },
  { name: 'Tableau Blue', value: '#4e79a7' },
  { name: 'Tableau Orange', value: '#f28e2c' },
  { name: 'Tableau Teal', value: '#76b7b2' },
  { name: 'Tableau Yellow', value: '#edc949' },
  { name: 'Tableau Purple', value: '#af7aa1' },
  { name: 'Tableau Brown', value: '#9c755f' },
  { name: 'Tableau Gray', value: '#bab0ab' }
];

const colorInputFallbacks = [
  '#7edc54',
  '#45bf64',
  '#009f6a',
  '#00826b',
  '#ff7059',
  '#a33b00',
  '#4e79a7',
  '#f28e2c',
  '#76b7b2',
  '#edc949',
  '#af7aa1',
  '#9c755f',
  '#bab0ab'
];

const lineStyleOptions: LineStyleOption[] = [
  { value: 'solid', label: 'Solid', dasharray: null },
  { value: 'dashed', label: 'Dashed', dasharray: '8 5' },
  { value: 'dotted', label: 'Dotted', dasharray: '2 5' },
  { value: 'dashdot', label: 'Dash Dot', dasharray: '8 4 2 4' },
  { value: 'long-dash', label: 'Long Dash', dasharray: '12 5' }
];

function createInitialDataState(): InitialDataState {
  const defaultSeries = structuredClone(exampleSeries);
  const persisted = loadPersistedAppData();
  if (!persisted) {
    return {
      currentSeries: defaultSeries,
      seriesDrafts: draftsFromSeriesForRestore(defaultSeries),
      state: createInitialState(defaultSeries),
      loadedFromStorage: false
    };
  }

  const restoredDrafts = persisted.seriesDrafts.length
    ? persisted.seriesDrafts
    : draftsFromSeriesForRestore(persisted.currentSeries);
  let restoredSeries = persisted.currentSeries;
  try {
    const draftSeries = draftsToSeriesAllowEmpty(restoredDrafts);
    if (draftSeries.length > 0 || persisted.currentSeries.length === 0) {
      restoredSeries = draftSeries;
    }
  } catch {
    restoredSeries = persisted.currentSeries;
  }

  return {
    currentSeries: restoredSeries,
    seriesDrafts: restoredDrafts.length ? restoredDrafts : [makeRestoredEmptySeriesDraft(0)],
    state: restoreAppState(createInitialState(restoredSeries), persisted.state, restoredSeries),
    loadedFromStorage: true
  };
}

function loadPersistedAppData(): PersistedAppData | null {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (!isRecord(data) || data.version !== 1) return null;

    return {
      version: 1,
      savedAt: readPersistedText(data, 'savedAt'),
      currentSeries: Array.isArray(data.currentSeries) ? readNativeSeries(data.currentSeries) : [],
      seriesDrafts: restorePersistedSeriesDrafts(data.seriesDrafts),
      state: restorePersistedState(data.state)
    };
  } catch (error) {
    console.warn('Could not load saved browser data.', error);
    return null;
  }
}

function draftsFromSeriesForRestore(series: InferenceCurveSeries[]): SeriesDraft[] {
  return series.length > 0 ? seriesToDrafts(series) : [makeRestoredEmptySeriesDraft(0)];
}

function makeRestoredEmptySeriesDraft(index: number): SeriesDraft {
  return {
    id: `line-${index + 1}`,
    name: `Line ${index + 1}`,
    model: DEFAULT_MODEL,
    islOsl: DEFAULT_ISL_OSL,
    precision: DEFAULT_PRECISION,
    mtp: NON_MTP_VALUE,
    marker: '',
    title: '',
    color: '',
    lineStyle: DEFAULT_LINE_STYLE,
    renderOrder: index,
    collapsed: true,
    points: [makeEmptyPointRow()]
  };
}

function restorePersistedSeriesDrafts(value: unknown): SeriesDraft[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map((draft, index) => ({
    id: readPersistedText(draft, 'id', `line-${index + 1}`),
    name: readPersistedText(draft, 'name', `Line ${index + 1}`),
    model: readPersistedText(draft, 'model', DEFAULT_MODEL),
    islOsl: readPersistedText(draft, 'islOsl', DEFAULT_ISL_OSL),
    precision: readPersistedText(draft, 'precision', DEFAULT_PRECISION),
    mtp: normalizeMtpValue(readPersistedText(draft, 'mtp', NON_MTP_VALUE)),
    marker: normalizePointShapeValue(readPersistedText(draft, 'marker')),
    title: readPersistedText(draft, 'title'),
    color: readPersistedText(draft, 'color'),
    lineStyle: readPersistedText(draft, 'lineStyle', DEFAULT_LINE_STYLE) || DEFAULT_LINE_STYLE,
    renderOrder: readPersistedNumber(draft, 'renderOrder', index),
    collapsed: typeof draft.collapsed === 'boolean' ? draft.collapsed : true,
    points: restorePersistedPointRows(draft.points)
  }));
}

function restorePersistedPointRows(value: unknown): PointRow[] {
  if (!Array.isArray(value)) return [makeEmptyPointRow()];
  const rows = value.filter(isRecord).map((point) => {
    const row = makeEmptyPointRow();
    [...pointColumns.map((column) => column.key), ...hiddenPointKeys].forEach((key) => {
      row[key] = formatPointFieldValue(point[key]);
    });
    row.shape = normalizePointShapeValue(row.shape);
    return row;
  });
  return rows.length ? rows : [makeEmptyPointRow()];
}

function restorePersistedState(value: unknown): PersistedAppState {
  if (!isRecord(value)) return {};
  return {
    theme: value.theme === 'light' || value.theme === 'dark' ? value.theme : undefined,
    activeSeriesIds: readPersistedStringArray(value.activeSeriesIds),
    selectedPrecisions: readPersistedStringArray(value.selectedPrecisions),
    modelFilter: readPersistedText(value, 'modelFilter') || undefined,
    islOslFilter: readPersistedText(value, 'islOslFilter') || undefined,
    mtpFilter: readPersistedText(value, 'mtpFilter') || undefined,
    showNonOptimalPoints: readPersistedBoolean(value.showNonOptimalPoints),
    hidePointLabels: readPersistedBoolean(value.hidePointLabels),
    useAdvancedLabels: readPersistedBoolean(value.useAdvancedLabels),
    showGradientLabels: readPersistedBoolean(value.showGradientLabels),
    showLineLabels: readPersistedBoolean(value.showLineLabels),
    highContrast: readPersistedBoolean(value.highContrast),
    logY: readPersistedBoolean(value.logY),
    search: readPersistedText(value, 'search')
  };
}

function restoreAppState(defaults: AppState, saved: PersistedAppState, series: InferenceCurveSeries[]): AppState {
  const ids = new Set(series.map((line) => line.id));
  const activeSeriesIds = (saved.activeSeriesIds ?? []).filter((id) => ids.has(id));
  const precisionValues = new Set(getAvailablePrecisions(series));
  const selectedPrecisions = (saved.selectedPrecisions ?? []).filter((precision) =>
    precisionValues.has(precision)
  );

  return {
    theme: saved.theme ?? defaults.theme,
    activeSeriesIds:
      activeSeriesIds.length > 0 || series.length === 0
        ? new Set(activeSeriesIds)
        : new Set(defaults.activeSeriesIds),
    selectedPrecisions:
      selectedPrecisions.length > 0 || precisionValues.size === 0
        ? new Set(selectedPrecisions)
        : new Set(defaults.selectedPrecisions),
    modelFilter: saved.modelFilter ?? defaults.modelFilter,
    islOslFilter: saved.islOslFilter ?? defaults.islOslFilter,
    mtpFilter: saved.mtpFilter ?? defaults.mtpFilter,
    showNonOptimalPoints: saved.showNonOptimalPoints ?? defaults.showNonOptimalPoints,
    hidePointLabels: saved.hidePointLabels ?? defaults.hidePointLabels,
    useAdvancedLabels: saved.useAdvancedLabels ?? defaults.useAdvancedLabels,
    showGradientLabels: saved.showGradientLabels ?? defaults.showGradientLabels,
    showLineLabels: saved.showLineLabels ?? defaults.showLineLabels,
    highContrast: saved.highContrast ?? defaults.highContrast,
    logY: saved.logY ?? defaults.logY,
    search: saved.search ?? defaults.search
  };
}

function serializeAppState(): PersistedAppState {
  return {
    theme: state.theme,
    activeSeriesIds: Array.from(state.activeSeriesIds),
    selectedPrecisions: Array.from(state.selectedPrecisions),
    modelFilter: state.modelFilter,
    islOslFilter: state.islOslFilter,
    mtpFilter: state.mtpFilter,
    showNonOptimalPoints: state.showNonOptimalPoints,
    hidePointLabels: state.hidePointLabels,
    useAdvancedLabels: state.useAdvancedLabels,
    showGradientLabels: state.showGradientLabels,
    showLineLabels: state.showLineLabels,
    highContrast: state.highContrast,
    logY: state.logY,
    search: state.search
  };
}

function getSeriesForPersistence(): InferenceCurveSeries[] {
  try {
    const parsedSeries = draftsToSeriesAllowEmpty(seriesDrafts);
    if (parsedSeries.length > 0 || currentSeries.length === 0) return parsedSeries;
  } catch {
    return currentSeries;
  }
  return currentSeries;
}

function scheduleLocalSave(): void {
  if (localSaveTimer !== null) window.clearTimeout(localSaveTimer);
  localSaveTimer = window.setTimeout(() => {
    localSaveTimer = null;
    saveLocalDataNow();
  }, LOCAL_SAVE_DEBOUNCE_MS);
}

function saveLocalDataNow(): void {
  if (localSaveTimer !== null) {
    window.clearTimeout(localSaveTimer);
    localSaveTimer = null;
  }

  try {
    const payload: PersistedAppData = {
      version: 1,
      savedAt: new Date().toISOString(),
      currentSeries: getSeriesForPersistence(),
      seriesDrafts,
      state: serializeAppState()
    };
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    localStorageWarningShown = false;
  } catch (error) {
    if (!localStorageWarningShown) {
      console.warn('Could not save browser data.', error);
      localStorageWarningShown = true;
    }
  }
}

function readPersistedText(record: Record<string, unknown>, key: string, fallback = ''): string {
  const value = record[key];
  if (value === null || value === undefined) return fallback;
  return normalizeCellText(String(value));
}

function readPersistedStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const values = value.map((item) => normalizeCellText(String(item))).filter(Boolean);
  return values.length ? values : undefined;
}

function readPersistedBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function readPersistedNumber(record: Record<string, unknown>, key: string, fallback: number): number {
  const value = record[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

const initialData = createInitialDataState();
let currentSeries: InferenceCurveSeries[] = initialData.currentSeries;
let seriesDrafts: SeriesDraft[] = initialData.seriesDrafts;
let pendingImportDrafts: PendingImportDraft[] = [];
let pendingMergeGroups: PendingMergeGroup[] = [];
let state: AppState = initialData.state;
let localSaveTimer: number | null = null;
let localStorageWarningShown = false;
let draggedSeriesIndex: number | null = null;

sortSeriesDraftsByLayer();
normalizeDraftRenderOrderFromPanelOrder();
syncCurrentSeriesOrderFromDrafts();
reconcileFiltersForSeries(currentSeries);
reconcileActiveSeriesForChart();

app.innerHTML = `
  <main class="container page">
    <section class="filter-card no-export">
      <label>
        <span>Model</span>
        <select id="model-filter"></select>
      </label>
      <label>
        <span>ISL/OSL</span>
        <select id="isl-osl-filter"></select>
      </label>
      <label>
        <span>Precision</span>
        <select id="precision-filter"></select>
      </label>
      <label>
        <span>MTP</span>
        <select id="mtp-filter"></select>
      </label>
    </section>

    <section class="chart-card">
      <div class="chart-card-toolbar no-export">
        <button id="download-png" class="tool-button" type="button" title="Download PNG" aria-label="Download PNG">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16"/></svg>
        </button>
        <button id="download-csv" class="tool-button" type="button" title="Download CSV" aria-label="Download CSV">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 4h16v16H4zM8 4v16m8-16v16M4 10h16M4 16h16"/></svg>
        </button>
        <button id="reset-zoom" class="tool-button" type="button" title="Reset zoom" aria-label="Reset zoom">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/></svg>
        </button>
      </div>

      <figcaption class="chart-caption">
        <h2>Token Throughput per GPU vs. Interactivity</h2>
        <p id="chart-subtitle"></p>
      </figcaption>

      <div class="chart-layout">
        <div class="chart-main">
          <div id="chart"></div>
          <p class="chart-instructions no-export">Shift+Scroll to zoom • Drag to pan • Double-click to reset • Hover a point for details</p>
        </div>
        <aside id="legend" class="legend-shell no-export"></aside>
      </div>
    </section>

    <section class="data-card">
      <div class="data-card-header">
        <div>
          <h2>Line Projects</h2>
          <p>Edit shared line fields once, then paste point rows from Excel. Changes are auto-saved in this browser.</p>
        </div>
        <div class="data-header-actions">
          <button id="add-series" class="action-button" type="button">
            ${renderIcon('plus')}
            <span>Add Line</span>
          </button>
          <button id="merge-lines" class="action-button" type="button">
            ${renderIcon('merge')}
            <span>Merge Lines</span>
          </button>
          <button id="reset-data" class="action-button" type="button">
            ${renderIcon('refresh')}
            <span>Reset Example</span>
          </button>
          <button id="clear-data" class="action-button danger" type="button">
            ${renderIcon('trash')}
            <span>Clear Data</span>
          </button>
        </div>
      </div>

      <div class="action-import-panel">
        <label class="action-import-url">
          <span>GitHub Actions Run URL</span>
          <input
            id="github-action-url"
            type="text"
            placeholder="https://github.com/owner/repo/actions/runs/123456789"
          />
        </label>
        <label class="action-import-token">
          <span>Token</span>
          <input
            id="github-token"
            type="password"
            autocomplete="off"
            placeholder="Optional"
          />
        </label>
        <button id="import-action-data" class="action-button" type="button">
          ${renderIcon('download-cloud')}
          <span>Import Action Data</span>
        </button>
        <p class="action-import-help">
          Unauthenticated GitHub API requests can be rate limited. Paste a GitHub token here for a higher limit; private repositories need Actions read access.
        </p>
        <p id="github-import-status" class="action-import-status" role="status"></p>
        <div id="github-import-preview" class="import-preview"></div>
      </div>

      <div id="merge-preview" class="merge-preview"></div>

      <div id="series-editor" class="series-editor"></div>

      <div class="data-actions">
        <button id="render-data" type="button" class="primary action-button">
          ${renderIcon('play')}
          <span>Render Chart</span>
        </button>
        <p id="status" class="status" role="status"></p>
      </div>
    </section>
  </main>
`;

const chartEl = document.querySelector<HTMLElement>('#chart')!;
const legendEl = document.querySelector<HTMLElement>('#legend')!;
const chartSubtitleEl = document.querySelector<HTMLParagraphElement>('#chart-subtitle')!;
const modelFilterEl = document.querySelector<HTMLSelectElement>('#model-filter')!;
const islOslFilterEl = document.querySelector<HTMLSelectElement>('#isl-osl-filter')!;
const precisionFilterEl = document.querySelector<HTMLSelectElement>('#precision-filter')!;
const mtpFilterEl = document.querySelector<HTMLSelectElement>('#mtp-filter')!;
const seriesEditorEl = document.querySelector<HTMLElement>('#series-editor')!;
const statusEl = document.querySelector<HTMLParagraphElement>('#status')!;
const githubActionUrlEl = document.querySelector<HTMLInputElement>('#github-action-url')!;
const githubTokenEl = document.querySelector<HTMLInputElement>('#github-token')!;
const importActionDataEl = document.querySelector<HTMLButtonElement>('#import-action-data')!;
const githubImportStatusEl = document.querySelector<HTMLParagraphElement>('#github-import-status')!;
const githubImportPreviewEl = document.querySelector<HTMLElement>('#github-import-preview')!;
const mergeLinesEl = document.querySelector<HTMLButtonElement>('#merge-lines')!;
const mergePreviewEl = document.querySelector<HTMLElement>('#merge-preview')!;

applyTheme();
renderFilterControls();
renderSeriesEditor();
renderAll();
if (initialData.loadedFromStorage) {
  setStatus('Loaded saved browser data');
}

document.querySelector('#render-data')?.addEventListener('click', () => {
  try {
    commitSeriesDom();
    normalizeDraftRenderOrderFromPanelOrder();
    currentSeries = draftsToSeries(seriesDrafts);
    syncCurrentSeriesOrderFromDrafts();
    reconcileFiltersForSeries(currentSeries);
    reconcileActiveSeriesForChart();
    renderFilterControls();
    renderSeriesEditor();
    renderAll();
    clearMergePreview();
    setStatus(`${currentSeries.length} lines rendered from ${countPointRows(seriesDrafts)} point rows`);
    scheduleLocalSave();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Invalid line data', true);
  }
});

document.querySelector('#reset-data')?.addEventListener('click', () => {
  currentSeries = structuredClone(exampleSeries);
  seriesDrafts = seriesToDrafts(currentSeries);
  sortSeriesDraftsByLayer();
  normalizeDraftRenderOrderFromPanelOrder();
  syncCurrentSeriesOrderFromDrafts();
  setDefaultFiltersForSeries(currentSeries);
  state.search = '';
  renderFilterControls();
  renderSeriesEditor();
  renderAll();
  setStatus('Example data restored');
  setImportStatus('');
  pendingImportDrafts = [];
  renderImportPreview();
  clearMergePreview();
  scheduleLocalSave();
});

document.querySelector('#clear-data')?.addEventListener('click', () => {
  currentSeries = [];
  seriesDrafts = [makeEmptySeriesDraft(0)];
  normalizeDraftRenderOrderFromPanelOrder();
  setDefaultFiltersForSeries(currentSeries);
  state.search = '';
  renderFilterControls();
  renderSeriesEditor();
  renderAll();
  setStatus('Data cleared');
  setImportStatus('');
  pendingImportDrafts = [];
  renderImportPreview();
  clearMergePreview();
  scheduleLocalSave();
});

document.querySelector('#add-series')?.addEventListener('click', () => {
  commitSeriesDom();
  const nextIndex = seriesDrafts.length + 1;
  const defaultMtp = getDefaultDraftMtp();
  const defaultIsMtp = defaultMtp === MTP_VALUE;
  seriesDrafts.push({
    id: `line-${nextIndex}${defaultIsMtp ? '-mtp' : ''}`,
    name: `Line ${nextIndex}${defaultIsMtp ? ' MTP' : ''}`,
    model: getDefaultDraftModel(),
    islOsl: getDefaultDraftIslOsl(),
    precision: getDefaultDraftPrecision(),
    mtp: defaultMtp,
    marker: '',
    title: '',
    color: '',
    lineStyle: DEFAULT_LINE_STYLE,
    renderOrder: getNextDraftRenderOrder(),
    collapsed: true,
    points: [makeEmptyPointRow()]
  });
  sortSeriesDraftsByLayer();
  normalizeDraftRenderOrderFromPanelOrder();
  renderSeriesEditor();
  clearMergePreview();
  scheduleLocalSave();
});

mergeLinesEl.addEventListener('click', openMergePreview);
importActionDataEl.addEventListener('click', () => {
  void importGitHubActionData();
});
githubImportPreviewEl.addEventListener('input', handleImportPreviewInput);
githubImportPreviewEl.addEventListener('change', handleImportPreviewInput);
githubImportPreviewEl.addEventListener('click', handleImportPreviewClick);
mergePreviewEl.addEventListener('input', handleMergePreviewInput);
mergePreviewEl.addEventListener('change', handleMergePreviewInput);
mergePreviewEl.addEventListener('click', handleMergePreviewClick);

document.querySelector('#download-png')?.addEventListener('click', downloadPng);
document.querySelector('#download-csv')?.addEventListener('click', downloadCsv);
document.querySelector('#reset-zoom')?.addEventListener('click', resetInferenceCurveZoom);
window.addEventListener('resize', renderAll);
window.addEventListener('beforeunload', () => {
  commitSeriesDom();
  saveLocalDataNow();
});

function getChartOptions(): InferenceCurveChartOptions {
  return {
    activeSeriesIds: state.activeSeriesIds,
    selectedPrecisions: Array.from(state.selectedPrecisions),
    showNonOptimalPoints: state.showNonOptimalPoints,
    hidePointLabels: state.hidePointLabels,
    useAdvancedLabels: state.useAdvancedLabels,
    showGradientLabels: state.showGradientLabels,
    showLineLabels: state.showLineLabels,
    highContrast: state.highContrast,
    logY: state.logY,
    theme: state.theme,
    subtitle: getChartSubtitle()
  };
}

function renderAll(): void {
  chartSubtitleEl.textContent = getChartSubtitle();
  renderInferenceCurveChart(chartEl, getFilteredSeriesForChart(), getChartOptions());
  renderLegend();
}

function renderFilterControls(): void {
  reconcileFiltersForSeries(currentSeries);

  const models = uniqueSorted(currentSeries.map(getSeriesModel));
  const islOslValues = sortIslOslValues(getModelFilteredSeries().map(getSeriesIslOsl));
  const mtpValues = getAvailableMtpFilters(getModelSequenceFilteredSeries());
  const precisions = getAvailablePrecisions(getModelSequenceMtpFilteredSeries());
  ensureSelectedPrecisions(precisions);

  modelFilterEl.innerHTML = renderSelectOptions(models, state.modelFilter, 'All Models');
  islOslFilterEl.innerHTML = renderSelectOptions(islOslValues, state.islOslFilter, 'All ISL/OSL');
  precisionFilterEl.innerHTML = renderPrecisionFilterOptions(precisions);
  mtpFilterEl.innerHTML = renderMtpFilterOptions(mtpValues);

  modelFilterEl.onchange = () => {
    state.modelFilter = modelFilterEl.value;
    reconcileFiltersForSeries(currentSeries);
    resetSelectionsForSeries(getModelSequenceMtpFilteredSeries());
    renderFilterControls();
    renderSeriesEditor();
    renderAll();
    clearMergePreview();
    scheduleLocalSave();
  };
  islOslFilterEl.onchange = () => {
    state.islOslFilter = islOslFilterEl.value;
    reconcileFiltersForSeries(currentSeries);
    resetSelectionsForSeries(getModelSequenceMtpFilteredSeries());
    renderFilterControls();
    renderSeriesEditor();
    renderAll();
    clearMergePreview();
    scheduleLocalSave();
  };
  precisionFilterEl.onchange = () => {
    const precision = precisionFilterEl.value;
    const availablePrecisions = getAvailablePrecisions(getModelSequenceMtpFilteredSeries());
    state.selectedPrecisions =
      precision === ALL_VALUE ? new Set(availablePrecisions) : new Set([precision]);
    renderSeriesEditor();
    renderAll();
    clearMergePreview();
    scheduleLocalSave();
  };
  mtpFilterEl.onchange = () => {
    state.mtpFilter = mtpFilterEl.value;
    reconcileFiltersForSeries(currentSeries);
    resetSelectionsForSeries(getModelSequenceMtpFilteredSeries());
    renderFilterControls();
    renderSeriesEditor();
    renderAll();
    clearMergePreview();
    scheduleLocalSave();
  };
}

function renderSelectOptions(values: string[], selected: string, allLabel: string): string {
  return [
    `<option value="${ALL_VALUE}" ${selected === ALL_VALUE ? 'selected' : ''}>${allLabel}</option>`,
    ...values.map(
      (value) =>
        `<option value="${escapeAttribute(value)}" ${selected === value ? 'selected' : ''}>${escapeHtml(value)}</option>`
    )
  ].join('');
}

function renderPrecisionFilterOptions(precisions: string[]): string {
  const selected = getPrecisionFilterValue(precisions);
  const options = [
    `<option value="${ALL_VALUE}" ${selected === ALL_VALUE ? 'selected' : ''}>All Precision</option>`
  ];
  if (selected === CUSTOM_VALUE) {
    options.push(`<option value="${CUSTOM_VALUE}" selected disabled>Custom</option>`);
  }
  options.push(
    ...precisions.map(
      (precision) =>
        `<option value="${escapeAttribute(precision)}" ${selected === precision ? 'selected' : ''}>${escapeHtml(formatPrecisionLabel(precision))}</option>`
    )
  );
  return options.join('');
}

function renderMtpFilterOptions(values: string[]): string {
  return [
    `<option value="${ALL_VALUE}" ${state.mtpFilter === ALL_VALUE ? 'selected' : ''}>All MTP</option>`,
    ...values.map(
      (value) =>
        `<option value="${escapeAttribute(value)}" ${state.mtpFilter === value ? 'selected' : ''}>${escapeHtml(formatMtpFilterLabel(value))}</option>`
    )
  ].join('');
}

function renderSeriesEditor(): void {
  const previewColors = resolveInferenceCurveColors(draftsToPreviewSeries(seriesDrafts), state.highContrast, state.theme);
  const entries = getFilteredDraftEntries();
  seriesEditorEl.innerHTML =
    entries.length > 0
      ? entries
          .map(({ draft, index }) =>
            renderSeriesCard(draft, index, previewColors.get(getDraftSeriesId(draft, index)) ?? '')
          )
          .join('')
      : renderEmptySeriesFilter();
  attachSeriesEditorEvents();
}

function renderSeriesCard(series: SeriesDraft, seriesIndex: number, autoColor: string): string {
  const color = series.color.trim() || autoColor || colorInputFallbacks[seriesIndex % colorInputFallbacks.length]!;
  const pointCount = countPointRows([series]);
  const collapsed = series.collapsed;
  return `
    <section class="series-card${collapsed ? ' collapsed' : ''}" data-series-card data-series-index="${seriesIndex}">
      <div class="series-card-head">
        <div class="series-card-title">
          <button
            class="series-drag-handle"
            type="button"
            draggable="true"
            data-series-drag-handle
            data-series-index="${seriesIndex}"
            title="Drag to reorder layer"
            aria-label="Drag to reorder layer"
          >
            ${renderIcon('grip-vertical')}
          </button>
          <span class="series-swatch" style="background:${escapeAttribute(color)}"></span>
          <div>
            <h3>${escapeHtml(series.name || `Line ${seriesIndex + 1}`)}</h3>
            <p>${escapeHtml(formatLineMeta(series, seriesIndex))}</p>
          </div>
        </div>
        <div class="series-card-actions">
          <button class="series-action-button" type="button" data-series-action="copy-series" data-series-index="${seriesIndex}">
            ${renderIcon('copy')}
            <span>Copy</span>
          </button>
          <button class="series-action-button" type="button" data-series-action="add-row" data-series-index="${seriesIndex}">
            ${renderIcon('table-plus')}
            <span>Add Row</span>
          </button>
          <button class="series-action-button" type="button" data-series-action="clear-empty" data-series-index="${seriesIndex}">
            ${renderIcon('eraser')}
            <span>Clear Empty</span>
          </button>
          <button class="series-action-button danger" type="button" data-series-action="remove-series" data-series-index="${seriesIndex}">
            ${renderIcon('trash')}
            <span>Remove</span>
          </button>
        </div>
      </div>

      <div class="series-fields">
        ${renderSeriesInput(seriesIndex, 'id', 'Line ID', series.id, true)}
        ${renderSeriesInput(seriesIndex, 'name', 'Name', series.name, true)}
        ${renderSeriesInput(seriesIndex, 'model', 'Model', series.model, true)}
        ${renderSeriesInput(seriesIndex, 'islOsl', 'ISL/OSL', series.islOsl, true)}
        ${renderSeriesInput(seriesIndex, 'precision', 'Precision', series.precision, true)}
        ${renderSeriesMtpField(seriesIndex, series.mtp)}
        ${renderSeriesInput(seriesIndex, 'title', 'Title', series.title)}
        ${renderLineMarkerField(seriesIndex, series.marker)}
        ${renderLineStyleField(seriesIndex, series.lineStyle)}
        ${renderColorField(seriesIndex, series.color, color)}
      </div>

      ${collapsed ? renderCollapsedPointSummary(seriesIndex, pointCount) : renderPointTable(series, seriesIndex, pointCount)}
    </section>
  `;
}

function formatLineMeta(series: SeriesDraft, seriesIndex: number): string {
  return [
    `Layer ${getDraftLayerLabel(series, seriesIndex)}`,
    series.model,
    series.precision.toUpperCase(),
    formatIslOslLabel(series.islOsl),
    formatMtpFilterLabel(getDraftMtpFilter(series))
  ]
    .filter(Boolean)
    .join(' • ');
}

function renderEmptySeriesFilter(): string {
  return `
    <div class="series-empty">
      No line projects match the current Model, ISL/OSL, Precision, and MTP filters.
    </div>
  `;
}

function renderSeriesInput(
  seriesIndex: number,
  field: SeriesField,
  label: string,
  value: string,
  required = false
): string {
  return `
    <label class="${getSeriesFieldClassName(field)}">
      <span>${label}${required ? ' *' : ''}</span>
      <input
        type="text"
        data-series-index="${seriesIndex}"
        data-series-field="${field}"
        value="${escapeAttribute(value)}"
        ${required ? 'required' : ''}
      />
    </label>
  `;
}

function getSeriesFieldClassName(field: SeriesField): string {
  const fieldClass = field.replace(/[A-Z]/gu, (match) => `-${match.toLowerCase()}`);
  return `series-field series-field-${fieldClass}`;
}

function renderSeriesMtpField(seriesIndex: number, value: string): string {
  const selectedValue = normalizeMtpValue(value);
  return `
    <label class="series-field series-field-mtp">
      <span>MTP</span>
      <select data-series-index="${seriesIndex}" data-series-field="mtp">
        ${[MTP_VALUE, NON_MTP_VALUE]
          .map(
            (option) =>
              `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${formatMtpFilterLabel(option)}</option>`
          )
          .join('')}
      </select>
    </label>
  `;
}

function renderLineMarkerField(seriesIndex: number, value: string): string {
  const selectedValue = normalizePointShapeValue(value);
  return `
    <label class="series-field series-field-marker">
      <span>Marker</span>
      <select data-series-index="${seriesIndex}" data-series-field="marker">
        ${renderPointShapeOptions(selectedValue, 'Precision')}
      </select>
    </label>
  `;
}

function renderLineStyleField(seriesIndex: number, lineStyle: string): string {
  const styleValue = lineStyle.trim() || DEFAULT_LINE_STYLE;
  const selectedValue = getLineStyleSelectValue(styleValue);
  const isCustom = selectedValue === CUSTOM_LINE_STYLE;
  const selectedOption =
    lineStyleOptions.find((option) => option.value === selectedValue) ??
    ({ value: CUSTOM_LINE_STYLE, label: 'Custom', dasharray: styleValue || '8 4' } satisfies LineStyleOption);
  return `
    <label class="series-field line-style-field">
      <span>Line Type</span>
      <div class="line-style-controls">
        <details class="line-style-menu" data-line-style-menu data-series-index="${seriesIndex}">
          <summary>
            ${renderLineStyleSample(selectedOption)}
            <span>${escapeHtml(selectedOption.label)}</span>
          </summary>
          <div class="line-style-menu-list">
          ${lineStyleOptions
            .map(
              (option) =>
                `<button type="button" class="${selectedValue === option.value ? 'selected' : ''}" data-line-style-option="${escapeAttribute(option.value)}" data-series-index="${seriesIndex}">
                  ${renderLineStyleSample(option)}
                  <span>${escapeHtml(option.label)}</span>
                </button>`
            )
            .join('')}
            <button type="button" class="${selectedValue === CUSTOM_LINE_STYLE ? 'selected' : ''}" data-line-style-option="${CUSTOM_LINE_STYLE}" data-series-index="${seriesIndex}">
              ${renderLineStyleSample({ value: CUSTOM_LINE_STYLE, label: 'Custom', dasharray: styleValue || '8 4' })}
              <span>Custom</span>
            </button>
          </div>
        </details>
        ${
          isCustom
            ? `<input
                type="text"
                data-line-style-custom="true"
                data-series-index="${seriesIndex}"
                value="${escapeAttribute(styleValue)}"
                placeholder="8 4 2 4"
              />`
            : ''
        }
      </div>
    </label>
  `;
}

function renderLineStyleSample(option: LineStyleOption): string {
  return `
    <svg class="line-style-sample" viewBox="0 0 56 12" aria-hidden="true">
      <line
        x1="3"
        y1="6"
        x2="53"
        y2="6"
        ${option.dasharray ? `stroke-dasharray="${escapeAttribute(option.dasharray)}"` : ''}
      ></line>
    </svg>
  `;
}

function renderColorField(seriesIndex: number, color: string, autoColor: string): string {
  const colorValue = color.trim();
  const pickerColor = toColorInputValue(colorValue || autoColor, seriesIndex);
  return `
    <label class="series-field color-field">
      <span>Color</span>
      <div class="color-controls">
        <input
          type="color"
          data-color-picker="true"
          data-series-index="${seriesIndex}"
          value="${escapeAttribute(pickerColor)}"
          aria-label="Pick custom color"
        />
        <button
          type="button"
          class="color-auto-button"
          data-series-index="${seriesIndex}"
          data-color-auto="true"
        >Auto</button>
        <div class="color-presets" aria-label="Reference chart colors">
          ${colorPresets
            .map((preset) => {
              const selected = colorValue.toLowerCase() === preset.value.toLowerCase();
              return `
                <button
                  type="button"
                  class="color-preset${selected ? ' selected' : ''}"
                  data-series-index="${seriesIndex}"
                  data-color-preset="${escapeAttribute(preset.value)}"
                  title="${escapeAttribute(preset.name)}"
                  aria-label="${escapeAttribute(preset.name)}"
                  style="--swatch-color:${escapeAttribute(preset.value)}"
                ></button>
              `;
            })
            .join('')}
        </div>
      </div>
    </label>
  `;
}

function renderCollapsedPointSummary(seriesIndex: number, pointCount: number): string {
  return `
    <div class="point-table-collapsed">
      ${renderPointDataToggle(seriesIndex, pointCount, true)}
    </div>
  `;
}

function renderPointTable(series: SeriesDraft, seriesIndex: number, pointCount: number): string {
  return `
    <div class="point-table-expanded-head">
      ${renderPointDataToggle(seriesIndex, pointCount, false)}
    </div>
    <div class="table-wrap point-table-wrap">
      <table class="data-table point-table" aria-label="${escapeAttribute(series.name || `Line ${seriesIndex + 1}`)} point data">
        <thead>
          <tr>
            <th class="row-num">#</th>
            ${pointColumns
              .map(
                (column) =>
                  `<th class="point-cell-${column.key}" title="${column.required ? 'Required' : 'Optional'}">${column.label}${column.required ? ' *' : ''}</th>`
              )
              .join('')}
          </tr>
        </thead>
        <tbody>
          ${series.points.map((row, rowIndex) => renderPointRow(row, seriesIndex, rowIndex)).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderPointDataToggle(seriesIndex: number, pointCount: number, collapsed: boolean): string {
  return `
    <button
      type="button"
      class="point-data-toggle"
      data-series-action="toggle-data"
      data-series-index="${seriesIndex}"
      aria-expanded="${collapsed ? 'false' : 'true'}"
    >
      <span class="point-data-toggle-main">
        ${renderIcon(collapsed ? 'chevron-right' : 'chevron-down')}
        <span>${collapsed ? 'Show' : 'Hide'} ${pointCount} Point Rows</span>
      </span>
      <span class="point-data-toggle-meta">${collapsed ? 'Data hidden' : 'Data visible'}</span>
    </button>
  `;
}

function renderIcon(name: string): string {
  const paths: Record<string, string> = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    refresh: '<path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6.4 6.6L4 9"/><path d="M5.5 15A7 7 0 0 0 17.6 17.4L20 15"/>',
    play: '<path d="m8 5 11 7-11 7z"/>',
    copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/>',
    'table-plus': '<path d="M4 5h10"/><path d="M4 11h10"/><path d="M4 17h7"/><path d="M8 5v12"/><path d="M16 15h6"/><path d="M19 12v6"/>',
    eraser: '<path d="m7 21-4-4 10-10 6 6-8 8z"/><path d="m13 7 4-4 4 4-4 4"/><path d="M3 21h18"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m6 6 1 15h10l1-15"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    merge: '<path d="M8 7h3a5 5 0 0 1 5 5v5"/><path d="m13 14 3 3 3-3"/><path d="M8 17h3a5 5 0 0 0 5-5V7"/><path d="m13 10 3-3 3 3"/><path d="M4 7h4"/><path d="M4 17h4"/>',
    'download-cloud': '<path d="M12 13v8"/><path d="m8 17 4 4 4-4"/><path d="M20 16.6A5 5 0 0 0 18 7h-1.3A8 8 0 1 0 4 15.3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'grip-vertical': '<circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>'
  };
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${paths[name] ?? ''}
      </g>
    </svg>
  `;
}

function renderPointRow(row: PointRow, seriesIndex: number, rowIndex: number): string {
  return `
    <tr>
      <td class="row-num">${rowIndex + 1}</td>
      ${pointColumns
        .map((column, colIndex) =>
          column.key === 'shape'
            ? renderPointShapeCell(row, seriesIndex, rowIndex, colIndex)
            : `
              <td
                contenteditable="true"
                data-series-index="${seriesIndex}"
                data-row="${rowIndex}"
                data-col="${colIndex}"
                data-key="${column.key}"
                class="point-cell point-cell-${column.key}${column.required ? ' required-cell' : ''}"
              >${escapeHtml(row[column.key] ?? '')}</td>
            `
        )
        .join('')}
    </tr>
  `;
}

function renderPointShapeCell(row: PointRow, seriesIndex: number, rowIndex: number, colIndex: number): string {
  const selectedValue = normalizePointShapeValue(row.shape ?? '');
  return `
    <td class="point-cell point-cell-shape" data-series-index="${seriesIndex}" data-row="${rowIndex}" data-col="${colIndex}" data-key="shape">
      <select
        data-point-field="shape"
        data-series-index="${seriesIndex}"
        data-row="${rowIndex}"
        data-key="shape"
        aria-label="Point marker"
      >
        ${pointShapeOptions
          .map((option) => renderPointShapeOption(option, selectedValue, 'Default'))
          .join('')}
      </select>
    </td>
  `;
}

function renderPointShapeOptions(selectedValue: string, defaultLabel: string): string {
  return pointShapeOptions
    .map((option) => renderPointShapeOption(option, selectedValue, defaultLabel))
    .join('');
}

function renderPointShapeOption(
  option: (typeof pointShapeOptions)[number],
  selectedValue: string,
  defaultLabel: string
): string {
  const label = option.value ? option.label : defaultLabel;
  return `<option value="${escapeAttribute(option.value)}" ${selectedValue === option.value ? 'selected' : ''}>${escapeHtml(`${option.symbol} ${label}`)}</option>`;
}

function attachSeriesEditorEvents(): void {
  attachSeriesDragEvents();

  seriesEditorEl
    .querySelectorAll<HTMLInputElement | HTMLSelectElement>('input[data-series-field], select[data-series-field]')
    .forEach((input) => {
    input.addEventListener('input', () => {
      const seriesIndex = Number(input.dataset.seriesIndex);
      const field = input.dataset.seriesField as SeriesField;
      const draft = seriesDrafts[seriesIndex];
      if (!draft) return;
      draft[field] = normalizeCellText(input.value);
      if (field === 'color') {
        syncColorPicker(seriesIndex, draft.color || getEditorResolvedColor(seriesIndex), draft.color);
      }
      scheduleLocalSave();
    });
  });

  seriesEditorEl.querySelectorAll<HTMLButtonElement>('button[data-line-style-option]').forEach((button) => {
    button.addEventListener('click', () => {
      commitSeriesDom();
      const seriesIndex = Number(button.dataset.seriesIndex);
      const draft = seriesDrafts[seriesIndex];
      if (!draft) return;
      const option = button.dataset.lineStyleOption ?? DEFAULT_LINE_STYLE;
      draft.lineStyle =
        option === CUSTOM_LINE_STYLE
          ? getLineStyleSelectValue(draft.lineStyle) === CUSTOM_LINE_STYLE
            ? draft.lineStyle
            : '8 4'
          : option;
      renderSeriesEditor();
      scheduleLocalSave();
    });
  });

  seriesEditorEl.querySelectorAll<HTMLInputElement>('input[data-line-style-custom]').forEach((input) => {
    input.addEventListener('input', () => {
      const seriesIndex = Number(input.dataset.seriesIndex);
      const draft = seriesDrafts[seriesIndex];
      if (!draft) return;
      draft.lineStyle = normalizeCellText(input.value) || '8 4';
      scheduleLocalSave();
    });
  });

  seriesEditorEl.querySelectorAll<HTMLInputElement>('input[data-color-picker]').forEach((input) => {
    input.addEventListener('input', () => {
      const seriesIndex = Number(input.dataset.seriesIndex);
      const draft = seriesDrafts[seriesIndex];
      if (!draft) return;
      draft.color = input.value;
      syncSeriesSwatch(seriesIndex, input.value);
      syncPresetSelection(seriesIndex, input.value);
      scheduleLocalSave();
    });
  });

  seriesEditorEl.querySelectorAll<HTMLButtonElement>('button[data-color-auto]').forEach((button) => {
    button.addEventListener('click', () => {
      const seriesIndex = Number(button.dataset.seriesIndex);
      const draft = seriesDrafts[seriesIndex];
      if (!draft) return;
      draft.color = '';
      renderSeriesEditor();
      scheduleLocalSave();
    });
  });

  seriesEditorEl.querySelectorAll<HTMLButtonElement>('button[data-color-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const seriesIndex = Number(button.dataset.seriesIndex);
      const color = button.dataset.colorPreset ?? '';
      const draft = seriesDrafts[seriesIndex];
      if (!draft || !color) return;
      draft.color = color;
      const picker = getColorPicker(seriesIndex);
      if (picker) picker.value = toColorInputValue(color, seriesIndex);
      syncSeriesSwatch(seriesIndex, color);
      syncPresetSelection(seriesIndex, color);
      scheduleLocalSave();
    });
  });

  seriesEditorEl.querySelectorAll<HTMLButtonElement>('button[data-series-action]').forEach((button) => {
    button.addEventListener('click', () => {
      commitSeriesDom();
      const seriesIndex = Number(button.dataset.seriesIndex);
      const action = button.dataset.seriesAction;
      const draft = seriesDrafts[seriesIndex];
      if (!draft) return;

      if (action === 'toggle-data') {
        draft.collapsed = !draft.collapsed;
      } else if (action === 'copy-series') {
        const copy = copySeriesDraft(draft);
        copy.renderOrder = getNextDraftRenderOrder();
        seriesDrafts.push(copy);
        setStatus(`Copied ${draft.name || `Line ${seriesIndex + 1}`}`);
      } else if (action === 'add-row') {
        draft.points.push(makeEmptyPointRow());
        draft.collapsed = false;
      } else if (action === 'clear-empty') {
        draft.points = draft.points.filter((row) => !isEmptyPointRow(row));
        if (draft.points.length === 0) draft.points.push(makeEmptyPointRow());
      } else if (action === 'remove-series') {
        if (seriesDrafts.length === 1) {
          setStatus('At least one line is required.', true);
          return;
        }
        seriesDrafts.splice(seriesIndex, 1);
      }

      if (action !== 'toggle-data') clearMergePreview();
      sortSeriesDraftsByLayer();
      normalizeDraftRenderOrderFromPanelOrder();
      syncCurrentSeriesOrderFromDrafts();
      renderSeriesEditor();
      scheduleLocalSave();
    });
  });

  seriesEditorEl.querySelectorAll<HTMLSelectElement>('select[data-point-field]').forEach((select) => {
    select.addEventListener('change', () => {
      const seriesIndex = Number(select.dataset.seriesIndex);
      const rowIndex = Number(select.dataset.row);
      const key = select.dataset.key!;
      ensurePointRow(seriesIndex, rowIndex);
      seriesDrafts[seriesIndex]!.points[rowIndex]![key] = normalizeCellText(select.value);
      scheduleLocalSave();
    });
  });

  seriesEditorEl.querySelectorAll<HTMLTableCellElement>('td[contenteditable="true"]').forEach((cell) => {
    cell.addEventListener('input', () => {
      const seriesIndex = Number(cell.dataset.seriesIndex);
      const rowIndex = Number(cell.dataset.row);
      const key = cell.dataset.key!;
      ensurePointRow(seriesIndex, rowIndex);
      seriesDrafts[seriesIndex]!.points[rowIndex]![key] = normalizeCellText(cell.textContent ?? '');
      scheduleLocalSave();
    });
    cell.addEventListener('paste', handlePointTablePaste);
    cell.addEventListener('keydown', handlePointTableKeydown);
  });
}

function attachSeriesDragEvents(): void {
  seriesEditorEl.querySelectorAll<HTMLElement>('[data-series-drag-handle]').forEach((handle) => {
    handle.addEventListener('dragstart', (event) => {
      commitSeriesDom();
      const seriesIndex = Number(handle.dataset.seriesIndex);
      if (!Number.isInteger(seriesIndex)) return;
      draggedSeriesIndex = seriesIndex;
      event.dataTransfer?.setData('text/plain', String(seriesIndex));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
      handle.closest<HTMLElement>('[data-series-card]')?.classList.add('dragging');
    });
    handle.addEventListener('dragend', clearSeriesDragState);
  });

  seriesEditorEl.querySelectorAll<HTMLElement>('[data-series-card]').forEach((card) => {
    card.addEventListener('dragover', (event) => {
      if (draggedSeriesIndex === null) return;
      const targetIndex = Number(card.dataset.seriesIndex);
      if (!Number.isInteger(targetIndex) || targetIndex === draggedSeriesIndex) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
      setSeriesDropPosition(card, getSeriesDropPosition(event, card));
    });

    card.addEventListener('dragleave', (event) => {
      const related = event.relatedTarget;
      if (!(related instanceof Node) || !card.contains(related)) clearSeriesDropPosition(card);
    });

    card.addEventListener('drop', (event) => {
      event.preventDefault();
      const targetIndex = Number(card.dataset.seriesIndex);
      const sourceIndex = draggedSeriesIndex ?? Number(event.dataTransfer?.getData('text/plain'));
      const position = getSeriesDropPosition(event, card);
      clearSeriesDragState();
      if (!Number.isInteger(sourceIndex) || !Number.isInteger(targetIndex)) return;
      if (!moveSeriesDraftInPanelOrder(sourceIndex, targetIndex, position)) return;
      syncCurrentSeriesOrderFromDrafts();
      renderSeriesEditor();
      renderAll();
      setStatus('Line layer order updated');
      scheduleLocalSave();
    });
  });
}

function getSeriesDropPosition(event: DragEvent, card: HTMLElement): 'before' | 'after' {
  const rect = card.getBoundingClientRect();
  return event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
}

function setSeriesDropPosition(card: HTMLElement, position: 'before' | 'after'): void {
  clearSeriesDropPosition(card);
  card.classList.add(position === 'before' ? 'drop-before' : 'drop-after');
}

function clearSeriesDropPosition(card: HTMLElement): void {
  card.classList.remove('drop-before', 'drop-after');
}

function clearSeriesDragState(): void {
  draggedSeriesIndex = null;
  seriesEditorEl.querySelectorAll<HTMLElement>('[data-series-card]').forEach((card) => {
    card.classList.remove('dragging', 'drop-before', 'drop-after');
  });
}

function handlePointTablePaste(event: ClipboardEvent): void {
  const target = event.currentTarget as HTMLTableCellElement;
  const text = event.clipboardData?.getData('text/plain') ?? '';
  if (!text.includes('\t') && !text.includes('\n')) return;

  event.preventDefault();
  commitSeriesDom();

  const seriesIndex = Number(target.dataset.seriesIndex);
  const startRow = Number(target.dataset.row);
  const startCol = Number(target.dataset.col);
  const matrix = parseDelimitedRows(text);
  if (matrix.length === 0) return;

  const headerMap = detectPointHeaderMap(matrix[0]!);
  if (headerMap) {
    matrix.slice(1).forEach((values, offset) => {
      const rowIndex = startRow + offset;
      ensurePointRow(seriesIndex, rowIndex);
      values.forEach((value, sourceCol) => {
        const targetKey = headerMap.get(sourceCol);
        if (!targetKey) return;
        seriesDrafts[seriesIndex]!.points[rowIndex]![targetKey] = value;
      });
    });
  } else {
    matrix.forEach((values, rowOffset) => {
      const rowIndex = startRow + rowOffset;
      ensurePointRow(seriesIndex, rowIndex);
      values.forEach((value, colOffset) => {
        const colIndex = startCol + colOffset;
        const column = pointColumns[colIndex];
        if (!column) return;
        seriesDrafts[seriesIndex]!.points[rowIndex]![column.key] = value;
      });
    });
  }

  renderSeriesEditor();
  focusPointCell(seriesIndex, startRow, startCol);
  scheduleLocalSave();
}

function handlePointTableKeydown(event: KeyboardEvent): void {
  const cell = event.currentTarget as HTMLTableCellElement;
  if (event.key !== 'Tab' && event.key !== 'Enter') return;

  event.preventDefault();
  const seriesIndex = Number(cell.dataset.seriesIndex);
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  const nextRow = event.key === 'Enter' ? row + 1 : row;
  const nextCol = event.key === 'Tab' ? col + (event.shiftKey ? -1 : 1) : col;
  const boundedCol = Math.max(0, Math.min(pointColumns.length - 1, nextCol));
  ensurePointRow(seriesIndex, nextRow);
  renderSeriesEditor();
  focusPointCell(seriesIndex, nextRow, boundedCol);
  scheduleLocalSave();
}

function focusPointCell(seriesIndex: number, rowIndex: number, colIndex: number): void {
  const cell = seriesEditorEl.querySelector<HTMLTableCellElement>(
    `td[data-series-index="${seriesIndex}"][data-row="${rowIndex}"][data-col="${colIndex}"]`
  );
  const select = cell?.querySelector<HTMLSelectElement>('select[data-point-field]');
  (select ?? cell)?.focus();
}

function commitSeriesDom(): void {
  seriesEditorEl
    .querySelectorAll<HTMLInputElement | HTMLSelectElement>('input[data-series-field], select[data-series-field]')
    .forEach((input) => {
      const seriesIndex = Number(input.dataset.seriesIndex);
      const field = input.dataset.seriesField as SeriesField;
      const draft = seriesDrafts[seriesIndex];
      if (!draft) return;
      draft[field] = normalizeCellText(input.value);
    });

  seriesEditorEl.querySelectorAll<HTMLButtonElement>('button[data-line-style-option].selected').forEach((button) => {
    const seriesIndex = Number(button.dataset.seriesIndex);
    const draft = seriesDrafts[seriesIndex];
    if (!draft) return;
    const option = button.dataset.lineStyleOption ?? DEFAULT_LINE_STYLE;
    draft.lineStyle =
      option === CUSTOM_LINE_STYLE
        ? normalizeCellText(getLineStyleCustomInput(seriesIndex)?.value ?? '') || '8 4'
        : option;
  });

  seriesEditorEl.querySelectorAll<HTMLTableCellElement>('td[contenteditable="true"]').forEach((cell) => {
    const seriesIndex = Number(cell.dataset.seriesIndex);
    const row = Number(cell.dataset.row);
    const key = cell.dataset.key!;
    ensurePointRow(seriesIndex, row);
    seriesDrafts[seriesIndex]!.points[row]![key] = normalizeCellText(cell.textContent ?? '');
  });

  seriesEditorEl.querySelectorAll<HTMLSelectElement>('select[data-point-field]').forEach((select) => {
    const seriesIndex = Number(select.dataset.seriesIndex);
    const row = Number(select.dataset.row);
    const key = select.dataset.key!;
    ensurePointRow(seriesIndex, row);
    seriesDrafts[seriesIndex]!.points[row]![key] = normalizeCellText(select.value);
  });
}

function renderLegend(): void {
  const filteredSeries = getFilteredSeriesForChart();
  const prepared = prepareInferenceCurveSeries(filteredSeries, state.highContrast, state.theme);
  const query = state.search.trim().toLowerCase();
  const visibleItems = prepared.filter(
    (series) =>
      !query ||
      series.name.toLowerCase().includes(query) ||
      (series.title && series.title.toLowerCase().includes(query))
  );
  const activeCount = prepared.filter((series) => state.activeSeriesIds.has(series.id)).length;

  legendEl.innerHTML = `
    <div class="legend-container">
      <div class="legend-search">
        <input id="legend-search" type="text" value="${escapeAttribute(state.search)}" placeholder="Search..." />
        ${state.search ? '<button id="legend-clear" type="button" aria-label="Clear search">×</button>' : ''}
      </div>
      <ul class="legend-list">
        ${visibleItems
          .map((series) => {
            const active = state.activeSeriesIds.has(series.id);
            return `
              <li class="${active ? '' : 'inactive'}">
                <label title="${escapeAttribute(series.title ?? series.name)}">
                  <input type="checkbox" data-series="${escapeAttribute(series.id)}" ${active ? 'checked' : ''} />
                  <svg class="legend-line" viewBox="0 0 34 12" aria-hidden="true">
                    <line
                      x1="2"
                      y1="6"
                      x2="32"
                      y2="6"
                      stroke="${escapeAttribute(series.color)}"
                      stroke-width="3"
                      stroke-linecap="round"
                      ${series.lineDasharray ? `stroke-dasharray="${escapeAttribute(series.lineDasharray)}"` : ''}
                    ></line>
                  </svg>
                  <span class="legend-text">${escapeHtml(series.name)}</span>
                </label>
              </li>
            `;
          })
          .join('')}
      </ul>
      <div class="legend-bottom">
        ${renderPrecisionKey()}
        ${renderSwitch('logY', 'Log Scale', state.logY)}
        ${renderSwitch('showNonOptimalPoints', 'Optimal Only', !state.showNonOptimalPoints)}
        ${renderSwitch('hidePointLabels', 'Hide Labels', state.hidePointLabels)}
        ${renderSwitch('highContrast', 'High Contrast', state.highContrast)}
        ${renderSwitch('useAdvancedLabels', 'Parallelism Labels', state.useAdvancedLabels)}
        ${renderSwitch('showGradientLabels', 'Gradient Labels', state.showGradientLabels)}
        ${renderSwitch('showLineLabels', 'Line Labels', state.showLineLabels)}
        ${
          activeCount < prepared.length
            ? '<button id="reset-filter" class="legend-link" type="button">Reset filter</button>'
            : ''
        }
      </div>
    </div>
  `;

  legendEl.querySelector('#legend-search')?.addEventListener('input', (event) => {
    state.search = (event.currentTarget as HTMLInputElement).value;
    renderLegend();
    scheduleLocalSave();
  });
  legendEl.querySelector('#legend-clear')?.addEventListener('click', () => {
    state.search = '';
    renderLegend();
    scheduleLocalSave();
  });
  legendEl.querySelectorAll<HTMLInputElement>('input[data-series]').forEach((input) => {
    input.addEventListener('change', () => {
      const id = input.dataset.series!;
      if (input.checked) {
        state.activeSeriesIds.add(id);
      } else if (state.activeSeriesIds.size > 1) {
        state.activeSeriesIds.delete(id);
      } else {
        input.checked = true;
      }
      renderAll();
      scheduleLocalSave();
    });
  });
  legendEl.querySelectorAll<HTMLInputElement>('input[data-switch]').forEach((input) => {
    input.addEventListener('change', () => {
      const key = input.dataset.switch as keyof AppState;
      if (key === 'showNonOptimalPoints') {
        state.showNonOptimalPoints = !input.checked;
      } else if (typeof state[key] === 'boolean') {
        (state[key] as boolean) = input.checked;
      }
      renderAll();
      scheduleLocalSave();
    });
  });
  legendEl.querySelectorAll<HTMLInputElement>('input[data-precision]').forEach((input) => {
    input.addEventListener('change', () => {
      const precision = input.dataset.precision!;
      if (input.checked) {
        state.selectedPrecisions.add(precision);
      } else if (state.selectedPrecisions.size > 1) {
        state.selectedPrecisions.delete(precision);
      } else {
        input.checked = true;
      }
      renderFilterControls();
      renderSeriesEditor();
      renderAll();
      clearMergePreview();
      scheduleLocalSave();
    });
  });
  legendEl.querySelector('#reset-filter')?.addEventListener('click', () => {
    const nextSeries = getFilteredSeriesForChart();
    state.activeSeriesIds = new Set(nextSeries.map((series) => series.id));
    state.selectedPrecisions = new Set(getAvailablePrecisions(nextSeries));
    renderFilterControls();
    renderSeriesEditor();
    renderAll();
    clearMergePreview();
    scheduleLocalSave();
  });
}

function renderSwitch(key: string, label: string, checked: boolean): string {
  return `
    <label class="legend-switch">
      <input type="checkbox" data-switch="${key}" ${checked ? 'checked' : ''} />
      <span class="switch-track"></span>
      <span>${label}</span>
    </label>
  `;
}

function renderPrecisionKey(): string {
  const precisions = getAvailablePrecisions(getModelSequenceMtpFilteredSeries());
  if (precisions.length < 2) return '';
  const shapes = ['●', '■', '▲', '◆'];
  return `
    <div class="precision-key">
      ${precisions
        .slice(0, shapes.length)
        .map((precision, index) => {
          const selected = state.selectedPrecisions.has(precision);
          return `
            <label class="${selected ? '' : 'inactive'}">
              <input type="checkbox" data-precision="${escapeAttribute(precision)}" ${selected ? 'checked' : ''} />
              <b>${shapes[index]}</b>
              <span>${escapeHtml(precision.toUpperCase())}</span>
            </label>
          `;
        })
        .join('')}
    </div>
  `;
}

function getFilteredDraftEntries(): { draft: SeriesDraft; index: number }[] {
  return getSortedDraftEntries()
    .filter(({ draft }) => {
      const modelMatches =
        state.modelFilter === ALL_VALUE || getDraftModel(draft) === state.modelFilter;
      const islOslMatches =
        state.islOslFilter === ALL_VALUE || getDraftIslOsl(draft) === state.islOslFilter;
      const precisionMatches =
        state.selectedPrecisions.size === 0 || state.selectedPrecisions.has(getDraftPrecision(draft));
      const mtpMatches =
        state.mtpFilter === ALL_VALUE || getDraftMtpFilter(draft) === state.mtpFilter;
      return modelMatches && islOslMatches && precisionMatches && mtpMatches;
    });
}

function getSortedDraftEntries(): { draft: SeriesDraft; index: number }[] {
  return seriesDrafts
    .map((draft, index) => ({ draft, index }))
    .sort(
      (a, b) =>
        getDraftRenderOrder(b.draft, b.index) - getDraftRenderOrder(a.draft, a.index) ||
        a.index - b.index
    );
}

function sortSeriesDraftsByLayer(): void {
  seriesDrafts = getSortedDraftEntries().map(({ draft }) => draft);
}

function normalizeDraftRenderOrderFromPanelOrder(): void {
  const topOrder = Math.max(0, seriesDrafts.length - 1);
  seriesDrafts.forEach((draft, index) => {
    draft.renderOrder = topOrder - index;
  });
}

function moveSeriesDraftInPanelOrder(
  sourceIndex: number,
  targetIndex: number,
  position: 'before' | 'after'
): boolean {
  if (sourceIndex === targetIndex) return false;
  const entries = getSortedDraftEntries();
  const sourcePosition = entries.findIndex((entry) => entry.index === sourceIndex);
  const targetPosition = entries.findIndex((entry) => entry.index === targetIndex);
  if (sourcePosition < 0 || targetPosition < 0) return false;

  const [source] = entries.splice(sourcePosition, 1);
  if (!source) return false;
  let insertPosition = targetPosition;
  if (sourcePosition < targetPosition) insertPosition -= 1;
  if (position === 'after') insertPosition += 1;
  entries.splice(Math.max(0, Math.min(entries.length, insertPosition)), 0, source);

  seriesDrafts = entries.map((entry) => entry.draft);
  normalizeDraftRenderOrderFromPanelOrder();
  return true;
}

function getDraftRenderOrder(draft: SeriesDraft, fallback: number): number {
  return typeof draft.renderOrder === 'number' && Number.isFinite(draft.renderOrder)
    ? draft.renderOrder
    : fallback;
}

function getDraftLayerLabel(draft: SeriesDraft, fallback: number): string {
  return String(Math.max(1, Math.round(getDraftRenderOrder(draft, fallback) + 1)));
}

function getNextDraftRenderOrder(): number {
  const orders = seriesDrafts.map((draft, index) => getDraftRenderOrder(draft, index));
  return orders.length > 0 ? Math.max(...orders) + 1 : 0;
}

function placeDraftsOnTop(drafts: SeriesDraft[]): void {
  const start = getNextDraftRenderOrder();
  drafts.forEach((draft, index) => {
    draft.renderOrder = start + drafts.length - index - 1;
  });
}

function syncCurrentSeriesOrderFromDrafts(): void {
  const seriesById = new Map(currentSeries.map((line) => [line.id, line]));
  const used = new Set<string>();
  const ordered: InferenceCurveSeries[] = [];
  seriesDrafts.forEach((draft, index) => {
    const id = draft.id.trim() || `line-${index + 1}`;
    const line = seriesById.get(id);
    if (!line) return;
    used.add(id);
    ordered.push({ ...line, renderOrder: getDraftRenderOrder(draft, index) });
  });
  const rest = currentSeries.filter((line) => !used.has(line.id));
  currentSeries = [...ordered, ...rest];
}

function getLineStyleSelectValue(lineStyle: string): string {
  const normalized = normalizeLineStyleValue(lineStyle);
  return lineStyleOptions.some((option) => option.value === normalized) ? normalized : CUSTOM_LINE_STYLE;
}

function normalizeLineStyleValue(lineStyle: string): string {
  return lineStyle.trim().toLowerCase().replace(/[_\s]+/gu, '-');
}

function draftsToPreviewSeries(drafts: SeriesDraft[]): InferenceCurveSeries[] {
  return drafts.map((draft, index) => {
    const line: InferenceCurveSeries = {
      id: getDraftSeriesId(draft, index),
      name: draft.name.trim() || `Line ${index + 1}`,
      model: draft.model.trim() || getDefaultDraftModel(),
      islOsl: draft.islOsl.trim() || getDefaultDraftIslOsl(),
      precision: draft.precision.trim() || getDefaultDraftPrecision(),
      mtp: getDraftMtpFilter(draft),
      marker: normalizePointShapeValue(draft.marker),
      renderOrder: getDraftRenderOrder(draft, index),
      points: []
    };
    if (draft.title.trim()) line.title = draft.title.trim();
    if (draft.color.trim()) line.color = draft.color.trim();
    if (draft.lineStyle.trim()) line.lineStyle = draft.lineStyle.trim();
    return line;
  });
}

function getDraftSeriesId(draft: SeriesDraft, index: number): string {
  return draft.id.trim() || `line-${index + 1}`;
}

function getEditorResolvedColor(seriesIndex: number): string {
  const draft = seriesDrafts[seriesIndex];
  if (!draft) return colorInputFallbacks[seriesIndex % colorInputFallbacks.length]!;

  const previewColors = resolveInferenceCurveColors(draftsToPreviewSeries(seriesDrafts), state.highContrast, state.theme);
  return (
    previewColors.get(getDraftSeriesId(draft, seriesIndex)) ??
    colorInputFallbacks[seriesIndex % colorInputFallbacks.length]!
  );
}

function seriesToDrafts(series: InferenceCurveSeries[]): SeriesDraft[] {
  const drafts = series.map((line, index) => ({
    id: line.id,
    name: line.name,
    model: getSeriesModel(line),
    islOsl: getSeriesIslOsl(line),
    precision: getSeriesPrecision(line),
    mtp: getSeriesMtpFilter(line),
    marker: normalizePointShapeValue(String(line.marker ?? '')),
    title: line.title ?? '',
    color: line.color ?? '',
    lineStyle: line.lineStyle ?? DEFAULT_LINE_STYLE,
    renderOrder: getSeriesRenderOrder(line, index),
    collapsed: true,
    points: line.points.map((point) => {
      const labelMetadata = parsePointMetadataLabel(point.label);
      const strategyMetadata = parsePointStrategy(point.strategy);
      return {
        interactivity: String(point.interactivity),
        throughput: String(point.throughput),
        shape: normalizePointShapeValue(formatPointFieldValue(point.shape)),
        strategy: point.strategy ?? '',
        tp: formatPointFieldValue(point.tp),
        num_prefill_gpu: formatPointFieldValue(point.num_prefill_gpu ?? labelMetadata.num_prefill_gpu),
        num_decode_gpu: formatPointFieldValue(point.num_decode_gpu ?? labelMetadata.num_decode_gpu),
        prefill_tp: formatPointFieldValue(point.prefill_tp ?? labelMetadata.prefill_tp),
        prefill_ep: formatPointFieldValue(point.prefill_ep ?? labelMetadata.prefill_ep),
        prefill_dp_attention: formatPointFieldValue(
          point.prefill_dp_attention ?? point.dp_attention ?? labelMetadata.prefill_dp_attention
        ),
        decode_tp: formatPointFieldValue(point.decode_tp ?? strategyMetadata.decode_tp),
        decode_ep: formatPointFieldValue(point.decode_ep ?? strategyMetadata.decode_ep),
        decode_dp_attention: formatPointFieldValue(
          point.decode_dp_attention ?? point.dp_attention ?? labelMetadata.decode_dp_attention
        ),
        dp_attention: formatPointFieldValue(point.dp_attention),
        concurrency: formatPointFieldValue(point.concurrency),
        label: point.label ?? ''
      };
    })
  }));
  return drafts.length ? drafts : [makeEmptySeriesDraft(0)];
}

function draftsToSeries(drafts: SeriesDraft[]): InferenceCurveSeries[] {
  const result = draftsToSeriesInternal(drafts);
  if (result.length === 0) throw new Error('No valid line data.');
  return result;
}

function draftsToSeriesAllowEmpty(drafts: SeriesDraft[]): InferenceCurveSeries[] {
  return draftsToSeriesInternal(drafts);
}

function draftsToSeriesInternal(drafts: SeriesDraft[]): InferenceCurveSeries[] {
  const result: InferenceCurveSeries[] = [];
  drafts.forEach((draft, seriesIndex) => {
    const points = draft.points
      .map((row, pointIndex) => {
        if (isEmptyPointRow(row)) return null;
        const interactivity = parseNumber(row.interactivity);
        const throughput = parseNumber(row.throughput);
        if (interactivity === null || throughput === null) {
          throw new Error(
            `Line ${seriesIndex + 1}, row ${pointIndex + 1}: Interactivity and Throughput/GPU must be numbers.`
          );
        }
        const point: InferenceCurveSeries['points'][number] = {
          interactivity,
          throughput,
          precision: draft.precision.trim() || undefined,
          strategy: (row.strategy ?? '').trim() || undefined,
          tp: parseNumber(row.tp) ?? undefined,
          concurrency: parseNumber(row.concurrency) ?? undefined,
          label: row.label.trim() || undefined
        };
        const pointShape = normalizePointShapeValue(row.shape);
        if (pointShape) point.shape = pointShape;
        const numPrefillGpu = parseNumber(row.num_prefill_gpu);
        const numDecodeGpu = parseNumber(row.num_decode_gpu);
        const prefillTp = parseNumber(row.prefill_tp);
        const prefillEp = parseNumber(row.prefill_ep);
        const prefillDpAttention = parseBoolean(row.prefill_dp_attention) ?? parseBoolean(row.dp_attention);
        const decodeTp = parseNumber(row.decode_tp);
        const decodeEp = parseNumber(row.decode_ep);
        const decodeDpAttention = parseBoolean(row.decode_dp_attention) ?? parseBoolean(row.dp_attention);
        const totalGpu =
          numPrefillGpu !== null && numDecodeGpu !== null ? numPrefillGpu + numDecodeGpu : null;
        if (numPrefillGpu !== null) point.num_prefill_gpu = numPrefillGpu;
        if (numDecodeGpu !== null) point.num_decode_gpu = numDecodeGpu;
        if (prefillTp !== null) point.prefill_tp = prefillTp;
        if (prefillEp !== null) point.prefill_ep = prefillEp;
        if (prefillDpAttention !== null) point.prefill_dp_attention = prefillDpAttention;
        if (decodeTp !== null) point.decode_tp = decodeTp;
        if (decodeEp !== null) point.decode_ep = decodeEp;
        if (decodeDpAttention !== null) point.decode_dp_attention = decodeDpAttention;
        if (
          prefillDpAttention !== null &&
          decodeDpAttention !== null &&
          prefillDpAttention === decodeDpAttention
        ) {
          point.dp_attention = prefillDpAttention;
        }
        point.tp = totalGpu ?? parseNumber(row.tp) ?? decodeTp ?? undefined;
        point.strategy = (row.strategy ?? '').trim() || makeStrategyLabel(decodeTp, decodeEp);
        if (numPrefillGpu !== null && numDecodeGpu !== null) point.disagg = true;
        return point;
      })
      .filter((point): point is NonNullable<typeof point> => point !== null);

    if (points.length === 0) return;

    const lineId = draft.id.trim();
    const lineName = draft.name.trim();
    const model = draft.model.trim();
    const islOsl = draft.islOsl.trim();
    const precision = draft.precision.trim();
    if (!lineId || !lineName) {
      throw new Error(`Line ${seriesIndex + 1}: Line ID and Name are required.`);
    }
    if (!model || !islOsl || !precision) {
      throw new Error(`Line ${seriesIndex + 1}: Model, ISL/OSL, and Precision are required.`);
    }

    const line: InferenceCurveSeries = {
      id: lineId,
      name: lineName,
      model,
      islOsl,
      precision,
      mtp: getDraftMtpFilter(draft),
      marker: normalizePointShapeValue(draft.marker),
      renderOrder: getDraftRenderOrder(draft, seriesIndex),
      points
    };
    if (draft.color.trim()) line.color = draft.color.trim();
    if (draft.lineStyle.trim()) line.lineStyle = draft.lineStyle.trim();
    if (draft.title.trim()) line.title = draft.title.trim();
    result.push(line);
  });

  return result;
}

function parseDelimitedRows(text: string): string[][] {
  return text
    .replace(/\r/g, '')
    .split('\n')
    .filter((line, index, lines) => line.length > 0 || index < lines.length - 1)
    .map((line) => line.split('\t').map((cell) => normalizeCellText(cell)));
}

function detectPointHeaderMap(headerRow: string[]): Map<number, string> | null {
  const aliases = new Map<string, string>([
    ['interactivity', 'interactivity'],
    ['interactivity (tok/s/user)', 'interactivity'],
    ['tok/s/user', 'interactivity'],
    ['x', 'interactivity'],
    ['交互性', 'interactivity'],
    ['throughput', 'throughput'],
    ['throughput/gpu', 'throughput'],
    ['throughput per gpu', 'throughput'],
    ['token throughput per gpu', 'throughput'],
    ['token throughput per gpu (tok/s/gpu)', 'throughput'],
    ['tok/s/gpu', 'throughput'],
    ['y', 'throughput'],
    ['吞吐量', 'throughput'],
    ['gpu吞吐量', 'throughput'],
    ['marker', 'shape'],
    ['point marker', 'shape'],
    ['point shape', 'shape'],
    ['shape', 'shape'],
    ['形状', 'shape'],
    ['点形状', 'shape'],
    ['precision', 'precision'],
    ['精度', 'precision'],
    ['strategy', 'strategy'],
    ['parallelism', 'strategy'],
    ['策略', 'strategy'],
    ['tp', 'tp'],
    ['prefill gpus', 'num_prefill_gpu'],
    ['prefill gpu', 'num_prefill_gpu'],
    ['prefill_gpus', 'num_prefill_gpu'],
    ['num_prefill_gpu', 'num_prefill_gpu'],
    ['num prefill gpu', 'num_prefill_gpu'],
    ['预填充gpu', 'num_prefill_gpu'],
    ['decode gpus', 'num_decode_gpu'],
    ['decode gpu', 'num_decode_gpu'],
    ['decode_gpus', 'num_decode_gpu'],
    ['num_decode_gpu', 'num_decode_gpu'],
    ['num decode gpu', 'num_decode_gpu'],
    ['解码gpu', 'num_decode_gpu'],
    ['prefill tp', 'prefill_tp'],
    ['prefill_tp', 'prefill_tp'],
    ['预填充tp', 'prefill_tp'],
    ['prefill ep', 'prefill_ep'],
    ['prefill_ep', 'prefill_ep'],
    ['预填充ep', 'prefill_ep'],
    ['decode tp', 'decode_tp'],
    ['decode_tp', 'decode_tp'],
    ['解码tp', 'decode_tp'],
    ['decode ep', 'decode_ep'],
    ['decode_ep', 'decode_ep'],
    ['解码ep', 'decode_ep'],
    ['prefill dpa', 'prefill_dp_attention'],
    ['prefill dp attention', 'prefill_dp_attention'],
    ['prefill_dp_attention', 'prefill_dp_attention'],
    ['prefill dpa attention', 'prefill_dp_attention'],
    ['预填充dpa', 'prefill_dp_attention'],
    ['decode dpa', 'decode_dp_attention'],
    ['decode dp attention', 'decode_dp_attention'],
    ['decode_dp_attention', 'decode_dp_attention'],
    ['decode dpa attention', 'decode_dp_attention'],
    ['解码dpa', 'decode_dp_attention'],
    ['dpa', 'dp_attention'],
    ['dp attention', 'dp_attention'],
    ['dp_attention', 'dp_attention'],
    ['concurrency', 'concurrency'],
    ['conc', 'concurrency'],
    ['并发', 'concurrency'],
    ['note', 'label'],
    ['label', 'label'],
    ['备注', 'label']
  ]);

  const map = new Map<number, string>();
  headerRow.forEach((value, sourceIndex) => {
    const normalized = normalizeHeaderName(value);
    const key = aliases.get(normalized);
    if (key && knownPointKeys.has(key)) map.set(sourceIndex, key);
  });
  return map.size > 0 ? map : null;
}

function normalizeHeaderName(value: string): string {
  return value.replace(/\*/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function makeEmptySeriesDraft(index: number): SeriesDraft {
  return {
    id: `line-${index + 1}`,
    name: `Line ${index + 1}`,
    model: getDefaultDraftModel(),
    islOsl: getDefaultDraftIslOsl(),
    precision: getDefaultDraftPrecision(),
    mtp: NON_MTP_VALUE,
    marker: '',
    title: '',
    color: '',
    lineStyle: DEFAULT_LINE_STYLE,
    renderOrder: index,
    collapsed: true,
    points: [makeEmptyPointRow()]
  };
}

function copySeriesDraft(source: SeriesDraft): SeriesDraft {
  const copy = structuredClone(source);
  copy.id = makeUniqueLineId(`${source.id.trim() || 'line'}-copy`);
  copy.name = `${source.name.trim() || 'Line'} Copy`;
  copy.renderOrder = getNextDraftRenderOrder();
  copy.collapsed = true;
  return copy;
}

function makeUniqueLineId(baseId: string): string {
  const normalizedBase = baseId.trim() || 'line-copy';
  const existing = new Set(seriesDrafts.map((draft) => draft.id.trim()).filter(Boolean));
  if (!existing.has(normalizedBase)) return normalizedBase;

  let index = 2;
  let nextId = `${normalizedBase}-${index}`;
  while (existing.has(nextId)) {
    index += 1;
    nextId = `${normalizedBase}-${index}`;
  }
  return nextId;
}

function makeEmptyPointRow(): PointRow {
  return Object.fromEntries(pointColumns.map((column) => [column.key, '']));
}

function ensurePointRow(seriesIndex: number, rowIndex: number): void {
  const draft = seriesDrafts[seriesIndex];
  if (!draft) return;
  while (draft.points.length <= rowIndex) draft.points.push(makeEmptyPointRow());
}

function isEmptyPointRow(row: PointRow): boolean {
  return pointColumns.every((column) => !row[column.key]?.trim());
}

function countPointRows(drafts: SeriesDraft[]): number {
  return drafts.reduce((count, draft) => count + draft.points.filter((row) => !isEmptyPointRow(row)).length, 0);
}

function parseNumber(value: string | undefined): number | null {
  const trimmed = (value ?? '').trim().replaceAll(',', '');
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBoolean(value: string | undefined): boolean | null {
  const normalized = (value ?? '').trim().toLowerCase();
  if (!normalized) return null;
  if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  return null;
}

function parsePointMetadataLabel(label: string | undefined): ParsedPointMetadata {
  const prefillMatch = label?.match(/\bprefill\s+TP\s*(\d+(?:\.\d+)?)\s+EP\s*(\d+(?:\.\d+)?)/iu);
  const legacyDpAttention = parseBooleanFromText(label, /\bDPA\s*:?\s*(true|false|1|0|yes|no)\b/iu);
  return {
    num_prefill_gpu: parseNumberFromText(label, /\bprefill\s+GPUs?\s*:?\s*(\d+(?:\.\d+)?)/iu),
    num_decode_gpu: parseNumberFromText(label, /\bdecode\s+GPUs?\s*:?\s*(\d+(?:\.\d+)?)/iu),
    prefill_tp: prefillMatch ? Number(prefillMatch[1]) : undefined,
    prefill_ep: prefillMatch ? Number(prefillMatch[2]) : undefined,
    prefill_dp_attention: legacyDpAttention,
    decode_dp_attention: legacyDpAttention
  };
}

function parsePointStrategy(strategy: string | undefined): ParsedStrategyMetadata {
  return {
    decode_tp: parseNumberFromText(strategy, /\bTP\s*(\d+(?:\.\d+)?)/iu),
    decode_ep: parseNumberFromText(strategy, /\bEP\s*(\d+(?:\.\d+)?)/iu)
  };
}

function makeStrategyLabel(tp: number | null, ep: number | null): string | undefined {
  if (tp === null && ep === null) return undefined;
  if (tp !== null && ep !== null) return `TP${tp}/EP${ep}`;
  if (tp !== null) return `TP${tp}`;
  return `EP${ep}`;
}

function parseNumberFromText(value: string | undefined, pattern: RegExp): number | undefined {
  const match = value?.match(pattern);
  if (!match) return undefined;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBooleanFromText(value: string | undefined, pattern: RegExp): boolean | undefined {
  const match = value?.match(pattern);
  if (!match) return undefined;
  return parseBoolean(match[1] ?? '') ?? undefined;
}

function formatPointFieldValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '';
  if (typeof value === 'string') return value;
  return '';
}

function normalizeCellText(value: string): string {
  return value.replace(/\u00a0/g, ' ').trim();
}

function normalizePointShapeValue(value: string | undefined): string {
  const normalized = (value ?? '').trim().toLowerCase().replace(/[_\s]+/gu, '-');
  if (!normalized || normalized === 'default' || normalized === 'auto') return '';
  if (['circle', 'round', 'dot'].includes(normalized)) return 'circle';
  if (['square', 'box'].includes(normalized)) return 'square';
  if (['triangle', 'tri'].includes(normalized)) return 'triangle';
  if (['diamond', 'rhombus'].includes(normalized)) return 'diamond';
  if (['star', 'asterisk'].includes(normalized)) return 'star';
  if (['plus', '+'].includes(normalized)) return 'plus';
  if (['cross', 'x'].includes(normalized)) return 'cross';
  return '';
}

function resetSelectionsForSeries(series: InferenceCurveSeries[]): void {
  state.activeSeriesIds = new Set(series.map((line) => line.id));
  state.selectedPrecisions = firstPrecisionSelection(series);
}

function reconcileActiveSeriesForChart(): void {
  const visibleSeries = getFilteredSeriesForChart();
  if (visibleSeries.length === 0) {
    state.activeSeriesIds = new Set();
    return;
  }

  const visibleIds = new Set(visibleSeries.map((line) => line.id));
  const selected = Array.from(state.activeSeriesIds).filter((id) => visibleIds.has(id));
  state.activeSeriesIds = selected.length > 0 ? new Set(selected) : visibleIds;
}

function reconcileFiltersForSeries(series: InferenceCurveSeries[]): void {
  const models = new Set(series.map(getSeriesModel));
  const sortedModels = uniqueSorted(series.map(getSeriesModel));
  if (state.modelFilter !== ALL_VALUE && !models.has(state.modelFilter)) {
    state.modelFilter = sortedModels[0] ?? ALL_VALUE;
  }

  const modelFiltered = filterSeriesByModel(series, state.modelFilter);
  const islOslValues = new Set(modelFiltered.map(getSeriesIslOsl));
  const sortedIslOslValues = sortIslOslValues(modelFiltered.map(getSeriesIslOsl));
  if (state.islOslFilter !== ALL_VALUE && !islOslValues.has(state.islOslFilter)) {
    state.islOslFilter = sortedIslOslValues[0] ?? ALL_VALUE;
  }

  const sequenceFiltered = filterSeriesByModelAndSequence(series, state.modelFilter, state.islOslFilter);
  const mtpValues = new Set(getAvailableMtpFilters(sequenceFiltered));
  const sortedMtpValues = sortMtpValues(Array.from(mtpValues));
  if (state.mtpFilter !== ALL_VALUE && !mtpValues.has(state.mtpFilter)) {
    state.mtpFilter = sortedMtpValues[0] ?? ALL_VALUE;
  }

  ensureSelectedPrecisions(getAvailablePrecisions(getModelSequenceMtpFilteredSeries()));
}

function ensureSelectedPrecisions(precisions: string[]): void {
  const available = new Set(precisions);
  const selected = Array.from(state.selectedPrecisions).filter((precision) => available.has(precision));
  state.selectedPrecisions = selected.length > 0 ? new Set(selected) : firstPrecisionSet(precisions);
}

function createInitialState(series: InferenceCurveSeries[]): AppState {
  const modelFilter = uniqueSorted(series.map(getSeriesModel))[0] ?? ALL_VALUE;
  const modelFiltered = filterSeriesByModel(series, modelFilter);
  const islOslFilter = sortIslOslValues(modelFiltered.map(getSeriesIslOsl))[0] ?? ALL_VALUE;
  const sequenceFiltered = filterSeriesByModelAndSequence(series, modelFilter, islOslFilter);
  const mtpFilter = getAvailableMtpFilters(sequenceFiltered)[0] ?? ALL_VALUE;
  const visibleSeries = filterSeriesByMtp(sequenceFiltered, mtpFilter);

  return {
    theme: 'dark',
    activeSeriesIds: new Set(visibleSeries.map((line) => line.id)),
    selectedPrecisions: firstPrecisionSelection(visibleSeries),
    modelFilter,
    islOslFilter,
    mtpFilter,
    showNonOptimalPoints: false,
    hidePointLabels: false,
    useAdvancedLabels: false,
    showGradientLabels: false,
    showLineLabels: false,
    highContrast: false,
    logY: false,
    search: ''
  };
}

function setDefaultFiltersForSeries(series: InferenceCurveSeries[]): void {
  const defaults = createInitialState(series);
  state.modelFilter = defaults.modelFilter;
  state.islOslFilter = defaults.islOslFilter;
  state.mtpFilter = defaults.mtpFilter;
  state.activeSeriesIds = defaults.activeSeriesIds;
  state.selectedPrecisions = defaults.selectedPrecisions;
}

function firstPrecisionSelection(series: InferenceCurveSeries[]): Set<string> {
  return firstPrecisionSet(getAvailablePrecisions(series));
}

function firstPrecisionSet(precisions: string[]): Set<string> {
  const [first] = precisions;
  return first ? new Set([first]) : new Set();
}

function filterSeriesByModel(series: InferenceCurveSeries[], modelFilter: string): InferenceCurveSeries[] {
  return series.filter((line) => modelFilter === ALL_VALUE || getSeriesModel(line) === modelFilter);
}

function filterSeriesByModelAndSequence(
  series: InferenceCurveSeries[],
  modelFilter: string,
  islOslFilter: string
): InferenceCurveSeries[] {
  return filterSeriesByModel(series, modelFilter).filter(
    (line) => islOslFilter === ALL_VALUE || getSeriesIslOsl(line) === islOslFilter
  );
}

function filterSeriesByMtp(series: InferenceCurveSeries[], mtpFilter: string): InferenceCurveSeries[] {
  return series.filter((line) => mtpFilter === ALL_VALUE || getSeriesMtpFilter(line) === mtpFilter);
}

function getModelFilteredSeries(): InferenceCurveSeries[] {
  return filterSeriesByModel(currentSeries, state.modelFilter);
}

function getModelSequenceFilteredSeries(): InferenceCurveSeries[] {
  return filterSeriesByModelAndSequence(currentSeries, state.modelFilter, state.islOslFilter);
}

function getModelSequenceMtpFilteredSeries(): InferenceCurveSeries[] {
  return filterSeriesByMtp(getModelSequenceFilteredSeries(), state.mtpFilter);
}

function getFilteredSeriesForChart(): InferenceCurveSeries[] {
  return getModelSequenceMtpFilteredSeries().filter((series) =>
    state.selectedPrecisions.has(getSeriesPrecision(series))
  );
}

function getPrecisionFilterValue(precisions: string[]): string {
  if (precisions.length > 0 && precisions.every((precision) => state.selectedPrecisions.has(precision))) {
    return ALL_VALUE;
  }
  if (state.selectedPrecisions.size === 1) {
    const [value] = Array.from(state.selectedPrecisions);
    if (value && precisions.includes(value)) return value;
  }
  return CUSTOM_VALUE;
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function sortIslOslValues(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => {
    const aLengths = parseIslOslLengths(a);
    const bLengths = parseIslOslLengths(b);
    if (aLengths && bLengths) {
      return bLengths.isl - aLengths.isl || bLengths.osl - aLengths.osl || a.localeCompare(b);
    }
    if (aLengths) return -1;
    if (bLengths) return 1;
    return a.localeCompare(b);
  });
}

function getAvailableMtpFilters(series: InferenceCurveSeries[]): string[] {
  return sortMtpValues(series.map(getSeriesMtpFilter));
}

function sortMtpValues(values: string[]): string[] {
  const order = new Map([
    [MTP_VALUE, 0],
    [NON_MTP_VALUE, 1]
  ]);
  return Array.from(new Set(values)).sort(
    (a, b) => (order.get(a) ?? 99) - (order.get(b) ?? 99) || a.localeCompare(b)
  );
}

function parseIslOslLengths(value: string): { isl: number; osl: number } | null {
  const labelled = value.match(/ISL\s*([\d,]+)\s*\/\s*OSL\s*([\d,]+)/iu);
  const simple = value.match(/([\d,]+)\s*\/\s*([\d,]+)/u);
  const match = labelled ?? simple;
  if (!match) return null;

  const isl = Number(match[1]!.replaceAll(',', ''));
  const osl = Number(match[2]!.replaceAll(',', ''));
  return Number.isFinite(isl) && Number.isFinite(osl) ? { isl, osl } : null;
}

function getSeriesModel(series: InferenceCurveSeries): string {
  return String(series.model ?? DEFAULT_MODEL);
}

function getSeriesIslOsl(series: InferenceCurveSeries): string {
  return String(series.islOsl ?? DEFAULT_ISL_OSL);
}

function getSeriesPrecision(series: InferenceCurveSeries): string {
  const firstPointPrecision = series.points.find((point) => point.precision)?.precision;
  return String(series.precision ?? firstPointPrecision ?? DEFAULT_PRECISION);
}

function getSeriesRenderOrder(series: InferenceCurveSeries, fallback: number): number {
  return typeof series.renderOrder === 'number' && Number.isFinite(series.renderOrder)
    ? series.renderOrder
    : fallback;
}

function getSeriesMtpFilter(series: InferenceCurveSeries): string {
  return getExplicitMtpValue(series.mtp) ?? inferMtpFilterFromTokens(`${series.id} ${series.name} ${series.title ?? ''}`);
}

function getDraftModel(draft: SeriesDraft): string {
  return draft.model.trim() || DEFAULT_MODEL;
}

function getDraftIslOsl(draft: SeriesDraft): string {
  return draft.islOsl.trim() || DEFAULT_ISL_OSL;
}

function getDraftPrecision(draft: SeriesDraft): string {
  return draft.precision.trim() || DEFAULT_PRECISION;
}

function getDraftMtpFilter(draft: SeriesDraft): string {
  return getExplicitMtpValue(draft.mtp) ?? inferMtpFilterFromTokens(`${draft.id} ${draft.name} ${draft.title}`);
}

function getExplicitMtpValue(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  return normalizeMtpValue(value);
}

function normalizeMtpValue(value: string | undefined): string {
  const normalized = (value ?? '').trim().toLowerCase();
  if (!normalized) return NON_MTP_VALUE;
  if (['none', 'non-mtp', 'non mtp', 'non_mtp', 'no-mtp', 'off', 'false', 'no', 'n', '0'].includes(normalized)) {
    return NON_MTP_VALUE;
  }
  if (['mtp', 'spec-mtp', 'spec_mtp', 'on', 'true', 'yes', 'y', '1'].includes(normalized)) {
    return MTP_VALUE;
  }
  return hasMtpToken(normalized) ? MTP_VALUE : NON_MTP_VALUE;
}

function inferMtpFilterFromTokens(value: string): string {
  return hasMtpToken(value) ? MTP_VALUE : NON_MTP_VALUE;
}

function hasMtpToken(value: string): boolean {
  return /(^|[^a-z0-9])mtp([^a-z0-9]|$)/iu.test(value);
}

function formatPrecisionLabel(precision: string): string {
  return precision === DEFAULT_PRECISION ? 'Default' : precision.toUpperCase();
}

function formatMtpFilterLabel(value: string): string {
  if (value === MTP_VALUE) return 'MTP';
  if (value === NON_MTP_VALUE) return 'Non-MTP';
  return value;
}

function getChartSubtitle(): string {
  const precisions = getAvailablePrecisions(getModelSequenceMtpFilteredSeries());
  const precision = getPrecisionFilterValue(precisions);
  const precisionLabel =
    precision === ALL_VALUE
      ? 'All Precision'
      : precision === CUSTOM_VALUE
        ? Array.from(state.selectedPrecisions).map(formatPrecisionLabel).join(', ')
        : formatPrecisionLabel(precision);

  return [
    state.modelFilter === ALL_VALUE ? 'All Models' : formatModelLabel(state.modelFilter),
    precisionLabel || 'No Precision',
    state.islOslFilter === ALL_VALUE ? 'All ISL/OSL' : formatIslOslLabel(state.islOslFilter),
    state.mtpFilter === ALL_VALUE ? 'All MTP' : formatMtpFilterLabel(state.mtpFilter)
  ].join(' • ');
}

function formatModelLabel(model: string): string {
  return model.replace(/[-_]+/gu, ' ').replace(/\s+/gu, ' ').trim();
}

function formatIslOslLabel(value: string): string {
  const labelled = value.match(/ISL\s*([\d,]+)\s*\/\s*OSL\s*([\d,]+)/iu);
  const simple = value.match(/([\d,]+)\s*\/\s*([\d,]+)/u);
  const match = labelled ?? simple;
  if (!match) return value;

  return `${formatTokenLength(match[1]!)} / ${formatTokenLength(match[2]!)}`;
}

function formatTokenLength(value: string): string {
  const parsed = Number(value.replaceAll(',', ''));
  if (!Number.isFinite(parsed)) return value;
  if (parsed < 1024) return String(parsed);

  const inK = parsed / 1024;
  const compact = Number.isInteger(inK) ? String(inK) : inK.toFixed(1).replace(/\.0$/u, '');
  return `${compact}K`;
}

function getDefaultDraftModel(): string {
  if (state.modelFilter !== ALL_VALUE) return state.modelFilter;
  return uniqueSorted(currentSeries.map(getSeriesModel))[0] ?? DEFAULT_MODEL;
}

function getDefaultDraftIslOsl(): string {
  if (state.islOslFilter !== ALL_VALUE) return state.islOslFilter;
  return sortIslOslValues(currentSeries.map(getSeriesIslOsl))[0] ?? DEFAULT_ISL_OSL;
}

function getDefaultDraftPrecision(): string {
  const precisions = getAvailablePrecisions(getModelSequenceMtpFilteredSeries());
  const precision = getPrecisionFilterValue(precisions);
  if (precision !== ALL_VALUE && precision !== CUSTOM_VALUE) return precision;
  return precisions[0] ?? DEFAULT_PRECISION;
}

function getDefaultDraftMtp(): string {
  if (state.mtpFilter !== ALL_VALUE) return state.mtpFilter;
  return getAvailableMtpFilters(getModelSequenceFilteredSeries())[0] ?? NON_MTP_VALUE;
}

function openMergePreview(): void {
  commitSeriesDom();
  pendingMergeGroups = buildPendingMergeGroups();
  renderMergePreview();
  if (pendingMergeGroups.length === 0) {
    setStatus('No merge candidates in the current filtered line list.', true);
    return;
  }
  setStatus(`Found ${pendingMergeGroups.length} merge candidate groups. Select the exact lines to merge.`);
}

function buildPendingMergeGroups(): PendingMergeGroup[] {
  const groups = new Map<string, PendingMergeGroup>();
  getFilteredDraftEntries()
    .filter(({ draft }) => countPointRows([draft]) > 0)
    .forEach(({ draft, index }) => {
      const key = getMergeGroupKey(draft);
      const group =
        groups.get(key) ??
        ({
          key,
          label: getMergeGroupLabel(draft),
          lines: []
        } satisfies PendingMergeGroup);
      group.lines.push({
        selected: false,
        main: false,
        draftIndex: index,
        draftId: getDraftSeriesId(draft, index)
      });
      groups.set(key, group);
    });

  return Array.from(groups.values()).filter((group) => group.lines.length > 1);
}

function renderMergePreview(): void {
  if (pendingMergeGroups.length === 0) {
    mergePreviewEl.innerHTML = '';
    return;
  }

  const selectedLineCount = pendingMergeGroups.reduce(
    (count, group) => count + group.lines.filter((line) => line.selected).length,
    0
  );
  const readyGroupCount = pendingMergeGroups.filter((group) => getSelectedMergeLines(group).length >= 2).length;
  const previewColors = resolveInferenceCurveColors(draftsToPreviewSeries(seriesDrafts), state.highContrast, state.theme);

  mergePreviewEl.innerHTML = `
    <div class="merge-preview-head">
      <div>
        <strong>Review Merge</strong>
        <span>${readyGroupCount} ready groups / ${pendingMergeGroups.length} candidates, ${selectedLineCount} selected lines</span>
      </div>
      <div class="merge-preview-actions">
        <button type="button" class="series-action-button" data-merge-action="select-none">
          ${renderIcon('x')}
          <span>Select None</span>
        </button>
        <button type="button" class="series-action-button danger" data-merge-action="cancel">
          ${renderIcon('trash')}
          <span>Cancel</span>
        </button>
        <button type="button" class="primary action-button" data-merge-action="merge-selected" ${readyGroupCount === 0 ? 'disabled' : ''}>
          ${renderIcon('merge')}
          <span>Merge Selected</span>
        </button>
      </div>
    </div>
    <div class="merge-preview-list">
      ${pendingMergeGroups
        .map((group, groupIndex) => renderMergePreviewGroup(group, groupIndex, previewColors))
        .join('')}
    </div>
  `;
}

function renderMergePreviewGroup(
  group: PendingMergeGroup,
  groupIndex: number,
  previewColors: Map<string, string>
): string {
  const selectedCount = group.lines.filter((line) => line.selected).length;
  return `
    <section class="merge-preview-group">
      <div class="merge-group-head">
        <div>
          <strong>${escapeHtml(group.label)}</strong>
          <span>${selectedCount} selected / ${group.lines.length} lines</span>
        </div>
      </div>
      <div class="merge-line-list">
        ${group.lines
          .map((line, lineIndex) => renderMergePreviewLine(line, groupIndex, lineIndex, previewColors))
          .join('')}
      </div>
    </section>
  `;
}

function renderMergePreviewLine(
  line: PendingMergeLine,
  groupIndex: number,
  lineIndex: number,
  previewColors: Map<string, string>
): string {
  const draft = seriesDrafts[line.draftIndex];
  if (!draft) return '';
  const pointCount = countPointRows([draft]);
  const color =
    draft.color.trim() ||
    previewColors.get(getDraftSeriesId(draft, line.draftIndex)) ||
    colorInputFallbacks[line.draftIndex % colorInputFallbacks.length]!;

  return `
    <div class="merge-line-item${line.selected ? ' selected' : ''}">
      <label class="merge-line-check">
        <input type="checkbox" data-merge-group="${groupIndex}" data-merge-line="${lineIndex}" data-merge-field="selected" ${line.selected ? 'checked' : ''} />
        <span>Merge</span>
      </label>
      <label class="merge-line-main">
        <input type="radio" name="merge-main-${groupIndex}" data-merge-group="${groupIndex}" data-merge-line="${lineIndex}" data-merge-field="main" ${line.main ? 'checked' : ''} />
        <span>Main</span>
      </label>
      <div class="merge-line-info">
        <span class="series-swatch" style="background:${escapeAttribute(color)}"></span>
        <div>
          <strong>${escapeHtml(draft.name || `Line ${line.draftIndex + 1}`)}</strong>
          <code>${escapeHtml(getDraftSeriesId(draft, line.draftIndex))}</code>
          ${draft.title.trim() ? `<small>${escapeHtml(draft.title.trim())}</small>` : ''}
        </div>
      </div>
      <span class="merge-line-meta">Layer ${getDraftLayerLabel(draft, line.draftIndex)} • ${pointCount} points</span>
    </div>
  `;
}

function handleMergePreviewInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  const groupIndex = Number(input.dataset.mergeGroup);
  const lineIndex = Number(input.dataset.mergeLine);
  const field = input.dataset.mergeField;
  const group = pendingMergeGroups[groupIndex];
  const line = group?.lines[lineIndex];
  if (!group || !line || !field) return;

  if (field === 'selected') {
    line.selected = input.checked;
    if (!line.selected) line.main = false;
  } else if (field === 'main') {
    group.lines.forEach((entry) => {
      entry.main = false;
    });
    line.main = true;
    line.selected = true;
  }

  renderMergePreview();
}

function handleMergePreviewClick(event: MouseEvent): void {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-merge-action]');
  if (!button) return;
  const action = button.dataset.mergeAction;
  if (action === 'select-none') {
    pendingMergeGroups.forEach((group) => {
      group.lines.forEach((line) => {
        line.selected = false;
        line.main = false;
      });
    });
    renderMergePreview();
  } else if (action === 'cancel') {
    clearMergePreview();
    setStatus('Merge review closed');
  } else if (action === 'merge-selected') {
    mergeSelectedLines();
  }
}

function mergeSelectedLines(): void {
  const groups = pendingMergeGroups.filter((group) => getSelectedMergeLines(group).length >= 2);
  if (groups.length === 0) {
    setStatus('Select at least two lines in a candidate group.', true);
    return;
  }

  try {
    commitSeriesDom();
    const removeIndexes = new Set<number>();
    let removedLineCount = 0;
    let mergedPointCount = 0;

    groups.forEach((group) => {
      const selectedLines = getSelectedMergeLines(group);
      if (!validateMergeGroup(group, selectedLines)) {
        throw new Error('Merge review is stale. Reopen Merge Lines and try again.');
      }

      const mainLine = getMainMergeLine(selectedLines);
      const mainDraft = seriesDrafts[mainLine.draftIndex]!;
      const mergedPoints = selectedLines
        .flatMap((line) => structuredClone(seriesDrafts[line.draftIndex]!.points).filter((row) => !isEmptyPointRow(row)))
        .sort(comparePointRowsForMerge);

      mainDraft.points = mergedPoints.length ? mergedPoints : [makeEmptyPointRow()];
      mergedPointCount += mergedPoints.length;
      selectedLines.forEach((line) => {
        if (line.draftIndex !== mainLine.draftIndex) {
          removeIndexes.add(line.draftIndex);
          removedLineCount += 1;
        }
      });
    });

    seriesDrafts = seriesDrafts.filter((_, index) => !removeIndexes.has(index));
    sortSeriesDraftsByLayer();
    normalizeDraftRenderOrderFromPanelOrder();
    currentSeries = draftsToSeriesAllowEmpty(seriesDrafts);
    syncCurrentSeriesOrderFromDrafts();
    reconcileFiltersForSeries(currentSeries);
    reconcileActiveSeriesForChart();
    renderFilterControls();
    renderSeriesEditor();
    renderAll();
    clearMergePreview();
    setStatus(`Merged ${removedLineCount} lines into ${groups.length} groups, keeping ${mergedPointCount} point rows.`);
    scheduleLocalSave();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Could not merge selected lines.', true);
  }
}

function getSelectedMergeLines(group: PendingMergeGroup): PendingMergeLine[] {
  return group.lines.filter((line) => line.selected);
}

function getMainMergeLine(lines: PendingMergeLine[]): PendingMergeLine {
  return (
    lines.find((line) => line.main) ??
    [...lines].sort(
      (a, b) =>
        getDraftRenderOrder(seriesDrafts[b.draftIndex]!, b.draftIndex) -
          getDraftRenderOrder(seriesDrafts[a.draftIndex]!, a.draftIndex) ||
        a.draftIndex - b.draftIndex
    )[0]!
  );
}

function validateMergeGroup(group: PendingMergeGroup, lines: PendingMergeLine[]): boolean {
  return lines.every((line) => {
    const draft = seriesDrafts[line.draftIndex];
    return draft && getDraftSeriesId(draft, line.draftIndex) === line.draftId && getMergeGroupKey(draft) === group.key;
  });
}

function comparePointRowsForMerge(a: PointRow, b: PointRow): number {
  return compareNullableNumbers(parseNumber(a.interactivity), parseNumber(b.interactivity)) ||
    compareNullableNumbers(parseNumber(a.throughput), parseNumber(b.throughput));
}

function compareNullableNumbers(a: number | null, b: number | null): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a - b;
}

function clearMergePreview(): void {
  pendingMergeGroups = [];
  renderMergePreview();
}

function getMergeGroupKey(draft: SeriesDraft): string {
  return [
    normalizeMergeKeyPart(getDraftModel(draft)),
    normalizeMergeIslOsl(getDraftIslOsl(draft)),
    normalizeMergeKeyPart(getDraftPrecision(draft)),
    getDraftMtpFilter(draft)
  ].join('|');
}

function getMergeGroupLabel(draft: SeriesDraft): string {
  return [
    getDraftModel(draft),
    formatPrecisionLabel(getDraftPrecision(draft)),
    formatIslOslLabel(getDraftIslOsl(draft)),
    formatMtpFilterLabel(getDraftMtpFilter(draft))
  ].join(' • ');
}

function normalizeMergeKeyPart(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/gu, ' ');
}

function normalizeMergeIslOsl(value: string): string {
  const lengths = parseIslOslLengths(value);
  return lengths ? `${lengths.isl}/${lengths.osl}` : normalizeMergeKeyPart(value);
}

function renderImportPreview(): void {
  if (pendingImportDrafts.length === 0) {
    githubImportPreviewEl.innerHTML = '';
    return;
  }

  const selectedCount = pendingImportDrafts.filter((entry) => entry.selected).length;
  const pointCount = pendingImportDrafts
    .filter((entry) => entry.selected)
    .reduce((count, entry) => count + entry.draft.points.filter((row) => !isEmptyPointRow(row)).length, 0);

  githubImportPreviewEl.innerHTML = `
    <div class="import-preview-head">
      <div>
        <strong>Review Import</strong>
        <span>${selectedCount} selected / ${pendingImportDrafts.length} lines, ${pointCount} point rows</span>
      </div>
      <div class="import-preview-actions">
        <button type="button" class="series-action-button" data-import-action="select-all">
          ${renderIcon('check')}
          <span>Select All</span>
        </button>
        <button type="button" class="series-action-button" data-import-action="select-none">
          ${renderIcon('x')}
          <span>Select None</span>
        </button>
        <button type="button" class="series-action-button danger" data-import-action="clear-preview">
          ${renderIcon('trash')}
          <span>Discard</span>
        </button>
        <button type="button" class="primary action-button" data-import-action="add-selected">
          ${renderIcon('plus')}
          <span>Add Selected</span>
        </button>
      </div>
    </div>
    <div class="import-preview-list">
      ${pendingImportDrafts.map((entry, index) => renderImportPreviewItem(entry, index)).join('')}
    </div>
  `;
}

function renderImportPreviewItem(entry: PendingImportDraft, index: number): string {
  const draft = entry.draft;
  const pointCount = draft.points.filter((row) => !isEmptyPointRow(row)).length;
  return `
    <section class="import-preview-item">
      <label class="import-preview-select">
        <input type="checkbox" data-import-index="${index}" data-import-field="selected" ${entry.selected ? 'checked' : ''} />
        <span>Add</span>
      </label>
      ${renderImportPreviewInput(index, 'id', 'Line ID', draft.id)}
      ${renderImportPreviewInput(index, 'name', 'Name', draft.name)}
      ${renderImportPreviewInput(index, 'model', 'Model', draft.model)}
      ${renderImportPreviewInput(index, 'islOsl', 'ISL/OSL', draft.islOsl)}
      ${renderImportPreviewInput(index, 'precision', 'Precision', draft.precision)}
      ${renderImportPreviewMtpField(index, draft.mtp)}
      ${renderImportPreviewMarkerField(index, draft.marker)}
      ${renderImportPreviewInput(index, 'title', 'Title', draft.title)}
      <span class="import-preview-points">${pointCount} points</span>
    </section>
  `;
}

function renderImportPreviewInput(
  index: number,
  field: keyof Pick<SeriesDraft, 'id' | 'name' | 'model' | 'islOsl' | 'precision' | 'title'>,
  label: string,
  value: string
): string {
  return `
    <label class="import-preview-field">
      <span>${label}</span>
      <input type="text" data-import-index="${index}" data-import-field="${field}" value="${escapeAttribute(value)}" />
    </label>
  `;
}

function renderImportPreviewMtpField(index: number, value: string): string {
  const selectedValue = normalizeMtpValue(value);
  return `
    <label class="import-preview-field">
      <span>MTP</span>
      <select data-import-index="${index}" data-import-field="mtp">
        ${[MTP_VALUE, NON_MTP_VALUE]
          .map(
            (option) =>
              `<option value="${option}" ${selectedValue === option ? 'selected' : ''}>${formatMtpFilterLabel(option)}</option>`
          )
          .join('')}
      </select>
    </label>
  `;
}

function renderImportPreviewMarkerField(index: number, value: string): string {
  const selectedValue = normalizePointShapeValue(value);
  return `
    <label class="import-preview-field">
      <span>Marker</span>
      <select data-import-index="${index}" data-import-field="marker">
        ${renderPointShapeOptions(selectedValue, 'Precision Default')}
      </select>
    </label>
  `;
}

function handleImportPreviewInput(event: Event): void {
  const input = event.target as HTMLInputElement | HTMLSelectElement;
  const index = Number(input.dataset.importIndex);
  const field = input.dataset.importField;
  const entry = pendingImportDrafts[index];
  if (!entry || !field) return;
  if (field === 'selected') {
    entry.selected = input instanceof HTMLInputElement && input.checked;
    renderImportPreview();
    return;
  }
  if (field in entry.draft) {
    entry.draft[field as keyof SeriesDraft] = normalizeCellText(input.value) as never;
  }
}

function handleImportPreviewClick(event: MouseEvent): void {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-import-action]');
  if (!button) return;
  const action = button.dataset.importAction;
  if (action === 'select-all') {
    pendingImportDrafts.forEach((entry) => {
      entry.selected = true;
    });
    renderImportPreview();
  } else if (action === 'select-none') {
    pendingImportDrafts.forEach((entry) => {
      entry.selected = false;
    });
    renderImportPreview();
  } else if (action === 'clear-preview') {
    pendingImportDrafts = [];
    renderImportPreview();
    setImportStatus('Pending import discarded.');
  } else if (action === 'add-selected') {
    addSelectedImportLines();
  }
}

function addSelectedImportLines(): void {
  const selectedDrafts = pendingImportDrafts
    .filter((entry) => entry.selected)
    .map((entry) => structuredClone(entry.draft));
  if (selectedDrafts.length === 0) {
    setImportStatus('Select at least one line to add.', true);
    return;
  }

  try {
    commitSeriesDom();
    placeDraftsOnTop(selectedDrafts);
    const existingSeries = draftsToSeriesAllowEmpty(seriesDrafts);
    const selectedSeries = draftsToSeries(selectedDrafts);
    currentSeries = mergeImportedSeries([...existingSeries, ...selectedSeries]);
    seriesDrafts = seriesToDrafts(currentSeries);
    sortSeriesDraftsByLayer();
    normalizeDraftRenderOrderFromPanelOrder();
    syncCurrentSeriesOrderFromDrafts();
    reconcileFiltersForSeries(currentSeries);
    state.search = '';
    renderFilterControls();
    renderSeriesEditor();
    renderAll();
    setImportStatus(formatImportSummary(selectedSeries, currentSeries, seriesDrafts));
    pendingImportDrafts = [];
    renderImportPreview();
    clearMergePreview();
    scheduleLocalSave();
  } catch (error) {
    setImportStatus(error instanceof Error ? error.message : 'Could not add selected import lines.', true);
  }
}

async function importGitHubActionData(): Promise<void> {
  const runUrl = githubActionUrlEl.value.trim();
  const token = githubTokenEl.value.trim();
  if (!runUrl) {
    setImportStatus('Enter a GitHub Actions run URL first.', true);
    githubActionUrlEl.focus();
    return;
  }

  importActionDataEl.disabled = true;
  try {
    setImportStatus('Fetching GitHub Actions artifacts...');
    const importedSeries = await loadGitHubActionSeries(runUrl, token);
    pendingImportDrafts = seriesToDrafts(importedSeries).map((draft) => ({
      selected: true,
      draft: { ...draft, collapsed: true }
    }));
    renderImportPreview();
    setImportStatus(
      `Fetched ${importedSeries.length} lines. Line IDs include the CI run id suffix. Review, edit, then click Add Selected. Current data was not changed.`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not import GitHub Actions data.';
    setImportStatus(message, true);
    if (message.toLowerCase().includes('rate limit')) githubTokenEl.focus();
  } finally {
    importActionDataEl.disabled = false;
  }
}

async function loadGitHubActionSeries(runUrl: string, token: string): Promise<InferenceCurveSeries[]> {
  const run = parseGitHubRunUrl(runUrl);
  const headers = makeGitHubHeaders(token);
  const downloadHeaders = makeGitHubDownloadHeaders(token);
  const artifacts = await fetchGitHubArtifacts(run, headers);
  const candidates = artifacts
    .filter((artifact) => !artifact.expired)
    .sort((a, b) => scoreArtifactName(b.name) - scoreArtifactName(a.name))
    .slice(0, 20);

  if (candidates.length === 0) {
    throw new Error('No downloadable artifacts found for that GitHub Actions run.');
  }

  const imported: InferenceCurveSeries[] = [];
  const failures: string[] = [];
  for (const artifact of candidates) {
    try {
      setImportStatus(`Downloading artifact: ${artifact.name}`);
      imported.push(...(await loadGitHubArtifactSeries(artifact, downloadHeaders)));
    } catch (error) {
      failures.push(`${artifact.name}: ${error instanceof Error ? error.message : 'failed'}`);
    }
  }

  const merged = appendGitHubRunIdToSeriesIds(mergeImportedSeries(imported), run.runId);
  if (merged.length === 0) {
    const suffix = failures.length ? ` Last error: ${failures.at(-1)}` : '';
    throw new Error(`No benchmark CSV/JSON data found in the action artifacts.${suffix}`);
  }
  return merged;
}

function appendGitHubRunIdToSeriesIds(series: InferenceCurveSeries[], runId: string): InferenceCurveSeries[] {
  const suffix = `-ci-${runId}`;
  return series.map((line) => ({
    ...line,
    id: line.id.endsWith(suffix) ? line.id : `${line.id}${suffix}`
  }));
}

function parseGitHubRunUrl(value: string): GitHubRunRef {
  const url = new URL(value);
  const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/actions\/runs\/(\d+)/u);
  if (url.hostname !== 'github.com' || !match) {
    throw new Error('Use a GitHub Actions run URL like https://github.com/owner/repo/actions/runs/123.');
  }
  return { owner: match[1]!, repo: match[2]!, runId: match[3]! };
}

function makeGitHubHeaders(token: string): Headers {
  const headers = new Headers({
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  });
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

function makeGitHubDownloadHeaders(token: string): Headers {
  const headers = new Headers({
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  });
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

async function fetchGitHubArtifacts(run: GitHubRunRef, headers: Headers): Promise<GitHubArtifact[]> {
  const artifacts: GitHubArtifact[] = [];
  for (let page = 1; page <= 5; page += 1) {
    const url = `https://api.github.com/repos/${encodeURIComponent(run.owner)}/${encodeURIComponent(
      run.repo
    )}/actions/runs/${encodeURIComponent(run.runId)}/artifacts?per_page=100&page=${page}`;
    const data = await fetchGitHubJson<GitHubArtifactsResponse>(url, headers);
    artifacts.push(...(data.artifacts ?? []));
    if ((data.artifacts ?? []).length < 100) break;
  }
  return artifacts;
}

async function fetchGitHubJson<T>(url: string, headers: Headers): Promise<T> {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(await formatFetchError(response));
  return (await response.json()) as T;
}

async function loadGitHubArtifactSeries(
  artifact: GitHubArtifact,
  headers: Headers
): Promise<InferenceCurveSeries[]> {
  const response = await fetch(artifact.archive_download_url, { headers });
  if (!response.ok) throw new Error(await formatFetchError(response));
  const archive = unzipSync(new Uint8Array(await response.arrayBuffer()));
  const imported: InferenceCurveSeries[] = [];

  Object.entries(archive).forEach(([filename, bytes]) => {
    const series = parseImportedArtifactFile(filename, bytes, artifact.name);
    imported.push(...series);
  });

  return mergeImportedSeries(imported);
}

function parseImportedArtifactFile(
  filename: string,
  bytes: Uint8Array,
  artifactName: string
): InferenceCurveSeries[] {
  const lower = filename.toLowerCase();
  if (!/\.(json|jsonl|ndjson|csv|tsv)$/u.test(lower)) return [];

  const text = strFromU8(bytes);
  const sourceName = `${artifactName}/${filename}`;
  try {
    if (lower.endsWith('.json')) return parseJsonImport(text, sourceName);
    if (lower.endsWith('.jsonl') || lower.endsWith('.ndjson')) return parseJsonLinesImport(text, sourceName);
    return parseTableImport(text, lower.endsWith('.tsv') ? '\t' : ',', sourceName);
  } catch {
    return [];
  }
}

function parseJsonImport(text: string, sourceName: string): InferenceCurveSeries[] {
  const value = JSON.parse(text) as unknown;
  const nativeSeries = readNativeSeries(value);
  if (nativeSeries.length > 0) return nativeSeries;
  return seriesFromBenchmarkRecords(extractBenchmarkRecords(value), sourceName);
}

function parseJsonLinesImport(text: string, sourceName: string): InferenceCurveSeries[] {
  const records = text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as unknown)
    .filter(isRecord);
  return seriesFromBenchmarkRecords(records, sourceName);
}

function parseTableImport(text: string, delimiter: ',' | '\t', sourceName: string): InferenceCurveSeries[] {
  const rows = parseDelimitedText(text, delimiter);
  if (rows.length < 2) return [];
  const headers = rows[0]!;
  const records = rows.slice(1).map((row) => {
    const record: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? '';
    });
    return record;
  });

  const editorSeries = seriesFromEditorRecords(records);
  if (editorSeries.length > 0) return editorSeries;
  return seriesFromBenchmarkRecords(records, sourceName);
}

function readNativeSeries(value: unknown): InferenceCurveSeries[] {
  const candidate = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.series)
      ? value.series
      : isRecord(value) && Array.isArray(value.lines)
        ? value.lines
        : null;
  if (!candidate) return [];

  const series = candidate.filter(isRecord).filter((line) => Array.isArray(line.points));
  return series.map((line, index) => ({
    id: String(line.id ?? `imported-line-${index + 1}`),
    name: String(line.name ?? `Imported Line ${index + 1}`),
    hwKey: asOptionalString(line.hwKey),
    model: asOptionalString(line.model),
    islOsl: asOptionalString(line.islOsl),
    precision: asOptionalString(line.precision),
    mtp: asOptionalString(line.mtp),
    marker: normalizePointShapeValue(asOptionalString(line.marker) ?? asOptionalString(line.shape) ?? ''),
    color: asOptionalString(line.color),
    lineStyle: asOptionalString(line.lineStyle),
    renderOrder: asOptionalNumber(line.renderOrder),
    title: asOptionalString(line.title),
    points: (line.points as unknown[])
      .filter(isRecord)
      .map((point) => ({
        ...point,
        interactivity: Number(point.interactivity),
        throughput: Number(point.throughput)
      }))
      .filter((point) => Number.isFinite(point.interactivity) && Number.isFinite(point.throughput))
  }));
}

function extractBenchmarkRecords(value: unknown): Record<string, unknown>[] {
  const records: Record<string, unknown>[] = [];
  const walk = (node: unknown, depth: number): void => {
    if (depth > 6) return;
    if (Array.isArray(node)) {
      const objectRows = node.filter(isRecord);
      if (objectRows.some(looksLikeBenchmarkRecord)) {
        records.push(...objectRows);
        return;
      }
      node.slice(0, 20).forEach((child) => walk(child, depth + 1));
      return;
    }
    if (isRecord(node)) Object.values(node).forEach((child) => walk(child, depth + 1));
  };
  walk(value, 0);
  return records.filter(looksLikeBenchmarkRecord);
}

function looksLikeBenchmarkRecord(record: Record<string, unknown>): boolean {
  return readMetricNumber(record, ['metrics.median_intvty', 'median_intvty', 'interactivity', 'x']) !== null &&
    readMetricNumber(record, ['metrics.tput_per_gpu', 'tput_per_gpu', 'throughput', 'throughput_per_gpu', 'y']) !== null;
}

function seriesFromEditorRecords(records: Record<string, unknown>[]): InferenceCurveSeries[] {
  const hasEditorRows = records.some((record) => readMetricString(record, ['series_id', 'line id', 'line_id']) !== '');
  if (!hasEditorRows) return [];

  const drafts = new Map<string, SeriesDraft>();
  records.forEach((record, rowIndex) => {
    const id = readMetricString(record, ['series_id', 'line id', 'line_id']) || `imported-line-${rowIndex + 1}`;
    const name = readMetricString(record, ['series_name', 'line name', 'name']) || id;
    const title = readMetricString(record, ['title']);
    const rawMtp = readMetricString(record, ['mtp', 'MTP']);
    const draft =
      drafts.get(id) ??
      ({
        id,
        name,
        model: readMetricString(record, ['model']) || getDefaultDraftModel(),
        islOsl: readMetricString(record, ['islOsl', 'isl/osl']) || getDefaultDraftIslOsl(),
        precision: readMetricString(record, ['precision']) || getDefaultDraftPrecision(),
        mtp: rawMtp ? normalizeMtpValue(rawMtp) : inferMtpFilterFromTokens(`${id} ${name} ${title}`),
        marker: normalizePointShapeValue(
          readMetricString(record, ['line_marker', 'line marker', 'series_marker', 'series marker'])
        ),
        title,
        color: readMetricString(record, ['color']),
        lineStyle: readMetricString(record, ['lineStyle', 'line type', 'linestyle']) || DEFAULT_LINE_STYLE,
        renderOrder: readMetricNumber(record, ['renderOrder', 'render order', 'layer', 'z-index', 'z index']) ?? rowIndex,
        collapsed: true,
        points: []
      } satisfies SeriesDraft);

    const point = makeEmptyPointRow();
    [...pointColumns.map((column) => column.key), ...hiddenPointKeys].forEach((key) => {
      const column = pointColumns.find((item) => item.key === key);
      const value = readMetricString(record, [key, column?.label ?? key]);
      if (value) point[key] = value;
    });
    if (!isEmptyPointRow(point)) draft.points.push(point);
    drafts.set(id, draft);
  });

  return draftsToSeries(Array.from(drafts.values()).filter((draft) => draft.points.length > 0));
}

function seriesFromBenchmarkRecords(
  records: Record<string, unknown>[],
  sourceName: string
): InferenceCurveSeries[] {
  const grouped = new Map<string, InferenceCurveSeries>();
  records.forEach((record) => {
    const imported = importedPointFromBenchmarkRecord(record, sourceName);
    if (!imported) return;
    const key = [
      imported.model,
      imported.islOsl,
      imported.precision,
      imported.mtp,
      imported.hardware,
      imported.framework,
      imported.specMethod
    ].join('|');
    const line =
      grouped.get(key) ??
      ({
        id: makeLineId(imported),
        name: imported.lineName,
        hwKey: normalizeImportedKey(imported.hardware),
        model: imported.model,
        islOsl: imported.islOsl,
        precision: imported.precision,
        mtp: imported.mtp,
        title: imported.title,
        renderOrder: grouped.size,
        points: []
      } satisfies InferenceCurveSeries);
    line.points.push(imported.point);
    grouped.set(key, line);
  });

  return Array.from(grouped.values()).map((line) => ({
    ...line,
    points: line.points.sort((a, b) => a.interactivity - b.interactivity || a.throughput - b.throughput)
  }));
}

function importedPointFromBenchmarkRecord(
  record: Record<string, unknown>,
  sourceName: string
): ImportedPointRow | null {
  const interactivity = readMetricNumber(record, [
    'metrics.median_intvty',
    'metrics.interactivity',
    'median_intvty',
    'median_interactivity',
    'interactivity',
    'tok/s/user',
    'x'
  ]);
  const throughput = readMetricNumber(record, [
    'metrics.tput_per_gpu',
    'tput_per_gpu',
    'throughput_per_gpu',
    'token throughput per gpu',
    'throughput',
    'tok/s/gpu',
    'y'
  ]);
  if (interactivity === null || throughput === null) return null;

  const hardware =
    normalizeImportedHardware(readMetricString(record, ['hardware', 'hw_key', 'hwKey', 'hw', 'gpu', 'accelerator'])) ||
    'unknown';
  const framework = readMetricString(record, ['framework', 'backend', 'runtime']) || 'unknown';
  const specMethod = resolveImportedSpecMethod(record);
  const mtp = specMethod === MTP_VALUE ? MTP_VALUE : NON_MTP_VALUE;
  const model = formatImportedModelFromRecord(record, sourceName);
  const precision = (readMetricString(record, ['precision', 'dtype', 'quantization']) || DEFAULT_PRECISION).toLowerCase();
  const isl = readMetricNumber(record, ['isl', 'input_len', 'input_length', 'input sequence length', 'input_tokens']);
  const osl = readMetricNumber(record, ['osl', 'output_len', 'output_length', 'output sequence length', 'output_tokens']);
  const islOsl = isl !== null && osl !== null ? `ISL ${isl} / OSL ${osl}` : DEFAULT_ISL_OSL;
  const lineName = formatImportedLineName(hardware, framework, specMethod);
  const title = `${model} ${islOsl} ${precision.toUpperCase()} ${lineName}`;
  const prefillGpu = readMetricNumber(record, ['num_prefill_gpu', 'prefill gpus', 'prefill_gpu']);
  const decodeGpu = readMetricNumber(record, ['num_decode_gpu', 'decode gpus', 'decode_gpu']);
  const prefillTp = readMetricNumber(record, ['prefill_tp', 'prefill tp']);
  const prefillEp = readMetricNumber(record, ['prefill_ep', 'prefill ep']);
  const decodeTp = readMetricNumber(record, ['decode_tp', 'decode tp', 'tp']);
  const decodeEp = readMetricNumber(record, ['decode_ep', 'decode ep', 'ep']);
  const prefillDpa =
    readMetricBoolean(record, ['prefill_dp_attention', 'prefill dpa']) ??
    readMetricBoolean(record, ['dp_attention', 'dpa']);
  const decodeDpa =
    readMetricBoolean(record, ['decode_dp_attention', 'decode dpa']) ??
    readMetricBoolean(record, ['dp_attention', 'dpa']);
  const date = readMetricString(record, ['date', 'created_at', 'run_date', 'timestamp']);
  const concurrency = readMetricNumber(record, ['conc', 'concurrency', 'batch_size']);
  const shape = normalizePointShapeValue(
    readMetricString(record, ['shape', 'marker', 'point_shape', 'point shape'])
  );
  const totalGpu = prefillGpu !== null && decodeGpu !== null ? prefillGpu + decodeGpu : null;

  const point: InferenceCurveSeries['points'][number] = {
    interactivity,
    throughput,
    precision,
    strategy: makeStrategyLabel(decodeTp, decodeEp),
    tp: totalGpu ?? decodeTp ?? undefined,
    concurrency: concurrency ?? undefined,
    label: makeImportedPointLabel(date, prefillTp, prefillEp, prefillGpu, decodeGpu, prefillDpa, decodeDpa, sourceName)
  };
  if (prefillGpu !== null) point.num_prefill_gpu = prefillGpu;
  if (decodeGpu !== null) point.num_decode_gpu = decodeGpu;
  if (prefillTp !== null) point.prefill_tp = prefillTp;
  if (prefillEp !== null) point.prefill_ep = prefillEp;
  if (decodeTp !== null) point.decode_tp = decodeTp;
  if (decodeEp !== null) point.decode_ep = decodeEp;
  if (prefillDpa !== undefined) point.prefill_dp_attention = prefillDpa;
  if (decodeDpa !== undefined) point.decode_dp_attention = decodeDpa;
  if (prefillDpa !== undefined && prefillDpa === decodeDpa) point.dp_attention = prefillDpa;
  if (shape) point.shape = shape;
  point.prefill_num_workers = readMetricNumber(record, ['prefill_num_workers', 'prefill workers']) ?? undefined;
  point.decode_num_workers = readMetricNumber(record, ['decode_num_workers', 'decode workers']) ?? undefined;
  point.disagg = readMetricBoolean(record, ['disagg']) ?? (prefillGpu !== null && decodeGpu !== null);
  point.is_multinode = readMetricBoolean(record, ['is_multinode', 'multi_node', 'multinode']) ?? undefined;

  return { interactivity, throughput, model, islOsl, precision, mtp, hardware, framework, specMethod, lineName, title, point };
}

function makeImportedPointLabel(
  date: string,
  prefillTp: number | null,
  prefillEp: number | null,
  prefillGpu: number | null,
  decodeGpu: number | null,
  prefillDpa: boolean | undefined,
  decodeDpa: boolean | undefined,
  sourceName: string
): string {
  return [
    date ? `date ${date}` : '',
    prefillTp !== null || prefillEp !== null ? `prefill TP${prefillTp ?? '?'} EP${prefillEp ?? '?'}` : '',
    decodeGpu !== null ? `decode GPUs ${decodeGpu}` : '',
    prefillGpu !== null ? `prefill GPUs ${prefillGpu}` : '',
    prefillDpa !== undefined ? `prefill DPA ${prefillDpa}` : '',
    decodeDpa !== undefined ? `decode DPA ${decodeDpa}` : '',
    `source ${sourceName}`
  ]
    .filter(Boolean)
    .join('; ');
}

function mergeImportedSeries(series: InferenceCurveSeries[]): InferenceCurveSeries[] {
  const merged = new Map<string, InferenceCurveSeries>();
  series.forEach((line) => {
    const existing = merged.get(line.id);
    if (!existing) {
      merged.set(line.id, { ...line, points: [...line.points] });
      return;
    }
    existing.points.push(...line.points);
  });

  return Array.from(merged.values()).map((line) => {
    const seen = new Set<string>();
    const points = line.points.filter((point) => {
      const key = JSON.stringify([
        point.interactivity,
        point.throughput,
        point.precision,
        point.concurrency,
        point.label
      ]);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return { ...line, points };
  });
}

function formatImportSummary(
  importedSeries: InferenceCurveSeries[],
  allSeries: InferenceCurveSeries[],
  drafts: SeriesDraft[]
): string {
  const importedPointRows = importedSeries.reduce((count, line) => count + line.points.length, 0);
  const importedLines = importedSeries
    .map((line) => `${line.name} (${line.points.length})`)
    .sort((a, b) => a.localeCompare(b));
  const visibleLines = importedLines.slice(0, 8).join('; ');
  const hiddenCount = Math.max(0, importedLines.length - 8);
  const suffix = hiddenCount > 0 ? `; +${hiddenCount} more` : '';
  return [
    `Appended ${importedSeries.length} lines / ${importedPointRows} point rows.`,
    `Imported lines: ${visibleLines || 'none'}${suffix}.`,
    `Current data: ${allSeries.length} lines, ${countPointRows(drafts)} point rows.`
  ].join(' ');
}

function scoreArtifactName(name: string): number {
  const value = name.toLowerCase();
  let score = 0;
  if (/benchmark|inference|result|metric|data|summary|agg/u.test(value)) score += 10;
  if (/log|trace|profile/u.test(value)) score -= 4;
  return score;
}

function parseDelimitedText(text: string, delimiter: ',' | '\t'): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const input = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]!;
    const next = input[index + 1];
    if (char === '"') {
      if (quoted && next === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === delimiter && !quoted) {
      row.push(normalizeCellText(cell));
      cell = '';
    } else if (char === '\n' && !quoted) {
      row.push(normalizeCellText(cell));
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell || row.length > 0) {
    row.push(normalizeCellText(cell));
    rows.push(row);
  }
  return rows.filter((item) => item.some((cellValue) => cellValue));
}

function readMetricNumber(record: Record<string, unknown>, aliases: string[]): number | null {
  for (const alias of aliases) {
    const value = readMetricValue(record, alias);
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = parseNumber(value);
      if (parsed !== null) return parsed;
    }
  }
  return null;
}

function readMetricString(record: Record<string, unknown>, aliases: string[]): string {
  for (const alias of aliases) {
    const value = readMetricValue(record, alias);
    if (value === null || value === undefined) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
}

function readMetricBoolean(record: Record<string, unknown>, aliases: string[]): boolean | undefined {
  for (const alias of aliases) {
    const value = readMetricValue(record, alias);
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') {
      if (value === 1) return true;
      if (value === 0) return false;
    }
    if (typeof value === 'string') {
      const parsed = parseBoolean(value);
      if (parsed !== null) return parsed;
    }
  }
  return undefined;
}

function readMetricValue(record: Record<string, unknown>, alias: string): unknown {
  if (alias.includes('.')) {
    const pathValue = readPathValue(record, alias.split('.'));
    if (pathValue !== undefined) return pathValue;
  }
  const wanted = normalizeImportKey(alias);
  for (const [key, value] of Object.entries(record)) {
    if (normalizeImportKey(key) === wanted) return value;
  }
  return undefined;
}

function readPathValue(value: unknown, path: string[]): unknown {
  let current = value;
  for (const segment of path) {
    if (!isRecord(current)) return undefined;
    current = readMetricValue(current, segment);
  }
  return current;
}

function normalizeImportKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/gu, '');
}

function formatImportedModelFromRecord(record: Record<string, unknown>, sourceName: string): string {
  const modelKey = resolveImportedModelKey(record) ?? resolveModelKeyFromText(sourceName);
  if (modelKey) return DB_MODEL_TO_DISPLAY[modelKey] ?? modelKey;

  const rawModel = readMetricString(record, ['model', 'model_name', 'model name']);
  return formatUnknownImportedModel(rawModel);
}

function resolveImportedModelKey(record: Record<string, unknown>): string | null {
  const prefix = readMetricString(record, [
    'infmax_model_prefix',
    'model_prefix',
    'model key',
    'model_key',
    'db_model',
    'db model'
  ]);
  const prefixKey = resolveModelKeyFromPrefix(prefix);
  if (prefixKey) return prefixKey;

  const rawModel = readMetricString(record, ['model', 'model_name', 'model name']);
  return resolveModelKeyFromModelValue(rawModel);
}

function resolveModelKeyFromPrefix(value: string): string | null {
  const lower = value.trim().toLowerCase();
  if (!lower) return null;
  if (DB_MODEL_TO_DISPLAY[lower]) return lower;
  if (MODEL_PREFIX_ALIASES[lower]) return MODEL_PREFIX_ALIASES[lower]!;

  const stripped = lower.replace(MODEL_KEY_PRECISION_SUFFIX, '');
  if (DB_MODEL_TO_DISPLAY[stripped]) return stripped;
  return MODEL_PREFIX_ALIASES[stripped] ?? null;
}

function resolveModelKeyFromModelValue(value: string): string | null {
  const lower = value.trim().toLowerCase();
  if (!lower) return null;

  const directPrefix = resolveModelKeyFromPrefix(lower);
  if (directPrefix) return directPrefix;

  const directPath = MODEL_PATH_TO_DB_KEY[lower];
  if (directPath) return directPath;

  const pathTail = lower.split(/[\\/]/u).filter(Boolean).at(-1) ?? '';
  const tailPrefix = resolveModelKeyFromPrefix(pathTail);
  if (tailPrefix) return tailPrefix;

  const compact = lower.replace(/[^a-z0-9]+/gu, '');
  const compactAliases: Record<string, string> = {
    deepseekr10528: 'dsr1',
    deepseekr1: 'dsr1',
    gptoss120b: 'gptoss120b',
    llama3370binstructfp8: 'llama70b',
    qwen35397ba17b: 'qwen3.5',
    kimik25: 'kimik2.5',
    minimaxm25: 'minimaxm2.5',
    glm5: 'glm5',
    deepseekv4pro: 'dsv4'
  };
  return compactAliases[compact] ?? null;
}

function resolveModelKeyFromText(value: string): string | null {
  const tokens = value
    .toLowerCase()
    .split(/[^a-z0-9.]+/u)
    .filter(Boolean);
  for (const token of tokens) {
    const key = resolveModelKeyFromPrefix(token);
    if (key) return key;
  }
  return null;
}

function formatUnknownImportedModel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return DEFAULT_MODEL;
  return trimmed.split(/[\\/]/u).filter(Boolean).at(-1) ?? trimmed;
}

function resolveImportedSpecMethod(record: Record<string, unknown>): string {
  const rawMtp = readMetricString(record, ['mtp']);
  if (rawMtp && normalizeMtpValue(rawMtp) === MTP_VALUE) return MTP_VALUE;
  return normalizeImportedSpecMethod(
    readMetricString(record, ['spec_method', 'spec method', 'spec_decoding', 'spec decoding', 'speculation'])
  );
}

function normalizeImportedSpecMethod(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized || ['none', 'off', 'false', 'no', 'n', '0'].includes(normalized)) return 'none';
  if (['mtp', 'on', 'true', 'yes', 'y', '1'].includes(normalized)) return MTP_VALUE;
  return normalized;
}

function formatImportedLineName(hardware: string, framework: string, specMethod: string): string {
  const hardwareLabel = formatHardwareLabel(hardware);
  const frameworkLabel = formatFrameworkLabel(framework);
  const suffix = specMethod === MTP_VALUE ? ' MTP' : '';
  return frameworkLabel === 'Unknown'
    ? `${hardwareLabel}${suffix}`
    : `${hardwareLabel} (${frameworkLabel}${suffix})`;
}

function normalizeImportedHardware(value: string): string {
  const lower = value.trim().toLowerCase();
  if (!lower) return '';
  const base = lower.split('-')[0]!;
  const known = new Set(['gb300', 'gb200', 'b300', 'b200', 'h200', 'h100', 'mi355x', 'mi325x', 'mi300x']);
  return known.has(base) ? base : lower;
}

function formatHardwareLabel(value: string): string {
  return value
    .split(/[-_\s]+/u)
    .filter(Boolean)
    .map((part) => part.toUpperCase())
    .join(' ');
}

function formatFrameworkLabel(value: string): string {
  const normalized = value.toLowerCase();
  if (!normalized || normalized === 'unknown') return 'Unknown';
  const replacements: Record<string, string> = {
    mori: 'MoRI',
    sglang: 'SGLang',
    dynamo: 'Dynamo',
    trt: 'TRT',
    tensorrt: 'TRT'
  };
  return normalized
    .split(/[-_\s]+/u)
    .filter(Boolean)
    .map((part) => replacements[part] ?? part.toUpperCase())
    .join(' ');
}

function makeLineId(imported: ImportedPointRow): string {
  return [
    imported.model,
    imported.islOsl,
    imported.precision,
    imported.hardware,
    imported.framework,
    imported.specMethod
  ]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '');
}

function normalizeImportedKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/gu, '_').replace(/^_|_$/gu, '');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function asOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

async function formatFetchError(response: Response): Promise<string> {
  const text = await response.text().catch(() => '');
  const parsedMessage = parseGitHubErrorMessage(text);
  if (response.status === 403 && parsedMessage.toLowerCase().includes('rate limit')) {
    const resetAt = formatRateLimitReset(response.headers.get('x-ratelimit-reset'));
    return [
      'GitHub API rate limit exceeded.',
      'Paste a GitHub token in the Token field and retry.',
      resetAt ? `Unauthenticated limit resets around ${resetAt}.` : '',
      'For private repositories, use a token with Actions read access.'
    ]
      .filter(Boolean)
      .join(' ');
  }
  const message = parsedMessage || text;
  return `${response.status} ${response.statusText}${message ? `: ${message.slice(0, 220)}` : ''}`;
}

function parseGitHubErrorMessage(text: string): string {
  if (!text) return '';
  try {
    const data = JSON.parse(text) as unknown;
    if (isRecord(data) && typeof data.message === 'string') return data.message;
  } catch {
    return text;
  }
  return text;
}

function formatRateLimitReset(value: string | null): string {
  if (!value) return '';
  const timestamp = Number(value);
  if (!Number.isFinite(timestamp)) return '';
  return new Date(timestamp * 1000).toLocaleString();
}

function downloadCsv(): void {
  commitSeriesDom();
  scheduleLocalSave();
  const rows = [
    [...seriesCsvColumns.map((column) => column.label), ...pointColumns.map((column) => column.label)],
    ...seriesDrafts.flatMap((series) =>
      series.points.map((row) => [
        series.id,
        series.name,
        series.model,
        series.islOsl,
        series.precision,
        getDraftMtpFilter(series),
        normalizePointShapeValue(series.marker),
        series.title,
        series.color,
        series.lineStyle,
        String(series.renderOrder),
        ...pointColumns.map((column) => row[column.key] ?? '')
      ])
    )
  ];
  const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n');
  downloadBlob('token-throughput-vs-interactivity.csv', csv, 'text/csv;charset=utf-8');
}

function downloadPng(): void {
  const svg = chartEl.querySelector('svg');
  if (!svg) return;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const styles = getComputedStyle(document.documentElement);
  const bg = styles.getPropertyValue('--background').trim() || '#131416';
  clone.insertAdjacentHTML('afterbegin', `<rect width="100%" height="100%" fill="${bg}"/>`);
  const svgText = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const pngUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'token-throughput-vs-interactivity.png';
      link.click();
      URL.revokeObjectURL(pngUrl);
    });
  };
  image.src = url;
}

function getColorPicker(seriesIndex: number): HTMLInputElement | null {
  return seriesEditorEl.querySelector<HTMLInputElement>(
    `input[data-series-index="${seriesIndex}"][data-color-picker="true"]`
  );
}

function getLineStyleCustomInput(seriesIndex: number): HTMLInputElement | null {
  return seriesEditorEl.querySelector<HTMLInputElement>(
    `input[data-series-index="${seriesIndex}"][data-line-style-custom="true"]`
  );
}

function syncColorPicker(seriesIndex: number, color: string, selectedColor = color): void {
  const picker = getColorPicker(seriesIndex);
  if (picker) picker.value = toColorInputValue(color, seriesIndex);
  syncSeriesSwatch(seriesIndex, color);
  syncPresetSelection(seriesIndex, selectedColor);
}

function syncSeriesSwatch(seriesIndex: number, color: string): void {
  const swatch = seriesEditorEl.querySelector<HTMLElement>(
    `.series-card[data-series-index="${seriesIndex}"] .series-swatch`
  );
  if (swatch && color.trim()) swatch.style.background = color;
}

function syncPresetSelection(seriesIndex: number, color: string): void {
  seriesEditorEl
    .querySelectorAll<HTMLButtonElement>(`button[data-series-index="${seriesIndex}"][data-color-preset]`)
    .forEach((button) => {
      button.classList.toggle(
        'selected',
        (button.dataset.colorPreset ?? '').toLowerCase() === color.trim().toLowerCase()
      );
    });
}

function toColorInputValue(color: string, index: number): string {
  const trimmed = color.trim();
  if (isSixDigitHex(trimmed)) return trimmed;
  const shortHex = trimmed.match(/^#([0-9a-f]{3})$/iu);
  if (shortHex) {
    return `#${shortHex[1]!
      .split('')
      .map((char) => `${char}${char}`)
      .join('')}`;
  }
  return colorInputFallbacks[index % colorInputFallbacks.length]!;
}

function isSixDigitHex(value: string): boolean {
  return /^#[0-9a-f]{6}$/iu.test(value.trim());
}

function downloadBlob(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function setStatus(message: string, error = false): void {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', error);
}

function setImportStatus(message: string, error = false): void {
  githubImportStatusEl.textContent = message;
  githubImportStatusEl.classList.toggle('error', error);
}

function applyTheme(): void {
  document.documentElement.classList.toggle('dark', state.theme === 'dark');
  document.documentElement.classList.toggle('light', state.theme === 'light');
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function escapeHtml(value: string): string {
  const span = document.createElement('span');
  span.textContent = value;
  return span.innerHTML;
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll('"', '&quot;');
}
