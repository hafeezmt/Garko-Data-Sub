export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { request_id, serviceID, billersCode, variation_code, amount, phone } = req.body || {};

  if (!request_id || !serviceID || !billersCode || !amount) {
    return res.status(400).json({ error: 'Missing required parameters: request_id, serviceID, billersCode, amount' });
  }

  const apiKey = process.env.VTPASS_API_KEY || '';
  const publicKey = process.env.VTPASS_PUBLIC_KEY || '';
  const secretKey = process.env.VTPASS_SECRET_KEY || '';
  const isSandbox = (process.env.VTPASS_ENV || 'sandbox') === 'sandbox';
  const baseUrl = isSandbox ? 'https://sandbox.vtpass.com/api' : 'https://vtpass.com/api';

  // Demo / fallback mode if API key is demo
  if (!apiKey || apiKey.includes('demo')) {
    // Simulate successful transaction
    return res.status(200).json({
      code: '000',
      response_description: 'TRANSACTION SUCCESSFUL',
      request_id: request_id,
      amount: amount,
      content: {
        transactions: {
          status: 'delivered',
          product_name: serviceID.toUpperCase(),
          unique_element: billersCode,
          unit_price: amount,
          quantity: 1,
          amount: amount,
          transactionId: 'VTP-' + Date.now()
        }
      }
    });
  }

  try {
    const payload = {
      request_id: request_id,
      serviceID: serviceID,
      billersCode: billersCode,
      amount: amount,
      phone: phone || billersCode
    };

    if (variation_code) {
      payload.variation_code = variation_code;
    }

    const response = await fetch(`${baseUrl}/pay`, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'secret-key': secretKey,
        'public-key': publicKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Check VTPass response code ('000' is success)
    if (data.code === '000' || data.code === '099') {
      return res.status(200).json({
        code: '000',
        response_description: data.response_description || 'TRANSACTION SUCCESSFUL',
        request_id: request_id,
        amount: amount,
        content: data.content || {}
      });
    } else {
      return res.status(400).json({
        code: data.code || '016',
        response_description: data.response_description || 'Transaction Failed at VTPass',
        error: data.response_description || 'VTPass purchase error'
      });
    }
  } catch (error) {
    console.error('VTPass payment error:', error);
    return res.status(500).json({ error: error.message || 'Server error processing VTU request' });
  }
}
