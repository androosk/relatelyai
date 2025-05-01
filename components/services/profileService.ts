import { supabase } from 'api/supabase';

// Define the type for Supabase user
interface SupabaseUser {
  id: string;
  [key: string]: any;
}

// Define the Supabase response type
interface SupabaseResponse<T> {
  data: T | null;
  error: {
    code?: string;
    message: string;
    [key: string]: any;
  } | null;
}

interface Profile {
  id: string;
  updated_at: Date;
  [key: string]: any; // Additional profile fields
}

interface ProfileUpdates {
  [key: string]: any;
}

export const profileService = {
  // Get current user's profile
  async getProfile(): Promise<Profile> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    if (error) throw error;

    // Use type assertion with unknown first to avoid unsafe casting
    return data as unknown as Profile;
  },

  // Update current user's profile
  async updateProfile(updates: ProfileUpdates): Promise<Profile> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date(),
      })
      .eq('id', user.id)
      .select();

    if (error) throw error;

    // Handle array or single result properly
    return (Array.isArray(data) ? data[0] : data) as unknown as Profile;
  },
};
