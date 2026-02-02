import { buildQuery } from './query';

export function buildUrl(
  baseUrl: string,
  url: string,
  path?: Record<string, string | number | undefined>,
  params?: Record<string, unknown>
): string {
  const resolved = url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `${baseUrl.replace(/\/$/, '')}${url}`;

  const interpolated = interpolatePath(resolved, path);
  const query = buildQuery(params);
  return query ? `${interpolated}?${query}` : interpolated;
}

export function interpolatePath(
  url: string,
  path?: Record<string, string | number | undefined>
): string {
  if (!path) return url;
  return url.replace(/\{([^}]+)\}/g, (_, key: string) => {
    const value = path[key];
    if (value === undefined || value === null) {
      throw new Error(`Missing required path param: ${key}`);
    }
    return encodeURIComponent(String(value));
  });
}
