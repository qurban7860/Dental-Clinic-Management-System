import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(__dirname, "..", "Dental-Clinic-Management-System-Documentation.pdf");

const PAGE = {
  size: "A4",
  width: 595.28,
  height: 841.89,
  marginX: 38,
  marginTop: 42,
  marginBottom: 44,
};
const CONTENT_W = PAGE.width - PAGE.marginX * 2;
const MAX_Y = PAGE.height - PAGE.marginBottom;
const COL_GAP = 12;
const COL_W = (CONTENT_W - COL_GAP) / 2;

const COLORS = {
  primaryDark: "#173f50",
  primary: "#1877a7",
  ink: "#18313d",
  muted: "#526b78",
  surface: "#f4f8fa",
  border: "#d4e3ec",
  white: "#ffffff",
  badgeBg: "#e3f1f8",
  warnBg: "#fffbeb",
  warnBorder: "#f59e0b",
  warnTitle: "#92400e",
  link: "#0f6292",
};

const doc = new PDFDocument({
  size: PAGE.size,
  margins: {
    top: PAGE.marginTop,
    bottom: PAGE.marginBottom,
    left: PAGE.marginX,
    right: PAGE.marginX,
  },
  bufferPages: true,
});

doc.info = {
  Title: "Dental Clinic Management System - Project and Deployment Documentation",
  Author: "Dental Clinic Management System",
  Subject: "Application architecture, verification, and production deployment",
  Keywords: "dental clinic, React, Express, PostgreSQL, Prisma, Vercel",
  CreationDate: new Date(),
};

const stream = fs.createWriteStream(output);
doc.pipe(stream);

let cursorY = 34;

function ensureSpace(neededHeight) {
  if (cursorY + neededHeight > MAX_Y) {
    doc.addPage();
    cursorY = PAGE.marginTop + 6;
    return true;
  }
  return false;
}

function drawBanner() {
  const bannerH = 68;
  doc.save();
  doc.roundedRect(PAGE.marginX, cursorY, CONTENT_W, bannerH, 6).fill(COLORS.primaryDark);
  doc.rect(PAGE.marginX, cursorY, 5, bannerH).fill(COLORS.primary);

  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor(COLORS.white)
    .text("Dental Clinic Management System", PAGE.marginX + 18, cursorY + 13, {
      width: CONTENT_W - 36,
      lineBreak: false,
    });

  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor("#cfe6f2")
    .text(
      "Project Architecture, Verification & Production Deployment Documentation",
      PAGE.marginX + 18,
      cursorY + 35,
      { width: CONTENT_W - 36, lineBreak: false }
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor("#9fd2ea")
    .text(
      "STACK: React 19 · Express · PostgreSQL · Prisma   |   QA: Vitest · Supertest · Playwright",
      PAGE.marginX + 18,
      cursorY + 50,
      { width: CONTENT_W - 36, lineBreak: false }
    );
  doc.restore();

  cursorY += bannerH + 11;
}

function measureSectionHeader(title) {
  return 20;
}

function drawSectionHeader(title) {
  ensureSpace(44);
  doc
    .font("Helvetica-Bold")
    .fontSize(11.5)
    .fillColor(COLORS.primaryDark)
    .text(title, PAGE.marginX, cursorY, { width: CONTENT_W });

  const lineY = cursorY + 15;
  doc
    .moveTo(PAGE.marginX, lineY)
    .lineTo(PAGE.marginX + CONTENT_W, lineY)
    .lineWidth(0.75)
    .strokeColor(COLORS.border)
    .stroke();
  doc
    .moveTo(PAGE.marginX, lineY)
    .lineTo(PAGE.marginX + 42, lineY)
    .lineWidth(2)
    .strokeColor(COLORS.primary)
    .stroke();

  cursorY += 21;
}

/**
 * Measure and render structured blocks inside a card.
 * Supported item types:
 * - { type: "p", text }
 * - { type: "kv", label, text }
 * - { type: "code", method, path }
 * - { type: "link", label, text, url }
 */
function measureItems(items, innerW) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const gap = i === items.length - 1 ? 0 : item.gap ?? 4;
    if (item.type === "p") {
      doc.font("Helvetica").fontSize(8.8);
      total += doc.heightOfString(item.text, { width: innerW, lineGap: 1.8 }) + gap;
    } else if (item.type === "kv") {
      doc.font("Helvetica").fontSize(8.8);
      const combined = `${item.label} ${item.text}`;
      total += doc.heightOfString(combined, { width: innerW, lineGap: 1.8 }) + gap;
    } else if (item.type === "code") {
      total += 13.5 + (i === items.length - 1 ? 0 : 2.5);
    } else if (item.type === "link") {
      doc.font("Helvetica").fontSize(8.5);
      const combined = item.label ? `${item.label} ${item.text}` : item.text;
      total += doc.heightOfString(combined, { width: innerW, lineGap: 1.5 }) + gap;
    }
  }
  return total;
}

