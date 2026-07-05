# Smart Workspace — API Gateway

NestJS API Gateway for the Smart Workspace platform. Built **step by step** so each phase is easy to understand.

## Current phase: 1 — Test routing

Right now the gateway only has simple routes that respond directly. No auth, no proxy, no microservices yet.

### What's running

| Route | What it does |
|-------|----------------|
| `GET /api/v1/health` | Returns `{ status: "ok" }` |
| `GET /api/v1/test/ping` | Returns `{ message: "pong" }` |
| `GET /api/v1/test/hello/:name` | Returns a greeting with the name from the URL |

### How a request flows (Phase 1)

```
Browser/curl
    ↓
GET /api/v1/test/ping
    ↓
main.ts          → sets global prefix "api", version "v1"
    ↓
TestController   → @Get('ping') handler runs
    ↓
JSON response    → { message: "pong" }
```

### Quick start

```bash
npm install
npm run start:dev
```

Then try:

```bash
curl http://localhost:3000/api/v1/test/ping
curl http://localhost:3000/api/v1/test/hello/Ateeb
curl http://localhost:3000/api/v1/health
```

Swagger: http://localhost:3000/api/docs

---

## Roadmap (coming next)

| Phase | What we add | You'll learn |
|-------|-------------|--------------|
| **1** ✅ | Test routes (`/health`, `/test/*`) | NestJS routing, modules, controllers |
| **2** | Auth routing + JWT guard | Guards, `@Public()`, Auth Service client |
| **3** | Proxy to one microservice | ProxyService, HTTP forwarding |
| **4** | All microservice routes | Full gateway pattern |
| **5** | Rate limiting, monitoring | Production hardening |

---

## Project structure (Phase 1)

```
src/
├── main.ts                 # App entry — prefix, versioning, Swagger
├── app.module.ts           # Wires modules together
├── config/                 # Environment variables
├── common/interceptors/    # Request logging
└── modules/
    ├── health/             # GET /health
    └── test/               # GET /test/ping, /test/hello/:name
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start with hot reload |
| `npm run build` | Production build |
| `npm run test:e2e` | Run e2e tests |

## Related repos (future phases)

- smart-workspace-auth-service
- smart-workspace-user-service
- smart-workspace-task-service
- smart-workspace-infra
