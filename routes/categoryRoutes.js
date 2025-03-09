const express = require("express");
const { getAllCategories, addCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();

// Allow Staff Admin and Staff to view categories
router.get("/", authenticateToken, getAllCategories);

// Allow Staff Admin and Staff to add, update, or delete categories
router.post("/", authenticateToken, authorizeRole(["staff_admin", "staff"]), addCategory);
router.put("/:id", authenticateToken, authorizeRole(["staff_admin", "staff"]), updateCategory);
router.delete("/:id", authenticateToken, authorizeRole(["staff_admin", "staff"]), deleteCategory);

module.exports = router;
