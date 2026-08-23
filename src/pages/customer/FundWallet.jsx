import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializePaystackPayment, verifyPaystackPayment } from '../../lib/paystack';
import { Wallet, CreditCard, ShieldCheck, Loader2, PlusCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FundWallet({ user, profile, refreshProfile }) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const presetAmounts = [500, 1000, 2000, 5000, 10000, 20000];

  const handleFundWallet = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (!numAmount || numAmount < 100) {
      toast.error('Minimum wallet funding amount is ₦100');
      return;
    }

    setLoading(true);

    initializePaystackPayment({
      email: user.email,
      amount: numAmount,
      metadata: {
        user_id: user.id,
        full_name: profile?.full_name || 'Customer'
      },
      onSuccess: async (response) => {
        const reference = response.reference || response.trxref;
        toast.loading('Verifying payment with Paystack...', { id: 'fund-toast' });

        try {
          // Verify payment server side & credit user wallet in Supabase
          const result = await verifyPaystackPayment({
            reference: reference,
            user_id: user.id,
            amount: numAmount
          });

          if (result.status) {
            toast.success(`Wallet credited with ₦${numAmount.toLocaleString('en-NG')}!`, { id: 'fund-toast' });
            if (refreshProfile) await refreshProfile();
            navigate('/dashboard');
          } else {
            toast.error(result.message || 'Payment verification failed', { id: 'fund-toast' });
          }
        } catch (err) {
          console.error('Verification error:', err);
          toast.error(err.message || 'Payment verification failed', { id: 'fund-toast' });
        } finally {
          setLoading(false);
        }
      },
      onClose: () => {
        setLoading(false);
        toast.error('Payment cancelled by user');
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Wallet className="w-6 h-6 text-brand-accent" /> Fund Wallet
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Top up your wallet balance instantly using Paystack Debit Card, Bank Transfer, or USSD.
        </p>
      </div>

      {/* Main Funding Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Current Balance Display */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Current Balance</span>
            <p className="text-2xl font-black text-white">
              ₦{(profile?.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-accent text-brand-dark flex items-center justify-center font-extrabold">
            <PlusCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Amount Input Form */}
        <form onSubmit={handleFundWallet} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Enter Amount to Fund (₦)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">₦</span>
              <input
                type="number"
                min="100"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 2,000"
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Or Choose Preset Amount:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toString())}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                    amount === preset.toString()
                      ? 'bg-brand-accent text-brand-dark border-brand-accent shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ₦{preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Supported Gateway Banner */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs text-sky-900 font-medium">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-sky-600" />
              <span>Secured by Paystack Gateway</span>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-200/60 text-sky-800">
              Cards • Transfer • USSD
            </span>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full py-4 rounded-2xl bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-base shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Opening Paystack Checkout...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Pay ₦{amount ? parseFloat(amount).toLocaleString('en-NG') : '0'} via Paystack</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Wallet balance is credited immediately after payment.
          </p>

        </form>

      </div>
    </div>
  );
}
