# Tentang Proyek

Proyek ini merupakan latihan membangun **front-end** dari website kursus Bahasa Jepang fiktif bernama **"Nihongo Kulon Progo"**.  
Tujuan utama proyek ini adalah mempraktikkan keterampilan membuat layout modern, responsif, dan interaktif menggunakan **HTML**, **CSS**, dan **JavaScript**.

> **Catatan**: Proyek ini bersifat portofolio/latihan. Semua informasi seperti nama kursus, harga, jadwal, dan kontak adalah **fiktif**.

---

## Fitur

- **Desain Responsif**  
  Menyesuaikan tampilan dari desktop hingga mobile.

- **Kalkulator Biaya**  
  Menghitung total biaya kursus berdasarkan kelas dan jumlah peserta (JavaScript).

- **Kuis Interaktif**  
  Menguji pengetahuan dasar Bahasa Jepang dengan kuis sederhana berbasis JavaScript.

- **UI Modern**  
  - Animasi fade-in saat scroll.  
  - Efek hover pada kartu dan tombol.  
  - Smooth scrolling untuk navigasi.  
  - Tombol "Back to Top".

- **Blog & Galeri**  
  Layout statis untuk menampilkan artikel dan galeri foto.

---

## Teknologi

- **HTML5** – Struktur konten website.  
- **Tailwind CSS** – Framework CSS untuk styling cepat dan konsisten.  
- **JavaScript (Vanilla)** – Fungsionalitas interaktif seperti kalkulator, kuis, dan manipulasi DOM.

---

## Perubahan Terbaru (admin)

- Menambahkan fitur admin: "Detail Pesan" modal pada `public/admin.html`.
- Tombol "Reply" pada modal membuka klien email default menggunakan `mailto:` dengan subjek dan isi pesan terisi otomatis.
- Tombol "Copy" menyalin alamat email ke clipboard.
- Fitur ini diimplementasikan di `public/js/admin.js` dengan fungsi `openPesanModal`, `copyModalEmail`, dan `replyModalEmail`.

Silakan lihat `public/admin.html` dan `public/js/admin.js` untuk detail implementasi.
