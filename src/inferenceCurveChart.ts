import * as d3 from 'd3';

export interface InferenceCurvePoint {
  interactivity: number;
  throughput: number;
  strategy?: string;
  precision?: string;
  tp?: number;
  ep?: number;
  dp_attention?: boolean;
  num_prefill_gpu?: number;
  num_decode_gpu?: number;
  prefill_tp?: number;
  prefill_ep?: number;
  prefill_dp_attention?: boolean;
  prefill_num_workers?: number;
  decode_tp?: number;
  decode_ep?: number;
  decode_dp_attention?: boolean;
  decode_num_workers?: number;
  disagg?: boolean;
  is_multinode?: boolean;
  concurrency?: number;
  shape?: string;
  label?: string;
  [key: string]: unknown;
}

export interface InferenceCurveSeries {
  id: string;
  name: string;
  hwKey?: string;
  model?: string;
  islOsl?: string;
  precision?: string;
  mtp?: string;
  marker?: string;
  color?: string;
  lineStyle?: string;
  renderOrder?: number;
  title?: string;
  points: InferenceCurvePoint[];
}

export interface InferenceCurveChartOptions {
  activeSeriesIds?: Set<string>;
  selectedPrecisions?: string[];
  showNonOptimalPoints?: boolean;
  hidePointLabels?: boolean;
  useAdvancedLabels?: boolean;
  showGradientLabels?: boolean;
  showLineLabels?: boolean;
  highContrast?: boolean;
  logY?: boolean;
  theme?: 'dark' | 'light';
  height?: number;
  title?: string;
  subtitle?: string;
  xLabel?: string;
  yLabel?: string;
}

interface ChartPoint extends InferenceCurvePoint {
  seriesId: string;
  seriesName: string;
  seriesTitle?: string;
  color: string;
  precision: string;
  x: number;
  y: number;
  roof: boolean;
}

interface PreparedSeries {
  id: string;
  name: string;
  title?: string;
  color: string;
  lineDasharray: string | null;
  renderOrder: number;
  points: ChartPoint[];
  roofline: ChartPoint[];
}

interface StrategyLabel {
  point: ChartPoint;
  label: string;
  color: string;
}

interface ChartInteractionState {
  hoveredSeriesId: string | null;
  selectedSeriesId: string | null;
}

interface PillLabel {
  key: string;
  seriesId: string;
  x: number;
  y: number;
  label: string;
  color: string;
}

type ContinuousScale = d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number>;
type ShapeKey = 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'plus' | 'cross';

const TABLEAU_10 = [
  '#4e79a7',
  '#f28e2c',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc949',
  '#af7aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ab'
];

const HIGH_CONTRAST = [
  '#22c55e',
  '#f97316',
  '#38bdf8',
  '#ef4444',
  '#a78bfa',
  '#facc15',
  '#14b8a6',
  '#ec4899',
  '#84cc16',
  '#fb7185'
];

const STRATEGY_COLORS = [
  '#6366f1',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#ec4899',
  '#14b8a6',
  '#a855f7'
];

const SHAPE_ORDER: ShapeKey[] = ['circle', 'square', 'triangle', 'diamond'];
const POINT_SIZE = 3.5;
const HOVER_POINT_SIZE = 6;
const HIT_AREA_RADIUS = 12;
const DIMMED_SERIES_OPACITY = 0.16;
const CHART_MARGIN = { top: 18, right: 24, bottom: 48, left: 82 };

type Vendor = 'nvidia' | 'amd' | 'unknown';

const GPU_MODEL_SORT: Record<string, number> = {
  gb300: 0,
  gb200: 1,
  b300: 2,
  b200: 3,
  mi355x: 4,
  h200: 5,
  mi325x: 6,
  h100: 7,
  mi300x: 8
};

const GPU_VENDOR: Record<string, Vendor> = {
  gb300: 'nvidia',
  gb200: 'nvidia',
  b300: 'nvidia',
  b200: 'nvidia',
  h200: 'nvidia',
  h100: 'nvidia',
  mi355x: 'amd',
  mi325x: 'amd',
  mi300x: 'amd'
};

const VENDOR_OKLCH_ZONES: Record<
  Vendor,
  { start: number; end: number; chroma: { light: number; dark: number } }
> = {
  amd: { start: 12, end: 42, chroma: { light: 0.18, dark: 0.22 } },
  nvidia: { start: 120, end: 170, chroma: { light: 0.15, dark: 0.15 } },
  unknown: { start: 275, end: 330, chroma: { light: 0.14, dark: 0.16 } }
};

const LIGHTNESS = {
  light: { min: 0.42, max: 0.68 },
  dark: { min: 0.5, max: 0.78 }
} as const;

const defaultOptions: Required<
  Omit<InferenceCurveChartOptions, 'activeSeriesIds' | 'selectedPrecisions'>
> = {
  showNonOptimalPoints: false,
  hidePointLabels: false,
  useAdvancedLabels: false,
  showGradientLabels: false,
  showLineLabels: false,
  highContrast: false,
  logY: false,
  theme: 'dark',
  height: 575,
  title: 'Token Throughput per GPU vs. Interactivity',
  subtitle: 'Custom data • Source: user supplied',
  xLabel: 'Interactivity (tok/s/user)',
  yLabel: 'Token Throughput per GPU (tok/s/gpu)'
};

let resetZoom: (() => void) | null = null;

export function resetInferenceCurveZoom(): void {
  resetZoom?.();
}

export function getAvailablePrecisions(series: InferenceCurveSeries[]): string[] {
  const values = new Set<string>();
  series.forEach((line) => {
    line.points.forEach((point) => values.add(String(point.precision ?? 'default')));
  });
  return Array.from(values);
}

export function paretoFrontUpperLeft<T extends { x: number; y: number }>(input: T[]): T[] {
  const sorted = [...input].sort((a, b) => {
    if (a.x === b.x) return b.y - a.y;
    return a.x - b.x;
  });

  const front: T[] = [];
  for (const point of sorted) {
    const last = front.at(-1);
    if (last && point.x === last.x) {
      if (point.y > last.y) front[front.length - 1] = point;
      continue;
    }

    while (front.length > 0 && point.y >= front.at(-1)!.y) {
      front.pop();
    }
    front.push(point);
  }

  return front;
}

