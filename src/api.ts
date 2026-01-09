import config from './config';

export type HealthResult = {
  ok: boolean;
  message: string;
};

/**
  * Chiama l'endpoint di health base. Se non è configurato BASE_URL,
  * usa httpbin per restituire 200.
  */
export async function fetchHealth(): Promise<HealthResult> {
  const base = config.baseUrl?.trim();
  const url = base
    ? `${base.replace(/\/$/, '')}/health`
    : 'https://httpbin.org/status/200';

  const res = await fetch(url, {
    headers: config.functionKey
      ? { 'x-functions-key': config.functionKey }
      : undefined,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }

  let message = `OK (${res.status})`;
  try {
    const data = await res.json();
    message = typeof data === 'string' ? data : JSON.stringify(data);
  } catch {
    // ok, body non json
  }

  return { ok: true, message };
}
