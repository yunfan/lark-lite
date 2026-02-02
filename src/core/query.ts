const isDate = (value: unknown): value is Date => value instanceof Date;

export function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return '';
  const search = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(params)) {
    if (rawValue === undefined || rawValue === null) continue;

    if (Array.isArray(rawValue)) {
      for (const item of rawValue) {
        if (item === undefined || item === null) continue;
        search.append(key, toQueryValue(item));
      }
      continue;
    }

    search.set(key, toQueryValue(rawValue));
  }

  return search.toString();
}

function toQueryValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (isDate(value)) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
