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
  Tag
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
    <header className="sticky top-3 sm:top-5 z-50 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Floating Pill Glass Navbar */}
      <nav className="glass-nav-pill rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img 
            src="/logo.png" 
            alt="GARKO DATA SUB" 
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_8px_rgba(0,150,225,0.25)]" 
          />
        </Link>

        {/* Center Navigation Links (Desktop) */}
        {isHome && (
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-black uppercase tracking-wider text-slate-700">
            <a 
              href="#pricing" 
              className="px-3.5 py-2 rounded-full hover:text-cyan-600 hover:bg-cyan-50/80 transition-all flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-cyan-600" />
              Data Rates
            </a>
            <a 
              href="#networks" 
              className="px-3.5 py-2 rounded-full hover:text-cyan-600 hover:bg-cyan-50/80 transition-all flex items-center gap-1.5"
            >
              <Wifi className="w-3.5 h-3.5 text-cyan-600" />
              Networks
            </a>
            <a 
              href="#why-us" 
              className="px-3.5 py-2 rounded-full hover:text-cyan-600 hover:bg-cyan-50/80 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Why Choose Us
            </a>
            <a 
              href="#support" 
              className="px-3.5 py-2 rounded-full hover:text-cyan-600 hover:bg-cyan-50/80 transition-all flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-cyan-600" />
              Support
            </a>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                to={profile?.role === 'admin' ? "/admin" : "/dashboard"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs transition-all border border-slate-200"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-600" />
                <span>{profile?.role === 'admin' ? "Admin Portal" : "Dashboard"}</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-slate-800 hover:text-cyan-600 font-black text-xs uppercase tracking-wider transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 p-5 rounded-3xl glass-nav-pill shadow-2xl border border-cyan-200/80 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {isHome && (
            <div className="flex flex-col space-y-2 text-xs font-black uppercase tracking-wider border-b border-slate-100 pb-3">
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-cyan-50 text-slate-800 flex items-center gap-2"
              >
                <Tag className="w-4 h-4 text-cyan-600" /> Data Rates
              </a>
              <a
                href="#networks"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-cyan-50 text-slate-800 flex items-center gap-2"
              >
                <Wifi className="w-4 h-4 text-cyan-600" /> Networks
              </a>
              <a
                href="#why-us"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-cyan-50 text-slate-800 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-600" /> Why Choose Us
              </a>
            </div>
          )}

          {user ? (
            <div className="space-y-2 pt-1">
              <Link
                to={profile?.role === 'admin' ? "/admin" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-cyan-50 text-cyan-900 font-extrabold text-xs flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                className="w-full py-3 px-4 rounded-xl bg-rose-50 text-rose-700 font-extrabold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-900 text-center font-black text-xs uppercase"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 text-center font-black text-xs uppercase shadow-md"
              >
                Get Started Now
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
