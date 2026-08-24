import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Wifi, 
  Smartphone, 
  Wallet, 
  History, 
  User, 
  Users, 
  Tag, 
  Shield,
  X
} from 'lucide-react';

export default function Sidebar({ role = 'user', mobileOpen, setMobileOpen }) {
  const isCustomer = role !== 'admin';

  const customerLinks = [
    { name: 'Home', path: '/dashboard', icon: Home, end: true },
    { name: 'Buy Data', path: '/dashboard/buy-data', icon: Wifi },
    { name: 'Buy Airtime', path: '/dashboard/buy-airtime', icon: Smartphone },
    { name: 'Fund Wallet', path: '/dashboard/fund-wallet', icon: Wallet },
    { name: 'Transactions', path: '/dashboard/transactions', icon: History },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: Home, end: true },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'All Transactions', path: '/admin/transactions', icon: History },
    { name: 'Pricing Manager', path: '/admin/pricing', icon: Tag },
  ];

  const links = isCustomer ? customerLinks : adminLinks;

  const content = (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-2xl text-slate-300 min-h-[calc(100vh-5rem)] border-r border-cyan-500/20 p-4 flex flex-col justify-between">
      <div>
        {/* Sidebar Header & Brand Logo */}
        <div className="px-2 py-2 mb-4 border-b border-cyan-500/20 pb-4">
          <div className="flex items-center justify-between">
            <img src="/logo.png" alt="GARKO DATA SUB" className="h-9 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(0,210,255,0.4)]" />
            {setMobileOpen && (
              <button 
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="mt-2 text-[10px] uppercase font-black tracking-widest text-brand-cyan flex items-center gap-1.5">
            {isCustomer ? <User className="w-3 h-3 text-brand-cyan" /> : <Shield className="w-3 h-3 text-brand-yellow" />}
            {isCustomer ? 'Customer Portal' : 'Admin Control Panel'}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 shadow-glow-cyan font-black'
                      : 'hover:bg-slate-900/80 text-slate-300 hover:text-brand-cyan border border-transparent hover:border-cyan-500/20'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner in Sidebar */}
      <div className="p-4 rounded-2xl glass-card text-center">
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Fast • Reliable • Affordable</p>
        <p className="text-xs font-black text-brand-cyan mt-0.5">support@garkodatasub.com</p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        {content}
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs flex-1">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
