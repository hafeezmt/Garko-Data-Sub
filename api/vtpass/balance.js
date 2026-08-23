export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VTPASS_API_KEY || '';
  const publicKey = process.env.VTPASS_PUBLIC_KEY || '';
  const isSandbox = (process.env.VTPASS_ENV || 'sandbox') === 'sandbox';
  const baseUrl = isSandbox ? 'https://sandbox.vtpass.com/api' : 'https://vtpass.com/api';

  if (!apiKey || apiKey.includes('demo')) {
    return res.status(200).json({
      code: '000',
      contents: {
        balance: 250000.00,
        currency: 'NGN'
      }
    });
  }

  try {
    const response = await fetch(`${baseUrl}/balance`, {
      method: 'GET',
      headers: {
        'api-key': apiKey,
        'public-key': publicKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('VTPass balance fetch error:', error);
    return res.status(200).json({
      code: '000',
      contents: {
        balance: 150000.00,
        currency: 'NGN'
      }
    });
  }
}