export function prepareInferenceCurveSeries(
  series: InferenceCurveSeries[],
  highContrast = false,
  theme: 'dark' | 'light' = 'dark'
): PreparedSeries[] {
  const colors = resolveInferenceCurveColors(series, highContrast, theme);
  return series.map((line, seriesIndex) => {
    const palette = highContrast ? HIGH_CONTRAST : TABLEAU_10;
    const color = colors.get(line.id) ?? palette[seriesIndex % palette.length]!;
    const lineDasharray = resolveLineDasharray(line.lineStyle);
    const points = line.points
      .filter((point) => Number.isFinite(point.interactivity) && Number.isFinite(point.throughput))
      .map((point) => ({
        ...point,
        seriesId: line.id,
        seriesName: line.name,
        seriesTitle: line.title,
        color,
        precision: String(point.precision ?? 'default'),
        shape: point.shape || line.marker,
        x: point.interactivity,
        y: point.throughput,
        roof: false
      }));

    const roofline = paretoFrontUpperLeft(points);
    const roofKeys = new Set(roofline.map((point) => `${point.x}|${point.y}|${point.precision}`));
    points.forEach((point) => {
      point.roof = roofKeys.has(`${point.x}|${point.y}|${point.precision}`);
    });

    return {
      id: line.id,
      name: line.name,
      title: line.title,
      color,
      lineDasharray,
      renderOrder: getSeriesRenderOrder(line, seriesIndex),
      points,
      roofline
    };
  });
}

export function resolveInferenceCurveColors(
  series: InferenceCurveSeries[],
  highContrast = false,
  theme: 'dark' | 'light' = 'dark'
): Map<string, string> {
  if (highContrast) {
    return new Map(series.map((line, index) => [line.id, HIGH_CONTRAST[index % HIGH_CONTRAST.length]!]));
  }

  const dynamicColors = generateVendorColors(
    series.filter((line) => !line.color?.trim()),
    theme
  );

  return new Map(
    series.map((line, index) => {
      const customColor = line.color?.trim();
      const fallback = TABLEAU_10[index % TABLEAU_10.length]!;
      return [line.id, customColor || dynamicColors.get(getHardwareKey(line)) || fallback];
    })
  );
}

function generateVendorColors(
  series: InferenceCurveSeries[],
  theme: 'dark' | 'light'
): Map<string, string> {
  const groups = new Map<Vendor, Set<string>>();
  series.forEach((line) => {
    const hwKey = getHardwareKey(line);
    const vendor = getVendor(hwKey);
    groups.set(vendor, (groups.get(vendor) ?? new Set()).add(hwKey));
  });

  const colorByHardwareKey = new Map<string, string>();
  groups.forEach((keySet, vendor) => {
    const keys = Array.from(keySet).sort(
      (a, b) => getModelSortIndex(a) - getModelSortIndex(b) || a.localeCompare(b)
    );
    const zone = VENDOR_OKLCH_ZONES[vendor];
    const chroma = zone.chroma[theme];
    const count = keys.length;

    keys.forEach((key, index) => {
      const hue =
        count <= 1
          ? (zone.start + zone.end) / 2
          : zone.start + ((index + 0.5) / count) * (zone.end - zone.start);
      const lightness = pickLightness(index, count, theme);
      colorByHardwareKey.set(key, `oklch(${lightness.toFixed(3)} ${chroma} ${hue.toFixed(1)})`);
    });
  });

  return colorByHardwareKey;
}

function pickLightness(index: number, count: number, theme: 'dark' | 'light'): number {
  const { min, max } = LIGHTNESS[theme];
  if (count <= 1) return (min + max) / 2;
  return max - (index / (count - 1)) * (max - min);
}

function getHardwareKey(line: InferenceCurveSeries): string {
  if (line.hwKey?.trim()) return normalizeHardwareKey(line.hwKey);

  const label = `${line.id} ${line.name} ${line.title ?? ''}`.toLowerCase();
  const base = label.match(/\b(gb300|gb200|b300|b200|h200|h100|mi355x|mi325x|mi300x)\b/u)?.[1];
  if (!base) return normalizeHardwareKey(line.id || line.name);

  const framework = getFrameworkKey(label);
  const suffix = isMtpSeries(line, label) ? '_mtp' : '';
  return framework ? `${base}_${framework}${suffix}` : `${base}${suffix}`;
}

function isMtpSeries(line: InferenceCurveSeries, label: string): boolean {
  const explicit = String(line.mtp ?? '').trim().toLowerCase();
  if (explicit) return explicit === 'mtp' || explicit === 'true' || explicit === 'on';
  return /\bmtp\b/u.test(label);
}

function getFrameworkKey(label: string): string | null {
  const hasDynamo = label.includes('dynamo');
  const hasMori = label.includes('mori');
  const hasSglang = label.includes('sglang');
  const hasTrt = label.includes('trt') || label.includes('tensorrt');

  if (hasMori && hasSglang) return 'mori-sglang';
  if (hasDynamo && hasSglang) return 'dynamo-sglang';
  if (hasDynamo && hasTrt) return 'dynamo-trt';
  if (hasMori) return 'mori';
  if (hasSglang) return 'sglang';
  if (hasTrt) return 'trt';
  return null;
}

function normalizeHardwareKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[()[\]{}]/gu, ' ')
    .replace(/\s+/gu, '-')
    .replace(/-+/gu, '-')
    .replace(/_+/gu, '_');
}

function getVendor(hwKey: string): Vendor {
  const base = hwKey.split('_')[0]!;
  return GPU_VENDOR[base] ?? 'unknown';
}

function getModelSortIndex(hwKey: string): number {
  const base = hwKey.split('_')[0]!;
  return GPU_MODEL_SORT[base] ?? Object.keys(GPU_MODEL_SORT).length;
}

function resolveLineDasharray(lineStyle: string | undefined): string | null {
  const value = lineStyle?.trim();
  if (!value) return null;

  const normalized = value.toLowerCase().replace(/[_\s]+/gu, '-');
  if (normalized === 'solid' || normalized === 'none') return null;
  if (normalized === 'dash' || normalized === 'dashed') return '8 5';
  if (normalized === 'dot' || normalized === 'dotted') return '2 5';
  if (normalized === 'dash-dot' || normalized === 'dashdot') return '8 4 2 4';
  if (normalized === 'long-dash' || normalized === 'longdash') return '12 5';

  const numericPattern = value.replaceAll(',', ' ').replace(/\s+/gu, ' ').trim();
  if (/^(?:\d+(?:\.\d+)?)(?:\s+\d+(?:\.\d+)?)*$/u.test(numericPattern)) {
    return numericPattern;
  }

  return value;
}

function getSeriesRenderOrder(series: InferenceCurveSeries, fallback: number): number {
  return typeof series.renderOrder === 'number' && Number.isFinite(series.renderOrder)
    ? series.renderOrder
    : fallback;
}

function sortPreparedSeriesForRender(series: PreparedSeries[]): PreparedSeries[] {
  return series
    .map((line, index) => ({ line, index }))
    .sort((a, b) => a.line.renderOrder - b.line.renderOrder || a.index - b.index)
    .map(({ line }) => line);
}

