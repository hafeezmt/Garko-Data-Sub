/**
 * VTPass API Client Service (Proxied via /api/vtpass/*)
 */

export const NETWORK_SERVICE_IDS = {
  mtn: { data: 'mtn-data', airtime: 'mtn' },
  airtel: { data: 'airtel-data', airtime: 'airtel' },
  glo: { data: 'glo-data', airtime: 'glo' },
  '9mobile': { data: 'etisalat-data', airtime: 'etisalat' },
  etisalat: { data: 'etisalat-data', airtime: 'etisalat' }
};

export async function fetchServiceVariations(serviceID) {
  try {
    const res = await fetch(`/api/vtpass/variations?serviceID=${encodeURIComponent(serviceID)}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch network variations');
    }

    const variations = data.content?.variations || data.content?.varations || [];
    return variations;
  } catch (error) {
    console.error('Error fetching service variations:', error);
    throw error;
  }
}

export async function executeVtuPurchase({ request_id, serviceID, billersCode, variation_code, amount, phone }) {
  try {
    const res = await fetch('/api/vtpass/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        request_id,
        serviceID,
        billersCode,
        variation_code,
        amount: parseFloat(amount),
        phone: phone || billersCode
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.response_description || 'VTU transaction failed');
    }

    return data;
  } catch (error) {
    console.error('Error executing VTU purchase:', error);
    throw error;
  }
}

export async function fetchVTPassBalance() {
  try {
    const res = await fetch('/api/vtpass/balance');
    const data = await res.json();
    return data.contents?.balance || data.balance || 0;
  } catch (error) {
    console.error('Error fetching VTPass balance:', error);
    return 0;
  }
}
