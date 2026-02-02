import type { BaseClient } from '../client';
import { createListWithIterator } from '../core/iterator';
import type { RequestArgs } from '../core/types';

export function createAppTableApi(client: BaseClient) {
  const list = (args?: RequestArgs) =>
    client.request({
      method: 'GET',
      url: '/bitable/v1/apps/{app_token}/tables',
      ...(args ?? {})
    });

  return {
    batchCreate: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/tables/batch_create',
        ...(args ?? {})
      }),
    batchDelete: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/tables/batch_delete',
        ...(args ?? {})
      }),
    create: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/tables',
        ...(args ?? {})
      }),
    delete: (args?: RequestArgs) =>
      client.request({
        method: 'DELETE',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}',
        ...(args ?? {})
      }),
    list,
    listWithIterator: createListWithIterator(list),
    patch: (args?: RequestArgs) =>
      client.request({
        method: 'PATCH',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}',
        ...(args ?? {})
      })
  };
}
