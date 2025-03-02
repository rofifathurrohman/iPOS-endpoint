const db = require("../config/database");

exports.returnProduct = (req, res) => {
  const { transaction_id, product_id, quantity } = req.body;

  db.run(
    "INSERT INTO returns (transaction_id, product_id, quantity, return_date) VALUES (?, ?, ?, datetime('now'))",
    [transaction_id, product_id, quantity],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      db.run("UPDATE products SET stock = stock + ? WHERE id = ?", [quantity, product_id]);

      res.json({ message: "Barang berhasil dikembalikan!" });
    }
  );
};
