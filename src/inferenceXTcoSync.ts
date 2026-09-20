export interface InferenceXTcoPriceSnapshot {
  revision: string;
  checkedAt: string;
  sourceTitle: string;
  costs: Record<string, { hyperscaler: number; rental: number }>;
}

export const INFERENCEX_TCO_REPOSITORY = 'https://github.com/SemiAnalysisAI/InferenceX-app';
export const INFERENCEX_TCO_CACHE_KEY = 'inferencex-curve:tco-prices:v1';
const PRICE_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;

export function shouldRefreshInferenceXTcoPrices(
  snapshot: InferenceXTcoPriceSnapshot | null,
  now = Date.now()
): boolean {
  const age = snapshot ? now - Date.parse(snapshot.checkedAt) : Number.NaN;
  return !Number.isFinite(age) || age < 0 || age >= PRICE_REFRESH_INTERVAL_MS;
}

export function readInferenceXTcoPriceSnapshot(value: unknown): InferenceXTcoPriceSnapshot | null {
  if (!isRecord(value) || !isRecord(value.costs) || !isRevision(value.revision) ||
    typeof value.checkedAt !== 'string' || !Number.isFinite(Date.parse(value.checkedAt)) ||
    typeof value.sourceTitle !== 'string' || !value.sourceTitle.trim()) return null;
  const costs = readPriceEntries(value.costs, 'hyperscaler', 'rental');
  if (!costs) return null;
  return { revision: value.revision, checkedAt: value.checkedAt, sourceTitle: value.sourceTitle, costs };
}

export async function fetchInferenceXTcoPrices(): Promise<InferenceXTcoPriceSnapshot> {
  // GitHub permits browser CORS requests, including from static GitHub Pages.
  // Pin to a commit when the anonymous GitHub API quota is available. The raw
  // default-branch files remain accessible when that separate API is rate-limited.
  let revision = 'HEAD';
  try {
    const response = await fetchPriceSource(
      'https://api.github.com/repos/SemiAnalysisAI/InferenceX-app/commits?per_page=1'
    );
    const commits: unknown = await response.json();
    const sha = Array.isArray(commits) && isRecord(commits[0]) ? commits[0].sha : undefined;
    if (isRevision(sha)) revision = sha;
  } catch {
    // Fetch and validate all raw files before replacing any cached prices.
  }
  const root = `https://raw.githubusercontent.com/SemiAnalysisAI/InferenceX-app/${revision}`;
  const [registry, policy, attribution] = await Promise.all([
    'packages/constants/src/gpu-keys.ts',
    'packages/app/src/lib/constants.ts',
    'packages/constants/src/tco.ts'
  ].map(async (path) => (await fetchPriceSource(`${root}/${path}`)).text()));
  return {
    revision,
    checkedAt: new Date().toISOString(),
    ...parseInferenceXTcoSources(registry!, policy!, attribution!)
  };
}

async function fetchPriceSource(url: string): Promise<Response> {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000), credentials: 'omit' });
  if (!response.ok) throw new Error(`Could not fetch upstream prices (HTTP ${response.status}).`);
  return response;
}

