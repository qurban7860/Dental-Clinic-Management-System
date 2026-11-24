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

## Verification pending external environment

Supabase production connectivity/migrations remain pending password rotation; the previously pasted password is considered compromised. Render backend/frontend deployment and production CRUD checks require account access and configuration. Loom and Google Drive public sharing require manual account authorization.
