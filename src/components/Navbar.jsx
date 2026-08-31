import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Wifi, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Zap,
  Tag,
  HelpCircle,
  Star,
  Layers,
  ChevronDown
} from 'lucide-react';
import { signOutUser } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Navbar({ user, profile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to sign out');
    }
  };

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-4 sm:top-6 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Expanded Electric Cyan Floating Pill Glass Navbar */}
      <nav className="glass-nav-pill rounded-full px-5 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between transition-all duration-300">
        
        {/* Brand Logo - Enlarged & Glowing */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img 
            src="/logo.png" 
            alt="GARKO DATA SUB" 
            className="h-11 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_14px_rgba(0,210,255,0.35)]" 
          />
        </Link>

        {/* Center Navigation Links */}
        {isHome && (
          <div className="hidden lg:flex items-center space-x-1 font-bold text-[11px] uppercase tracking-wider text-slate-700">
            <a 
              href="#" 
              className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-800 font-black transition-all shadow-sm flex items-center gap-1 border border-cyan-200/80"
            >
              <Sparkles className="w-3 h-3 text-cyan-600 fill-current" />
              Overview
            </a>
            <a 
              href="#calculator" 
              className="px-3 py-1.5 rounded-full hover:text-cyan-600 hover:bg-cyan-50/80 transition-all"
            >
              Estimator
            </a>
            <a 
              href="#services" 
              className="px-3 py-1.5 rounded-full hover:text-cyan-600 hover:bg-cyan-50/80 transition-all"
            >
              Services
            </a>
            <a 
              href="#pricing" 
              className="px-3 py-1.5 rounded-full hover:text-cyan-600 hover:bg-cyan-50/80 transition-all"
            >
              Pricing
            </a>
            <a 
              href="#reviews" 
              className="px-3 py-1.5 rounded-full hover:text-cyan-600 hover:bg-cyan-50/80 transition-all"
            >
              Reviews
            </a>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                to={profile?.role === 'admin' ? "/admin" : "/dashboard"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-50 hover:bg-cyan-100 text-cyan-950 font-black text-xs uppercase tracking-wider transition-all border border-cyan-200 shadow-sm hover:scale-105"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-600" />
                <span>{profile?.role === 'admin' ? "Admin Portal" : "Dashboard"}</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="p-2.5 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full text-slate-800 hover:text-cyan-600 font-black text-xs uppercase tracking-wider transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full text-slate-800 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-6 rounded-3xl glass-nav-pill shadow-2xl border border-cyan-200/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 text-slate-900">
          {isHome && (
            <div className="flex flex-col space-y-1.5 text-xs font-black uppercase tracking-wider border-b border-slate-100 pb-3">
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl bg-cyan-50 text-cyan-900">Overview</a>
              <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-cyan-50 text-slate-800">Estimator</a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-cyan-50 text-slate-800">Services</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-cyan-50 text-slate-800">Pricing</a>
              <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl hover:bg-cyan-50 text-slate-800">Reviews</a>
            </div>
          )}

          {user ? (
            <div className="space-y-2 pt-1">
              <Link
                to={profile?.role === 'admin' ? "/admin" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-cyan-50 text-cyan-900 font-black text-xs uppercase flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                className="w-full py-3.5 px-4 rounded-xl bg-rose-50 text-rose-700 font-black text-xs uppercase flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl border border-slate-200 text-slate-900 text-center font-black text-xs uppercase"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 text-center font-black text-xs uppercase shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
