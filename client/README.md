# Dental Clinic Web

Standalone React/Vite frontend for the Dental Clinic Management System.

Repository: https://github.com/qurban7860/dental-clinic-web

## Production

- Live frontend: [https://dental-clinic-web-nine.vercel.app/](https://dental-clinic-web-nine.vercel.app/)
- API base URL: [https://dental-clinic-api-opal.vercel.app/api](https://dental-clinic-api-opal.vercel.app/api)
- API health check: [https://dental-clinic-api-opal.vercel.app/api/health](https://dental-clinic-api-opal.vercel.app/api/health)

`VITE_API_URL` is embedded in the browser build and is public by design. Set it to the API base URL above. Never put database credentials, private API keys, or other secrets in `VITE_*` variables. The application does not implement authentication; do not use it with real patient information or protected health information.

## Local setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set `VITE_API_URL` in `.env.local` to the backend API base URL, ending in `/api`. The database URL must never be added to this frontend repository.

## Build and tests

```powershell
npm run test
npm run build
```

Browser tests need the backend API running separately. Install Playwright Chromium with `npx playwright install chromium`, then run `npx playwright test`.

## Alternative hosting: Render

The included `render.yaml` configures a static site, SPA route fallback, and required `VITE_API_URL` setting. Set it to the deployed backend URL, for example `https://YOUR-API-HOST/api`.

## Vercel production deployment

The production project is deployed on Vercel. Vercel builds the Vite app to `dist`; `vercel.json` keeps React Router routes working on refresh. Set `VITE_API_URL` to `https://dental-clinic-api-opal.vercel.app/api` for Production. Configure Preview separately if needed, and never point Preview builds at production data by default.
