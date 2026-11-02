"use client";

import { jsPDF } from "jspdf";

export type ReportData = {
  month: string;
  totalUnits: number;
  totalBill: number;
  dailyUnits: number;
  carbonFootprintKg: number;
  electricityCharge: number;
  fixedCharge: number;
  taxesFees: number;
  dueDate: string;
  status: string;
  slabs: { slab: string; range: string; units: number; rate: number; amount: number }[];
  customerName?: string;
  homeName?: string;
};

const BRAND = {
  navy: "#0f2043",
  blue: "#2e6ff2",
  amber: "#fdb813",
  ink: "#0c1730",
  inkSoft: "#5b6787",
  border: "#e2e8f4",
};

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch("/brand/logo.png");
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Builds the certificate-style BillSnap report as a jsPDF document.
 * Shared by both the "Download PDF" and "Print" actions so the two
 * outputs are always pixel-identical.
 */
async function buildReportDoc(data: ReportData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;

  // --- Decorative certificate border ---
  doc.setDrawColor(BRAND.blue);
  doc.setLineWidth(2);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
  doc.setDrawColor(BRAND.amber);
  doc.setLineWidth(0.75);
  doc.rect(margin + 6, margin + 6, pageWidth - (margin + 6) * 2, pageHeight - (margin + 6) * 2);

  let y = margin + 40;

  // --- Logo + brand name ---
  const logo = await loadLogoDataUrl();
  const logoSize = 44;
  const centerX = pageWidth / 2;
  if (logo) {
    doc.addImage(logo, "PNG", centerX - logoSize / 2, y, logoSize, logoSize);
    y += logoSize + 12;
  } else {
    y += 8;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(BRAND.navy);
  doc.text("BillSnap", centerX, y, { align: "center" });
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(BRAND.blue);
  doc.text("Bringing Transparency to Electricity Costs", centerX, y, { align: "center" });
  y += 28;

  // --- Certificate title ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(BRAND.ink);
  doc.text("Certificate of Electricity Usage Report", centerX, y, { align: "center" });
  y += 8;
  doc.setDrawColor(BRAND.amber);
  doc.setLineWidth(1.5);
  doc.line(centerX - 90, y, centerX + 90, y);
  y += 26;

  // --- Customer / period block ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.inkSoft);
  const infoLeftX = margin + 40;
  const infoRightX = pageWidth - margin - 40;

  doc.text(`Prepared for: ${data.customerName || "BillSnap Customer"}`, infoLeftX, y);
  doc.text(`Billing Month: ${data.month}`, infoRightX, y, { align: "right" });
  y += 16;
  doc.text(`Home: ${data.homeName || "—"}`, infoLeftX, y);
  doc.text(`Due Date: ${data.dueDate}`, infoRightX, y, { align: "right" });
  y += 30;

  // --- Headline numbers ---
  const cardWidth = (pageWidth - margin * 2 - 80 - 24 * 2) / 3;
  const cards = [
    { label: "Total Units", value: `${data.totalUnits} kWh` },
    { label: "Total Bill", value: `Rs. ${data.totalBill}` },
    { label: "Carbon Footprint", value: `${data.carbonFootprintKg} kg CO2` },
  ];
  let cardX = margin + 40;
  cards.forEach((c) => {
    doc.setDrawColor(BRAND.border);
    doc.setFillColor(248, 250, 253);
    doc.roundedRect(cardX, y, cardWidth, 58, 8, 8, "FD");
    doc.setFontSize(9);
    doc.setTextColor(BRAND.inkSoft);
    doc.text(c.label, cardX + 12, y + 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(BRAND.navy);
    doc.text(c.value, cardX + 12, y + 42);
    doc.setFont("helvetica", "normal");
    cardX += cardWidth + 24;
  });
  y += 90;

  // --- Slab breakdown table ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(BRAND.ink);
  doc.text("Slab-wise Breakdown", infoLeftX, y);
  y += 14;

  const tableX = infoLeftX;
  const colWidths = [110, 110, 90, 90, 100];
  const headers = ["Slab", "Range", "Units", "Rate (Rs.)", "Amount (Rs.)"];

  doc.setFillColor(BRAND.navy);
  doc.rect(tableX, y, colWidths.reduce((a, b) => a + b, 0), 22, "F");
  doc.setTextColor("#ffffff");
  doc.setFontSize(9);
  let hx = tableX;
  headers.forEach((h, i) => {
    doc.text(h, hx + 8, y + 14);
    hx += colWidths[i];
  });
  y += 22;

  doc.setTextColor(BRAND.ink);
  doc.setFont("helvetica", "normal");
  data.slabs.forEach((s, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(244, 247, 252);
      doc.rect(tableX, y, colWidths.reduce((a, b) => a + b, 0), 20, "F");
    }
    let rx = tableX;
    const row = [s.slab, s.range, String(s.units), s.rate.toFixed(2), s.amount.toFixed(2)];
    row.forEach((val, i) => {
      doc.text(val, rx + 8, y + 14);
      rx += colWidths[i];
    });
    y += 20;
  });
  y += 20;

  // --- Charges summary ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(BRAND.inkSoft);
  doc.text(`Electricity Charge: Rs. ${data.electricityCharge}`, infoLeftX, y);
  doc.text(`Fixed Charge: Rs. ${data.fixedCharge}`, infoLeftX, y + 16);
  doc.text(`Taxes & Fees: Rs. ${data.taxesFees}`, infoLeftX, y + 32);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.navy);
  doc.text(`Status: ${data.status}`, infoRightX, y + 16, { align: "right" });

  // --- Footer: developer info + signature line ---
  const footerY = pageHeight - margin - 70;
  doc.setDrawColor(BRAND.border);
  doc.line(margin + 40, footerY, pageWidth - margin - 40, footerY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(BRAND.inkSoft);
  doc.text("Generated automatically by SnapBot — BillSnap's AI energy assistant.", centerX, footerY + 16, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    `Report generated on ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
    margin + 40,
    footerY + 34
  );
  doc.text("BillSnap — Developed as a Stage 1–3 full-stack project", pageWidth - margin - 40, footerY + 34, {
    align: "right",
  });
  doc.setFontSize(8);
  doc.text("Developer: BillSnap Engineering Team  •  billsnap.app  •  support@billsnap.app", centerX, footerY + 48, {
    align: "center",
  });

  return doc;
}

/** Triggers a browser download of the certificate-style report PDF. */
export async function downloadBillReport(data: ReportData) {
  const doc = await buildReportDoc(data);
  doc.save(`BillSnap-Report-${data.month.replace(/\s+/g, "-")}.pdf`);
}

/** Opens the OS print dialog for the same certificate-style report. */
export async function printBillReport(data: ReportData) {
  const doc = await buildReportDoc(data);
  const blobUrl = doc.output("bloburl");
  const printWindow = window.open(blobUrl as unknown as string, "_blank");
  // Some browsers need a moment to render the PDF before print() works.
  if (printWindow) {
    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  }
}
