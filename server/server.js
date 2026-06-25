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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Midtrans berjalan di port ${PORT}`);
});
