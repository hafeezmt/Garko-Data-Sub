import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deductWallet, refundWallet, recordTransaction } from '../../lib/supabase';
import { executeVtuPurchase, NETWORK_SERVICE_IDS } from '../../lib/vtpass';
import { Smartphone, Phone, Wallet, Loader2, CheckCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BuyAirtime({ user, profile, refreshProfile }) {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState('mtn');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  const networks = [
    { id: 'mtn', name: 'MTN Airtime', color: 'bg-amber-400 text-amber-950 font-bold' },
    { id: 'airtel', name: 'Airtel Airtime', color: 'bg-rose-600 text-white font-bold' },
    { id: 'glo', name: 'Glo Airtime', color: 'bg-emerald-600 text-white font-bold' },
    { id: '9mobile', name: '9mobile Airtime', color: 'bg-green-700 text-white font-bold' },
  ];

  const presetAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleAirtimePurchase = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    const cleanedPhone = phoneNumber.trim();

    if (!numAmount || numAmount < 50) {
      toast.error('Minimum airtime purchase is ₦50');
      return;
    }
    if (!cleanedPhone || cleanedPhone.length < 11) {
      toast.error('Please enter a valid 11-digit phone number');
      return;
    }

    const userBalance = parseFloat(profile?.wallet_balance || 0);
    if (userBalance < numAmount) {
      toast.error(`Insufficient wallet balance (₦${userBalance.toLocaleString()}). Please fund your wallet.`);
      return;
    }

    setPurchasing(true);
    const requestId = `GS-AIRTIME-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      // Step 1: Deduct wallet balance atomically
      await deductWallet(user.id, numAmount);
      if (refreshProfile) await refreshProfile();

      // Step 2: Record pending transaction
      await recordTransaction({
        user_id: user.id,
        type: 'buy_airtime',
        network: selectedNetwork.toUpperCase(),
        phone_number: cleanedPhone,
        amount: numAmount,
        plan: `₦${numAmount.toLocaleString()} Airtime Topup`,
        status: 'pending',
        vtpass_request_id: requestId
      });

      // Step 3: Call VTPass API proxy
      const serviceID = NETWORK_SERVICE_IDS[selectedNetwork]?.airtime || selectedNetwork;
      try {
        const vtpassRes = await executeVtuPurchase({
          request_id: requestId,
          serviceID: serviceID,
          billersCode: cleanedPhone,
          amount: numAmount,
          phone: cleanedPhone
        });

        if (vtpassRes.code === '000') {
          toast.success(`Success! ₦${numAmount.toLocaleString()} Airtime sent to ${cleanedPhone}`);
          if (refreshProfile) await refreshProfile();
          navigate('/dashboard/transactions');
        } else {
          throw new Error(vtpassRes.response_description || 'VTU service provider failed');
        }
      } catch (vtpassErr) {
        console.error('VTPass airtime purchase error, refunding:', vtpassErr);
        await refundWallet(user.id, numAmount);
        if (refreshProfile) await refreshProfile();
        toast.error(`Airtime failed: ${vtpassErr.message}. ₦${numAmount} refunded to your wallet.`);
      }
    } catch (err) {
      console.error('Airtime error:', err);
      toast.error(err.message || 'Error processing airtime purchase');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-brand-accent" /> Instant Airtime Topup
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Top up airtime directly for MTN, Airtel, Glo, or 9mobile numbers at zero convenience fee.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Network Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Select Telecom Network
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {networks.map((net) => (
              <button
                key={net.id}
                type="button"
                onClick={() => setSelectedNetwork(net.id)}
                className={`p-4 rounded-xl border font-black text-xs uppercase transition-all flex items-center justify-between ${
                  selectedNetwork === net.id
                    ? 'border-brand-accent bg-amber-500/10 text-brand-dark shadow-md ring-2 ring-brand-accent/30'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={`px-2 py-0.5 rounded text-[10px] ${net.color}`}>{net.id.toUpperCase()}</span>
                {selectedNetwork === net.id && <CheckCircle className="w-4 h-4 text-brand-accent" />}
              </button>
            ))}
          </div>
        </div>

        {/* Airtime Amount Input & Quick Presets */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Airtime Amount (₦)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₦</span>
            <input
              type="number"
              min="50"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-all"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-accent hover:text-brand-dark text-slate-700 text-xs font-bold transition-colors"
              >
                +₦{preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Recipient Phone Number
          </label>
          <div className="relative">
            <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              maxLength={11}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="08012345678"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Wallet Balance Indicator */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-brand-accent" /> Available Balance:
          </span>
          <span className="font-black text-slate-900 text-sm">
            ₦{(profile?.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleAirtimePurchase}
          disabled={purchasing || !amount || !phoneNumber}
          className="w-full py-4 rounded-2xl bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-base shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {purchasing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Dispensing Airtime...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Purchase ₦{amount ? parseFloat(amount).toLocaleString('en-NG') : '0'} Airtime</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
