# Testing Report

## Automated tests

- Backend Vitest/Supertest: health, not-found, doctor validation, doctor creation, appointment validation
- Frontend Vitest/React Testing Library: dashboard metrics, doctors empty state, unknown routes
- Production build: successful Vite build
- Prisma: client generation successful
- Local PostgreSQL: PostgreSQL 17 native Windows installation, dedicated database and application role
- Prisma migration: `20261124000000_init` applied successfully
- Database seed: 6 doctors and 18 appointments; rerun produced no duplicate appointments
- API health: database-connected response returned 200
- Real CRUD verification: doctor create/update/delete passed, appointment create/update/delete passed, overlap was rejected
- Playwright Chromium: 3/3 tests passed covering routes, doctor CRUD, and appointment CRUD
- Unit/integration: backend 5/5 passed; frontend 3/3 passed
- Production build: passed

## Production deployment checks

- Frontend: deployed and serving at https://dental-clinic-web-nine.vercel.app/
- API: deployed at https://dental-clinic-api-opal.vercel.app/
- API health: `GET /api/health` returned HTTP 200 and reported `database: connected` during the latest check
- Production CRUD and end-to-end workflows: not independently verified
- Security: rotate any previously exposed Supabase database password and replace the backend's `DATABASE_URL` secret before relying on it. The app has no authentication; do not use real patient information.
