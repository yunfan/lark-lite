import type { BaseClient } from '../client';
import { createListWithIterator } from '../core/iterator';
import type { RequestArgs } from '../core/types';

export function createAppTableViewApi(client: BaseClient) {
  const list = (args?: RequestArgs) =>
    client.request({
      method: 'GET',
      url: '/bitable/v1/apps/{app_token}/tables/{table_id}/views',
      ...(args ?? {})
    });

  return {
    create: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/views',
        ...(args ?? {})
      }),
    delete: (args?: RequestArgs) =>
      client.request({
        method: 'DELETE',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/views/{view_id}',
        ...(args ?? {})
      }),
    get: (args?: RequestArgs) =>
      client.request({
        method: 'GET',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/views/{view_id}',
        ...(args ?? {})
      }),
    list,
    listWithIterator: createListWithIterator(list),
    patch: (args?: RequestArgs) =>
      client.request({
        method: 'PATCH',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/views/{view_id}',
        ...(args ?? {})
      })
  };
}
