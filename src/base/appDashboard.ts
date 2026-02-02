import type { BaseClient } from '../client';
import { createListWithIterator } from '../core/iterator';
import type { RequestArgs } from '../core/types';

export function createAppDashboardApi(client: BaseClient) {
  const list = (args?: RequestArgs) =>
    client.request({
      method: 'GET',
      url: '/bitable/v1/apps/{app_token}/dashboards',
      ...(args ?? {})
    });

  return {
    copy: (args?: RequestArgs) =>
      client.request({
        method: 'POST',
        url: '/bitable/v1/apps/{app_token}/dashboards/{block_id}/copy',
        ...(args ?? {})
      }),
    list,
    listWithIterator: createListWithIterator(list)
  };
}
