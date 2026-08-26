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
  Sparkles,
  Award,
  Clock,
  ChevronUp,
  Headphones,
  Smartphone,
  Tv,
  CheckCircle2,
  Lock,
  Star,
  Users,
  Shield,
  Layers,
  HelpCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getDataPrices } from '../lib/supabase';

// High-quality default plans to render instantly
const DEFAULT_PLANS = [
  { id: 'mtn-500mb', network: 'mtn', plan_name: 'MTN 500MB SME', selling_price: 160 },
  { id: 'mtn-1gb', network: 'mtn', plan_name: 'MTN 1GB SME', selling_price: 290 },
  { id: 'mtn-2gb', network: 'mtn', plan_name: 'MTN 2GB SME', selling_price: 580 },
  { id: 'mtn-3gb', network: 'mtn', plan_name: 'MTN 3GB SME', selling_price: 870 },
  { id: 'mtn-5gb', network: 'mtn', plan_name: 'MTN 5GB SME', selling_price: 1450 },
  { id: 'airtel-500mb', network: 'airtel', plan_name: 'Airtel 500MB Direct', selling_price: 170 },
  { id: 'airtel-1gb', network: 'airtel', plan_name: 'Airtel 1GB Direct', selling_price: 320 },
  { id: 'airtel-2gb', network: 'airtel', plan_name: 'Airtel 2GB Direct', selling_price: 640 },
  { id: 'airtel-5gb', network: 'airtel', plan_name: 'Airtel 5GB Direct', selling_price: 1500 },
  { id: 'glo-1gb', network: 'glo', plan_name: 'Glo 1GB Special', selling_price: 300 },
  { id: 'glo-2gb', network: 'glo', plan_name: 'Glo 2.5GB Special', selling_price: 1000 },
  { id: '9mobile-1gb', network: '9mobile', plan_name: '9mobile 1.5GB', selling_price: 500 },
];

