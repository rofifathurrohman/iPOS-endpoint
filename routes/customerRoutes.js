const express = require("express");
const { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } = require("../controllers/customerController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, getAllCustomers);
router.post("/", authenticateToken, addCustomer);
router.put("/:id", authenticateToken, updateCustomer);
router.delete("/:id", authenticateToken, deleteCustomer);

module.exports = router;
