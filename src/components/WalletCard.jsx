import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, PlusCircle, Wifi, Smartphone, ArrowUpRight } from 'lucide-react';

export default function WalletCard({ profile }) {
  const balance = parseFloat(profile?.wallet_balance || 0);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-slate-900 to-brand-blue text-white p-6 sm:p-8 shadow-xl border border-slate-800">
      {/* Decorative Glow background */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: User Info & Balance */}
        <div>
          <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase tracking-widest font-semibold mb-2">
            <Wallet className="w-4 h-4 text-brand-accent" />
            <span>Available Balance</span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2 font-medium">
            Account Owner: <span className="text-slate-200 font-bold">{profile?.full_name || 'Valued User'}</span>
          </p>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/fund-wallet"
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-sm shadow-lg hover:shadow-brand-accent/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Fund Wallet</span>
          </Link>

          <Link
            to="/dashboard/buy-data"
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
          >
            <Wifi className="w-4 h-4 text-amber-400" />
            <span>Buy Data</span>
          </Link>

          <Link
            to="/dashboard/buy-airtime"
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
          >
            <Smartphone className="w-4 h-4 text-sky-400" />
            <span>Buy Airtime</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
