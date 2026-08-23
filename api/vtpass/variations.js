export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { serviceID } = req.query || {};

  if (!serviceID) {
    return res.status(400).json({ error: 'serviceID query parameter is required' });
  }

  const apiKey = process.env.VTPASS_API_KEY || '';
  const publicKey = process.env.VTPASS_PUBLIC_KEY || '';
  const isSandbox = (process.env.VTPASS_ENV || 'sandbox') === 'sandbox';
  const baseUrl = isSandbox ? 'https://sandbox.vtpass.com/api' : 'https://vtpass.com/api';

  // If using placeholder key, return fallback response
  if (!apiKey || apiKey.includes('demo')) {
    const mockVariations = getMockVariations(serviceID);
    return res.status(200).json({
      response_description: 'SUCCESS',
      content: {
        ServiceName: serviceID.toUpperCase(),
        serviceID: serviceID,
        varations: mockVariations,
        variations: mockVariations
      }
    });
  }

  try {
    const response = await fetch(`${baseUrl}/service-variations?serviceID=${encodeURIComponent(serviceID)}`, {
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
    console.error('VTPass variations fetch error:', error);
    // Fallback to mock on network error
    const mockVariations = getMockVariations(serviceID);
    return res.status(200).json({
      response_description: 'FALLBACK_SUCCESS',
      content: {
        ServiceName: serviceID.toUpperCase(),
        serviceID: serviceID,
        varations: mockVariations,
        variations: mockVariations
      }
    });
  }
}

function getMockVariations(serviceID) {
  const network = serviceID.split('-')[0];
  switch (network) {
    case 'mtn':
      return [
        { variation_code: 'mtn-500mb-sme', name: 'MTN 500MB SME (30 Days)', variation_amount: '160.00', fixedPrice: 'Yes' },
        { variation_code: 'mtn-1gb-sme', name: 'MTN 1GB SME (30 Days)', variation_amount: '290.00', fixedPrice: 'Yes' },
        { variation_code: 'mtn-2gb-sme', name: 'MTN 2GB SME (30 Days)', variation_amount: '580.00', fixedPrice: 'Yes' },
        { variation_code: 'mtn-3gb-sme', name: 'MTN 3GB SME (30 Days)', variation_amount: '870.00', fixedPrice: 'Yes' },
        { variation_code: 'mtn-5gb-sme', name: 'MTN 5GB SME (30 Days)', variation_amount: '1450.00', fixedPrice: 'Yes' }
      ];
    case 'airtel':
      return [
        { variation_code: 'airtel-500mb-dir', name: 'Airtel 500MB Direct (30 Days)', variation_amount: '170.00', fixedPrice: 'Yes' },
        { variation_code: 'airtel-1gb-dir', name: 'Airtel 1GB Direct (30 Days)', variation_amount: '320.00', fixedPrice: 'Yes' },
        { variation_code: 'airtel-2gb-dir', name: 'Airtel 2GB Direct (30 Days)', variation_amount: '640.00', fixedPrice: 'Yes' },
        { variation_code: 'airtel-5gb-dir', name: 'Airtel 5GB Direct (30 Days)', variation_amount: '1500.00', fixedPrice: 'Yes' }
      ];
    case 'glo':
      return [
        { variation_code: 'glo-1.25gb', name: 'Glo 1.25GB Special (30 Days)', variation_amount: '500.00', fixedPrice: 'Yes' },
        { variation_code: 'glo-2.5gb', name: 'Glo 2.5GB Special (30 Days)', variation_amount: '1000.00', fixedPrice: 'Yes' },
        { variation_code: 'glo-5.8gb', name: 'Glo 5.8GB Special (30 Days)', variation_amount: '2000.00', fixedPrice: 'Yes' }
      ];
    case 'etisalat':
    case '9mobile':
      return [
        { variation_code: '9mobile-1gb', name: '9mobile 1GB Data (30 Days)', variation_amount: '400.00', fixedPrice: 'Yes' },
        { variation_code: '9mobile-2gb', name: '9mobile 2GB Data (30 Days)', variation_amount: '800.00', fixedPrice: 'Yes' },
        { variation_code: '9mobile-4.5gb', name: '9mobile 4.5GB Data (30 Days)', variation_amount: '1500.00', fixedPrice: 'Yes' }
      ];
    default:
      return [];
  }
}
