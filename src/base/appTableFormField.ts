import type { BaseClient } from '../client';
import { createListWithIterator } from '../core/iterator';
import type { RequestArgs } from '../core/types';

export function createAppTableFormFieldApi(client: BaseClient) {
  const list = (args?: RequestArgs) =>
    client.request({
      method: 'GET',
      url: '/bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}/fields',
      ...(args ?? {})
    });

  return {
    list,
    listWithIterator: createListWithIterator(list),
    patch: (args?: RequestArgs) =>
      client.request({
        method: 'PATCH',
        url: '/bitable/v1/apps/{app_token}/tables/{table_id}/forms/{form_id}/fields/{field_id}',
        ...(args ?? {})
      })
  };
}
