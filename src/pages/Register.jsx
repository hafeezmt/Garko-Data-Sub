import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { signUpUser, getProfile } from '../lib/supabase';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-900">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link to="/" className="inline-flex items-center space-x-3 group mb-4">
          <img src="/logo.png" alt="GARKO DATA SUB" className="h-16 w-auto object-contain mx-auto filter drop-shadow-[0_2px_8px_rgba(0,150,225,0.25)]" />
        </Link>
        <h2 className="text-2xl font-black text-slate-950 tracking-tight">Create your reseller account</h2>
        <p className="mt-2 text-xs text-slate-600 font-bold">
          Already have an account?{' '}
          <Link to="/login" className="font-black text-cyan-700 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-card-light py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-cyan-200/80">
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-cyan-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-2.5 glass-input-light rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
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
                  className="w-full pl-11 pr-4 py-2.5 glass-input-light rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-cyan-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08012345678"
                  className="w-full pl-11 pr-4 py-2.5 glass-input-light rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-cyan-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-4 py-2.5 glass-input-light rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
}
