const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mendapatkan semua pengguna berdasarkan role
exports.getAllUsers = (req, res) => {
  let query = "SELECT id, name, email, role, created_by FROM users";
  const params = [];

  // Jika Staff Admin, hanya bisa melihat Staff & Kasir yang dibuatnya
  if (req.user.role === "staff_admin") {
    query += " WHERE created_by = ?";
    params.push(req.user.id);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Menambahkan pengguna baru
exports.addUser = async (req, res) => {
  console.log("Received data:", req.body); // 🔍 Cek data yang dikirim

  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Semua field harus diisi!" });
  }

  if (req.user.role === "staff_admin" && (role === "admin" || role === "staff_admin")) {
    return res.status(403).json({ error: "Staff Admin hanya bisa membuat Staff dan Kasir!" });
  }

  const createdBy = req.user.role === "staff_admin" ? req.user.id : null;
  const hashedPassword = await bcrypt.hash(password, 12);

  db.run(
    "INSERT INTO users (name, email, password, role, created_by) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashedPassword, role, createdBy],
    function (err) {
      if (err) return res.status(400).json({ error: "Email sudah digunakan!" });
      res.json({ message: "User berhasil ditambahkan!", id: this.lastID, name, email, role, createdBy });
    }
  );
};

// Update User
exports.updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const { id } = req.params;

  // Staff Admin tidak bisa mengubah Admin
  if (req.user.role === "staff_admin") {
    db.get("SELECT role FROM users WHERE id = ?", [id], (err, user) => {
      if (err || !user) return res.status(400).json({ error: "User tidak ditemukan!" });
      if (user.role === "admin") {
        return res.status(403).json({ error: "Staff Admin tidak dapat mengubah Admin!" });
      }
    });
  }

  let hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  db.run(
    "UPDATE users SET name = ?, email = ?, password = COALESCE(?, password), role = ? WHERE id = ?",
    [name, email, hashedPassword, role, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "User berhasil diperbarui!" });
    }
  );
};

// Menghapus pengguna
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  // Staff Admin hanya bisa menghapus Staff dan Kasir yang dibuatnya
  if (req.user.role === "staff_admin") {
    db.get("SELECT created_by FROM users WHERE id = ?", [id], (err, user) => {
      if (err || !user) return res.status(400).json({ error: "User tidak ditemukan!" });
      if (user.created_by !== req.user.id) {
        return res.status(403).json({ error: "Anda hanya dapat menghapus pengguna yang Anda buat!" });
      }
    });
  }

  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "User berhasil dihapus!" });
  });
};

// Login User
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: "User tidak ditemukan!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Password salah!" });

    // Membuat token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  });
};
