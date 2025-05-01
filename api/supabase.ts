// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import Constants from 'expo-constants';

const SUPABASE_URL = Constants.extra?.SUPABASE_URL || {};
const SUPABASE_ANON_KEY = Constants.extra?.SUPABASE_ANON_KEY || '';
// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
