# 📌 Panduan Instalasi & Menjalankan Sistem POS

## 🔧 **Persyaratan Minimum**
Sebelum memulai, pastikan sistem Anda memiliki:
- **Node.js** (v14 atau lebih baru) - [Download Node.js](https://nodejs.org/)
- **NPM** (disertakan dengan Node.js)
- **SQLite3** (sudah terintegrasi dalam aplikasi)

---

## 📥 **1. Clone Repository**
Jika Anda belum memiliki kode sumber, clone repositori dari GitHub:
```sh
git clone https://github.com/username/repository.git
cd repository
```

---

## 📦 **2. Instal Dependensi**
Jalankan perintah berikut untuk menginstal semua paket yang dibutuhkan:
```sh
npm install
```

Jika terjadi error pada **pdfkit**, instal secara manual:
```sh
npm install pdfkit
```

---

## 🔧 **3. Konfigurasi Environment Variables**
Buat file `.env` di root proyek dan tambahkan variabel berikut:
```ini
PORT=5000
JWT_SECRET=myverysecretkey
```

---

## 🔥 **4. Jalankan Server**
Setelah semua dependensi terinstal, jalankan server dengan perintah berikut:
```sh
node server.js
```

Atau jika menggunakan **nodemon**:
```sh
npx nodemon server.js
```

Jika server berhasil berjalan, akan muncul pesan:
```sh
Server running on port 5000
```

---

## 🛠 **5. Menguji API**
Gunakan **Postman** atau **cURL** untuk menguji endpoint:

🔹 **Cek apakah server berjalan:**
```sh
curl -X GET http://localhost:5000/
```

🔹 **Menguji login:**
```sh
curl -X POST http://localhost:5000/users/login -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"
```

---

## 🛑 **6. Menghentikan Server**
Jika ingin menghentikan server, tekan:
```sh
CTRL + C
```

---

## 🚀 **Fitur Tambahan**
🔹 **Jalankan ulang server otomatis dengan nodemon:**
```sh
npm install -g nodemon
nodemon server.js
```

🔹 **Membersihkan cache & reinstall dependensi:**
```sh
rm -rf node_modules package-lock.json  # Linux/macOS
rd /s /q node_modules package-lock.json  # Windows CMD
npm install
```

---

## 🎯 **Kesimpulan**
✅ **Instalasi selesai!** Sekarang Anda bisa menjalankan dan menguji sistem POS ini. 🚀