export function renderInferenceCurveChart(
  container: HTMLElement,
  rawSeries: InferenceCurveSeries[],
  userOptions: InferenceCurveChartOptions = {}
): void {
  const options = { ...defaultOptions, ...userOptions };
  const allPrecisions = getAvailablePrecisions(rawSeries);
  const selectedPrecisions = userOptions.selectedPrecisions?.length
    ? userOptions.selectedPrecisions
    : allPrecisions;
  const activeSeriesIds =
    userOptions.activeSeriesIds ?? new Set(rawSeries.map((series) => series.id));

  const prepared = prepareInferenceCurveSeries(rawSeries, options.highContrast, options.theme);
  const visibleSeries = sortPreparedSeriesForRender(
    prepared.map((series) => ({
      ...series,
      points: series.points.filter(
        (point) => activeSeriesIds.has(point.seriesId) && selectedPrecisions.includes(point.precision)
      ),
      roofline: series.roofline.filter(
        (point) => activeSeriesIds.has(point.seriesId) && selectedPrecisions.includes(point.precision)
      )
    }))
  );

  const allVisiblePoints = visibleSeries.flatMap((series) => series.points);
  const scalePoints = options.showNonOptimalPoints
    ? allVisiblePoints
    : visibleSeries.flatMap((series) => series.roofline);

  container.replaceChildren();
  resetZoom = null;

  if (scalePoints.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'chart-empty';
    empty.innerHTML = '<strong>No data available</strong><span>Change filters or paste valid data.</span>';
    container.append(empty);
    return;
  }

  const width = Math.max(container.clientWidth, 720);
  const height = options.height;
  const innerWidth = width - CHART_MARGIN.left - CHART_MARGIN.right;
  const innerHeight = height - CHART_MARGIN.top - CHART_MARGIN.bottom;

  const xMax = d3.max(scalePoints, (point) => point.x) ?? 100;
  const yExtent = d3.extent(scalePoints, (point) => point.y) as [number, number];
  const yRange = yExtent[1] - yExtent[0];
  const xScale = d3
    .scaleLinear()
    .domain([0, Math.max(1, xMax * 1.05)])
    .range([0, innerWidth])
    .nice();

  const yMin = options.logY
    ? Math.max(0.1, yExtent[0] <= 0 ? 0.1 : yExtent[0] * 0.95)
    : Math.max(0, yExtent[0] - yRange * 0.05);
  const yDomain: [number, number] = [yMin, Math.max(yExtent[1] * 1.05, yMin + 1)];
  const yScale: ContinuousScale = options.logY
    ? d3.scaleLog().domain(yDomain).range([innerHeight, 0]).nice()
    : d3.scaleLinear().domain(yDomain).range([innerHeight, 0]).nice();

  const root = d3
    .select(container)
    .append('div')
    .attr('class', 'chart-shell')
    .style('height', `${height}px`);

  const tooltip = root.append('div').attr('class', 'chart-tooltip').style('opacity', 0);
  const svg = root
    .append('svg')
    .attr('class', 'inference-curve-chart')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', options.title);

  const defs = svg.append('defs');
  defs
    .append('clipPath')
    .attr('id', 'plot-clip')
    .append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight);

  const plot = svg
    .append('g')
    .attr('class', 'chart-root')
    .attr('transform', `translate(${CHART_MARGIN.left},${CHART_MARGIN.top})`);
  const grid = plot.append('g').attr('class', 'grid');
  const xAxisGroup = plot
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`);
  const yAxisGroup = plot.append('g').attr('class', 'y-axis');
  const zoomGroup = plot.append('g').attr('class', 'zoom-group').attr('clip-path', 'url(#plot-clip)');
  const rulerGroup = plot.append('g').attr('class', 'ruler-group').style('display', 'none');

  const verticalRuler = rulerGroup
    .append('line')
    .attr('class', 'ruler-line')
    .attr('y1', 0)
    .attr('y2', innerHeight);
  const horizontalRuler = rulerGroup
    .append('line')
    .attr('class', 'ruler-line')
    .attr('x1', 0)
    .attr('x2', innerWidth);

  plot
    .append('text')
    .attr('class', 'x-axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', height - CHART_MARGIN.top - 8)
    .attr('text-anchor', 'middle')
    .text(options.xLabel);

  svg
    .append('text')
    .attr('class', 'y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(CHART_MARGIN.top + innerHeight / 2))
    .attr('y', 14)
    .attr('text-anchor', 'middle')
    .text(options.yLabel);

  const strategyColor = buildStrategyColorMap(visibleSeries);
  const current = { xScale: xScale as ContinuousScale, yScale };
  const interaction: ChartInteractionState = {
    hoveredSeriesId: null,
    selectedSeriesId: null
  };

  const applyInteraction = () => applySeriesInteraction(zoomGroup, interaction, options);
  const setHoveredSeries = (seriesId: string | null) => {
    interaction.hoveredSeriesId = seriesId;
    applyInteraction();
  };
  const toggleSelectedSeries = (event: MouseEvent, seriesId: string) => {
    event.stopPropagation();
    interaction.selectedSeriesId = interaction.selectedSeriesId === seriesId ? null : seriesId;
    applyInteraction();
  };

  const renderGridAxes = (xs: ContinuousScale, ys: ContinuousScale) => {
    renderGrid(grid, xs, ys, innerWidth, innerHeight, options.logY);
    renderAxes(xAxisGroup, yAxisGroup, xs, ys, options);
  };

  const drawData = (xs: ContinuousScale, ys: ContinuousScale) => {
    current.xScale = xs;
    current.yScale = ys;

    drawRooflines(
      defs,
      zoomGroup,
      visibleSeries,
      xs,
      ys,
      strategyColor,
      options,
      setHoveredSeries,
      toggleSelectedSeries
    );
    drawScatterPoints(
      zoomGroup,
      allVisiblePoints,
      xs,
      ys,
      selectedPrecisions,
      strategyColor,
      tooltip,
      rulerGroup,
      verticalRuler,
      horizontalRuler,
      container,
      options,
      setHoveredSeries,
      toggleSelectedSeries
    );
    drawStrategyLabels(zoomGroup, visibleSeries, xs, ys, strategyColor, options);
    drawLineLabels(zoomGroup, visibleSeries, xs, ys, options);
    applyInteraction();
  };

  renderGridAxes(xScale, yScale);
  drawData(xScale, yScale);

  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.7, 20])
    .extent([
      [0, 0],
      [innerWidth, innerHeight]
    ])
    .translateExtent([
      [0, 0],
      [innerWidth, innerHeight]
    ])
    .on('zoom', (event) => {
      const nextX = event.transform.rescaleX(xScale);
      const nextY = event.transform.rescaleY(yScale);
      renderGridAxes(nextX, nextY);
      drawData(nextX, nextY);
      tooltip.style('opacity', 0).style('display', 'none');
      rulerGroup.style('display', 'none');
    });

  svg.call(zoom).on('dblclick.zoom', null);
  svg.on('click', () => {
    if (!interaction.selectedSeriesId) return;
    interaction.selectedSeriesId = null;
    applyInteraction();
  });
  svg.on('dblclick', () => {
    svg.transition().duration(180).call(zoom.transform, d3.zoomIdentity);
  });
  resetZoom = () => {
    svg.transition().duration(180).call(zoom.transform, d3.zoomIdentity);
  };
}

function drawRooflines(
  defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
  zoomGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  series: PreparedSeries[],
  xScale: ContinuousScale,
  yScale: ContinuousScale,
  strategyColor: Map<string, string>,
  options: Required<Omit<InferenceCurveChartOptions, 'activeSeriesIds' | 'selectedPrecisions'>>,
  setHoveredSeries: (seriesId: string | null) => void,
  toggleSelectedSeries: (event: MouseEvent, seriesId: string) => void
): void {
  const lineGenerator = d3
    .line<ChartPoint>()
    .x((point) => xScale(point.x))
    .y((point) => yScale(point.y))
    .curve(d3.curveMonotoneX);

  const entries = series
    .filter((line) => line.roofline.length > 1)
    .map((line) => {
      let stroke = line.color;
      const labels = makeStrategyLabels(line.roofline, strategyColor);
      const gradientStops = options.showGradientLabels
        ? computeGradientStops(labels, xScale)
        : null;
      if (gradientStops) {
        const gradientId = `roofline-gradient-${safeId(line.id)}`;
        let gradient = defs.select<SVGLinearGradientElement>(`#${gradientId}`);
        if (gradient.empty()) {
          gradient = defs.append('linearGradient').attr('id', gradientId);
        }
        gradient
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', xScale(line.roofline[0]!.x))
          .attr('y1', 0)
          .attr('x2', xScale(line.roofline.at(-1)!.x))
          .attr('y2', 0);
        gradient
          .selectAll('stop')
          .data(gradientStops)
          .join('stop')
          .attr('offset', (stop) => `${(stop.offset * 100).toFixed(2)}%`)
          .attr('stop-color', (stop) => stop.color);
        stroke = `url(#${gradientId})`;
      }
      return {
        key: line.id,
        points: line.roofline,
        stroke,
        color: line.color,
        lineDasharray: line.lineDasharray
      };
    });

  zoomGroup
    .selectAll<SVGPathElement, (typeof entries)[number]>('.roofline-path')
    .data(entries, (entry) => entry.key)
    .join(
      (enter) =>
        enter
          .append('path')
          .attr('class', (entry) => `roofline-path roofline-${safeId(entry.key)}`)
          .attr('fill', 'none')
          .attr('stroke-width', 2.5)
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round')
          .attr('cursor', 'pointer')
          .style('pointer-events', 'stroke'),
      (update) => update,
      (exit) => exit.remove()
    )
    .attr('stroke', (entry) => entry.stroke)
    .attr('stroke-dasharray', (entry) => entry.lineDasharray)
    .attr('d', (entry) => lineGenerator(entry.points))
    .on('mouseenter', (_event, entry) => {
      setHoveredSeries(entry.key);
    })
    .on('mouseleave', () => {
      setHoveredSeries(null);
    })
    .on('click', (event, entry) => {
      toggleSelectedSeries(event, entry.key);
    });
}

