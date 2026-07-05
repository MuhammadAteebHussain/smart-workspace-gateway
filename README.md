# Smart Workspace — API Gateway

NestJS API Gateway. **Phase 2 Step 5** — auth proxy + JWT guard.

## Routes

| Route | Auth | Description |
|-------|------|-------------|
| `GET /api/v1/health` | Public | Gateway health |
| `GET /api/v1/health/services` | Public | Service discovery |
| `POST /api/v1/auth/register` | Public | Proxy → auth service |
| `POST /api/v1/auth/login` | Public | Proxy → auth service |
| `GET /api/v1/test/ping` | Public | Test route |
| `GET /api/v1/test/secret` | **JWT required** | Protected test route |

Swagger: http://localhost:3000/api/docs

## Quick start

```bash
# Terminal 1 — auth
cd ../smart-workspace-auth-service && npm run start:dev

# Terminal 2 — gateway
cp .env.example .env
npm run start:dev
```

## Test flow

```bash
# Register via gateway
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ateeb@example.com","password":"secret123"}'

# Login via gateway
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ateeb@example.com","password":"secret123"}'

# Protected route (use token from login)
curl http://localhost:3000/api/v1/test/secret \
  -H "Authorization: Bearer <accessToken>"

# Without token → 401
curl http://localhost:3000/api/v1/test/secret
```

## Environment

| Variable | Default |
|----------|---------|
| `PORT` | `3000` |
| `AUTH_SERVICE_URL` | `http://localhost:3001` |
