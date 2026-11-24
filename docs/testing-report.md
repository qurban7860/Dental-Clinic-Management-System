# Testing Report

## Automated tests

- Backend Vitest/Supertest: health, not-found, doctor validation, doctor creation, appointment validation
- Frontend Vitest/React Testing Library: dashboard metrics, doctors empty state, unknown routes
- Production build: successful Vite build
- Prisma: client generation successful

## Verification pending external environment

Live PostgreSQL and Render deployment require credentials/account access. Browser E2E and deployed CRUD verification cannot be honestly claimed until external services are available.
