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

## Separate repositories

- Frontend: https://github.com/qurban7860/dental-clinic-web
- Backend: https://github.com/qurban7860/dental-clinic-api

The original combined repository remains available at https://github.com/qurban7860/Dental-Clinic-Management-System.

## Production deployments

- Frontend: [https://dental-clinic-web-nine.vercel.app/](https://dental-clinic-web-nine.vercel.app/)
- API deployment: [https://dental-clinic-api-opal.vercel.app/](https://dental-clinic-api-opal.vercel.app/)
- API base path: [https://dental-clinic-api-opal.vercel.app/api](https://dental-clinic-api-opal.vercel.app/api)
- API health: [https://dental-clinic-api-opal.vercel.app/api/health](https://dental-clinic-api-opal.vercel.app/api/health)

The health endpoint verifies API and database connectivity; it does not replace end-to-end testing of production workflows. The application does not implement authentication or authorization. Do not use it to store real patient information or protected health information.

## Local setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `server/.env` and set `DATABASE_URL`.
3. Run `npm install`.
4. Run `npm run migrate:dev -w server` or `npm run migrate -w server`.
5. Run `npm run seed -w server`.
6. Run `npm run dev`.

The frontend runs at `http://localhost:5173`; the API runs at `http://localhost:5000/api`.

## Native Windows PostgreSQL setup

PostgreSQL can be installed with `winget`:

```powershell
winget install --id PostgreSQL.PostgreSQL.17 --exact --silent --accept-package-agreements --accept-source-agreements
Get-Service postgresql-x64-17
Get-Command psql
```

Create a dedicated database role and database in PowerShell. Replace the password placeholder only in a private `server/.env` file:

```powershell
$env:PGPASSWORD='YOUR_POSTGRES_ADMIN_PASSWORD'
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -h localhost -U postgres -d postgres -c "CREATE ROLE dental_app LOGIN PASSWORD 'YOUR_PRIVATE_APP_PASSWORD';"
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -h localhost -U postgres -d postgres -c "CREATE DATABASE dental_clinic OWNER dental_app;"
```

Create `server/.env`:

```dotenv
DATABASE_URL=postgresql://dental_app:YOUR_PRIVATE_APP_PASSWORD@localhost:5432/dental_clinic?schema=public
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173,http://127.0.0.1:5173
```

Then:

```powershell
Set-Location server
npx prisma validate
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

## Supabase PostgreSQL setup

Treat previously exposed Supabase database credentials as compromised. **Rotate the database password in Supabase before relying on it**; do not reuse or paste the replacement into chat, source code, or a terminal command. In the Supabase dashboard, open **Project Settings → Database** and reset the database password. Copy the new connection string from **Connect → Session pooler** (port `5432`) or use the direct connection when your host supports it. Reserved password characters must be percent-encoded (`@` becomes `%40`).

From PowerShell:

```powershell
Set-Location C:\Users\qurba\OneDrive\Desktop\Dental-Clinic-Management-System\server
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\set-supabase-url.ps1
npx prisma validate
npx prisma generate
npx prisma migrate status
npx prisma migrate deploy
```

The process-scoped policy change lasts only for this PowerShell window; it does not change the machine or user policy. The script asks for the rotated URL using hidden input, validates the Supabase host and port, adds `sslmode=require` if missing, and stores the value in ignored `server/.env`. It never displays the URL. Do not run `npm run seed` against production unless you explicitly want fictional sample records there.

For the Vercel API project, set the rotated URL as the Production `DATABASE_URL` environment variable. Set `CLIENT_URL` to `https://dental-clinic-web-nine.vercel.app`. The frontend uses `VITE_API_URL=https://dental-clinic-api-opal.vercel.app/api`; never set `DATABASE_URL` in the frontend. Run production migrations from a trusted environment with the rotated URL configured, and do not run production migrations from Preview deployments.

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

The live frontend and API are deployed on Vercel and use Supabase PostgreSQL. The health endpoint is available at `https://dental-clinic-api-opal.vercel.app/api/health`. Keep `DATABASE_URL` in the backend project's encrypted environment settings only. Apply schema changes with `npx prisma migrate deploy` after confirming the target database and rotated credential; do not use destructive reset commands against production.

## Alternative hosting: Render

Render is an optional alternative; Vercel is the current production host.

1. Import the `server` and `client` directories as separate services.
2. Set the backend build command to `npm install && npx prisma generate` and start command to `npm start`.
3. Configure the rotated `DATABASE_URL` secret and exact `CLIENT_URL` in the backend service; configure `VITE_API_URL` in the frontend service.
4. Run `npx prisma migrate deploy` as a controlled release step before routing production traffic. Do not run migrations as part of the build or from Preview deployments against the production database.
5. Verify the API health endpoint, exercise authorized smoke tests, refresh frontend routes, and inspect service logs.

## Testing

```bash
npm run test -w server
npm run test -w client
npm run build
```

Frontend and backend suites cover navigation, dashboard rendering, empty states, health, not-found behavior, doctor validation, and appointment validation.

## Security and limitations

The system has no authentication or authorization and must not be presented as access-controlled. Do not store real patient information or protected health information. It uses fictional demonstration data. Appointment timestamps are consistently stored in UTC and the UI displays UTC-normalized values. Production PostgreSQL enforcement is application-transaction based; a database exclusion constraint can be added for additional concurrent protection.
