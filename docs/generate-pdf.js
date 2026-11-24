import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(__dirname, "..", "Dental-Clinic-Management-System-Documentation.pdf");
const doc = new PDFDocument({ margin: 48 });
doc.pipe(fs.createWriteStream(output));

doc.fontSize(22).fillColor("#173f50").text("Dental Clinic Management System", { align: "center" });
doc.moveDown();
doc.fontSize(12).fillColor("#18313d").text("Production-quality full-stack documentation", { align: "center" });
doc.moveDown(2);

function section(title, text) {
  doc.addPage();
  doc.fontSize(17).fillColor("#1877a7").text(title);
  doc.moveDown();
  doc.fontSize(10).fillColor("#18313d").text(text, { lineGap: 4 });
}

section("Project overview", "A responsive dental clinic administration application for dashboard reporting, doctor management, and patient appointment scheduling. It uses React, Express, PostgreSQL, and Prisma.");
section("Technology stack", "Frontend: React, Vite, React Router, Lucide React.\nBackend: Node.js, Express, Zod, Prisma.\nDatabase: PostgreSQL.\nTesting: Vitest, React Testing Library, Supertest, Playwright.");
section("Architecture", "The browser communicates through a centralized API service with the Express REST API. Controllers and routes delegate database work to Prisma. PostgreSQL stores normalized Doctor and Appointment records.");
section("Database and scheduling", "Doctor email is unique and doctor deletion is restricted by existing appointments. Appointment create/update operations validate future times and reject overlap with active appointments for the same doctor. Timestamps are stored consistently and the UI uses UTC-normalized display formatting.");
section("API", "GET /api/health\nGET /api/dashboard\nGET, POST /api/doctors\nGET, PUT, DELETE /api/doctors/:id\nGET, POST /api/appointments\nGET, PUT, DELETE /api/appointments/:id");
section("Local setup", "Copy .env.example to server/.env, set DATABASE_URL, run npm install, run npx prisma generate -w server, apply migrations, run the seed, and run npm run dev.");
section("Testing", "Automated local frontend and backend suites pass. Frontend tests cover dashboard, empty states, and routing. Backend tests cover health, not-found responses, validation, and doctor creation.");
section("Verified local database", "Native PostgreSQL 17 is running locally. Prisma migration 20261124000000_init is applied and the seed script was rerun successfully without duplicate appointments. Real API CRUD verification passed for doctor and appointment create/update/delete, overlap rejection, and health.");
section("Verified browser testing", "Playwright Chromium passed 3/3 tests: primary routing, doctor create/edit/delete, and appointment create/edit/status/delete.");

for (const [title, file] of [
  ["Dashboard screenshot", "dashboard.png"],
  ["Doctors screenshot", "doctors.png"],
  ["Appointments screenshot", "appointments.png"],
]) {
  const imagePath = path.join(__dirname, "screenshots", file);
  if (fs.existsSync(imagePath)) {
    doc.addPage();
    doc.fontSize(17).fillColor("#1877a7").text(title);
    doc.moveDown();
    doc.image(imagePath, { fit: [500, 500], align: "center", valign: "center" });
  }
}

section("Deployment", "Supabase PostgreSQL is configured as the production database provider. The backend accepts its rotated session-pooler URL through DATABASE_URL; Render configuration marks this as a manually supplied secret and does not create another database. Apply migrations with npx prisma migrate deploy after configuring the rotated credential. Render URLs and deployed CRUD checks remain pending account access.");
section("Repository and deliverables", "Repository: https://github.com/qurban7860/Dental-Clinic-Management-System\nDevelop branch and source code are maintained in this repository.\nREADME, architecture, API, database design, testing report, and traceability files are included in /docs.");
section("Loom and Google Drive", "Loom URL: LOOM_URL_TO_BE_ADDED\nGoogle Drive public sharing has not been performed. Upload this PDF, docs/architecture.md, docs/api-documentation.md, docs/database-design.md, docs/testing-report.md, docs/requirement-traceability.md, and docs/screenshots/*.png to a public-viewer submission folder.");
section("Limitations", "No authentication is implemented. The pasted Supabase password must be rotated before use. Loom and Google Drive deliverables require manual sharing authorization. Render deployment requires account access.");

doc.end();
