import type { BaseClient } from '../client';
import type { RequestArgs } from '../core/types';

export function createAppTableFormApi(client: BaseClient) {
  return {
    get: (args?: RequestArgs) =>
      client.request({
        method: 'GET',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}',
        ...(args ?? {})
      }),
    patch: (args?: RequestArgs) =>
      client.request({
        method: 'PATCH',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}',
        ...(args ?? {})
      })
  };
}
