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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
