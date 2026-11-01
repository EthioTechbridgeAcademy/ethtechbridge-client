import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Clean & sanitize cell string to prevent spreadsheet formula injection
 */
function sanitizeCell(val) {
  if (val === null || val === undefined) return "";
  let s = String(val).trim();
  if (s.startsWith("=") || s.startsWith("+") || s.startsWith("-") || s.startsWith("@")) {
    s = `'${s}`;
  }
  return s;
}

/**
 * Export data to an Excel (.xlsx) file
 * @param {Object} options
 * @param {string} options.filename - Output filename base (without extension)
 * @param {string} [options.sheetName] - Worksheet name
 * @param {string} options.title - Report title displayed in the sheet header
 * @param {Array<string>} options.headers - Array of column header titles
 * @param {Array<Array<any>|Object>} options.data - Rows of data
 * @param {Array<{label: string, value: any}>} [options.summaryCards] - Top-level metrics
 */
export function exportToExcel({
  filename = "ethio-techbridge-report",
  sheetName = "Report",
  title = "Institutional Report",
  headers = [],
  data = [],
  summaryCards = []
}) {
  const rows = [];

  // 1. Academy Branding & Header Block
  rows.push(["ETHIO TECHBRIDGE ACADEMY"]);
  rows.push([title]);
  rows.push([`Generated: ${new Date().toLocaleString()} (East Africa Time - EAT)`]);
  rows.push(["Confidential Administrative Record - Authorized Personnel Only"]);
  rows.push([]); // blank separator

  // 2. Summary KPI Metrics (if provided)
  if (summaryCards && summaryCards.length > 0) {
    rows.push(["EXECUTIVE SUMMARY / KEY METRICS"]);
    summaryCards.forEach((c) => {
      rows.push([c.label, c.value]);
    });
    rows.push([]); // blank separator
  }

  // 3. Table Column Headers
  rows.push(headers);

  // 4. Data Rows
  data.forEach((row) => {
    if (Array.isArray(row)) {
      rows.push(row.map(sanitizeCell));
    } else {
      rows.push(headers.map((h) => sanitizeCell(row[h])));
    }
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Calculate dynamic column widths
  const colWidths = headers.map((h, i) => {
    let maxLen = String(h).length;
    data.forEach((row) => {
      const val = Array.isArray(row) ? row[i] : row[h];
      if (val !== undefined && val !== null) {
        maxLen = Math.max(maxLen, String(val).length);
      }
    });
    return { wch: Math.min(Math.max(maxLen + 4, 12), 48) };
  });
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));

  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filename}-${dateStr}.xlsx`);
}

/**
 * Export data to a styled PDF document
 * @param {Object} options
 * @param {string} options.filename - Output filename base (without extension)
 * @param {string} options.title - Report title
 * @param {string} [options.subtitle] - Report subtitle / description
 * @param {Array<string>} options.headers - Array of table column headers
 * @param {Array<Array<any>|Object>} options.data - Rows of data
 * @param {Array<{label: string, value: any}>} [options.summaryCards] - Summary metric cards
 * @param {"portrait"|"landscape"} [options.orientation] - Page orientation
 */
export function exportToPdf({
  filename = "ethio-techbridge-report",
  title = "Institutional Report",
  subtitle = "Academy Academic & Operational Records",
  headers = [],
  data = [],
  summaryCards = [],
  orientation = "portrait"
}) {
  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 14;

  // 1. Academy Header Banner (Dark Navy #0B1A30)
  doc.setFillColor(11, 26, 48);
  doc.rect(0, 0, pageWidth, 24, "F");

  // Gold accent stripe (#F59E0B)
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 24, pageWidth, 1.5, "F");

  // Academy Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("ETHIO TECHBRIDGE ACADEMY", 14, 11);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text("Institutional Administrative Reporting & Student Records", 14, 17);

  // Generation timestamp on top right
  const dateFormatted = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  doc.setFontSize(8);
  doc.text(`Generated: ${dateFormatted} EAT`, pageWidth - 14, 15, { align: "right" });

  currentY = 32;

  // 2. Report Title & Subtitle
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, currentY);

  if (subtitle) {
    currentY += 5;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, 14, currentY);
  }

  currentY += 7;

  // 3. Summary Cards (KPI Metrics)
  if (summaryCards && summaryCards.length > 0) {
    const cardGap = 3.5;
    const count = Math.min(summaryCards.length, 5);
    const totalAvailWidth = pageWidth - 28 - (cardGap * (count - 1));
    const cardWidth = totalAvailWidth / count;
    const cardHeight = 13;

    summaryCards.slice(0, count).forEach((card, idx) => {
      const cardX = 14 + idx * (cardWidth + cardGap);
      // Box fill & border
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 1.5, 1.5, "FD");

      // Label
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text(String(card.label).toUpperCase().slice(0, 20), cardX + 3, currentY + 4.5);

      // Value
      doc.setFontSize(10.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 58, 138);
      doc.text(String(card.value), cardX + 3, currentY + 10.5);
    });

    currentY += cardHeight + 7;
  }

  // 4. Data Table
  const tableData = data.map((item) => {
    if (Array.isArray(item)) return item.map((v) => (v !== null && v !== undefined ? String(v) : ""));
    return headers.map((h) => (item[h] !== undefined && item[h] !== null ? String(item[h]) : ""));
  });

  autoTable(doc, {
    startY: currentY,
    head: [headers],
    body: tableData,
    margin: { left: 14, right: 14, bottom: 16 },
    theme: "striped",
    headStyles: {
      fillColor: [30, 58, 138], // #1E3A8A
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "left"
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didDrawPage: () => {
      // Running footer on each page
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Ethio Techbridge Academy • Confidential Official Record • Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
        14,
        doc.internal.pageSize.getHeight() - 8
      );
    }
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`${filename}-${dateStr}.pdf`);
}
