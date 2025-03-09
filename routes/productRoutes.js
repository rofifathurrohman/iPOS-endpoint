const express = require("express");
const { getAllProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();

// Route to get all products (accessible by Staff Admin and Staff)
router.get("/", authenticateToken, getAllProducts);

// Route to add a new product (only Staff Admin and Staff)
router.post("/", authenticateToken, authorizeRole(["staff_admin", "staff"]), addProduct);

// Route to update a product (only Staff Admin and Staff)
router.put("/:id", authenticateToken, authorizeRole(["staff_admin", "staff"]), updateProduct);

// Route to delete a product (only Staff Admin and Staff)
router.delete("/:id", authenticateToken, authorizeRole(["staff_admin", "staff"]), deleteProduct);

module.exports = router;