function drawScatterPoints(
  zoomGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  points: ChartPoint[],
  xScale: ContinuousScale,
  yScale: ContinuousScale,
  selectedPrecisions: string[],
  strategyColor: Map<string, string>,
  tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
  rulerGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  verticalRuler: d3.Selection<SVGLineElement, unknown, null, undefined>,
  horizontalRuler: d3.Selection<SVGLineElement, unknown, null, undefined>,
  container: HTMLElement,
  options: Required<Omit<InferenceCurveChartOptions, 'activeSeriesIds' | 'selectedPrecisions'>>,
  setHoveredSeries: (seriesId: string | null) => void,
  toggleSelectedSeries: (event: MouseEvent, seriesId: string) => void
): void {
  const key = (point: ChartPoint) =>
    `${point.seriesId}-${point.precision}-${point.x}-${point.y}-${point.concurrency ?? ''}-${point.shape ?? ''}-${point.label ?? ''}`;
  const selection = zoomGroup.selectAll<SVGGElement, ChartPoint>('.dot-group').data(points, key);
  const entered = selection.enter().append('g').attr('class', 'dot-group');
  entered.append('circle').attr('class', 'hit-area').attr('r', HIT_AREA_RADIUS).attr('fill', 'transparent');
  selection.exit().remove();
  const merged = entered.merge(selection);

  merged
    .attr('transform', (point) => `translate(${xScale(point.x)},${yScale(point.y)})`)
    .attr('cursor', 'pointer')
    .style('opacity', (point) => (isPointVisible(point, options) ? 1 : 0))
    .style('pointer-events', (point) => (isPointVisible(point, options) ? 'auto' : 'none'));

  merged.each(function (point) {
    const group = d3.select(this);
    const shapeKey = getPointShapeKey(point, selectedPrecisions);
    const targetTag = getShapeTag(shapeKey);
    const existing = group.select<SVGElement>('.visible-shape').node();
    if (!existing || existing.tagName.toLowerCase() !== targetTag) {
      group.select('.visible-shape').remove();
      group.append(targetTag).attr('class', 'visible-shape').attr('cursor', 'pointer');
    }

    const color =
      options.showGradientLabels && point.roof && point.strategy && strategyColor.has(point.strategy)
        ? strategyColor.get(point.strategy)!
        : point.color;
    const shape = group.select<SVGElement>('.visible-shape');
    shape.attr('fill', color).attr('stroke', 'none').attr('data-shape-key', shapeKey);
    applyShapeState(shape, shapeKey, false);

    const labelText = getPointLabelText(point, options);
    if (labelText) {
      group
        .selectAll<SVGTextElement, string>('.point-label')
        .data([labelText])
        .join('text')
        .attr('class', 'point-label')
        .attr('dy', -8)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--foreground)')
        .attr('font-size', '10px')
        .attr('pointer-events', 'none')
        .text((text) => text);
    } else {
      group.selectAll('.point-label').remove();
    }
  });

  merged
    .on('mouseenter', function (_event, point) {
      setHoveredSeries(point.seriesId);
      const shapeKey = getPointShapeKey(point, selectedPrecisions);
      applyShapeState(d3.select(this).select<SVGElement>('.visible-shape'), shapeKey, true);
      rulerGroup.style('display', 'block');
      verticalRuler.attr('x1', xScale(point.x)).attr('x2', xScale(point.x));
      horizontalRuler.attr('y1', yScale(point.y)).attr('y2', yScale(point.y));
      tooltip.style('opacity', 1).style('display', 'block').html(formatTooltip(point));
    })
    .on('mousemove', (event) => {
      const [mx, my] = d3.pointer(event, container);
      const pos = computeTooltipPosition(mx, my, tooltip, container);
      tooltip.style('left', `${pos.left}px`).style('top', `${pos.top}px`);
    })
    .on('mouseleave', function (_event, point) {
      const shapeKey = getPointShapeKey(point, selectedPrecisions);
      applyShapeState(d3.select(this).select<SVGElement>('.visible-shape'), shapeKey, false);
      setHoveredSeries(null);
      tooltip.style('opacity', 0).style('display', 'none');
      rulerGroup.style('display', 'none');
    })
    .on('click', (event, point) => {
      toggleSelectedSeries(event, point.seriesId);
    });
}

