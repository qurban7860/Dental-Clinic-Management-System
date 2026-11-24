# Supabase PostgreSQL deployment

## Credential safety

If a database password has been pasted into a chat, source file, or command, treat it as compromised. Reset it in Supabase before using the database. Do not commit the replacement password or put it in `VITE_*` variables.

## Local PowerShell configuration

1. In Supabase, open **Project Settings → Database** and reset the password.
2. Select **Connect → Session pooler**, using port `5432` for Prisma migrations. The transaction pooler on port `6543` is not suitable for running migrations.
3. Percent-encode reserved characters in the password (`@` becomes `%40`).
4. Run:

```powershell
Set-Location C:\Users\qurba\OneDrive\Desktop\Dental-Clinic-Management-System\server
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\set-supabase-url.ps1
npx prisma validate
npx prisma generate
npx prisma migrate status
npx prisma migrate deploy
```

The process-scoped execution policy lasts only for this PowerShell window and does not change machine/user policy. The script takes the connection URL through hidden PowerShell input and stores it in the ignored `server/.env`. It only accepts Supabase hosts on port 5432 and enforces TLS with `sslmode=require`. It does not seed the database.

Confirm the applied migration using `npx prisma migrate status`, then start the server and verify `GET /api/health`. Only health verification confirms the running API can connect to the configured database.

## Vercel production configuration

The production frontend is [https://dental-clinic-web-nine.vercel.app/](https://dental-clinic-web-nine.vercel.app/). The API deployment is [https://dental-clinic-api-opal.vercel.app/](https://dental-clinic-api-opal.vercel.app/), with routes under [https://dental-clinic-api-opal.vercel.app/api](https://dental-clinic-api-opal.vercel.app/api). Its health check is [https://dental-clinic-api-opal.vercel.app/api/health](https://dental-clinic-api-opal.vercel.app/api/health).

Configure the rotated Supabase connection URL as the backend Vercel project's Production `DATABASE_URL` secret. Set `CLIENT_URL` to the exact frontend origin, `https://dental-clinic-web-nine.vercel.app`. The frontend uses `VITE_API_URL=https://dental-clinic-api-opal.vercel.app/api`; do not add the database URL to frontend environment variables.

Apply migrations from a trusted shell with the rotated database URL configured. Do not run migrations for Preview deployments against the production database. Confirm `npx prisma migrate status`, apply pending migrations with `npx prisma migrate deploy`, and verify the production health endpoint before release. Health confirms connectivity only; perform separate production smoke tests for application workflows.

The API currently has no authentication or authorization. Do not use it to store real patient information or protected health information.

Do not seed the production database automatically. If fictional sample records are wanted, run the seed script once only after confirming the target project and reviewing the seed behavior.
