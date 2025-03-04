const db = require("../config/database");
const moment = require("moment-timezone");

// Get all suppliers (Staff Admin and their linked staff only)
exports.getAllSuppliers = (req, res) => {
  const { role, id: userId } = req.user;  // Get role and user ID from token

  let query = "SELECT id, name, contact, address, created_by, created_at FROM suppliers";
  const params = [];

  if (role === "staff_admin") {
    // Staff Admin can see their own suppliers and the ones linked to their staff
    query += " WHERE created_by = ? OR created_by IN (SELECT id FROM users WHERE created_by = ?)";
    params.push(userId, userId); // Fetch suppliers created by the Staff Admin or linked to them
  } else if (role === "staff") {
    // Staff can see suppliers created by their own Staff Admin or created by themselves
    query += " WHERE created_by = ? OR created_by IN (SELECT id FROM users WHERE created_by = ?)";
    params.push(userId, userId); // Fetch suppliers created by the staff's Staff Admin or by the staff themselves
  }

  // Execute the query with the appropriate parameters
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Retrieve all users (Staff Admins) and include their name
    db.all("SELECT id, name FROM users WHERE role = 'staff_admin'", [], (err, users) => {
      if (err) return res.status(500).json({ error: err.message });

      // Map through the suppliers and convert the created_by field to the Staff Admin's name
      const supplierDetails = rows.map(supplier => {
        const staffAdmin = users.find(user => user.id === supplier.created_by);
        return {
          ...supplier,
          created_by_name: staffAdmin ? staffAdmin.name : "N/A",  // Display the name of the Staff Admin who created the supplier
          created_at: moment(supplier.created_at).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss"),  // Convert to UTC+7 timezone
        };
      });

      res.json(supplierDetails);
    });
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

  db.run(
    "UPDATE suppliers SET name = ?, contact = ?, address = ? WHERE id = ? AND created_by = ?",
    [name, contact, address, id, userId],  // Ensure the user can only update their own suppliers
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Supplier updated successfully!" });
    }
  );
};

// Delete a supplier (Staff Admin and Staff only)
exports.deleteSupplier = (req, res) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  if (role !== "staff_admin" && role !== "staff") {
    return res.status(403).json({ error: "Only Staff Admin and Staff can delete suppliers." });
  }

  db.run(
    "DELETE FROM suppliers WHERE id = ? AND created_by = ?",
    [id, userId],  // Ensure the user can only delete their own suppliers
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Supplier deleted successfully!" });
    }
  );
};
