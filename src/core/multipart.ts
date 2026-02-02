import { hasBuffer } from './compat';

const encoder = new TextEncoder();

const isBlob = (value: unknown): value is Blob =>
  typeof Blob !== 'undefined' && value instanceof Blob;

const isArrayBuffer = (value: unknown): value is ArrayBuffer =>
  typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer;

const isUint8Array = (value: unknown): value is Uint8Array =>
  typeof Uint8Array !== 'undefined' && value instanceof Uint8Array;

const isAsyncIterable = (value: unknown): value is AsyncIterable<Uint8Array> =>
  !!value && typeof (value as AsyncIterable<Uint8Array>)[Symbol.asyncIterator] === 'function';

const isReadableStream = (value: unknown): value is ReadableStream<Uint8Array> =>
  typeof ReadableStream !== 'undefined' && value instanceof ReadableStream;

function toFieldValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

async function readAllChunks(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.length;
    }
  }
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

async function readAsyncIterable(iterable: AsyncIterable<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  let total = 0;
  for await (const chunk of iterable) {
    const data = isUint8Array(chunk) ? chunk : encoder.encode(String(chunk));
    chunks.push(data);
    total += data.length;
  }
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

async function toUint8Array(input: unknown): Promise<Uint8Array> {
  if (isUint8Array(input)) return input;
  if (isArrayBuffer(input)) return new Uint8Array(input);
  if (isBlob(input)) return new Uint8Array(await input.arrayBuffer());
  if (isReadableStream(input)) return readAllChunks(input);
  if (isAsyncIterable(input)) return readAsyncIterable(input);
  if (typeof input === 'string') return encoder.encode(input);
  if (hasBuffer) {
    const BufferCtor = (globalThis as { Buffer?: { isBuffer?: (value: unknown) => boolean } }).Buffer;
    if (BufferCtor?.isBuffer?.(input)) {
      return new Uint8Array(input as Uint8Array);
    }
  }
  if (input && typeof (input as { arrayBuffer?: () => Promise<ArrayBuffer> }).arrayBuffer === 'function') {
    const buffer = await (input as { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer();
    return new Uint8Array(buffer);
  }
  throw new Error('Unsupported file input for multipart upload');
}

function concatChunks(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

export async function buildMultipartBody(fields: Record<string, unknown>): Promise<{
  body: Uint8Array;
  headers: Record<string, string>;
}> {
  const boundary = `----lark-lite-${Math.random().toString(16).slice(2)}`;
  const chunks: Uint8Array[] = [];

  const push = (value: string) => {
    chunks.push(encoder.encode(value));
  };

  for (const [name, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    if (name === 'file') continue;
    push(`--${boundary}\r\n`);
    push(`Content-Disposition: form-data; name="${name}"\r\n\r\n`);
    push(toFieldValue(value));
    push('\r\n');
  }

  if (fields.file !== undefined && fields.file !== null) {
    const file = fields.file as unknown;
    const fileName =
      (fields.file_name as string | undefined) ||
      (file && typeof (file as { name?: string }).name === 'string'
        ? (file as { name?: string }).name
        : 'file');
    const fileBytes = await toUint8Array(file);

    push(`--${boundary}\r\n`);
    push(
      `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`
    );
    push('Content-Type: application/octet-stream\r\n\r\n');
    chunks.push(fileBytes);
    push('\r\n');
  }

  push(`--${boundary}--\r\n`);

  return {
    body: concatChunks(chunks),
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    }
  };
}
