const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./pos.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Export database connection
module.exports = db;
