import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server berjalan dengan baik!' });
});

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment check:', {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? 'Set' : 'Not set',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'Set' : 'Not set'
  });
}); 