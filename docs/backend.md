# Backend quickstart for CallShield (Cosmos DB)

APIs
- `GET /v1/list?since=<version>` → `{version, add[], remove[], update[]}`
- `POST /v1/report` → `{number, category, locale, ts}`
- `POST /v1/feedback` → `{number, action: unblock|false_positive}`

Azure Functions + Cosmos DB (Mongo API)
- Dependency: `mongodb`
- Env: `MONGO_CONNECTION_STRING=<cosmos connection string>` (fallback `COSMOS_MONGO_URI`)
- Collections in DB `callshield`: `calllist`, `reports`, `feedback`
- App settings: `FUNCTIONS_WORKER_RUNTIME=node`, `WEBSITE_NODE_DEFAULT_VERSION=~18`, `SCM_DO_BUILD_DURING_DEPLOYMENT=1`, `MONGO_CONNECTION_STRING=<...>`

Data model
- `calllist`: { number, label, risk: 'low'|'medium'|'high', action: 'add'|'remove'|'update', version, ts }
- `reports`: { number, category, locale, ts, deviceId? }
- `feedback`: { number, action, ts, deviceId? }

Notes
- Keep `version` monotonic; client sends `since`.
- Batch responses (e.g., 5k) to avoid iOS Call Directory timeouts.
- Add auth/rate limiting for reporting endpoints as needed.
