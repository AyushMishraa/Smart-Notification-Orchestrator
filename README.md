# Smart Notification Orchestrator

A NestJS monorepo with two deployable apps (`api-gateway`, `notification-service`) sharing common libraries.

## Getting started

```bash
npm install
cp .env.example .env   # already done for you here — edit values as needed
npx prisma generate
npm run start:api-gateway
npm run start:notification-service
```

## Structure

- `apps/api-gateway` — public-facing HTTP entrypoint
- `apps/notification-service` — handles notification delivery logic
- `libs/common` — shared filters, interceptors, decorators
- `libs/contracts` — shared DTOs, enums, and event payloads between apps
- `libs/config` — centralized `@nestjs/config` setup
- `libs/logging` — shared logger service
- `libs/database` — Prisma client wrapper
- `prisma/` — Prisma schema and migrations
- `docs/` — architecture, API, events, database, ADRs, and operations docs
