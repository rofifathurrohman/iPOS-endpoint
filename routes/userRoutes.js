const express = require("express");
const { getAllUsers, addUser, updateUser, deleteUser, loginUser } = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();
const { body } = require("express-validator");

// Semua user dapat login
router.post("/login", loginUser);

// Mendapatkan daftar pengguna (Admin melihat semua, Staff Admin hanya melihat yang dibuatnya)
router.get("/", authenticateToken, authorizeRole(["admin", "staff_admin"]), getAllUsers);

// Menambahkan pengguna baru
router.post(
    "/",
    [
      body("name").isLength({ min: 3 }).trim().escape(),
      body("email").isEmail().normalizeEmail(),
      body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
      body("role").isIn(["admin", "kasir", "staff_admin", "staff"]).withMessage("Role harus admin, kasir, staff, atau staff_admin"),
    ],
    authenticateToken,
    authorizeRole(["admin", "staff_admin"]),
    addUser
  );  

// Mengupdate pengguna
router.put("/:id", authenticateToken, authorizeRole(["admin", "staff_admin"]), updateUser);

// Menghapus pengguna
router.delete("/:id", authenticateToken, authorizeRole(["admin", "staff_admin"]), deleteUser);

module.exports = router;
