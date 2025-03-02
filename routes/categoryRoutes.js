const express = require("express");
const { getAllCategories, addCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();

router.get("/", authenticateToken, getAllCategories);
router.post("/", authenticateToken, authorizeRole("admin"), addCategory);
router.put("/:id", authenticateToken, authorizeRole("admin"), updateCategory);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteCategory);

module.exports = router;
