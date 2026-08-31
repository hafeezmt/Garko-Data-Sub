import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  HelpCircle,
  ChevronDown,
  Calculator,
  ShoppingCart
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getDataPrices } from '../lib/supabase';

// Default Data Plans for instant rendering & estimator widget
const ESTIMATOR_DATA = {
  mtn: [
    { id: 'mtn-500mb', name: 'MTN 500MB SME (30 Days)', price: 160 },
    { id: 'mtn-1gb', name: 'MTN 1GB SME (30 Days)', price: 290 },
    { id: 'mtn-2gb', name: 'MTN 2GB SME (30 Days)', price: 580 },
    { id: 'mtn-3gb', name: 'MTN 3GB SME (30 Days)', price: 870 },
    { id: 'mtn-5gb', name: 'MTN 5GB SME (30 Days)', price: 1450 },
  ],
  airtel: [
    { id: 'airtel-500mb', name: 'Airtel 500MB Direct (30 Days)', price: 170 },
    { id: 'airtel-1gb', name: 'Airtel 1GB Direct (30 Days)', price: 320 },
    { id: 'airtel-2gb', name: 'Airtel 2GB Direct (30 Days)', price: 640 },
    { id: 'airtel-5gb', name: 'Airtel 5GB Direct (30 Days)', price: 1500 },
  ],
  glo: [
    { id: 'glo-1gb', name: 'Glo 1GB Special (30 Days)', price: 300 },
    { id: 'glo-2gb', name: 'Glo 2.5GB Special (30 Days)', price: 1000 },
  ],
  '9mobile': [
    { id: '9mobile-1gb', name: '9mobile 1.5GB (30 Days)', price: 500 },
  ]
};

