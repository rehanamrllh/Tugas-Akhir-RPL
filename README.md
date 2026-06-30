# Twice Cafe — QR Digital Menu & Ordering System

Twice Cafe adalah sistem pemesanan menu digital berbasis QR Code yang memungkinkan pelanggan untuk memesan makanan dan minuman secara *self-service*, serta memfasilitasi admin untuk mengelola pesanan, menu, dan melihat laporan penjualan.

Proyek ini dibangun menggunakan **React**, **Vite**, **Firebase**, dan terintegrasi dengan payment gateway **Midtrans**.

## 🚀 Fitur Utama

### Sisi Pelanggan
*   **Digital Menu:** Melihat daftar menu lengkap dengan kategori dan gambar.
*   **Self-Service Ordering:** Memesan langsung dari perangkat pelanggan.
*   **Payment Gateway:** Pembayaran terintegrasi menggunakan Midtrans.

### Sisi Admin
*   **Dashboard Analytics:** Visualisasi data penjualan (menggunakan Chart.js).
*   **Manajemen Pesanan:** Memantau pesanan yang masuk dan mengubah statusnya.
*   **Manajemen Menu:** Mengelola ketersediaan, harga, dan gambar dari setiap item menu.

## 🛠️ Teknologi yang Digunakan

*   **Frontend:** React.js, Vite, React Router DOM
*   **Backend & Database:** Firebase (Realtime Database, Authentication, dll.)
*   **Payment Gateway:** Midtrans
*   **Visualisasi Data:** Chart.js, react-chartjs-2
*   **Fonts & Icons:** Google Fonts (DM Serif Display, Nunito), FontAwesome

## 🔗 Tautan Penting

*   **Figma Design:** [Figma Link](https://www.figma.com/design/DUQoyOqCtVnLSdb6bBP0fP/RPL-FINAL-TWICE-CAFE?node-id=0-1&t=IeffkGyB41Sosztv-1)
*   **Live Deploy:** [Live Deploy Link](https://twicecafe.netlify.app/)

## 💻 Panduan Instalasi (Lokal)

Jika Anda ingin menjalankan proyek ini secara lokal untuk pengembangan, ikuti langkah-langkah berikut:

1.  **Clone repository ini atau unduh kode sumber:**
    ```bash
    git clone https://github.com/rehanamrllh/Tugas-Akhir-RPL.git
    cd self-serfice
    ```

2.  **Instal dependensi aplikasi:**
    ```bash
    npm install
    ```

3.  **Jalankan development server:**
    ```bash
    npm run dev
    ```

4.  Buka browser dan akses URL lokal yang diberikan oleh Vite (biasanya `http://localhost:5173`).

## 🌐 Akses Aplikasi (Deploy)

Sistem Twice Cafe Self-Service System telah di-deploy (diunggah) ke server produksi menggunakan layanan Netlify. Sistem ini dapat diakses langsung tanpa perlu menjalankan instalasi secara lokal.

*   **Pengujian Sisi Pelanggan:** Buka URL utama aplikasi.
*   **Pengujian Sisi Admin:** Tambahkan `/admin` pada akhir URL (contoh: `https://twicecafe.netlify.app/admin`)
    *   **Username Default:** `Asep`
    *   **Password Default:** `123`
*   **Full Access Admin:**
    *   **Username:** `rhn`
    *   **Password:** `rhn123`

---
*Proyek ini merupakan bagian dari Tugas Mata Kuliah Rekayasa Perangkat Lunak.*
