import type { BaseClient } from '../client';
import { createAppApi } from './app';
import { createAppDashboardApi } from './appDashboard';
import { createAppRoleApi } from './appRole';
import { createAppRoleMemberApi } from './appRoleMember';
import { createAppTableApi } from './appTable';
import { createAppTableFieldApi } from './appTableField';
import { createAppTableFormApi } from './appTableForm';
import { createAppTableFormFieldApi } from './appTableFormField';
import { createAppTableRecordApi } from './appTableRecord';
import { createAppTableViewApi } from './appTableView';

export function createBaseApi(client: BaseClient) {
  return {
    app: createAppApi(client),
    appDashboard: createAppDashboardApi(client),
    appRole: createAppRoleApi(client),
    appRoleMember: createAppRoleMemberApi(client),
    appTable: createAppTableApi(client),
    appTableField: createAppTableFieldApi(client),
    appTableForm: createAppTableFormApi(client),
    appTableFormField: createAppTableFormFieldApi(client),
    appTableRecord: createAppTableRecordApi(client),
    appTableView: createAppTableViewApi(client)
  };
}
