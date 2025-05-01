import { supabase } from 'api/supabase';

// Re-use these types from profileService.ts in a real app, but define here for completeness
interface SupabaseUser {
  id: string;
  [key: string]: any;
}

interface SupabaseResponse<T> {
  data: T | null;
  error: {
    code?: string;
    message: string;
    [key: string]: any;
  } | null;
}

interface QuizResult {
  id: string;
  user_id: string;
  score: number;
  assessment: string;
  recommendation: string;
  answers: Record<string, any>;
  created_at: string;
  [key: string]: any; // Additional quiz fields
}

export const quizService = {
  // Save quiz results
  async saveQuizResult(
    score: number,
    assessment: string,
    recommendation: string,
    answers: Record<string, any>
  ): Promise<QuizResult> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        user_id: user.id,
        score,
        assessment,
        recommendation,
        answers,
      })
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error('Failed to save quiz result');
    }

    return data[0] as unknown as QuizResult;
  },

  // Get quiz history
  async getQuizHistory(): Promise<QuizResult[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []) as unknown as QuizResult[];
  },

  // Get latest quiz result
  async getLatestQuizResult(): Promise<QuizResult | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is fine
      throw error;
    }

    return data ? (data as unknown as QuizResult) : null;
  },
};