function drawStrategyLabels(
  zoomGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  series: PreparedSeries[],
  xScale: ContinuousScale,
  yScale: ContinuousScale,
  strategyColor: Map<string, string>,
  options: Required<Omit<InferenceCurveChartOptions, 'activeSeriesIds' | 'selectedPrecisions'>>
): void {
  if (!options.showGradientLabels) {
    zoomGroup.selectAll('.parallelism-label').remove();
    return;
  }

  const labels: PillLabel[] = [];
  series.forEach((line) => {
    const segments: { label: string; color: string; points: ChartPoint[] }[] = [];
    line.roofline.forEach((point) => {
      if (!point.strategy) return;
      const color = strategyColor.get(point.strategy) ?? line.color;
      const last = segments.at(-1);
      if (last && last.label === point.strategy) {
        last.points.push(point);
      } else {
        segments.push({ label: point.strategy, color, points: [point] });
      }
    });

    segments.forEach((segment, index) => {
      const point = segment.points[Math.floor(segment.points.length / 2)]!;
      labels.push({
        key: `${line.id}-${index}-${segment.label}`,
        seriesId: line.id,
        x: xScale(point.x),
        y: yScale(point.y) - 14,
        label: segment.label,
        color: segment.color
      });
    });
  });

  drawPillJoin(zoomGroup, '.parallelism-label', labels, 'middle');
}

function drawLineLabels(
  zoomGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  series: PreparedSeries[],
  xScale: ContinuousScale,
  yScale: ContinuousScale,
  options: Required<Omit<InferenceCurveChartOptions, 'activeSeriesIds' | 'selectedPrecisions'>>
): void {
  if (!options.showLineLabels) {
    zoomGroup.selectAll('.line-label').remove();
    return;
  }

  const placed: { x: number; y: number }[] = [];
  const labels: PillLabel[] = [];
  const sorted = [...series]
    .filter((line) => line.roofline.length >= 2)
    .sort((a, b) => yScale(a.roofline[0]!.y) - yScale(b.roofline[0]!.y));

  sorted.forEach((line) => {
    const candidates = [
      line.roofline[Math.min(1, line.roofline.length - 1)]!,
      line.roofline[Math.floor(line.roofline.length / 2)]!,
      line.roofline[Math.max(0, Math.floor((line.roofline.length * 2) / 3))]!,
      line.roofline.at(-1)!
    ];

    const chosen =
      candidates.find((point) => {
        const px = xScale(point.x);
        const py = yScale(point.y);
        return !placed.some((label) => Math.abs(label.x - px) < 120 && Math.abs(label.y - py) < 18);
      }) ?? candidates[0]!;
    const px = xScale(chosen.x);
    const py = yScale(chosen.y);
    placed.push({ x: px, y: py });
    labels.push({ key: line.id, seriesId: line.id, x: px + 8, y: py - 14, label: line.name, color: line.color });
  });

  drawPillJoin(zoomGroup, '.line-label', labels, 'start');
}

function drawPillJoin(
  layer: d3.Selection<SVGGElement, unknown, null, undefined>,
  selector: string,
  labels: PillLabel[],
  anchor: 'start' | 'middle'
): void {
  const groups = layer
    .selectAll<SVGGElement, (typeof labels)[number]>(selector)
    .data(labels, (label) => label.key)
    .join(
      (enter) => {
        const group = enter.append('g').attr('class', selector.slice(1)).style('pointer-events', 'none');
        group.append('rect').attr('class', 'pill-bg').attr('rx', 4).attr('ry', 4);
        group.append('text').attr('class', 'pill-text').attr('dominant-baseline', 'central');
        return group;
      },
      (update) => update,
      (exit) => exit.remove()
    )
    .attr('transform', (label) => `translate(${label.x},${label.y})`);

  groups.each(function (label) {
    const group = d3.select(this);
    const text = group
      .select<SVGTextElement>('.pill-text')
      .attr('text-anchor', anchor)
      .text(label.label);
    const bbox = text.node()!.getBBox();
    group
      .select<SVGRectElement>('.pill-bg')
      .attr('x', bbox.x - 5)
      .attr('y', bbox.y - 3)
      .attr('width', bbox.width + 10)
      .attr('height', bbox.height + 6)
      .attr('fill', label.color);
  });
}

function applySeriesInteraction(
  zoomGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  interaction: ChartInteractionState,
  options: Required<Omit<InferenceCurveChartOptions, 'activeSeriesIds' | 'selectedPrecisions'>>
): void {
  const selectedSeriesId = interaction.selectedSeriesId;
  const layerSeriesId = interaction.hoveredSeriesId ?? selectedSeriesId;

  zoomGroup
    .selectAll<SVGPathElement, { key: string }>('.roofline-path')
    .classed('selected-series', (entry) => entry.key === selectedSeriesId)
    .classed('dimmed-series', (entry) => Boolean(selectedSeriesId && entry.key !== selectedSeriesId))
    .style('opacity', (entry) => getSeriesOpacity(entry.key, selectedSeriesId));

  zoomGroup
    .selectAll<SVGGElement, ChartPoint>('.dot-group')
    .classed('selected-series', (point) => point.seriesId === selectedSeriesId)
    .classed('dimmed-series', (point) => Boolean(selectedSeriesId && point.seriesId !== selectedSeriesId))
    .style('opacity', (point) =>
      isPointVisible(point, options) ? getSeriesOpacity(point.seriesId, selectedSeriesId) : 0
    )
    .style('pointer-events', (point) => (isPointVisible(point, options) ? 'auto' : 'none'));

  zoomGroup
    .selectAll<SVGGElement, PillLabel>('.parallelism-label,.line-label')
    .classed('selected-series', (label) => label.seriesId === selectedSeriesId)
    .classed('dimmed-series', (label) => Boolean(selectedSeriesId && label.seriesId !== selectedSeriesId))
    .style('opacity', (label) => getSeriesOpacity(label.seriesId, selectedSeriesId));

  if (layerSeriesId) raiseSeriesToFront(zoomGroup, layerSeriesId);
}

