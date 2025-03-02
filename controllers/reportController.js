const db = require("../config/database");

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
