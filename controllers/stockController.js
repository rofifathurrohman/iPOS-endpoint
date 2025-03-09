const db = require("../config/database");
const moment = require("moment-timezone");

// Add stock to a product (Staff Admin and Staff)
exports.addStock = (req, res) => {
  const { product_id, quantity } = req.body;
  const { role, id: userId } = req.user;  // Get role and user ID from token

  if (!product_id || !quantity) {
    return res.status(400).json({ error: "Product ID and quantity are required!" });
  }

  const dateAdded = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");

  // Add stock in the stocks table
  db.run(
    "INSERT INTO stocks (product_id, quantity, date_added, created_by, type) VALUES (?, ?, ?, ?, ?)",
    [product_id, quantity, dateAdded, userId, "in"], // 'in' for stock added
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      // Update stock dynamically in the products table (no need for a direct 'stock' column)
      db.get(
        "SELECT SUM(quantity) AS total_stock_in FROM stocks WHERE product_id = ? AND type = 'in'",
        [product_id],
        (err, stockInData) => {
          if (err) return res.status(400).json({ error: err.message });

          db.get(
            "SELECT SUM(quantity) AS total_stock_out FROM stocks WHERE product_id = ? AND type = 'out'",
            [product_id],
            (err, stockOutData) => {
              if (err) return res.status(400).json({ error: err.message });

              const totalStock = (stockInData?.total_stock_in || 0) - (stockOutData?.total_stock_out || 0);

              // Return the updated stock transaction
              res.json({
                message: "Stock added successfully!",
                totalStock,
              });
            }
          );
        }
      );
    }
  );
};

// Remove stock from a product (Staff Admin and Staff)
exports.removeStock = (req, res) => {
  const { product_id, quantity } = req.body;
  const { role, id: userId } = req.user;  // Get role and user ID from token

  if (!product_id || !quantity) {
    return res.status(400).json({ error: "Product ID and quantity are required!" });
  }

  const dateRemoved = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");

  // Add stock out in the stocks table
  db.run(
    "INSERT INTO stocks (product_id, quantity, date_added, created_by, type) VALUES (?, ?, ?, ?, ?)",
    [product_id, quantity, dateRemoved, userId, "out"], // 'out' for stock removed
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      // Update stock dynamically in the products table (no need for a direct 'stock' column)
      db.get(
        "SELECT SUM(quantity) AS total_stock_in FROM stocks WHERE product_id = ? AND type = 'in'",
        [product_id],
        (err, stockInData) => {
          if (err) return res.status(400).json({ error: err.message });

          db.get(
            "SELECT SUM(quantity) AS total_stock_out FROM stocks WHERE product_id = ? AND type = 'out'",
            [product_id],
            (err, stockOutData) => {
              if (err) return res.status(400).json({ error: err.message });

              const totalStock = (stockInData?.total_stock_in || 0) - (stockOutData?.total_stock_out || 0);

              res.json({
                message: "Stock removed successfully!",
                totalStock,
              });
            }
          );
        }
      );
    }
  );
};

// Get all stock transactions (Staff Admin and Staff)
exports.getAllStockTransactions = (req, res) => {
  const { role, id: userId } = req.user;  // Get role and user ID from token

  // Query to fetch stock in and stock out transactions from the `stocks` table
  const query = `
    SELECT s.id, s.product_id, s.quantity, s.date_added, s.type, p.name AS product_name, u.name AS created_by_name
    FROM stocks s
    LEFT JOIN products p ON p.id = s.product_id
    LEFT JOIN users u ON u.id = s.created_by
    WHERE s.created_by = ? 
  `;
  const params = [userId];  // Filter stock transactions by user (Staff Admin and Staff)

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Format the date to UTC+7
    const formattedRows = rows.map(row => ({
      ...row,
      date_added: moment(row.date_added).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(formattedRows);  // Return all stock transactions
  });
};
