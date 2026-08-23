/**
 * Paystack Inline Helper Service
 */

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_demo1234567890';

export function initializePaystackPayment({ email, amount, metadata, onSuccess, onClose }) {
  if (typeof window === 'undefined' || !window.PaystackPop) {
    // Dynamically inject script if not present
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      openPaystackModal({ email, amount, metadata, onSuccess, onClose });
    };
    document.body.appendChild(script);
  } else {
    openPaystackModal({ email, amount, metadata, onSuccess, onClose });
  }
}

function openPaystackModal({ email, amount, metadata, onSuccess, onClose }) {
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: Math.round(amount * 100), // Amount in Kobo
    currency: 'NGN',
    ref: 'GS-' + Math.floor((Math.random() * 1000000000) + 1),
    metadata: metadata || {},
    callback: function (response) {
      if (onSuccess) onSuccess(response);
    },
    onClose: function () {
      if (onClose) onClose();
    }
  });

  handler.openIframe();
}

export async function verifyPaystackPayment({ reference, user_id, amount }) {
  try {
    const response = await fetch('/api/paystack/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reference, user_id, amount })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Payment verification failed');
    }

    return data;
  } catch (error) {
    console.error('Error verifying Paystack payment:', error);
    throw error;
  }
}
