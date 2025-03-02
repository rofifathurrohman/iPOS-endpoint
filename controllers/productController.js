const db = require("../config/database");

exports.getAllProducts = (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.addProduct = (req, res) => {
  const { name, category, unit, price, stock } = req.body;
  db.run(
    "INSERT INTO products (name, category, unit, price, stock) VALUES (?, ?, ?, ?, ?)",
    [name, category, unit, price, stock],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, name, category, unit, price, stock });
    }
  );
};

exports.updateProduct = (req, res) => {
  const { name, category, unit, price, stock } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE products SET name = ?, category = ?, unit = ?, price = ?, stock = ? WHERE id = ?",
    [name, category, unit, price, stock, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Product updated successfully" });
    }
  );
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Product deleted successfully" });
  });
};