export function parseInferenceXTcoSources(
  registry: string,
  policy: string,
  attribution: string
): Pick<InferenceXTcoPriceSnapshot, 'costs' | 'sourceTitle'> {
  const declaration = /\bexport\s+const\s+HW_REGISTRY\b[^=]*=\s*/u.exec(registry);
  if (!declaration) throw new Error('Upstream hardware price registry was not found.');
  const entries = parseLiteralObject(registry.slice(declaration.index + declaration[0].length));
  const costs = isRecord(entries) ? readPriceEntries(entries, 'costh', 'costr') : null;
  if (!costs) throw new Error('Upstream hardware prices have an unsupported format.');

  // Follow the upstream default owning basis, including Google's internal cost.
  // Fail on an unfamiliar policy instead of silently substituting a wrong rate.
  const basis = /DEFAULT_TCO_BASIS[^=]*=\s*['"](internal|external)['"]/u.exec(policy)?.[1];
  const compactPolicy = policy.replace(/\/\*[\s\S]*?\*\//gu, '').replace(/\/\/[^\n]*/gu, '').replace(/\s+/gu, '');
  if (!basis || !compactPolicy.includes("costh:basis==='internal'?(internalCost??entry.costh):entry.costh") ||
    !compactPolicy.includes('costr:entry.costr')) {
    throw new Error('Upstream pricing policy changed; existing prices were kept.');
  }
  const override = /const\s+internalCost\s*=\s*base\s*===\s*['"]([a-z0-9]+)['"]\s*\?\s*([\d.]+)\s*:\s*undefined\s*;/u.exec(policy);
  if (!override || !costs[override[1]!] || !isPrice(Number(override[2]))) {
    throw new Error('Upstream owning-cost adjustment has an unsupported format.');
  }
  if (basis === 'internal') costs[override[1]!]!.hyperscaler = Number(override[2]);
  const sourceTitle = /\bTCO_SOURCE_TITLE\s*=\s*['"]([^'"\n]+)['"]/u.exec(attribution)?.[1];
  if (!sourceTitle) throw new Error('Upstream price attribution was not found.');
  return { costs, sourceTitle };
}

function readPriceEntries(
  entries: Record<string, unknown>,
  owningKey: string,
  rentalKey: string
): InferenceXTcoPriceSnapshot['costs'] | null {
  const costs: InferenceXTcoPriceSnapshot['costs'] = {};
  for (const [hardware, entry] of Object.entries(entries)) {
    if (!/^[a-z][a-z0-9]*$/u.test(hardware) || !isRecord(entry)) return null;
    const hyperscaler = entry[owningKey];
    const rental = entry[rentalKey];
    // Zero denotes an unpublished price; the chart excludes it until priced.
    if (!isPrice(hyperscaler) || !isPrice(rental)) return null;
    costs[hardware] = { hyperscaler, rental };
  }
  return Object.keys(costs).length ? costs : null;
}

function isPrice(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isRevision(value: unknown): value is string {
  return typeof value === 'string' && (value === 'HEAD' || /^[a-f0-9]{40}$/u.test(value));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Read only literal objects, strings and numbers. Never evaluate remote code.
function parseLiteralObject(source: string): unknown {
  let position = 0;
  const skip = () => {
    const whitespace = /^(?:\s+|\/\*[\s\S]*?\*\/|\/\/[^\n]*)*/u.exec(source.slice(position))![0];
    position += whitespace.length;
  };
  const readString = (): string => {
    const quote = source[position++]!;
    let result = '';
    while (position < source.length) {
      const char = source[position++]!;
      if (char === quote) return result;
      if (char === '\\') {
        const escaped = source[position++]!;
        if (![quote, '\\'].includes(escaped)) throw new Error('Unsupported upstream string escape.');
        result += escaped;
      } else result += char;
    }
    throw new Error('Unterminated upstream price string.');
  };
  const read = (): unknown => {
    skip();
    if (source[position] === '"' || source[position] === "'") return readString();
    if (source[position] !== '{') {
      const number = /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/iu.exec(source.slice(position));
      if (!number) throw new Error('Unsupported expression in upstream price registry.');
      position += number[0].length;
      return Number(number[0]);
    }
    position += 1;
    const result: Record<string, unknown> = Object.create(null);
    skip();
    while (source[position] !== '}') {
      const quoted = source[position] === '"' || source[position] === "'";
      const key = quoted ? readString() : /^[a-zA-Z_][a-zA-Z0-9_]*/u.exec(source.slice(position))?.[0];
      if (!key) throw new Error('Unsupported upstream price key.');
      if (!quoted) position += key.length;
      skip();
      if (source[position++] !== ':') throw new Error('Unsupported upstream price entry.');
      result[key] = read();
      skip();
      if (source[position] === '}') break;
      if (source[position++] !== ',') throw new Error('Unsupported upstream price expression.');
      skip();
    }
    position += 1;
    return result;
  };
  return read();
}
