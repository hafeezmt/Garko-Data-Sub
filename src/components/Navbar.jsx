import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wifi, LogOut, User, ShieldCheck, Wallet } from 'lucide-react';
import { signOutUser } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Navbar({ user, profile }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Error signing out: ' + err.message);
    }
  };

  return (
    <header className="bg-brand-dark text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center text-brand-dark font-extrabold shadow-md group-hover:scale-105 transition-transform">
              <Wifi className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-white">
                GARKO <span className="text-brand-accent">DATA SUB</span>
              </span>
              <span className="block text-[10px] uppercase font-semibold text-slate-400 -mt-1 tracking-widest">
                Instant VTU & Data
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {profile?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-bold flex items-center space-x-1 border border-amber-500/30 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Wallet className="w-4 h-4 text-brand-accent" />
                    <span>₦{(profile?.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  </Link>
                )}

                <Link
                  to={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-2 text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{profile?.full_name || 'Account'}</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-accent hover:bg-brand-accent-hover text-brand-dark px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

        </div>
      </div>
    </header>
  );
}
