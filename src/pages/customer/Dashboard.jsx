import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import WalletCard from '../../components/WalletCard';
import TransactionTable from '../../components/TransactionTable';
import { getUserTransactions, getProfile } from '../../lib/supabase';
import { ArrowRight, History, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export default function CustomerDashboard({ user, profile, refreshProfile }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (refreshProfile) await refreshProfile();
      const txs = await getUserTransactions(user.id);
      setTransactions(txs);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-brand-accent">{profile?.full_name?.split(' ')[0] || 'Partner'}</span>! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your wallet, purchase cheap data & airtime instantly.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold shadow-sm flex items-center space-x-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Wallet Card Widget */}
      <WalletCard profile={profile} />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Transactions</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{transactions.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Successful Orders</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {transactions.filter(t => t.status === 'success').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Account Role</p>
            <p className="text-2xl font-black text-brand-dark uppercase text-sm tracking-wider mt-1.5">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-extrabold">
                {profile?.role || 'Customer'}
              </span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
            <p className="text-xs text-slate-500">Your latest data & wallet top-up activities</p>
          </div>
          <Link
            to="/dashboard/transactions"
            className="text-xs font-bold text-brand-accent hover:text-brand-accent-hover flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <TransactionTable transactions={transactions.slice(0, 5)} isAdmin={false} />
      </div>
    </div>
  );
}
