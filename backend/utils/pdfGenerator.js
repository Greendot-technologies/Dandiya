const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateTicketPDF = (ticketData) => {
  return new Promise((resolve, reject) => {
    const { name, date, pass_type, qrCode } = ticketData;

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const fileName = `ticket-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "..", "tickets", fileName);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Background border
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3)
      .strokeColor("#ff9933") // Navratri orange
      .stroke();

    // Header
    doc
      .fontSize(24) // Reduced font size
      .fillColor("#ff0066") // Festive pink
      .font("Helvetica-Bold")
      .text("🎉 Malang Ras Dandiya Night 🎉", {
        align: "center",
        underline: true,
      });

    doc.moveDown();
    doc.fontSize(14).fillColor("#000"); // Reduced font size for details

    doc.text(`🎫 Name: ${name}`);
    doc.text(`📅 Date: ${date}`);
    doc.text(`🎟️ Pass Type: ${pass_type}`);

    doc.moveDown(1);

    // Add QR Code image (base64 string)
    const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
    const qrImagePath = path.join(
      __dirname,
      "..",
      "tickets",
      `qr-${Date.now()}.png`
    );
    fs.writeFileSync(qrImagePath, base64Data, "base64");

    doc.text("Scan this QR Code at Entry", { align: "center" });
    doc.image(qrImagePath, {
      fit: [150, 150],
      align: "center",
    });

    doc.end();

    stream.on("finish", () => {
      fs.unlinkSync(qrImagePath); // Cleanup
      resolve(filePath);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};

module.exports = generateTicketPDF;
