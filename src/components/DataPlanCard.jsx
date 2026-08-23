import React from 'react';
import { Wifi, CheckCircle, ArrowRight } from 'lucide-react';

export default function DataPlanCard({ plan, selected, onSelect, network }) {
  const getNetworkStyle = (net) => {
    switch ((net || '').toLowerCase()) {
      case 'mtn':
        return {
          badge: 'bg-amber-400 text-amber-950 font-bold',
          border: selected ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200 hover:border-amber-400',
          accent: 'text-amber-600'
        };
      case 'airtel':
        return {
          badge: 'bg-rose-600 text-white font-bold',
          border: selected ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-slate-200 hover:border-rose-400',
          accent: 'text-rose-600'
        };
      case 'glo':
        return {
          badge: 'bg-emerald-600 text-white font-bold',
          border: selected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-200 hover:border-emerald-400',
          accent: 'text-emerald-600'
        };
      case '9mobile':
      case 'etisalat':
      default:
        return {
          badge: 'bg-green-700 text-white font-bold',
          border: selected ? 'border-green-600 ring-2 ring-green-600/30' : 'border-slate-200 hover:border-green-400',
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
            <div className="w-5 h-5 rounded-full bg-brand-accent text-brand-dark flex items-center justify-center">
              <CheckCircle className="w-4 h-4 fill-current stroke-white" />
            </div>
          )}
        </div>

        {/* Plan Name */}
        <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-accent line-clamp-2">
          {plan.plan_name || plan.name || 'Data Plan'}
        </h4>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <Wifi className="w-3.5 h-3.5 text-slate-400" /> Instant Delivery
        </p>
      </div>

      {/* Pricing & Selection */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Price</span>
          <span className="text-lg font-black text-slate-900">
            ₦{price.toLocaleString('en-NG')}
          </span>
        </div>

        <button
          type="button"
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
            selected 
              ? 'bg-brand-accent text-brand-dark' 
              : 'bg-slate-100 text-slate-700 hover:bg-brand-accent hover:text-brand-dark'
          }`}
        >
          {selected ? 'Selected' : 'Select'}
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
