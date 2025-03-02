const db = require("../config/database");

// Mendapatkan semua produk dengan kategori
exports.getAllProducts = (req, res) => {
  db.all(
    `SELECT products.id, products.name, categories.name AS category, products.unit, products.price, products.stock 
     FROM products 
     LEFT JOIN categories ON products.category_id = categories.id`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// Menambahkan produk baru dengan kategori
exports.addProduct = (req, res) => {
  const { name, category_id, unit, price, stock } = req.body;

  if (!name || !category_id || !unit || !price || !stock) {
    return res.status(400).json({ error: "Semua field harus diisi!" });
  }

  db.run(
    "INSERT INTO products (name, category_id, unit, price, stock) VALUES (?, ?, ?, ?, ?)",
    [name, category_id, unit, price, stock],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, name, category_id, unit, price, stock });
    }
  );
};

// Memperbarui produk (termasuk kategori)
exports.updateProduct = (req, res) => {
  const { name, category_id, unit, price, stock } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE products SET name = ?, category_id = ?, unit = ?, price = ?, stock = ? WHERE id = ?",
    [name, category_id, unit, price, stock, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Produk diperbarui" });
    }
  );
};

// Menghapus produk
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Produk dihapus" });
  });
};
