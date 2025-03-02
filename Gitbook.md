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
curl -X POST http://localhost:5000/products -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -d "{\"name\":\"Produk A\",\"category\":\"Elektronik\",\"unit\":\"pcs\",\"price\":10000,\"stock\":50}"
```

### Melihat Semua Produk
```sh
curl -X GET http://localhost:5000/products -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update Produk
```sh
curl -X PUT http://localhost:5000/products/1 -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_ADMIN_TOKEN" -d "{\"name\":\"Produk Baru\",\"category\":\"Elektronik\",\"unit\":\"pcs\",\"price\":15000,\"stock\":40}"
```

### Hapus Produk
```sh
curl -X DELETE http://localhost:5000/products/1 -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
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