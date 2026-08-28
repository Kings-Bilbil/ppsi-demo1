# PRD - Sistem Informasi Pemesanan Baju (Tailor Order Management System)

## 1. Ringkasan Proyek
Proyek ini adalah pengembangan sistem informasi berbasis web untuk usaha pembuatan baju di Pontianak. Sistem bertujuan untuk menggantikan proses manual pencatatan pemesanan melalui WhatsApp dengan platform terpusat yang memudahkan penjual dalam mengelola pesanan, stok, dan riwayat transaksi, serta memberikan transparansi status pesanan kepada pembeli melalui fitur cek status online.

## 2. Tujuan
- Menyediakan landing page profesional sebagai etalase usaha.
- Memungkinkan pembeli mengecek status pesanan secara real-time menggunakan kode unik.
- Memberikan dashboard admin untuk mengelola pesanan dengan alur status (kanban), stok baju, data pemesan, dan riwayat.
- Mengurangi ketergantungan pada komunikasi manual dan meningkatkan efisiensi operasional.

## 3. Ruang Lingkup
### Termasuk:
- Landing page publik (beranda) dengan informasi usaha, galeri, dan fitur cek status.
- Halaman login admin.
- Dashboard admin dengan 4 menu utama: Home (kanban), Kelola Stok, Data Pemesan, Riwayat Pemesanan.
- Manajemen status pesanan dengan drag-and-drop dan update real-time.
- Pembuatan kode pembelian acak 6 karakter untuk setiap pesanan.
- Penghapusan data pemesan (tanpa masuk riwayat).
- Penyimpanan riwayat pesanan yang telah selesai.

### Tidak Termasuk:
- Pembayaran online.
- Notifikasi email/WhatsApp otomatis.
- Multi-user admin (hanya satu akun admin).
- Autentikasi pembeli (hanya kode pembelian).

## 4. Peran Pengguna
1. **Admin (Penjual)**  
   - Login ke dashboard.  
   - Mengelola stok baju (CRUD).  
   - Menambah, mengedit, menghapus data pemesan.  
   - Memindahkan status pesanan via drag-and-drop.  
   - Melihat riwayat pesanan selesai.  
2. **Pembeli (Pengunjung)**  
   - Mengakses landing page.  
   - Mengecek status pesanan dengan kode pembelian.  
   - Tidak memerlukan login.

## 5. Kebutuhan Fungsional

### 5.1 Landing Page (Publik)
- **Deskripsi:** Halaman utama yang menampilkan identitas usaha, deskripsi layanan, galeri foto produk, testimoni (opsional), kontak, dan ajakan bertindak (CTA).
- **Fitur Cek Status Pemesanan:**  
  - Form input kode pembelian (6 karakter).  
  - Tombol "Cek Status" untuk menampilkan status pesanan terkini: Perencanaan, Sedang Proses, Siap Diambil, atau Selesai.  
  - Jika kode tidak valid/tidak ditemukan, tampilkan pesan error yang ramah.
- **Tampilan:** Profesional, modern, mirip website komersial fashion. Menggunakan banyak gambar baju (dummy/placeholder), tipografi jelas, layout responsif.

### 5.2 Login Admin
- Akses dengan menambahkan `/login` pada URL (misal `https://domain.com/login`).
- Form login dengan username & password.
- Autentikasi sederhana (misal kredensial statis atau disimpan di environment).
- Setelah login berhasil, redirect ke `/admin` (dashboard).

### 5.3 Dashboard Admin
- Layout dengan sidebar di kiri berisi menu: Home, Kelola Stok, Data Pemesan, Riwayat Pemesanan.
- Tampilan bersih, modern, profesional (terinspirasi Google Material Design / clean UI).
- Responsif untuk desktop (prioritas) dan mobile.

#### 5.3.1 Menu Home (Kanban Status Pemesanan)
- Menampilkan ringkasan:  
  - Jumlah stok per jenis baju (dari data stok).  
  - Jumlah pesanan yang telah selesai (dari riwayat).
- **Kanban Board:**  
  - Empat kolom status: **Perencanaan, Sedang Proses, Siap Diambil, Selesai**.  
  - Setiap kolom berisi kartu pesanan yang menampilkan: nama pembeli, jenis baju, jumlah, total harga, dan kode pembelian.  
  - Kartu dapat di-drag-and-drop antar kolom.  
  - Saat kartu dipindahkan ke kolom **Selesai**, muncul popup konfirmasi: "Apakah pesanan telah selesai?" dengan tombol Ya/Tidak.  
    - Jika **Ya**: kartu dihapus dari kanban dan data pesanan dipindahkan ke menu Riwayat Pemesanan. Kode pembelian menjadi tidak valid.  
    - Jika **Tidak**: kartu tetap berada di kolom sebelumnya atau kembali ke posisi semula (tidak ada perubahan).  
  - Perubahan status harus tersimpan di database dan tercermin secara real-time (jika ada pembeli yang sedang cek status, mereka melihat update terbaru).

