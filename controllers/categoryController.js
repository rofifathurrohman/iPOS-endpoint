const db = require("../config/database");

// Mendapatkan semua kategori (Staff Admin and their linked staff only)
exports.getAllCategories = (req, res) => {
  const { role, id: userId } = req.user;  // Get role and user ID from token

  let query = "SELECT * FROM categories WHERE created_by = ?";
  const params = [userId];

  if (role === "staff_admin") {
    // Staff Admin can see their own categories and the ones linked to their staff
    query += " OR created_by IN (SELECT id FROM users WHERE created_by = ?)";
    params.push(userId);  // Include categories created by Staff linked to the Staff Admin
  } else if (role === "staff") {
    // Staff can see categories created by their own Staff Admin or by themselves
    query += " OR created_by = ?";
    params.push(userId);  // Include categories created by the Staff Admin linked to the Staff
  }

  // Execute the query with the appropriate parameters
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);  // Return the fetched categories
  });
};

// Menambahkan kategori baru (Staff Admin dan Staff)
exports.addCategory = (req, res) => {
  const { name } = req.body;
  const { id: userId, role } = req.user;  // Get user ID and role from the token

  if (!name) return res.status(400).json({ error: "Nama kategori diperlukan" });

  // Staff Admin and Staff can add categories, the created_by field will be set to their userId
  db.run(
    "INSERT INTO categories (name, created_by) VALUES (?, ?)", 
    [name, userId],  // Set created_by to the userId (Staff Admin or Staff)
    function (err) {
      if (err) return res.status(400).json({ error: "Kategori sudah ada atau terjadi kesalahan" });
      res.json({ id: this.lastID, name, created_by: userId });
    }
  );
};

// Memperbarui kategori (Staff Admin dan Staff)
exports.updateCategory = (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const { role, id: userId } = req.user;

  if (!name) return res.status(400).json({ error: "Nama kategori diperlukan" });

  let query = "UPDATE categories SET name = ? WHERE id = ? AND (created_by = ? OR created_by IN (SELECT id FROM users WHERE created_by = ?))";
  const params = [name, id, userId, userId]; // Allow update if created_by matches the user or their linked Staff

  db.run(query, params, function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Kategori diperbarui" });
  });
};

// Menghapus kategori (Staff Admin dan Staff)
exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  let query = "DELETE FROM categories WHERE id = ? AND (created_by = ? OR created_by IN (SELECT id FROM users WHERE created_by = ?))";
  const params = [id, userId, userId]; // Allow delete if created_by matches the user or their linked Staff

  db.run(query, params, function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Kategori dihapus" });
  });
};