function getSeriesOpacity(seriesId: string, selectedSeriesId: string | null): number {
  return selectedSeriesId && seriesId !== selectedSeriesId ? DIMMED_SERIES_OPACITY : 1;
}

function raiseSeriesToFront(
  zoomGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  seriesId: string
): void {
  zoomGroup
    .selectAll<SVGPathElement, { key: string }>('.roofline-path')
    .filter((entry) => entry.key === seriesId)
    .raise();
  zoomGroup
    .selectAll<SVGGElement, ChartPoint>('.dot-group')
    .filter((point) => point.seriesId === seriesId)
    .raise();
  zoomGroup
    .selectAll<SVGGElement, PillLabel>('.parallelism-label,.line-label')
    .filter((label) => label.seriesId === seriesId)
    .raise();
}

function renderGrid(
  grid: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: ContinuousScale,
  yScale: ContinuousScale,
  innerWidth: number,
  innerHeight: number,
  logY: boolean
): void {
  let xGroup = grid.select<SVGGElement>('.grid-v');
  if (xGroup.empty()) xGroup = grid.append('g').attr('class', 'grid-v');
  xGroup
    .selectAll<SVGLineElement, number>('line')
    .data(xScale.ticks(10))
    .join('line')
    .attr('x1', (tick) => xScale(tick))
    .attr('x2', (tick) => xScale(tick))
    .attr('y1', 0)
    .attr('y2', innerHeight);

  let yGroup = grid.select<SVGGElement>('.grid-h');
  if (yGroup.empty()) yGroup = grid.append('g').attr('class', 'grid-h');
  const yTicks = logY
    ? (yScale as d3.ScaleLogarithmic<number, number>).ticks(10)
    : (yScale as d3.ScaleLinear<number, number>).ticks(10);
  yGroup
    .selectAll<SVGLineElement, number>('line')
    .data(yTicks)
    .join('line')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', (tick) => yScale(tick))
    .attr('y2', (tick) => yScale(tick));

  grid
    .selectAll<SVGLineElement, string>('.plot-border')
    .data(['right', 'top'])
    .join('line')
    .attr('class', 'plot-border')
    .attr('x1', (side) => (side === 'right' ? innerWidth : 0))
    .attr('x2', innerWidth)
    .attr('y1', 0)
    .attr('y2', (side) => (side === 'right' ? innerHeight : 0));
}

function renderAxes(
  xAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  yAxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  xScale: ContinuousScale,
  yScale: ContinuousScale,
  options: Required<Omit<InferenceCurveChartOptions, 'activeSeriesIds' | 'selectedPrecisions'>>
): void {
  xAxisGroup.call(
    d3
      .axisBottom(xScale)
      .ticks(10)
      .tickFormat((value) => formatNumber(Number(value)))
  );
  const yAxis = d3.axisLeft(yScale).ticks(10);
  if (!options.logY) {
    yAxis.tickFormat((value) => formatLargeNumber(Number(value)));
  } else {
    yAxis.tickFormat(logTickFormat(yScale as d3.ScaleLogarithmic<number, number>));
  }
  yAxisGroup.call(yAxis);
}

function isPointVisible(
  point: ChartPoint,
  options: Required<Omit<InferenceCurveChartOptions, 'activeSeriesIds' | 'selectedPrecisions'>>
): boolean {
  return options.showNonOptimalPoints || point.roof;
}

function getPointLabelText(
  point: ChartPoint,
  options: Required<Omit<InferenceCurveChartOptions, 'activeSeriesIds' | 'selectedPrecisions'>>
): string {
  if (options.hidePointLabels || options.showGradientLabels) return '';
  if (options.useAdvancedLabels) return getAdvancedPointLabel(point);
  const referenceTp = getReferenceTp(point);
  if (referenceTp !== undefined) return formatPointLabelNumber(referenceTp);
  if (point.concurrency !== undefined) return String(point.concurrency);
  return point.strategy ?? '';
}

function getReferenceTp(point: ChartPoint): number | undefined {
  const explicitTp = readFiniteNumber(point.tp);
  const disagg = readBoolean(point.disagg);
  const prefillGpu = readFiniteNumber(point.num_prefill_gpu) ?? parseGpuCountFromLabel(point.label, 'prefill');
  const decodeGpu = readFiniteNumber(point.num_decode_gpu) ?? parseGpuCountFromLabel(point.label, 'decode');

  if (disagg !== false && prefillGpu !== undefined && decodeGpu !== undefined) {
    return prefillGpu + decodeGpu;
  }

  return explicitTp;
}

function getAdvancedPointLabel(point: ChartPoint): string {
  const labelConfig = parseParallelismFromLabel(point.label);
  const strategyConfig = parseParallelismFromStrategy(point.strategy);
  const tp = readFiniteNumber(point.tp) ?? getReferenceTp(point);
  const ep = readFiniteNumber(point.ep) ?? strategyConfig.ep;
  const dpAttention = readBoolean(point.dp_attention) ?? labelConfig.dpAttention;

  const prefillTp =
    readFiniteNumber(point.prefill_tp) ?? labelConfig.prefillTp ?? readFiniteNumber(point.tp) ?? tp;
  const prefillEp = readFiniteNumber(point.prefill_ep) ?? labelConfig.prefillEp ?? ep;
  const prefillDpAttention =
    readBoolean(point.prefill_dp_attention) ?? readBoolean(point.dp_attention) ?? labelConfig.dpAttention;
  const decodeTp = readFiniteNumber(point.decode_tp) ?? strategyConfig.tp ?? tp;
  const decodeEp = readFiniteNumber(point.decode_ep) ?? strategyConfig.ep ?? ep;
  const decodeDpAttention =
    readBoolean(point.decode_dp_attention) ?? readBoolean(point.dp_attention) ?? labelConfig.dpAttention;
  const prefillWorkers =
    readFiniteNumber(point.prefill_num_workers) ??
    inferWorkerCount(
      readFiniteNumber(point.num_prefill_gpu) ?? parseGpuCountFromLabel(point.label, 'prefill'),
      prefillTp,
      prefillEp
    );
  const decodeWorkers =
    readFiniteNumber(point.decode_num_workers) ??
    inferWorkerCount(
      readFiniteNumber(point.num_decode_gpu) ?? parseGpuCountFromLabel(point.label, 'decode'),
      decodeTp,
      decodeEp
    );

  const hasSplitConfig =
    prefillTp !== undefined ||
    prefillEp !== undefined ||
    decodeTp !== undefined ||
    decodeEp !== undefined ||
    prefillWorkers !== undefined ||
    decodeWorkers !== undefined;
  const disagg = readBoolean(point.disagg);
  const hasGpuSplit =
    (readFiniteNumber(point.num_prefill_gpu) ?? parseGpuCountFromLabel(point.label, 'prefill')) !== undefined &&
    (readFiniteNumber(point.num_decode_gpu) ?? parseGpuCountFromLabel(point.label, 'decode')) !== undefined;
  const isMultinodeDisagg = readBoolean(point.is_multinode) === true && disagg === true;

  if ((isMultinodeDisagg || (disagg !== false && hasGpuSplit)) && hasSplitConfig) {
    const prefillLabel = configSegmentLabel(
      prefillTp ?? tp ?? 0,
      prefillEp,
      prefillDpAttention
    );
    const decodeLabel = configSegmentLabel(decodeTp ?? tp ?? 0, decodeEp, decodeDpAttention);
    return `${prefillWorkers ?? 1}x${prefillLabel}+${decodeWorkers ?? 1}x${decodeLabel}`;
  }

  if (tp !== undefined && (ep !== undefined || dpAttention !== undefined)) {
    return configSegmentLabel(tp, ep, dpAttention);
  }

  const referenceTp = getReferenceTp(point);
  if (referenceTp !== undefined) return formatPointLabelNumber(referenceTp);
  return point.strategy ?? point.label ?? '';
}

