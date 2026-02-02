import type { RequestArgs } from './types';

export function createListWithIterator<TArgs extends RequestArgs, TRes>(
  listFn: (args: TArgs) => Promise<TRes>
) {
  return async function* (args?: TArgs) {
    let pageToken = args?.params?.page_token as string | undefined;
    let hasMore = true;

    while (hasMore) {
      const res = await listFn({
        ...(args ?? ({} as TArgs)),
        params: {
          ...(args?.params ?? {}),
          page_token: pageToken
        }
      } as TArgs);

      const data = (res as unknown as { data?: unknown }).data ?? res;
      yield data as unknown;

      const meta = data as { has_more?: boolean; page_token?: string };
      hasMore = Boolean(meta?.has_more);
      pageToken = meta?.page_token;

      if (!hasMore) break;
    }
  };
}
