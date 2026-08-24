import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, PlusCircle, Wifi, Smartphone } from 'lucide-react';

export default function WalletCard({ profile }) {
  const balance = parseFloat(profile?.wallet_balance || 0);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand-navy to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-cyan-500/30">
      {/* Decorative Glow background */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-72 h-72 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: User Info & Balance */}
        <div>
          <div className="flex items-center space-x-2 text-brand-cyan text-xs uppercase tracking-widest font-extrabold mb-2">
            <Wallet className="w-4 h-4 text-brand-cyan" />
            <span>Available Wallet Balance</span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-5xl font-black tracking-tight text-white filter drop-shadow-[0_0_10px_rgba(0,210,255,0.3)]">
              ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-2 font-medium">
            Account Holder: <span className="text-brand-yellow font-extrabold">{profile?.full_name || 'Valued Partner'}</span>
          </p>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/fund-wallet"
            className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-cyan-400 hover:to-blue-600 text-slate-950 font-black text-sm shadow-glow-cyan flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Fund Wallet</span>
          </Link>

          <Link
            to="/dashboard/buy-data"
            className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-sm border border-cyan-500/30 flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <Wifi className="w-4 h-4 text-brand-cyan" />
            <span>Buy Data</span>
          </Link>

          <Link
            to="/dashboard/buy-airtime"
            className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-sm border border-cyan-500/30 flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <Smartphone className="w-4 h-4 text-brand-yellow" />
            <span>Buy Airtime</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