#### 5.3.2 Kelola Stok
- Menampilkan tabel/list jenis baju beserta jumlah stoknya.
- Fitur **Tambah Stok Baru**: form input nama jenis baju dan jumlah stok.
- Setiap item memiliki aksi **Edit** (ubah nama/jumlah) dan **Delete** (hapus jenis baju).
- Data stok terhubung dengan ringkasan stok di menu Home (real-time setelah perubahan).

#### 5.3.3 Data Pemesan
- Menampilkan tabel semua data pemesanan aktif (yang belum selesai).
- **Tambah Data Pemesan:**  
  - Form input: nama pembeli, jenis baju (dropdown dari daftar stok), jumlah, total harga, deskripsi (opsional).  
  - Setelah submit, sistem otomatis membuat **kode pembelian acak 6 huruf** (unik, kombinasi huruf besar/kecil, tidak mudah ditebak).  
  - Muncul popup yang menampilkan kode pembelian tersebut (untuk diberikan kepada pembeli).  
  - Data baru langsung masuk ke kolom **Perencanaan** di kanban Home.
- Setiap baris data pemesan memiliki aksi:  
  - **Lihat Detail**: menampilkan semua field termasuk kode pembelian.  
  - **Edit**: mengubah data (kode pembelian tetap).  
  - **Hapus**: menghapus data pemesan secara permanen (tidak masuk riwayat). Perlu konfirmasi sebelum hapus.
- Kolom tabel: Nama Pembeli, Jenis Baju, Jumlah, Total Harga, Status, Kode Pembelian, Aksi.

#### 5.3.4 Riwayat Pemesanan
- Menampilkan daftar pesanan yang telah selesai (dipindahkan dari kanban).
- Data yang ditampilkan: nama pembeli, jenis baju, jumlah, total harga, tanggal selesai, kode pembelian (sudah tidak valid, bisa ditampilkan tapi diberi keterangan "tidak berlaku").
- Tidak ada aksi edit/hapus (hanya read-only).
- Urutkan berdasarkan tanggal selesai terbaru.

### 5.4 Cek Status Pemesanan (Pembeli)
- Endpoint publik: `/cek-status` atau bagian dari landing page.
- Input kode 6 huruf.
- Pencarian ke database untuk menemukan pesanan dengan kode tersebut dan status bukan "Selesai" (jika sudah selesai, kode tidak valid).
- Tampilkan status pesanan dengan indikator visual (misal badge berwarna).
- Jika kode tidak ditemukan atau sudah digunakan untuk pesanan selesai, tampilkan pesan "Kode tidak valid atau pesanan telah selesai."

## 6. Model Data (Entity)

### 6.1 Stock (Jenis Baju)
- `id`: string (UUID)
- `name`: string (contoh: Kemeja Formal, Kaos Polos)
- `quantity`: integer (jumlah stok)
- `createdAt`, `updatedAt`: datetime

### 6.2 Order (Pesanan)
- `id`: string (UUID)
- `buyerName`: string
- `stockId`: string (foreign key ke Stock)
- `quantity`: integer
- `totalPrice`: number (decimal)
- `description`: string (opsional)
- `status`: enum ['Perencanaan', 'Sedang Proses', 'Siap Diambil', 'Selesai']
- `purchaseCode`: string (6 huruf unik)
- `createdAt`, `updatedAt`: datetime
- `completedAt`: datetime (nullable, diisi saat status menjadi Selesai)

### 6.3 Admin (Opsional jika hanya satu user)
- `username`: string
- `password`: string (hashed)

## 7. API Endpoint (Rencana)

### Publik
- `GET /api/stock` → list stok untuk landing page (opsional)
- `POST /api/check-status` → body: `{ code: string }`, response: `{ status: string }` atau error

### Admin (butuh autentikasi)
- `POST /api/auth/login` → body: `{ username, password }`
- `POST /api/auth/logout`
- `GET /api/orders` → list semua pesanan (untuk kanban & data pemesan)
- `POST /api/orders` → buat pesanan baru, return data termasuk purchaseCode
- `PUT /api/orders/:id` → update pesanan (termasuk status)
- `DELETE /api/orders/:id` → hapus pesanan
- `GET /api/orders/history` → list pesanan selesai
- `GET /api/stock` → list stok
- `POST /api/stock` → tambah stok
- `PUT /api/stock/:id` → update stok
- `DELETE /api/stock/:id` → hapus stok

Catatan: Implementasi endpoint menyesuaikan dengan framework Next.js (API routes) dan database yang digunakan.

## 8. Spesifikasi UI/UX

### 8.1 Landing Page
- **Style:** Bersih, modern, profesional, elegan. Gunakan palet warna netral (putih, abu-abu, aksen warna biru/emas). Banyak whitespace, tipografi jelas (font sans-serif).
- **Komponen:**
  - Header dengan logo & navigasi (Beranda, Tentang, Layanan, Kontak).
  - Hero section dengan gambar besar baju dan tagline.
  - Section "Layanan Kami" dengan ikon.
  - Galeri produk (grid 3-4 kolom, gambar placeholder berkualitas tinggi).
  - Section "Cek Status Pesanan" dengan form input kode.
  - Testimoni pelanggan (opsional, bisa dummy).
  - Footer dengan kontak dan media sosial.
