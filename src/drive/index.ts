import type { BaseClient } from '../client';
import { createMediaApi } from './media';

export function createDriveApi(client: BaseClient) {
  return {
    media: createMediaApi(client)
  };
}
