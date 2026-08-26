import React from 'react';
import { CheckCircle2, Printer, RotateCcw, X, Share2, ShieldCheck, Download } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, transaction, onRepeat }) {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSuccess = (transaction.status || '').toLowerCase() === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-cyan-200/80">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-cyan-500 via-sky-600 to-blue-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Checkmark Animation */}
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center mx-auto mb-3 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[11px] font-black uppercase tracking-wider mb-1">
            Official Receipt
          </span>
          <h3 className="text-2xl font-black">Transaction Successful</h3>
          <p className="text-xs text-cyan-100 font-medium mt-1">GARKO DATA SUB VTU Service</p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-4 text-slate-900">
          
          {/* Amount Showcase */}
          <div className="text-center pb-4 border-b border-slate-100">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Amount Paid</span>
            <div className="text-3xl font-black text-cyan-700 mt-0.5">
              ₦{parseFloat(transaction.amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Service Plan</span>
              <span className="font-extrabold text-slate-900">{transaction.plan || 'Standard Service'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Phone / Account</span>
              <span className="font-mono font-extrabold text-slate-900">{transaction.phone_number || '-'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Network Provider</span>
              <span className="font-extrabold text-slate-900 uppercase">{transaction.network || 'VTU Gateway'}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Transaction Ref</span>
              <span className="font-mono text-slate-700 font-bold">{transaction.vtpass_request_id || transaction.id}</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Date & Time</span>
              <span className="text-slate-900 font-bold">
                {new Date(transaction.created_at || Date.now()).toLocaleString('en-NG')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-2.5">
            {onRepeat && (
              <button
                onClick={() => { onClose(); onRepeat(transaction); }}
                className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <RotateCcw className="w-4 h-4 stroke-[3]" />
                <span>Repeat Transaction</span>
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-slate-200"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center transition-colors"
              >
                Done
              </button>
            </div>
          </div>

          {/* Security Footer */}
          <div className="pt-2 text-center text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-cyan-600" /> Verified by GARKO DATA SUB Automated VTU Server
          </div>

        </div>
      </div>
    </div>
  );
}
