import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wifi, 
  Zap, 
  ShieldCheck, 
  Headphones, 
  CheckCircle, 
  Smartphone, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp 
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar user={user} profile={profile} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-dark text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column Text */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" /> #1 VTU & Data Vendor in Nigeria
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                GARKO <span className="text-brand-accent">DATA SUB</span>
              </h1>

              <p className="text-xl sm:text-2xl font-bold text-amber-300">
                Buy Cheap Data & Airtime Instantly
              </p>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Enjoy automated, high-speed data bundles, airtime VTU, and utility subscriptions at discounted reseller prices. Delivered in seconds, 24/7.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-lg shadow-xl shadow-brand-accent/20 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#pricing"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg border border-slate-700 transition-colors text-center"
                >
                  View Pricing
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Instant Automated Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> 100% Secure Payments
                </span>
              </div>
            </div>

            {/* Right Column Card Mockup */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center text-brand-dark font-bold">
                      <Wifi className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">GARKO DATA SUB</div>
                      <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Service Online
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
                    Reseller Rates
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
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
                      <div className="text-brand-accent font-black text-lg">₦290</div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">Instant</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
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
                      <div className="text-brand-accent font-black text-lg">₦640</div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">Instant</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
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
                      <div className="text-brand-accent font-black text-lg">₦1,000</div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">Instant</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                  <Link
                    to="/register"
                    className="block w-full py-3 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-extrabold text-sm transition-colors"
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
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold text-brand-accent uppercase tracking-widest">Why Choose Us</h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              Fast, Cheap & Extremely Reliable
            </p>
            <p className="text-slate-600 mt-3 text-base">
              Built on automated API integrations to ensure your data and airtime arrive on your line without delay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-brand-accent transition-all hover:shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Automated & Ultra Fast</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                All transactions are processed automatically in real-time. Receive your data or airtime within 5 seconds of confirmation.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-brand-accent transition-all hover:shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Unbeatable Cheap Rates</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enjoy wholesale reseller pricing on all data plans. Save money on every gigabyte for personal use or resale profits.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-brand-accent transition-all hover:shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">100% Reliable & Secure</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your wallet is secured with Supabase Auth & Paystack payment gateway. Automatic refund logic ensures zero money loss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Networks Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-2">All Networks Covered</h2>
          <p className="text-3xl font-black text-white mb-10">Supported Telecom Networks</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {networks.map((net) => (
              <div
                key={net.id}
                className={`p-6 rounded-2xl bg-slate-800/80 border ${net.border} flex flex-col items-center justify-center space-y-3 hover:scale-105 transition-transform`}
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
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-extrabold text-brand-accent uppercase tracking-widest">Transparent Rates</h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">Data Bundle Pricing</p>
            <p className="text-slate-600 mt-2 text-sm">Choose your preferred network to view available high-speed bundles.</p>
          </div>

          {/* Network Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setSelectedNetwork('all')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedNetwork === 'all'
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              All Networks
            </button>
            {networks.map((net) => (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                  selectedNetwork === net.id
                    ? 'bg-brand-accent text-brand-dark shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {net.id}
              </button>
            ))}
          </div>

          {/* Data Bundle Table Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold bg-slate-100 text-slate-700">
                      {plan.network}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{plan.plan_name}</h4>
                    <p className="text-xs text-slate-500">Validity: 30 Days</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-brand-dark">
                      ₦{parseFloat(plan.selling_price || 0).toLocaleString('en-NG')}
                    </div>
                    <Link
                      to={user ? "/dashboard/buy-data" : "/register"}
                      className="inline-block mt-2 px-3 py-1 rounded-lg bg-brand-accent text-brand-dark text-xs font-bold hover:bg-brand-accent-hover transition-colors"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500">
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
              <div className="flex items-center space-x-2 text-white font-black text-xl">
                <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-brand-dark">
                  <Wifi className="w-5 h-5" />
                </div>
                <span>GARKO <span className="text-brand-accent">DATA SUB</span></span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Nigeria's premier VTU platform for cheap data bundles, airtime top-up, and instant bill payments. Automated, fast, and secure.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-white transition-colors">Customer Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register Account</Link></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Data Pricing</a></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Contact Info</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-accent" /> +234 800 000 0000</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-accent" /> support@garkodatasub.com</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-accent" /> Abuja, Nigeria</li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} GARKO DATA SUB. All rights reserved. Built with React & Supabase.
          </div>
        </div>
      </footer>
    </div>
  );
}