function configSegmentLabel(
  tp: number,
  ep: number | undefined,
  dpAttention: boolean | undefined
): string {
  if (ep !== undefined && ep > 1 && tp === ep) return dpAttention ? `DEP${tp}` : `TEP${tp}`;
  const dpaPrefix = dpAttention ? 'DPA' : '';
  if (ep === undefined || ep <= 1) return `${dpaPrefix}TP${tp}`;
  return `${dpaPrefix}EP${ep}`;
}

function parseParallelismFromLabel(label: string | undefined): {
  prefillTp?: number;
  prefillEp?: number;
  dpAttention?: boolean;
} {
  const match = label?.match(/\bprefill\s+TP\s*(\d+(?:\.\d+)?)\s+EP\s*(\d+(?:\.\d+)?)/iu);
  return {
    prefillTp: match ? Number(match[1]) : undefined,
    prefillEp: match ? Number(match[2]) : undefined,
    dpAttention: parseBooleanFromLabel(label, 'DPA')
  };
}

function parseParallelismFromStrategy(strategy: string | undefined): {
  tp?: number;
  ep?: number;
} {
  return {
    tp: parseNumberFromText(strategy, /\bTP\s*(\d+(?:\.\d+)?)/iu),
    ep: parseNumberFromText(strategy, /\bEP\s*(\d+(?:\.\d+)?)/iu)
  };
}

function parseGpuCountFromLabel(label: string | undefined, segment: 'prefill' | 'decode'): number | undefined {
  return parseNumberFromText(label, new RegExp(`\\b${segment}\\s+GPUs?\\s*:?\\s*(\\d+(?:\\.\\d+)?)`, 'iu'));
}

function parseBooleanFromLabel(label: string | undefined, key: string): boolean | undefined {
  const match = label?.match(new RegExp(`\\b${key}\\s*:?\\s*(true|false|1|0|yes|no)\\b`, 'iu'));
  if (!match) return undefined;
  return readBoolean(match[1]);
}

function parseNumberFromText(value: string | undefined, pattern: RegExp): number | undefined {
  const match = value?.match(pattern);
  if (!match) return undefined;
  return readFiniteNumber(match[1]);
}

function readFiniteNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value !== 'string') return undefined;
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function readBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
    return undefined;
  }
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes'].includes(normalized)) return true;
  if (['false', '0', 'no'].includes(normalized)) return false;
  return undefined;
}

function inferWorkerCount(
  gpuCount: number | undefined,
  tp: number | undefined,
  ep: number | undefined
): number | undefined {
  if (gpuCount === undefined || tp === undefined) return undefined;
  const segmentWidth = Math.max(tp, ep ?? 0);
  if (segmentWidth === 0) return undefined;
  const workers = gpuCount / segmentWidth;
  return Number.isInteger(workers) && workers > 0 ? workers : undefined;
}

function formatPointLabelNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : formatNumber(value);
}

function getShapeKeyForPrecision(precision: string, selectedPrecisions: string[]): ShapeKey {
  const index = selectedPrecisions.indexOf(precision);
  if (index < 0 || index >= SHAPE_ORDER.length) return 'circle';
  return SHAPE_ORDER[index]!;
}

function getPointShapeKey(point: ChartPoint, selectedPrecisions: string[]): ShapeKey {
  return parsePointShape(point.shape) ?? getShapeKeyForPrecision(point.precision, selectedPrecisions);
}

function parsePointShape(value: unknown): ShapeKey | null {
  const normalized = String(value ?? '').trim().toLowerCase().replace(/[_\s]+/gu, '-');
  if (!normalized || normalized === 'default' || normalized === 'auto') return null;
  if (normalized === 'circle' || normalized === 'round' || normalized === 'dot') return 'circle';
  if (normalized === 'square' || normalized === 'box') return 'square';
  if (normalized === 'triangle' || normalized === 'tri') return 'triangle';
  if (normalized === 'diamond' || normalized === 'rhombus') return 'diamond';
  if (normalized === 'star' || normalized === 'asterisk') return 'star';
  if (normalized === 'plus' || normalized === '+') return 'plus';
  if (normalized === 'cross' || normalized === 'x') return 'cross';
  return null;
}

function getShapeTag(shape: ShapeKey): 'circle' | 'rect' | 'path' {
  if (shape === 'square') return 'rect';
  if (
    shape === 'triangle' ||
    shape === 'diamond' ||
    shape === 'star' ||
    shape === 'plus' ||
    shape === 'cross'
  ) {
    return 'path';
  }
  return 'circle';
}

