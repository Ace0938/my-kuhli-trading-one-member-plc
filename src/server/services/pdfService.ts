import { jsPDF } from 'jspdf';
import { Quotation, Order, Product } from '../../types/index.js';

export class PdfService {
  public static generateQuotationPdf(quotation: Quotation): string {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Dark luxury banner header
    doc.setFillColor(17, 14, 11);
    doc.rect(0, 0, 210, 42, 'F');

    // Brand Name & Subtitle
    doc.setTextColor(237, 232, 225);
    doc.setFontSize(22);
    doc.text('MY KUHLI', 20, 18);

    doc.setFontSize(9);
    doc.setTextColor(200, 138, 59); // Warm Ethiopian amber
    doc.text('PREMIUM ETHIOPIAN COFFEE EXPORTERS', 20, 26);
    doc.setTextColor(180, 175, 168);
    doc.text('Addis Ababa, Ethiopia | ECTA Export License: ECTA-EXP-2024-9982', 20, 33);

    // Document Title
    doc.setFontSize(16);
    doc.setTextColor(17, 14, 11);
    doc.text('OFFICIAL PROFORMA QUOTATION', 20, 54);

    // Meta Grid
    doc.setFontSize(10);
    doc.setTextColor(80, 75, 70);
    doc.text(`Quote No: ${quotation.quotationNumber}`, 20, 62);
    doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, 20, 68);
    doc.text(`Valid Until: ${new Date(quotation.validUntil).toLocaleDateString()}`, 20, 74);
    doc.text(`Incoterm: ${quotation.incoterm.replace(/_/g, ' ')}`, 20, 80);

    // Buyer Information
    doc.text('PREPARED FOR:', 120, 62);
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(11);
    doc.text(quotation.buyerCompanyName, 120, 68);
    doc.setFontSize(10);
    doc.setTextColor(80, 75, 70);
    doc.text(`Destination Port: ${quotation.destinationPort}`, 120, 74);
    doc.text(`Contact: ${quotation.buyerEmail}`, 120, 80);

    // Table Header
    doc.setFillColor(242, 238, 230);
    doc.rect(20, 90, 170, 8, 'F');
    doc.setTextColor(40, 35, 30);
    doc.setFontSize(9);
    doc.text('ITEM & SPECIFICATION', 24, 95.5);
    doc.text('PACKAGING', 90, 95.5);
    doc.text('QUANTITY', 125, 95.5);
    doc.text('UNIT PRICE', 148, 95.5);
    doc.text('TOTAL (USD)', 170, 95.5);

    // Table Rows
    let y = 105;
    quotation.items.forEach(item => {
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(9);
      doc.text(item.productName.substring(0, 34), 24, y);
      doc.text(item.packaging.substring(0, 18), 90, y);
      doc.text(`${item.quantityKg.toLocaleString()} kg`, 125, y);
      doc.text(`$${item.unitPricePerKg.toFixed(2)}/kg`, 148, y);
      doc.text(`$${item.totalUSD.toLocaleString()}`, 170, y);
      y += 10;
    });

    // Divider
    doc.setDrawColor(220, 215, 205);
    doc.line(20, y + 2, 190, y + 2);
    y += 10;

    // Totals Section
    doc.setFontSize(9);
    doc.setTextColor(90, 85, 80);
    doc.text('Subtotal:', 130, y);
    doc.text(`$${quotation.subtotalUSD.toLocaleString()}`, 170, y);
    y += 6;

    if (quotation.freightUSD > 0) {
      doc.text('Ocean Freight:', 130, y);
      doc.text(`$${quotation.freightUSD.toLocaleString()}`, 170, y);
      y += 6;
    }

    if (quotation.insuranceUSD > 0) {
      doc.text('Cargo Insurance:', 130, y);
      doc.text(`$${quotation.insuranceUSD.toLocaleString()}`, 170, y);
      y += 6;
    }

    if (quotation.otherFeesUSD > 0) {
      doc.text('Export & Phytosanitary Docs:', 130, y);
      doc.text(`$${quotation.otherFeesUSD.toLocaleString()}`, 170, y);
      y += 6;
    }

