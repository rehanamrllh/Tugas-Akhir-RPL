const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, order_id, total, items, pelanggan } = JSON.parse(event.body);

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email tidak disertakan' }) };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // bisa sesuaikan SMTP lain
      auth: {
        user: process.env.EMAIL_USER || 'dummy@gmail.com',
        pass: process.env.EMAIL_PASS || 'dummy_password'
      }
    });

    const itemList = items.map(item => `- ${item.qty}x ${item.nama} (Rp ${item.harga * item.qty})`).join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@twicecafe.com',
      to: email,
      subject: `Nota Pembelian - Pesanan #${order_id}`,
      text: `Halo ${pelanggan},\n\nTerima kasih telah memesan di kafe kami! Berikut adalah rincian pesanan Anda yang telah LUNAS:\n\nNomor Pesanan: #${order_id}\n\nItem yang dipesan:\n${itemList}\n\nTotal Pembayaran: Rp ${total}\n\nTerima kasih atas kunjungan Anda dan selamat menikmati hidangan kami!\n\nSalam hangat,\nTwice Cafe`
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('--- SIMULASI EMAIL NOTA (Netlify) ---');
      console.log(`To: ${email}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(mailOptions.text);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Nota berhasil dikirim' })
    };

  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gagal mengirim email nota' })
    };
  }
};
