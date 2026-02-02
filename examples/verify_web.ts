import { BaseClient, Domain } from './src/index';

const appToken = '';
const personalBaseToken = '';

const logFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const requestUrl =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  const method =
    init?.method ??
    (typeof input === 'object' && 'method' in input ? input.method : 'GET');

  const urlObj = new URL(requestUrl);
  const params: Record<string, string> = {};
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const headers = new Headers(
    init?.headers ??
      (typeof input === 'object' && 'headers' in input ? input.headers : undefined)
  );
  if (headers.has('Authorization')) {
    const value = headers.get('Authorization') ?? '';
    headers.set('Authorization', value.startsWith('Bearer ') ? 'Bearer ***' : '***');
  }
  const headerObj: Record<string, string> = {};
  headers.forEach((value, key) => {
    headerObj[key] = value;
  });

  console.log('[verify] domain:', urlObj.origin);
  console.log('[verify] url:', requestUrl);
  console.log('[verify] method:', method);
  console.log('[verify] params:', params);
  if (Object.keys(headerObj).length) {
    console.log('[verify] headers:', headerObj);
  }
  if (init?.body !== undefined && init.body !== null) {
    console.log('[verify] bodyType:', typeof init.body);
    if (typeof init.body === 'string') {
      console.log('[verify] body:', init.body);
    }
  }

  return fetch(input, init);
};

async function main() {
  if (!appToken || !personalBaseToken) {
    throw new Error('Please fill appToken and personalBaseToken in verify_web.ts');
  }

  const client = new BaseClient({
    appToken,
    personalBaseToken,
    domain: Domain.Lark,
    fetch: logFetch
  });

  const appInfo = await client.base.app.get();
  console.log('app.get ok:', appInfo?.code ?? appInfo);

  const tables = await client.base.appTable.list({ params: { page_size: 5 } });
  console.log('appTable.list ok:', tables?.code ?? tables);
}

main().catch((err) => {
  console.error(err);
});