- **Interaksi:** Smooth scroll, hover efek halus.

### 8.2 Halaman Login
- Minimalis, centered card, background abu-abu muda.
- Input username & password, tombol login.

### 8.3 Dashboard Admin
- **Layout:** Sidebar fixed di kiri (lebar ~240px) dengan ikon dan label menu. Konten utama di kanan dengan padding cukup.
- **Warna:** Putih dan abu-abu terang, aksen biru (#1a73e8 ala Google). Teks gelap.
- **Kanban Board:** Kolom dengan background abu-abu muda (#f1f3f4), kartu putih dengan shadow tipis. Drag-and-drop harus intuitif (cursor grab/grabbing). Indikator status dengan badge berwarna: Perencanaan (kuning), Sedang Proses (biru), Siap Diambil (oranye), Selesai (hijau).
- **Tabel Data:** Rapi, ada hover row, tombol aksi dengan ikon (edit, hapus, lihat).
- **Form:** Input dengan label jelas, validasi sederhana.
- **Popup/Modal:** Untuk konfirmasi dan menampilkan kode pembelian, gunakan modal yang bersih.

## 9. Teknologi & Arsitektur
- **Framework:** Next.js (App Router) dengan React.
- **Styling:** Tailwind CSS.
- **Arsitektur:** Monorepo (misal menggunakan Turborepo) dengan struktur:
  - `apps/web`: aplikasi utama (landing page + admin).
  - `packages/ui`: komponen bersama (jika diperlukan).
- **Database:** Bebas, disarankan PostgreSQL + Prisma ORM, atau SQLite untuk development.
- **State Management:** React Context / Zustand untuk state global (misal data pesanan untuk kanban), dengan integrasi ke API.
- **Drag-and-Drop:** Library seperti `@hello-pangea/dnd` atau `react-beautiful-dnd` (perhatikan kompatibilitas dengan React 18/Next.js).
- **Real-time:** Gunakan polling atau WebSocket (misal Pusher) untuk update status real-time. Jika tidak memungkinkan, minimal refresh otomatis setiap 30 detik pada halaman cek status dan kanban admin.
- **Autentikasi:** NextAuth.js atau JWT sederhana.

## 10. Kebutuhan Non-Fungsional
- **Performa:** Halaman harus dimuat < 3 detik pada koneksi standar.
- **Responsivitas:** Landing page dan dashboard harus responsif (mobile-friendly, terutama landing page).
- **Keamanan:** Password admin di-hash, API admin terlindungi, input divalidasi.
- **Kemudahan Penggunaan:** Admin dapat mengoperasikan tanpa pelatihan khusus.
- **Skalabilitas:** Struktur kode modular untuk penambahan fitur di masa depan.

## 11. Kriteria Penerimaan (Acceptance Criteria)
1. Landing page dapat diakses publik dan menampilkan konten dummy yang menarik.
2. Pembeli dapat memasukkan kode pembelian dan melihat status pesanan yang sesuai.
3. Admin dapat login dan melihat dashboard dengan data stok dan pesanan.
4. Admin dapat menambah jenis baju dan stok; perubahan langsung terlihat di ringkasan Home.
5. Admin dapat menambah data pemesan; sistem menghasilkan kode unik 6 huruf dan menampilkannya dalam popup.
6. Data pemesan baru muncul di kolom Perencanaan pada kanban.
7. Admin dapat drag-and-drop kartu antar kolom status.
8. Saat kartu dipindahkan ke Selesai, muncul popup konfirmasi; jika Ya, data pindah ke riwayat dan kode menjadi tidak valid; jika Tidak, tidak ada perubahan.
9. Admin dapat mengedit dan menghapus data pemesan; penghapusan tidak memindahkan ke riwayat.
10. Riwayat pemesanan hanya berisi pesanan yang telah selesai.
11. Kode pembelian yang sudah selesai tidak dapat digunakan lagi untuk cek status.
12. UI dashboard terlihat profesional dan bersih, mirip dengan gaya Google.
13. Landing page terlihat seperti website komersial profesional, bukan template AI generik.

## 12. Catatan Tambahan
- Untuk data dummy, gunakan gambar placeholder dari Unsplash atau placeholder lokal.
- Semua teks pada landing page bisa menggunakan konten dummy yang realistis (nama usaha fiktif, alamat, deskripsi).
- Pastikan drag-and-drop berfungsi dengan baik di desktop (prioritas). Pada mobile, sediakan alternatif seperti dropdown untuk mengubah status.
- Kode pembelian harus benar-benar acak dan unik; gunakan fungsi random dengan pengecekan duplikat di database.

---

**Dokumen ini menjadi acuan utama pengembangan. Jika ada kebutuhan yang belum tercantum, diskusikan sebelum implementasi.**