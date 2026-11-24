import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(__dirname, "..", "Dental-Clinic-Management-System-Documentation.pdf");
const doc = new PDFDocument({ margin: 48 });
doc.info = {
  Title: "Dental Clinic Management System - Project and Deployment Documentation",
  Author: "Dental Clinic Management System",
  Subject: "Application architecture, verification, and production deployment",
  Keywords: "dental clinic, React, Express, PostgreSQL, Prisma, Vercel",
  CreationDate: new Date(),
};
doc.pipe(fs.createWriteStream(output));

doc.fontSize(22).fillColor("#173f50").text("Dental Clinic Management System", { align: "center" });
doc.moveDown();
doc.fontSize(12).fillColor("#18313d").text("Project and deployment documentation", { align: "center" });
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

doc.addPage();
doc.fontSize(17).fillColor("#1877a7").text("Production deployments");
doc.moveDown();
doc.fontSize(10).fillColor("#18313d").text(
  "Frontend: https://dental-clinic-web-nine.vercel.app/",
  { link: "https://dental-clinic-web-nine.vercel.app/", underline: true }
);
doc.text(
  "API deployment: https://dental-clinic-api-opal.vercel.app/",
  { link: "https://dental-clinic-api-opal.vercel.app/", underline: true }
);
doc.text(
  "API base path: https://dental-clinic-api-opal.vercel.app/api",
  { link: "https://dental-clinic-api-opal.vercel.app/api", underline: true }
);
doc.text(
  "API health: https://dental-clinic-api-opal.vercel.app/api/health",
  { link: "https://dental-clinic-api-opal.vercel.app/api/health", underline: true }
);
doc.moveDown();
doc.fillColor("#18313d").text("The latest health check returned HTTP 200 and reported a connected database. Production CRUD and end-to-end workflows have not been independently verified. Keep DATABASE_URL in the backend project's secret environment settings only; never expose it in the frontend build.");
section("Repository and deliverables", "Repository: https://github.com/qurban7860/Dental-Clinic-Management-System\nDevelop branch and source code are maintained in this repository.\nREADME, architecture, API, database design, testing report, and traceability files are included in /docs.");
section("Security and limitations", "The application has no authentication or authorization and must not be used to store real patient information or protected health information. Rotate any previously exposed Supabase database password and replace the backend DATABASE_URL secret before relying on it. Production CRUD and end-to-end workflows have not been independently verified.");

doc.end();
