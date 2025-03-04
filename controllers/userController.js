const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mendapatkan semua pengguna (Admin, Staff Admin, Staff)
exports.getAllUsers = (req, res) => {
  const { role } = req.user;  // Get the role from the token

  let query = "SELECT id, name, email, role FROM users";

  if (role === "staff_admin") {
    // Staff Admin can only see "staff" and "kasir"
    query += " WHERE role IN ('staff', 'kasir')";
  } else if (role === "staff") {
    // Staff can only see other staff
    query += " WHERE role = 'kasir'";
  }

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Menambahkan pengguna baru (Admin, Staff Admin hanya bisa membuat Staff)
exports.addUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const { role: userRole } = req.user; // Get the role from the token

  // Staff Admin can only create "staff" and "kasir"
  if (userRole === "staff_admin" && !["staff", "kasir"].includes(role)) {
    return res.status(403).json({ error: "Staff Admin can only create staff or kasir users." });
  }

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Semua field harus diisi!" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  db.run(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role],
    function (err) {
      if (err) return res.status(400).json({ error: "Email sudah digunakan!" });
      res.json({ message: "User berhasil ditambahkan!", id: this.lastID, name, email, role });
    }
  );
};

// Update User (Hanya Admin dan Staff Admin)
exports.updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const { id } = req.params;
  const { role: userRole } = req.user; // Get the role from the token

  // Only Admin and Staff Admin can edit roles
  if (userRole === "staff") {
    return res.status(403).json({ error: "Staff cannot update user roles." });
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

// Menghapus pengguna (Hanya Admin)
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const { role } = req.user; // Get the role from the token

  if (role === "staff") {
    return res.status(403).json({ error: "Staff cannot delete users." });
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
