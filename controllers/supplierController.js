const db = require("../config/database");
const moment = require("moment-timezone");

// Get all suppliers (Staff Admin and their linked staff only)
exports.getAllSuppliers = (req, res) => {
  const { role, id: userId } = req.user;  // Get role and user ID from token

  let query = `
    SELECT suppliers.id, suppliers.name, suppliers.contact, suppliers.address, suppliers.created_by, suppliers.created_at, users.name AS created_by_name
    FROM suppliers
    LEFT JOIN users ON suppliers.created_by = users.id
  `;
  const params = [];

  if (role === "staff_admin" || role === "staff") {
    // Both Staff Admin and Staff can see all data (created by them and their linked staff)
    query += " WHERE suppliers.created_by = ? OR suppliers.created_by IN (SELECT id FROM users WHERE created_by = ?)";
    params.push(userId, userId); // Fetch suppliers created by the user or by their linked staff
  }

  // Execute the query with the appropriate parameters
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Map through the suppliers and convert the created_by field to the Staff Admin's name
    const supplierDetails = rows.map(supplier => {
      return {
        ...supplier,
        created_at: moment(supplier.created_at).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss"),  // Convert to UTC+7 timezone
      };
    });

    res.json(supplierDetails);
  });
};

// Add a new supplier (Staff Admin and Staff only)
exports.addSupplier = (req, res) => {
  const { name, contact, address } = req.body;
  const { role, id: userId } = req.user;  // Get role and user ID from token

  if (role !== "staff_admin" && role !== "staff") {
    return res.status(403).json({ error: "Only Staff Admin and Staff can add suppliers." });
  }

  if (!name || !contact || !address) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const createdBy = userId; // Set created_by to the Staff Admin's ID (or Staff's ID)
  const createdAt = moment.tz("Asia/Bangkok").format(); // Get current time in UTC+7 (Asia/Bangkok)

  db.run(
    "INSERT INTO suppliers (name, contact, address, created_by, created_at) VALUES (?, ?, ?, ?, ?)",
    [name, contact, address, createdBy, createdAt],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      res.json({
        message: "Supplier added successfully!",
        id: this.lastID,
        name,
        contact,
        address,
        created_at: createdAt, // Send UTC+7 timestamp to the frontend
      });
    }
  );
};

// Update a supplier (Staff Admin and Staff only)
exports.updateSupplier = (req, res) => {
  const { name, contact, address } = req.body;
  const { id } = req.params;
  const { role, id: userId } = req.user;

  if (role !== "staff_admin" && role !== "staff") {
    return res.status(403).json({ error: "Only Staff Admin and Staff can update suppliers." });
  }

  if (!name || !contact || !address) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  let query = "UPDATE suppliers SET name = ?, contact = ?, address = ? WHERE id = ? ";
  const params = [name, contact, address, id];

  if (role === "staff_admin") {
    // For Staff Admin: Allow updating suppliers created by them or by their linked Staff
    query += "AND (suppliers.created_by = ? OR suppliers.created_by IN (SELECT id FROM users WHERE created_by = ?))";
    params.push(userId, userId);
  } else if (role === "staff") {
    // For Staff: Only allow updating their own suppliers
    query += "AND suppliers.created_by = ?";
    params.push(userId);
  }

  db.run(query, params, function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Supplier updated successfully!" });
  });
};

// Delete a supplier (Staff Admin and Staff only)
exports.deleteSupplier = (req, res) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  if (role !== "staff_admin" && role !== "staff") {
    return res.status(403).json({ error: "Only Staff Admin and Staff can delete suppliers." });
  }

  let query = "DELETE FROM suppliers WHERE id = ? ";
  const params = [id];

  if (role === "staff_admin") {
    // For Staff Admin: Allow deleting suppliers created by them or by their linked Staff
    query += "AND (suppliers.created_by = ? OR suppliers.created_by IN (SELECT id FROM users WHERE created_by = ?))";
    params.push(userId, userId);
  } else if (role === "staff") {
    // For Staff: Only allow deleting their own suppliers
    query += "AND suppliers.created_by = ?";
    params.push(userId);
  }

  db.run(query, params, function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Supplier deleted successfully!" });
  });
};