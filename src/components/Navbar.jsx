import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, ShieldCheck, Wallet } from 'lucide-react';
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
    <header className="glass-nav sticky top-0 z-50 shadow-lg shadow-cyan-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand Image */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="GARKO DATA SUB" 
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105 filter drop-shadow-[0_0_12px_rgba(0,210,255,0.5)]"
            />
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {profile?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="px-4 py-2 rounded-xl bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow/20 text-xs font-black flex items-center space-x-1.5 border border-brand-yellow/40 transition-all shadow-sm backdrop-blur-md"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-100 px-4 py-2 rounded-xl text-xs font-extrabold border border-cyan-500/30 transition-all shadow-inner backdrop-blur-md"
                  >
                    <Wallet className="w-4 h-4 text-brand-cyan" />
                    <span className="text-white">₦{(profile?.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  </Link>
                )}

                <Link
                  to={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-2 text-slate-200 hover:text-brand-cyan px-3 py-2 text-sm font-extrabold transition-colors"
                >
                  <User className="w-4 h-4 text-brand-cyan" />
                  <span className="hidden md:inline">{profile?.full_name || 'Account'}</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900/80 transition-colors backdrop-blur-md border border-slate-800"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-200 hover:text-brand-cyan px-4 py-2 rounded-xl text-sm font-extrabold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-cyan-400 hover:to-blue-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-sm shadow-glow-cyan hover:shadow-lg transition-all transform hover:-translate-y-0.5"
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
