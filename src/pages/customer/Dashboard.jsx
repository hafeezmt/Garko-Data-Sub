import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WalletCard from '../../components/WalletCard';
import TransactionTable from '../../components/TransactionTable';
import ReceiptModal from '../../components/ReceiptModal';
import { getUserTransactions, getProfile } from '../../lib/supabase';
import { 
  ArrowRight, 
  History, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw,
  Wifi,
  Smartphone,
  Tv,
  Zap,
  TrendingUp,
  PlusCircle,
  Home,
  Receipt,
  User,
  CheckCircle2
} from 'lucide-react';

export default function CustomerDashboard({ user, profile, refreshProfile }) {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (refreshProfile) await refreshProfile();
      const txs = await getUserTransactions(user.id);
      setTransactions(txs || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleFundWalletClick = () => {
    navigate('/dashboard/fund-wallet');
  };

  const handleRepeatTransaction = (tx) => {
    if (tx.type === 'buy_data') {
      navigate('/dashboard/buy-data', { state: { phone: tx.phone_number, network: tx.network } });
    } else {
      navigate('/dashboard/buy-data');
    }
  };

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card-light text-cyan-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
            GARKO Reseller Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{profile?.full_name?.split(' ')[0] || 'Partner'}</span>! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
            Manage your wallet, purchase cheap data & airtime instantly.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2.5 rounded-full bg-white border border-slate-200 hover:border-cyan-300 text-slate-800 text-xs font-black shadow-sm flex items-center space-x-2 transition-all hover:scale-105"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Balance</span>
        </button>
      </div>

      {/* Wallet Card Widget */}
      <WalletCard balance={profile?.wallet_balance || 0} onFundWallet={handleFundWalletClick} />

      {/* Horizontally Scrolling Cashback & Promo Banner */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex space-x-4 min-w-[600px]">
          <div className="flex-1 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/5 border border-amber-300/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black">
                🎁
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-950">Reseller Cashback Bonus</h4>
                <p className="text-[11px] text-slate-600 font-semibold">Earn 1.5% cashback on all MTN SME data orders today.</p>
              </div>
            </div>
            <Link to="/dashboard/buy-data" className="px-3 py-1.5 rounded-full bg-amber-400 text-amber-950 text-xs font-black hover:scale-105 transition-transform">
              Buy Now
            </Link>
          </div>

          <div className="flex-1 p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-cyan-500/5 border border-cyan-300/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black">
                ⚡
              </div>
              <div>
                <h4 className="text-xs font-black text-cyan-950">Instant 5-Second Topup</h4>
                <p className="text-[11px] text-slate-600 font-semibold">Zero transaction delay on Airtel & Glo gifting bundles.</p>
              </div>
            </div>
            <Link to="/dashboard/buy-data" className="px-3 py-1.5 rounded-full bg-cyan-400 text-slate-950 text-xs font-black hover:scale-105 transition-transform">
              Explore
            </Link>
          </div>
        </div>
      </div>

      {/* Categorized Services Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-950 tracking-tight">VTU Services & Quick Top-ups</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <Link
            to="/dashboard/buy-data"
            className="p-5 rounded-3xl glass-card-light glass-card-light-hover flex flex-col items-center justify-center text-center space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wifi className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-950 text-sm">Buy Cheap Data</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">SME & Direct Bundles</p>
            </div>
          </Link>

          <Link
            to="/dashboard/buy-airtime"
            className="p-5 rounded-3xl glass-card-light glass-card-light-hover flex flex-col items-center justify-center text-center space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-950 text-sm">Buy Airtime</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">2% Instant Discount</p>
            </div>
          </Link>

          <div className="p-5 rounded-3xl glass-card-light opacity-80 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-black rounded-full uppercase">Coming Soon</span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Tv className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-950 text-sm">Cable TV</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">DSTV, GOTV & Startimes</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-card-light opacity-80 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-black rounded-full uppercase">Coming Soon</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Zap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-950 text-sm">Electricity Token</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Prepaid & Postpaid</p>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950 tracking-tight">Recent Transactions</h2>
            <p className="text-xs text-slate-500 font-semibold">Click any row to view and print official digital receipt</p>
          </div>
          <Link
            to="/dashboard/transactions"
            className="text-xs font-black text-cyan-700 hover:text-cyan-800 flex items-center space-x-1 uppercase tracking-wider"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Transaction Table */}
        <TransactionTable 
          transactions={transactions.slice(0, 5)} 
          isAdmin={false} 
        />
      </div>

      {/* Mobile Quick-Action Floating Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="glass-nav-pill rounded-full p-2 flex items-center justify-around shadow-2xl border border-cyan-200/80">
          
          <Link to="/dashboard" className="flex flex-col items-center text-cyan-700 font-extrabold text-[10px]">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>

          <Link to="/dashboard/buy-data" className="flex flex-col items-center text-slate-600 font-bold text-[10px]">
            <Wifi className="w-5 h-5" />
            <span>Data</span>
          </Link>

          {/* Central Quick Action Button */}
          <Link
            to="/dashboard/buy-data"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 transform -translate-y-3 border-2 border-white"
          >
            <PlusCircle className="w-6 h-6 stroke-[3]" />
          </Link>

          <Link to="/dashboard/transactions" className="flex flex-col items-center text-slate-600 font-bold text-[10px]">
            <Receipt className="w-5 h-5" />
            <span>History</span>
          </Link>

          <Link to="/dashboard/profile" className="flex flex-col items-center text-slate-600 font-bold text-[10px]">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>

        </div>
      </div>

      {/* Digital Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        transaction={selectedReceipt}
        onRepeat={handleRepeatTransaction}
      />

    </div>
  );
}
