PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    address TEXT
  , created_by INTEGER, created_at DATETIME);
INSERT INTO suppliers VALUES(1,'supplier12','081388373836','jl. cijawura',NULL,NULL);
INSERT INTO suppliers VALUES(3,'supplier1','081354','jl. cijawura',7,NULL);
INSERT INTO suppliers VALUES(6,'supplier22','123456123','jl. gempol',10,'2025-03-04 16:21:56');
INSERT INTO suppliers VALUES(7,'supplier3','1231321','asasas',10,'2025-03-04T23:48:27+07:00');
INSERT INTO suppliers VALUES(8,'asas','531231','3asas',11,'2025-03-05T00:00:01+07:00');
INSERT INTO suppliers VALUES(9,'asas','53123123','3asas',11,'2025-03-05T00:12:50+07:00');
INSERT INTO suppliers VALUES(10,'asdasd','asdasd','asdasd',11,'2025-03-05T00:18:33+07:00');
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    address TEXT
  );
CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER,
      unit TEXT NOT NULL,
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL, cost_price INTEGER DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    total_price REAL NOT NULL,
    transaction_date TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers (id)
  );
CREATE TABLE transaction_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  );
CREATE TABLE stock_in (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    date_added TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id)
  );
CREATE TABLE stock_out (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    date_removed TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id)
  );
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'kasir', 'staff_admin', 'staff')) NOT NULL,
    created_by INTEGER NULL
);
INSERT INTO users VALUES(3,'admin','admin@example.com','$2b$12$Q7qtyyEuSZNh8R09PZPn4OrxqEcxdrID6laIs9NxJZyG2YKAPdydC','admin',NULL);
INSERT INTO users VALUES(7,'staffadmin','staffadmin@example.com','$2b$12$b0JvVcu2SAfOyuGmhgYb5e4LYW5gzsjHb49JN3NfTtb25MftJLM4a','staff_admin',NULL);
INSERT INTO users VALUES(8,'kasir','kasir@example.com','$2b$12$ZGaxm0YP3Ft4u9Z..cQNHudgrtOzfBrnG5orf934jsMPsPjEIcvDe','kasir',7);
INSERT INTO users VALUES(9,'staff','staff@example.com','$2b$12$vXTWSrT9i84mNKMquffrRuao0eGdQ9Sx39dmRq2h/SEwEYq3eo9s2','staff',7);
INSERT INTO users VALUES(10,'staffadmin22','staffadmin22@example.com','$2b$12$aJaTy0ZxomHu/aKqBKP9Wu0yS18rzrYn3iHS8EwYI5EFgVELefLz2','staff_admin',NULL);
INSERT INTO users VALUES(11,'staffsupplier2','staffsupplier2@example.com','$2b$12$lEPFURH3aBjQoo04tvhdf.yh7k/WKy6vPCUXGDrsfLA9RNhUY8CSK','staff',10);
INSERT INTO sqlite_sequence VALUES('users',11);
INSERT INTO sqlite_sequence VALUES('suppliers',10);
COMMIT;
