import { isNode } from './compat';

export interface DownloadResponse {
  raw: Response;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
  writeFile(path: string): Promise<void>;
}

export function wrapDownloadResponse(response: Response): DownloadResponse {
  const clone = () => response.clone();

  return {
    raw: response,
    arrayBuffer: () => clone().arrayBuffer(),
    blob: () => clone().blob(),
    text: () => clone().text(),
    json: <T = unknown>() => clone().json() as Promise<T>,
    writeFile: async (path: string) => {
      if (!isNode) {
        throw new Error('writeFile is only available in Node.js runtimes');
      }
      const { writeFile } = await import('node:fs/promises');
      const buffer = new Uint8Array(await clone().arrayBuffer());
      await writeFile(path, buffer);
    }
  };
}
