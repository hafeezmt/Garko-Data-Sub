import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { signUpUser, getProfile } from '../lib/supabase';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function Register({ setSession, setProfile }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const data = await signUpUser({ email, password, fullName, phone });
      if (data?.session) {
        setSession(data.session);
        const userProfile = await getProfile(data.user.id);
        if (setProfile) setProfile(userProfile);
        toast.success('Registration successful! Welcome to GARKO DATA SUB.');
        navigate('/dashboard');
      } else {
        toast.success('Registration successful! Please check your email to confirm registration or sign in.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden text-slate-900 selection:bg-emerald-400 selection:text-slate-950">
      
      {/* Expanded Floating Pill Glass Navbar */}
      <Navbar />

      {/* Background Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center py-10 sm:px-6 lg:px-8 z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-card-light text-emerald-900 text-xs font-black uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500 fill-current animate-pulse" />
            Instant Reseller Registration
          </div>

          <h2 className="text-3xl font-black text-slate-950 tracking-tight">Create Free Account</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-bold">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-emerald-600 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="glass-card-light py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-emerald-200/80 space-y-4">
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 glass-input-unified rounded-2xl text-sm font-bold placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 glass-input-unified rounded-2xl text-sm font-bold placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08012345678"
                    className="w-full pl-11 pr-4 py-3 glass-input-unified rounded-2xl text-sm font-bold placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-4 py-3 glass-input-unified rounded-2xl text-sm font-bold placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 px-4 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>

            </form>

            <div className="pt-2 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 font-bold flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Instant Access • 100% Automated Delivery
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
