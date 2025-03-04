const express = require("express");
const { getAllUsers, addUser, updateUser, deleteUser, loginUser } = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();
const { body } = require("express-validator");

// Mendapatkan daftar pengguna
router.get("/", authenticateToken, authorizeRole(["admin", "staff_admin", "staff"]), getAllUsers);

router.post("/", [
    body("name").isLength({ min: 3 }).trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
    body("role").isIn(["admin", "kasir", "staff_admin", "staff"]).withMessage("Role harus admin, kasir, staff_admin, atau staff"),
  ],
  authenticateToken, authorizeRole(["admin", "staff_admin"]), addUser
);

router.put("/:id", authenticateToken, authorizeRole(["admin", "staff_admin"]), updateUser);
router.delete("/:id", authenticateToken, authorizeRole(["admin", "staff_admin"]), deleteUser);

// Login User (Bisa diakses oleh semua pengguna)
router.post("/login", loginUser);

module.exports = router;
