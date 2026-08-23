import React, { useEffect, useState } from 'react';
import { getAllTransactions, getAllUsers } from '../../lib/supabase';
import { fetchVTPassBalance } from '../../lib/vtpass';
import { Users, DollarSign, TrendingUp, Wallet, ShieldCheck, RefreshCw } from 'lucide-react';
import TransactionTable from '../../components/TransactionTable';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [vtpassBalance, setVtpassBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [uData, tData, bal] = await Promise.all([
        getAllUsers(),
        getAllTransactions(),
        fetchVTPassBalance()
      ]);
      setUsers(uData);
      setTransactions(tData);
      setVtpassBalance(bal);
    } catch (err) {
      console.error('Error loading admin dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Compute metrics
  const totalUsers = users.length;
  const successfulTransactions = transactions.filter(t => t.status === 'success');
  const totalSalesCount = successfulTransactions.length;
  
  // Total Revenue (Total sum of successful purchase transactions)
  const totalRevenue = successfulTransactions
    .filter(t => t.type === 'buy_data' || t.type === 'buy_airtime')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  // Total Wallet Balances across all customers
  const totalCustomerWallets = users.reduce((sum, u) => sum + parseFloat(u.wallet_balance || 0), 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Admin Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            GARKO Platform Overview
          </h1>
        </div>

        <button
          onClick={loadAdminData}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold shadow-sm flex items-center space-x-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Metrics</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Users</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalUsers}</p>
            <p className="text-[11px] text-slate-500 mt-1">Registered Customers</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Sales Count */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Sales</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{totalSalesCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Successful Deliveries</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              ₦{totalRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Gross Purchases</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* VTPass Wallet Balance */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-accent font-bold uppercase tracking-wider">VTPass Provider Balance</p>
            <p className="text-2xl font-black text-white mt-1">
              ₦{parseFloat(vtpassBalance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">API Sandbox / Live</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-accent text-brand-dark flex items-center justify-center font-bold">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Customer Balance Summary */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-900 font-medium">
        <span>Cumulative Customer Wallet Liabilities:</span>
        <span className="font-black text-sm text-amber-950">
          ₦{totalCustomerWallets.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Global Recent Transactions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Recent System-Wide Transactions</h2>
        <TransactionTable transactions={transactions.slice(0, 10)} isAdmin={true} />
      </div>
    </div>
  );
}
