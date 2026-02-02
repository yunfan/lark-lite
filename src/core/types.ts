export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export type ResponseType = 'json' | 'text' | 'arrayBuffer' | 'blob' | 'raw';

export interface RequestArgs {
  path?: Record<string, string | number | undefined>;
  params?: Record<string, unknown>;
  data?: unknown;
  headers?: Record<string, string>;
  token?: string;
  responseType?: ResponseType;
}

export interface RequestOptions extends RequestArgs {
  method: HttpMethod;
  url: string;
}

export type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;
