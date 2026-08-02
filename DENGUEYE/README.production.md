# DENGUEYE Production Scalability Blueprint

This repository now includes a modular, production-oriented starter architecture for scaling the DENGUEYE application to support thousands of concurrent users.

## Included components

- Stateless Express backend
- Environment-based configuration
- PostgreSQL connection pooling
- Redis cache integration
- Background worker scaffold
- Rate limiting
- JWT-based auth middleware
- Health and readiness endpoints
- Docker and Docker Compose support
- Load-test configurations for k6 and Locust

## Run

```bash
npm install
npm run backend:dev
npm run backend:worker
```

Or with Docker:

```bash
docker compose up --build
```

## Key endpoints

- `GET /health`
- `GET /ready`
- `POST /api/auth/login`
- `GET /api/cases?page=1&limit=25`
- `POST /api/jobs`
- `GET /api/jobs/:jobId`

## Production recommendations

- Use a managed PostgreSQL service in production.
- Put multiple backend instances behind a load balancer.
- Use Redis for hot read-only analytics data.
- Add centralized logging and metrics collection.
- Configure database indexes and query plans based on workload.
