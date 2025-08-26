import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve file frontend
app.use(express.static(path.join(__dirname, 'public')));


let pesanMasuk = [];
let totalVisitors = 0;

// Middleware untuk menghitung visitor (hanya untuk halaman utama)
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/index.html') {
    totalVisitors++;
  }
  next();
});
// Endpoint statistik sederhana
app.get('/api/admin/statistik', (req, res) => {
  res.json({
    totalPesan: pesanMasuk.length,
    totalVisitors
  });
});

// API menerima pesan
app.post('/api/kontak', (req, res) => {
  const { nama, email, pesan } = req.body;
  const data = { nama, email, pesan, tanggal: new Date().toLocaleString() };
  pesanMasuk.push(data);
  res.json({ success: true, message: 'Pesan berhasil dikirim!' });
});


// API admin
app.get('/api/admin/pesan', (req, res) => {
  res.json(pesanMasuk);
});

// Endpoint untuk menghapus pesan berdasarkan index
app.delete('/api/admin/pesan/:index', (req, res) => {
  const idx = parseInt(req.params.index, 10);
  if (isNaN(idx) || idx < 0 || idx >= pesanMasuk.length) {
    return res.status(400).json({ success: false, message: 'Index tidak valid' });
  }
  pesanMasuk.splice(idx, 1);
  res.json({ success: true, message: 'Pesan berhasil dihapus' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
