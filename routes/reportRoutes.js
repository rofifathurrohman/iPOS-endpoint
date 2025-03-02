const express = require("express");
const { getSalesReport, getStockReport, getTopProducts, getMonthlySales, getStockInReport, getStockOutReport, getSalesByDateRange, getSalesByCategory, getLowStockProducts, getProfitReport, exportSalesToCSV } = require("../controllers/reportController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();

router.get("/sales", authenticateToken, getSalesReport); // Bisa diakses oleh Admin & Kasir
router.get("/stock", authenticateToken, authorizeRole("admin"), getStockReport); // Hanya Admin
router.get("/top-products", authenticateToken, getTopProducts);
router.get("/monthly-sales", authenticateToken, getMonthlySales);
router.get("/stock-in", authenticateToken, authorizeRole("admin"), getStockInReport);
router.get("/stock-out", authenticateToken, authorizeRole("admin"), getStockOutReport);
router.get("/sales/date-range", authenticateToken, authorizeRole("admin"), getSalesByDateRange);
router.get("/sales/category", authenticateToken, authorizeRole("admin"), getSalesByCategory);
router.get("/stock/low", authenticateToken, authorizeRole("admin"), getLowStockProducts);
router.get("/profit", authenticateToken, authorizeRole("admin"), getProfitReport);
router.get("/export/csv", authenticateToken, authorizeRole("admin"), exportSalesToCSV);

module.exports = router;
