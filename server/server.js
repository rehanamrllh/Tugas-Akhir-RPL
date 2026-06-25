const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');

const app = express();
app.use(cors());
app.use(express.json());

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

app.post('/api/payment', async (req, res) => {
  try {
    const { order_id, gross_amount, customer_details, item_details } = req.body;

    const parameter = {
      transaction_details: {
        order_id: order_id || `ORDER-${Math.floor(Math.random() * 1000000)}`,
        gross_amount: gross_amount
      },
      customer_details: customer_details,
      item_details: item_details,
      callbacks: {
        finish: 'http://localhost:5173' // Arahkan kembali ke frontend jika redirect (untuk beberapa metode)
      }
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Kembalikan token ke frontend
    res.json({ token: transaction.token, redirect_url: transaction.redirect_url });

  } catch (error) {
    console.error("Error Midtrans:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Setup Nodemailer
const transporter = require('nodemailer').createTransport({
  service: 'gmail', // atau service lain sesuai kebutuhan
  auth: {
    user: process.env.EMAIL_USER || 'dummy@gmail.com',
    pass: process.env.EMAIL_PASS || 'dummy_password'
  }
});

app.post('/api/send-receipt', async (req, res) => {
  try {
    const { email, order_id, total, items, pelanggan } = req.body;
    
    if (!email) return res.status(400).json({ error: 'Email tidak disertakan' });

    // Format item untuk email
    const itemList = items.map(item => `- ${item.qty}x ${item.nama} (Rp ${item.harga * item.qty})`).join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@twicecafe.com',
      to: email,
      subject: `Nota Pembelian - Pesanan #${order_id}`,
      text: `Halo ${pelanggan},\n\nTerima kasih telah memesan di kafe kami! Berikut adalah rincian pesanan Anda yang telah LUNAS:\n\nNomor Pesanan: #${order_id}\n\nItem yang dipesan:\n${itemList}\n\nTotal Pembayaran: Rp ${total}\n\nTerima kasih atas kunjungan Anda dan selamat menikmati hidangan kami!\n\nSalam hangat,\nTwice Cafe`
    };

    // Simulasi pengiriman jika tidak ada kredensial valid
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('--- SIMULASI EMAIL NOTA ---');
      console.log(`To: ${email}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(mailOptions.text);
      console.log('---------------------------');
    }

    res.json({ success: true, message: 'Nota berhasil dikirim ke email.' });
  } catch (error) {
    console.error("Error mengirim email:", error);
    res.status(500).json({ error: 'Gagal mengirim email nota' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Midtrans berjalan di port ${PORT}`);
});
