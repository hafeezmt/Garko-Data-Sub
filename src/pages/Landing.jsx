import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wifi, 
  Zap, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp,
  Smartphone,
  Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getDataPrices } from '../lib/supabase';

export default function Landing({ user, profile }) {
  const [dataPlans, setDataPlans] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('all');

  useEffect(() => {
    async function loadPrices() {
      try {
        const prices = await getDataPrices();
        setDataPlans(prices);
      } catch (err) {
        console.error('Error loading pricing table:', err);
      }
    }
    loadPrices();
  }, []);

  const networks = [
    { id: 'mtn', name: 'MTN Nigeria', color: 'from-amber-400 to-yellow-500', textColor: 'text-amber-950', border: 'border-amber-400', tagline: 'SME & Direct Data' },
    { id: 'airtel', name: 'Airtel Nigeria', color: 'from-rose-500 to-red-600', textColor: 'text-white', border: 'border-rose-500', tagline: 'CG & Direct Bundles' },
    { id: 'glo', name: 'Glo Nigeria', color: 'from-emerald-500 to-green-600', textColor: 'text-white', border: 'border-emerald-500', tagline: 'Super Fast GLO Data' },
    { id: '9mobile', name: '9mobile', color: 'from-green-600 to-teal-700', textColor: 'text-white', border: 'border-green-600', tagline: 'High-Speed 9mobile' },
  ];

  const filteredPlans = dataPlans.filter((plan) => 
    selectedNetwork === 'all' || (plan.network || '').toLowerCase() === selectedNetwork.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-brand-cyan selection:text-slate-950">
      <Navbar user={user} profile={profile} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-dark pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-cyan/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column Text */}
            <div className="text-center lg:text-left space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-navy/90 border border-cyan-500/40 text-brand-cyan text-xs font-black uppercase tracking-widest shadow-glow-cyan">
                <Zap className="w-4 h-4 text-brand-yellow fill-current" /> #1 Instant Data & VTU Provider
              </div>

              {/* Logo Presentation in Hero */}
              <div className="flex justify-center lg:justify-start">
                <img 
                  src="/logo.png" 
                  alt="GARKO DATA SUB" 
                  className="h-20 sm:h-28 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                />
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Buy Cheap Data & Airtime <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-cyan-300 to-brand-blue">Instantly</span>
              </h1>

              {/* Official Tagline */}
              <div className="inline-block p-3 rounded-2xl bg-brand-navy/60 border border-cyan-500/30 text-xs sm:text-sm font-extrabold tracking-wider text-slate-200">
                ⚡ FAST &nbsp;|&nbsp; 🛡️ RELIABLE &nbsp;|&nbsp; 📱 AFFORDABLE — <span className="text-brand-cyan">Stay Connected, Always.</span>
              </div>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Automated high-speed data bundles, airtime top-up, and bill payments at discounted wholesale reseller prices. Delivered in 5 seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-cyan-400 hover:to-blue-600 text-slate-950 font-black text-lg shadow-glow-cyan transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </Link>

                <a
                  href="#pricing"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-navy hover:bg-slate-800 text-white font-extrabold text-lg border border-cyan-500/30 transition-colors text-center"
                >
                  View Data Pricing
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1.5 text-brand-cyan">
                  <CheckCircle className="w-4 h-4 text-brand-cyan" /> 100% Automated Delivery
                </span>
                <span className="flex items-center gap-1.5 text-brand-yellow">
                  <CheckCircle className="w-4 h-4 text-brand-yellow" /> Paystack Secured
                </span>
              </div>
            </div>

            {/* Right Column Product Card */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative rounded-3xl bg-brand-navy/90 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center text-slate-950 font-black">
                      <Wifi className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-white font-extrabold text-sm">GARKO DATA SUB</div>
                      <div className="text-xs text-brand-cyan font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" /> Live Server Online
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-brand-yellow/10 text-brand-yellow text-xs font-black rounded-full border border-brand-yellow/30">
                    Reseller Rates
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 font-black flex items-center justify-center text-xs">
                        MTN
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">1GB SME Data</div>
                        <div className="text-xs text-slate-400">Valid for 30 Days</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-brand-cyan font-black text-lg">₦290</div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">Instant</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center text-xs">
                        AIRTEL
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">2GB Direct Bundle</div>
                        <div className="text-xs text-slate-400">Valid for 30 Days</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-brand-cyan font-black text-lg">₦640</div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">Instant</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                        GLO
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">2.5GB Special Data</div>
                        <div className="text-xs text-slate-400">Valid for 30 Days</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-brand-cyan font-black text-lg">₦1,000</div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">Instant</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                  <Link
                    to="/register"
                    className="block w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-cyan to-brand-blue hover:from-cyan-400 hover:to-blue-600 text-slate-950 font-black text-sm transition-colors shadow-glow-cyan"
                  >
                    Create Account & Fund Wallet
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-black text-brand-cyan uppercase tracking-widest">Why Choose Us</h2>
            <p className="text-3xl sm:text-4xl font-black text-white mt-2">
              Fast, Reliable & Extremely Affordable
            </p>
            <p className="text-slate-400 mt-3 text-base">
              Built on automated high-speed API connections to ensure your data and airtime arrive without delay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-brand-navy/60 border border-cyan-500/20 hover:border-brand-cyan transition-all hover:shadow-glow-cyan">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-brand-cyan flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Automated & Ultra Fast</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                All transactions are processed automatically in real-time. Receive your data or airtime within seconds.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-brand-navy/60 border border-cyan-500/20 hover:border-brand-cyan transition-all hover:shadow-glow-cyan">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-brand-yellow flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Cheap Wholesale Pricing</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Wholesale reseller prices on all data bundles. Save money on every gigabyte for personal use or resale profits.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-brand-navy/60 border border-cyan-500/20 hover:border-brand-cyan transition-all hover:shadow-glow-cyan">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">100% Secure & Reliable</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Secured by Supabase Auth and Paystack payment gateway. Automatic refund logic ensures zero loss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Networks Section */}
      <section className="py-16 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-black text-brand-cyan uppercase tracking-widest mb-2">All Major Carriers</h2>
          <p className="text-3xl font-black text-white mb-10">Supported Telecom Networks</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {networks.map((net) => (
              <div
                key={net.id}
                className={`p-6 rounded-2xl bg-brand-navy/80 border ${net.border} flex flex-col items-center justify-center space-y-3 hover:scale-105 transition-transform shadow-lg`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${net.color} ${net.textColor} font-black text-lg flex items-center justify-center shadow-md`}>
                  {net.id.toUpperCase()}
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-white text-base">{net.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{net.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section id="pricing" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-black text-brand-cyan uppercase tracking-widest">Reseller Pricing</h2>
            <p className="text-3xl sm:text-4xl font-black text-white mt-2">Data Bundle Rates</p>
            <p className="text-slate-400 mt-2 text-sm">Select your network to explore available high-speed data bundles.</p>
          </div>

          {/* Network Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setSelectedNetwork('all')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                selectedNetwork === 'all'
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 shadow-glow-cyan'
                  : 'bg-brand-navy text-slate-300 border border-slate-800 hover:border-cyan-500/30'
              }`}
            >
              All Networks
            </button>
            {networks.map((net) => (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                  selectedNetwork === net.id
                    ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 shadow-glow-cyan'
                    : 'bg-brand-navy text-slate-300 border border-slate-800 hover:border-cyan-500/30'
                }`}
              >
                {net.id}
              </button>
            ))}
          </div>

          {/* Data Bundle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-brand-navy/90 rounded-2xl p-6 border border-cyan-500/20 hover:border-brand-cyan shadow-sm hover:shadow-glow-cyan transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-black bg-slate-900 text-brand-cyan border border-cyan-500/30">
                      {plan.network}
                    </span>
                    <h4 className="font-extrabold text-white text-base">{plan.plan_name}</h4>
                    <p className="text-xs text-slate-400">Validity: 30 Days</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-brand-cyan">
                      ₦{parseFloat(plan.selling_price || 0).toLocaleString('en-NG')}
                    </div>
                    <Link
                      to={user ? "/dashboard/buy-data" : "/register"}
                      className="inline-block mt-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 text-xs font-black hover:scale-105 transition-transform"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 font-semibold">
                Loading live pricing table...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-slate-400 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            <div className="space-y-3 md:col-span-2">
              <img src="/logo.png" alt="GARKO DATA SUB" className="h-12 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,210,255,0.4)]" />
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-medium">
                Nigeria's premier VTU platform for cheap data bundles, airtime top-up, and instant bill payments. Fast, reliable, and affordable.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
              <ul className="space-y-2 text-xs font-medium">
                <li><Link to="/login" className="hover:text-brand-cyan transition-colors">Customer Login</Link></li>
                <li><Link to="/register" className="hover:text-brand-cyan transition-colors">Register Account</Link></li>
                <li><a href="#pricing" className="hover:text-brand-cyan transition-colors">Data Pricing</a></li>
                <li><Link to="/admin" className="hover:text-brand-cyan transition-colors">Admin Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Contact Support</h4>
              <ul className="space-y-2 text-xs font-medium">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-cyan" /> +234 800 000 0000</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-cyan" /> support@garkodatasub.com</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-cyan" /> Abuja, Nigeria</li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 font-bold">
            &copy; {new Date().getFullYear()} GARKO DATA SUB. All rights reserved. Built with React & Supabase.
          </div>
        </div>
      </footer>
    </div>
  );
}
