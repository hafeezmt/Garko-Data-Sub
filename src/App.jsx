import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase, getProfile } from './lib/supabase';

// Layout Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import BuyData from './pages/customer/BuyData';
import BuyAirtime from './pages/customer/BuyAirtime';
import FundWallet from './pages/customer/FundWallet';
import CustomerTransactions from './pages/customer/Transactions';
import CustomerProfile from './pages/customer/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminPricing from './pages/admin/AdminPricing';

import { Menu, Loader2 } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const fetchUserProfile = async (user) => {
    if (!user) {
      setProfile(null);
      return;
    }
    try {
      const p = await getProfile(user.id);
      setProfile(p);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (session?.user) {
      await fetchUserProfile(session.user);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-brand-accent" />
        <p className="text-sm font-bold tracking-widest uppercase text-slate-400">Loading GARKO DATA SUB...</p>
      </div>
    );
  }

  const user = session?.user || null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing user={user} profile={profile} />} />

        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to={profile?.role === 'admin' ? '/admin' : '/dashboard'} replace />
            ) : (
              <Login setSession={setSession} setProfile={setProfile} />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register setSession={setSession} setProfile={setProfile} />
            )
          } 
        />

        {/* Protected Customer Dashboard Area */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardLayout role="user" profile={profile} user={user} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<CustomerDashboard user={user} profile={profile} refreshProfile={refreshProfile} />} />
          <Route path="buy-data" element={<BuyData user={user} profile={profile} refreshProfile={refreshProfile} />} />
          <Route path="buy-airtime" element={<BuyAirtime user={user} profile={profile} refreshProfile={refreshProfile} />} />
          <Route path="fund-wallet" element={<FundWallet user={user} profile={profile} refreshProfile={refreshProfile} />} />
          <Route path="transactions" element={<CustomerTransactions user={user} />} />
          <Route path="profile" element={<CustomerProfile user={user} profile={profile} refreshProfile={refreshProfile} />} />
        </Route>

        {/* Protected Admin Dashboard Area */}
        <Route
          path="/admin"
          element={
            user ? (
              profile?.role === 'admin' ? (
                <DashboardLayout role="admin" profile={profile} user={user} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="pricing" element={<AdminPricing />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Inner Layout Wrapper with Header & Sidebar
function DashboardLayout({ role, profile, user, mobileOpen, setMobileOpen }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar user={user} profile={profile} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar role={role} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Pane */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Mobile Top Bar Toggle */}
          <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900"
            >
              <Menu className="w-5 h-5 text-brand-accent" />
              <span>Menu Navigation</span>
            </button>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {role === 'admin' ? 'Admin Portal' : 'Dashboard'}
            </span>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
