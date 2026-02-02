import type { BaseClient } from '../client';
import { createListWithIterator } from '../core/iterator';
import type { RequestArgs } from '../core/types';

export function createAppRoleMemberApi(client: BaseClient) {
  const list = (args?: RequestArgs) =>
    client.request({
      method: 'GET',
      url: '/bitable/v1/apps/{app_token}/roles/{role_id}/members',
      ...(args ?? {})
    });

  return {
    batchCreate: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/roles/{role_id}/members/batch_create',
        ...(args ?? {})
      }),
    batchDelete: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/roles/{role_id}/members/batch_delete',
        ...(args ?? {})
      }),
    create: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/roles/{role_id}/members',
        ...(args ?? {})
      }),
    delete: (args?: RequestArgs) =>
      client.request({
        method: 'DELETE',
        url: '/bitable/v1/apps/{app_token}/roles/{role_id}/members/{member_id}',
        ...(args ?? {})
      }),
    list,
    listWithIterator: createListWithIterator(list)
  };
}
