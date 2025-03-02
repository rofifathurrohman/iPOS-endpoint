const express = require("express");
const { getAllTransactions, addTransaction, cancelTransaction } = require("../controllers/transactionController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

const router = express.Router();

router.get("/", authenticateToken, getAllTransactions);
router.post("/", authenticateToken, addTransaction);
router.delete("/:id", authenticateToken, authorizeRole("admin"), cancelTransaction);

module.exports = router;
