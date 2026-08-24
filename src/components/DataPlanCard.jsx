import React from 'react';
import { Wifi, CheckCircle, ArrowRight } from 'lucide-react';

export default function DataPlanCard({ plan, selected, onSelect, network }) {
  const getNetworkStyle = (net) => {
    switch ((net || '').toLowerCase()) {
      case 'mtn':
        return {
          badge: 'bg-amber-400 text-amber-950 font-black',
          border: selected ? 'border-brand-cyan ring-2 ring-brand-cyan/40 shadow-glow-cyan' : 'border-slate-200 hover:border-brand-cyan',
          accent: 'text-amber-600'
        };
      case 'airtel':
        return {
          badge: 'bg-rose-600 text-white font-black',
          border: selected ? 'border-brand-cyan ring-2 ring-brand-cyan/40 shadow-glow-cyan' : 'border-slate-200 hover:border-brand-cyan',
          accent: 'text-rose-600'
        };
      case 'glo':
        return {
          badge: 'bg-emerald-600 text-white font-black',
          border: selected ? 'border-brand-cyan ring-2 ring-brand-cyan/40 shadow-glow-cyan' : 'border-slate-200 hover:border-brand-cyan',
          accent: 'text-emerald-600'
        };
      case '9mobile':
      case 'etisalat':
      default:
        return {
          badge: 'bg-green-700 text-white font-black',
          border: selected ? 'border-brand-cyan ring-2 ring-brand-cyan/40 shadow-glow-cyan' : 'border-slate-200 hover:border-brand-cyan',
          accent: 'text-green-700'
        };
    }
  };

  const style = getNetworkStyle(network || plan.network);
  const price = parseFloat(plan.selling_price || plan.variation_amount || plan.vtpass_price || 0);

  return (
    <div
      onClick={() => onSelect(plan)}
      className={`relative cursor-pointer rounded-2xl bg-white p-5 border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${style.border}`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider ${style.badge}`}>
            {(network || plan.network || 'DATA').toUpperCase()}
          </span>
          {selected && (
            <div className="w-5 h-5 rounded-full bg-brand-cyan text-slate-950 flex items-center justify-center font-bold">
              <CheckCircle className="w-4 h-4 fill-current stroke-white text-brand-dark" />
            </div>
          )}
        </div>

        {/* Plan Name */}
        <h4 className="text-base font-extrabold text-slate-900 line-clamp-2">
          {plan.plan_name || plan.name || 'Data Plan'}
        </h4>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <Wifi className="w-3.5 h-3.5 text-brand-cyan" /> Instant Automated Delivery
        </p>
      </div>

      {/* Pricing & Selection */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Price</span>
          <span className="text-lg font-black text-slate-900">
            ₦{price.toLocaleString('en-NG')}
          </span>
        </div>

        <button
          type="button"
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
            selected 
              ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 shadow-sm' 
              : 'bg-slate-100 text-slate-700 hover:bg-brand-cyan hover:text-slate-950'
          }`}
        >
          {selected ? 'Selected' : 'Select'}
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
