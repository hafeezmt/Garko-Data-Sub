import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, PlusCircle, Wifi, Smartphone } from 'lucide-react';

export default function WalletCard({ profile }) {
  const balance = parseFloat(profile?.wallet_balance || 0);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl shadow-cyan-500/20 border border-cyan-300/40">
      {/* Decorative Glow background Orbs */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: User Info & Balance */}
        <div>
          <div className="flex items-center space-x-2 text-cyan-100 text-xs uppercase tracking-widest font-black mb-2">
            <Wallet className="w-4 h-4 text-white" />
            <span>Available Wallet Balance</span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-5xl font-black tracking-tight text-white filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
              ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <p className="text-xs text-cyan-100 mt-2 font-bold">
            Account Holder: <span className="text-amber-300 font-black">{profile?.full_name || 'Valued Partner'}</span>
          </p>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/fund-wallet"
            className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4 stroke-[3]" />
            <span>Fund Wallet</span>
          </Link>

          <Link
            to="/dashboard/buy-data"
            className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm border border-white/30 backdrop-blur-md flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <Wifi className="w-4 h-4 text-cyan-200" />
            <span>Buy Data</span>
          </Link>

          <Link
            to="/dashboard/buy-airtime"
            className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm border border-white/30 backdrop-blur-md flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <Smartphone className="w-4 h-4 text-amber-300" />
            <span>Buy Airtime</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
