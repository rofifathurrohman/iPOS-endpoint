const express = require("express");
const { getAllProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();

router.get("/", authenticateToken, getAllProducts);
router.post("/", authenticateToken, authorizeRole("admin"), addProduct);
router.put("/:id", authenticateToken, authorizeRole("admin"), updateProduct);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteProduct);

module.exports = router;
