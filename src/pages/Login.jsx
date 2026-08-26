import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { signInUser, getProfile } from '../lib/supabase';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function Login({ setSession, setProfile }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    setLoading(true);
    try {
      const data = await signInUser({ email, password });
      if (data?.session) {
        setSession(data.session);
        const userProfile = await getProfile(data.user.id);
        if (setProfile) setProfile(userProfile);

        toast.success('Welcome back!');
        if (userProfile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden text-slate-900 selection:bg-cyan-400 selection:text-slate-950">
      
      {/* Floating Pill Header */}
      <Navbar />

      {/* Background Glow Orbs */}
      <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-cyan-400/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-blue-500/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-card-light text-cyan-800 text-[11px] font-black uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
            Reseller Portal Access
          </div>

          <h2 className="text-3xl font-black text-slate-950 tracking-tight">Sign In to Your Account</h2>
          <p className="mt-2 text-xs text-slate-600 font-extrabold">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-black text-cyan-700 hover:underline">
              Create a free reseller account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="glass-card-light py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-cyan-200/80 space-y-6">
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* Email Field */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-cyan-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 glass-input-light rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-cyan-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 glass-input-light rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-md shadow-cyan-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>

            </form>

            {/* Security Note */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500 font-extrabold flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-600" /> Protected by Supabase Auth Security
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
