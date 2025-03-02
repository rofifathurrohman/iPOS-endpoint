const express = require("express");
const { getAllUsers, addUser, updateUser, deleteUser, loginUser } = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();

// Hanya Admin yang bisa mengelola user
router.get("/", authenticateToken, authorizeRole("admin"), getAllUsers);
const { body } = require("express-validator");

router.post( "/", [
    body("name").isLength({ min: 3 }).trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
    body("role").isIn(["admin", "kasir"]).withMessage("Role harus admin atau kasir"), ],
    authenticateToken, authorizeRole("admin"), addUser
);

router.put("/:id", authenticateToken, authorizeRole("admin"), updateUser);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteUser);

// Login User (Bisa diakses oleh semua pengguna)
router.post("/login", loginUser);

module.exports = router;