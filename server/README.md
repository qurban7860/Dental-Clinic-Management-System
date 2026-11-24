# Dental Clinic API

Standalone Express/Prisma API for the Dental Clinic Management System.

Repository: https://github.com/qurban7860/dental-clinic-api

## Production

- API deployment: [https://dental-clinic-api-opal.vercel.app/](https://dental-clinic-api-opal.vercel.app/)
- API base path: [https://dental-clinic-api-opal.vercel.app/api](https://dental-clinic-api-opal.vercel.app/api)
- Health check: [https://dental-clinic-api-opal.vercel.app/api/health](https://dental-clinic-api-opal.vercel.app/api/health)
- Frontend origin: [https://dental-clinic-web-nine.vercel.app/](https://dental-clinic-web-nine.vercel.app/)

The health endpoint currently reports a successful database connection. It is a connectivity check, not a substitute for production CRUD and workflow smoke tests.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Set `DATABASE_URL` in `.env` to a PostgreSQL connection. Use a rotated Supabase session-pooler URI on port 5432 for Supabase; percent-encode reserved password characters and require TLS. Never commit `.env` or paste database credentials into source control.

To run migrations safely against a configured production database:

```powershell
npx prisma migrate status
npx prisma migrate deploy
```

Do not run the seed script against production unless fictional demo data is explicitly wanted.

## API and tests

- Health: `GET /api/health`
- Dashboard: `/api/dashboard`
- Doctors: `/api/doctors`
- Appointments: `/api/appointments`

```powershell
npm test
```

## Vercel production deployment

The production API is deployed on Vercel. Import this repository with its root as the Vercel project root. Vercel's Express runtime serves the exported app in `src/app.js`; routes remain under `/api`.

Configure these values in the API project's Production environment:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Rotated Supabase PostgreSQL connection URI; store as a secret in the API project only |
| `CLIENT_URL` | Exact frontend origin: `https://dental-clinic-web-nine.vercel.app` |

Rotate any database password previously exposed in chat, files, or logs before using it. Use TLS and a Supabase session-pooler connection on port `5432` for Prisma migrations. Apply migrations from a trusted shell with the rotated URL configured using `npx prisma migrate deploy`; do not run migrations for Preview deployments against the production database. After deployment, verify `GET /api/health` and run authorized smoke tests before relying on the service.

The application does not implement authentication or authorization. Do not use it to store real patient information or protected health information.

## Alternative hosting: Render

The included `render.yaml` deploys the Node service. Add `DATABASE_URL` and `CLIENT_URL` in the Render service Environment settings. The build generates Prisma Client; apply migrations separately as a controlled release step before routing production traffic.
