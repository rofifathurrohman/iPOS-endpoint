const db = require("../config/database");

// Mendapatkan semua kategori
exports.getAllCategories = (req, res) => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Menambahkan kategori baru
exports.addCategory = (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "Nama kategori diperlukan" });

  db.run("INSERT INTO categories (name) VALUES (?)", [name], function (err) {
    if (err) return res.status(400).json({ error: "Kategori sudah ada atau terjadi kesalahan" });
    res.json({ id: this.lastID, name });
  });
};

// Memperbarui kategori
exports.updateCategory = (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  db.run("UPDATE categories SET name = ? WHERE id = ?", [name, id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Kategori diperbarui" });
  });
};

// Menghapus kategori
exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM categories WHERE id = ?", [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Kategori dihapus" });
  });
};
