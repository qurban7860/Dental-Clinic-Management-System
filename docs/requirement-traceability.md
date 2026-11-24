# Requirement Traceability

| ID | Requirement | Implementation | Testing | Result | Status |
|---|---|---|---|---|---|
| P1 | Audit existing repository and use develop | Repository initialized on develop | Git status/log | Empty Task 1 repository found | VERIFIED |
| F1 | Dashboard real metrics | `client/src/pages/Dashboard.jsx`, `/api/dashboard` | Frontend test and local browser run | Dashboard loaded from database | VERIFIED |
| F2 | Doctor CRUD | `client/src/pages/Doctors.jsx`, doctor routes | API CRUD and Playwright lifecycle | Persisted and cleaned up | VERIFIED |
| F3 | Appointment CRUD | `client/src/pages/Appointments.jsx`, appointment routes | API CRUD and Playwright lifecycle | Persisted and cleaned up | VERIFIED |
| F4 | Search/filter/sort | API query handling and toolbar controls | Browser route and CRUD suites | Implemented | TESTED |
| F5 | Conflict/doctor deletion safety | Appointment service and restricted doctor relation | Real API overlap test and Playwright | Overlap rejected | VERIFIED |
| D1 | PostgreSQL/Prisma schema | `server/prisma/schema.prisma` | Prisma validate/generate/migrate status | Migration applied | VERIFIED |
| D2 | Repeatable seed | `server/prisma/seed.js` | Two local seed runs | No duplicate records | VERIFIED |
| B1 | Central error and validation | Zod and error middleware | Supertest suite | Implemented | TESTED |
| U1 | Responsive/accessibility | Shared layout, CSS, semantic controls | Frontend tests | Implemented | TESTED |
| T1 | Automated testing | Vitest, RTL, Supertest, Playwright config | Local suites | Implemented | TESTED |
| P2 | Production deployment | Vercel frontend/API deployment | Live frontend check and `GET /api/health` | Frontend serves; API health reports database connected; production CRUD not verified | PARTIAL |
| O1 | PDF and documentation | `docs/*.md`, README | Manual | Documentation complete | TESTED |
| O2 | Loom and Google Drive | Placeholder and submission instructions | External authorization required | Not uploaded | BLOCKED |
