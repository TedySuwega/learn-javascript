# Modul Pembelajaran Backend Development untuk Pemula

Selamat datang di modul pembelajaran yang komprehensif ini! Panduan ini akan mengajarkan Anda cara memahami dan membangun aplikasi backend dengan menjelaskan setiap baris kode dalam aplikasi CV Management Backend. Di akhir modul ini, Anda akan memahami bagaimana aplikasi backend profesional bekerja.

**Prasyarat:** Tidak ada! Modul ini dirancang untuk orang yang belum pernah coding sama sekali.

---

## Daftar Isi

1. [Modul 1: Pengenalan Pemrograman](#modul-1-pengenalan-pemrograman)
2. [Modul 2: Memahami Struktur Proyek](#modul-2-memahami-struktur-proyek)
3. [Modul 3: Entry Point - Dimana Semuanya Dimulai](#modul-3-entry-point---dimana-semuanya-dimulai)
4. [Modul 4: Memahami Database](#modul-4-memahami-database)
5. [Modul 5: Repository Layer](#modul-5-repository-layer---berkomunikasi-dengan-database)
6. [Modul 6: Service Layer](#modul-6-service-layer---logika-bisnis)
7. [Modul 7: Controller Layer](#modul-7-controller-layer---menangani-request-http)
8. [Modul 8: Autentikasi dan Keamanan](#modul-8-autentikasi-dan-keamanan)
9. [Modul 9: Alur Request Lengkap](#modul-9-alur-request-lengkap)
10. [Modul 10: Latihan Praktik](#modul-10-latihan-praktik)
11. [Glosarium](#glosarium)

---

# Modul 1: Pengenalan Pemrograman

## Apa itu Pemrograman?

Pemrograman itu seperti menulis resep untuk komputer. Sama seperti resep yang memberitahu koki bahan apa yang digunakan dan langkah apa yang harus diikuti, program memberitahu komputer data apa yang harus dikerjakan dan operasi apa yang harus dilakukan.

**Analogi:** Bayangkan Anda sedang mengajari robot untuk membuat sandwich. Anda tidak bisa hanya berkata "buat sandwich" - Anda perlu memberikan instruksi spesifik:
1. Ambil dua lembar roti
2. Buka toples selai kacang
3. Gunakan pisau untuk mengoleskan selai pada satu lembar
4. Gabungkan kedua lembar roti

Pemrograman persis seperti ini - memecah tugas menjadi langkah-langkah kecil dan spesifik yang bisa diikuti komputer.

## Apa itu Backend?

Ketika Anda menggunakan website atau aplikasi, sebenarnya ada DUA bagian yang bekerja bersama:

### Frontend (Sisi Klien)
- Apa yang Anda LIHAT dan interaksikan
- Tombol, form, gambar, dan teks di layar Anda
- Berjalan di browser web atau di ponsel Anda
- Contoh: Form login yang Anda isi

### Backend (Sisi Server)
- Apa yang MEMPROSES data Anda di balik layar
- Menerima informasi Anda, memeriksa apakah benar, menyimpannya
- Berjalan di komputer remote yang disebut "server"
- Contoh: Memeriksa apakah username dan password Anda benar

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│    Frontend     │ ──────> │     Backend     │ ──────> │    Database     │
│  (Browser Anda) │ <────── │    (Server)     │ <────── │ (Penyimpanan)   │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
   Anda melihat ini        Ini memproses           Ini menyimpan
                           request Anda            data Anda
```

**Aplikasi ini (AppsBackend) adalah Backend** - ini adalah "otak" yang memproses request dan mengelola data.

## Cara Kerja Aplikasi Web: Model Client-Server

Ketika Anda mengklik tombol di website, inilah yang terjadi:

1. **Anda (Client):** Klik tombol "Login"
2. **Browser Anda:** Mengirim REQUEST ke server dengan email dan password Anda
3. **Backend Server:** Menerima request, memeriksa apakah password benar
4. **Database:** Server bertanya ke database "Apakah password ini benar?"
5. **Backend Server:** Mendapat jawaban dan mengirim RESPONSE balik
6. **Browser Anda:** Menampilkan "Login berhasil!" atau "Password salah"

Komunikasi bolak-balik ini terjadi menggunakan **HTTP** (HyperText Transfer Protocol) - bahasa dari web.

## Pengenalan JavaScript

JavaScript adalah bahasa pemrograman - salah satu yang paling populer di dunia! Bisa berjalan di browser web (frontend) dan di server (backend menggunakan Node.js).

### Konsep JavaScript Pertama Anda

#### 1. Variabel - Menyimpan Informasi

Variabel seperti kotak berlabel tempat Anda menyimpan informasi.

```javascript
// Membuat variabel untuk menyimpan berbagai tipe data
let namaUser = "John";        // Teks (disebut "string")
let umurUser = 25;            // Angka
let sudahLogin = true;        // Boolean (benar atau salah)

// 'let' artinya "Saya membuat kotak baru"
// 'namaUser' adalah label pada kotak
// "John" adalah isi di dalam kotak
```

**Analogi:** Bayangkan variabel seperti toples berlabel di dapur:
- Toples berlabel "Gula" berisi gula
- Toples berlabel "Garam" berisi garam
- Anda bisa mengubah isinya, tapi label membantu Anda menemukannya

#### 2. Tipe Data - Berbagai Jenis Informasi

```javascript
// String - Teks (selalu dalam tanda kutip)
let nama = "Alice";
let salam = 'Halo, Dunia!';

// Number - Nilai numerik (tanpa tanda kutip)
let umur = 30;
let harga = 19.99;

// Boolean - Benar atau Salah
let aktif = true;
let dihapus = false;

// Array - Daftar item (dalam kurung siku)
let buah = ["apel", "pisang", "jeruk"];
let angka = [1, 2, 3, 4, 5];

// Object - Kumpulan informasi terkait (dalam kurung kurawal)
let user = {
    nama: "John",
    umur: 25,
    email: "john@example.com"
};
```

#### 3. Function - Blok Kode yang Dapat Digunakan Ulang

Function seperti resep - mendefinisikan serangkaian langkah yang bisa Anda gunakan berulang kali.

```javascript
// Mendefinisikan function
function sapaUser(nama) {
    return "Halo, " + nama + "!";
}

// Menggunakan (memanggil) function
let pesan = sapaUser("Alice");  // pesan = "Halo, Alice!"
let pesan2 = sapaUser("Bob");   // pesan2 = "Halo, Bob!"
```

**Penjelasan:**
- `function` - Kata kunci yang mengatakan "Saya membuat function"
- `sapaUser` - Nama function (seperti nama resep)
- `(nama)` - "Bahan" yang dibutuhkan function (disebut parameter)
- `return` - Apa yang function berikan kembali ketika selesai

#### 4. Conditional Statements - Membuat Keputusan

```javascript
let umur = 18;

if (umur >= 18) {
    console.log("Anda bisa memilih!");
} else {
    console.log("Anda terlalu muda untuk memilih.");
}

// Ini memeriksa: Apakah umur lebih besar atau sama dengan 18?
// Jika YA: cetak "Anda bisa memilih!"
// Jika TIDAK: cetak "Anda terlalu muda untuk memilih."
```

## Pengenalan TypeScript

TypeScript adalah JavaScript dengan "kekuatan super". Kekuatan super utamanya adalah **type checking** - membantu menangkap error sebelum Anda menjalankan kode.

```typescript
// JavaScript - Tanpa tipe, bisa menyebabkan error
let namaUser = "John";
namaUser = 123;  // JavaScript mengizinkan ini (tapi mungkin menyebabkan bug!)

// TypeScript - Dengan tipe, menangkap error lebih awal
let namaUser: string = "John";
namaUser = 123;  // ERROR! TypeScript tidak mengizinkan ini
```

### Mengapa Menggunakan TypeScript?

1. **Menangkap error lebih awal** - Menemukan bug sebelum kode dijalankan
2. **Autocomplete lebih baik** - Editor Anda tahu apa yang bisa dilakukan dengan setiap variabel
3. **Self-documenting** - Tipe memberitahu Anda jenis data apa yang diharapkan

```typescript
// Function TypeScript dengan tipe
function hitungTotal(harga: number, jumlah: number): number {
    return harga * jumlah;
}

// ': number' setelah setiap parameter mengatakan "ini harus angka"
// ': number' di akhir mengatakan "function ini mengembalikan angka"

hitungTotal(10, 5);      // Berhasil! Mengembalikan 50
hitungTotal("10", 5);    // ERROR! "10" adalah string, bukan angka
```

## Async/Await - Menunggu Sesuatu Terjadi

Dalam aplikasi nyata, beberapa operasi membutuhkan waktu:
- Mengambil data dari database
- Mengirim email
- Mengunduh file

JavaScript menggunakan **async/await** untuk menangani operasi ini tanpa membekukan program.

```typescript
// Tanpa async/await - program akan membeku saat menunggu
// Dengan async/await - program bisa melakukan hal lain saat menunggu

async function ambilUserDariDatabase(email: string) {
    // 'await' artinya "tunggu di sini sampai selesai"
    const user = await database.findUser(email);
    return user;
}

// 'async' sebelum function artinya "function ini mungkin menunggu sesuatu"
// 'await' sebelum operasi artinya "jeda di sini sampai ini selesai"
```

**Analogi:** Bayangkan memesan kopi:
- **Tanpa async:** Anda memesan, lalu berdiri diam sampai kopi siap
- **Dengan async:** Anda memesan, dapat nomor antrian, dan duduk membaca sambil menunggu

## Ringkasan - Modul 1

Anda telah belajar:
- **Pemrograman** adalah memberikan komputer instruksi spesifik
- **Backend** adalah kode sisi server yang memproses data
- **Model Client-Server** adalah cara browser dan server berkomunikasi
- **Variabel** menyimpan informasi
- **Function** adalah blok kode yang dapat digunakan ulang
- **TypeScript** menambahkan keamanan tipe ke JavaScript
- **Async/await** menangani operasi yang membutuhkan waktu

### Latihan Mini

Coba pahami kode ini:

```typescript
async function login(email: string, password: string): Promise<boolean> {
    const user = await cariUserByEmail(email);
    
    if (user === null) {
        return false;  // User tidak ditemukan
    }
    
    if (user.password === password) {
        return true;   // Login berhasil
    }
    
    return false;      // Password salah
}
```

**Pertanyaan untuk dijawab:**
1. Apa dua parameter yang dibutuhkan function ini?
2. Apa yang dikembalikan function ini?
3. Apa yang terjadi jika user tidak ditemukan?

---

# Modul 2: Memahami Struktur Proyek

Setiap proyek profesional memiliki struktur tertentu - cara mengatur file dan folder. Mari kita jelajahi bagaimana aplikasi backend ini diorganisir.

## Struktur Folder

```
AppsBackend/
├── src/                          # Source code (kode sebenarnya)
│   ├── api/                      # Kode terkait API
│   │   ├── v1/                   # Versi 1 dari API
│   │   │   ├── controllers/      # Menangani request masuk
│   │   │   ├── services/         # Logika bisnis
│   │   │   └── repositories/     # Operasi database
│   │   └── v2/                   # Versi 2 dari API
│   │       ├── controllers/
│   │       ├── services/
│   │       └── repositories/
│   ├── config/                   # File konfigurasi
│   ├── middleware/               # Kode yang berjalan antara request dan response
│   ├── types/                    # Definisi tipe TypeScript
│   └── index.ts                  # Entry point - dimana app dimulai
├── db/
│   └── migrations/               # Perubahan struktur database
├── config/                       # Konfigurasi Sequelize
├── package.json                  # Dependencies dan script proyek
├── tsconfig.json                 # Konfigurasi TypeScript
└── docker-compose.yml            # Setup container database
```

**Analogi:** Bayangkan ini seperti perusahaan:
- `src/` - Gedung kantor utama
- `controllers/` - Resepsionis (menerima pengunjung/request)
- `services/` - Pekerja (melakukan pekerjaan sebenarnya)
- `repositories/` - Bagian arsip (menyimpan dan mengambil dokumen)
- `config/` - Kebijakan dan pengaturan perusahaan

## Memahami package.json - Buku Resep Proyek

File `package.json` seperti buku resep untuk proyek Anda. Ini memberitahu:
1. Apa nama proyek Anda
2. Kode lain (library) apa yang dibutuhkan proyek Anda
3. Perintah apa yang bisa Anda jalankan

Mari kita periksa baris per baris:

```json
{
  "name": "backendapps",
  "version": "1.0.0",
  "description": "Fastify TypeScript Backend with Repository Pattern",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "sequelize-cli db:migrate",
    "migrate:undo": "sequelize-cli db:migrate:undo"
  },
  "dependencies": {
    "@fastify/cors": "^8.0.0",
    "fastify": "^4.0.0",
    "sequelize": "^6.37.7",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0"
  }
}
```

### Penjelasan Baris per Baris

#### Informasi Dasar

```json
"name": "backendapps",
```
- Nama proyek Anda
- Digunakan saat mempublikasikan ke npm atau di log
- Harus huruf kecil, tanpa spasi

```json
"version": "1.0.0",
```
- Nomor versi proyek Anda
- Format: MAJOR.MINOR.PATCH
- 1.0.0 artinya: rilis major pertama, tidak ada update minor, tidak ada patch

```json
"description": "Fastify TypeScript Backend with Repository Pattern",
```
- Deskripsi yang bisa dibaca manusia tentang apa yang dilakukan proyek ini

```json
"type": "module",
```
- Memberitahu Node.js untuk menggunakan modul JavaScript modern (import/export)
- Tanpa ini, Anda harus menggunakan sintaks lama (require)

```json
"main": "dist/index.js",
```
- Entry point ketika proyek Anda dikompilasi
- `dist/` adalah tempat JavaScript yang sudah dikompilasi
- `src/` berisi TypeScript, `dist/` berisi JavaScript

#### Scripts - Perintah yang Bisa Anda Jalankan

```json
"scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "sequelize-cli db:migrate"
},
```

Scripts adalah shortcut untuk perintah. Anda menjalankannya dengan `npm run <nama-script>`:

| Perintah | Fungsinya |
|----------|-----------|
| `npm run dev` | Memulai server dalam mode development dengan auto-reload |
| `npm run build` | Mengkompilasi TypeScript ke JavaScript |
| `npm start` | Menjalankan versi production yang sudah dikompilasi |
| `npm run migrate` | Memperbarui struktur database |

**Penjelasan `"dev": "tsx watch src/index.ts"`:**
- `tsx` - Alat yang menjalankan TypeScript secara langsung
- `watch` - Otomatis restart ketika file berubah
- `src/index.ts` - File yang akan dijalankan

#### Dependencies - Library Eksternal

```json
"dependencies": {
    "@fastify/cors": "^8.0.0",
    "fastify": "^4.0.0",
    "sequelize": "^6.37.7",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.2"
},
```

Dependencies adalah kode orang lain yang digunakan proyek Anda. Bayangkan seperti bahan yang Anda beli daripada membuat sendiri.

| Package | Fungsinya |
|---------|-----------|
| `fastify` | Web framework - membantu membuat web server dengan mudah |
| `@fastify/cors` | Mengizinkan request dari website berbeda |
| `sequelize` | ORM - membantu berkomunikasi dengan database tanpa menulis SQL mentah |
| `bcrypt` | Mengenkripsi password dengan aman |
| `jsonwebtoken` | Membuat dan memverifikasi token login |

**Penjelasan simbol `^`:**
- `"^6.37.7"` artinya "versi 6.37.7 atau lebih tinggi, tapi kurang dari 7.0.0"
- Ini memungkinkan update otomatis yang tidak merusak kode Anda

#### DevDependencies - Alat Khusus Development

```json
"devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0"
}
```

Ini hanya dibutuhkan selama development, tidak di production:

| Package | Fungsinya |
|---------|-----------|
| `@types/node` | Definisi TypeScript untuk Node.js |
| `tsx` | Menjalankan file TypeScript secara langsung |

## Memahami npm - Node Package Manager

npm seperti app store untuk kode JavaScript. Ini memungkinkan Anda:
1. **Download** package yang dibuat developer lain
2. **Install** di proyek Anda
3. **Manage** versi dan update

### Perintah npm Umum

```bash
# Install semua dependencies yang terdaftar di package.json
npm install

# Tambahkan package baru ke proyek Anda
npm install fastify

# Tambahkan package khusus development
npm install --save-dev typescript

# Jalankan script dari package.json
npm run dev

# Mulai aplikasi (shortcut khusus)
npm start
```

### Apa yang Terjadi Ketika Anda Menjalankan `npm install`?

1. npm membaca `package.json`
2. Download semua dependencies yang terdaftar
3. Menempatkannya di folder bernama `node_modules/`
4. Membuat `package-lock.json` (mengunci versi pasti)

**Catatan:** `node_modules/` sangat besar dan tidak boleh dibagikan. Itulah mengapa kita menggunakan `.gitignore` untuk mengecualikannya.

## Memahami tsconfig.json - Pengaturan TypeScript

File ini mengkonfigurasi bagaimana TypeScript berperilaku di proyek Anda:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Penjelasan Pengaturan Penting

```json
"target": "ES2022",
```
- Versi JavaScript apa untuk dikompilasi
- ES2022 adalah versi modern dengan fitur terbaru

```json
"module": "NodeNext",
```
- Cara menangani import/export
- NodeNext bekerja dengan Node.js modern

```json
"strict": true,
```
- Mengaktifkan semua opsi pengecekan tipe yang ketat
- Menangkap lebih banyak bug potensial

```json
"outDir": "dist",
```
- Tempat menyimpan file JavaScript yang sudah dikompilasi

```json
"rootDir": "src",
```
- Tempat file source TypeScript Anda berada

```json
"paths": {
    "@/*": ["./src/*"]
}
```
- Path aliases - shortcut untuk import
- Daripada `import { User } from '../../../types/user'`
- Anda bisa menulis `import { User } from '@/types/user'`

## Pola Arsitektur: Repository-Service-Controller

Proyek ini mengikuti pola umum yang disebut "Layered Architecture":

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                   (Browser/Aplikasi Mobile)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       CONTROLLER                             │
│              Menerima request, mengirim response             │
│                   (auth.controller.ts)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVICE                               │
│          Berisi logika bisnis dan aturan                     │
│                   (user.service.ts)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      REPOSITORY                              │
│            Menangani operasi database                        │
│                 (user.repository.ts)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                               │
│                      (PostgreSQL)                            │
└─────────────────────────────────────────────────────────────┘
```

### Mengapa Pola Ini?

1. **Separation of Concerns** - Setiap layer punya satu tugas
2. **Testability** - Anda bisa menguji setiap layer secara independen
3. **Maintainability** - Mudah menemukan dan memperbaiki bug
4. **Reusability** - Service bisa digunakan oleh beberapa controller

**Analogi - Sebuah Restoran:**
- **Controller** = Pelayan (menerima pesanan, mengantarkan makanan)
- **Service** = Koki (menyiapkan makanan, tahu resepnya)
- **Repository** = Pekerja gudang (mengambil bahan dari penyimpanan)
- **Database** = Ruang penyimpanan (tempat bahan disimpan)

## Ringkasan - Modul 2

Anda telah belajar:
- **Struktur proyek** - Bagaimana file dan folder diorganisir
- **package.json** - Buku resep proyek dengan dependencies dan scripts
- **npm** - Package manager untuk menginstall library
- **tsconfig.json** - Konfigurasi TypeScript
- **Layered Architecture** - Pola Controller → Service → Repository

### Latihan Mini

Lihat `package.json` dan jawab:
1. Perintah apa yang akan Anda jalankan untuk memulai server dalam mode development?
2. Library apa yang digunakan untuk enkripsi password?
3. Apa perbedaan dependencies dan devDependencies?

---

# Modul 3: Entry Point - Dimana Semuanya Dimulai

Entry point adalah tempat aplikasi Anda mulai berjalan. Di proyek ini, itu adalah `src/index.ts`. Ini adalah file pertama yang dieksekusi ketika Anda menjalankan `npm run dev`.

Mari kita periksa setiap baris dari file ini.

## File Lengkap

Berikut seluruh file `src/index.ts`. Kita akan memecahnya bagian per bagian:

```typescript
import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { authController } from './api/v1/controllers/auth.controller.js'
// ... import lainnya

const app = Fastify({
  logger: true
})

// Register plugins
await app.register(cors, {
  origin: true
})

// Register Swagger
await app.register(swagger, { /* konfigurasi */ })

// Initialize database connection
try {
  await sequelize.authenticate()
  console.log('Database connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
  process.exit(1)
}

// Initialize dependencies
const userRepository = new UserRepository()
const userService = new UserService(userRepository)
// ... dependencies lainnya

// Register controllers
await authController(app, userService)
// ... controller lainnya

// Start server
try {
  await app.listen({ port: 3000, host: '0.0.0.0' })
  console.log('Server is running on http://localhost:3000')
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
```

Sekarang mari kita pahami setiap bagian secara detail.

---

## Bagian 1: Import Statements (Baris 1-25)

```typescript
import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
```

### Apa itu `import`?

`import` membawa kode dari file atau package lain. Bayangkan seperti meminjam alat dari kotak peralatan.

### Penjelasan Baris per Baris:

```typescript
import Fastify from 'fastify'
```
- **Apa:** Mengimpor web framework Fastify
- **Mengapa:** Fastify membantu kita membuat web server dengan mudah
- **`from 'fastify'`:** Nama package (diinstall via npm)
- **`Fastify`:** Nama yang akan kita gunakan untuk mereferensikannya

```typescript
import cors from '@fastify/cors'
```
- **Apa:** Mengimpor plugin CORS (Cross-Origin Resource Sharing)
- **Mengapa:** Mengizinkan API kita dipanggil dari website berbeda
- **Contoh:** Tanpa CORS, frontend di `example.com` tidak bisa memanggil API kita di `localhost:3000`

```typescript
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
```
- **Apa:** Mengimpor alat dokumentasi Swagger
- **Mengapa:** Otomatis membuat dokumentasi API
- **Hasil:** Anda bisa mengunjungi `/documentation` untuk melihat semua endpoint API

### Mengimpor Kode Kita Sendiri

```typescript
import { authController } from './api/v1/controllers/auth.controller.js'
import { UserService } from './api/v1/services/user.service.js'
import { UserRepository } from './api/v1/repositories/user.repository.js'
```

- **`{}`** - Kurung kurawal berarti kita mengimpor sesuatu yang spesifik (named export)
- **`'./api/v1/...'`** - Path ke file kita sendiri (`.` berarti direktori saat ini)
- **`.js`** - Meskipun kita menulis `.ts`, kita import sebagai `.js` (TypeScript dikompilasi ke JavaScript)

### Mengganti Nama Import

```typescript
import { authController as authControllerV2 } from './api/v2/controllers/auth.controller.js'
```

- **`as authControllerV2`** - Mengganti nama import untuk menghindari konflik
- Kita sudah punya `authController` dari V1, jadi kita ganti nama versi V2

---

## Bagian 2: Membuat Aplikasi (Baris 27-29)

```typescript
const app = Fastify({
  logger: true
})
```

### Penjelasan Baris per Baris:

```typescript
const app = Fastify({
```
- **`const`** - Membuat variabel konstan (tidak bisa diubah nilainya)
- **`app`** - Nama aplikasi server kita
- **`Fastify({...})`** - Memanggil function Fastify untuk membuat server

```typescript
  logger: true
```
- **Opsi konfigurasi** - Mengaktifkan logging
- **Logging** - Mencetak pesan tentang apa yang dilakukan server
- Contoh output: `{"level":30,"time":1234567890,"msg":"Server listening at http://0.0.0.0:3000"}`

```typescript
})
```
- Menutup objek konfigurasi dan pemanggilan function

---

## Bagian 3: Mendaftarkan Plugin (Baris 31-87)

```typescript
// Register plugins
await app.register(cors, {
  origin: true
})
```

### Apa itu Plugin?

Plugin menambahkan fitur ekstra ke Fastify. Bayangkan seperti add-on atau ekstensi.

### Penjelasan Baris per Baris:

```typescript
await app.register(cors, {
```
- **`await`** - Tunggu sampai ini selesai sebelum melanjutkan
- **`app.register()`** - Method untuk menambahkan plugin ke app kita
- **`cors`** - Plugin yang kita tambahkan

```typescript
  origin: true
```
- **Konfigurasi** - Mengizinkan request dari origin manapun (website manapun)
- Di production, Anda akan menentukan origin yang diizinkan secara spesifik untuk keamanan

### Dokumentasi Swagger

```typescript
await app.register(swagger, {
  swagger: {
    info: {
      title: 'CV Management Backend',
      description: 'API documentation for the CV Management Backend application',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Auth', description: 'Authentication related endpoints' },
      { name: 'User', description: 'User profile and dashboard endpoints' },
    ],
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }
})
```

### Penjelasan Konfigurasi Swagger:

```typescript
info: {
  title: 'CV Management Backend',        // Nama yang ditampilkan di docs
  description: '...',                    // Deskripsi di docs
  version: '1.0.0'                       // Versi API
},
```
- Informasi dasar tentang API Anda

```typescript
host: 'localhost:3000',                  // Dimana API berjalan
schemes: ['http'],                       // Gunakan HTTP (bukan HTTPS secara lokal)
consumes: ['application/json'],          // Kita menerima data JSON
produces: ['application/json'],          // Kita mengembalikan data JSON
```
- Detail teknis tentang API

---

## Bagian 4: Koneksi Database (Baris 89-96)

```typescript
// Initialize database connection
try {
  await sequelize.authenticate()
  console.log('Database connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
  process.exit(1)
}
```

### Memahami try/catch

Ini adalah **error handling** - mempersiapkan untuk hal-hal yang mungkin salah.

```typescript
try {
  // Kode yang mungkin gagal ada di sini
} catch (error) {
  // Apa yang harus dilakukan jika gagal
}
```

**Analogi:** Seperti mencoba membuka pintu:
- **try:** Mencoba membuka pintu
- **catch:** Jika pintu terkunci, lakukan sesuatu yang lain (ketuk, hubungi seseorang)

### Penjelasan Baris per Baris:

```typescript
try {
```
- Mulai blok "try" - kita akan mencoba sesuatu yang mungkin gagal

```typescript
  await sequelize.authenticate()
```
- **`sequelize`** - Alat koneksi database kita
- **`.authenticate()`** - Menguji apakah kita bisa terhubung ke database
- **`await`** - Tunggu database merespons

```typescript
  console.log('Database connection has been established successfully.')
```
- Jika berhasil, cetak pesan sukses ke console

```typescript
} catch (error) {
```
- Jika sesuatu di blok `try` gagal, lompat ke sini
- **`error`** - Berisi informasi tentang apa yang salah

```typescript
  console.error('Unable to connect to the database:', error)
```
- Cetak pesan error dengan detailnya

```typescript
  process.exit(1)
```
- **`process.exit(1)`** - Hentikan aplikasi
- **`1`** - Kode exit yang menunjukkan error (0 = sukses, 1+ = error)
- Kita tidak bisa berjalan tanpa database, jadi kita hentikan app

---

## Bagian 5: Dependency Injection (Baris 98-106)

```typescript
// Initialize dependencies
const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const forgotPasswordRepository = new ForgotPasswordRepository()
const forgotPasswordService = new ForgotPasswordService(userRepository, forgotPasswordRepository)
```

### Apa itu Dependency Injection?

Dependency Injection adalah istilah keren untuk "memberikan objek hal-hal yang mereka butuhkan untuk bekerja."

**Tanpa Dependency Injection:**
```typescript
class UserService {
  private repository = new UserRepository() // Membuat dependency sendiri
}
```

**Dengan Dependency Injection:**
```typescript
class UserService {
  constructor(private repository: UserRepository) {} // Menerima dependency dari luar
}
```

### Mengapa Menggunakan Dependency Injection?

1. **Testability** - Mudah menukar database asli dengan yang palsu saat testing
2. **Flexibility** - Mudah mengubah implementasi
3. **Clarity** - Jelas apa yang dibutuhkan setiap class

### Penjelasan Baris per Baris:

```typescript
const userRepository = new UserRepository()
```
- **`new`** - Membuat instance baru (salinan) dari class
- **`UserRepository()`** - Class repository
- Objek ini akan menangani semua operasi database user

```typescript
const userService = new UserService(userRepository)
```
- Membuat UserService baru
- **Memberikan `userRepository` ke dalamnya** - Service membutuhkan repository untuk bekerja
- Sekarang service bisa memanggil `userRepository.findByEmail()` dll.

---

## Bagian 6: Pendaftaran Route (Baris 108-119)

```typescript
// Register controllers
await authController(app, userService)
await userController(app)
await changePasswordController(app, userService)
await experienceController(app, experienceService)

// API V2
await authControllerV2(app)
await experienceControllerV2(app)
await testControllerV2(app)
```

### Apa itu Pendaftaran Route?

Route seperti alamat yang memberitahu server apa yang harus dilakukan untuk setiap URL.

- `/api/v1/auth/login` → Handle login
- `/api/v1/auth/signup` → Handle signup
- `/api/v1/users/profile` → Ambil profil user

### Penjelasan Baris per Baris:

```typescript
await authController(app, userService)
```
- **`authController()`** - Function yang menambahkan route autentikasi
- **`app`** - Server Fastify kita (route ditambahkan ke sini)
- **`userService`** - Service yang akan digunakan controller
- Ini menambahkan route seperti `/api/v1/auth/login`, `/api/v1/auth/signup`

---

## Bagian 7: Memulai Server (Baris 122-129)

```typescript
// Start server
try {
  await app.listen({ port: 3000, host: '0.0.0.0' })
  console.log('Server is running on http://localhost:3000')
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
```

### Penjelasan Baris per Baris:

```typescript
  await app.listen({ port: 3000, host: '0.0.0.0' })
```
- **`app.listen()`** - Mulai menerima koneksi
- **`port: 3000`** - Dengarkan di port 3000 (seperti nomor apartemen dalam alamat)
- **`host: '0.0.0.0'`** - Terima koneksi dari alamat IP manapun

**Apa itu Port?**
Bayangkan komputer Anda sebagai gedung apartemen:
- Alamat IP adalah alamat jalan
- Port adalah nomor apartemen
- Aplikasi berbeda menggunakan port berbeda (web: 80, app kita: 3000)

---

## Alur Lengkap

Ketika Anda menjalankan `npm run dev`, inilah yang terjadi:

```
1. Node.js menjalankan src/index.ts

2. Import semua dependencies
   └── Load Fastify, plugin, controller, service, repository

3. Buat Fastify app
   └── const app = Fastify({ logger: true })

4. Daftarkan plugin
   └── CORS, Swagger

5. Hubungkan ke database
   └── Jika gagal → keluar
   └── Jika sukses → lanjut

6. Buat instance service
   └── Repository → Service → Controller (rantai dependency)

7. Daftarkan route
   └── Semua endpoint API menjadi tersedia

8. Mulai mendengarkan
   └── Server siap di http://localhost:3000

9. Tunggu request
   └── Browser/Postman mengirim request → Server merespons
```

## Ringkasan - Modul 3

Anda telah belajar:
- **Import statements** - Membawa kode eksternal
- **Fastify** - Membuat web server
- **Plugin** - Menambahkan fitur (CORS, Swagger)
- **try/catch** - Menangani error
- **Dependency Injection** - Memberikan objek apa yang mereka butuhkan
- **Pendaftaran route** - Menyiapkan endpoint API
- **Listening** - Memulai server

### Latihan Mini

Lihat kode ini dan jawab:

```typescript
const app = Fastify({ logger: true })
await app.listen({ port: 4000, host: '0.0.0.0' })
```

1. Apa fungsi `logger: true`?
2. Port berapa yang akan server dengarkan?
3. URL apa yang akan Anda gunakan untuk mengakses server ini?

---

# Modul 4: Memahami Database

Database adalah tempat aplikasi menyimpan datanya secara permanen. Ketika Anda mendaftar di website, informasi Anda disimpan di database. Mari kita pahami bagaimana database bekerja dan bagaimana aplikasi ini terhubung dengannya.

## Apa itu Database?

Database seperti lemari arsip digital - cara terorganisir untuk menyimpan, mengambil, dan mengelola data.

**Analogi:** Bayangkan sebuah perpustakaan:
- Gedung perpustakaan = Database
- Setiap rak buku = Tabel
- Setiap buku = Baris/Record
- Properti buku (judul, penulis, tahun) = Kolom

## Jenis-jenis Database

### SQL Database (Relasional)
- Menyimpan data dalam tabel dengan baris dan kolom
- Tabel bisa dihubungkan (related) satu sama lain
- Contoh: PostgreSQL, MySQL, SQLite

### NoSQL Database
- Menyimpan data dalam format fleksibel (dokumen, key-value, dll.)
- Bagus untuk data tidak terstruktur
- Contoh: MongoDB, Redis

**Proyek ini menggunakan PostgreSQL** - database SQL yang powerful.

## Memahami Tabel, Baris, dan Kolom

Beginilah tampilan tabel `users`:

| id | full_name | email | password | email_verified | created_at |
|----|-----------|-------|----------|----------------|------------|
| abc-123 | John Doe | john@example.com | $2b$10... | true | 2024-01-15 |
| def-456 | Jane Smith | jane@example.com | $2b$10... | false | 2024-01-16 |
| ghi-789 | Bob Wilson | bob@example.com | $2b$10... | true | 2024-01-17 |

- **Tabel** = users (seluruh grid)
- **Kolom** = id, full_name, email, dll. (vertikal)
- **Baris** = Data setiap user (horizontal)
- **Primary Key** = id (identifier unik untuk setiap baris)

## Memahami SQL - Bahasa Database

SQL (Structured Query Language) adalah cara kita berbicara dengan database.

### Perintah SQL Dasar

#### SELECT - Mengambil Data
```sql
-- Ambil semua user
SELECT * FROM users;

-- Ambil kolom tertentu
SELECT full_name, email FROM users;

-- Ambil user dengan kondisi
SELECT * FROM users WHERE email_verified = true;

-- Ambil satu user berdasarkan email
SELECT * FROM users WHERE email = 'john@example.com';
```

#### INSERT - Menambah Data
```sql
-- Tambah user baru
INSERT INTO users (full_name, email, password, email_verified)
VALUES ('Alice Brown', 'alice@example.com', '$2b$10...', false);
```

#### UPDATE - Mengubah Data
```sql
-- Update status verifikasi email user
UPDATE users SET email_verified = true WHERE id = 'abc-123';

-- Update beberapa field
UPDATE users SET full_name = 'John Smith', email = 'johnsmith@example.com' 
WHERE id = 'abc-123';
```

#### DELETE - Menghapus Data
```sql
-- Hapus user tertentu
DELETE FROM users WHERE id = 'abc-123';

-- Hapus semua user yang belum terverifikasi (berbahaya!)
DELETE FROM users WHERE email_verified = false;
```

### Penjelasan SQL - Memahami Sintaks

```sql
SELECT * FROM users WHERE email = 'john@example.com';
```

| Bagian | Arti |
|--------|------|
| `SELECT` | "Saya ingin mengambil data" |
| `*` | "Semua kolom" |
| `FROM users` | "Dari tabel users" |
| `WHERE` | "Hanya baris yang cocok dengan kondisi ini" |
| `email = 'john@example.com'` | "Dimana email sama dengan nilai ini" |

## File Konfigurasi Database

Mari kita periksa `src/config/database.ts`:

```typescript
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port:  6432,
  username: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
  logging: false
})

export default sequelize
```

### Penjelasan Baris per Baris:

```typescript
import { Sequelize } from 'sequelize'
```
- **Apa:** Mengimpor Sequelize - ORM (Object-Relational Mapper)
- **ORM:** Alat yang memungkinkan Anda bekerja dengan database menggunakan JavaScript daripada SQL
- **Mengapa:** Membuat operasi database lebih mudah dan aman

```typescript
const sequelize = new Sequelize({
```
- **Apa:** Membuat instance koneksi Sequelize baru
- **Bayangkan seperti:** Membuka jalur telepon ke database

```typescript
  dialect: 'postgres',
```
- **Apa:** Memberitahu Sequelize kita menggunakan PostgreSQL
- **Opsi lain:** 'mysql', 'sqlite', 'mariadb'

```typescript
  host: 'localhost',
```
- **Apa:** Alamat dimana database berjalan
- **localhost:** Berarti "komputer ini" (127.0.0.1)
- **Di production:** Akan menjadi alamat server remote

```typescript
  port: 6432,
```
- **Apa:** Nomor port yang database dengarkan
- **Port default PostgreSQL:** 5432
- **Kita gunakan 6432:** Karena Docker memetakannya berbeda

```typescript
  username: 'myuser',
  password: 'mypassword',
```
- **Apa:** Kredensial untuk mengakses database
- **Catatan keamanan:** Di aplikasi nyata, ini harus dari environment variable!

```typescript
  database: 'mydatabase',
```
- **Apa:** Database mana yang akan dihubungkan
- **Satu server bisa punya beberapa database**

```typescript
  logging: false
```
- **Apa:** Menonaktifkan logging query SQL
- **Set ke `console.log`** untuk melihat setiap query SQL yang dieksekusi (berguna untuk debugging)

## Memahami Migration

Migration seperti version control untuk struktur database Anda. Memungkinkan Anda:
1. Membuat tabel
2. Memodifikasi tabel yang ada
3. Membatalkan perubahan jika terjadi kesalahan

### Mengapa Menggunakan Migration?

**Tanpa migration:**
- Anda secara manual menjalankan SQL untuk membuat tabel
- Sulit melacak perubahan apa yang dibuat
- Anggota tim mungkin punya struktur database berbeda

**Dengan migration:**
- Perubahan database dilacak dalam kode
- Semua orang menjalankan migration yang sama
- Bisa membatalkan perubahan (rollback)

### Memeriksa File Migration

Mari lihat `db/migrations/001-create-users-table.js`:

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // Aktifkan ekstensi uuid-ossp untuk function gen_random_uuid()
    await queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
    
    await queryInterface.sequelize.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        profile_image VARCHAR(255),
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS users;
    `);
  }
};
```

### Penjelasan Migration:

#### Struktur

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // Kode untuk MEMBUAT atau MEMODIFIKASI (maju)
  },

  async down(queryInterface, Sequelize) {
    // Kode untuk MEMBATALKAN perubahan (mundur)
  }
};
```

- **`up`** - Apa yang dilakukan saat menerapkan migration
- **`down`** - Apa yang dilakukan saat membatalkan migration

#### Function UP - Membuat Tabel

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

| Bagian | Arti |
|--------|------|
| `id UUID PRIMARY KEY` | Identifier unik, kunci utama |
| `DEFAULT gen_random_uuid()` | Otomatis generate ID unik |
| `VARCHAR(100)` | Teks hingga 100 karakter |
| `NOT NULL` | Field ini wajib diisi |
| `UNIQUE` | Tidak boleh ada duplikat |
| `BOOLEAN DEFAULT FALSE` | Nilai benar/salah, default salah |

### Menjalankan Migration

```bash
# Terapkan semua migration yang pending
npm run migrate

# Batalkan migration terakhir
npm run migrate:undo

# Batalkan semua migration
npm run migrate:undo:all
```

## Ringkasan - Modul 4

Anda telah belajar:
- **Apa itu database** - Penyimpanan terorganisir untuk data
- **Tabel, baris, kolom** - Struktur database relasional
- **Perintah SQL** - SELECT, INSERT, UPDATE, DELETE
- **Konfigurasi database** - Cara terhubung ke PostgreSQL
- **Migration** - Version control untuk struktur database

### Latihan Mini

Dengan SQL ini:
```sql
SELECT full_name, email FROM users WHERE email_verified = true;
```

1. Kolom apa yang akan dikembalikan?
2. Kondisi apa yang menyaring hasilnya?
3. Tulis SQL untuk mengambil semua experience untuk user dengan id 'abc-123'

---

# Modul 5: Repository Layer - Berkomunikasi dengan Database

Repository Layer bertanggung jawab untuk semua operasi database. Ini adalah satu-satunya layer yang berkomunikasi langsung dengan database, menyimpan semua query SQL di satu tempat.

## Apa itu Repository?

Repository adalah class yang menangani akses data. Menyediakan method seperti:
- `findAll()` - Ambil semua record
- `findById(id)` - Ambil satu record berdasarkan ID
- `create(data)` - Tambah record baru
- `update(id, data)` - Modifikasi record
- `delete(id)` - Hapus record

**Analogi:** Bayangkan Repository sebagai pustakawan:
- Anda meminta pustakawan mencari buku (memanggil method)
- Pustakawan tahu dimana menemukannya (SQL query)
- Pustakawan membawakan buku ke Anda (mengembalikan data)
- Anda tidak pernah masuk ke ruang penyimpanan sendiri

## Mengapa Menggunakan Repository Layer?

1. **Separation of Concerns** - Logika database tetap di satu tempat
2. **Testability** - Mudah di-mock untuk testing
3. **Maintainability** - Ubah implementasi database tanpa mempengaruhi kode lain
4. **Reusability** - Query yang sama bisa digunakan oleh beberapa service

## User Repository - Pembahasan Lengkap

Mari kita periksa `src/api/v2/repositories/user.repository.ts`:

```typescript
import { SignUp, User } from '@/types/user.js';
import sequelize from '../../../config/database.js'
import { QueryTypes } from 'sequelize'

export class UserRepository {
    async findAll() {
        const result = await sequelize.query(`
            SELECT * FROM users
        `, {
            type: QueryTypes.SELECT
        });
        return result 
    }

    async findByEmail(email: string) {
        const [result] = await sequelize.query(`
            SELECT * FROM users WHERE email = :email
        `, {
            type: QueryTypes.SELECT,
            replacements: { email }
        });

        return result as {
            id: string,
            email: string,
            password: string,
            full_name: string,
            email_verified: boolean
        };
    }

    async register(SignUpData: SignUp) {
        try {
            const [result] = await sequelize.query(`
                INSERT INTO users (full_name, email, password, email_verified)
                VALUES (:full_name, :email, :password, :email_verified)
                RETURNING *
            `, {
                replacements: {
                    full_name: SignUpData.full_name,
                    email: SignUpData.email,
                    password: SignUpData.password,
                    email_verified: false
                }
            });
            return {
                success: true,
                data: result[0] as { id: string },
                message: 'User registered successfully'
            }
        } catch (error) {
            console.error('Error during sign up:', error)
            return {
                success: false,
                message: 'Internal server error during registration'
            }
        }
    }
}
```

---

## Bagian 1: Import Statements

```typescript
import { SignUp, User } from '@/types/user.js';
import sequelize from '../../../config/database.js'
import { QueryTypes } from 'sequelize'
```

### Penjelasan:

```typescript
import sequelize from '../../../config/database.js'
```
- **Apa:** Mengimpor koneksi database kita
- **`../../../`:** Naik tiga direktori (dari repositories → v2 → api → src)
- **`config/database.js`:** Lalu masuk ke config dan ambil database.js

```typescript
import { QueryTypes } from 'sequelize'
```
- **Apa:** Mengimpor enum QueryTypes dari Sequelize
- **Digunakan untuk:** Memberitahu Sequelize jenis query apa yang kita jalankan

---

## Bagian 2: Method findAll

```typescript
async findAll() {
    const result = await sequelize.query(`
        SELECT * FROM users
    `, {
        type: QueryTypes.SELECT
    });
    return result 
}
```

### Penjelasan Baris per Baris:

```typescript
async findAll() {
```
- **`async`** - Function ini berisi operasi asynchronous (panggilan database)
- **`findAll`** - Nama method (mendeskripsikan apa yang dilakukannya)
- **`()`** - Tidak ada parameter yang dibutuhkan

```typescript
const result = await sequelize.query(`
    SELECT * FROM users
`, {
    type: QueryTypes.SELECT
});
```
- **`sequelize.query()`** - Eksekusi query SQL mentah
- **`SELECT * FROM users`** - Ambil semua kolom dari tabel users
- **`type: QueryTypes.SELECT`** - Memberitahu Sequelize ini query SELECT

---

## Bagian 3: Method findByEmail

```typescript
async findByEmail(email: string) {
    const [result] = await sequelize.query(`
        SELECT * FROM users WHERE email = :email
    `, {
        type: QueryTypes.SELECT,
        replacements: { email }
    });

    return result as {
        id: string,
        email: string,
        password: string,
        full_name: string,
        email_verified: boolean
    };
}
```

### Penjelasan:

```typescript
const [result] = await sequelize.query(`
```
- **`const [result]`** - Destructuring: ambil item pertama dari array
- **Mengapa?** SELECT mengembalikan array, tapi kita hanya ingin satu user

```typescript
    SELECT * FROM users WHERE email = :email
```
- **`:email`** - Placeholder (parameter)
- **Mengapa placeholder?** Untuk mencegah serangan SQL injection!

**Pencegahan SQL Injection:**
```typescript
// BERBAHAYA - Jangan pernah lakukan ini!
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Jika email = "'; DROP TABLE users; --" Anda dalam masalah!

// AMAN - Gunakan placeholder
const query = `SELECT * FROM users WHERE email = :email`;
// Nilai sebenarnya di-escape dengan benar
```

```typescript
replacements: { email }
```
- **`replacements: { email }`** - Isi placeholder :email
- Sequelize mengamankan nilai dengan aman

---

## Bagian 4: Method register

```typescript
async register(SignUpData: SignUp) {
    try {
        const [result] = await sequelize.query(`
            INSERT INTO users (full_name, email, password, email_verified)
            VALUES (:full_name, :email, :password, :email_verified)
            RETURNING *
        `, {
            replacements: {
                full_name: SignUpData.full_name,
                email: SignUpData.email,
                password: SignUpData.password,
                email_verified: false
            }
        });
        return {
            success: true,
            data: result[0] as { id: string },
            message: 'User registered successfully'
        }
    } catch (error) {
        console.error('Error during sign up:', error)
        return {
            success: false,
            message: 'Internal server error during registration'
        }
    }
}
```

### Penjelasan:

```typescript
INSERT INTO users (full_name, email, password, email_verified)
VALUES (:full_name, :email, :password, :email_verified)
RETURNING *
```
- **`INSERT INTO`** - Tambah baris baru
- **`RETURNING *`** - Fitur PostgreSQL: kembalikan baris yang dimasukkan
- Ini memberikan kita `id` yang auto-generated tanpa query lain

```typescript
} catch (error) {
    console.error('Error during sign up:', error)
    return {
        success: false,
        message: 'Internal server error during registration'
    }
}
```
- Jika terjadi kesalahan (seperti email duplikat), tangkap error
- Log untuk debugging
- Kembalikan respons error yang ramah

---

## Ringkasan Repository Pattern

| Method | Perintah SQL | Tujuan |
|--------|--------------|--------|
| `findAll()` | SELECT * | Ambil semua record |
| `findByEmail(email)` | SELECT WHERE | Cari satu record |
| `register(data)` | INSERT RETURNING | Buat dan kembalikan record baru |
| `updateEmailVerification()` | UPDATE WHERE | Modifikasi record |

## Ringkasan - Modul 5

Anda telah belajar:
- **Apa itu Repository** - Layer akses data
- **Sintaks class** - Mendefinisikan method dalam class
- **Query SQL** - SELECT, INSERT, UPDATE
- **Parameterized query** - Menggunakan placeholder untuk keamanan
- **Destructuring** - `const [first] = array`
- **Error handling** - try/catch dalam operasi database

### Latihan Mini

Tulis method repository untuk menghapus user berdasarkan ID:

```typescript
async deleteById(userId: string) {
    // Kode Anda di sini
    // Hint: Gunakan DELETE FROM ... WHERE ...
}
```

---

# Modul 6: Service Layer - Logika Bisnis

Service Layer berisi "logika bisnis" aplikasi Anda - aturan dan proses yang membuat aplikasi bekerja. Berada di antara Controller (yang menangani HTTP) dan Repository (yang menangani data).

## Apa itu Logika Bisnis?

Logika bisnis adalah kode yang mengimplementasikan aturan aplikasi Anda:

- **Aturan:** User harus memverifikasi email sebelum login
- **Aturan:** Password harus di-hash sebelum disimpan
- **Aturan:** Token verifikasi kedaluwarsa setelah 24 jam
- **Aturan:** User tidak bisa mendaftar dengan email yang sudah ada

Aturan-aturan ini tidak termasuk di layer database (Repository) atau layer HTTP (Controller). Mereka termasuk di Service.

## Mengapa Menggunakan Service Layer?

**Tanpa Service Layer:**
```typescript
// Controller menjadi berantakan dengan semua logika
app.post('/signup', async (request, reply) => {
    // Cek apakah email ada
    // Validasi kekuatan password
    // Hash password
    // Simpan ke database
    // Generate token verifikasi
    // Kirim email
    // Kembalikan response
    // 100+ baris kode di satu tempat!
});
```

**Dengan Service Layer:**
```typescript
// Controller bersih
app.post('/signup', async (request, reply) => {
    const result = await userService.SignUp(request.body);
    return reply.send(result);
});

// Semua logika terorganisir di service
```

## User Service - Pembahasan Lengkap

Mari kita periksa `src/api/v2/services/user.service.ts`:

```typescript
import { SignUp } from '@/types/user.js';
import { UserRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const userRepository = new UserRepository();

export class UserService {
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10
        return bcrypt.hash(password, saltRounds)
    }

    generateVerificationToken(): string {
        return crypto.randomBytes(32).toString('hex')
    }

    async SignUp(SignUpData: SignUp) {
        // Cek apakah email sudah terdaftar
        const isRegistered = await userRepository.findByEmail(SignUpData.email)
        if (isRegistered) {
            return {
                success: false,
                message: 'Email is already registered'
            }
        }

        // Hash Password
        const hashedPassword = await this.hashPassword(SignUpData.password)

        const register = await userRepository.register({
            ...SignUpData,
            password: hashedPassword
        });

        if(register.success) {
            const verificationToken = this.generateVerificationToken();
            
            const expiresAt = new Date()
            expiresAt.setHours(expiresAt.getHours() + 24)

            if(register.data?.id) {
                await userRepository.insertVerificationToken(
                    register.data?.id as string, 
                    verificationToken, 
                    expiresAt
                )
            }

            return {
                success: true,
                message: 'User registered successfully',
                data: {
                    ...register.data,
                    password: undefined
                }
            }
        }
        
        return {
            success: false,
            message: 'Internal server error during registration'
        }
    }

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email)
        if(!user) {
            return { success: false, message: 'User not found' }
        }

        if(!user.email_verified) {
            return { success: false, message: 'Email not verified' }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            return { success: false, message: 'Invalid password' }
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            full_name: user.full_name
        }, 'iniadalahsecretkey', {
            expiresIn: '24h'
        })

        return {
            success: true,
            message: 'Login successful',
            access_token: token
        }
    }
}
```

---

## Bagian 1: Method hashPassword

```typescript
async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}
```

### Apa itu Password Hashing?

**Hashing** mengubah password menjadi string acak yang tidak bisa dibalik:

```
Original:  "myPassword123"
Di-hash:   "$2b$10$N9qo8uLOickgx2ZMRZoMy.MQDMNkXCbUg8rOkqG6eQIWc9dgjQgX."
```

**Mengapa hash password?**
- Jika seseorang mencuri database Anda, mereka tidak bisa melihat password asli
- Bahkan Anda (developer) tidak seharusnya melihat password user

### Penjelasan:

```typescript
const saltRounds = 10
```
- **Salt** - Data acak yang ditambahkan ke password sebelum hashing
- **Rounds** - Berapa kali memproses (lebih tinggi = lebih aman, tapi lebih lambat)
- **10** adalah keseimbangan bagus antara keamanan dan performa

---

## Bagian 2: Method SignUp (Logika Registrasi Utama)

### Langkah 1: Cek Apakah Email Sudah Ada

```typescript
const isRegistered = await userRepository.findByEmail(SignUpData.email)
if (isRegistered) {
    return {
        success: false,
        message: 'Email is already registered'
    }
}
```

**Aturan Bisnis:** Setiap email hanya bisa mendaftar sekali.

### Langkah 2: Hash Password

```typescript
const hashedPassword = await this.hashPassword(SignUpData.password)
```

**Aturan Bisnis:** Jangan pernah menyimpan password teks biasa.

### Langkah 3: Simpan ke Database

```typescript
const register = await userRepository.register({
    ...SignUpData,
    password: hashedPassword
});
```

**Memahami Spread Operator (`...`):**

```typescript
// SignUpData = { full_name: "John", email: "john@example.com", password: "plain123" }

// Ini:
{
    ...SignUpData,
    password: hashedPassword
}

// Menjadi:
{
    full_name: "John",
    email: "john@example.com",
    password: "$2b$10$..." // Diganti dengan versi yang di-hash
}
```

### Langkah 4: Generate Token Verifikasi

```typescript
const verificationToken = this.generateVerificationToken();

const expiresAt = new Date()
expiresAt.setHours(expiresAt.getHours() + 24)
```

**Aturan Bisnis:** Token verifikasi email kedaluwarsa setelah 24 jam.

### Langkah 5: Kembalikan Sukses (Tanpa Password!)

```typescript
return {
    success: true,
    message: 'User registered successfully',
    data: {
        ...register.data,
        password: undefined
    }
}
```

**Keamanan:** Jangan pernah mengembalikan password, bahkan yang sudah di-hash!

---

## Bagian 3: Method login

```typescript
async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email)
    if(!user) {
        return { success: false, message: 'User not found' }
    }

    if(!user.email_verified) {
        return { success: false, message: 'Email not verified' }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid) {
        return { success: false, message: 'Invalid password' }
    }

    const token = jwt.sign({
        id: user.id,
        email: user.email,
        full_name: user.full_name
    }, 'iniadalahsecretkey', {
        expiresIn: '24h'
    })

    return {
        success: true,
        message: 'Login successful',
        access_token: token
    }
}
```

### Alur Login:

1. **Cari user** berdasarkan email
2. **Cek email terverifikasi** - harus true
3. **Bandingkan password** - gunakan bcrypt.compare
4. **Buat JWT token** - jika semua valid
5. **Kembalikan token** ke client

### Memahami bcrypt.compare():

```typescript
// bcrypt.compare(passwordPlain, passwordHash)
// Mengembalikan true jika cocok, false jika tidak

await bcrypt.compare("myPassword123", "$2b$10$N9qo8uLO...")  // true
await bcrypt.compare("wrongPassword", "$2b$10$N9qo8uLO...")  // false
```

### Memahami JWT:

```typescript
jwt.sign(
    payload,      // Data yang dimasukkan dalam token
    secretKey,    // Kunci rahasia untuk menandatangani token
    options       // Konfigurasi (seperti kedaluwarsa)
)
```

**Payload:** Informasi yang disimpan dalam token
```javascript
{
    id: "abc-123",
    email: "john@example.com",
    full_name: "John Doe"
}
```

---

## Ringkasan Service Layer

| Method | Tujuan | Aturan Bisnis |
|--------|--------|---------------|
| `hashPassword()` | Penyimpanan password aman | Gunakan bcrypt dengan salt |
| `generateVerificationToken()` | Buat token verifikasi email | 64 karakter hex acak |
| `SignUp()` | Daftarkan user baru | Cek duplikat, hash password, buat token |
| `login()` | Autentikasi user | Cek email terverifikasi, bandingkan password, buat JWT |

## Ringkasan - Modul 6

Anda telah belajar:
- **Apa itu logika bisnis** - Aturan dan proses aplikasi
- **Password hashing** - Menggunakan bcrypt untuk mengamankan password
- **Token generation** - Membuat token verifikasi acak
- **Alur registrasi** - Cek, hash, simpan, verifikasi
- **Alur login** - Cari, cek, bandingkan, token
- **JWT token** - Membuat token autentikasi
- **Spread operator** - `...object` untuk menyalin dan override

### Latihan Mini

Buat method untuk mengubah password user:

```typescript
async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // 1. Cari user berdasarkan ID
    // 2. Verifikasi password lama benar
    // 3. Hash password baru
    // 4. Update di database
    // 5. Kembalikan sukses atau error
}
```

---

# Modul 7: Controller Layer - Menangani Request HTTP

Controller Layer adalah tempat aplikasi Anda bertemu dunia luar. Controller menerima request HTTP dari client (browser, aplikasi mobile, dll.), memprosesnya, dan mengirim kembali response.

## Apa itu Controller?

Controller seperti resepsionis:
1. **Menerima** request yang masuk
2. **Memahami** apa yang diinginkan client
3. **Mendelegasikan** pekerjaan ke service yang sesuai
4. **Mengirim kembali** response

## Dasar-dasar HTTP

### HTTP Method (Verb)

| Method | Tujuan | Contoh |
|--------|--------|--------|
| GET | Mengambil data | Ambil profil user |
| POST | Membuat data | Daftarkan user baru |
| PUT | Update seluruh resource | Update semua info user |
| PATCH | Update sebagian | Update hanya email |
| DELETE | Menghapus data | Hapus akun |

### HTTP Status Code

| Kode | Arti | Kapan Digunakan |
|------|------|-----------------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource baru dibuat |
| 400 | Bad Request | Data yang dikirim tidak valid |
| 401 | Unauthorized | Belum login |
| 403 | Forbidden | Sudah login tapi tidak punya izin |
| 404 | Not Found | Resource tidak ada |
| 500 | Server Error | Ada yang rusak di server |

## Auth Controller - Pembahasan Lengkap

Mari kita periksa `src/api/v2/controllers/auth.controller.ts`:

```typescript
import { FastifyInstance } from 'fastify'
import { UserService } from '../services/user.service.js'
import { SignUp, SignUpSchema, LoginSchema } from '@/types/user.js';
import { authenticateToken } from '@/middleware/auth.middleware.v2.js';
import { AuthenticatedRequest, JWTPayload } from '@/middleware/auth.middleware.v2.js';

export async function authController(fastify: FastifyInstance) {
  const userService = new UserService();

  fastify.post('/api/v2/auth/signup', {
    schema: {
      tags: ['Auth'],
      summary: 'User signup',
      description: 'Register a new user account',
      body: SignUpSchema
    }
  }, async (request, reply) => {
    const signUpData = request.body as SignUp;
    const result = await userService.SignUp(signUpData);
    
    if(result.success) {
      return reply.status(200).send({ message: result.message, data: result.data });
    } else {
      return reply.status(400).send({ message: result.message });
    }
  })

  fastify.post('/api/v2/auth/login', {
    schema: {
      tags: ['Auth'],
      summary: 'User login',
      body: LoginSchema
    }
  }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    const result = await userService.login(email, password);
    
    if(result.success) {
      return reply.status(200).send({ message: result.message, access_token: result.access_token });
    } else {
      return reply.status(400).send({ message: result.message });
    }
  });

  fastify.get('/api/v2/auth/profile', {
    preHandler: authenticateToken,
    schema: {
      tags: ['Auth'],
      summary: 'User profile',
      security: [{ Bearer: [] }],
    }
  }, async (request: AuthenticatedRequest, reply) => {
    const user = request.user as JWTPayload;
    return reply.status(200).send({ message: 'Profile retrieved successfully', user: user });
  });
}
```

---

## Bagian 1: Pendaftaran Route

```typescript
fastify.post('/api/v2/auth/signup', {
```
- **`fastify.post()`** - Daftarkan route POST
- **`'/api/v2/auth/signup'`** - Path URL

**Struktur URL:**
```
/api/v2/auth/signup
  │   │   │     │
  │   │   │     └── Aksi: signup
  │   │   └── Kategori: auth (autentikasi)
  │   └── Versi: v2
  └── Prefix: api
```

## Bagian 2: Schema (Dokumentasi & Validasi)

```typescript
schema: {
  tags: ['Auth'],
  summary: 'User signup',
  description: 'Register a new user account',
  body: SignUpSchema
}
```

| Properti | Tujuan |
|----------|--------|
| `tags` | Mengelompokkan route ini di dokumentasi Swagger |
| `summary` | Deskripsi singkat |
| `description` | Deskripsi detail |
| `body` | Schema untuk memvalidasi body request |

**Jika validasi gagal, Fastify otomatis mengembalikan error 400!**

## Bagian 3: Handler Function

```typescript
async (request, reply) => {
    const signUpData = request.body as SignUp;
    const result = await userService.SignUp(signUpData);
    
    if(result.success) {
      return reply.status(200).send({ message: result.message, data: result.data });
    } else {
      return reply.status(400).send({ message: result.message });
    }
}
```

### Mengekstrak Data dari Request

```typescript
const signUpData = request.body as SignUp;
```
- **`request.body`** - Data JSON yang dikirim client
- **`as SignUp`** - Type casting (memberitahu TypeScript tipenya)

### Memanggil Service

```typescript
const result = await userService.SignUp(signUpData);
```
- Berikan data ke service
- Service menangani semua logika bisnis
- Mengembalikan objek hasil

### Mengirim Response

```typescript
if(result.success) {
  return reply.status(200).send({ message: result.message, data: result.data });
} else {
  return reply.status(400).send({ message: result.message });
}
```

**Memahami `reply`:**

```typescript
reply
  .status(200)      // Set kode status HTTP
  .send({           // Kirim response JSON
    message: "...",
    data: { ... }
  });
```

---

## Bagian 4: Route Profile (Terproteksi)

```typescript
fastify.get('/api/v2/auth/profile', {
  preHandler: authenticateToken,
  schema: {
    tags: ['Auth'],
    summary: 'User profile',
    security: [{ Bearer: [] }],
  }
}, async (request: AuthenticatedRequest, reply) => {
  const user = request.user as JWTPayload;
  return reply.status(200).send({ message: 'Profile retrieved successfully', user: user });
});
```

### Perbedaan Utama: Route Terproteksi

```typescript
preHandler: authenticateToken,
```
- **`preHandler`** - Kode yang berjalan SEBELUM handler utama
- **`authenticateToken`** - Middleware yang memeriksa token JWT valid
- Jika tidak ada token atau token tidak valid → Mengembalikan 401 (Unauthorized)
- Jika token valid → Lanjut ke handler

**Alur:**
```
1. Client mengirim request dengan "Authorization: Bearer <token>"
2. Middleware authenticateToken berjalan
   - Mengekstrak token
   - Memverifikasinya
   - Melampirkan info user ke request
3. Jika valid → Handler berjalan
4. Jika tidak valid → Error 401 dikembalikan
```

---

## Objek Request dan Response

### Objek Request

```typescript
request = {
  url: '/api/v2/auth/signup',          // Path URL
  method: 'POST',                       // Method HTTP
  headers: {                            // Header request
    'content-type': 'application/json',
    'authorization': 'Bearer eyJhbG...',
  },
  query: { token: 'abc123' },          // Parameter query (?key=value)
  params: { id: '123' },               // Parameter path (/users/:id)
  body: { email: '...', password: '...' }, // Body request (JSON)
  user: { id: '...', email: '...' }    // Ditambahkan oleh middleware auth
}
```

---

## Ringkasan - Modul 7

Anda telah belajar:
- **Apa itu Controller** - Handler request HTTP
- **HTTP method** - GET, POST, PUT, DELETE
- **HTTP status code** - 200, 400, 401, 404, 500
- **Pendaftaran route** - `fastify.post('/path', handler)`
- **Objek request** - body, query, params, headers
- **Objek reply** - status, send
- **Schema** - Validasi dan dokumentasi
- **Route terproteksi** - Menggunakan middleware preHandler

### Latihan Mini

Buat route DELETE untuk menghapus user:

```typescript
fastify.delete('/api/v2/users/:id', {
  preHandler: authenticateToken,
  schema: {
    tags: ['User'],
    summary: 'Delete user',
    security: [{ Bearer: [] }]
  }
}, async (request: AuthenticatedRequest, reply) => {
  // 1. Ambil ID user dari params
  // 2. Cek apakah user yang login cocok dengan ID
  // 3. Panggil userService.delete(id)
  // 4. Kembalikan response yang sesuai
});
```

---

# Modul 8: Autentikasi dan Keamanan

Autentikasi adalah cara aplikasi Anda mengetahui SIAPA yang membuat request. Keamanan adalah cara Anda melindungi aplikasi dan data user. Modul ini membahas keduanya.

## Autentikasi vs Otorisasi

Kedua istilah ini sering tertukar:

| Konsep | Pertanyaan | Contoh |
|--------|------------|--------|
| **Autentikasi** | "Siapa Anda?" | Login dengan email/password |
| **Otorisasi** | "Apa yang bisa Anda lakukan?" | Apakah user ini bisa menghapus post? |

**Analogi:**
- **Autentikasi:** Menunjukkan KTP di pintu masuk (membuktikan siapa Anda)
- **Otorisasi:** Penjaga memeriksa apakah Anda ada di daftar VIP (memeriksa apa yang bisa Anda lakukan)

## Cara Kerja Autentikasi di Aplikasi Ini

```
1. User login dengan email/password
   └── Server memverifikasi kredensial
   └── Server membuat token JWT
   └── Server mengirim token ke client

2. Client menyimpan token

3. Client membuat request yang terautentikasi
   └── Mengirim token di header Authorization
   └── Server memverifikasi token
   └── Server mengizinkan atau menolak akses
```

## Memahami JWT (JSON Web Tokens)

JWT seperti kartu identitas digital yang membuktikan siapa Anda.

### Struktur JWT

JWT memiliki tiga bagian yang dipisahkan titik:

```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImFiYyIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
|________________________|_______________________________________________|___________________________________|
        HEADER                                PAYLOAD                                  SIGNATURE
```

### Bagian 1: Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
- **`alg`** - Algoritma yang digunakan untuk menandatangani
- **`typ`** - Tipe token (JWT)

### Bagian 2: Payload

```json
{
  "id": "abc-123",
  "email": "john@example.com",
  "full_name": "John Doe",
  "iat": 1234567890,
  "exp": 1234654290
}
```
- **`id`, `email`, `full_name`** - Data user (claims)
- **`iat`** - Issued At (kapan token dibuat)
- **`exp`** - Expiration (kapan token kedaluwarsa)

**Penting:** Payload TIDAK dienkripsi! Siapa saja bisa mendekodenya. Jangan masukkan rahasia di dalamnya.

### Bagian 3: Signature

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```
- Dibuat menggunakan header, payload, dan SECRET KEY
- Jika ada yang mengubah payload, signature tidak akan cocok
- Hanya server yang tahu secret key

---

## Middleware Autentikasi - Pembahasan Lengkap

Mari kita periksa `src/middleware/auth.middleware.v2.ts`:

```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

interface JWTPayload {
  id: string
  email: string
  full_name: string
  iat: number
  exp: number
}

interface AuthenticatedRequest extends FastifyRequest {
  user?: JWTPayload
}

export async function authenticateToken(
    request: AuthenticatedRequest,
    reply: FastifyReply) {

    try {
        const authHeader = request.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            return reply.status(401).send({
                status: 'error',
                error: 'Access token is required'
            })
        }

        const decoded = jwt.verify(token, 'iniadalahsecretkey') as JWTPayload

        const currentTime = Math.floor(Date.now() / 1000)
        if (decoded.exp < currentTime) {
            return reply.status(401).send({
                status: 'error',
                error: 'Token has expired'
            })
        }

        request.user = decoded
    } catch (error) {
        return reply.status(401).send({
            status: 'error',
            error: 'Invalid token'
        })
    }
}
```

---

## Penjelasan Bagian per Bagian

### Apa itu Middleware?

Middleware adalah kode yang berjalan ANTARA menerima request dan menjalankan handler utama:

```
Request → Middleware → Handler → Response
              │
              └── Bisa berhenti di sini dan mengirim response (misal error 401)
```

### Mengekstrak Token

```typescript
const authHeader = request.headers.authorization
const token = authHeader && authHeader.split(' ')[1]
```

Header Authorization terlihat seperti:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

```typescript
// Nilai header
authHeader = "Bearer eyJhbGciOiJIUzI1NiIs..."

// Split berdasarkan spasi
authHeader.split(' ')
// Hasil: ["Bearer", "eyJhbGciOiJIUzI1NiIs..."]

// Ambil index 1 (token, bukan "Bearer")
authHeader.split(' ')[1]
// Hasil: "eyJhbGciOiJIUzI1NiIs..."
```

### Memverifikasi Token

```typescript
const decoded = jwt.verify(token, 'iniadalahsecretkey') as JWTPayload
```

**Apa yang dilakukan jwt.verify():**

1. **Mendekode** header dan payload base64
2. **Membuat signature** menggunakan secret key
3. **Membandingkan signature**
4. **Jika cocok** → Mengembalikan payload
5. **Jika tidak cocok** → Melempar error

### Memeriksa Kedaluwarsa

```typescript
const currentTime = Math.floor(Date.now() / 1000)
if (decoded.exp < currentTime) {
    return reply.status(401).send({
        status: 'error',
        error: 'Token has expired'
    })
}
```

- **`Date.now()`** - Waktu sekarang dalam milidetik
- **`/ 1000`** - Konversi ke detik (JWT menggunakan detik)
- **Jika kedaluwarsa di masa lalu** → Token sudah kedaluwarsa

### Melampirkan User ke Request

```typescript
request.user = decoded
```

- **Menyimpan payload yang didekode** di objek request
- Sekarang handler bisa mengakses: `request.user.id`, `request.user.email`, dll.

---

## Best Practice Keamanan

### 1. Simpan Secret Key dengan Aman

**Buruk:**
```typescript
jwt.verify(token, 'iniadalahsecretkey')  // Hardcoded
```

**Baik:**
```typescript
jwt.verify(token, process.env.JWT_SECRET)  // Dari environment
```

### 2. Gunakan Secret Key yang Kuat

**Buruk:**
```
JWT_SECRET=password123
```

**Baik:**
```
JWT_SECRET=a8f9d2c4e1b7a3f6d8c2e5b9a1f4d7c3e6b8a2f5d9c1e4b7a0f3d6c9e2b5a8f1
```

### 3. Set Kedaluwarsa yang Tepat

```typescript
// Terlalu lama - risiko keamanan jika token dicuri
expiresIn: '30d'

// Terlalu pendek - mengganggu user
expiresIn: '5m'

// Keseimbangan bagus
expiresIn: '24h'
```

### 4. Jangan Simpan Data Sensitif di JWT

**Buruk:**
```typescript
jwt.sign({
    id: user.id,
    password: user.password,     // JANGAN PERNAH!
    creditCard: user.creditCard  // JANGAN PERNAH!
}, secret)
```

**Baik:**
```typescript
jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role
}, secret)
```

---

## Alur Autentikasi Lengkap

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ALUR REGISTRASI                                  │
└─────────────────────────────────────────────────────────────────────────┘

1. User mengirim: email, password, nama
                    │
2. Server memvalidasi input
                    │
3. Server hash password dengan bcrypt
                    │
4. Server menyimpan user di database
                    │
5. Server generate token verifikasi
                    │
6. Server mengirim email verifikasi
                    │
7. User klik link di email
                    │
8. Server menandai email sebagai terverifikasi


┌─────────────────────────────────────────────────────────────────────────┐
│                            ALUR LOGIN                                    │
└─────────────────────────────────────────────────────────────────────────┘

1. User mengirim: email, password
                    │
2. Server mencari user berdasarkan email
                    │
3. Server membandingkan password dengan hash (bcrypt.compare)
                    │
4. Jika valid → Server membuat token JWT
   Jika tidak valid → Kembalikan error
                    │
5. Server mengirim token ke client
                    │
6. Client menyimpan token


┌─────────────────────────────────────────────────────────────────────────┐
│                   ALUR REQUEST TERAUTENTIKASI                            │
└─────────────────────────────────────────────────────────────────────────┘

1. Client mengirim request dengan header:
   Authorization: Bearer eyJhbGc...
                    │
2. Middleware mengekstrak token
                    │
3. Middleware memverifikasi signature
                    │
4. Middleware memeriksa kedaluwarsa
                    │
5. Jika valid → Lampirkan user ke request, lanjut ke handler
   Jika tidak valid → Kembalikan error 401
```

---

## Ringkasan - Modul 8

Anda telah belajar:
- **Autentikasi vs Otorisasi** - Siapa Anda vs apa yang bisa Anda lakukan
- **Struktur JWT** - Header, Payload, Signature
- **Cara verifikasi JWT bekerja** - Perbandingan signature
- **Middleware** - Kode yang berjalan sebelum handler
- **Best practice keamanan** - Secret key, password hashing

### Latihan Mini

Apa yang salah dengan middleware ini?

```typescript
async function checkAuth(request, reply) {
    const token = request.headers.authorization;
    const decoded = jwt.verify(token, 'secret123');
    request.user = decoded;
}
```

**Hint:** Ada setidaknya 4 masalah!

---

# Modul 9: Alur Request Lengkap

Sekarang setelah Anda memahami semua layer, mari kita lacak request lengkap dari awal sampai akhir. Ini akan menunjukkan bagaimana semuanya terhubung.

## Gambaran Arsitektur

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                          │
│                    (Browser, Aplikasi Mobile, Postman)                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FASTIFY SERVER                                       │
│                         (src/index.ts)                                       │
│  Menerima semua request HTTP masuk                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MIDDLEWARE                                          │
│  Berjalan SEBELUM controller (untuk route terproteksi)                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CONTROLLER                                          │
│  - Menerima request HTTP                                                     │
│  - Mengekstrak data (body, params, query)                                    │
│  - Memanggil method service                                                  │
│  - Mengirim response HTTP                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICE                                            │
│  - Berisi logika bisnis                                                      │
│  - Memvalidasi data                                                          │
│  - Hash password, generate token                                             │
│  - Memanggil method repository                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REPOSITORY                                           │
│  - Mengeksekusi query SQL                                                    │
│  - Mengembalikan data mentah dari database                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE                                             │
│                        (PostgreSQL)                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Contoh 1: Registrasi User (POST /api/v2/auth/signup)

### Langkah 1: Client Mengirim Request

```http
POST /api/v2/auth/signup HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
}
```

### Langkah 2: Controller Menangani Request

```typescript
// Controller menerima request
const signUpData = request.body as SignUp;
// signUpData = { full_name: "John Doe", email: "...", password: "..." }

// Panggil service
const result = await userService.SignUp(signUpData);
```

### Langkah 3: Service Memproses Logika Bisnis

```typescript
// 1. Cek apakah email sudah ada
const isRegistered = await userRepository.findByEmail(SignUpData.email);
// isRegistered = null (email tidak ditemukan)

// 2. Hash password
const hashedPassword = await this.hashPassword(SignUpData.password);
// hashedPassword = "$2b$10$xyz..."

// 3. Simpan ke database
const register = await userRepository.register({
    ...SignUpData,
    password: hashedPassword
});

// 4. Generate token verifikasi
const verificationToken = this.generateVerificationToken();
```

### Langkah 4: Repository Mengeksekusi SQL

```sql
-- SQL yang dieksekusi:
INSERT INTO users (full_name, email, password, email_verified)
VALUES ('John Doe', 'john@example.com', '$2b$10$xyz...', false)
RETURNING *;

-- Hasil:
-- id: 'abc-123-def-456'
-- full_name: 'John Doe'
-- email: 'john@example.com'
-- email_verified: false
```

### Langkah 5: Response Kembali ke Client

```
Database → Repository → Service → Controller → Client
   │           │            │           │          │
   │           │            │           │          └── Menerima response JSON
   │           │            │           └── Mengirim HTTP 200
   │           │            └── Mengembalikan { success: true, data: {...} }
   │           └── Mengembalikan baris yang dimasukkan
   └── Menyimpan data
```

### Langkah 6: Client Menerima Response

```json
{
    "message": "User registered successfully",
    "data": {
        "id": "abc-123-def-456",
        "full_name": "John Doe",
        "email": "john@example.com"
    }
}
```

---

## Contoh 2: Login User (POST /api/v2/auth/login)

### Alur Lengkap

```
┌──────────────────────────────────────────────────────────────────────┐
│ CLIENT                                                                │
│ POST /api/v2/auth/login                                              │
│ Body: { email: "john@example.com", password: "SecurePass123!" }      │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ SERVICE (user.service.ts)                                             │
│                                                                       │
│ 1. Cari user: userRepository.findByEmail(email)                       │
│    └── Ditemukan: { id, email, password: "$2b$10$...", email_verified}│
│                                                                       │
│ 2. Cek email terverifikasi: user.email_verified === true? ✓           │
│                                                                       │
│ 3. Bandingkan password: bcrypt.compare(password, user.password)       │
│    └── Mengembalikan: true (password cocok)                           │
│                                                                       │
│ 4. Generate JWT: jwt.sign({ id, email, full_name }, secret)           │
│    └── Mengembalikan: "eyJhbGciOiJIUzI1NiIs..."                      │
│                                                                       │
│ 5. Kembalikan: { success: true, access_token: "eyJ..." }              │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│ RESPONSE KE CLIENT                                                    │
│ {                                                                     │
│     "message": "Login successful",                                    │
│     "access_token": "eyJhbGciOiJIUzI1NiIs..."                        │
│ }                                                                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Contoh 3: Ambil Profile (Route Terproteksi)

### Alur Request Terproteksi Lengkap

```
┌─────────────────────────────────────────────────────────────────────────┐
│ CLIENT: GET /api/v2/auth/profile                                         │
│ Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ MIDDLEWARE: authenticateToken                                            │
│                                                                          │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Token ada?                                                           │ │
│ │ ├── TIDAK → Kembalikan 401: "Access token is required"              │ │
│ │ └── YA    → Lanjut                                                   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                                    ▼                                     │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Token valid? (signature cocok)                                       │ │
│ │ ├── TIDAK → Kembalikan 401: "Invalid token"                         │ │
│ │ └── YA    → Lanjut                                                   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                    │                                     │
│                                    ▼                                     │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Token kedaluwarsa?                                                   │ │
│ │ ├── YA    → Kembalikan 401: "Token has expired"                     │ │
│ │ └── TIDAK → Lampirkan user ke request, lanjut ke controller         │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ CONTROLLER                                                               │
│ const user = request.user;  // { id, email, full_name }                  │
│ return reply.send({ user });                                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ RESPONSE                                                                 │
│ {                                                                        │
│     "message": "Profile retrieved successfully",                         │
│     "user": {                                                            │
│         "id": "abc-123",                                                 │
│         "email": "john@example.com",                                     │
│         "full_name": "John Doe"                                          │
│     }                                                                    │
│ }                                                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Transformasi Data Melalui Layer

Mari lihat bagaimana data berubah saat melewati setiap layer:

### Alur Data Registrasi

```
INPUT CLIENT:
{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"      ← Password teks biasa
}
        │
        ▼
CONTROLLER (ekstrak data):
signUpData = {
    full_name: "John Doe",
    email: "john@example.com",
    password: "SecurePass123!"        ← Masih teks biasa
}
        │
        ▼
SERVICE (transformasi data):
{
    full_name: "John Doe",
    email: "john@example.com",
    password: "$2b$10$N9qo8uLO..."     ← Sekarang di-hash!
}
        │
        ▼
REPOSITORY (kirim ke database):
INSERT INTO users ...
        │
        ▼
SERVICE (bersihkan response):
{
    id: "abc-123",
    full_name: "John Doe",
    email: "john@example.com",
    password: undefined                ← Password dihapus!
}
        │
        ▼
RESPONSE KE CLIENT:
{
    "id": "abc-123",
    "full_name": "John Doe",
    "email": "john@example.com"        ← Tidak ada password di response
}
```

---

## Ringkasan - Modul 9

Anda telah belajar:
- **Cara layer terhubung** - Controller → Service → Repository → Database
- **Alur request lengkap** - Registrasi, Login, Route terproteksi
- **Eksekusi middleware** - Berjalan sebelum controller untuk route terproteksi
- **Transformasi data** - Bagaimana data berubah melalui setiap layer
- **Alur error handling** - Bagaimana error menyebar kembali ke client

### Poin Penting

1. **Setiap layer punya satu tugas:**
   - Controller: Handle HTTP
   - Service: Logika bisnis
   - Repository: Query database

2. **Data mengalir turun, lalu naik kembali:**
   - Turun: Request → Controller → Service → Repository → Database
   - Naik: Database → Repository → Service → Controller → Response

3. **Middleware adalah penjaga gerbang:**
   - Route terproteksi memerlukan persetujuan middleware
   - Jika middleware mengembalikan response, controller tidak pernah berjalan

---

# Modul 10: Latihan Praktik

Sekarang waktunya berlatih! Latihan-latihan ini akan membantu Anda memahami kode lebih baik dengan benar-benar bekerja dengannya.

## Latihan 1: Baca dan Lacak

**Tujuan:** Ikuti request melalui semua layer secara manual.

### Tugas

Lacak apa yang terjadi ketika user mencoba memverifikasi email mereka. Mulai dengan request ini:

```http
GET /api/v2/auth/verify?token=a7b8c9d0e1f2a3b4c5d6e7f8
Host: localhost:3000
```

### Pertanyaan untuk Dijawab

1. Method controller mana yang menangani request ini?
2. Data apa yang diekstrak dari request?
3. Method service mana yang dipanggil?
4. Method repository mana yang dipanggil?
5. Query SQL apa yang dieksekusi?
6. Apa response yang mungkin?

### Solusi

<details>
<summary>Klik untuk melihat solusi</summary>

1. **Controller:** `auth.controller.ts` - route `GET /api/v2/auth/verify`

2. **Data yang diekstrak:**
   ```typescript
   const { token } = request.query as { token: string };
   // token = "a7b8c9d0e1f2a3b4c5d6e7f8"
   ```

3. **Method service:** `userService.verifyEmail(token)`

4. **Method repository:**
   - `userRepository.findVerificationToken(token)`
   - Jika ditemukan: `userRepository.updateEmailVerification(user_id)`

5. **Query SQL:**
   ```sql
   SELECT * FROM email_verification_tokens 
   WHERE token = 'a7b8c9d0e1f2a3b4c5d6e7f8' 
   AND expires_at > CURRENT_TIMESTAMP;
   
   UPDATE users SET email_verified = true WHERE id = 'user-id';
   ```

6. **Response yang mungkin:**
   - Sukses (200): `{ message: 'Email verified successfully' }`
   - Error (400): `{ message: 'Invalid or expired verification token' }`

</details>

---

## Latihan 2: Tambah Field Baru

**Tujuan:** Tambahkan field `phone_number` ke registrasi user.

### Tugas

Modifikasi kode untuk memungkinkan user memberikan nomor telepon secara opsional saat registrasi.

### Langkah-langkah

1. **Update database** (buat migration):
   ```sql
   ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
   ```

2. **Update definisi tipe** (`src/types/user.ts`):
   ```typescript
   export interface SignUp {
       full_name: string;
       email: string;
       password: string;
       phone_number?: string;  // Tambahkan ini (? artinya opsional)
   }
   ```

3. **Update repository** (`user.repository.ts`):
   ```typescript
   async register(SignUpData: SignUp) {
       const [result] = await sequelize.query(`
           INSERT INTO users (full_name, email, password, phone_number, email_verified)
           VALUES (:full_name, :email, :password, :phone_number, :email_verified)
           RETURNING *
       `, {
           replacements: {
               full_name: SignUpData.full_name,
               email: SignUpData.email,
               password: SignUpData.password,
               phone_number: SignUpData.phone_number || null,  // Tambahkan ini
               email_verified: false
           }
       });
   }
   ```

---

## Latihan 3: Buat Endpoint Baru

**Tujuan:** Buat endpoint untuk update profil user.

### Tugas

Buat endpoint `PATCH /api/v2/users/profile` yang memungkinkan user terautentikasi mengupdate `full_name` dan `profile_image` mereka.

### Persyaratan

1. Harus route terproteksi (memerlukan autentikasi)
2. Hanya bisa mengupdate profil sendiri
3. Kembalikan data user yang diupdate

### Kerangka Kode

```typescript
// user.repository.ts
async updateProfile(userId: string, data: { full_name?: string; profile_image?: string }) {
    // Query SQL UPDATE Anda di sini
}

// user.service.ts
async updateProfile(userId: string, data: { full_name?: string; profile_image?: string }) {
    // Panggil repository
    // Kembalikan hasil
}

// controller
fastify.patch('/api/v2/users/profile', {
    preHandler: authenticateToken,
    schema: {
        tags: ['User'],
        summary: 'Update user profile',
        security: [{ Bearer: [] }]
    }
}, async (request: AuthenticatedRequest, reply) => {
    // Ambil ID user dari request.user
    // Ambil data update dari request.body
    // Panggil service
    // Kembalikan response
});
```

---

## Latihan 4: Debug Kode Ini

**Tujuan:** Temukan dan perbaiki bug-nya.

### Tugas

Kode berikut memiliki beberapa bug. Temukan semuanya!

```typescript
// auth.controller.ts
fastify.post('/api/v2/auth/signup' {
    schema: {
        body: SignUpSchema
    }
}, async (request, reply) {
    const signUpData = request.body;
    const result = userService.SignUp(signUpData);
    
    if(result.success) {
        return reply.send({ message: result.message, data: result.data });
    } else {
        return reply.send({ message: result.message });
    }
})
```

### Solusi

<details>
<summary>Klik untuk melihat solusi</summary>

**Bug 1:** Koma hilang setelah path route
```typescript
// Salah:
fastify.post('/api/v2/auth/signup' {
// Benar:
fastify.post('/api/v2/auth/signup', {
```

**Bug 2:** Arrow hilang di handler function
```typescript
// Salah:
async (request, reply) {
// Benar:
async (request, reply) => {
```

**Bug 3:** await hilang sebelum pemanggilan service
```typescript
// Salah:
const result = userService.SignUp(signUpData);
// Benar:
const result = await userService.SignUp(signUpData);
```

**Bug 4:** Kode status hilang untuk response error
```typescript
// Salah:
return reply.send({ message: result.message });
// Benar:
return reply.status(400).send({ message: result.message });
```

**Bug 5:** Type casting hilang
```typescript
// Salah:
const signUpData = request.body;
// Lebih baik:
const signUpData = request.body as SignUp;
```

</details>

---

## Latihan 5: Review Keamanan

**Tujuan:** Identifikasi masalah keamanan.

### Tugas

Review kode ini dan identifikasi masalah keamanan:

```typescript
// Contoh buruk - temukan masalahnya!

const sequelize = new Sequelize({
    host: 'localhost',
    password: 'admin123',
    database: 'production_db'
});

async function login(email: string, password: string) {
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const user = await sequelize.query(query);
    
    if (user.password === password) {
        const token = jwt.sign({ id: user.id }, 'secret');
        return { token };
    }
}

fastify.get('/user/:id', async (request, reply) => {
    const { id } = request.params;
    const query = `SELECT * FROM users WHERE id = '${id}'`;
    const user = await sequelize.query(query);
    return reply.send(user);
});
```

### Solusi

<details>
<summary>Klik untuk melihat solusi</summary>

**Masalah 1: Password database hardcoded**
```typescript
// Salah:
password: 'admin123',
// Seharusnya:
password: process.env.DB_PASSWORD,
```

**Masalah 2: Kerentanan SQL Injection (dua kali!)**
```typescript
// Salah:
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Seharusnya:
const query = `SELECT * FROM users WHERE email = :email`;
// Dengan: replacements: { email }
```

**Masalah 3: Membandingkan password teks biasa**
```typescript
// Salah:
if (user.password === password)
// Seharusnya:
const isValid = await bcrypt.compare(password, user.password);
if (isValid)
```

**Masalah 4: Secret JWT lemah**
```typescript
// Salah:
jwt.sign({ id: user.id }, 'secret');
// Seharusnya:
jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
```

**Masalah 5: Tidak ada autentikasi di endpoint user**
```typescript
// Salah:
fastify.get('/user/:id', async (request, reply) => {
// Seharusnya:
fastify.get('/user/:id', { preHandler: authenticateToken }, async (request, reply) => {
```

**Masalah 6: Mengembalikan semua data user termasuk password**
```typescript
// Salah:
return reply.send(user);
// Seharusnya:
return reply.send({ ...user, password: undefined });
```

</details>

---

# Glosarium

Referensi istilah pemrograman yang digunakan dalam modul ini.

## A

**API (Application Programming Interface)**
Sekumpulan aturan yang memungkinkan program software berbeda berkomunikasi satu sama lain.

**Async/Await**
Sintaks JavaScript untuk menangani operasi asynchronous. `async` menandai function sebagai asynchronous, `await` menjeda eksekusi sampai Promise resolve.

**Autentikasi**
Proses memverifikasi siapa user itu (misal: login dengan email/password).

**Otorisasi**
Proses memverifikasi apa yang bisa dilakukan user (misal: apakah user ini bisa menghapus post?).

## B

**Backend**
Bagian sisi server dari aplikasi yang memproses data dan logika bisnis.

**bcrypt**
Library untuk hashing password dengan aman.

**Body (Request Body)**
Data yang dikirim dengan request HTTP, biasanya dalam format JSON untuk request POST/PUT.

## C

**Class**
Blueprint untuk membuat objek dengan properti dan method.

**Controller**
Layer yang menangani request dan response HTTP.

**CORS (Cross-Origin Resource Sharing)**
Fitur keamanan yang mengontrol website mana yang bisa mengakses API Anda.

**CRUD**
Create, Read, Update, Delete - empat operasi database dasar.

## D

**Database**
Penyimpanan terorganisir untuk data aplikasi.

**Dependency**
Kode eksternal (library/package) yang digunakan proyek Anda.

**Dependency Injection**
Pola dimana objek menerima dependency mereka dari luar daripada membuat sendiri secara internal.

**Destructuring**
Sintaks JavaScript untuk mengekstrak nilai dari objek atau array: `const { nama } = user;`

## E

**Endpoint**
Path URL spesifik yang menerima request HTTP.

**Environment Variables**
Nilai konfigurasi yang disimpan di luar kode Anda (misal: password, API key).

**Export**
Membuat kode tersedia untuk file lain: `export function myFunction() {}`

## F

**Fastify**
Framework web untuk Node.js, mirip Express tapi lebih cepat.

**Frontend**
Bagian sisi client dari aplikasi yang diinteraksikan user.

**Function**
Blok kode yang dapat digunakan ulang yang melakukan tugas tertentu.

## H

**Hash/Hashing**
Mengonversi data menjadi string panjang tetap yang tidak bisa dibalik.

**Header (HTTP Header)**
Metadata yang dikirim dengan request/response HTTP (misal: Content-Type, Authorization).

**HTTP (HyperText Transfer Protocol)**
Protokol yang digunakan untuk komunikasi di web.

## I

**Import**
Membawa kode dari file atau package lain: `import { function } from 'package';`

**Interface (TypeScript)**
Definisi bentuk/struktur objek.

## J

**JSON (JavaScript Object Notation)**
Format teks untuk menyimpan dan bertukar data.

**JWT (JSON Web Token)**
Format token aman yang digunakan untuk autentikasi.

## M

**Middleware**
Kode yang berjalan antara menerima request dan mengirim response.

**Migration**
File yang mendefinisikan perubahan pada struktur database.

**Module**
File yang berisi kode yang dapat digunakan ulang.

## N

**Node.js**
Runtime yang memungkinkan JavaScript berjalan di server.

**npm (Node Package Manager)**
Alat untuk menginstall dan mengelola package JavaScript.

## O

**ORM (Object-Relational Mapping)**
Alat yang memungkinkan Anda berinteraksi dengan database menggunakan objek bahasa pemrograman daripada SQL.

## P

**Package**
Bundel kode yang dapat digunakan ulang, biasanya diinstall via npm.

**Parameter**
Nilai yang diberikan ke function: `function sapa(nama) {}` - `nama` adalah parameter.

**Payload**
Data yang terkandung dalam token JWT atau body request HTTP.

**Plugin**
Add-on yang memperluas fungsionalitas framework.

**Port**
Angka yang mengidentifikasi proses tertentu di komputer (misal: 3000).

**POST**
Method HTTP untuk membuat/mengirim data.

**Primary Key**
Identifier unik untuk setiap baris dalam tabel database.

**Promise**
Objek yang mewakili nilai masa depan (hasil akhir dari operasi async).

## Q

**Query**
Request untuk data dari database.

**Query Parameters**
Pasangan key-value di URL setelah `?`: `/search?term=hello&page=1`

## R

**Repository**
Layer yang menangani operasi database.

**Request**
Pesan HTTP yang dikirim dari client ke server.

**Response**
Pesan HTTP yang dikirim dari server ke client.

**REST (Representational State Transfer)**
Gaya arsitektur untuk mendesain API web.

**Route**
Path URL yang dipetakan ke handler function.

## S

**Salt**
Data acak yang ditambahkan ke password sebelum hashing untuk keamanan ekstra.

**Schema**
Definisi struktur data, digunakan untuk validasi.

**Sequelize**
ORM untuk Node.js yang mendukung PostgreSQL, MySQL, dan database lainnya.

**Service**
Layer yang berisi logika bisnis.

**SQL (Structured Query Language)**
Bahasa untuk mengelola dan meng-query database.

**Status Code**
Angka yang menunjukkan hasil request HTTP (misal: 200 = OK, 404 = Not Found).

**String**
Tipe data untuk teks: `"Halo, Dunia!"`

## T

**Token**
String yang mewakili autentikasi atau otorisasi.

**try/catch**
Sintaks error handling: kode di `try` dicoba, error ditangkap di `catch`.

**Type**
Klasifikasi data (string, number, boolean, dll.).

**TypeScript**
JavaScript dengan fitur keamanan tipe tambahan.

## U

**UUID (Universally Unique Identifier)**
Identifier 128-bit yang dijamin unik.

## V

**Variable**
Lokasi penyimpanan bernama untuk data.

**Validation**
Memeriksa apakah data memenuhi persyaratan tertentu.

---

# Selamat!

Anda telah menyelesaikan Modul Pembelajaran Backend Development!

## Apa yang Telah Anda Pelajari

1. **Dasar Pemrograman** - Variabel, function, tipe, async/await
2. **Struktur Proyek** - Bagaimana proyek profesional diorganisir
3. **Entry Point** - Bagaimana aplikasi dimulai
4. **Database** - SQL, tabel, migration
5. **Repository Layer** - Pola akses data
6. **Service Layer** - Logika bisnis
7. **Controller Layer** - Penanganan HTTP
8. **Autentikasi** - JWT, middleware, keamanan
9. **Alur Request** - Bagaimana semuanya terhubung
10. **Keterampilan Praktis** - Melalui latihan langsung

## Langkah Selanjutnya

1. **Praktik** - Selesaikan semua latihan
2. **Eksperimen** - Modifikasi kode dan lihat apa yang terjadi
3. **Bangun** - Buat fitur Anda sendiri
4. **Pelajari Lebih Lanjut** - Jelajahi topik seperti testing, deployment, dan pola lanjutan

## Sumber untuk Pembelajaran Lebih Lanjut

- [Dokumentasi TypeScript](https://www.typescriptlang.org/docs/)
- [Dokumentasi Fastify](https://www.fastify.io/docs/latest/)
- [Dokumentasi Sequelize](https://sequelize.org/docs/v6/)
- [Tutorial PostgreSQL](https://www.postgresql.org/docs/current/tutorial.html)
- [JWT.io](https://jwt.io/) - Pelajari lebih lanjut tentang token JWT

---

*Selamat Coding!*

