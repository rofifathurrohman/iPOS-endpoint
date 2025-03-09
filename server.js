require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const db = require("./models/initDB");

const supplierRoutes = require("./routes/supplierRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");
const returnRoutes = require("./routes/returnRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const stockRoutes = require("./routes/stockRoutes");  // Import the stock routes

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Rate Limiting untuk mencegah brute force login
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 menit
  max: 5,
  message: { error: "Terlalu banyak percobaan login. Coba lagi nanti." },
});
app.use("/users/login", loginLimiter);

// Routes
app.use("/suppliers", supplierRoutes);
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/transactions", transactionRoutes);
app.use("/reports", reportRoutes);
app.use("/users", userRoutes);
app.use("/returns", returnRoutes);
app.use("/receipt", receiptRoutes);
app.use("/categories", categoryRoutes);
app.use("/stock", stockRoutes);  // Add stock routes for stock management

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));