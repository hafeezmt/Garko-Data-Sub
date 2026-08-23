# GARKO DATA SUB - Full VTU & Data Reselling Web Application

GARKO DATA SUB is a production-ready, full-stack Data Reselling and VTU (Virtual Top Up) web application built using **React**, **Tailwind CSS**, **Supabase**, **Paystack**, and **VTPass API**.

---

## Features

- **Public Landing Page**: Hero section, network availability, features summary, live reseller data pricing table, and footer.
- **Supabase Authentication**: User registration with auto-created customer profiles, email/password login, role-based protection (`user` vs `admin`).
- **Customer Dashboard**:
  - Wallet balance display and quick action cards.
  - **Buy Data**: Choose network (MTN, Airtel, Glo, 9mobile), pick data plan variation, enter phone number, instant automated wallet deduction & VTU delivery.
  - **Buy Airtime**: Enter amount & phone number, instant top-up.
  - **Fund Wallet**: Paystack Inline modal checkout (Card, Bank Transfer, USSD). Server-side payment verification automatically credits wallet.
  - **Transactions**: Full history with search & network/status filters.
  - **Profile Manager**: Update name, phone, change password.
- **Admin Dashboard (`/admin`)**:
  - **Overview**: System metrics (Total Users, Total Sales Count, Gross Revenue, VTPass Wallet Balance).
  - **User Management**: View all users, inspect balances, and manually credit user wallets.
  - **Transactions Monitor**: System-wide filterable transaction logs.
  - **Pricing Manager**: Set custom selling prices and profit markups per data plan.

---

## Tech Stack & Architecture

- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons + React Router DOM + React Hot Toast.
- **Backend & Database**: Supabase PostgreSQL + Auth + RLS Security Policies + Stored Stored Procedures (Atomic RPC wallet operations).
- **Payment Gateway**: Paystack Inline JavaScript SDK + Serverless verification endpoint (`/api/paystack/verify`).
- **VTU Provider**: VTPass API (Sandbox & Production endpoints proxied via `/api/vtpass/*`).

---

## Installation & Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Garko-Data-Sub
npm install
```

### 2. Environment Variables Setup
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

Fill in your configuration credentials:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# VTPass API Configuration
VTPASS_API_KEY=your_vtpass_api_key
VTPASS_PUBLIC_KEY=your_vtpass_public_key
VTPASS_SECRET_KEY=your_vtpass_secret_key
VTPASS_ENV=sandbox
```

---

## Supabase Database Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) project.
2. Navigate to **SQL Editor**.
3. Copy the contents of [`supabase_schema.sql`](file:///c:/Users/USER/Garko-Data-Sub/supabase_schema.sql) and execute the query.
4. This script will automatically create:
   - `profiles`, `transactions`, and `data_prices` tables with RLS policies.
   - Profile auto-creation trigger on user signup.
   - Stored RPC functions: `deduct_wallet_balance`, `refund_wallet_balance`, `credit_wallet_balance`.
   - Seed data for MTN, Airtel, Glo, and 9mobile data plans.

### Creating an Admin User
To make your account an Admin:
1. Register a user on the app or via Supabase Auth.
2. Run this SQL in your Supabase SQL editor:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'YOUR_USER_UUID';
```

---

## Running the Application

```bash
# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## Building for Production & Vercel Deployment

This project is structured for seamless deployment on **Vercel**:

```bash
# Test local production build
npm run build
```

### Deploying to Vercel:
1. Push project to GitHub/GitLab.
2. Import project in Vercel Dashboard.
3. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY`, `VTPASS_API_KEY`, `VTPASS_PUBLIC_KEY`, `VTPASS_SECRET_KEY`) under **Settings -> Environment Variables**.
4. Click **Deploy**. Vercel will automatically host the React app and API routes (`/api/*`).

---

## License & Support
Created for **GARKO DATA SUB**. For questions or API key setup assistance, contact support@garkodatasub.com.
