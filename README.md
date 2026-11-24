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

## Local setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `server/.env` and set `DATABASE_URL`.
3. Run `npm install`.
4. Run `npm run migrate:dev -w server` or `npx prisma migrate deploy -w server`.
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

## Supabase PostgreSQL production setup

The Supabase password pasted into the terminal/chat should be considered compromised. **Rotate the database password in Supabase before connecting**; do not reuse or paste the replacement into chat, source code, or a terminal command. In the Supabase dashboard, open **Project Settings → Database** and reset the database password. Copy the new connection string from **Connect → Session pooler** (port `5432`) or use the direct connection when your host supports it. Reserved password characters must be percent-encoded (`@` becomes `%40`).

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

For Render, set the same rotated Supabase URL as the `DATABASE_URL` secret in the backend service's Environment settings before its first deployment. The checked-in `render.yaml` marks it as an unsynced secret and does not provision a Render database. Set `CLIENT_URL` to the exact frontend origin and `VITE_API_URL` to the deployed API base. Never set `DATABASE_URL` in the frontend.

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

`render.yaml` configures the Express web service and static React site. Production PostgreSQL is Supabase; configure its rotated connection URI as the backend-only `DATABASE_URL` secret in Render. The API migration command is `npx prisma migrate deploy`; destructive reset commands are never used.

## Render deployment

1. Rotate the Supabase database password and set the new connection URI as the backend-only `DATABASE_URL` secret in Render.
2. Create a Web Service for `server`, selecting the `develop` branch.
3. Set build command to `npm install && npx prisma generate && npx prisma migrate deploy`.
4. Set start command to `npm start`.
5. Set `DATABASE_URL` to the Supabase session-pooler URI (port 5432), with reserved password characters percent-encoded and TLS enabled.
6. Set `NODE_ENV=production` and `CLIENT_URL` to the exact Render static-site origin.
7. Create a Static Site for `client`, branch `develop`, build command `npm install && npm run build`, publish directory `dist`, and SPA rewrite `/* -> /index.html`.
8. Set `VITE_API_URL` to `https://YOUR-BACKEND.onrender.com/api`.
9. Verify `/api/health`, create/edit/delete records through the deployed UI, refresh routes, and inspect Render logs.

## Testing

```bash
npm run test -w server
npm run test -w client
npm run build
```

Frontend and backend suites cover navigation, dashboard rendering, empty states, health, not-found behavior, doctor validation, and appointment validation.

## Security and limitations

The system has no authentication and must not be presented as access-controlled. It uses fictional demonstration data. Appointment timestamps are consistently stored in UTC and the UI displays UTC-normalized values. Production PostgreSQL enforcement is application-transaction based; a database exclusion constraint can be added for additional concurrent protection.
