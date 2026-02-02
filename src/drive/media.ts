import type { BaseClient } from '../client';
import { buildMultipartBody } from '../core/multipart';
import type { RequestArgs } from '../core/types';
import { wrapDownloadResponse } from '../core/response';

export function createMediaApi(client: BaseClient) {
  return {
    uploadAll: async (args?: RequestArgs) => {
      const data = args?.data;
      if (!data || typeof data !== 'object') {
        throw new Error('uploadAll requires data with file fields');
      }
      const { body, headers } = await buildMultipartBody(data as Record<string, unknown>);
      return client.request({
        method: 'POST',
        url: '/drive/v1/medias/upload_all',
        data: body,
        headers: {
          ...(args?.headers ?? {}),
          ...headers
        },
        params: args?.params,
        path: args?.path,
        token: args?.token
      });
    },
    download: async (args?: RequestArgs) => {
      const response = await client.requestRaw({
        method: 'GET',
        url: '/drive/v1/medias/{file_token}/download',
        ...(args ?? {})
      });
      return wrapDownloadResponse(response);
    },
    batchGetTmpDownloadUrl: (args?: RequestArgs) =>
      client.request({
        method: 'GET',
        url: '/drive/v1/medias/batch_get_tmp_download_url',
        ...(args ?? {})
      })
  };
}
