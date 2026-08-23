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
  DollarSign, 
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
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] border-r border-slate-800 p-4 flex flex-col justify-between">
      <div>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-3 py-2 mb-4 border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            {isCustomer ? <User className="w-3.5 h-3.5 text-brand-accent" /> : <Shield className="w-3.5 h-3.5 text-emerald-400" />}
            {isCustomer ? 'Customer Portal' : 'Admin Control Panel'}
          </span>
          {setMobileOpen && (
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-brand-accent text-brand-dark font-bold shadow-md'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
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
      <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-800 text-center">
        <p className="text-xs text-slate-400 font-medium">Need Help?</p>
        <p className="text-xs font-semibold text-brand-accent mt-0.5">support@garkodatasub.com</p>
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
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
