const db = require("../config/database");
const fs = require("fs");
const path = require("path");

exports.getSalesReport = (req, res) => {
  db.all("SELECT * FROM transactions", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getStockReport = (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getTopProducts = (req, res) => {
  db.all(
    `SELECT p.name, SUM(ti.quantity) AS total_sold
     FROM transaction_items ti
     JOIN products p ON ti.product_id = p.id
     GROUP BY p.name
     ORDER BY total_sold DESC
     LIMIT 5`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

exports.getMonthlySales = (req, res) => {
  db.all(
    `SELECT strftime('%Y-%m', transaction_date) AS month, SUM(total_price) AS total_sales
     FROM transactions
     GROUP BY month`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// Laporan Stok Masuk
exports.getStockInReport = (req, res) => {
  db.all(
    `SELECT si.id, si.product_id, p.name AS product_name, si.quantity, si.date_added
     FROM stock_in si
     JOIN products p ON si.product_id = p.id
     ORDER BY si.date_added DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// Laporan Stok Keluar
exports.getStockOutReport = (req, res) => {
  db.all(
    `SELECT so.id, so.product_id, p.name AS product_name, so.quantity, so.date_removed
     FROM stock_out so
     JOIN products p ON so.product_id = p.id
     ORDER BY so.date_removed DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

exports.getSalesByDateRange = (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: "Tanggal mulai dan akhir diperlukan" });
  }

  db.all(
    `SELECT * FROM transactions WHERE transaction_date BETWEEN ? AND ?`,
    [start_date, end_date],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

exports.getSalesByCategory = (req, res) => {
  db.all(
    `SELECT c.name AS category, SUM(ti.quantity) AS total_sold
     FROM transaction_items ti
     JOIN products p ON ti.product_id = p.id
     JOIN categories c ON p.category_id = c.id
     GROUP BY c.name
     ORDER BY total_sold DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

exports.getLowStockProducts = (req, res) => {
  const threshold = req.query.threshold || 10; // Default jika tidak ditentukan

  db.all(
    `SELECT * FROM products WHERE stock <= ? ORDER BY stock ASC`,
    [threshold],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

exports.getProfitReport = (req, res) => {
  db.all(
    `SELECT SUM((p.price - p.cost_price) * ti.quantity) AS total_profit
     FROM transaction_items ti
     JOIN products p ON ti.product_id = p.id`,
    [],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row[0]);
    }
  );
};

exports.exportSalesToCSV = (req, res) => {
  db.all("SELECT * FROM transactions", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const csvHeader = "ID,Customer ID,Total Price,Transaction Date\n";
    const csvData = rows.map(row => `${row.id},${row.customer_id},${row.total_price},${row.transaction_date}`).join("\n");

    const filePath = path.join(__dirname, "../exports/sales_report.csv");
    fs.writeFileSync(filePath, csvHeader + csvData);

    res.download(filePath);
  });
};




