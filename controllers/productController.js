const db = require("../config/database");
const moment = require("moment-timezone");

function generateRandomId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

// Get all products (Staff Admin and their linked staff only)
exports.getAllProducts = (req, res) => {
  const { role, id: userId } = req.user;  // Get role and user ID from token

  let query = `
    SELECT products.id, products.name, products.buy_price, products.sell_price, products.barcode,
           categories.name AS category_name
    FROM products
    JOIN categories ON products.category_id = categories.id
  `;
  
  const params = [userId];

  if (role === "staff_admin") {
    // Staff Admin can see their own products and the ones linked to their staff
    query += " WHERE products.created_by = ? OR products.created_by IN (SELECT id FROM users WHERE created_by = ?)";
    params.push(userId);  // Fetch products created by the Staff Admin or linked staff
  } else if (role === "staff") {
    // Staff can see products created by their own Staff Admin or by themselves
    query += " WHERE products.created_by = ? OR products.created_by IN (SELECT id FROM users WHERE created_by = ?)";
    params.push(userId);  // Fetch products created by the staff's Staff Admin or by the staff themselves
  }

  // Execute the query with the appropriate parameters
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error fetching products:", err); // Log the error for debugging
      return res.status(500).json({ error: "Failed to fetch products" });
    }

    res.json(rows);  // Return the fetched products with category name
  });
};

// Add a product (Staff Admin or Staff)
exports.addProduct = (req, res) => {
  const { name, category_id, buy_price, sell_price, barcode } = req.body;
  const { id: userId } = req.user;  // Get the Staff Admin or Staff's ID

  if (!name || !category_id || !buy_price || !sell_price || !barcode) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Generate a random alphanumeric ID
  const randomId = generateRandomId();

  // Add product to the products table with the generated ID
  db.run(
    "INSERT INTO products (id, name, category_id, buy_price, sell_price, barcode, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [randomId, name, category_id, buy_price, sell_price, barcode, userId],  // Use randomId here
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      res.json({
        id: randomId,  // Return the generated ID
        name,
        category_id,
        buy_price,
        sell_price,
        barcode,
        created_by: userId,
      });
    }
  );
};

// Update a product (Staff Admin or Staff)
exports.updateProduct = (req, res) => {
  const { name, category_id, buy_price, sell_price, barcode } = req.body;
  const { id } = req.params;
  const { role, id: userId } = req.user;

  if (!name || !category_id || !buy_price || !sell_price || !barcode) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Query to update product details
  let query = "UPDATE products SET name = ?, category_id = ?, buy_price = ?, sell_price = ?, barcode = ? WHERE id = ?";
  const params = [name, category_id, buy_price, sell_price, barcode, id];

  if (role === "staff_admin") {
    query += " AND (created_by = ? OR created_by IN (SELECT id FROM users WHERE created_by = ?))";
    params.push(userId, userId);  // Staff Admin can modify their own or their linked Staff's products
  } else if (role === "staff") {
    query += " AND created_by = ?";
    params.push(userId);  // Staff can only modify their own products
  }

  // Update product details first
  db.run(query, params, function (err) {
    if (err) return res.status(400).json({ error: err.message });

    res.json({ message: "Product updated successfully!" });
  });
};

// Delete a product (Staff Admin or Staff)
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  let query = "DELETE FROM products WHERE id = ? ";
  const params = [id];

  if (role === "staff_admin") {
    // Staff Admin can delete products they created or those created by their linked Staff
    query += "AND (created_by = ? OR created_by IN (SELECT id FROM users WHERE created_by = ?))";
    params.push(userId, userId);  // Staff Admin can delete their own or their linked Staff's products
  } else if (role === "staff") {
    // Staff can only delete products they created
    query += "AND created_by = ?";
    params.push(userId);  // Staff can only delete their own products
  }

  db.run(query, params, function (err) {
    if (err) return res.status(400).json({ error: err.message });

    res.json({ message: "Product deleted successfully!" });
  });
};
