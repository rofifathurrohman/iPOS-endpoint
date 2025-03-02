const db = require("../config/database");

exports.getAllTransactions = (req, res) => {
  db.all("SELECT * FROM transactions", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.addTransaction = (req, res) => {
  const { customer_id, total_price, items } = req.body;

  db.run(
    "INSERT INTO transactions (customer_id, total_price, transaction_date) VALUES (?, ?, datetime('now'))",
    [customer_id, total_price],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      const transaction_id = this.lastID;

      items.forEach((item) => {
        db.run(
          "INSERT INTO transaction_items (transaction_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [transaction_id, item.product_id, item.quantity, item.price],
          function (err) {
            if (err) console.error(err.message);
          }
        );

        db.run("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.product_id]);
      });

      res.json({ message: "Transaction added successfully", transaction_id });
    }
  );
};

exports.cancelTransaction = (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM transaction_items WHERE transaction_id = ?", [id], (err, items) => {
    if (err) return res.status(400).json({ error: err.message });

    items.forEach((item) => {
      db.run(
        "UPDATE products SET stock = stock + ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    });

    db.run("DELETE FROM transactions WHERE id = ?", [id], function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Transaction cancelled and stock restored." });
    });
  });
};
