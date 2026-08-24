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
    <header className="glass-nav-light sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand Image */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="GARKO DATA SUB" 
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105 filter drop-shadow-[0_2px_8px_rgba(0,150,225,0.25)]"
            />
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {profile?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 text-xs font-black flex items-center space-x-1.5 border border-amber-400/40 transition-all shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center space-x-2 bg-slate-100/90 hover:bg-slate-200/90 text-slate-900 px-4 py-2 rounded-xl text-xs font-extrabold border border-cyan-300/60 transition-all shadow-sm"
                  >
                    <Wallet className="w-4 h-4 text-cyan-600" />
                    <span className="text-slate-950 font-black">₦{(profile?.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  </Link>
                )}

                <Link
                  to={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-2 text-slate-900 hover:text-cyan-600 px-3 py-2 text-sm font-extrabold transition-colors"
                >
                  <User className="w-4 h-4 text-cyan-600" />
                  <span className="hidden md:inline">{profile?.full_name || 'Account'}</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors border border-slate-200"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-900 hover:text-cyan-600 px-4 py-2 rounded-xl text-sm font-black transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-sm shadow-md shadow-cyan-500/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
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
