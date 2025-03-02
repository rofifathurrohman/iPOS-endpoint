const express = require("express");
const { getSalesReport, getStockReport, getTopProducts, getMonthlySales, getStockInReport, getStockOutReport } = require("../controllers/reportController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();

router.get("/sales", authenticateToken, getSalesReport); // Bisa diakses oleh Admin & Kasir
router.get("/stock", authenticateToken, authorizeRole("admin"), getStockReport); // Hanya Admin
router.get("/top-products", authenticateToken, getTopProducts);
router.get("/monthly-sales", authenticateToken, getMonthlySales);
router.get("/stock-in", authenticateToken, authorizeRole("admin"), getStockInReport);
router.get("/stock-out", authenticateToken, authorizeRole("admin"), getStockOutReport);

module.exports = router;