function measureCard(card, width) {
  const padX = 11;
  const padTop = 9;
  const padBottom = 9;
  const titleH = card.title ? 16 : 0;
  const contentH = measureItems(card.items, width - padX * 2);
  return padTop + titleH + contentH + padBottom;
}

function renderCard(card, x, y, width, fixedHeight) {
  const padX = 11;
  const padTop = 9;
  const innerW = width - padX * 2;
  const h = fixedHeight ?? measureCard(card, width);

  const bg = card.variant === "warn" ? COLORS.warnBg : COLORS.surface;
  const border = card.variant === "warn" ? COLORS.warnBorder : COLORS.border;
  const titleColor = card.variant === "warn" ? COLORS.warnTitle : COLORS.primary;

  doc.save();
  doc.roundedRect(x, y, width, h, 5).fillAndStroke(bg, border);
  doc.restore();

  let iy = y + padTop;
  if (card.title) {
    doc
      .font("Helvetica-Bold")
      .fontSize(9.8)
      .fillColor(titleColor)
      .text(card.title, x + padX, iy, { width: innerW, lineBreak: false });
    iy += 16;
  }

  for (let i = 0; i < card.items.length; i++) {
    const item = card.items[i];
    const gap = i === card.items.length - 1 ? 0 : item.gap ?? 4;

    if (item.type === "p") {
      doc.font("Helvetica").fontSize(8.8).fillColor(COLORS.ink);
      const th = doc.heightOfString(item.text, { width: innerW, lineGap: 1.8 });
      doc.text(item.text, x + padX, iy, { width: innerW, lineGap: 1.8 });
      iy += th + gap;
    } else if (item.type === "kv") {
      doc.font("Helvetica-Bold").fontSize(8.8).fillColor(COLORS.primaryDark);
      doc.text(item.label, x + padX, iy, { continued: true, width: innerW, lineGap: 1.8 });
      doc
        .font("Helvetica")
        .fillColor(COLORS.ink)
        .text(" " + item.text, { width: innerW, lineGap: 1.8 });
      iy = doc.y + gap;
    } else if (item.type === "code") {
      const badgeW = 94;
      doc.save();
      doc.roundedRect(x + padX, iy, badgeW, 12, 2.5).fill(COLORS.badgeBg);
      doc.restore();
      doc
        .font("Courier-Bold")
        .fontSize(7.4)
        .fillColor(COLORS.primaryDark)
        .text(item.method, x + padX + 4, iy + 2.4, {
          width: badgeW - 8,
          align: "center",
          lineBreak: false,
        });
      doc
        .font("Courier")
        .fontSize(8)
        .fillColor(COLORS.ink)
        .text(item.path, x + padX + badgeW + 7, iy + 2, {
          width: innerW - badgeW - 7,
          lineBreak: false,
        });
      iy += 13.5 + (i === card.items.length - 1 ? 0 : 2.5);
    } else if (item.type === "link") {
      if (item.label) {
        doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLORS.primaryDark);
        const h1 = doc.heightOfString(`${item.label} ${item.text}`, {
          width: innerW,
          lineGap: 1.5,
        });
        doc.text(item.label + " ", x + padX, iy, {
          continued: true,
          width: innerW,
          lineGap: 1.5,
        });
        doc
          .font("Helvetica")
          .fillColor(COLORS.link)
          .text(item.text, {
            link: item.url,
            underline: true,
            width: innerW,
            lineGap: 1.5,
          });
        iy += h1 + gap;
      } else {
        doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.link);
        const h1 = doc.heightOfString(item.text, { width: innerW, lineGap: 1.5 });
        doc.text(item.text, x + padX, iy, {
          link: item.url,
          underline: true,
          width: innerW,
          lineGap: 1.5,
        });
        iy += h1 + gap;
      }
    }
  }
}

