import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, Clock, XCircle, ArrowUpRight, ArrowDownLeft, Phone } from 'lucide-react';

export default function TransactionTable({ transactions = [], isAdmin = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [networkFilter, setNetworkFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      (tx.phone_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.plan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.vtpass_request_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.profiles?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesNetwork = networkFilter === 'all' || (tx.network || '').toLowerCase() === networkFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || (tx.status || '').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesNetwork && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Success
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            Pending
          </span>
        );
      case 'failed':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
    }
  };

  const getNetworkBadge = (network) => {
    const net = (network || '').toLowerCase();
    let bg = 'bg-slate-100 text-slate-700';
    if (net.includes('mtn')) bg = 'bg-amber-100 text-amber-900 font-black border border-amber-300';
    else if (net.includes('airtel')) bg = 'bg-rose-100 text-rose-900 font-black border border-rose-300';
    else if (net.includes('glo')) bg = 'bg-emerald-100 text-emerald-900 font-black border border-emerald-300';
    else if (net.includes('9mobile') || net.includes('etisalat')) bg = 'bg-green-100 text-green-900 font-black border border-green-300';
    else if (net.includes('paystack')) bg = 'bg-cyan-100 text-cyan-900 font-black border border-cyan-300';

    return (
      <span className={`inline-block px-2 py-0.5 rounded text-[11px] uppercase tracking-wider ${bg}`}>
        {network || 'N/A'}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'fund_wallet':
        return (
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <ArrowDownLeft className="w-3.5 h-3.5" /> Wallet Fund
          </span>
        );
      case 'buy_data':
        return (
          <span className="flex items-center gap-1 text-brand-blue font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" /> Data Purchase
          </span>
        );
      case 'buy_airtime':
        return (
          <span className="flex items-center gap-1 text-indigo-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" /> Airtime Purchase
          </span>
        );
      default:
        return type;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Controls Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isAdmin ? "Search user, phone, plan, ref..." : "Search phone, plan, request ID..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mr-1 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-brand-cyan" /> Filter:
          </div>

          <select
            value={networkFilter}
            onChange={(e) => setNetworkFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-cyan"
          >
            <option value="all">All Networks</option>
            <option value="mtn">MTN</option>
            <option value="airtel">Airtel</option>
            <option value="glo">Glo</option>
            <option value="9mobile">9mobile</option>
            <option value="paystack">Paystack</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-cyan"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-extrabold">
              <th className="py-4 px-4 sm:px-6">Date & Ref</th>
              {isAdmin && <th className="py-4 px-4">User</th>}
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4">Network</th>
              <th className="py-4 px-4">Details / Phone</th>
              <th className="py-4 px-4 text-right">Amount</th>
              <th className="py-4 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-cyan-500/5 transition-colors">
                  {/* Date & Ref */}
                  <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                    <div className="font-bold text-slate-900">
                      {new Date(tx.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {tx.vtpass_request_id ? tx.vtpass_request_id.slice(-8) : tx.id.slice(-8)}
                    </div>
                  </td>

                  {/* User (Admin only) */}
                  {isAdmin && (
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{tx.profiles?.full_name || 'Customer'}</div>
                      <div className="text-xs text-slate-500">{tx.profiles?.phone || '-'}</div>
                    </td>
                  )}

                  {/* Type */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getTypeLabel(tx.type)}
                  </td>

                  {/* Network */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getNetworkBadge(tx.network)}
                  </td>

                  {/* Details / Phone */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-800">{tx.plan || 'Standard Transaction'}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                      <Phone className="w-3 h-3 text-brand-cyan" /> {tx.phone_number || '-'}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <span className={`font-black ${tx.type === 'fund_wallet' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'fund_wallet' ? '+' : '-'}₦{parseFloat(tx.amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center">
                  <div className="max-w-xs mx-auto text-slate-400">
                    <p className="text-slate-600 font-bold text-base">No transactions found</p>
                    <p className="text-xs text-slate-400 mt-1">There are no records matching your current filter settings.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
