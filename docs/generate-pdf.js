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
section("Deployment", "render.yaml defines the PostgreSQL database, backend web service, and frontend static site. Public Render URLs, API health verification, and deployed CRUD operations remain external because account credentials are not available.");
section("Repository and deliverables", "Repository: https://github.com/qurban7860/Dental-Clinic-Management-System\nDevelop branch and source code are maintained in this repository.\nREADME, architecture, API, database design, testing report, and traceability files are included in /docs.");
section("Limitations", "No authentication is implemented. Loom and Google Drive deliverables require manual recording/upload authorization. Production deployment requires Render account access and credentials.");

doc.end();