function drawFullCard(card, spaceAfter = 9) {
  const h = measureCard(card, CONTENT_W);
  ensureSpace(h);
  renderCard(card, PAGE.marginX, cursorY, CONTENT_W, h);
  cursorY += h + spaceAfter;
}

function drawTwoColCards(leftCard, rightCard, spaceAfter = 9) {
  const h = Math.max(measureCard(leftCard, COL_W), measureCard(rightCard, COL_W));
  ensureSpace(h);
  renderCard(leftCard, PAGE.marginX, cursorY, COL_W, h);
  renderCard(rightCard, PAGE.marginX + COL_W + COL_GAP, cursorY, COL_W, h);
  cursorY += h + spaceAfter;
}

function drawScreenshotsSection() {
  const shots = [
    {
      title: "Dashboard — Metrics & Upcoming Visits",
      file: "dashboard.png",
      path: path.join(__dirname, "screenshots", "dashboard.png"),
    },
    {
      title: "Doctors — Provider Directory & Status",
      file: "doctors.png",
      path: path.join(__dirname, "screenshots", "doctors.png"),
    },
    {
      title: "Appointments — Scheduling & Filters",
      file: "appointments.png",
      path: path.join(__dirname, "screenshots", "appointments.png"),
    },
  ].filter((s) => fs.existsSync(s.path));

  if (shots.length === 0) return;

  const meta = shots.map((s) => {
    const img = doc.openImage(s.path);
    return { ...s, imgW: img.width, imgH: img.height };
  });

  // Layout: featured wide dashboard screenshot on top, remaining two side-by-side below
  const [hero, ...rest] = meta;
  const headerH = measureSectionHeader("Application UI Screenshots");
  const heroTargetW = Math.min(430, CONTENT_W);
  const heroImgH = (heroTargetW * hero.imgH) / hero.imgW;
  const heroBlockH = heroImgH + 22;

  let rowH = 0;
  const pairW = COL_W;
  if (rest.length > 0) {
    rowH = Math.max(...rest.map((r) => (pairW * r.imgH) / r.imgW)) + 22;
  }

  const totalGalleryH = headerH + heroBlockH + (rest.length > 0 ? 10 + rowH : 0);
  // Keep header + hero together; keep full gallery on one page if it fits cleanly
  if (cursorY + totalGalleryH <= MAX_Y) {
    // fits on current page
  } else if (totalGalleryH <= MAX_Y - (PAGE.marginTop + 6)) {
    doc.addPage();
    cursorY = PAGE.marginTop + 6;
  } else {
    ensureSpace(headerH + heroBlockH);
  }

  drawSectionHeader("Application UI Screenshots");

  const drawFramedShot = (shot, x, y, w, imgH) => {
    const frameH = imgH + 20;
    doc.save();
    doc.roundedRect(x, y, w, frameH, 5).fillAndStroke(COLORS.surface, COLORS.border);
    doc
      .font("Helvetica-Bold")
      .fontSize(8.2)
      .fillColor(COLORS.primaryDark)
      .text(shot.title, x + 8, y + 5, { width: w - 16, lineBreak: false });
    doc.image(shot.path, x + 4, y + 17, { width: w - 8, height: imgH - 2 });
    doc.restore();
    return frameH;
  };

  const heroX = PAGE.marginX + (CONTENT_W - heroTargetW) / 2;
  const drawnHeroH = drawFramedShot(hero, heroX, cursorY, heroTargetW, heroImgH);
  cursorY += drawnHeroH + 10;

  if (rest.length === 2) {
    const imgH0 = ((pairW - 8) * rest[0].imgH) / rest[0].imgW + 2;
    const imgH1 = ((pairW - 8) * rest[1].imgH) / rest[1].imgW + 2;
    const uniformImgH = Math.max(imgH0, imgH1);
    ensureSpace(uniformImgH + 22);
    drawFramedShot(rest[0], PAGE.marginX, cursorY, pairW, imgH0);
    drawFramedShot(rest[1], PAGE.marginX + pairW + COL_GAP, cursorY, pairW, imgH1);
    cursorY += uniformImgH + 22;
  } else if (rest.length === 1) {
    const singleW = Math.min(360, CONTENT_W);
    const singleH = (singleW * rest[0].imgH) / rest[0].imgW;
    ensureSpace(singleH + 22);
    drawFramedShot(
      rest[0],
      PAGE.marginX + (CONTENT_W - singleW) / 2,
      cursorY,
      singleW,
      singleH
    );
    cursorY += singleH + 22;
  }
}

