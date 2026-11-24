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
.\scripts\set-supabase-url.ps1
npx prisma validate
npx prisma generate
npx prisma migrate status
npx prisma migrate deploy
```

The script takes the connection URL through hidden PowerShell input and stores it in the ignored `server/.env`. It only accepts Supabase hosts on port 5432 and enforces TLS with `sslmode=require`. It does not seed the database.

Confirm the applied migration using `npx prisma migrate status`, then start the server and verify `GET /api/health`. Only health verification confirms the running API can connect to the configured database.

## Render configuration

The backend service in `render.yaml` expects `DATABASE_URL` to be configured manually as an unsynced secret. Add the rotated Supabase connection URL in Render's backend Environment settings, along with `NODE_ENV=production` and the exact `CLIENT_URL`. Render applies Prisma migrations during the backend build using `npx prisma migrate deploy`.

The static frontend only needs `VITE_API_URL=https://YOUR-API-HOST/api`. Do not add the database URL to frontend environment variables.

Do not seed the production database automatically. If fictional sample records are wanted, run the seed script once only after confirming the target project and reviewing the seed behavior.
