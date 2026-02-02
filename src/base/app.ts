import type { BaseClient } from '../client';
import type { RequestArgs } from '../core/types';

export function createAppApi(client: BaseClient) {
  return {
    copy: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/copy',
        ...(args ?? {})
      }),
    create: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps',
        ...(args ?? {})
      }),
    get: (args?: RequestArgs) =>
      client.request({
        method: 'GET',
        url: '/bitable/v1/apps/{app_token}',
        ...(args ?? {})
      }),
    update: (args?: RequestArgs) =>
      client.request({
        method: 'PUT',
        url: '/bitable/v1/apps/{app_token}',
        ...(args ?? {})
      })
  };
}
