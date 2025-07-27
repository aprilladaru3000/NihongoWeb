import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory storage for demo
let pendaftarData = [];
let pesanData = [];
let kelasData = [
  {
    id: 1,
    nama: 'Kelas Dasar (N5)',
    deskripsi: 'Belajar huruf, kosakata, dan percakapan dasar',
    durasi: '4 bulan',
    harga: 1200000,
    peserta: 8
  },
  {
    id: 2,
    nama: 'Kelas Menengah (N4-N3)',
    deskripsi: 'Pendalaman tata bahasa, kanji, dan percakapan menengah',
    durasi: '6 bulan',
    harga: 1500000,
    peserta: 5
  }
];

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server berjalan dengan baik!' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  console.log('Received contact form data:', req.body);
  const { nama, email, pesan } = req.body;
  
  if (!nama || !email || !pesan) {
    console.log('Missing required fields');
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  console.log('Environment variables:', {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? 'Set' : 'Not set',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'Set' : 'Not set',
    TO_EMAIL: process.env.TO_EMAIL ? 'Set' : 'Not set'
  });

  // Save message to memory
  const newMessage = {
    id: Date.now(),
    nama,
    email,
    pesan,
    tanggal: new Date().toLocaleString('id-ID')
  };
  pesanData.push(newMessage);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('Attempting to send email...');
    await transporter.sendMail({
      from: `NihongoWeb Contact <${process.env.ADMIN_EMAIL}>`,
      to: process.env.TO_EMAIL || process.env.ADMIN_EMAIL,
      subject: `Pesan dari ${nama} (${email})`,
      text: pesan,
      html: `<p><b>Nama:</b> ${nama}</p><p><b>Email:</b> ${email}</p><p><b>Pesan:</b><br>${pesan}</p>`
    });

    console.log('Email sent successfully');
    res.status(200).json({ message: 'Pesan berhasil dikirim!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Gagal mengirim pesan.', error: error.message });
  }
});

// Admin endpoints
app.get('/api/admin/pendaftar', (req, res) => {
  res.json(pendaftarData);
});

app.post('/api/admin/pendaftar', (req, res) => {
  const { nama, email, kelas } = req.body;
  const newPendaftar = {
    id: Date.now(),
    nama,
    email,
    kelas,
    status: 'Terdaftar',
    tanggal: new Date().toISOString().split('T')[0]
  };
  pendaftarData.push(newPendaftar);
  res.json({ message: 'Pendaftar berhasil ditambahkan', data: newPendaftar });
});

app.get('/api/admin/pesan', (req, res) => {
  res.json(pesanData);
});

app.get('/api/admin/kelas', (req, res) => {
  res.json(kelasData);
});

app.post('/api/admin/kelas', (req, res) => {
  const { nama, deskripsi, durasi, harga } = req.body;
  const newKelas = {
    id: Date.now(),
    nama,
    deskripsi,
    durasi,
    harga: parseInt(harga),
    peserta: 0
  };
  kelasData.push(newKelas);
  res.json({ message: 'Kelas berhasil ditambahkan', data: newKelas });
});

app.put('/api/admin/kelas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nama, deskripsi, durasi, harga } = req.body;
  const kelasIndex = kelasData.findIndex(k => k.id === id);
  
  if (kelasIndex !== -1) {
    kelasData[kelasIndex] = { ...kelasData[kelasIndex], nama, deskripsi, durasi, harga: parseInt(harga) };
    res.json({ message: 'Kelas berhasil diupdate', data: kelasData[kelasIndex] });
  } else {
    res.status(404).json({ message: 'Kelas tidak ditemukan' });
  }
});

app.delete('/api/admin/kelas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const kelasIndex = kelasData.findIndex(k => k.id === id);
  
  if (kelasIndex !== -1) {
    kelasData.splice(kelasIndex, 1);
    res.json({ message: 'Kelas berhasil dihapus' });
  } else {
    res.status(404).json({ message: 'Kelas tidak ditemukan' });
  }
});

app.get('/api/admin/stats', (req, res) => {
  const stats = {
    totalPendaftar: pendaftarData.length,
    kelasAktif: kelasData.length,
    pendapatan: pendaftarData.length * 1200000,
    pesanBaru: pesanData.length
  };
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment check:', {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? 'Set' : 'Not set',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'Set' : 'Not set'
  });
}); 