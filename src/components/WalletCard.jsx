import React, { useState } from 'react';
import { Wallet, PlusCircle, Eye, EyeOff, Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WalletCard({ balance = 0, onFundWallet }) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-blue-900 to-cyan-800 text-white p-6 sm:p-8 shadow-2xl border border-cyan-400/30">
      
      {/* Background Glowing Circles */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Wallet Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-cyan-300">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-cyan-200">
              Available Wallet Balance
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 rounded-lg hover:bg-white/10 text-cyan-200 transition-colors"
              title={showBalance ? "Hide Balance" : "Show Balance"}
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Amount Display */}
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-md">
              {showBalance ? `₦${parseFloat(balance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '••••••••'}
            </span>
          </div>

          {/* Rewards Ticker */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-extrabold text-cyan-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Reseller Cashbacks Active • 100% Instant Delivery</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={onFundWallet}
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4 stroke-[3]" />
            <span>Fund Wallet</span>
          </button>

          <Link
            to="/dashboard/buy-data"
            className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-black text-xs uppercase tracking-wider border border-white/20 flex items-center justify-center space-x-2 transition-all hover:scale-105"
          >
            <span>Buy Data</span>
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>

      </div>
    </div>
  );
}
