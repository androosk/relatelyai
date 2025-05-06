import { supabase } from 'api/supabase';
export interface Checkin {
  id: string;
  user_id: string;
  mood_score: number;
  created_at: string | null; // Changed to allow null
  notes?: string | null;
  tags?: string[] | null;
}
interface CheckinUpdates {
  mood_score?: number;
  notes?: string;
  tags?: string[];
  [key: string]: any;
}

interface MoodDataPoint {
  date: string;
  average: number;
}

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

export const checkinService = {
  // Create a new check-in
  async createCheckin(moodScore: number, notes: string, tags: string[] = []): Promise<Checkin> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('checkins')
      .insert({
        user_id: user.id,
        mood_score: moodScore,
        notes,
        tags,
      })
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error('Failed to create check-in');
    }

    return data[0] as unknown as Checkin;
  },

  // Get check-in history
  async getCheckinHistory(limit: number = 30, page: number = 0): Promise<Checkin[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (error) {
      console.error('Error fetching check-in history:', error);
    }

    return (data || []) as unknown as Checkin[];
  },

  // Get check-in analytics (average mood over time periods)
  async getCheckinAnalytics(
    timeframe: '7days' | '30days' | '90days' = '30days'
  ): Promise<MoodDataPoint[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    let dateFilter: string;
    const now = new Date();

    if (timeframe === '7days') {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      dateFilter = sevenDaysAgo.toISOString();
    } else if (timeframe === '30days') {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      dateFilter = thirtyDaysAgo.toISOString();
    } else {
      const ninetyDaysAgo = new Date(now);
      ninetyDaysAgo.setDate(now.getDate() - 90);
      dateFilter = ninetyDaysAgo.toISOString();
    }

    const { data, error } = await supabase
      .from('checkins')
      .select('created_at, mood_score')
      .eq('user_id', user.id)
      .gte('created_at', dateFilter)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Process the data to get average mood scores by day/week
    interface MoodAccumulator {
      [key: string]: {
        count: number;
        total: number;
      };
    }

    const moodData = data.reduce((acc: MoodAccumulator, item) => {
      const date = new Date(item.created_at || '');
      const day = date.toISOString().split('T')[0];

      if (!acc[day]) {
        acc[day] = {
          count: 0,
          total: 0,
        };
      }

      acc[day].count += 1;
      acc[day].total += item.mood_score;

      return acc;
    }, {} as MoodAccumulator);

    // Calculate averages and format for visualization
    const formattedData: MoodDataPoint[] = Object.keys(moodData).map((day) => ({
      date: day,
      average: moodData[day].total / moodData[day].count,
    }));

    return formattedData;
  },

  // Update a check-in
  async updateCheckin(id: string, updates: CheckinUpdates): Promise<Checkin> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('checkins')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id) // Make sure the user owns this check-in
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error('Check-in not found or update failed');
    }

    return data[0] as unknown as Checkin;
  },

  // Delete a check-in
  async deleteCheckin(id: string): Promise<boolean> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { error } = await supabase.from('checkins').delete().eq('id', id).eq('user_id', user.id); // Make sure the user owns this check-in

    if (error) throw error;

    return true;
  },
};