    // Grand Total
    doc.setFillColor(200, 138, 59);
    doc.rect(125, y, 65, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('TOTAL AMOUNT (USD):', 128, y + 6);
    doc.text(`$${quotation.totalAmountUSD.toLocaleString()}`, 168, y + 6);
    y += 18;

    // Payment Terms Box
    doc.setFillColor(248, 246, 242);
    doc.rect(20, y, 170, 24, 'F');
    doc.setTextColor(40, 35, 30);
    doc.setFontSize(9);
    doc.text('PAYMENT TERMS & BANKING DETAILS', 24, y + 6);
    doc.setTextColor(90, 85, 80);
    doc.text(quotation.paymentTerms, 24, y + 12);
    doc.text('Beneficiary: MY KUHLI Coffee Exporters Ltd | Bank: Commercial Bank of Ethiopia | SWIFT: CBETETAA', 24, y + 18);
    y += 34;

    // Signatures / Stamps
    doc.setTextColor(50, 45, 40);
    doc.text('Authorized Signature for MY KUHLI:', 24, y);
    doc.text('Abebe Tadesse, Managing Director', 24, y + 6);
    doc.text('[STAMP: ETHIOPIAN COFFEE & TEA AUTHORITY LICENSED]', 24, y + 12);

    return doc.output('datauristring');
  }

  public static generateInvoicePdf(order: Order): string {
    const doc = new jsPDF();
    doc.setFillColor(17, 14, 11);
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(237, 232, 225);
    doc.setFontSize(20);
    doc.text('MY KUHLI COFFEE EXPORTERS', 20, 18);
    doc.setFontSize(9);
    doc.setTextColor(200, 138, 59);
    doc.text('COMMERCIAL EXPORT INVOICE', 20, 26);

    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(`Invoice No: INV-${order.orderNumber}`, 20, 48);
    doc.text(`Order Reference: ${order.orderNumber}`, 20, 54);
    doc.text(`Date of Issue: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 60);
    doc.text(`Incoterm: ${order.incoterm}`, 20, 66);
    doc.text(`Port of Loading: Port of Djibouti`, 20, 72);
    doc.text(`Port of Discharge: ${order.destinationPort}`, 20, 78);

    doc.text('BUYER / CONSIGNEE:', 120, 48);
    doc.text(order.buyerCompanyName, 120, 54);
    doc.text(order.buyerEmail, 120, 60);
    doc.text(`Country: ${order.destinationCountry}`, 120, 66);

    let y = 90;
    doc.setFillColor(240, 235, 225);
    doc.rect(20, y, 170, 8, 'F');
    doc.text('Description', 24, y + 5.5);
    doc.text('Qty (Kg)', 110, y + 5.5);
    doc.text('Unit Price', 140, y + 5.5);
    doc.text('Total (USD)', 165, y + 5.5);
    y += 14;

    order.items.forEach(item => {
      doc.text(item.productName, 24, y);
      doc.text(`${item.quantityKg.toLocaleString()}`, 110, y);
      doc.text(`$${item.unitPricePerKg.toFixed(2)}`, 140, y);
      doc.text(`$${item.totalUSD.toLocaleString()}`, 165, y);
      y += 8;
    });

    y += 10;
    doc.setFontSize(11);
    doc.text(`TOTAL COMMERCIAL VALUE: $${order.totalAmountUSD.toLocaleString()} USD`, 100, y);

    return doc.output('datauristring');
  }

  public static generateSpecSheetPdf(product: Product): string {
    const doc = new jsPDF();
    doc.setFillColor(17, 14, 11);
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(237, 232, 225);
    doc.setFontSize(18);
    doc.text('MY KUHLI SPECIFICATION SHEET', 20, 18);
    doc.setFontSize(9);
    doc.setTextColor(200, 138, 59);
    doc.text('ORIGIN ETHIOPIA | PHYSICAL & SENSORY DATA', 20, 26);

    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(product.name, 20, 48);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`SKU: ${product.sku} | Origin: ${product.originName} (${product.region})`, 20, 56);
    doc.text(`Processing: ${product.processingMethod} | Grade: ${product.grade.replace(/_/g, ' ')}`, 20, 62);
    doc.text(`Altitude: ${product.altitudeMin} - ${product.altitudeMax} MASL | Variety: ${product.variety}`, 20, 68);
    doc.text(`SCA Cupping Score: ${product.cupScore} / 100 | Screen Size: ${product.screenSize}`, 20, 74);
    doc.text(`Moisture Content: ${product.moisturePercent}% | Harvest Season: ${product.harvestYear}`, 20, 80);
    doc.text(`Flavor Notes: ${product.flavorNotes.join(', ')}`, 20, 86);

    return doc.output('datauristring');
  }
}