function applyShapeState(
  shape: d3.Selection<SVGElement, unknown, null, undefined>,
  shapeKey: ShapeKey,
  hover: boolean
): void {
  const size = hover ? HOVER_POINT_SIZE : POINT_SIZE;
  if (shapeKey === 'circle') {
    shape.attr('r', size);
  } else if (shapeKey === 'square') {
    shape.attr('x', -size).attr('y', -size).attr('width', size * 2).attr('height', size * 2);
  } else if (shapeKey === 'triangle') {
    const h = (size * Math.sqrt(3)) / 2;
    shape.attr('d', `M 0 ${(-h * 2) / 3} L ${size} ${h / 3} L ${-size} ${h / 3} Z`);
  } else if (shapeKey === 'diamond') {
    shape.attr('d', `M 0 ${-size} L ${size} 0 L 0 ${size} L ${-size} 0 Z`);
  } else if (shapeKey === 'star') {
    shape.attr('d', makeStarPath(size * 1.25, size * 0.55));
  } else if (shapeKey === 'plus') {
    const width = size * 0.38;
    shape.attr(
      'd',
      `M ${-width} ${-size} L ${width} ${-size} L ${width} ${-width} L ${size} ${-width} L ${size} ${width} L ${width} ${width} L ${width} ${size} L ${-width} ${size} L ${-width} ${width} L ${-size} ${width} L ${-size} ${-width} L ${-width} ${-width} Z`
    );
  } else {
    const width = size * 0.36;
    shape.attr(
      'd',
      `M ${-size} ${-size + width} L ${-size + width} ${-size} L 0 ${-width} L ${size - width} ${-size} L ${size} ${-size + width} L ${width} 0 L ${size} ${size - width} L ${size - width} ${size} L 0 ${width} L ${-size + width} ${size} L ${-size} ${size - width} L ${-width} 0 Z`
    );
  }
}

function makeStarPath(outerRadius: number, innerRadius: number): string {
  const points: string[] = [];
  for (let index = 0; index < 10; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    points.push(`${Math.cos(angle) * radius} ${Math.sin(angle) * radius}`);
  }
  return `M ${points.join(' L ')} Z`;
}

function buildStrategyColorMap(series: PreparedSeries[]): Map<string, string> {
  const labels = Array.from(
    new Set(series.flatMap((line) => line.roofline.map((point) => point.strategy).filter(Boolean)))
  ) as string[];
  const map = new Map<string, string>();
  labels.forEach((label, index) => {
    map.set(label, STRATEGY_COLORS[index % STRATEGY_COLORS.length]);
  });
  return map;
}

function makeStrategyLabels(
  roofline: ChartPoint[],
  strategyColor: Map<string, string>
): StrategyLabel[] {
  return roofline
    .filter((point) => point.strategy)
    .map((point) => ({
      point,
      label: point.strategy!,
      color: strategyColor.get(point.strategy!) ?? point.color
    }));
}

function computeGradientStops(
  labels: StrategyLabel[],
  xScale: ContinuousScale
): { offset: number; color: string }[] | null {
  if (labels.length < 2) return null;
  if (new Set(labels.map((label) => label.label)).size < 2) return null;

  const firstPx = xScale(labels[0]!.point.x);
  const lastPx = xScale(labels.at(-1)!.point.x);
  const total = lastPx - firstPx;
  if (total <= 0) return null;

  const toOffset = (px: number) => Math.max(0, Math.min(1, (px - firstPx) / total));
  const stops: { offset: number; color: string }[] = [];

  labels.forEach((current, index) => {
    const currentPx = xScale(current.point.x);
    const leftPx = index === 0 ? firstPx : (currentPx + xScale(labels[index - 1]!.point.x)) / 2;
    const rightPx =
      index === labels.length - 1
        ? lastPx
        : (currentPx + xScale(labels[index + 1]!.point.x)) / 2;

    if (index < labels.length - 1 && current.label !== labels[index + 1]!.label) {
      const gap = rightPx - leftPx;
      const blend = Math.max(1, gap * 0.08);
      stops.push({ offset: toOffset(leftPx), color: current.color });
      stops.push({ offset: toOffset(rightPx - blend), color: current.color });
      stops.push({ offset: toOffset(rightPx + blend), color: labels[index + 1]!.color });
    } else if (index === 0) {
      stops.push({ offset: toOffset(leftPx), color: current.color });
    }

    if (index === labels.length - 1) {
      stops.push({ offset: toOffset(rightPx), color: current.color });
    }
  });

  if (stops[0]?.offset > 0) stops.unshift({ offset: 0, color: stops[0].color });
  if (stops.at(-1) && stops.at(-1)!.offset < 1) {
    stops.push({ offset: 1, color: stops.at(-1)!.color });
  }

  return stops.sort((a, b) => a.offset - b.offset);
}

function formatTooltip(point: ChartPoint): string {
  const fields = [
    `<strong>${escapeHtml(point.seriesName)}</strong>`,
    `${formatNumber(point.x)} tok/s/user`,
    `${formatLargeNumber(point.y)} tok/s/gpu`,
    `Precision: ${escapeHtml(formatPrecision(point.precision))}`
  ];
  if (point.strategy) fields.push(`Parallelism: ${escapeHtml(point.strategy)}`);
  const prefillGpu = readFiniteNumber(point.num_prefill_gpu) ?? parseGpuCountFromLabel(point.label, 'prefill');
  const decodeGpu = readFiniteNumber(point.num_decode_gpu) ?? parseGpuCountFromLabel(point.label, 'decode');
  if (prefillGpu !== undefined && decodeGpu !== undefined) {
    fields.push(`GPUs: ${formatPointLabelNumber(prefillGpu + decodeGpu)} (${prefillGpu} prefill + ${decodeGpu} decode)`);
  } else if (point.tp !== undefined) {
    fields.push(`TP: ${point.tp}`);
  }
  if (point.concurrency !== undefined) fields.push(`Concurrency: ${point.concurrency}`);
  if (point.label) fields.push(escapeHtml(point.label));
  return fields.map((field) => `<div>${field}</div>`).join('');
}

function computeTooltipPosition(
  mx: number,
  my: number,
  tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
  container: HTMLElement
): { left: number; top: number } {
  const node = tooltip.node();
  if (!node) return { left: mx + 10, top: my + 10 };
  const width = node.offsetWidth || 220;
  const height = node.offsetHeight || 90;
  const left = mx + 10 + width > container.clientWidth ? mx - width - 10 : mx + 10;
  const top = my + 10 + height > container.clientHeight ? my - height - 10 : my + 10;
  return { left, top };
}

export function formatPrecision(value: string): string {
  if (value === 'default') return 'Default';
  return value.toUpperCase();
}

export function formatNumber(value: number): string {
  return Number.isFinite(value)
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: value >= 10 ? 0 : 1 }).format(value)
    : '';
}

export function formatLargeNumber(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}k`;
  }
  return formatNumber(value);
}

function logTickFormat(scale: d3.ScaleLogarithmic<number, number>) {
  const [min, max] = scale.domain();
  const logRange = Math.log10(max) - Math.log10(min);
  return (value: d3.NumberValue) => {
    if (logRange < 2) return formatLargeNumber(Number(value));
    const log = Math.log10(Number(value));
    return Math.abs(log - Math.round(log)) < 0.01 ? formatLargeNumber(Number(value)) : '';
  };
}

function safeId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function escapeHtml(value: string): string {
  const span = document.createElement('span');
  span.textContent = value;
  return span.innerHTML;
}
