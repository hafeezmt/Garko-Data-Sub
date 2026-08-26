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
  ChevronRight,
  Headphones
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
    { id: 'mtn', name: 'MTN Nigeria', color: 'from-amber-400 to-yellow-500', textColor: 'text-amber-950', border: 'border-amber-300', tagline: 'SME & Direct Bundles' },
    { id: 'airtel', name: 'Airtel Nigeria', color: 'from-rose-500 to-red-600', textColor: 'text-white', border: 'border-rose-300', tagline: 'CG & Direct Data' },
    { id: 'glo', name: 'Glo Nigeria', color: 'from-emerald-500 to-green-600', textColor: 'text-white', border: 'border-emerald-300', tagline: 'Super Fast GLO' },
    { id: '9mobile', name: '9mobile', color: 'from-green-600 to-teal-700', textColor: 'text-white', border: 'border-green-300', tagline: 'High-Speed 9mobile' },
  ];

  const filteredPlans = dataPlans.filter((plan) => 
    selectedNetwork === 'all' || (plan.network || '').toLowerCase() === selectedNetwork.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-cyan-400 selection:text-slate-950">
      
      {/* Floating Pill Glass Navbar */}
      <Navbar user={user} profile={profile} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-32">
        
        {/* Glowing Background Blur Orbs */}
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-light text-cyan-900 text-xs font-black uppercase tracking-widest shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-500 fill-current animate-pulse" />
                <span>Nigeria's #1 Automated VTU Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-950">
                Cheap Data & Airtime <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600">Delivered in 5 Seconds.</span>
              </h1>

              {/* Tagline */}
              <p className="text-slate-600 text-base sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-semibold">
                Buy MTN, Airtel, Glo & 9mobile data bundles at wholesale reseller prices. 100% automated, fast, and secure.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-base shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  <span>Create Reseller Account</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </Link>

                <a
                  href="#pricing"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-black text-base border border-slate-200 transition-all text-center shadow-sm hover:border-cyan-300"
                >
                  Explore Rates
                </a>
              </div>

              {/* Guarantees */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-700 font-extrabold">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> 100% Instant Delivery
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-600" /> Paystack Secured
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 fill-current" /> Auto-Refund Protection
                </span>
              </div>
            </div>

            {/* Right Card Widget Showcase */}
            <div className="lg:col-span-5 relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="glass-card-light rounded-3xl p-6 sm:p-8 shadow-2xl border border-cyan-200/80 space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
                    <div>
                      <div className="text-slate-950 font-black text-sm">GARKO DATA SUB</div>
                      <div className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Server Online
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-cyan-50 text-cyan-800 text-[11px] font-black rounded-full border border-cyan-200">
                    Reseller Rates
                  </span>
                </div>

                {/* Bundle Items */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 flex items-center justify-between shadow-sm hover:border-cyan-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 font-black flex items-center justify-center text-xs">
                        MTN
                      </div>
                      <div>
                        <div className="text-slate-950 font-extrabold text-xs sm:text-sm">1GB SME (30 Days)</div>
                        <div className="text-[11px] text-slate-500 font-semibold">Fast SME Topup</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-700 font-black text-base">₦290</div>
                      <div className="text-[10px] text-emerald-600 font-black uppercase">Instant</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 flex items-center justify-between shadow-sm hover:border-cyan-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center text-xs">
                        AIRTEL
                      </div>
                      <div>
                        <div className="text-slate-950 font-extrabold text-xs sm:text-sm">2GB Direct (30 Days)</div>
                        <div className="text-[11px] text-slate-500 font-semibold">Gifting & Direct</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-700 font-black text-base">₦640</div>
                      <div className="text-[10px] text-emerald-600 font-black uppercase">Instant</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 flex items-center justify-between shadow-sm hover:border-cyan-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                        GLO
                      </div>
                      <div>
                        <div className="text-slate-950 font-extrabold text-xs sm:text-sm">2.5GB Special (30 Days)</div>
                        <div className="text-[11px] text-slate-500 font-semibold">High-Speed Glo</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-700 font-black text-base">₦1,000</div>
                      <div className="text-[10px] text-emerald-600 font-black uppercase">Instant</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/register"
                    className="block w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 text-center font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] transition-transform"
                  >
                    Start Reselling Now
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="why-us" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-black text-cyan-600 uppercase tracking-widest">Why GARKO DATA SUB</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950">
              Built for Speed, Reliability & Profit
            </h2>
            <p className="text-slate-600 text-sm font-semibold">
              Enjoy automated VTU API infrastructure built for seamless transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl glass-card-light glass-card-light-hover">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-slate-950 mb-2">5-Second Delivery</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Direct automated connection to Nigerian telecom gateways ensures your data bundle is delivered within seconds.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-card-light glass-card-light-hover">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-slate-950 mb-2">Wholesale Reseller Prices</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Unlock cheap rates on SME & Direct data bundles to maximize your profit margin on every gigabyte sold.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-card-light glass-card-light-hover">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-slate-950 mb-2">Auto-Refund System</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                If a network transaction fails due to carrier maintenance, your wallet balance is refunded instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Networks Section */}
      <section id="networks" className="py-16 bg-slate-100/80 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-black text-cyan-700 uppercase tracking-widest">Telecom Coverage</span>
          <h2 className="text-3xl font-black text-slate-950 mt-1 mb-10">Supported Telecom Networks</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {networks.map((net) => (
              <div
                key={net.id}
                className={`p-6 rounded-3xl glass-card-light border ${net.border} flex flex-col items-center justify-center space-y-3 hover:scale-105 transition-transform shadow-md`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${net.color} ${net.textColor} font-black text-lg flex items-center justify-center shadow-md`}>
                  {net.id.toUpperCase()}
                </div>
                <div className="text-center">
                  <h4 className="font-extrabold text-slate-950 text-base">{net.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-1">{net.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black text-cyan-600 uppercase tracking-widest">Reseller Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950">Data Bundle Rate Card</h2>
            <p className="text-slate-600 text-sm font-semibold">Filter by telecom carrier to view live wholesale data plans.</p>
          </div>

          {/* Network Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setSelectedNetwork('all')}
              className={`px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                selectedNetwork === 'all'
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 shadow-md'
                  : 'bg-white text-slate-800 border border-slate-200 hover:border-cyan-300'
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
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 shadow-md'
                    : 'bg-white text-slate-800 border border-slate-200 hover:border-cyan-300'
                }`}
              >
                {net.id}
              </button>
            ))}
          </div>

          {/* Data Bundle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white/90 rounded-3xl p-6 border border-cyan-200/80 shadow-md hover:shadow-lg transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black bg-slate-100 text-slate-800 border border-slate-200">
                      {plan.network}
                    </span>
                    <h4 className="font-extrabold text-slate-950 text-base">{plan.plan_name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">Validity: 30 Days</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-cyan-700">
                      ₦{parseFloat(plan.selling_price || 0).toLocaleString('en-NG')}
                    </div>
                    <Link
                      to={user ? "/dashboard/buy-data" : "/register"}
                      className="inline-block mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 text-xs font-black hover:scale-105 transition-transform shadow-sm"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 font-bold">
                Loading live pricing table...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Support / Contact Section */}
      <section id="support" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-black text-cyan-600 uppercase tracking-widest">24/7 Support</span>
          <h2 className="text-3xl font-black text-slate-950">We Are Always Here to Help</h2>
          
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-sm font-extrabold text-slate-800">
            <div className="flex items-center gap-2 p-4 rounded-2xl glass-card-light">
              <Phone className="w-5 h-5 text-cyan-600" />
              <span>+234 800 000 0000</span>
            </div>
            <div className="flex items-center gap-2 p-4 rounded-2xl glass-card-light">
              <Mail className="w-5 h-5 text-cyan-600" />
              <span>support@garkodatasub.com</span>
            </div>
            <div className="flex items-center gap-2 p-4 rounded-2xl glass-card-light">
              <MapPin className="w-5 h-5 text-cyan-600" />
              <span>Abuja, Nigeria</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
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

    </div>
  );
}
