const express = require("express");
const { addStock, removeStock, getAllStockTransactions } = require("../controllers/stockController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();

// Add stock to a product (Staff Admin and Staff)
router.post("/add", authenticateToken, authorizeRole(["staff_admin", "staff"]), addStock);

// Remove stock from a product (Staff Admin and Staff)
router.post("/remove", authenticateToken, authorizeRole(["staff_admin", "staff"]), removeStock);

// Get all stock transactions (Staff Admin and Staff)
router.get("/", authenticateToken, authorizeRole(["staff_admin", "staff"]), getAllStockTransactions);

module.exports = router;
