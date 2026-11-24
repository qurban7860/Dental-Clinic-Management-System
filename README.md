# Dental Clinic Management System

A responsive, database-backed dental clinic administration application built with React, Express, and PostgreSQL/Prisma.

## Features

- Database-calculated dashboard metrics and upcoming appointments
- Complete doctor CRUD with duplicate-email protection and appointment-safe deletion
- Complete appointment CRUD with active-doctor validation and overlap prevention
- Doctor and appointment search, filtering, sorting, and pagination
- Loading, empty, error, success, and confirmation states
- Responsive desktop/mobile navigation and accessible forms

## Stack

- React 19, Vite, React Router, Lucide React
- Node.js, Express 5
- PostgreSQL and Prisma ORM
- Zod validation
- Vitest, React Testing Library, Supertest

## Local setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `server/.env` and set `DATABASE_URL`.
3. Run `npm install`.
4. Run `npm run migrate:dev -w server` or `npx prisma migrate deploy -w server`.
5. Run `npm run seed -w server`.
6. Run `npm run dev`.

The frontend runs at `http://localhost:5173`; the API runs at `http://localhost:5000/api`.

## Database seed

The seed adds six fictional doctors and 18 fictional appointments across active, upcoming, today, pending, completed, and cancelled states. It is idempotent for doctors and does not delete existing production data. Run it only with an explicitly configured database:

```bash
npm run seed -w server
```

## Routes

- `/dashboard`
- `/doctors`
- `/appointments`
- `GET /api/health`
- `/api/doctors`
- `/api/appointments`
- `/api/dashboard`

## Production

`render.yaml` provisions a Render PostgreSQL database, Express web service, and static React site. Set `CLIENT_URL` and `VITE_API_URL` in Render. The API migration command is `npx prisma migrate deploy`; destructive reset commands are never used.

## Testing

```bash
npm run test -w server
npm run test -w client
npm run build
```

Frontend and backend suites cover navigation, dashboard rendering, empty states, health, not-found behavior, doctor validation, and appointment validation.

## Security and limitations

The system has no authentication and must not be presented as access-controlled. It uses fictional demonstration data. Appointment timestamps are consistently stored in UTC and the UI displays UTC-normalized values. Production PostgreSQL enforcement is application-transaction based; a database exclusion constraint can be added for additional concurrent protection.