function addRunningChrome() {
  const range = doc.bufferedPageRange();
  const totalPages = range.count;

  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    const page = doc.page;
    const origMargins = { ...page.margins };
    page.margins = { top: 0, bottom: 0, left: 0, right: 0 };

    if (i > 0) {
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text("Dental Clinic Management System", PAGE.marginX, 18, {
          width: CONTENT_W / 2,
          lineBreak: false,
        });
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text("Project & Deployment Documentation", PAGE.marginX + CONTENT_W / 2, 18, {
          width: CONTENT_W / 2,
          align: "right",
          lineBreak: false,
        });
      doc
        .moveTo(PAGE.marginX, 31)
        .lineTo(PAGE.marginX + CONTENT_W, 31)
        .lineWidth(0.5)
        .strokeColor(COLORS.border)
        .stroke();
    }

    const footerLineY = PAGE.height - 30;
    doc
      .moveTo(PAGE.marginX, footerLineY)
      .lineTo(PAGE.marginX + CONTENT_W, footerLineY)
      .lineWidth(0.5)
      .strokeColor(COLORS.border)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(7.8)
      .fillColor(COLORS.muted)
      .text(
        "Dental Clinic Management System · React, Express, PostgreSQL, Prisma",
        PAGE.marginX,
        footerLineY + 6,
        { width: CONTENT_W * 0.75, lineBreak: false }
      );
    doc
      .font("Helvetica-Bold")
      .fontSize(7.8)
      .fillColor(COLORS.primaryDark)
      .text(`Page ${i + 1} of ${totalPages}`, PAGE.marginX + CONTENT_W * 0.75, footerLineY + 6, {
        width: CONTENT_W * 0.25,
        align: "right",
        lineBreak: false,
      });

    page.margins = origMargins;
  }

  return totalPages;
}

// --- Build Document ---

drawBanner();

drawFullCard({
  title: "Project Overview",
  items: [
    {
      type: "p",
      text: "A responsive dental clinic administration application for dashboard reporting, doctor management, and patient appointment scheduling. Built with React, Express, PostgreSQL, and Prisma.",
    },
  ],
});

drawTwoColCards(
  {
    title: "Technology Stack",
    items: [
      { type: "kv", label: "Frontend:", text: "React, Vite, React Router, Lucide React", gap: 3 },
      { type: "kv", label: "Backend:", text: "Node.js, Express, Zod, Prisma", gap: 3 },
      { type: "kv", label: "Database:", text: "PostgreSQL", gap: 3 },
      {
        type: "kv",
        label: "Testing:",
        text: "Vitest, React Testing Library, Supertest, Playwright",
      },
    ],
  },
  {
    title: "Architecture",
    items: [
      {
        type: "p",
        text: "The browser communicates through a centralized API service with the Express REST API. Controllers and routes delegate database work to Prisma, while PostgreSQL stores normalized Doctor and Appointment records.",
      },
    ],
  }
);

