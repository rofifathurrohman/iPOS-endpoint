const express = require("express");
const { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier } = require("../controllers/supplierController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();

router.get("/", authenticateToken, authorizeRole("admin"), getAllSuppliers);
router.post("/", authenticateToken, authorizeRole("admin"), addSupplier);
router.put("/:id", authenticateToken, authorizeRole("admin"), updateSupplier);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteSupplier);

module.exports = router;
