const express = require("express");
const { returnProduct } = require("../controllers/returnController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, returnProduct);

module.exports = router;
