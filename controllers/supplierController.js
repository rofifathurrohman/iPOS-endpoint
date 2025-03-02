const db = require("../config/database");

exports.getAllSuppliers = (req, res) => {
  db.all("SELECT * FROM suppliers", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.addSupplier = (req, res) => {
  const { name, contact, address } = req.body;
  db.run(
    "INSERT INTO suppliers (name, contact, address) VALUES (?, ?, ?)",
    [name, contact, address],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, name, contact, address });
    }
  );
};

exports.updateSupplier = (req, res) => {
  const { name, contact, address } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE suppliers SET name = ?, contact = ?, address = ? WHERE id = ?",
    [name, contact, address, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Supplier updated successfully" });
    }
  );
};

exports.deleteSupplier = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM suppliers WHERE id = ?", [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Supplier deleted successfully" });
  });
};
