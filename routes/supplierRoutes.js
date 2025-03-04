const express = require("express");
const { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier } = require("../controllers/supplierController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();

// Get all suppliers (Staff Admin and Staff only)
router.get("/", authenticateToken, authorizeRole(["staff_admin", "staff"]), getAllSuppliers);

// Add a new supplier (Only Staff Admin and Staff can add)
router.post(
  "/",
  authenticateToken,
  authorizeRole(["staff_admin", "staff"]),
  addSupplier
);

// Update a supplier (Only Staff Admin and Staff can update)
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["staff_admin", "staff"]),
  updateSupplier
);

// Delete a supplier (Only Staff Admin and Staff can delete)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["staff_admin", "staff"]),
  deleteSupplier
);

module.exports = router;