export default function Landing({ user, profile }) {
  const [dataPlans, setDataPlans] = useState(DEFAULT_PLANS);
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    async function loadPrices() {
      try {
        const prices = await getDataPrices();
        if (prices && prices.length > 0) {
          setDataPlans(prices);
        }
      } catch (err) {
        console.error('Error loading pricing table:', err);
      }
    }
    loadPrices();

    const handleScroll = () => {
      if (window.scrollY > 300) setShowScrollTop(true);
      else setShowScrollTop(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const networks = [
    { id: 'mtn', name: 'MTN Nigeria', color: 'from-amber-400 to-yellow-500', textColor: 'text-amber-950', border: 'border-amber-300', tagline: 'SME & Direct Bundles' },
    { id: 'airtel', name: 'Airtel Nigeria', color: 'from-rose-500 to-red-600', textColor: 'text-white', border: 'border-rose-300', tagline: 'CG & Direct Data' },
    { id: 'glo', name: 'Glo Nigeria', color: 'from-emerald-500 to-green-600', textColor: 'text-white', border: 'border-emerald-300', tagline: 'Super Fast GLO' },
    { id: '9mobile', name: '9mobile', color: 'from-green-600 to-teal-700', textColor: 'text-white', border: 'border-green-300', tagline: 'High-Speed 9mobile' },
  ];

  const filteredPlans = dataPlans.filter((plan) => 
    selectedNetwork === 'all' || (plan.network || '').toLowerCase() === selectedNetwork.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-400 selection:text-slate-950">
      
      {/* Floating Pill Glass Navbar */}
      <Navbar user={user} profile={profile} />

      {/* Hero Section (Replicating JMB Data Sub Animated Hero) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-teal-900 to-slate-900 text-white pt-10 pb-20 lg:pt-16 lg:pb-32">
        
        {/* Background Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-badge-dark text-emerald-300 text-xs font-black uppercase tracking-wider shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Instant top-ups on all networks, 24/7</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
                Recharge, pay bills & earn — <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">the smart way with GARKO DATA SUB</span>
              </h1>

              {/* Description */}
              <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Buy airtime and data, pay electricity and TV bills, print recharge cards and grow a VTU business — all from one lightning-fast, bank-grade secure wallet.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </Link>

                <a
                  href="#pricing"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black text-base border border-white/20 transition-all text-center shadow-sm"
                >
                  View Data Pricing
                </a>
              </div>

              {/* Guarantees */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300 font-extrabold">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Automated Gateway
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-300" /> Bank-Grade Security
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 fill-current" /> Instant Auto-Refund
                </span>
              </div>

            </div>

            {/* Right Side Showcase with Floating Animated Badges */}
            <div className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none">
              
              {/* Central Glass Showcase Card */}
              <div className="relative rounded-3xl p-8 glass-card-dark shadow-2xl border border-emerald-500/30 text-white space-y-6">
                
                {/* Floating Badge 1 (Top Left Floating Badge) */}
                <div className="absolute -top-6 -left-4 sm:-left-8 glass-badge-dark px-4 py-3 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center space-x-3 animate-float">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Data Delivered</div>
                    <div className="text-[10px] text-emerald-300 font-semibold">MTN 10GB • Instant</div>
                  </div>
                </div>

                {/* Floating Badge 2 (Bottom Right Floating Badge) */}
                <div className="absolute -bottom-6 -right-4 sm:-right-8 glass-badge-dark px-4 py-3 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center space-x-3 animate-float-delayed">
                  <div className="w-9 h-9 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-black">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Payment Successful</div>
                    <div className="text-[10px] text-emerald-300 font-semibold">Wallet • Secured</div>
                  </div>
                </div>

                {/* Header inside Card */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
                    <div>
                      <div className="text-white font-black text-sm">GARKO DATA SUB</div>
                      <div className="text-[11px] text-emerald-400 font-extrabold">Instant VTU Portal</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-black rounded-full border border-emerald-400/30">
                    Reseller Rates
                  </span>
                </div>

                {/* Bundle Showcase Items */}
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 font-black flex items-center justify-center text-xs">
                        MTN
                      </div>
                      <div>
                        <div className="text-white font-extrabold text-xs sm:text-sm">1GB SME (30 Days)</div>
                        <div className="text-[11px] text-slate-400">Fast SME Topup</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-black text-base">₦290</div>
                      <div className="text-[10px] text-emerald-300 font-extrabold uppercase">Instant</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center text-xs">
                        AIRTEL
                      </div>
                      <div>
                        <div className="text-white font-extrabold text-xs sm:text-sm">2GB Direct (30 Days)</div>
                        <div className="text-[11px] text-slate-400">Gifting & Direct</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-black text-base">₦640</div>
                      <div className="text-[10px] text-emerald-300 font-extrabold uppercase">Instant</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/register"
                    className="block w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 text-slate-950 text-center font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] transition-transform"
                  >
                    Start Reselling Now
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Floating Dark Emerald Metrics Card (Replicating JMB Data Sub 4-Column Bar) */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14">
        <div className="rounded-3xl bg-emerald-950 text-white p-6 sm:p-10 border border-emerald-500/30 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-800/60">
            
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400">99.9%</div>
              <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1">Uptime & reliability</p>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400">500K+</div>
              <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1">Transactions processed</p>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400">20+</div>
              <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1">Services in one place</p>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400">24/7</div>
              <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1">Customer support</p>
            </div>

          </div>
        </div>
      </section>

      {/* Infinite Logo Marquee Ticker Section (Replicating JMB Data Sub Marquee) */}
      <section className="py-12 bg-white overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            POWERING PAYMENTS ACROSS EVERY MAJOR NETWORK & BILLER
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee items-center justify-around space-x-12 opacity-70 filter grayscale hover:grayscale-0 transition-all">
            <span className="text-xl font-black text-slate-800">MTN NIGERIA</span>
            <span className="text-xl font-black text-rose-700">AIRTEL</span>
            <span className="text-xl font-black text-emerald-700">GLO NIGERIA</span>
            <span className="text-xl font-black text-green-700">9MOBILE</span>
            <span className="text-xl font-black text-blue-700">PAYSTACK</span>
            <span className="text-xl font-black text-indigo-700">AEDC ELECTRICITY</span>
            <span className="text-xl font-black text-cyan-700">VTPASS GATEWAY</span>
            {/* Repeated for continuous infinite loop */}
            <span className="text-xl font-black text-slate-800">MTN NIGERIA</span>
            <span className="text-xl font-black text-rose-700">AIRTEL</span>
            <span className="text-xl font-black text-emerald-700">GLO NIGERIA</span>
            <span className="text-xl font-black text-green-700">9MOBILE</span>
            <span className="text-xl font-black text-blue-700">PAYSTACK</span>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">All-in-One Services</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950">VTU Services & Utility Top-ups</h2>
            <p className="text-slate-600 text-sm font-semibold">Instant automated fulfillment for all major Nigerian telecommunications.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl glass-card-light glass-card-light-hover text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                <Wifi className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="font-extrabold text-slate-950 text-base">Cheap Data Bundles</h4>
              <p className="text-xs text-slate-500 font-medium">SME, CG, Gifting & Direct data plans.</p>
            </div>

            <div className="p-6 rounded-3xl glass-card-light glass-card-light-hover text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center">
                <Smartphone className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="font-extrabold text-slate-950 text-base">Airtime Top-Up</h4>
              <p className="text-xs text-slate-500 font-medium">Instant airtime recharge at 2% discount.</p>
            </div>

            <div className="p-6 rounded-3xl glass-card-light glass-card-light-hover text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 mx-auto flex items-center justify-center">
                <Tv className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="font-extrabold text-slate-950 text-base">Cable TV Subscriptions</h4>
              <p className="text-xs text-slate-500 font-medium">DSTV, GOTV & Startimes subscriptions.</p>
            </div>

            <div className="p-6 rounded-3xl glass-card-light glass-card-light-hover text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 mx-auto flex items-center justify-center">
                <Zap className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="font-extrabold text-slate-950 text-base">Electricity Tokens</h4>
              <p className="text-xs text-slate-500 font-medium">Prepaid & Postpaid meter token generation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section id="pricing" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Reseller Rates</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950">Data Bundle Pricing</h2>
            <p className="text-slate-600 text-sm font-semibold">Filter by telecom carrier to view live wholesale data plans.</p>
          </div>

          {/* Network Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setSelectedNetwork('all')}
              className={`px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                selectedNetwork === 'all'
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 text-slate-950 shadow-md'
                  : 'bg-slate-100 text-slate-800 border border-slate-200 hover:border-emerald-300'
              }`}
            >
              All Networks
            </button>
            {networks.map((net) => (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net.id)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase transition-all ${
                  selectedNetwork === net.id
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 text-slate-950 shadow-md'
                    : 'bg-slate-100 text-slate-800 border border-slate-200 hover:border-emerald-300'
                }`}
              >
                {net.id}
              </button>
            ))}
          </div>

          {/* Data Bundle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white/90 rounded-3xl p-6 border border-emerald-200/80 shadow-md hover:shadow-lg transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black bg-slate-100 text-slate-800 border border-slate-200">
                    {plan.network}
                  </span>
                  <h4 className="font-extrabold text-slate-950 text-base">{plan.plan_name}</h4>
                  <p className="text-xs text-slate-500 font-semibold">Validity: 30 Days</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-emerald-700">
                    ₦{parseFloat(plan.selling_price || 0).toLocaleString('en-NG')}
                  </div>
                  <Link
                    to={user ? "/dashboard/buy-data" : "/register"}
                    className="inline-block mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 text-slate-950 text-xs font-black hover:scale-105 transition-transform shadow-sm"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="GARKO DATA SUB" className="h-10 w-auto object-contain" />
              <span className="text-white font-black text-sm">GARKO DATA SUB</span>
            </div>
            <div className="text-xs text-slate-400 font-semibold">
              FAST | RELIABLE | AFFORDABLE — Stay Connected, Always.
            </div>
          </div>

          <div className="pt-6 text-center text-xs text-slate-500 font-bold">
            &copy; {new Date().getFullYear()} GARKO DATA SUB. All rights reserved. Built with React & Supabase.
          </div>
        </div>
      </footer>

      {/* Floating Scroll-To-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl flex items-center justify-center transition-all hover:scale-110"
          title="Back to top"
        >
          <ChevronUp className="w-6 h-6 stroke-[3]" />
        </button>
      )}

    </div>
  );
}
