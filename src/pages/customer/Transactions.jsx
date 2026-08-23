import React, { useEffect, useState } from 'react';
import TransactionTable from '../../components/TransactionTable';
import { getUserTransactions } from '../../lib/supabase';
import { History, RefreshCw } from 'lucide-react';

export default function CustomerTransactions({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserTransactions(user.id);
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-brand-accent" /> Transaction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete record of your data purchases, airtime VTU, and wallet funding top-ups.
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold shadow-sm flex items-center space-x-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Transaction Table */}
      <TransactionTable transactions={transactions} isAdmin={false} />
    </div>
  );
}
