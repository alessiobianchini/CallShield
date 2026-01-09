type AppConfig = {
  baseUrl: string;
  functionKey?: string;
};

declare const global: typeof globalThis & {
  __APP_CONFIG__?: AppConfig;
};

const config: AppConfig = {
  baseUrl: global.__APP_CONFIG__?.baseUrl || 'https://httpbin.org',
  functionKey: global.__APP_CONFIG__?.functionKey || undefined,
};

export default config;
