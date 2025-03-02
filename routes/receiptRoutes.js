const express = require("express");
const { generateReceipt } = require("../controllers/receiptController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, generateReceipt);

module.exports = router;
