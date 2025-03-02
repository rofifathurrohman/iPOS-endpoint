const db = require("../config/database");

exports.getAllCustomers = (req, res) => {
  db.all("SELECT * FROM customers", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.addCustomer = (req, res) => {
  const { name, contact, address } = req.body;
  db.run(
    "INSERT INTO customers (name, contact, address) VALUES (?, ?, ?)",
    [name, contact, address],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, name, contact, address });
    }
  );
};

exports.updateCustomer = (req, res) => {
  const { name, contact, address } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE customers SET name = ?, contact = ?, address = ? WHERE id = ?",
    [name, contact, address, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Customer updated successfully" });
    }
  );
};

exports.deleteCustomer = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM customers WHERE id = ?", [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Customer deleted successfully" });
  });
};
