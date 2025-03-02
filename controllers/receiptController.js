const PDFDocument = require("pdfkit");

exports.generateReceipt = (req, res) => {
  const { transaction_id, customer_name, total_price, items } = req.body;

  const doc = new PDFDocument();
  res.setHeader("Content-Disposition", 'attachment; filename="receipt.pdf"');
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);
  doc.fontSize(20).text("Struk Pembelian", { align: "center" });
  doc.text(`Tanggal: ${new Date().toLocaleString()}`);
  doc.text(`Pelanggan: ${customer_name}`);
  doc.text(`Total Harga: Rp ${total_price}`);
  doc.moveDown();

  items.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.product_name} - ${item.quantity} x Rp ${item.price}`);
  });

  doc.end();
};
