import React from 'react';
import { Wifi, CheckCircle, ArrowRight } from 'lucide-react';

export default function DataPlanCard({ plan, selected, onSelect, network }) {
  const getNetworkStyle = (net) => {
    switch ((net || '').toLowerCase()) {
      case 'mtn':
        return {
          badge: 'bg-amber-400 text-amber-950 font-black',
          border: selected ? 'border-cyan-500 ring-2 ring-cyan-400/50 shadow-md' : 'border-slate-200 hover:border-cyan-400',
          accent: 'text-amber-600'
        };
      case 'airtel':
        return {
          badge: 'bg-rose-600 text-white font-black',
          border: selected ? 'border-cyan-500 ring-2 ring-cyan-400/50 shadow-md' : 'border-slate-200 hover:border-cyan-400',
          accent: 'text-rose-600'
        };
      case 'glo':
        return {
          badge: 'bg-emerald-600 text-white font-black',
          border: selected ? 'border-cyan-500 ring-2 ring-cyan-400/50 shadow-md' : 'border-slate-200 hover:border-cyan-400',
          accent: 'text-emerald-600'
        };
      case '9mobile':
      case 'etisalat':
      default:
        return {
          badge: 'bg-green-700 text-white font-black',
          border: selected ? 'border-cyan-500 ring-2 ring-cyan-400/50 shadow-md' : 'border-slate-200 hover:border-cyan-400',
          accent: 'text-green-700'
        };
    }
  };

  const style = getNetworkStyle(network || plan.network);
  const price = parseFloat(plan.selling_price || plan.variation_amount || plan.vtpass_price || 0);

  return (
    <div
      onClick={() => onSelect(plan)}
      className={`relative cursor-pointer rounded-3xl glass-card-light glass-card-light-hover p-6 border transition-all duration-300 flex flex-col justify-between ${style.border}`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider ${style.badge}`}>
            {(network || plan.network || 'DATA').toUpperCase()}
          </span>
          {selected && (
            <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <CheckCircle className="w-4 h-4 fill-current stroke-white text-slate-950" />
            </div>
          )}
        </div>

        {/* Plan Name */}
        <h4 className="text-base font-extrabold text-slate-900 line-clamp-2">
          {plan.plan_name || plan.name || 'Data Plan'}
        </h4>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
          <Wifi className="w-3.5 h-3.5 text-cyan-600" /> Instant Automated Delivery
        </p>
      </div>

      {/* Pricing & Selection */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">Price</span>
          <span className="text-lg font-black text-slate-950">
            ₦{price.toLocaleString('en-NG')}
          </span>
        </div>

        <button
          type="button"
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
            selected 
              ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 shadow-md' 
              : 'bg-slate-100 text-slate-800 hover:bg-cyan-400 hover:text-slate-950'
          }`}
        >
          {selected ? 'Selected' : 'Select'}
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
