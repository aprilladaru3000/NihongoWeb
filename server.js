import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { nama, email, pesan } = req.body;
  if (!nama || !email || !pesan) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `NihongoWeb Contact <${process.env.ADMIN_EMAIL}>`,
      to: process.env.TO_EMAIL || process.env.ADMIN_EMAIL,
      subject: `Pesan dari ${nama} (${email})`,
      text: pesan,
      html: `<p><b>Nama:</b> ${nama}</p><p><b>Email:</b> ${email}</p><p><b>Pesan:</b><br>${pesan}</p>`
    });

    res.status(200).json({ message: 'Pesan berhasil dikirim!' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengirim pesan.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 