export default function Landing({ user, profile }) {
  const navigate = useNavigate();
  const [dataPlans, setDataPlans] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Estimator Widget State
  const [estimatorNet, setEstimatorNet] = useState('mtn');
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1); // Default 1GB

  useEffect(() => {
    async function loadPrices() {
      try {
        const prices = await getDataPrices();
        if (prices && prices.length > 0) {
          setDataPlans(prices);
        } else {
          // Flat list from ESTIMATOR_DATA
          const flat = Object.values(ESTIMATOR_DATA).flat().map(p => ({
            id: p.id,
            network: p.id.split('-')[0],
            plan_name: p.name,
            selling_price: p.price
          }));
          setDataPlans(flat);
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

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const currentEstimatorPlans = ESTIMATOR_DATA[estimatorNet] || ESTIMATOR_DATA.mtn;
  const currentEstimatorPlan = currentEstimatorPlans[selectedPlanIndex] || currentEstimatorPlans[0];

  const handleBuyEstimatorPlan = () => {
    if (user) {
      navigate('/dashboard/buy-data', { state: { network: estimatorNet, planId: currentEstimatorPlan.id } });
    } else {
      navigate('/register');
    }
  };

  const networks = [
    { id: 'mtn', name: 'MTN Nigeria', color: 'from-amber-400 to-yellow-500', textColor: 'text-amber-950', border: 'border-amber-300', tagline: 'SME & Direct Bundles' },
    { id: 'airtel', name: 'Airtel Nigeria', color: 'from-rose-500 to-red-600', textColor: 'text-white', border: 'border-rose-300', tagline: 'CG & Direct Data' },
    { id: 'glo', name: 'Glo Nigeria', color: 'from-emerald-500 to-green-600', textColor: 'text-white', border: 'border-emerald-300', tagline: 'Super Fast GLO' },
    { id: '9mobile', name: '9mobile', color: 'from-green-600 to-teal-700', textColor: 'text-white', border: 'border-green-300', tagline: 'High-Speed 9mobile' },
  ];

  const faqs = [
    {
      q: 'How fast is data bundle delivery?',
      a: 'All transactions are automated and delivered within 5 seconds of confirmation.'
    },
    {
      q: 'How do I fund my wallet?',
      a: 'You can instantly fund your wallet using Paystack with your debit card, bank transfer, or USSD code.'
    },
    {
      q: 'What happens if a transaction fails?',
      a: 'Our automated system instantly refunds your wallet balance if carrier maintenance causes a transaction delay.'
    },
    {
      q: 'Can I resell data to make profits?',
      a: 'Yes! GARKO DATA SUB provides wholesale reseller rates so you can sell to your own clients at custom retail prices.'
    }
  ];

  const reviews = [
    {
      name: 'Ibrahim Musa',
      role: 'VTU Reseller, Kano',
      comment: 'GARKO DATA SUB delivers data in seconds! My customers never complain about delays.',
      rating: 5
    },
    {
      name: 'Chinedu Okeke',
      role: 'Student, Lagos',
      comment: 'Cheap MTN SME data bundles and instant Paystack funding. 100% reliable!',
      rating: 5
    },
    {
      name: 'Amina Bello',
      role: 'Business Owner, Abuja',
      comment: 'The wallet auto-refund feature gives me 100% peace of mind. Excellent VTU platform!',
      rating: 5
    }
  ];

  const filteredPlans = dataPlans.filter((plan) => 
    selectedNetwork === 'all' || (plan.network || '').toLowerCase() === selectedNetwork.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-400 selection:text-slate-950">
      
      {/* Floating Pill Glass Navbar */}
      <Navbar user={user} profile={profile} />

      {/* Hero Section (Futuristic Glass Cyber-Emerald) */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-32">
        
        {/* Background Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-emerald-500/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[650px] h-[650px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-badge-dark text-emerald-300 text-xs font-black uppercase tracking-wider shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Next-Gen VTU Automation Engine</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
                Ultra-Fast Data <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">At Reseller Prices.</span>
              </h1>

              {/* Description */}
              <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Instantly top up MTN, Airtel, Glo & 9mobile data bundles within 5 seconds. Managed with zero lag, instant auto-refunds, and high reseller margins.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 font-black text-base uppercase tracking-wider shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </Link>

                <a
                  href="#calculator"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-base transition-all text-center shadow-sm"
                >
                  Try Estimator
                </a>
              </div>

              {/* Guarantees */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300 font-extrabold">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Instant Delivery
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> Paystack Secured
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 fill-current" /> Auto-Refund System
                </span>
              </div>

            </div>

            {/* Right Side Interactive Instant Plan Estimator Widget */}
            <div id="calculator" className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="glass-card-dark rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden border border-emerald-500/30">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
                    <Calculator className="w-4 h-4" />
                    <span>Instant Plan Estimator</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                    Live Rates
                  </span>
                </div>

                {/* Network Selector Tabs */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Select Network</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['mtn', 'airtel', 'glo', '9mobile'].map((net) => (
                      <button
                        key={net}
                        onClick={() => { setEstimatorNet(net); setSelectedPlanIndex(0); }}
                        className={`py-2.5 rounded-xl font-black text-xs uppercase transition-all ${
                          estimatorNet === net
                            ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 border border-emerald-300 shadow-md scale-105'
                            : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-emerald-500/50'
                        }`}
                      >
                        {net}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan Dropdown */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Select Bundle Size</label>
                  <select
                    value={selectedPlanIndex}
                    onChange={(e) => setSelectedPlanIndex(Number(e.target.value))}
                    className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white font-extrabold text-xs focus:outline-none focus:border-emerald-400 transition-colors"
                  >
                    {currentEstimatorPlans.map((plan, idx) => (
                      <option key={plan.id} value={idx}>
                        {plan.name} — ₦{plan.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total Price Display */}
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Reseller Price</span>
                    <div className="text-3xl font-black text-emerald-400 mt-0.5">
                      ₦{currentEstimatorPlan.price.toLocaleString('en-NG')}
                    </div>
                  </div>
                  <button
                    onClick={handleBuyEstimatorPlan}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Floating Dark Emerald Metrics Card */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14">
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-emerald-500/30 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            
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

      {/* Infinite Logo Marquee Ticker Section */}
      <section className="py-12 bg-slate-900 overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            POWERING PAYMENTS ACROSS EVERY MAJOR NETWORK & BILLER
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee items-center justify-around space-x-12 opacity-80">
            <span className="text-xl font-black text-slate-200">MTN NIGERIA</span>
            <span className="text-xl font-black text-rose-400">AIRTEL</span>
            <span className="text-xl font-black text-emerald-400">GLO NIGERIA</span>
            <span className="text-xl font-black text-green-400">9MOBILE</span>
            <span className="text-xl font-black text-cyan-400">PAYSTACK</span>
            <span className="text-xl font-black text-indigo-400">AEDC ELECTRICITY</span>
            <span className="text-xl font-black text-teal-400">VTPASS GATEWAY</span>
            {/* Repeated for continuous infinite loop */}
            <span className="text-xl font-black text-slate-200">MTN NIGERIA</span>
            <span className="text-xl font-black text-rose-400">AIRTEL</span>
            <span className="text-xl font-black text-emerald-400">GLO NIGERIA</span>
            <span className="text-xl font-black text-green-400">9MOBILE</span>
            <span className="text-xl font-black text-cyan-400">PAYSTACK</span>
          </div>
        </div>
      </section>

      {/* How It Works 3-Step Section */}
      <section id="how-it-works" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">How It Works in 3 Steps</h2>
            <p className="text-slate-400 text-sm font-semibold">Getting cheap data and paying bills takes less than 2 minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl glass-card-dark text-center space-y-4 border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-2xl font-black border border-emerald-500/30">
                1
              </div>
              <h3 className="text-xl font-black text-white">Create Free Account</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Sign up in 30 seconds with your email and phone number to access reseller rates instantly.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-card-dark text-center space-y-4 border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 mx-auto flex items-center justify-center text-2xl font-black border border-teal-500/30">
                2
              </div>
              <h3 className="text-xl font-black text-white">Fund Your Wallet</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Add money to your secure wallet using Paystack card payments, bank transfer, or USSD code.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-card-dark text-center space-y-4 border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center text-2xl font-black border border-cyan-500/30">
                3
              </div>
              <h3 className="text-xl font-black text-white">Buy Data & Bills</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Select your preferred data bundle or utility bill and receive automated delivery in 5 seconds!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section id="pricing" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Reseller Rates</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Data Bundle Pricing</h2>
            <p className="text-slate-400 text-sm font-semibold">Filter by telecom carrier to view live wholesale data plans.</p>
          </div>

          {/* Network Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedNetwork('all')}
              className={`px-4 py-1.5 rounded-full text-[11px] font-black transition-all ${
                selectedNetwork === 'all'
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-emerald-500/50'
              }`}
            >
              All Networks
            </button>
            {networks.map((net) => (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net.id)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase transition-all ${
                  selectedNetwork === net.id
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-emerald-500/50'
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
                className="bg-slate-950/90 rounded-3xl p-6 border border-emerald-500/30 shadow-md hover:border-emerald-400 transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black bg-slate-900 text-emerald-300 border border-emerald-500/30">
                    {plan.network}
                  </span>
                  <h4 className="font-extrabold text-white text-base">{plan.plan_name}</h4>
                  <p className="text-xs text-slate-400 font-semibold">Validity: 30 Days</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-emerald-400">
                    ₦{parseFloat(plan.selling_price || 0).toLocaleString('en-NG')}
                  </div>
                  <Link
                    to={user ? "/dashboard/buy-data" : "/register"}
                    className="inline-block mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 text-xs font-black hover:scale-105 transition-transform shadow-sm"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Trusted by 50,000+ Users</h2>
            <p className="text-slate-400 text-sm font-semibold">See what reseller partners and individual users say about us.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, i) => (
              <div key={i} className="p-8 rounded-3xl glass-card-dark space-y-4 border border-slate-800">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic font-medium leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="pt-2 border-t border-slate-800">
                  <h4 className="font-extrabold text-white text-sm">{rev.name}</h4>
                  <p className="text-xs text-emerald-400 font-semibold">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="GARKO DATA SUB" className="h-10 w-auto object-contain" />
              <span className="text-white font-black text-sm">GARKO DATA SUB</span>
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              FAST | RELIABLE | AFFORDABLE — Stay Connected, Always.
            </div>
          </div>

          <div className="pt-6 text-center text-xs text-slate-600 font-bold">
            &copy; {new Date().getFullYear()} GARKO DATA SUB. All rights reserved. Built with React & Supabase.
          </div>
        </div>
      </footer>

      {/* Floating Scroll-To-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-xl flex items-center justify-center transition-all hover:scale-110"
          title="Back to top"
        >
          <ChevronUp className="w-6 h-6 stroke-[3]" />
        </button>
      )}

    </div>
  );
}
