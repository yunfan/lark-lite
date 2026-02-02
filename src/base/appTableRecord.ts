import type { BaseClient } from '../client';
import { createListWithIterator } from '../core/iterator';
import type { RequestArgs } from '../core/types';

export function createAppTableRecordApi(client: BaseClient) {
  const list = (args?: RequestArgs) =>
    client.request({
      method: 'GET',
      url: '/bitable/v1/apps/{app_token}/tables/{table_id}/records',
      ...(args ?? {})
    });

  return {
    batchCreate: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_create',
        ...(args ?? {})
      }),
    batchDelete: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_delete',
        ...(args ?? {})
      }),
    batchUpdate: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_update',
        ...(args ?? {})
      }),
    create: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/records',
        ...(args ?? {})
      }),
    delete: (args?: RequestArgs) =>
      client.request({
        method: 'DELETE',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/records/{record_id}',
        ...(args ?? {})
      }),
    get: (args?: RequestArgs) =>
      client.request({
        method: 'GET',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/records/{record_id}',
        ...(args ?? {})
      }),
    list,
    listWithIterator: createListWithIterator(list),
    update: (args?: RequestArgs) =>
      client.request({
        method: 'PUT',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/records/{record_id}',
        ...(args ?? {})
      }),
    search: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/records/search',
        ...(args ?? {})
      })
  };
}
