import type { BaseClient } from '../client';
import { createListWithIterator } from '../core/iterator';
import type { RequestArgs } from '../core/types';

export function createAppRoleApi(client: BaseClient) {
  const list = (args?: RequestArgs) =>
    client.request({
      method: 'GET',
      url: '/bitable/v1/apps/{app_token}/roles',
      ...(args ?? {})
    });

  return {
    create: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/roles',
        ...(args ?? {})
      }),
    delete: (args?: RequestArgs) =>
      client.request({
        method: 'DELETE',
        url: '/bitable/v1/apps/{app_token}/roles/{role_id}',
        ...(args ?? {})
      }),
    list,
    listWithIterator: createListWithIterator(list),
    update: (args?: RequestArgs) =>
      client.request({
        method: 'PUT',
        url: '/bitable/v1/apps/{app_token}/roles/{role_id}',
        ...(args ?? {})
      })
  };
}
