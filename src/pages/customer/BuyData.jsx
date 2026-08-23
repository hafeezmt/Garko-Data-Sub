import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataPlanCard from '../../components/DataPlanCard';
import { getDataPrices, deductWallet, refundWallet, recordTransaction, updateProfile } from '../../lib/supabase';
import { fetchServiceVariations, executeVtuPurchase, NETWORK_SERVICE_IDS } from '../../lib/vtpass';
import { Wifi, Phone, Wallet, Loader2, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BuyData({ user, profile, refreshProfile }) {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState('mtn');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const networks = [
    { id: 'mtn', name: 'MTN', color: 'bg-amber-400 text-amber-950 font-bold', border: 'border-amber-400' },
    { id: 'airtel', name: 'Airtel', color: 'bg-rose-600 text-white font-bold', border: 'border-rose-500' },
    { id: 'glo', name: 'Glo', color: 'bg-emerald-600 text-white font-bold', border: 'border-emerald-500' },
    { id: '9mobile', name: '9mobile', color: 'bg-green-700 text-white font-bold', border: 'border-green-600' },
  ];

  // Fetch plans on network change
  useEffect(() => {
    async function loadDataPlans() {
      setLoadingPlans(true);
      setSelectedPlan(null);
      try {
        // First try fetching from database data_prices table
        const dbPrices = await getDataPrices();
        const networkPrices = dbPrices.filter(p => p.network === selectedNetwork && p.is_active !== false);

        if (networkPrices && networkPrices.length > 0) {
          setPlans(networkPrices);
        } else {
          // Fallback to VTPass variations API
          const serviceID = NETWORK_SERVICE_IDS[selectedNetwork]?.data || `${selectedNetwork}-data`;
          const variations = await fetchServiceVariations(serviceID);
          const mappedPlans = variations.map(v => ({
            id: v.variation_code,
            network: selectedNetwork,
            plan_name: v.name,
            vtpass_variation_code: v.variation_code,
            vtpass_price: parseFloat(v.variation_amount || 0),
            selling_price: parseFloat(v.variation_amount || 0)
          }));
          setPlans(mappedPlans);
        }
      } catch (err) {
        console.error('Error loading data plans:', err);
        toast.error('Failed to load data plans. Using offline fallback.');
      } finally {
        setLoadingPlans(false);
      }
    }
    loadDataPlans();
  }, [selectedNetwork]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast.error('Please select a data plan bundle');
      return;
    }
    const cleanedPhone = phoneNumber.trim();
    if (!cleanedPhone || cleanedPhone.length < 11) {
      toast.error('Please enter a valid 11-digit phone number');
      return;
    }

    const price = parseFloat(selectedPlan.selling_price);
    const userBalance = parseFloat(profile?.wallet_balance || 0);

    if (userBalance < price) {
      toast.error(`Insufficient balance (₦${userBalance.toLocaleString()}). Required: ₦${price.toLocaleString()}`);
      return;
    }

    setPurchasing(true);
    const requestId = `GS-DATA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      // Step 1: Deduct wallet balance atomically
      await deductWallet(user.id, price);
      if (refreshProfile) await refreshProfile();

      // Step 2: Record pending transaction
      const tx = await recordTransaction({
        user_id: user.id,
        type: 'buy_data',
        network: selectedNetwork.toUpperCase(),
        phone_number: cleanedPhone,
        amount: price,
        plan: selectedPlan.plan_name,
        status: 'pending',
        vtpass_request_id: requestId
      });

      // Step 3: Call VTPass API
      const serviceID = NETWORK_SERVICE_IDS[selectedNetwork]?.data || `${selectedNetwork}-data`;
      try {
        const vtpassRes = await executeVtuPurchase({
          request_id: requestId,
          serviceID: serviceID,
          billersCode: cleanedPhone,
          variation_code: selectedPlan.vtpass_variation_code,
          amount: price,
          phone: cleanedPhone
        });

        if (vtpassRes.code === '000') {
          // Transaction Success
          toast.success(`Success! ${selectedPlan.plan_name} sent to ${cleanedPhone}`);
          if (refreshProfile) await refreshProfile();
          navigate('/dashboard/transactions');
        } else {
          throw new Error(vtpassRes.response_description || 'VTU provider error');
        }
      } catch (vtpassErr) {
        console.error('VTPass call failed, executing refund:', vtpassErr);
        // Step 4: Refund wallet balance atomically if VTPass fails
        await refundWallet(user.id, price);
        if (refreshProfile) await refreshProfile();
        
        toast.error(`Purchase failed: ${vtpassErr.message}. ₦${price} refunded to your wallet.`);
      }
    } catch (err) {
      console.error('Deduction/Purchase error:', err);
      toast.error(err.message || 'Error processing purchase');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Wifi className="w-6 h-6 text-brand-accent" /> Buy Data Bundles
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Instant automated data delivery to any MTN, Airtel, Glo, or 9mobile line.
        </p>
      </div>

      {/* Network Selector Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          1. Select Telecom Network
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {networks.map((net) => (
            <button
              key={net.id}
              type="button"
              onClick={() => setSelectedNetwork(net.id)}
              className={`p-4 rounded-xl border font-black text-sm uppercase transition-all flex items-center justify-between ${
                selectedNetwork === net.id
                  ? 'border-brand-accent bg-amber-500/10 text-brand-dark shadow-md ring-2 ring-brand-accent/30'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className={`px-2.5 py-1 rounded-md text-xs ${net.color}`}>{net.name}</span>
              {selectedNetwork === net.id && <CheckCircle className="w-5 h-5 text-brand-accent" />}
            </button>
          ))}
        </div>
      </div>

      {/* Form & Plan Cards Grid */}
      <div className="space-y-4">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          2. Choose Data Plan Bundle
        </label>

        {loadingPlans ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 animate-spin text-brand-accent mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-semibold">Loading available data plans...</p>
          </div>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <DataPlanCard
                key={plan.id || plan.vtpass_variation_code}
                plan={plan}
                network={selectedNetwork}
                selected={selectedPlan?.vtpass_variation_code === plan.vtpass_variation_code}
                onSelect={(p) => setSelectedPlan(p)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs font-medium">
            <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-amber-600" />
            No active data plans currently available for {selectedNetwork.toUpperCase()}. Please select another network.
          </div>
        )}
      </div>

      {/* Phone & Confirmation Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          3. Enter Recipient Phone Number
        </label>

        <div className="space-y-4">
          <div className="relative max-w-md">
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

          {/* Selected Plan Summary Banner */}
          {selectedPlan && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Selected Bundle:</span>
                <p className="font-bold text-white text-sm">{selectedPlan.plan_name}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium">Total Cost:</span>
                <p className="font-black text-brand-accent text-lg">
                  ₦{parseFloat(selectedPlan.selling_price).toLocaleString('en-NG')}
                </p>
              </div>
            </div>
          )}

          {/* Wallet Balance Warning */}
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-2">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-brand-accent" /> Your Wallet Balance:
              <strong className="text-slate-900 font-bold">
                ₦{(profile?.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </strong>
            </span>
          </div>

          {/* Purchase CTA */}
          <button
            type="button"
            onClick={handlePurchase}
            disabled={purchasing || !selectedPlan || !phoneNumber}
            className="w-full py-4 rounded-2xl bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-base shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {purchasing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Order & Dispensing Data...</span>
              </>
            ) : (
              <>
                <span>Confirm & Pay ₦{selectedPlan ? parseFloat(selectedPlan.selling_price).toLocaleString('en-NG') : '0'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