drawTwoColCards(
  {
    title: "Database & Scheduling",
    items: [
      {
        type: "p",
        text: "Doctor email is unique and doctor deletion is restricted by existing appointments. Appointment create and update operations validate future times and reject overlap with active appointments for the same doctor.",
        gap: 4,
      },
      {
        type: "p",
        text: "Timestamps are stored consistently and the UI uses UTC-normalized display formatting.",
      },
    ],
  },
  {
    title: "REST API Endpoints",
    items: [
      { type: "code", method: "GET", path: "/api/health" },
      { type: "code", method: "GET", path: "/api/dashboard" },
      { type: "code", method: "GET, POST", path: "/api/doctors" },
      { type: "code", method: "GET, PUT, DELETE", path: "/api/doctors/:id" },
      { type: "code", method: "GET, POST", path: "/api/appointments" },
      { type: "code", method: "GET, PUT, DELETE", path: "/api/appointments/:id" },
    ],
  }
);

drawTwoColCards(
  {
    title: "Local Setup",
    items: [
      {
        type: "kv",
        label: "1. Env:",
        text: "Copy .env.example to server/.env and configure DATABASE_URL.",
        gap: 3,
      },
      {
        type: "kv",
        label: "2. Install:",
        text: "Run npm install, then npx prisma generate -w server.",
        gap: 3,
      },
      {
        type: "kv",
        label: "3. Run:",
        text: "Apply migrations, run the seed script, and start the dev servers with npm run dev.",
      },
    ],
  },
  {
    title: "Verification & Testing",
    items: [
      {
        type: "kv",
        label: "Automated Suites:",
        text: "Frontend tests cover dashboard, empty states, and routing; backend tests cover health, not-found responses, validation, and doctor creation.",
        gap: 4,
      },
      {
        type: "kv",
        label: "Verified Local DB:",
        text: "Native PostgreSQL 17 is running locally with Prisma migration 20261124000000_init applied and idempotent seed verified. Real API CRUD passed for create/update/delete, overlap rejection, and health.",
        gap: 4,
      },
      {
        type: "kv",
        label: "Browser E2E:",
        text: "Playwright Chromium passed 3/3 tests: primary routing, doctor create/edit/delete, and appointment create/edit/status/delete.",
      },
    ],
  }
);

drawFullCard({
  title: "Production Deployments",
  items: [
    {
      type: "link",
      label: "Frontend:",
      text: "https://dental-clinic-web-nine.vercel.app/",
      url: "https://dental-clinic-web-nine.vercel.app/",
      gap: 2.5,
    },
    {
      type: "link",
      label: "API Deployment:",
      text: "https://dental-clinic-api-opal.vercel.app/",
      url: "https://dental-clinic-api-opal.vercel.app/",
      gap: 2.5,
    },
    {
      type: "link",
      label: "API Base Path:",
      text: "https://dental-clinic-api-opal.vercel.app/api",
      url: "https://dental-clinic-api-opal.vercel.app/api",
      gap: 2.5,
    },
    {
      type: "link",
      label: "API Health:",
      text: "https://dental-clinic-api-opal.vercel.app/api/health",
      url: "https://dental-clinic-api-opal.vercel.app/api/health",
      gap: 5,
    },
    {
      type: "p",
      text: "The latest health check returned HTTP 200 and reported a connected database. Production CRUD and end-to-end workflows have not been independently verified. Keep DATABASE_URL in the backend project's secret environment settings only; never expose it in the frontend build.",
    },
  ],
});

drawTwoColCards(
  {
    title: "Repository & Deliverables",
    items: [
      {
        type: "link",
        label: "GitHub:",
        text: "https://github.com/qurban7860/Dental-Clinic-Management-System",
        url: "https://github.com/qurban7860/Dental-Clinic-Management-System",
        gap: 4,
      },
      {
        type: "p",
        text: "The develop branch and source code are maintained in this repository. README, architecture, API, database design, testing report, and traceability files are included in the docs/ directory.",
      },
    ],
  },
  {
    title: "Security & Limitations",
    variant: "warn",
    items: [
      {
        type: "p",
        text: "The application has no authentication or authorization and must not be used to store real patient information or protected health information. Rotate any previously exposed Supabase database password and replace the backend DATABASE_URL secret before relying on it. Production CRUD and end-to-end workflows have not been independently verified.",
      },
    ],
  }
);

drawScreenshotsSection();

const totalPages = addRunningChrome();
doc.end();

stream.on("finish", () => {
  console.log(`Generated ${path.basename(output)} (${totalPages} pages)`);
});
