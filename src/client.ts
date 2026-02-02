import { buildUrl } from './core/http';
import { createLogger, LoggerLevel } from './core/logger';
import type { FetchLike, RequestOptions } from './core/types';
import { createBaseApi } from './base';
import { createDriveApi } from './drive';

export const Domain = {
  Feishu: 'https://base-api.feishu.cn',
  Lark: 'https://base-api.larksuite.com'
} as const;

export type Domain = (typeof Domain)[keyof typeof Domain] | string;

const DEFAULT_API_PREFIX = '/open-apis';
const DEFAULT_USER_AGENT = 'base-open-sdk-node/v1.0.0';

export interface BaseClientOptions {
  appToken: string;
  personalBaseToken: string;
  domain?: Domain;
  apiPrefix?: string;
  userAgent?: string;
  fetch?: FetchLike;
  loggerLevel?: LoggerLevel;
  logger?: {
    debug?: (...args: unknown[]) => void;
    info?: (...args: unknown[]) => void;
    warn?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
  };
}

export class BaseClient {
  public readonly appToken: string;
  public readonly personalBaseToken: string;
  public readonly domain: string;
  public readonly baseUrl: string;
  private readonly fetcher: FetchLike;
  private readonly logger: ReturnType<typeof createLogger>;
  private readonly userAgent: string | undefined;

  public readonly base: ReturnType<typeof createBaseApi>;
  public readonly drive: ReturnType<typeof createDriveApi>;

  constructor(options: BaseClientOptions) {
    this.appToken = options.appToken;
    this.personalBaseToken = options.personalBaseToken;
    this.domain = options.domain ?? Domain.Feishu;
    this.baseUrl = buildBaseUrl(this.domain, options.apiPrefix ?? DEFAULT_API_PREFIX);
    this.fetcher = options.fetch ?? fetch;
    this.logger = createLogger(options.loggerLevel ?? 'info', options.logger);
    this.userAgent = options.userAgent ?? DEFAULT_USER_AGENT;

    this.base = createBaseApi(this);
    this.drive = createDriveApi(this);
  }

  async request<T = unknown>(options: RequestOptions): Promise<T> {
    const response = await this.requestRaw(options);

    if (options.responseType === 'raw') {
      return response as unknown as T;
    }

    if (options.responseType === 'arrayBuffer') {
      return (await response.arrayBuffer()) as unknown as T;
    }

    if (options.responseType === 'blob') {
      return (await response.blob()) as unknown as T;
    }

    if (options.responseType === 'text') {
      return (await response.text()) as unknown as T;
    }

    const text = await response.text();
    if (!text) return {} as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  async requestRaw(options: RequestOptions): Promise<Response> {
    const mergedPath = { app_token: this.appToken, ...(options.path ?? {}) };
    const url = buildUrl(this.baseUrl, options.url, mergedPath, options.params);

    const headers: Record<string, string> = {
      ...(options.headers ?? {})
    };

    if (this.userAgent && !hasHeader(headers, 'User-Agent')) {
      headers['User-Agent'] = this.userAgent;
    }

    const token = options.token ?? this.personalBaseToken;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const init: RequestInit = {
      method: options.method,
      headers
    };

    if (options.method !== 'GET' && options.method !== 'HEAD') {
      const body = serializeBody(options.data, headers);
      if (body !== undefined) {
        init.body = body;
      }
    }

    this.logger.debug('Request', options.method, url);
    const response = await this.fetcher(url, init);
    this.logger.debug('Response', response.status, response.statusText);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return response;
  }
}

function serializeBody(
  data: unknown,
  headers: Record<string, string>
): BodyInit | undefined {
  if (data === undefined || data === null) return undefined;

  if (isFormData(data) || isBlob(data) || isArrayBuffer(data) || isUint8Array(data)) {
    return data as BodyInit;
  }

  if (typeof data === 'string') {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'text/plain;charset=UTF-8';
    }
    return data;
  }

  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json;charset=UTF-8';
  }
  return JSON.stringify(data);
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== 'undefined' && value instanceof FormData;
}

function isBlob(value: unknown): value is Blob {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;
}

function isUint8Array(value: unknown): value is Uint8Array {
  return typeof Uint8Array !== 'undefined' && value instanceof Uint8Array;
}

function buildBaseUrl(domain: string, apiPrefix: string): string {
  const trimmedDomain = domain.replace(/\/+$/, '');
  const normalizedPrefix = normalizePrefix(apiPrefix);
  return `${trimmedDomain}${normalizedPrefix}`;
}

function normalizePrefix(prefix: string): string {
  const trimmed = prefix.trim();
  if (!trimmed) return '';
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.replace(/\/+$/, '');
}

function hasHeader(headers: Record<string, string>, name: string): boolean {
  const target = name.toLowerCase();
  return Object.keys(headers).some((key) => key.toLowerCase() === target);
}
