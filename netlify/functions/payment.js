const midtransClient = require('midtrans-client');

exports.handler = async function(event, context) {
  // Hanya terima POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    const body = JSON.parse(event.body);
    const { order_id, gross_amount, customer_details, item_details } = body;

    const parameter = {
      transaction_details: {
        order_id: order_id || `ORD-${Date.now()}`,
        gross_amount: gross_amount
      },
      customer_details: customer_details,
      item_details: item_details
    };

    const transaction = await snap.createTransaction(parameter);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: transaction.token, redirect_url: transaction.redirect_url })
    };
  } catch (error) {
    console.error("Midtrans Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
