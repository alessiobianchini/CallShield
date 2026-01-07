// Values are injected at build time via env (secrets in CI).
const BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? process.env.BASE_URL ?? '').trim();
const FUNCTION_KEY = (process.env.EXPO_PUBLIC_FUNCTION_KEY ?? process.env.FUNCTION_KEY ?? '').trim();

type ListResponse = {
  version: number;
  add: Array<{ number: string; label?: string; risk?: string }>;
  remove: Array<{ number: string }>;
  update: Array<{ number: string; label?: string; risk?: string }>;
};

function getBase(): string | null {
  if (!BASE_URL) {
    console.warn('BASE_URL/EXPO_PUBLIC_API_BASE_URL is not set; skipping network call');
    return null;
  }
  return BASE_URL;
}

export async function fetchList(since: number): Promise<ListResponse> {
  const base = getBase();
  if (!base) {
    return { version: since, add: [], remove: [], update: [] };
  }
  const url = new URL('/api/v1/list', base);
  url.searchParams.set('since', since.toString());
  if (FUNCTION_KEY) url.searchParams.set('code', FUNCTION_KEY);

  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) {
    throw new Error(`List failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function reportCall(payload: {
  number: string;
  category: string;
  locale?: string;
  deviceId?: string;
  ts?: number;
}): Promise<void> {
  const base = getBase();
  if (!base) return;
  const url = new URL('/api/v1/report', base);
  if (FUNCTION_KEY) url.searchParams.set('code', FUNCTION_KEY);

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Report failed: ${res.status} ${text}`);
  }
}

export async function ping(): Promise<boolean> {
  const base = getBase();
  if (!base) return false;
  const url = new URL('/api/ping', base);
  const res = await fetch(url.toString());
  return res.ok;
}

export type ReceiptPayload = {
  platform: 'ios' | 'android';
  productId: string;
  transactionId?: string;
  userId?: string;
  receiptData: string;
};

export async function sendReceipt(payload: ReceiptPayload): Promise<void> {
  const base = getBase();
  if (!base) return;
  const url = new URL('/api/v1/receipt', base);
  if (FUNCTION_KEY) url.searchParams.set('code', FUNCTION_KEY);
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Receipt failed: ${res.status} ${text}`);
  }
}
