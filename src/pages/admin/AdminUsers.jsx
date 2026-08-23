import React, { useEffect, useState } from 'react';
import { getAllUsers, adminFundUserWallet, recordTransaction } from '../../lib/supabase';
import { Users, Search, PlusCircle, Wallet, ShieldCheck, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Manual funding modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [funding, setFunding] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFundUser = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(fundAmount);
    if (!selectedUser || !numAmount || numAmount <= 0) {
      toast.error('Please enter a valid funding amount');
      return;
    }

    setFunding(true);
    try {
      // Credit wallet
      await adminFundUserWallet(selectedUser.id, numAmount);

      // Record transaction log
      await recordTransaction({
        user_id: selectedUser.id,
        type: 'fund_wallet',
        network: 'Admin Credit',
        phone_number: selectedUser.phone || '-',
        amount: numAmount,
        plan: 'Manual Admin Wallet Funding',
        status: 'success',
        vtpass_request_id: 'ADMIN-' + Date.now()
      });

      toast.success(`Successfully funded ${selectedUser.full_name}'s wallet with ₦${numAmount.toLocaleString()}!`);
      setSelectedUser(null);
      setFundAmount('');
      fetchUsers();
    } catch (err) {
      console.error('Admin fund error:', err);
      toast.error(err.message || 'Failed to fund user wallet');
    } finally {
      setFunding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-accent" /> User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View registered reseller users, inspect wallet balances, and manually credit wallets.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-6">User / Name</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4 text-right">Wallet Balance</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{u.full_name || 'Customer'}</div>
                      <div className="text-xs text-slate-400 font-mono">{u.id.slice(0, 18)}...</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                      {u.phone || '-'}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        u.role === 'admin' 
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role || 'user'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-extrabold text-slate-900">
                        ₦{parseFloat(u.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                      {new Date(u.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-1.5 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-brand-dark text-xs font-bold transition-all shadow-sm flex items-center space-x-1 mx-auto"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Fund Wallet</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No users found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Wallet Funding Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center text-brand-dark font-extrabold">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Fund User Wallet</h3>
                <p className="text-xs text-slate-500">{selectedUser.full_name}</p>
              </div>
            </div>

            <form onSubmit={handleFundUser} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Current Wallet Balance
                </label>
                <input
                  type="text"
                  disabled
                  value={`₦${parseFloat(selectedUser.wallet_balance || 0).toLocaleString('en-NG')}`}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Amount to Credit (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₦</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={funding || !fundAmount}
                  className="w-full py-3.5 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {funding ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Crediting Wallet...</span>
                    </>
                  ) : (
                    <>
                      <span>Credit ₦{fundAmount ? parseFloat(fundAmount).toLocaleString() : '0'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
