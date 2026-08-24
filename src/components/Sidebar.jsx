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
    <aside className="w-64 bg-white/90 backdrop-blur-2xl text-slate-800 min-h-[calc(100vh-5rem)] border-r border-cyan-200/80 p-4 flex flex-col justify-between shadow-sm">
      <div>
        {/* Sidebar Header & Brand Logo */}
        <div className="px-2 py-2 mb-4 border-b border-cyan-200/80 pb-4">
          <div className="flex items-center justify-between">
            <img src="/logo.png" alt="GARKO DATA SUB" className="h-9 w-auto object-contain filter drop-shadow-[0_2px_6px_rgba(0,150,225,0.2)]" />
            {setMobileOpen && (
              <button 
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="mt-2 text-[10px] uppercase font-black tracking-widest text-cyan-600 flex items-center gap-1.5">
            {isCustomer ? <User className="w-3 h-3 text-cyan-600" /> : <Shield className="w-3 h-3 text-amber-600" />}
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
                      ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 text-slate-950 shadow-md font-black'
                      : 'hover:bg-slate-100 text-slate-700 hover:text-cyan-700 border border-transparent hover:border-cyan-200'
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
      <div className="p-4 rounded-2xl glass-card-light text-center">
        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Fast • Reliable • Affordable</p>
        <p className="text-xs font-black text-cyan-700 mt-0.5">support@garkodatasub.com</p>
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
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
