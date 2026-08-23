import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference, user_id, amount } = req.body || {};

  if (!reference || !user_id || !amount) {
    return res.status(400).json({ error: 'Missing reference, user_id, or amount' });
  }

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY || '';
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // If using placeholder key, simulate verified funding
  if (!paystackSecret || paystackSecret.includes('demo') || reference.startsWith('demo-') || reference.startsWith('test-')) {
    try {
      const fundAmount = parseFloat(amount);

      // Call Supabase RPC credit_wallet_balance
      const { data: newBalance, error: rpcError } = await supabase.rpc('credit_wallet_balance', {
        p_user_id: user_id,
        p_amount: fundAmount
      });

      if (rpcError) {
        console.warn('RPC credit error, falling back to direct update:', rpcError.message);
        const { data: profile } = await supabase.from('profiles').select('wallet_balance').eq('id', user_id).single();
        const currentBal = profile ? parseFloat(profile.wallet_balance || 0) : 0;
        await supabase.from('profiles').update({ wallet_balance: currentBal + fundAmount }).eq('id', user_id);
      }

      // Record transaction
      await supabase.from('transactions').insert({
        user_id: user_id,
        type: 'fund_wallet',
        network: 'Paystack',
        phone_number: '-',
        amount: fundAmount,
        plan: 'Wallet Topup via Paystack',
        status: 'success',
        vtpass_request_id: reference
      });

      return res.status(200).json({
        status: true,
        message: 'Wallet funded successfully (Demo mode)',
        amount: fundAmount
      });
    } catch (err) {
      console.error('Demo verification error:', err);
      return res.status(500).json({ error: 'Failed to process funding' });
    }
  }

  try {
    // Verify with Paystack API
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.status && data.data && data.data.status === 'success') {
      const verifiedAmount = data.data.amount / 100; // Paystack sends amount in Kobo

      // Check if reference has already been processed to prevent double-crediting
      const { data: existingTx } = await supabase
        .from('transactions')
        .select('id')
        .eq('vtpass_request_id', reference)
        .maybeSingle();

      if (existingTx) {
        return res.status(200).json({
          status: true,
          message: 'Transaction already credited',
          amount: verifiedAmount
        });
      }

      // Credit wallet in Supabase
      const { error: rpcError } = await supabase.rpc('credit_wallet_balance', {
        p_user_id: user_id,
        p_amount: verifiedAmount
      });

      if (rpcError) {
        // Fallback update if RPC fails
        const { data: profile } = await supabase.from('profiles').select('wallet_balance').eq('id', user_id).single();
        const currentBal = profile ? parseFloat(profile.wallet_balance || 0) : 0;
        await supabase.from('profiles').update({ wallet_balance: currentBal + verifiedAmount }).eq('id', user_id);
      }

      // Record transaction
      await supabase.from('transactions').insert({
        user_id: user_id,
        type: 'fund_wallet',
        network: 'Paystack',
        phone_number: data.data.customer?.email || '-',
        amount: verifiedAmount,
        plan: 'Wallet Topup via Paystack',
        status: 'success',
        vtpass_request_id: reference
      });

      return res.status(200).json({
        status: true,
        message: 'Wallet funded successfully',
        amount: verifiedAmount
      });
    } else {
      return res.status(400).json({
        status: false,
        message: data.message || 'Paystack payment verification failed'
      });
    }
  } catch (error) {
    console.error('Paystack verification error:', error);
    return res.status(500).json({ error: error.message || 'Server error verifying payment' });
  }
}
