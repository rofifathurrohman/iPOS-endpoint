# Dokumentasi API POS

## Autentikasi Login
### Login (Admin / Kasir)
#### Contoh Akun:
- **Admin**: `admin@example.com` | **Password**: `password123`
- **Kasir**: `kasir@example.com` | **Password**: `password123`

```sh
curl -X POST http://localhost:5000/users/login -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"
```

## Manajemen Pengguna (Hanya Admin)
### Tambah Pengguna Baru
```sh
curl -X POST http://localhost:5000/users -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -d "{\"name\":\"Kasir Baru\",\"email\":\"kasir@example.com\",\"password\":\"password123\",\"role\":\"kasir\"}"
```

### Melihat Semua Pengguna
```sh
curl -X GET http://localhost:5000/users -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update Pengguna
```sh
curl -X PUT http://localhost:5000/users/2 -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -d "{\"name\":\"Kasir Update\",\"email\":\"kasir_update@example.com\",\"role\":\"kasir\"}"
```

### Hapus Pengguna
```sh
curl -X DELETE http://localhost:5000/users/2 -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

-------------------------------------------------------------

## Manajemen Supplier (Hanya Admin)
### Tambah Supplier
```sh
curl -X POST http://localhost:5000/suppliers -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -d "{\"name\":\"Supplier A\",\"contact\":\"08123456789\",\"address\":\"Jl. Raya No. 10\"}"
```

### Melihat Semua Supplier
```sh
curl -X GET http://localhost:5000/suppliers -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update Supplier
```sh
curl -X PUT http://localhost:5000/suppliers/1 -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -d "{\"name\":\"Supplier Update\",\"contact\":\"08123456789\",\"address\":\"Jl. Baru No. 10\"}"
```

### Hapus Supplier
```sh
curl -X DELETE http://localhost:5000/suppliers/1 -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

-------------------------------------------------------------

## Manajemen Produk (Hanya Admin)
### Tambah Produk
```sh
curl -X POST http://localhost:5000/products -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -d "{\"name\":\"Laptop Asus\",\"category_id\":1,\"unit\":\"pcs\",\"price\":12000000,\"stock\":5}"
```

### Melihat Semua Produk
```sh
curl -X GET http://localhost:5000/products -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update Produk
```sh
curl -X PUT http://localhost:5000/products/1 -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -d "{\"name\":\"Laptop HP\",\"category_id\":2,\"unit\":\"pcs\",\"price\":13000000,\"stock\":4}"
```

### Hapus Produk
```sh
curl -X DELETE http://localhost:5000/products/1 -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

-------------------------------------------------------------

## Manajemen Kategori Produk (Hanya Admin)
### Tambah Kategori
```sh
curl -X POST http://localhost:5000/categories -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -d "{\"name\":\"Elektronik\"}"
```

### Melihat Semua Kategori
```sh
curl -X GET http://localhost:5000/categories -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update Kategori
```sh
curl -X PUT http://localhost:5000/categories/1 -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -d "{\"name\":\"Elektronik Baru\"}"
```

### Hapus Kategori
```sh
curl -X DELETE http://localhost:5000/categories/1 -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

-------------------------------------------------------------

## Manajemen Transaksi (Admin & Kasir)
### Tambah Transaksi
```sh
curl -X POST http://localhost:5000/transactions -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"customer_id\":1,\"total_price\":20000,\"items\":[{\"product_id\":1,\"quantity\":2,\"price\":10000}]}"
```

### Melihat Semua Transaksi
```sh
curl -X GET http://localhost:5000/transactions -H "Authorization: Bearer YOUR_TOKEN"
```

### Batalkan Transaksi (Hanya Admin)
```sh
curl -X DELETE http://localhost:5000/transactions/1 -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

-------------------------------------------------------------

## Laporan (Admin & Kasir)
### Laporan Penjualan
```sh
curl -X GET http://localhost:5000/reports/sales -H "Authorization: Bearer YOUR_TOKEN"
```

### Laporan Stok (Hanya Admin)
```sh
curl -X GET http://localhost:5000/reports/stock -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Manajemen Retur Barang (Admin & Kasir)
### Tambah Retur Barang
```sh
curl -X POST http://localhost:5000/returns -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"transaction_id\":1,\"product_id\":2,\"quantity\":1}"
```

-------------------------------------------------------------

## Cetak Struk (Admin & Kasir)
### Generate Struk PDF
```sh
curl -X POST http://localhost:5000/receipt -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d "{\"transaction_id\":1,\"customer_name\":\"Budi\",\"total_price\":50000,\"items\":[{\"product_name\":\"Produk A\",\"quantity\":2,\"price\":25000}]}"
```

-------------------------------------------------------------

## Laporan Tambahan (Admin)
### Laporan Produk Terlaris
```sh
curl -X GET http://localhost:5000/reports/top-products -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Laporan Penjualan Bulanan
```sh
curl -X GET http://localhost:5000/reports/monthly-sales -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Laporan Stok Masuk
```sh
curl -X GET http://localhost:5000/reports/stock-in -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Laporan Stok Keluar
```sh
curl -X GET http://localhost:5000/reports/stock-out -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Laporan Penjualan Berdasarkan Rentang Tanggal
```sh
curl -X GET "http://localhost:5000/reports/sales/date-range?start_date=2024-01-01&end_date=2024-02-01" -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Laporan Penjualan Per Kategori
```sh
curl -X GET http://localhost:5000/reports/sales/category -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Laporan Stok Rendah (Produk Hampir Habis)
```sh
curl -X GET "http://localhost:5000/reports/stock/low?threshold=5" -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Laporan Keuntungan (Laba Rugi)
```sh
curl -X GET http://localhost:5000/reports/profit -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Ekspor Laporan ke CSV
```sh
curl -X GET http://localhost:5000/reports/export/csv -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

