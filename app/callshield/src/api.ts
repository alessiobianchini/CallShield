const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
const FUNCTION_KEY = process.env.EXPO_PUBLIC_FUNCTION_KEY ?? '';

type ListResponse = {
  version: number;
  add: Array<{ number: string; label?: string; risk?: string }>;
  remove: Array<{ number: string }>;
  update: Array<{ number: string; label?: string; risk?: string }>;
};

function requireBase() {
  if (!BASE_URL) throw new Error('EXPO_PUBLIC_API_BASE_URL is not set');
}

export async function fetchList(since: number): Promise<ListResponse> {
  requireBase();
  const url = new URL('/api/v1/list', BASE_URL);
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
  requireBase();
  const url = new URL('/api/v1/report', BASE_URL);
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
  requireBase();
  const url = new URL('/api/ping', BASE_URL);
  const res = await fetch(url.toString());
  return res.ok;
}
