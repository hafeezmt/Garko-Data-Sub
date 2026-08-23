import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export async function signUpUser({ email, password, fullName, phone }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
        role: 'user'
      }
    }
  });

  if (error) throw error;

  // Ensure profile entry exists
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        full_name: fullName,
        phone: phone,
        role: 'user',
        wallet_balance: 0
      }, { onConflict: 'id' });

    if (profileError) {
      console.warn('Profile creation upsert note:', profileError.message);
    }
  }

  return data;
}

export async function signInUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching profile:', error);
  }
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserTransactions(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, profiles(full_name, phone)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getDataPrices() {
  const { data, error } = await supabase
    .from('data_prices')
    .select('*')
    .order('network', { ascending: true })
    .order('selling_price', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateDataPrice(id, updates) {
  const { data, error } = await supabase
    .from('data_prices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createDataPrice(priceData) {
  const { data, error } = await supabase
    .from('data_prices')
    .insert(priceData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDataPrice(id) {
  const { error } = await supabase
    .from('data_prices')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Atomic RPC calls
export async function deductWallet(userId, amount) {
  const { data, error } = await supabase.rpc('deduct_wallet_balance', {
    p_user_id: userId,
    p_amount: amount
  });

  if (error) {
    // Fallback manual check & update if RPC fails
    const profile = await getProfile(userId);
    if (!profile || (profile.wallet_balance || 0) < amount) {
      throw new Error('Insufficient wallet balance. Please fund your wallet.');
    }
    const newBal = (profile.wallet_balance || 0) - amount;
    await updateProfile(userId, { wallet_balance: newBal });
    return newBal;
  }
  return data;
}

export async function refundWallet(userId, amount) {
  const { data, error } = await supabase.rpc('refund_wallet_balance', {
    p_user_id: userId,
    p_amount: amount
  });

  if (error) {
    const profile = await getProfile(userId);
    if (profile) {
      const newBal = (profile.wallet_balance || 0) + amount;
      await updateProfile(userId, { wallet_balance: newBal });
      return newBal;
    }
  }
  return data;
}

export async function adminFundUserWallet(userId, amount) {
  const { data, error } = await supabase.rpc('credit_wallet_balance', {
    p_user_id: userId,
    p_amount: amount
  });

  if (error) {
    const profile = await getProfile(userId);
    if (profile) {
      const newBal = (profile.wallet_balance || 0) + amount;
      await updateProfile(userId, { wallet_balance: newBal });
      return newBal;
    }
    throw error;
  }
  return data;
}

export async function recordTransaction(txData) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(txData)
    .select()
    .single();

  if (error) throw error;
  return data;
}
